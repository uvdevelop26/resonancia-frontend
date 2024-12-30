/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,ts,jsx,tsx,html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#16365C',
        'primary-light': '#EDF1FD'
      },
      spacing: {
        '18': '4.7rem',
        '84': '22rem'
      },

      borderRadius: {
        '4xl': '1.8rem'
      },

      rotate: {
        '18': '18deg'
      },

      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      }

    },

    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.2rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      },

      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

    }

  },
  plugins: [],

}