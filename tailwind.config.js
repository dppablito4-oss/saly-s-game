/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cozy-brown': '#8B5A2B',
        'cozy-cream': '#F5F5DC',
        'night-blue': '#0A0F24',
        'rain-blue': '#4A5B7C'
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'handwriting': ['Caveat', 'cursive']
      }
    },
  },
  plugins: [],
}
