import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { SacredLetterContent } from "@/components/letter/SacredLetterContent";

export const metadata: Metadata = {
  title: "Care of: Childhood • Sacred Letter | Be Talha",
  description: "Special letter from Psycho Behen: Never stray from the center point.",
};

export default function LetterPage() {
  return (
    <CosmicPageShell
      title="Sacred Vault"
      bengaliTitle="Care of: Childhood (Letter)"
      activeModule="letter"
    >
      <SacredLetterContent />
    </CosmicPageShell>
  );
}
