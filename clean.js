// clean-unused-files.mjs

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { parse } from '@babel/parser';
import { createRequire } from 'module';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Create a require function for CommonJS modules
const require = createRequire(import.meta.url);

// Import CommonJS module
const traverse = require('@babel/traverse').default;

// Adjust the path to your tsconfig.json if necessary
const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
const tsconfig = fs.existsSync(tsconfigPath)
  ? JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
  : {};

// Set the source directory
const SRC_DIR = path.resolve(process.cwd(), 'src');

// Read path aliases from tsconfig.json
const aliasMappings =
  tsconfig.compilerOptions && tsconfig.compilerOptions.paths
    ? tsconfig.compilerOptions.paths
    : {};

// List of extensions to consider
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Function to recursively get all JS/JSX/TS/TSX files
function getAllFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, filesList);
    } else {
      if (extensions.includes(path.extname(file))) {
        filesList.push(fullPath);
      }
    }
  }
  return filesList;
}

// Function to resolve import paths to actual file paths
function resolveDependency(importPath, currentFileDir) {
  // Ignore non-JS imports (e.g., CSS, images)
  if (/\.(css|scss|svg|png|jpg|jpeg|gif)$/.test(importPath)) {
    // Ignore asset files
    return null;
  }
  const exts = extensions;

  // Handle module aliases
  for (const alias in aliasMappings) {
    const aliasPattern = alias.replace(/\/\*$/, '');
    if (importPath.startsWith(aliasPattern)) {
      const paths = aliasMappings[alias];
      for (const aliasPath of paths) {
        const relativePath = importPath.replace(aliasPattern, aliasPath.replace(/\/\*$/, ''));
        const fullPath = path.resolve(process.cwd(), relativePath);
        const resolvedPath = resolveFilePath(fullPath);
        if (resolvedPath) return resolvedPath;
      }
    }
  }

  if (importPath.startsWith('.')) {
    // Relative path
    const fullPath = path.resolve(currentFileDir, importPath);
    const resolvedPath = resolveFilePath(fullPath);
    if (resolvedPath) return resolvedPath;
  } else if (importPath.startsWith('/')) {
    // Absolute path from project root
    const fullPath = path.resolve(process.cwd(), importPath.slice(1));
    const resolvedPath = resolveFilePath(fullPath);
    if (resolvedPath) return resolvedPath;
  } else {
    // Likely a node_module, ignore
    return null;
  }
  // Not found
  return null;
}

// Helper function to resolve file paths considering extensions and index files
function resolveFilePath(fullPath) {
  // Check if the path directly points to a file
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fullPath;
  }
  // Try with extensions
  for (const ext of extensions) {
    const filePathWithExt = fullPath + ext;
    if (fs.existsSync(filePathWithExt) && fs.statSync(filePathWithExt).isFile()) {
      return filePathWithExt;
    }
  }
  // Check if it's a directory with an index file
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    for (const ext of extensions) {
      const indexPath = path.join(fullPath, `index${ext}`);
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
        return indexPath;
      }
    }
  }
  return null;
}

// Function to extract dependencies from a file
function getDependencies(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parse(content, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'dynamicImport',
        'classProperties',
        'decorators-legacy',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'nullishCoalescingOperator',
        'optionalChaining',
        'objectRestSpread',
        'topLevelAwait',
      ],
    });
  } catch (e) {
    console.error(`Error parsing ${filePath}:`, e.message);
    return [];
  }
  const dependencies = [];
  const currentFileDir = path.dirname(filePath);
  traverse(ast, {
    ImportDeclaration({ node }) {
      const importPath = node.source.value;
      const depPath = resolveDependency(importPath, currentFileDir);
      if (depPath) {
        dependencies.push(depPath);
      }
    },
    ExportNamedDeclaration({ node }) {
      if (node.source) {
        const importPath = node.source.value;
        const depPath = resolveDependency(importPath, currentFileDir);
        if (depPath) {
          dependencies.push(depPath);
        }
      }
    },
    ExportAllDeclaration({ node }) {
      if (node.source) {
        const importPath = node.source.value;
        const depPath = resolveDependency(importPath, currentFileDir);
        if (depPath) {
          dependencies.push(depPath);
        }
      }
    },
    CallExpression({ node }) {
      if (node.callee.type === 'Import') {
        const arg = node.arguments[0];
        if (arg && arg.type === 'StringLiteral') {
          const importPath = arg.value;
          const depPath = resolveDependency(importPath, currentFileDir);
          if (depPath) {
            dependencies.push(depPath);
          }
        }
      }
      // Handle require statements if any
      if (node.callee.name === 'require') {
        const arg = node.arguments[0];
        if (arg && arg.type === 'StringLiteral') {
          const importPath = arg.value;
          const depPath = resolveDependency(importPath, currentFileDir);
          if (depPath) {
            dependencies.push(depPath);
          }
        }
      }
    },
  });
  return dependencies;
}

