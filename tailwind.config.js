module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
    backgroundImage: theme => ({

         'hero-pattern': "url('https://media.discordapp.net/attachments/842155059999408181/862303850902847488/fondo.jpg')",

         'footer-texture': "url('/img/footer-texture.png')",
        })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
