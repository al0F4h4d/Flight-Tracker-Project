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
        radar: {
          bg:     "#0B0F19",
          panel:  "#111827",
          card:   "#1a2234",
          border: "#1F2937",
          muted:  "#374151",
        },
        cyan: {
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
        },
        amber: {
          400: "#FCD34D",
          500: "#F59E0B",
          600: "#D97706",
        },
        emerald: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        red: {
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
        },
        slate: {
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
      },
      animation: {
        "radar-ping":    "radar-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "live-pulse":    "live-pulse 2s ease-in-out infinite",
        "radar-sweep":   "radar-sweep 4s linear infinite",
      },
      keyframes: {
        "radar-ping": {
          "0%":       { transform: "scale(1)",   opacity: "0.9" },
          "75%, 100%":{ transform: "scale(2.5)", opacity: "0"   },
        },
        "live-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
        "radar-sweep": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
