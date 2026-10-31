import {
  TodaySparkGoal,
  DailyNoteEntry,
  WeeklySprintGoal,
  MonthlyOrbitGoal,
  YearlyHorizonGoal,
  MurakabaEntry,
} from "@/types/milestones";

export const MILESTONES_STORAGE_KEY_TODAY = "be_talha_milestones_today_v1";
export const MILESTONES_STORAGE_KEY_NOTES = "be_talha_milestones_daily_notes_v1";
export const MILESTONES_STORAGE_KEY_WEEKLY = "be_talha_milestones_weekly_v1";
export const MILESTONES_STORAGE_KEY_MONTHLY = "be_talha_milestones_monthly_v1";
export const MILESTONES_STORAGE_KEY_YEARLY = "be_talha_milestones_yearly_v1";
export const MILESTONES_STORAGE_KEY_MURAKABA = "be_talha_milestones_murakaba_v1";

// Helper to get formatted date string: YYYY-MM-DD
export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper to get current ISO week number
export function getCurrentWeekNumber(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNo;
}

// Default Seed for Today's Sparks
export const DEFAULT_TODAY_SPARKS: TodaySparkGoal[] = [
  {
    id: "spark-1",
    title: "Subhe Sadik — Dawn Prayer & Sacred Quran Contemplation",
    category: "deen",
    priority: "high",
    points: 20,
    completed: true,
    completedAt: Date.now() - 3600000 * 3,
    createdAt: Date.now() - 3600000 * 5,
    dateKey: getTodayDateKey(),
    linkedWeeklyGoalId: "weekly-1",
    notes: "Never stray from the center reference point.",
  },
  {
    id: "spark-2",
    title: "Quran Revision — 10 Pages Amukhta Precision Flow",
    category: "deen",
    priority: "high",
    points: 15,
    completed: false,
    createdAt: Date.now() - 3600000 * 2,
    dateKey: getTodayDateKey(),
    linkedWeeklyGoalId: "weekly-1",
    notes: "Review Surah An-Nisa mutashabihaat markers.",
  },
  {
    id: "spark-3",
    title: "Deep Work — Master Systems Architecture & Command Center",
    category: "intellect",
    priority: "high",
    points: 20,
    completed: false,
    createdAt: Date.now() - 3600000,
    dateKey: getTodayDateKey(),
    linkedWeeklyGoalId: "weekly-2",
  },
  {
    id: "spark-4",
    title: "Physical Mastery — Strength Conditioning & Mobility",
    category: "body",
    priority: "normal",
    points: 15,
    completed: false,
    createdAt: Date.now() - 1800000,
    dateKey: getTodayDateKey(),
    linkedWeeklyGoalId: "weekly-3",
  },
  {
    id: "spark-5",
    title: "Evening Murakaba — Self-examination & Inner Crucible Check",
    category: "crucible",
    priority: "normal",
    points: 10,
    completed: false,
    createdAt: Date.now() - 900000,
    dateKey: getTodayDateKey(),
  },
];

// Default Seed for Today's Note
export const DEFAULT_DAILY_NOTE: DailyNoteEntry = {
  id: "note-today",
  dateKey: getTodayDateKey(),
  coreFocus: "Anchor the mind in Subhe Sadik; allow no trivial distraction to fracture deep work.",
  ayahReminder: "“And whoever fears Allah - He will make for him a way out, and will provide for him from where he does not expect.” (Surah At-Talaq: 2-3)",
  thoughts: "The universe honors relentless discipline over momentary bursts of passion. Keep moving one stone at a time.",
  shukr: "Alhamdulillah for another breath of life, the ability to memorize the Quran, and the health to strive for mastery.",
  updatedAt: Date.now(),
};

