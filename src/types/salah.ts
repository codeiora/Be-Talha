export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export type OptionalPrayerKey = "tahajjud" | "ishraq";

export type PrayerStatus = "prayed" | "missed" | "unmarked";

export interface PrayerDefinition {
  key: PrayerKey;
  bengaliName: string;
  englishName: string;
  defaultTimeRange: string;
  meaning: string;
  hadithSnippet: string;
  color: string;
  accentBorder: string;
}

export const MAIN_PRAYERS: PrayerDefinition[] = [
  {
    key: "fajr",
    bengaliName: "Fajr",
    englishName: "Fajr (Dawn)",
    defaultTimeRange: "04:30 - 05:50",
    meaning: "The first light of day and spiritual roots. Begins at the crack of dawn.",
    hadithSnippet: "Whoever prays the Fajr prayer is in the protection and custody of Allah.",
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-300",
    accentBorder: "border-emerald-500/40",
  },
  {
    key: "dhuhr",
    bengaliName: "Zuhr",
    englishName: "Zuhr (Midday)",
    defaultTimeRange: "11:45 - 03:30",
    meaning: "Steadfast focus and grounding in the middle of the day without straying from purpose.",
    hadithSnippet: "Before Zuhr, the gates of the heavens are opened for four units of prayer.",
    color: "from-amber-500/20 to-yellow-500/10 text-amber-300",
    accentBorder: "border-amber-500/40",
  },
  {
    key: "asr",
    bengaliName: "Asr",
    englishName: "Asr (Afternoon)",
    defaultTimeRange: "03:45 - 05:15",
    meaning: "“By time, indeed mankind is in loss.” Rigorous accountability of each fleeting moment.",
    hadithSnippet: "Whoever prays the two cool prayers (Fajr and Asr) will enter Paradise.",
    color: "from-cyan-500/20 to-blue-500/10 text-cyan-300",
    accentBorder: "border-cyan-500/40",
  },
  {
    key: "maghrib",
    bengaliName: "Maghrib",
    englishName: "Maghrib (Sunset)",
    defaultTimeRange: "05:25 - 06:40",
    meaning: "Conclusion of daytime toil, returning to roots, and evening contemplative stillness.",
    hadithSnippet: "Whoever observes the Maghrib prayer on time earns the boundless mercy of the Lord.",
    color: "from-orange-500/20 to-rose-500/10 text-orange-300",
    accentBorder: "border-orange-500/40",
  },
  {
    key: "isha",
    bengaliName: "Isha",
    englishName: "Isha (Nightfall)",
    defaultTimeRange: "07:00 - 04:30",
    meaning: "Serene night, deep study, and humble surrender before the Lord in prostration.",
    hadithSnippet: "Whoever prays Isha in congregation, it is as if he stood in prayer for half the night.",
    color: "from-indigo-500/20 to-purple-500/10 text-indigo-300",
    accentBorder: "border-indigo-500/40",
  },
];

export type PrayerMode = "jamah" | "individual" | "kaza" | "unmarked";
export type KhushuLevel = "deep" | "medium" | "low";

export interface PrayerDetail {
  status: PrayerStatus;
  mode?: PrayerMode;
  khushu?: KhushuLevel;
  takbeerUla?: boolean;
  dhikrDone?: boolean;
}

export interface DailySalahRecord {
  date: string; // "YYYY-MM-DD"
  prayers: Record<PrayerKey, PrayerStatus>;
  prayerDetails?: Partial<Record<PrayerKey, PrayerDetail>>;
  tahajjud?: boolean;
  ishraq?: boolean;
  notes?: string;
  updatedAt: number;
}

export interface DayWeeklyStat {
  date: string; // YYYY-MM-DD
  dayNameBn: string; // "Friday", "Saturday" etc.
  dayShortBn: string; // "Fri", "Sat"
  dayNumber: number; // 1 to 31
  prayers: Record<PrayerKey, PrayerStatus>;
  prayedCount: number;
  missedCount: number;
  unmarkedCount: number;
  isToday: boolean;
}

export interface WeeklySalahStats {
  startDate: string; // Friday YYYY-MM-DD
  endDate: string; // Thursday YYYY-MM-DD
  days: DayWeeklyStat[];
  totalPrayed: number;
  totalMissed: number;
  totalPrayersExpected: number;
  completionRate: number; // 0 to 100
  prayerBreakdown: Record<PrayerKey, { prayed: number; missed: number; total: number }>;
}

export interface DayMonthlyStat {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  dayNameBn: string;
  prayers: Record<PrayerKey, PrayerStatus>;
  prayedCount: number;
  missedCount: number;
  isToday: boolean;
}

export interface MonthlySalahStats {
  year: number;
  monthIndex: number; // 0 = Jan, 9 = Oct
  monthNameBn: string;
  totalDays: number;
  days: DayMonthlyStat[];
  totalPrayed: number;
  totalMissed: number;
  completionRate: number;
  prayerBreakdown: Record<PrayerKey, { prayed: number; missed: number; total: number; rate: number }>;
}

export interface MonthYearlyStat {
  monthIndex: number;
  monthNameBn: string;
  monthShortBn: string;
  totalPrayed: number;
  totalMissed: number;
  totalExpected: number;
  completionRate: number;
  prayerBreakdown: Record<PrayerKey, { prayed: number; missed: number }>;
}

export interface YearlySalahStats {
  year: number;
  months: MonthYearlyStat[];
  totalPrayed: number;
  totalMissed: number;
  overallRate: number;
  bestMonthName: string;
  prayerBreakdown: Record<PrayerKey, { prayed: number; missed: number; total: number; rate: number }>;
}

export type FeedbackTone = "reward_perfect" | "reward_good" | "shame_warning" | "shame_critical" | "neutral";

export interface FeedbackResult {
  tone: FeedbackTone;
  badgeTitle: string;
  headline: string;
  message: string;
  quoteOrHadith: string;
  source: string;
  xpPoints: number;
  isReward: boolean;
}

export const BENGALI_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const BENGALI_DAYS_FRIDAY_START = [
  { name: "Friday", short: "Fri", jsDayIndex: 5 },
  { name: "Saturday", short: "Sat", jsDayIndex: 6 },
  { name: "Sunday", short: "Sun", jsDayIndex: 0 },
  { name: "Monday", short: "Mon", jsDayIndex: 1 },
  { name: "Tuesday", short: "Tue", jsDayIndex: 2 },
  { name: "Wednesday", short: "Wed", jsDayIndex: 3 },
  { name: "Thursday", short: "Thu", jsDayIndex: 4 },
];

export function toBengaliNumber(num: number | string): string {
  return num.toString();
}
