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
        hero: "url('/images/bg.png')",
        caskChain: "url('/images/caskChainBg.png')",
        bg_owner: "url('/images/bg_owner.png')",
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-filters')],
}
