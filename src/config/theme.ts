/**
 * -----------------------------------------------------------------------------
 * Centralized Theme & Color Configuration
 * -----------------------------------------------------------------------------
 * This file documents and configures the core theme tokens for "Be Talha".
 * You can customize the color palette here or in src/app/globals.css.
 * -----------------------------------------------------------------------------
 */

export const THEME_CONFIG = {
  // Brand name & theme identity
  name: "Cosmic Midnight",

  // Core color palette
  colors: {
    // Deep cosmic space background shades
    cosmic: {
      950: "#02040a",
      900: "#050914",
      850: "#080f20",
      800: "#0c152d",
      700: "#132044",
      600: "#1c2e5e",
    },

    // Celestial celestial accents
    starlight: {
      cyan: "#38bdf8",     // Primary cosmic accent (Shuktara / Morning Star)
      amber: "#f59e0b",    // Crucible / Childhood letter accent
      gold: "#fbbf24",     // Star points / Constellation achievements
      emerald: "#10b981",  // Groundedness / Completed milestones
    },

    // UI text hierarchy
    text: {
      heading: "#f8fafc",
      body: "#cbd5e1",
      muted: "#64748b",
      subtle: "#475569",
    },
  },
} as const;

export type ThemeColors = typeof THEME_CONFIG.colors;
