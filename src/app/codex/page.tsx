import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { RootCodexContent } from "@/components/codex/RootCodexContent";

export const metadata: Metadata = {
  title: "The Root Codex • Principles & Philosophy | Be Talha",
  description: "Life compass, anchor points, and inspirational wisdom.",
};

export default function CodexPage() {
  return (
    <CosmicPageShell
      title="The Root Codex"
      activeModule="codex"
    >
      <RootCodexContent />
    </CosmicPageShell>
  );
}
