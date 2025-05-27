/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#1E3E62',
        text:"#f3f4f6",
        placeholder:"#a3b6dc",
        dark:"#0B192C",
        accent:"#FF6500",
        black:"#000000",
        white:"#F4F4F4"
      },
    },
  },
  plugins: [],
};
