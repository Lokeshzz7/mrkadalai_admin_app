/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#fefff9',
        header: '#DADADA',
        nav: '#F0F5FA',
        theme: '#EBB22F',
        primary: '#5a595e',
        secondary: '#ffffff',
        inverse: '#ffffff',
        list: '#4d4d4d',
        table: "#646982",
        lables:'DADADA',
      },
    },
  },
  plugins: [],
}
