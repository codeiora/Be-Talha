export type StarLuminosityState = "radiant" | "stable" | "dimming" | "critical" | "unmemorized";

export type HifzCluster = "tiwal" | "miun" | "mathani" | "tabarak" | "amma";

export type SabqiConfidenceRating = "smooth" | "hesitated" | "weak";

export interface SabqiItem {
  id: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  completedAt: number; // Unix timestamp when completed as Sabaq
  lastRevisedAt: number; // Unix timestamp when last revised in Sabqi
  confidenceRating?: SabqiConfidenceRating | null;
  confidenceRatedAt?: number;
  notes?: string;
  isCustom?: boolean;
}

export interface HifzSurahMeta {
  number: number;
  nameArabic: string;
  nameBangla: string;
  nameEnglish: string;
  meaningBangla: string;
  totalAyahs: number;
  juzNumber: number;
  revelationType: "Meccan" | "Medinan";
  cluster: HifzCluster;
  // Position on the cosmic sky canvas (percentage 0 to 100)
  x: number;
  y: number;
}

export interface HifzSurahProgress {
  surahNumber: number;
  memorizedAyahs: number[]; // e.g. [1, 2, 3] or all
  isFullyMemorized: boolean;
  lastRevisedAt: number; // Unix timestamp
  luminosityState: StarLuminosityState;
  luminosityScore: number; // 0 to 100
  daysSinceRevision: number;
  difficultyRating: 1 | 2 | 3; // 1 = easy, 3 = challenging (decays faster)
  sabqiUntil?: number; // timestamp until which it is kept in Sabqi queue
  notes?: string;
}

export interface SabaqDailyRoutine {
  date: string; // YYYY-MM-DD
  sabaqSurah: number;
  sabaqAyahStart: number;
  sabaqAyahEnd: number;
  sabaqCompleted: boolean;
  sabqiTargetSurahs: number[];
  sabqiCompleted: boolean;
  amukhtaTargetSurahs: number[];
  amukhtaCompleted: boolean;
  takrarCyclesDone: number;
}

export interface MutashabihatItem {
  id: string;
  title: string;
  surahA: number;
  ayahA: number;
  textA: string;
  translationA: string;
  surahB: number;
  ayahB: number;
  textB: string;
  translationB: string;
  differenceNote: string;
  tip?: string;
  tags?: string[];
  isCustom?: boolean;
}

export interface AyahReflectionNote {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  arabicText?: string;
  reflection: string;
  tags: string[]; // e.g. ["Sabr", "Tawakkul", "Akhirah"]
  createdAt: number;
  updatedAt: number;
}

export type ReciterId = "husary" | "alafasy";

export interface AmukhtaStreakData {
  currentStreak: number;
  bestStreak: number;
  lastRevisionDate: string; // YYYY-MM-DD
  totalRevisionsCount: number;
}

export interface HifzUserSettings {
  preferredReciter: ReciterId;
  defaultTakrarCount: number; // default e.g. 7 or 10
  dailyAyahTarget: number; // default e.g. 3 or 5
  soundEnabled: boolean;
  showEnglishTransliteration: boolean;
}
