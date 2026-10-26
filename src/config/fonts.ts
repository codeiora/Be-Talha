import localFont from "next/font/local";

/**
 * -----------------------------------------------------------------------------
 * Centralized Font Configuration
 * -----------------------------------------------------------------------------
 * Clean, lean, self-hosted local fonts via next/font/local for ultra-fast performance,
 * zero network latency, and complete build resilience.
 *
 * 1. fontSans: Primary Latin body & UI font (Inter)
 * 2. fontBengali: Bengali script font (Atma)
 * 3. fontAlkatra: Main Headings, Titles & Display Quotes (Alkatra)
 * 4. fontDelius: Subheadings, Short Descriptions & Callouts (Delius)
 * 5. fontJoti: Badges, Tags, Buttons & Stats (Joti One)
 * -----------------------------------------------------------------------------
 */

export const fontSans = localFont({
  src: [
    {
      path: "../fonts/inter/inter-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/inter/inter-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/inter/inter-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/inter/inter-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const fontBengali = localFont({
  src: [
    {
      path: "../fonts/atma/atma-bengali-300-normal.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/atma/atma-bengali-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/atma/atma-bengali-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/atma/atma-bengali-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/atma/atma-bengali-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bengali",
  display: "swap",
});

export const fontAlkatra = localFont({
  src: [
    {
      path: "../fonts/alkatra/alkatra-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/alkatra/alkatra-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/alkatra/alkatra-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/alkatra/alkatra-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-alkatra",
  display: "swap",
});

export const fontDelius = localFont({
  src: [
    {
      path: "../fonts/delius/delius-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-delius",
  display: "swap",
});

export const fontJoti = localFont({
  src: [
    {
      path: "../fonts/joti-one/joti-one-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-joti",
  display: "swap",
});

/**
 * Combined font variable classes to be attached to <html /> in RootLayout
 */
export const fontVariables = `${fontSans.variable} ${fontBengali.variable} ${fontAlkatra.variable} ${fontDelius.variable} ${fontJoti.variable}`;
