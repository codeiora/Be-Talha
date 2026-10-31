import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { PillarHeaderNav } from "@/components/hifz/pillars/PillarHeaderNav";
import { TakrarStudio } from "@/components/hifz/pillars/TakrarStudio";

export const metadata: Metadata = {
  title: "Takrar Studio • Repetition Loops | Be Talha",
  description: "Neurological etching through high-frequency 20x to 50x loops and peer testing.",
};

export default function TakrarPage() {
  return (
    <CosmicPageShell
      title="Takrar Studio"
      bengaliTitle="তাকরার - পুনরাবৃত্তি ও গভীর আত্মস্থকরণ"
      activeModule="hifz"
    >
      <div className="space-y-6">
        <PillarHeaderNav currentPillar="takrar" />
        <TakrarStudio />
      </div>
    </CosmicPageShell>
  );
}