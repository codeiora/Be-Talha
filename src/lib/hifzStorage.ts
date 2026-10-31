import {
  HifzSurahProgress,
  SabaqDailyRoutine,
  MutashabihatItem,
  AyahReflectionNote,
  HifzUserSettings,
  StarLuminosityState,
  SabqiItem,
  SabqiConfidenceRating,
  AmukhtaStreakData,
} from "@/types/hifz";
import { QURAN_SURAHS, DEFAULT_MUTASHABIHAT_ITEMS } from "./quranData";

const STORAGE_KEYS = {
  PROGRESS: "be_talha_hifz_progress_v1",
  ROUTINE: "be_talha_hifz_routine_v1",
  MUTASHABIHAT: "be_talha_hifz_mutashabihat_v1",
  REFLECTIONS: "be_talha_hifz_reflections_v1",
  SETTINGS: "be_talha_hifz_settings_v1",
  SABQI: "be_talha_hifz_sabqi_items_v1",
  AMUKHTA_STREAK: "be_talha_hifz_amukhta_streak_v1",
};

export const DEFAULT_HIFZ_SETTINGS: HifzUserSettings = {
  preferredReciter: "husary",
  defaultTakrarCount: 7,
  dailyAyahTarget: 3,
  soundEnabled: true,
  showEnglishTransliteration: true,
};

/**
 * Calculate dynamic luminosity and decay state based on days elapsed since last revision
 */
export function calculateLuminosity(
  lastRevisedAt: number,
  difficultyRating: 1 | 2 | 3 = 1,
  isMemorized: boolean = true
): { state: StarLuminosityState; score: number; daysElapsed: number } {
  if (!isMemorized) {
    return { state: "unmemorized", score: 0, daysElapsed: 999 };
  }

  const now = Date.now();
  const msInDay = 1000 * 60 * 60 * 24;
  const daysElapsed = Math.max(0, Math.floor((now - lastRevisedAt) / msInDay));

  let score = 100;
  let state: StarLuminosityState = "radiant";

  if (daysElapsed <= 3) {
    // 1-3 days: Radiant (100-90% brightness - full brilliant white starlight)
    score = Math.max(90, 100 - daysElapsed * 3);
    state = "radiant";
  } else if (daysElapsed <= 7) {
    // 4-7 days: Stable (85-65% brightness - softened golden starlight)
    score = Math.max(65, 85 - (daysElapsed - 3) * 5);
    state = "stable";
  } else if (daysElapsed <= 15) {
    // 8-15 days: Dimming (60-35% brightness - fading amber star, Daur due)
    score = Math.max(35, 60 - (daysElapsed - 7) * 3);
    state = "dimming";
  } else {
    // 15+ days: Critical / Dark (30-10% brightness - critical red dying star alert)
    score = Math.max(10, 30 - Math.min(20, (daysElapsed - 15) * 2));
    state = "critical";
  }

  return { state, score, daysElapsed };
}

/**
 * Initial Starter Progress:
 * Seeds Al-Fatihah, Al-Mulk, and 4 Quls so the user instantly sees
 * a living, breathing constellation with different star brightnesses.
 */
function getInitialProgress(): HifzSurahProgress[] {
  const now = Date.now();
  const msInDay = 1000 * 60 * 60 * 24;

  const starterSurahs = [
    { num: 1, daysAgo: 1, diff: 1 as const },   // Al-Fatihah (Radiant)
    { num: 67, daysAgo: 9, diff: 2 as const },  // Al-Mulk (Dimming / Fading Star)
    { num: 112, daysAgo: 0, diff: 1 as const }, // Al-Ikhlas (Radiant Supernova)
    { num: 113, daysAgo: 5, diff: 1 as const }, // Al-Falaq (Stable)
    { num: 114, daysAgo: 16, diff: 1 as const },// An-Nas (Critical / Urgent Revision)
  ];

  return starterSurahs.map((seed) => {
    const meta = QURAN_SURAHS.find((s) => s.number === seed.num);
    const totalAyahs = meta?.totalAyahs || 7;
    const ayahs = Array.from({ length: totalAyahs }, (_, i) => i + 1);
    const lastRev = now - seed.daysAgo * msInDay;
    const { state, score, daysElapsed } = calculateLuminosity(lastRev, seed.diff, true);

    return {
      surahNumber: seed.num,
      memorizedAyahs: ayahs,
      isFullyMemorized: true,
      lastRevisedAt: lastRev,
      luminosityState: state,
      luminosityScore: score,
      daysSinceRevision: daysElapsed,
      difficultyRating: seed.diff,
      sabqiUntil: seed.daysAgo < 7 ? now + (7 - seed.daysAgo) * msInDay : undefined,
    };
  });
}

