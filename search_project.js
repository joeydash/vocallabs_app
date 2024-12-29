import fs from 'fs';
import path from 'path';

// Function to search for text in a file asynchronously
const searchInFile = async (filePath, searchText) => {
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    
    const matchingLines = lines.filter(line => line.includes(searchText));
    
    if (matchingLines.length > 0) {
      console.log(`Found in file: ${filePath}`);
      matchingLines.forEach((line, index) => {
        console.log(`Line ${index + 1}: ${line}`);
      });
      console.log('---');
    }
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
  }
};

// Function to traverse a directory recursively asynchronously
const searchInDirectory = async (dirPath, searchText) => {
  try {
    const filesAndDirs = await fs.promises.readdir(dirPath);
    
    for (const fileOrDir of filesAndDirs) {
      const fullPath = path.join(dirPath, fileOrDir);
      const stats = await fs.promises.stat(fullPath);
      
      if (stats.isDirectory()) {
        // Recurse into subdirectory
        await searchInDirectory(fullPath, searchText);
      } else if (stats.isFile()) {
        // Search text within the file
        await searchInFile(fullPath, searchText);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }
};

// Example usage
const searchText = 'legalpwd123';  // Replace this with the text you want to search
const directoryPath = './src';   // Replace with your folder path

// Start searching from the directory
searchInDirectory(directoryPath, searchText);
