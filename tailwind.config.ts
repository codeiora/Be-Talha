import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep space cosmic background shades (linked to CSS variables for quick theme changes)
        cosmic: {
          950: "var(--cosmic-950, #02040a)",
          900: "var(--cosmic-900, #050914)",
          850: "var(--cosmic-850, #080f20)",
          800: "var(--cosmic-800, #0c152d)",
          700: "var(--cosmic-700, #132044)",
          600: "var(--cosmic-600, #1c2e5e)",
        },
        // Celestial theme accents
        starlight: {
          cyan: "var(--starlight-cyan, #38bdf8)",
          amber: "var(--starlight-amber, #f59e0b)",
          gold: "var(--starlight-gold, #fbbf24)",
          emerald: "var(--starlight-emerald, #10b981)",
        },
      },
      fontFamily: {
        // Base Latin body & UI font (Inter + Atma for Bengali + system fallback)
        sans: ["var(--font-sans)", "var(--font-inter)", "var(--font-bengali)", "sans-serif"],
        bengali: ["var(--font-bengali)", "sans-serif"],

        // Headings & Titles: Alkatra (with Atma fallback for Bengali)
        heading: ["var(--font-alkatra)", "var(--font-bengali)", "serif"],
        alkatra: ["var(--font-alkatra)", "var(--font-bengali)", "serif"],

        // Subheadings, Descriptions & Quotes: Delius (with Atma fallback for Bengali)
        subheading: ["var(--font-delius)", "var(--font-bengali)", "cursive", "sans-serif"],
        delius: ["var(--font-delius)", "var(--font-bengali)", "cursive", "sans-serif"],

        // Badges, Tags, Buttons & Stats: Joti One (with Atma fallback for Bengali)
        badge: ["var(--font-joti)", "var(--font-bengali)", "cursive", "sans-serif"],
        joti: ["var(--font-joti)", "var(--font-bengali)", "cursive", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "star-glow": "starGlow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
      },
      keyframes: {
        starGlow: {
          "0%": { opacity: "0.4", transform: "scale(0.96)", filter: "drop-shadow(0 0 4px rgba(56, 189, 248, 0.3))" },
          "100%": { opacity: "1", transform: "scale(1.04)", filter: "drop-shadow(0 0 16px rgba(56, 189, 248, 0.8))" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "cosmic-card": "0 0 25px -5px rgba(2, 6, 23, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.07)",
        "cosmic-glow": "0 0 35px -5px rgba(56, 189, 248, 0.25)",
        "amber-glow": "0 0 35px -5px rgba(245, 158, 11, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
