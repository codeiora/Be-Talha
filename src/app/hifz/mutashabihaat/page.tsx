import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { PillarHeaderNav } from "@/components/hifz/pillars/PillarHeaderNav";
import { MutashabihaatStudio } from "@/components/hifz/pillars/MutashabihaatStudio";

export const metadata: Metadata = {
  title: "Mutashabihaat Studio • Similar Verses | Be Talha",
  description: "Untangle look-alike and mirrored Quranic verses with side-by-side contrast notes and memory anchors.",
};

export default function MutashabihaatPage() {
  return (
    <CosmicPageShell
      title="Mutashabihaat Studio"
      bengaliTitle="মুতাশাবিহাত - বিভ্রান্তিকর সদৃশ আয়াত"
      activeModule="hifz"
    >
      <div className="space-y-6">
        <PillarHeaderNav currentPillar="mutashabihat" />
        <MutashabihaatStudio />
      </div>
    </CosmicPageShell>
  );
}