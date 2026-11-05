export type HorizonType = "today" | "weekly" | "monthly" | "yearly";

export type MilestonePanelSection =
  | "overview"
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
  | "starlight_vault"
  | "divine_constellation";

export type GoalCategory = "deen" | "intellect" | "body" | "tazkiyah" | "other" | "crucible";

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
    bengaliLabel: "Deen & Hifz",
    color: "text-amber-300",
    bgLight: "bg-amber-500/15",
    borderColor: "border-amber-400/30",
    dotColor: "bg-amber-400",
  },
  intellect: {
    id: "intellect",
    label: "Intellect & Craft",
    bengaliLabel: "Intellect & Craft",
    color: "text-cyan-300",
    bgLight: "bg-cyan-500/15",
    borderColor: "border-cyan-400/30",
    dotColor: "bg-cyan-400",
  },
  body: {
    id: "body",
    label: "Body & Armor",
    bengaliLabel: "Body & Armor",
    color: "text-emerald-300",
    bgLight: "bg-emerald-500/15",
    borderColor: "border-emerald-400/30",
    dotColor: "bg-emerald-400",
  },
  tazkiyah: {
    id: "tazkiyah",
    label: "Tazkiyah & Soul",
    bengaliLabel: "Tazkiyah & Soul",
    color: "text-rose-300",
    bgLight: "bg-rose-500/15",
    borderColor: "border-rose-400/30",
    dotColor: "bg-rose-400",
  },
  crucible: {
    id: "crucible",
    label: "Tazkiyah & Soul",
    bengaliLabel: "Tazkiyah & Soul",
    color: "text-rose-300",
    bgLight: "bg-rose-500/15",
    borderColor: "border-rose-400/30",
    dotColor: "bg-rose-400",
  },
  other: {
    id: "other",
    label: "Personal & Life",
    bengaliLabel: "Personal & Life",
    color: "text-violet-300",
    bgLight: "bg-violet-500/15",
    borderColor: "border-violet-400/30",
    dotColor: "bg-violet-400",
  },
};

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

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
  daysCarriedOver?: number; // count of rollover days for decay (3+ days triggers blackhole decay)
  subtasks?: SubTask[];
  estimatedMinutes?: number; // Estimated planned duration in minutes (e.g. 25, 45, 60)
  actualMinutes?: number;    // Tracked deep work minutes spent
}

export type StateOfHeartType = "full_moon" | "clear_sky" | "eclipse" | "nebula";

export interface ShukrParticleItem {
  id: string;
  text: string;
  createdAt: number;
}

export interface DailyNoteEntry {
  id: string;
  dateKey: string; // "YYYY-MM-DD"

  // 1. Morning Intent (পর্ব ১: সকালের সংকল্প)
  coreFocus: string; // The North Star (প্রধান একক লক্ষ্য)
  stateOfHeart?: StateOfHeartType; // রূহানী আবহাওয়া
  spiritualAnchor?: string; // রূহানী প্রস্তুতি ও বিশেষ দুআ

  // 2. Evening Reflection (পর্ব ২: রাতের মোরাকাবা)
  realityCheckStatus?: "achieved" | "partial" | "missed"; // The Reality Check
  realityCheckNotes?: string;
  theEclipse?: string; // The Eclipse (হোঁচট খাওয়ার জায়গা / নফসের ফাঁদ)
  tomorrowsOrbit?: string; // Tomorrow's Orbit (আগামীকালের প্রতিজ্ঞা)

  // 3. Divine Companions
  ayahReminder: string; // ঐশী বাণী / আয়াত
  ayahSource?: string;

  // 4. Daily Shukr & Particles
  shukr: string; // Primary Shukr note
  shukrParticles?: ShukrParticleItem[]; // Glowing Shukr particles vault

  // Legacy field for backwards compatibility
  thoughts?: string;

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
