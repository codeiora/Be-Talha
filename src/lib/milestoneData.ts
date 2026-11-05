import {
  TodaySparkGoal,
  DailyNoteEntry,
  WeeklySprintGoal,
  MonthlyOrbitGoal,
  YearlyHorizonGoal,
  MurakabaEntry,
  GoalCategory,
  PriorityLevel,
} from "@/types/milestones";

export const MILESTONES_STORAGE_KEY_TODAY = "be_talha_milestones_today_v1";
export const MILESTONES_STORAGE_KEY_NOTES = "be_talha_milestones_daily_notes_v1";
export const MILESTONES_STORAGE_KEY_WEEKLY = "be_talha_milestones_weekly_v1";
export const MILESTONES_STORAGE_KEY_MONTHLY = "be_talha_milestones_monthly_v1";
export const MILESTONES_STORAGE_KEY_YEARLY = "be_talha_milestones_yearly_v1";
export const MILESTONES_STORAGE_KEY_MURAKABA = "be_talha_milestones_murakaba_v1";
export const MILESTONES_STORAGE_KEY_BLUEPRINT = "be_talha_milestones_blueprint_v1";
export const MILESTONES_STORAGE_KEY_ARCHIVED_XP = "be_talha_milestones_archived_xp_v1";
export const MILESTONES_STORAGE_KEY_ARCHIVED_MINUTES = "be_talha_milestones_archived_minutes_v1";
export const MILESTONES_STORAGE_KEY_ARCHIVED_COUNT = "be_talha_milestones_archived_count_v1";

export interface BlueprintSparkItem {
  id: string;
  title: string;
  category: GoalCategory;
  priority: PriorityLevel;
  points: number;
  estimatedMinutes: number;
}

export const DEFAULT_DAILY_BLUEPRINT: BlueprintSparkItem[] = [
  {
    id: "bp-1",
    title: "Dawn Prayer, Sunnah Adhkar & Spiritual Grounding",
    category: "deen",
    priority: "high",
    points: 20,
    estimatedMinutes: 30,
  },
  {
    id: "bp-2",
    title: "Quran Memorization — Sabaq Recitation & Precision Revision",
    category: "deen",
    priority: "high",
    points: 25,
    estimatedMinutes: 45,
  },
  {
    id: "bp-3",
    title: "Morning Routine — Grooming, Shower & Wholesome Breakfast",
    category: "body",
    priority: "normal",
    points: 10,
    estimatedMinutes: 30,
  },
  {
    id: "bp-4",
    title: "Deep Work Block 1 — Architecture & Core Systems Craft",
    category: "intellect",
    priority: "high",
    points: 25,
    estimatedMinutes: 60,
  },
  {
    id: "bp-5",
    title: "Physical Conditioning — Strength Training & Mobility",
    category: "body",
    priority: "normal",
    points: 15,
    estimatedMinutes: 40,
  },
  {
    id: "bp-6",
    title: "Evening Murakaba — Muhasaba, Reflection & Tazkiyah Check",
    category: "tazkiyah",
    priority: "normal",
    points: 15,
    estimatedMinutes: 20,
  },
];

// Helper to clean up completed tasks older than 7 days while preserving lifetime stats
export function cleanupOlderTasks(tasks: TodaySparkGoal[]): {
  remainingTasks: TodaySparkGoal[];
  archivedXP: number;
  archivedMinutes: number;
  archivedCount: number;
} {
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const remainingTasks: TodaySparkGoal[] = [];
  let archivedXP = 0;
  let archivedMinutes = 0;
  let archivedCount = 0;

  tasks.forEach((t) => {
    // Only archive if completed AND older than 7 days
    const isCompletedOld = t.completed && t.completedAt && now - t.completedAt > SEVEN_DAYS_MS;
    if (isCompletedOld) {
      archivedXP += t.points || 0;
      archivedMinutes += t.actualMinutes || t.estimatedMinutes || 25;
      archivedCount += 1;
    } else {
      remainingTasks.push(t);
    }
  });

  return { remainingTasks, archivedXP, archivedMinutes, archivedCount };
}

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
    estimatedMinutes: 30,
    actualMinutes: 30,
    completed: true,
    completedAt: Date.now() - 3600000 * 3,
    createdAt: Date.now() - 3600000 * 5,
    dateKey: getTodayDateKey(),
    linkedWeeklyGoalId: "weekly-1",
    notes: "Never stray from the center reference point.",
    subtasks: [
      { id: "sub-1", title: "Fajr in congregation & morning adhkar", completed: true },
      { id: "sub-2", title: "15 minutes deep Quran contemplation", completed: true },
    ],
  },
  {
    id: "spark-2",
    title: "Quran Revision — 10 Pages Amukhta Precision Flow",
    category: "deen",
    priority: "high",
    points: 15,
    estimatedMinutes: 45,
    completed: false,
    createdAt: Date.now() - 3600000 * 2,
    dateKey: getTodayDateKey(),
    linkedWeeklyGoalId: "weekly-1",
    notes: "Review Surah An-Nisa mutashabihaat markers.",
    subtasks: [
      { id: "sub-3", title: "Pages 1-5 smooth recitation", completed: false },
      { id: "sub-4", title: "Pages 6-10 mutashabihaat check", completed: false },
    ],
  },
  {
    id: "spark-3",
    title: "Deep Work — Master Systems Architecture & Command Center",
    category: "intellect",
    priority: "high",
    points: 20,
    estimatedMinutes: 60,
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
    estimatedMinutes: 40,
    completed: false,
    createdAt: Date.now() - 1800000,
    dateKey: getTodayDateKey(),
    linkedWeeklyGoalId: "weekly-3",
  },
  {
    id: "spark-5",
    title: "Evening Murakaba — Self-examination & Tazkiyah Check",
    category: "tazkiyah",
    priority: "normal",
    points: 10,
    estimatedMinutes: 20,
    completed: false,
    createdAt: Date.now() - 900000,
    dateKey: getTodayDateKey(),
  },
];