/**
 * Initial Sample Reflections
 */
const DEFAULT_REFLECTIONS: AyahReflectionNote[] = [
  {
    id: "ref-1",
    surahNumber: 67,
    ayahNumber: 2,
    arabicText: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
    reflection: "The purpose of life and death is not merely volume of action, but excellence (ahsan 'amala). In memorization, quality and devotion over each letter outshine mere speed.",
    tags: ["Purpose", "Excellence", "Mulk"],
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: "ref-2",
    surahNumber: 1,
    ayahNumber: 5,
    arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    reflection: "You alone we worship, and You alone we ask for help. When Muraja'ah feels daunting, this verse anchors the heart: retention and memory are divine gifts.",
    tags: ["Tawakkul", "Fatihah", "Supplication"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

/* -------------------------------------------------------------------------- */
/* Persistence Functions                                                      */
/* -------------------------------------------------------------------------- */

export function loadHifzProgress(): HifzSurahProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) {
      const initial = getInitialProgress();
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(initial));
      return initial;
    }
    const parsed: HifzSurahProgress[] = JSON.parse(raw);
    // Recalculate dynamic decay on each load
    return parsed.map((item) => {
      const isMem = item.isFullyMemorized || item.memorizedAyahs.length > 0;
      const { state, score, daysElapsed } = calculateLuminosity(
        item.lastRevisedAt,
        item.difficultyRating,
        isMem
      );
      return {
        ...item,
        luminosityState: state,
        luminosityScore: score,
        daysSinceRevision: daysElapsed,
      };
    });
  } catch (err) {
    console.error("Error loading Hifz progress:", err);
    return [];
  }
}

export function saveHifzProgress(progress: HifzSurahProgress[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error("Error saving Hifz progress:", err);
  }
}

/**
 * Record a Revision (Daur / Muraja'ah) for a Surah.
 * This instantly restores the star to full radiance (100% luminous).
 */
export function recordSurahRevision(surahNumber: number): HifzSurahProgress[] {
  const current = loadHifzProgress();
  const now = Date.now();
  const existingIdx = current.findIndex((p) => p.surahNumber === surahNumber);

  if (existingIdx !== -1) {
    current[existingIdx] = {
      ...current[existingIdx],
      lastRevisedAt: now,
      luminosityState: "radiant",
      luminosityScore: 100,
      daysSinceRevision: 0,
    };
  } else {
    // If not in progress yet, initialize as fully memorized & radiant
    const meta = QURAN_SURAHS.find((s) => s.number === surahNumber);
    const totalAyahs = meta?.totalAyahs || 1;
    current.push({
      surahNumber,
      memorizedAyahs: Array.from({ length: totalAyahs }, (_, i) => i + 1),
      isFullyMemorized: true,
      lastRevisedAt: now,
      luminosityState: "radiant",
      luminosityScore: 100,
      daysSinceRevision: 0,
      difficultyRating: 1,
    });
  }

  saveHifzProgress(current);
  return current;
}

/**
 * Load & Save Amukhta Revision Streak
 */
export function loadAmukhtaStreak(): AmukhtaStreakData {
  const today = new Date().toISOString().split("T")[0];
  const defaultStreak: AmukhtaStreakData = {
    currentStreak: 3,
    bestStreak: 7,
    lastRevisionDate: today,
    totalRevisionsCount: 14,
  };

  if (typeof window === "undefined") return defaultStreak;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AMUKHTA_STREAK);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AMUKHTA_STREAK, JSON.stringify(defaultStreak));
      return defaultStreak;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading Amukhta streak:", err);
    return defaultStreak;
  }
}

