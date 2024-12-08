const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./tabs/**/*.{html, js}",
    "./table/**/*.{html, js}",
    "./pagination/**/*.{html, js}",
    "./progress/**/*.{html, js}",
    "./dropdown/**/*.{html, js}",
    "./dropdown-context/**/*.{html, js}",
    "./input/**/*.{html, js}",
    "./checkbox/**/*.{html, js}",
    "./modal/**/*.{html, js}",
    "./tooltip/**/*.{html, js}",
    "./select/**/*.{html, js}",
    "./datepicker/**/*.{html, js}",
    "./chevron/**/*.{html, js}",
    "./notify/**/*.{html, js}",
    "./*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.violet,
        secondary: colors.gray,
        info: colors.blue,
        warn: colors.yellow,
        success: colors.green,
        danger: colors.red,
        dark: colors.neutral,
        light: colors.white,
        text: colors.gray,
      }
    },
  },
  plugins: [],
}

