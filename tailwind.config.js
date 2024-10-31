/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/layout/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        customGray: '#2e3440',
        darkGray: '#242933',
        lightHeader: "#f2f4f8",
        lightGray: '#D6D6D6',
        blueText: '#88C0D0',
        trueWhite: '#FFFFFF',
        customPurple: '#B48EAD',
        lightGreen: '#A3BE8C',
        customOrange: '#D08770',
        tagGray: '#71797E',
        lightBlue: '#D7EAF5',
        lightOrange: '#F5E5DE',
        greenColor: '#009A63',
        customPink: "#F1E0ED",
        darkPink: "#a97bd1",
        customYellow: "#F3E8CF",
        darkBlue: "#5E81AC"

        
      },
      userSelect: ['none'],
    },
  },
  plugins: [
  ],
}