export function saveAmukhtaStreak(streak: AmukhtaStreakData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.AMUKHTA_STREAK, JSON.stringify(streak));
  } catch (err) {
    console.error("Error saving Amukhta streak:", err);
  }
}

/**
 * Record an Amukhta Revision with automatic Streak progression & Supernova readiness
 */
export function recordAmukhtaRevision(surahNumber: number): {
  progressList: HifzSurahProgress[];
  streak: AmukhtaStreakData;
} {
  const progressList = recordSurahRevision(surahNumber);
  const streak = loadAmukhtaStreak();
  const today = new Date().toISOString().split("T")[0];

  if (streak.lastRevisionDate === today) {
    streak.totalRevisionsCount += 1;
  } else {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = d.toISOString().split("T")[0];

    if (streak.lastRevisionDate === yesterday) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1;
    }
    streak.bestStreak = Math.max(streak.bestStreak, streak.currentStreak);
    streak.lastRevisionDate = today;
    streak.totalRevisionsCount += 1;
  }

  saveAmukhtaStreak(streak);
  return { progressList, streak };
}

/**
 * Toggle or mark a specific Ayah as memorized
 */
export function toggleAyahMemorized(
  surahNumber: number,
  ayahNumber: number
): HifzSurahProgress[] {
  const current = loadHifzProgress();
  const meta = QURAN_SURAHS.find((s) => s.number === surahNumber);
  const total = meta?.totalAyahs || 1;
  const now = Date.now();

  const idx = current.findIndex((p) => p.surahNumber === surahNumber);
  if (idx !== -1) {
    const item = current[idx];
    const exists = item.memorizedAyahs.includes(ayahNumber);
    const newAyahs = exists
      ? item.memorizedAyahs.filter((a) => a !== ayahNumber)
      : [...item.memorizedAyahs, ayahNumber].sort((a, b) => a - b);
    
    const isFully = newAyahs.length === total;
    current[idx] = {
      ...item,
      memorizedAyahs: newAyahs,
      isFullyMemorized: isFully,
      lastRevisedAt: now,
      luminosityState: "radiant",
      luminosityScore: 100,
      daysSinceRevision: 0,
      sabqiUntil: now + 7 * 24 * 60 * 60 * 1000,
    };
  } else {
    current.push({
      surahNumber,
      memorizedAyahs: [ayahNumber],
      isFullyMemorized: total === 1,
      lastRevisedAt: now,
      luminosityState: "radiant",
      luminosityScore: 100,
      daysSinceRevision: 0,
      difficultyRating: 1,
      sabqiUntil: now + 7 * 24 * 60 * 60 * 1000,
    });
  }

  saveHifzProgress(current);
  return current;
}

/**
 * Load & Save Daily Routine (Sabaq, Sabqi, Amukhta)
 */
export function loadDailyRoutine(): SabaqDailyRoutine {
  const today = new Date().toISOString().split("T")[0];
  const defaultRoutine: SabaqDailyRoutine = {
    date: today,
    sabaqSurah: 67, // Default to Al-Mulk
    sabaqAyahStart: 1,
    sabaqAyahEnd: 3,
    sabaqCompleted: false,
    sabqiTargetSurahs: [112, 113],
    sabqiCompleted: false,
    amukhtaTargetSurahs: [67, 114],
    amukhtaCompleted: false,
    takrarCyclesDone: 0,
  };

  if (typeof window === "undefined") return defaultRoutine;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINE);
    if (!raw) return defaultRoutine;
    const parsed: SabaqDailyRoutine = JSON.parse(raw);
    if (parsed.date !== today) {
      // New day: keep previous targets or refresh date
      return { ...parsed, date: today, sabaqCompleted: false, sabqiCompleted: false, amukhtaCompleted: false, takrarCyclesDone: 0 };
    }
    return parsed;
  } catch (err) {
    console.error("Error loading daily routine:", err);
    return defaultRoutine;
  }
}

export function saveDailyRoutine(routine: SabaqDailyRoutine): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routine));
  } catch (err) {
    console.error("Error saving daily routine:", err);
  }
}

/**
 * Load & Save Mutashabihaat Notes
 */
