/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ededed",
        accent: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        }
      }
    },
  },
  plugins: [],
}
