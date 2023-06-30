module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
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
        ron: "url('https://res.cloudinary.com/enalbis/image/upload/v1688029986/CaskChain/okbppmy3s0t45tnarrm0.jpg')",
        tequila:
          "url('https://res.cloudinary.com/enalbis/image/upload/v1688029986/CaskChain/sbxa6kvr9bj86lm1vxmu.jpg')",
        whiskey:
          "url('https://res.cloudinary.com/enalbis/image/upload/v1688029986/CaskChain/mceoyc9cd8ayyebwejw2.jpg')",
        brandy:
          "url('https://res.cloudinary.com/enalbis/image/upload/v1688029986/CaskChain/pr2daymucvmt5iz4q8nn.jpg')",
        hero: "url('https://res.cloudinary.com/enalbis/image/upload/v1681538253/CaskChain/wtqf3wuruba9zqpezbah.png')",
        header_1:
          "url('https://res.cloudinary.com/enalbis/image/upload/v1682948719/CaskChain/header/gvl80mkyiqfhpqaydvkw.png')",
        bg_owner:
          "url('https://res.cloudinary.com/enalbis/image/upload/v1681538336/CaskChain/vr0svpapyh5wv6580jyj.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-filters'),
    require('flowbite/plugin'),
  ],
}
