import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { HifzDashboard } from "@/components/hifz/HifzDashboard";

export const metadata: Metadata = {
  title: "In Search of Light • Quran Memorization | Be Talha",
  description:
    "Quran memorization & Fading Stars revision tracker across the 114 celestial clusters.",
};

export default function HifzPage() {
  return (
    <CosmicPageShell
      title="In Search of Light"
      activeModule="hifz"
    >
      <HifzDashboard />
    </CosmicPageShell>
  );
}