export function loadMutashabihat(): MutashabihatItem[] {
  if (typeof window === "undefined") return DEFAULT_MUTASHABIHAT_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MUTASHABIHAT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MUTASHABIHAT, JSON.stringify(DEFAULT_MUTASHABIHAT_ITEMS));
      return DEFAULT_MUTASHABIHAT_ITEMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading mutashabihat:", err);
    return DEFAULT_MUTASHABIHAT_ITEMS;
  }
}

export function saveMutashabihat(items: MutashabihatItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.MUTASHABIHAT, JSON.stringify(items));
  } catch (err) {
    console.error("Error saving mutashabihat:", err);
  }
}

/**
 * Load & Save Tadabbur Reflections
 */
export function loadReflections(): AyahReflectionNote[] {
  if (typeof window === "undefined") return DEFAULT_REFLECTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(DEFAULT_REFLECTIONS));
      return DEFAULT_REFLECTIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading reflections:", err);
    return DEFAULT_REFLECTIONS;
  }
}

export function saveReflections(notes: AyahReflectionNote[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(notes));
  } catch (err) {
    console.error("Error saving reflections:", err);
  }
}

/**
 * Load & Save Settings
 */
export function loadHifzSettings(): HifzUserSettings {
  if (typeof window === "undefined") return DEFAULT_HIFZ_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_HIFZ_SETTINGS;
    return { ...DEFAULT_HIFZ_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error("Error loading settings:", err);
    return DEFAULT_HIFZ_SETTINGS;
  }
}

export function saveHifzSettings(settings: HifzUserSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error("Error saving settings:", err);
  }
}

/* -------------------------------------------------------------------------- */
/* Sabqi (Recent Revision Orbit) Persistence                                  */
/* -------------------------------------------------------------------------- */

export function getInitialSabqiItems(): SabqiItem[] {
  const now = Date.now();
  const dayMs = 1000 * 60 * 60 * 24;

  return [
    {
      id: "sabqi-67-1-10",
      surahNumber: 67,
      ayahStart: 1,
      ayahEnd: 10,
      completedAt: now - 2 * dayMs,
      lastRevisedAt: now - 1 * dayMs,
      confidenceRating: "hesitated",
      confidenceRatedAt: now - 1 * dayMs,
      notes: "Beginning of Juz 29; slight pause at transitions between ayahs 4 and 6.",
    },
    {
      id: "sabqi-67-11-20",
      surahNumber: 67,
      ayahStart: 11,
      ayahEnd: 20,
      completedAt: now - 4 * dayMs,
      lastRevisedAt: now - 3 * dayMs,
      confidenceRating: "weak", // Weak - will stay prioritized at the top
      confidenceRatedAt: now - 3 * dayMs,
      notes: "Waqf stops and connecting verses 12 and 13 need extra repetition cycles.",
    },
    {
      id: "sabqi-112-1-4",
      surahNumber: 112,
      ayahStart: 1,
      ayahEnd: 4,
      completedAt: now - 1 * dayMs,
      lastRevisedAt: now - 1 * dayMs,
      confidenceRating: "smooth",
      confidenceRatedAt: now - 1 * dayMs,
      notes: "Flawless pronunciation and smooth continuous recitation.",
    },
    {
      id: "sabqi-113-1-5",
      surahNumber: 113,
      ayahStart: 1,
      ayahEnd: 5,
      completedAt: now - 6 * dayMs,
      lastRevisedAt: now - 2 * dayMs,
      confidenceRating: "smooth",
      confidenceRatedAt: now - 2 * dayMs,
    },
    {
      id: "sabqi-114-1-6",
      surahNumber: 114,
      ayahStart: 1,
      ayahEnd: 6,
      completedAt: now - 9 * dayMs,
      lastRevisedAt: now - 9 * dayMs,
      confidenceRating: null, // Pending revision
    },
    {
      id: "sabqi-1-1-7",
      surahNumber: 1,
      ayahStart: 1,
      ayahEnd: 7,
      completedAt: now - 12 * dayMs,
      lastRevisedAt: now - 2 * dayMs,
      confidenceRating: "smooth",
      confidenceRatedAt: now - 2 * dayMs,
    },
  ];
}

