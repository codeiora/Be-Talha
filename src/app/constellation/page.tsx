import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { ConstellationSection } from "@/components/constellation/ConstellationSection";

export const metadata: Metadata = {
  title: "The Winged Morning Star • Celestial Goals | Be Talha",
  description:
    "Evolution of Goals: The Winged Morning Star — Transcending limitations to radiate singular light across the cosmos.",
};

export default function ConstellationPage() {
  return (
    <CosmicPageShell
      title="The Winged Morning Star"
      activeModule="constellation"
    >
      <ConstellationSection />
    </CosmicPageShell>
  );
}
