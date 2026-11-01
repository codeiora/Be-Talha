export type HorizonType = "today" | "weekly" | "monthly" | "yearly";

export type MilestonePanelSection =
  | "daily"
  | "today_sparks"
  | "daily_notes"
  | "weekly"
  | "weekly_sprints"
  | "monthly"
  | "monthly_orbits"
  | "yearly"
  | "yearly_horizon"
  | "murakaba_review"
  | "starlight_vault";

export type GoalCategory = "deen" | "intellect" | "body" | "crucible" | "other";

export type PriorityLevel = "high" | "normal" | "low";

export interface CategoryMeta {
  id: GoalCategory;
  label: string;
  bengaliLabel: string;
  color: string;
  bgLight: string;
  borderColor: string;
  dotColor: string;
}

export const CATEGORY_MAP: Record<GoalCategory, CategoryMeta> = {
  deen: {
    id: "deen",
    label: "Deen & Hifz",
    bengaliLabel: "দীন ও হিফজ",
    color: "text-amber-300",
    bgLight: "bg-amber-500/15",
    borderColor: "border-amber-400/30",
    dotColor: "bg-amber-400",
  },
  intellect: {
    id: "intellect",
    label: "Intellect & Craft",
    bengaliLabel: "জ্ঞান ও কোড",
    color: "text-cyan-300",
    bgLight: "bg-cyan-500/15",
    borderColor: "border-cyan-400/30",
    dotColor: "bg-cyan-400",
  },
  body: {
    id: "body",
    label: "Body & Armor",
    bengaliLabel: "শরীর ও শক্তি",
    color: "text-emerald-300",
    bgLight: "bg-emerald-500/15",
    borderColor: "border-emerald-400/30",
    dotColor: "bg-emerald-400",
  },
  crucible: {
    id: "crucible",
    label: "Inner Crucible",
    bengaliLabel: "আত্মশুদ্ধি",
    color: "text-rose-300",
    bgLight: "bg-rose-500/15",
    borderColor: "border-rose-400/30",
    dotColor: "bg-rose-400",
  },
  other: {
    id: "other",
    label: "Personal & Life",
    bengaliLabel: "ব্যক্তিগত",
    color: "text-violet-300",
    bgLight: "bg-violet-500/15",
    borderColor: "border-violet-400/30",
    dotColor: "bg-violet-400",
  },
};

export interface TodaySparkGoal {
  id: string;
  title: string;
  category: GoalCategory;
  priority: PriorityLevel;
  points: number; // Cosmic XP
  completed: boolean;
  completedAt?: number;
  createdAt: number;
  dateKey: string; // "YYYY-MM-DD"
  linkedWeeklyGoalId?: string;
  notes?: string;
  isCarriedOver?: boolean;
}

export interface DailyNoteEntry {
  id: string;
  dateKey: string; // "YYYY-MM-DD"
  coreFocus: string;
  ayahReminder: string;
  thoughts: string;
  shukr: string;
  updatedAt: number;
}

export interface WeeklySprintGoal {
  id: string;
  title: string;
  category: GoalCategory;
  weekNumber: number;
  year: number;
  completed: boolean;
  progress: number; // 0 to 100%
  linkedMonthlyGoalId?: string;
  createdAt: number;
  dueDate?: string;
  notes?: string;
}

export interface MonthlyOrbitGoal {
  id: string;
  title: string;
  category: GoalCategory;
  month: number; // 0-11
  year: number;
  completed: boolean;
  progress: number; // 0 to 100%
  linkedYearlyGoalId?: string;
  createdAt: number;
  notes?: string;
}

export interface YearlyHorizonGoal {
  id: string;
  title: string;
  category: GoalCategory;
  year: number;
  vision: string;
  completed: boolean;
  progress: number; // 0 to 100%
  pillar: string;
  targetQuarter?: "Q1" | "Q2" | "Q3" | "Q4" | "All Year";
  createdAt: number;
}

export interface MurakabaEntry {
  id: string;
  dateKey: string;
  weekNumber: number;
  year: number;
  highlight: string;
  stumblingBlock: string;
  nextWeekPledge: string;
  reviewedAt: number;
}
