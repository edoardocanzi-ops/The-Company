/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        osbg: '#0f172a',
        oswindow: '#1e293b',
        ostaskbar: '#020617',
        osaccent: '#38bdf8'
      }
    },
  },
  plugins: [],
}
