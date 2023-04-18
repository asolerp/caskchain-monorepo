module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Gugi', 'sans-serif'],
    },
    backdropFilter: {
      none: 'none',
      blur: 'blur(20px)',
    },
    extend: {
      colors: {
        'black-light': '#1B1B1B',
        'cask-chain': '#CAFC01',
        neutral: '#A8A8A8',
      },
      fontFamily: {
        gugi: ['Gugi', 'sans-serif'],
        rale: ['Raleway', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        hero: "url('https://res.cloudinary.com/enalbis/image/upload/v1681538253/CaskChain/wtqf3wuruba9zqpezbah.png')",
        bg_owner:
          "url('https://res.cloudinary.com/enalbis/image/upload/v1681538336/CaskChain/vr0svpapyh5wv6580jyj.png')",
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-filters')],
}
