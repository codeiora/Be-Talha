export type MilestoneCategory =
  | "roots"
  | "intellect"
  | "creation"
  | "armor"
  | "character"
  | "beacon";

export type WingSection = "anchor" | "left-wing" | "right-wing" | "apex";

export interface ConstellationMilestone {
  id: string;
  title: string;
  category: MilestoneCategory;
  categoryLabel: string;
  wingSection: WingSection;
  wingLabel: string;
  description: string;
  x: number; // Percentage 0 - 100 on cosmic canvas
  y: number; // Percentage 0 - 100 on cosmic canvas
  completed: boolean;
  completedAt?: number;
  magnitude: number; // 2 to 5 for star size & radiance
  color: string; // Accent color hex
  targetHorizon: string; // e.g. "2026-2027"
  notes?: string;
  isCustom?: boolean;
}

export interface ConstellationConnection {
  fromId: string;
  toId: string;
}

export interface DailySparkTask {
  id: string;
  title: string;
  points: number;
  completed: boolean;
  createdAt: number;
  linkedMilestoneId?: string;
}
