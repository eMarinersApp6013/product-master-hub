/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#020617',
          900: '#0B1120',
          800: '#0F172A',
          700: '#1E293B',
          600: '#334155',
        },
      },
    },
  },
  plugins: [],
}
