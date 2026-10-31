import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { PillarHeaderNav } from "@/components/hifz/pillars/PillarHeaderNav";
import { SabaqStudio } from "@/components/hifz/pillars/SabaqStudio";

export const metadata: Metadata = {
  title: "Sabaq Studio • Daily Quran Lesson | Be Talha",
  description: "The daily memorization seed. Commit fresh ayahs with focused presence, Tajweed, and audio.",
};

export default function SabaqPage() {
  return (
    <CosmicPageShell
      title="Sabaq Studio"
      bengaliTitle="Daily Memorization Lesson"
      activeModule="hifz"
    >
      <div className="space-y-6">
        <PillarHeaderNav currentPillar="sabaq" />
        <SabaqStudio />
      </div>
    </CosmicPageShell>
  );
}
