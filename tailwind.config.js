/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  // darkMode: "media",
  // prefix: "plasmo-"
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      fontFamily: {
        // sans: ["var(--font-geist-sans)"],
        // mono: ["var(--font-geist-mono)"]
      }
    }
  }
}
