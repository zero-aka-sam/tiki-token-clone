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
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      babypink: {
        DEFAULT: '#FFC0CB',
      },
      pink: {
        light: '#ff7ce5',
        DEFAULT: '#ff49db',
        dark: '#ff16d1',
      },
      gray: {
        darkest: '#1f2d3d',
        dark: '#3c4858',
        DEFAULT: '#c0ccda',
        light: '#e0e6ed',
        lightest: '#f9fafc',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
