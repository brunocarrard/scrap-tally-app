/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: true,
    theme: {
      extend: {
        colors: {
          grey: 'rgb(37, 39, 46)',
          lightGrey: '#525767',
          formGrey: '#716e6e'
        },
        height: {
          tablet: '768px'
        },
        spacing: {
          'cel': '500px',
        },
        width: {
          '95': '96%'
        }
      },
    },
    plugins: [],
  }
  
  