// Helper to format minutes to "Xh Ym" or "Xm"
export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

// Capacity planning status
export interface CapacityStatus {
  status: "optimal" | "heavy" | "overload";
  label: string;
  bengaliLabel: string;
  badgeColor: string;
  borderColor: string;
  bgColor: string;
  description: string;
}

export function getDailyCapacityStatus(totalMinutes: number): CapacityStatus {
  if (totalMinutes <= 360) {
    // Up to 6 hours: Optimal
    return {
      status: "optimal",
      label: "Optimal Orbit",
      bengaliLabel: "Optimal Balance",
      badgeColor: "text-emerald-300",
      borderColor: "border-emerald-400/40",
      bgColor: "bg-emerald-500/15",
      description: "Daily focus commitment is within a healthy, sustainable threshold.",
    };
  } else if (totalMinutes <= 480) {
    // 6 - 8 hours: Heavy
    return {
      status: "heavy",
      label: "Heavy Flow",
      bengaliLabel: "High Focus Required",
      badgeColor: "text-amber-300",
      borderColor: "border-amber-400/40",
      bgColor: "bg-amber-500/15",
      description: "Demanding workload; maintain intense focus and schedule periodic breaks.",
    };
  } else {
    // 8+ hours: Overload alert!
    return {
      status: "overload",
      label: "Critical Capacity",
      bengaliLabel: "Overload Alert",
      badgeColor: "text-rose-400",
      borderColor: "border-rose-400/50",
      bgColor: "bg-rose-500/20",
      description: "Planned focus exceeds 8 hours! Defer secondary sparks to weekly sprints to prevent burnout.",
    };
  }
}

// Helper to calculate task decay / blackhole gravity state
export function getTaskDecayInfo(task: TodaySparkGoal) {
  if (task.completed) {
    return { isDecayed: false, daysPending: 0, effectivePoints: task.points };
  }
  const todayStr = getTodayDateKey();
  const taskDateStr = task.dateKey || todayStr;
  const todayTime = new Date(todayStr).getTime();
  const taskDateTime = new Date(taskDateStr).getTime();
  const diffTime = todayTime - taskDateTime;
  const daysDiff = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const daysPending = task.daysCarriedOver !== undefined ? Math.max(task.daysCarriedOver, daysDiff) : daysDiff;
  const isDecayed = daysPending >= 3;
  const effectivePoints = isDecayed ? Math.max(5, Math.round(task.points * 0.5)) : task.points;
  return { isDecayed, daysPending, effectivePoints };
}

// Default Seed for Today's Note
export const DEFAULT_DAILY_NOTE: DailyNoteEntry = {
  id: "note-today",
  dateKey: getTodayDateKey(),
  coreFocus: "Anchor the mind in Subhe Sadik; allow no trivial distraction to fracture deep work.",
  stateOfHeart: "clear_sky",
  spiritualAnchor: "হে আল্লাহ! আমার অন্তরকে আপনার আনুগত্যে অবিচল রাখুন, আজকের কাজকর্মে বরকত দান করুন এবং আমাকে নফসের অনিষ্ট থেকে রক্ষা করুন।",
  realityCheckStatus: "achieved",
  realityCheckNotes: "আজকের মূল লক্ষ্য সফলভাবে অর্জিত হয়েছে, দুপুরের দিকে সামান্য ক্লান্তি এসেছিল কিন্তু তা কাটিয়ে ওঠা সম্ভব হয়েছে।",
  theEclipse: "আসর পরবর্তী ২০ মিনিট অযথা নোটিফিকেশন চেক করে সময় অপচয় হয়েছে। কাল থেকে এই সময়ে ফোন দূরে রাখব।",
  tomorrowsOrbit: "সকাল ৬টায় কোনো স্ক্রিন নয়, কেবল কুরআন তিলাওয়াত ও গভীর ভাবনায় দিন শুরু করব।",
  ayahReminder: "“And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.”",
  ayahSource: "Surah At-Talaq: 3",
  shukr: "ফজরের জামাত, কুরআনের সান্নিধ্য এবং সুস্থ মস্তিষ্কে কাজ করতে পারার মহান নিয়ামতের জন্য শুকরিয়া।",
  shukrParticles: [
    {
      id: "shukr-seed-1",
      text: "ফজরের জামাতে শামিল হতে পারার মহান নিয়ামত।",
      createdAt: Date.now() - 3600000 * 8,
    },
    {
      id: "shukr-seed-2",
      text: "সুস্থ মস্তিষ্ক ও গভীর মনোযোগে কুরআন হিফজ করার তাওফীক।",
      createdAt: Date.now() - 3600000 * 4,
    },
    {
      id: "shukr-seed-3",
      text: "একটি পরিচ্ছন্ন ও শান্ত কর্মপরিবেশ পাওয়ার কৃতজ্ঞতা।",
      createdAt: Date.now() - 3600000 * 2,
    },
  ],
  thoughts: "",
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
