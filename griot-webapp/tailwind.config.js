const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: colors.orange[100],
      secondary: colors.lightBlue[800],
      gray: colors.blueGray,
      danger: colors.red[600],
      white: colors.white,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
