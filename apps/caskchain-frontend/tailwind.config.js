module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
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
        rale: ['Raleway', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        ron: "url('https://res.cloudinary.com/caskchain/image/upload/v1688045361/CaskChain/NFT_Rum_Header.jpg')",
        tequila:
          "url('https://res.cloudinary.com/caskchain/image/upload/v1688045361/CaskChain/NFT_Tequila_Header.jpg')",
        whiskey:
          "url('https://res.cloudinary.com/caskchain/image/upload/v1688045361/CaskChain/NFT_Whiskey_Header.jpg')",
        brandy:
          "url('https://res.cloudinary.com/caskchain/image/upload/v1688045361/CaskChain/NFT_Brandy_Header.jpg')",
        hero: "url('https://res.cloudinary.com/caskchain/image/upload/v1708601989/CaskChain/hero_bg.png')",
        header_1:
          "url('https://res.cloudinary.com/caskchain/image/upload/v1713794031/CaskChain/Rectangle_57.png')",
        bg_owner:
          "url('https://res.cloudinary.com/caskchain/image/upload/v1708602359/CaskChain/liquid.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-filters'),
    require('flowbite/plugin'),
  ],
}
