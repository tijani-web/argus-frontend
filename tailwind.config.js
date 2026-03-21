/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#000000",
        deep: "#050508",
        surface: "#0a0a12",
        elevated: "#0f0f1a",
        card: { DEFAULT: "#111120", hover: "#16162a" },
        electric: { DEFAULT: "#00d1ff", dim: "rgba(0,209,255,0.15)" },
        cyber: { DEFAULT: "#a100ff", dim: "rgba(161,0,255,0.15)" },
        "accent-green": "#00ff88",
        "accent-red": "#ff3366",
        "accent-yellow": "#ffcc00",
        "t-primary": "#f0f0ff",
        "t-secondary": "rgba(240,240,255,0.6)",
        "t-muted": "rgba(240,240,255,0.35)",
        "border-subtle": "rgba(255,255,255,0.06)",
      },
      fontFamily: {
        sans: ["'Outfit'", "'Inter'", "system-ui", "sans-serif"],
        heading: ["'Inter'", "'Outfit'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Courier New'", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "28px",
      },
      keyframes: {
        "float-up": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "float-up": "float-up 4s ease-in-out infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        shimmer: "shimmer 1.5s infinite linear",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(0,209,255,0.4), 0 0 60px rgba(0,209,255,0.15)",
        "glow-purple": "0 0 20px rgba(161,0,255,0.4), 0 0 60px rgba(161,0,255,0.15)",
        "glow-subtle": "0 0 40px rgba(0,209,255,0.08)",
      },
    },
  },
  plugins: [],
};
