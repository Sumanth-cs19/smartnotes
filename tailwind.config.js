// tailwind.config.js
module.exports = {
  darkMode: "class", // class-based dark mode toggle
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          100: "#E6E0F8",
          300: "#9F7AEA",
          600: "#6B46C1",
          700: "#553C9A",
        },
      },
      transitionProperty: {
        'transform': 'transform',
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
