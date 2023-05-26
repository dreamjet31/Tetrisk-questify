/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandblack: "#1F2125",
        transparent: 'transparent',
        transparentwhite: "rgba(255, 255, 255, 0.4)",
        darkcharcoal: "#2F3336",
        borderwidget: "rgba(37, 51, 65, 0.5)",
        gray: {
          950: "#8899A6",
        },
        current: 'currentColor',
        'white': '#fff',
        'black': '#000',
        'grey': 'var(--grey-color)',
        'focus': 'var(--focus-color)',
        'focusbackground': 'var(--focusbackground-color)',
        'primary': 'var(--primary-color)',
        'lightprimary': 'var(--lightprimary-color)',
        'darkprimary': 'var(--darkprimary-color)',
        'secondary': 'var(--secondary-color)',
        'footer': 'var(--footer-color)',
        'content': '#cecece',
        'darkGreen': "#162724",
        // kisikbo5 wrote this
        'globalBgColor': '#131314',
        'semiSplitter' : '#1d1f1f',
        'panelBgColor': '#181818'
      }
    },
  },
  plugins: [],
}