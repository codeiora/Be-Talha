import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { MilestonesContainer } from "@/components/milestones/MilestonesContainer";

export const metadata: Metadata = {
  title: "Celestial Milestones • Cascading Horizons | Be Talha",
  description:
    "Multi-horizon goal cascading: Daily Sparks, Weekly Sprints, Monthly Orbits, and Yearly Horizons.",
};

export default function MilestonesPage() {
  return (
    <CosmicPageShell
      title="Celestial Milestones"
      bengaliTitle="মহাজাগতিক মাইলস্টোন ও দিগন্ত"
      activeModule="milestones"
    >
      <MilestonesContainer />
    </CosmicPageShell>
  );
}
