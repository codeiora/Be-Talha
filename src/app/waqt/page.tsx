import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { WaqtDashboard } from "@/components/waqt/WaqtDashboard";

export const metadata: Metadata = {
  title: "Celestial Waqt & Salah | Be Talha",
  description: "Fajr dawn, Waqt timetable, daily prayer tracker, and weekly-monthly-yearly analytics dashboard.",
};

export default function WaqtPage() {
  return (
    <CosmicPageShell
      title="Celestial Waqt & Salah"
      activeModule="waqt"
    >
      <WaqtDashboard />
    </CosmicPageShell>
  );
}
