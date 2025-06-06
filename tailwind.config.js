/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#fefff9',          
        header: '#d9d9d9',      
        nav: '#f1f0f5',   
        theme:'#e8b336',      
        primary: '#5a595e',
        secondary: '#ffffff',
        inverse: '#ffffff',
        list:'#4d4d4d',
      },
    },
  },
  plugins: [],
}