// Default Seed for Weekly Sprints
export const DEFAULT_WEEKLY_SPRINTS: WeeklySprintGoal[] = [
  {
    id: "weekly-1",
    title: "Complete 1 Juz Amukhta & Fading Stars Revision",
    category: "deen",
    weekNumber: getCurrentWeekNumber(),
    year: new Date().getFullYear(),
    completed: false,
    progress: 40,
    createdAt: Date.now() - 86400000 * 2,
    linkedMonthlyGoalId: "monthly-1",
  },
  {
    id: "weekly-2",
    title: "Build and Deploy Milestone Cascading Engine",
    category: "intellect",
    weekNumber: getCurrentWeekNumber(),
    year: new Date().getFullYear(),
    completed: false,
    progress: 30,
    createdAt: Date.now() - 86400000 * 2,
    linkedMonthlyGoalId: "monthly-2",
  },
  {
    id: "weekly-3",
    title: "Maintain 5/7 Days Strength & Endurance Sessions",
    category: "body",
    weekNumber: getCurrentWeekNumber(),
    year: new Date().getFullYear(),
    completed: false,
    progress: 60,
    createdAt: Date.now() - 86400000 * 2,
  },
];

// Default Seed for Monthly Orbits
export const DEFAULT_MONTHLY_ORBITS: MonthlyOrbitGoal[] = [
  {
    id: "monthly-1",
    title: "Consolidate 3 Paras with Flawless Memorization Quality",
    category: "deen",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    completed: false,
    progress: 45,
    linkedYearlyGoalId: "yearly-1",
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: "monthly-2",
    title: "Launch Core Cosmic Dashboard System in Be-Talha",
    category: "intellect",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    completed: false,
    progress: 55,
    linkedYearlyGoalId: "yearly-2",
    createdAt: Date.now() - 86400000 * 10,
  },
];

// Default Seed for Yearly Horizon
export const DEFAULT_YEARLY_HORIZONS: YearlyHorizonGoal[] = [
  {
    id: "yearly-1",
    title: "Full Quran Hifz Absolute Retention (Hafiz Al-Quran)",
    vision: "To solidify all 30 Juz with effortless recall from any ayah or mutashabiha.",
    category: "deen",
    pillar: "Sacred Anchor & Deen",
    year: new Date().getFullYear(),
    completed: false,
    progress: 65,
    targetQuarter: "All Year",
    createdAt: Date.now() - 86400000 * 60,
  },
  {
    id: "yearly-2",
    title: "Become a World-Class Full-Stack AI & Systems Engineer",
    vision: "Master distributed systems, AI engineering, and build transformative digital artifacts.",
    category: "intellect",
    pillar: "Intellect & Worldly Mastery",
    year: new Date().getFullYear(),
    completed: false,
    progress: 50,
    targetQuarter: "All Year",
    createdAt: Date.now() - 86400000 * 60,
  },
  {
    id: "yearly-3",
    title: "Peak Physical Vitality & Disciplined Routine",
    vision: "Achieve optimum physical endurance, clean nutrition, and uncompromised health.",
    category: "body",
    pillar: "Armor & Physical Vessel",
    year: new Date().getFullYear(),
    completed: false,
    progress: 40,
    targetQuarter: "All Year",
    createdAt: Date.now() - 86400000 * 60,
  },
];

// Default Seed for Murakaba Reviews
export const DEFAULT_MURAKABA_ENTRIES: MurakabaEntry[] = [
  {
    id: "mura-1",
    dateKey: getTodayDateKey(),
    weekNumber: getCurrentWeekNumber() - 1,
    year: new Date().getFullYear(),
    highlight: "Conquered 4 consecutive Subhe Sadik dawn contemplation sessions with zero lapse.",
    stumblingBlock: "Allowed screen time to spill over after Isha on Wednesday night.",
    nextWeekPledge: "Strict shut-off at 10:30 PM. Complete Hifz revision before opening any messaging client.",
    reviewedAt: Date.now() - 86400000 * 5,
  },
];

// Audio chime for task completion
export function playMilestoneChime(isCompletion: boolean = true) {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (isCompletion) {
      const freqs = [698.46, 880.0, 1046.5, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.1 / (idx + 1), now + idx * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 1.3);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.25);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    }
  } catch {}
}
