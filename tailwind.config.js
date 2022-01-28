module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  mode: 'jit',
  theme: {
    fontFamily: {
      display: ['"Gochi Hand"', 'ui-serif', 'Georgia'],
      body: ['"Baloo Bhaijaan 2"', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      colors: {
        primary: '#5AC596',
        secondary: '#A7D937',
        tertiary: '#063225',
      },
      screens: {
        xs: { min: '550px' },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
