export default {
  content: [
    './index.html',
    './src/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sun: '#f59e0b',
          navy: '#1e3a8a',
          teal: '#0f766e',
          gray: '#374151',
          light: '#ffffff', // ✅ used instead of 'white'
          dark: '#111827'   // ✅ used instead of 'black'
        }
      },
      fontFamily: {
        sans: ['BankFont'],
      }
    }
  },
  darkMode: 'class',
  plugins: []
};


