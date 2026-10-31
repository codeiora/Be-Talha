import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { CrucibleSection } from "@/components/crucible/CrucibleSection";

export const metadata: Metadata = {
  title: "The Inner Crucible | Be Talha",
  description: "Admitting errors, shedding flaws, and deep self-examination.",
};

export default function CruciblePage() {
  return (
    <CosmicPageShell
      title="The Inner Crucible"
      activeModule="crucible"
    >
      <CrucibleSection />
    </CosmicPageShell>
  );
}
