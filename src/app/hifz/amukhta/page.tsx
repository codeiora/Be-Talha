import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { PillarHeaderNav } from "@/components/hifz/pillars/PillarHeaderNav";
import { AmukhtaRadar } from "@/components/hifz/pillars/AmukhtaRadar";

export const metadata: Metadata = {
  title: "AMUKHTA : THE MEMORY VAULT • Fading Stars Revision | Be Talha",
  description: "যে আলো একবার হৃদয়ে ধারণ করেছ, তাকে নিভতে দিও না। The guardian vault for preserving your Quranic memorization.",
};

export default function AmukhtaPage() {
  return (
    <CosmicPageShell
      title="AMUKHTA : THE MEMORY VAULT"
      bengaliTitle="আমোখতা : দ্য মেমোরি ভল্ট (নিভু নিভু তারার রিভিশন)"
      activeModule="hifz"
    >
      <div className="space-y-6">
        <PillarHeaderNav currentPillar="amukhta" />
        <AmukhtaRadar />
      </div>
    </CosmicPageShell>
  );
}