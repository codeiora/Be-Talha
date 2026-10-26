import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { ConstellationSection } from "@/components/constellation/ConstellationSection";

export const metadata: Metadata = {
  title: "The Constellation • Winged Morning Star | Be Talha",
  description:
    "Evolution of Goals: The Winged Morning Star — Transcending limitations to radiate singular light across the cosmos.",
};

export default function ConstellationPage() {
  return (
    <CosmicPageShell
      title="The Constellation"
      bengaliTitle="Evolution of Goals • Winged Morning Star"
      activeModule="constellation"
    >
      <ConstellationSection />
    </CosmicPageShell>
  );
}
