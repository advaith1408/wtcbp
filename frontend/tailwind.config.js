/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0c",
        surface: "#111114",
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#8b5cf6",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      },
    },
  },
  plugins: [],
}
