import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { PillarHeaderNav } from "@/components/hifz/pillars/PillarHeaderNav";
import { SabqiOrbit } from "@/components/hifz/pillars/SabqiOrbit";

export const metadata: Metadata = {
  title: "Sabqi Orbit • Recent Revision | Be Talha",
  description:
    "Stabilizing the Orbit — Daily revision of portions memorized in the last 7 to 15 days to consolidate short-term memory into long-term retention.",
};

export default function SabqiPage() {
  return (
    <CosmicPageShell
      title="Sabqi Orbit"
      bengaliTitle="Pillar 02 • Recent Revision Orbit"
      activeModule="hifz"
    >
      <div className="space-y-6">
        <PillarHeaderNav currentPillar="sabqi" />
        <SabqiOrbit />
      </div>
    </CosmicPageShell>
  );
}