export function loadSabqiItems(): SabqiItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SABQI);
    if (!raw) {
      const initial = getInitialSabqiItems();
      localStorage.setItem(STORAGE_KEYS.SABQI, JSON.stringify(initial));
      return initial;
    }
    const parsed: SabqiItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = getInitialSabqiItems();
      localStorage.setItem(STORAGE_KEYS.SABQI, JSON.stringify(initial));
      return initial;
    }
    // Migrate any legacy Bengali sample notes to English
    return parsed.map((item) => {
      if (item.notes === "পারা ২৯ এর শুরুর অংশ, আয়াত ৪-৬ এর সংযোগে কিছুটা আটকেছিল।") {
        return { ...item, notes: "Beginning of Juz 29; slight pause at transitions between ayahs 4 and 6." };
      }
      if (item.notes === "আয়াত ১২ ও ১৩ এর ওয়াকফ এবং মিলিয়ে পড়ার জায়গাগুলো আরো কয়েকবার তাকরার দরকার।") {
        return { ...item, notes: "Waqf stops and connecting verses 12 and 13 need extra repetition cycles." };
      }
      if (item.notes === "পুরোপুরি স্পষ্ট ও বিশুদ্ধ উচ্চারণ।") {
        return { ...item, notes: "Flawless pronunciation and smooth continuous recitation." };
      }
      return item;
    });
  } catch (err) {
    console.error("Error loading Sabqi items:", err);
    return getInitialSabqiItems();
  }
}

export function saveSabqiItems(items: SabqiItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SABQI, JSON.stringify(items));
  } catch (err) {
    console.error("Error saving Sabqi items:", err);
  }
}

export function addSabqiItem(
  item: Omit<SabqiItem, "id" | "lastRevisedAt"> & Partial<Pick<SabqiItem, "id" | "lastRevisedAt">>
): SabqiItem[] {
  const current = loadSabqiItems();
  const id = item.id || `sabqi-${item.surahNumber}-${item.ayahStart}-${item.ayahEnd}-${Date.now()}`;
  const now = Date.now();

  // Check if identical range already exists
  const existingIdx = current.findIndex(
    (s) => s.surahNumber === item.surahNumber && s.ayahStart === item.ayahStart && s.ayahEnd === item.ayahEnd
  );

  if (existingIdx !== -1) {
    current[existingIdx] = {
      ...current[existingIdx],
      ...item,
      id: current[existingIdx].id,
      lastRevisedAt: item.lastRevisedAt || now,
    };
  } else {
    current.unshift({
      id,
      surahNumber: item.surahNumber,
      ayahStart: item.ayahStart,
      ayahEnd: item.ayahEnd,
      completedAt: item.completedAt || now,
      lastRevisedAt: item.lastRevisedAt || now,
      confidenceRating: item.confidenceRating || null,
      confidenceRatedAt: item.confidenceRatedAt,
      notes: item.notes,
      isCustom: item.isCustom,
    });
  }

  saveSabqiItems(current);
  return current;
}

export function updateSabqiRating(id: string, rating: SabqiConfidenceRating): SabqiItem[] {
  const current = loadSabqiItems();
  const now = Date.now();
  const idx = current.findIndex((item) => item.id === id);

  if (idx !== -1) {
    current[idx] = {
      ...current[idx],
      confidenceRating: rating,
      confidenceRatedAt: now,
      lastRevisedAt: now,
    };
    saveSabqiItems(current);

    // Also update parent Surah luminosity in Hifz progress
    try {
      const progressList = loadHifzProgress();
      const pIdx = progressList.findIndex((p) => p.surahNumber === current[idx].surahNumber);
      if (pIdx !== -1) {
        if (rating === "smooth") {
          progressList[pIdx].lastRevisedAt = now;
          progressList[pIdx].luminosityState = "radiant";
          progressList[pIdx].luminosityScore = 100;
          progressList[pIdx].daysSinceRevision = 0;
        } else if (rating === "weak") {
          progressList[pIdx].difficultyRating = 3;
        }
        saveHifzProgress(progressList);
      }
    } catch {
      // non-critical
    }
  }

  return current;
}

export function deleteSabqiItem(id: string): SabqiItem[] {
  const current = loadSabqiItems();
  const filtered = current.filter((item) => item.id !== id);
  saveSabqiItems(filtered);
  return filtered;
}
