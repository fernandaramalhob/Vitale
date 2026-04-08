import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body:    ["var(--font-body)"],
        mono:    ["var(--font-mono)"],
      },
      colors: {
        brand: {
          50:  "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised:  "hsl(var(--surface-raised))",
          overlay: "hsl(var(--surface-overlay))",
          sunken:  "hsl(var(--surface-sunken))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle:  "hsl(var(--border-subtle))",
          strong:  "hsl(var(--border-strong))",
        },
        tx: {
          primary:   "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary:  "hsl(var(--text-tertiary))",
          inverse:   "hsl(var(--text-inverse))",
        },
      },
      animation: {
        "fade-in":  "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "shimmer":  "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};

export default config;
