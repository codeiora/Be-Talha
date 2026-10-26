import type { Metadata } from "next";
import { fontVariables } from "@/config/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Be Talha • Digital Compass & Mirror",
  description:
    "Check your time, hold your ground, mend your flaws, and rise to the height of your name.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} dark`}>
      <body
        style={{ backgroundColor: "#02040a", color: "#f8fafc" }}
        className="bg-cosmic-950 text-slate-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-300"
      >
        {children}
      </body>
    </html>
  );
}
