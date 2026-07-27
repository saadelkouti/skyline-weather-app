/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#0B1226",
          soft: "#131B33",
          deep: "#060A16",
        },
        cirrus: {
          DEFAULT: "#F5F8FF",
          dim: "#E7EDF9",
        },
        cerulean: {
          DEFAULT: "#2E6FE8",
          soft: "#5B8DEF",
        },
        amber: {
          DEFAULT: "#F5A623",
          soft: "#FBC55B",
        },
        violet: {
          DEFAULT: "#7C6CF0",
          soft: "#9C90F5",
        },
        teal: {
          DEFAULT: "#14B8A6",
          soft: "#4DD4C4",
        },
        slate: {
          instrument: "#94A3B8",
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(6, 10, 22, 0.28)",
        "glass-light": "0 8px 32px 0 rgba(46, 111, 232, 0.12)",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(10%)" },
        },
        "fall-rain": {
          "0%": { transform: "translateY(-10%)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110%)", opacity: "0" },
        },
        "fall-snow": {
          "0%": { transform: "translateY(-10%) translateX(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110%) translateX(20px)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        flash: {
          "0%, 92%, 100%": { opacity: "0" },
          "94%": { opacity: "0.9" },
          "96%": { opacity: "0.1" },
          "98%": { opacity: "0.7" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        drift: "drift 40s ease-in-out infinite alternate",
        "drift-slow": "drift 70s ease-in-out infinite alternate",
        "fall-rain": "fall-rain 0.9s linear infinite",
        "fall-snow": "fall-snow 6s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        flash: "flash 7s ease-in-out infinite",
        "spin-slow": "spin-slow 18s linear infinite",
      },
    },
  },
  plugins: [],
};