// Function to find the entry point of the application
function findEntryPoint() {
  const entryFiles = [
    'index.js', 'index.jsx', 'index.ts', 'index.tsx',
    'App.js', 'App.jsx', 'App.ts', 'App.tsx',
    'main.js', 'main.jsx', 'main.ts', 'main.tsx',
  ];
  for (const entryFile of entryFiles) {
    const fullPath = path.join(SRC_DIR, entryFile);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  console.error('Could not find entry point. Please specify the entry point using --entry.');
  process.exit(1);
}

// Function to get used files and entry point directory
function getUsedFiles(entryFile, dependencyGraph) {
  const usedFiles = new Set();
  const stack = [entryFile];
  const entryDir = path.dirname(entryFile);

  while (stack.length > 0) {
    const currentFile = stack.pop();
    if (!usedFiles.has(currentFile)) {
      usedFiles.add(currentFile);
      const deps = dependencyGraph[currentFile] || [];
      deps.forEach((dep) => {
        if (!usedFiles.has(dep)) {
          stack.push(dep);
        }
      });
    }
  }

  // Return both used files and entry point directory
  return { usedFiles, entryDir };
}

// Main execution starts here
(async function main() {
  // Parse command-line arguments
  const argv = yargs(hideBin(process.argv))
    .option('entry', {
      alias: 'e',
      description: 'Specify the entry point file relative to src',
      type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

  let entryPoint;
  if (argv.entry) {
    entryPoint = path.resolve(SRC_DIR, argv.entry);
    if (!fs.existsSync(entryPoint)) {
      console.error(`The specified entry point "${argv.entry}" does not exist.`);
      process.exit(1);
    }
  } else {
    entryPoint = findEntryPoint();
  }

  // Step 1: Get all files
  const allFiles = getAllFiles(SRC_DIR);

  // Step 2: Build dependency graph
  const dependencyGraph = {};
  allFiles.forEach((file) => {
    const dependencies = getDependencies(file);
    dependencyGraph[file] = dependencies;
  });

  // Step 3: Get used files and entry directory
  const { usedFiles, entryDir } = getUsedFiles(entryPoint, dependencyGraph);

  // Step 4: Identify unused files, excluding entry point directory
  const unusedFiles = allFiles.filter((file) => {
    const isUsed = usedFiles.has(file);
    const isInEntryDir = path.dirname(file) === entryDir;
    return !isUsed && !isInEntryDir;
  });

  // Step 5: Process each unused file
  if (unusedFiles.length === 0) {
    console.log('No unused files found.');
    process.exit(0);
  } else {
    console.log('Processing unused files:');
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
  }

  for (const file of unusedFiles) {
    console.log(`Processing ${file}`);
    // Store the file content in memory
    const fileContent = fs.readFileSync(file, 'utf8');

    // Delete the file without asking confirmation
    fs.unlinkSync(file);
    console.log(`Deleted ${file}`);

    // Ask user if the code is working
    const answer = await askQuestion('Is the code working? (y/n): ');
    if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'no') {
      // Restore the file from memory
      fs.writeFileSync(file, fileContent, 'utf8');
      console.log(`Restored ${file}`);
    }
    // If the answer is 'yes', move on to the next file
  }

  rl.close();
})();
