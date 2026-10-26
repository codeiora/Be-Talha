import type { Metadata } from "next";
import { CosmicPageShell } from "@/components/layout/CosmicPageShell";
import { WaqtDashboard } from "@/components/waqt/WaqtDashboard";

export const metadata: Metadata = {
  title: "Celestial Waqt & Salah Dashboard | Be Talha",
  description: "Fajr dawn, Waqt timetable, daily prayer tracker, and weekly-monthly-yearly analytics dashboard.",
};

export default function WaqtPage() {
  return (
    <CosmicPageShell
      title="Celestial Waqt"
      bengaliTitle="মহাজাগতিক ওয়াক্ত ও সালাহ ড্যাশবোর্ড"
      activeModule="waqt"
    >
      <WaqtDashboard />
    </CosmicPageShell>
  );
}

