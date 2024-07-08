/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm450: "450px",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
