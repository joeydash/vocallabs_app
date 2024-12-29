/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBEEFF',
          100: '#D8DDFF',
          200: '#B6BCFF',
          300: '#939BFF',
          400: '#717AFF',
          500: '#3F51B5',
          600: '#354497',
          700: '#2B3779',
          800: '#212A5B',
          900: '#171D3D',
        },
        brand: {
          primary: '#3F51B5',
          dark: '#1B1B1B',
          light: '#FFFFFF',
        },
      },
      backgroundColor: {
        dark: {
          primary: '#1B1B1B',
          secondary: '#2D2D2D',
          tertiary: '#3D3D3D',
        },
        light: {
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
          tertiary: '#EBEBEB',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
