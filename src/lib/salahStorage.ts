import {
  DailySalahRecord,
  FeedbackResult,
  MAIN_PRAYERS,
  MonthlySalahStats,
  PrayerKey,
  PrayerStatus,
  WeeklySalahStats,
  YearlySalahStats,
  BENGALI_DAYS_FRIDAY_START,
  BENGALI_MONTHS,
} from "@/types/salah";

export const STORAGE_KEY_SALAH = "be_talha_salah_tracker_v2";

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Generate realistic historical seed data so charts are immediately populated
 * from earlier in the year up to the present.
 */
export function generateSeedData(): Record<string, DailySalahRecord> {
  const records: Record<string, DailySalahRecord> = {};
  const today = new Date();
  const currentYear = today.getFullYear();

  // Generate for the entire current year up to today, plus a few weeks ahead as unmarked
  const startOfYear = new Date(currentYear, 0, 1);
  const endLimit = new Date(today);
  endLimit.setDate(today.getDate() + 7);

  const loop = new Date(startOfYear);

  while (loop <= endLimit) {
    const key = formatDateKey(loop);
    const isPast = loop < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = loop.toDateString() === today.toDateString();

    if (isPast) {
      // Deterministic realistic seed with pseudo-random pattern based on date
      const dayNum = loop.getDate();
      const monthNum = loop.getMonth();
      const seedVal = (dayNum * 13 + monthNum * 29) % 100;

      // Realistic high-consistency pattern (80-95% adherence)
      let fajrStatus: PrayerStatus = seedVal % 15 === 0 ? "missed" : "prayed";
      let dhuhrStatus: PrayerStatus = seedVal % 20 === 0 ? "missed" : "prayed";
      let asrStatus: PrayerStatus = seedVal % 12 === 0 ? "missed" : "prayed";
      let maghribStatus: PrayerStatus = seedVal % 25 === 0 ? "missed" : "prayed";
      let ishaStatus: PrayerStatus = seedVal % 14 === 0 ? "missed" : "prayed";

      // On Fridays, high attendance
      if (loop.getDay() === 5) {
        dhuhrStatus = "prayed";
        maghribStatus = "prayed";
      }

      records[key] = {
        date: key,
        prayers: {
          fajr: fajrStatus,
          dhuhr: dhuhrStatus,
          asr: asrStatus,
          maghrib: maghribStatus,
          isha: ishaStatus,
        },
        tahajjud: seedVal > 60,
        ishraq: seedVal > 50,
        updatedAt: loop.getTime(),
      };
    } else if (isToday) {
      // Today: active realistic starting state
      records[key] = {
        date: key,
        prayers: {
          fajr: "prayed",
          dhuhr: "prayed",
          asr: "unmarked",
          maghrib: "unmarked",
          isha: "unmarked",
        },
        tahajjud: true,
        ishraq: true,
        updatedAt: Date.now(),
      };
    } else {
      // Future days in week: unmarked
      records[key] = {
        date: key,
        prayers: {
          fajr: "unmarked",
          dhuhr: "unmarked",
          asr: "unmarked",
          maghrib: "unmarked",
          isha: "unmarked",
        },
        updatedAt: Date.now(),
      };
    }

    loop.setDate(loop.getDate() + 1);
  }

  return records;
}

export function loadSalahRecords(): Record<string, DailySalahRecord> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SALAH);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read salah records from localStorage:", err);
  }

  // If no records, generate seed data and persist
  const seed = generateSeedData();
  saveAllSalahRecords(seed);
  return seed;
}

export function saveAllSalahRecords(records: Record<string, DailySalahRecord>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_SALAH, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to write salah records to localStorage:", err);
  }
}

export function getOrCreateRecordForDate(
  records: Record<string, DailySalahRecord>,
  dateStr: string
): DailySalahRecord {
  if (records[dateStr]) {
    return records[dateStr];
  }
  return {
    date: dateStr,
    prayers: {
      fajr: "unmarked",
      dhuhr: "unmarked",
      asr: "unmarked",
      maghrib: "unmarked",
      isha: "unmarked",
    },
    updatedAt: Date.now(),
  };
}

/**
 * Calculates start of the week that begins on Friday.
 * If given Sunday, Friday was 2 days ago.
 * If given Friday, Friday is today.
 */
export function getFridayOfWeek(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const jsDay = date.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  const diff = (jsDay - 5 + 7) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function calculateWeeklyStats(
  records: Record<string, DailySalahRecord>,
  anchorDate: Date
): WeeklySalahStats {
  const fridayStart = getFridayOfWeek(anchorDate);
  const todayStr = formatDateKey(new Date());

  const days: WeeklySalahStats["days"] = [];
  let totalPrayed = 0;
  let totalMissed = 0;
  let totalPrayersExpected = 0;

  const prayerBreakdown: WeeklySalahStats["prayerBreakdown"] = {
    fajr: { prayed: 0, missed: 0, total: 0 },
    dhuhr: { prayed: 0, missed: 0, total: 0 },
    asr: { prayed: 0, missed: 0, total: 0 },
    maghrib: { prayed: 0, missed: 0, total: 0 },
    isha: { prayed: 0, missed: 0, total: 0 },
  };

  const runner = new Date(fridayStart);

  for (let i = 0; i < 7; i++) {
    const dateKey = formatDateKey(runner);
    const dayConfig = BENGALI_DAYS_FRIDAY_START[i];
    const rec = getOrCreateRecordForDate(records, dateKey);

    let pCount = 0;
    let mCount = 0;
    let uCount = 0;

    (["fajr", "dhuhr", "asr", "maghrib", "isha"] as PrayerKey[]).forEach((pKey) => {
      const st = rec.prayers[pKey] || "unmarked";
      if (st === "prayed") {
        pCount++;
        prayerBreakdown[pKey].prayed++;
        prayerBreakdown[pKey].total++;
      } else if (st === "missed") {
        mCount++;
        prayerBreakdown[pKey].missed++;
        prayerBreakdown[pKey].total++;
      } else {
        uCount++;
      }
    });

    totalPrayed += pCount;
    totalMissed += mCount;
    totalPrayersExpected += 5;

    days.push({
      date: dateKey,
      dayNameBn: dayConfig.name,
      dayShortBn: dayConfig.short,
      dayNumber: runner.getDate(),
      prayers: { ...rec.prayers },
      prayedCount: pCount,
      missedCount: mCount,
      unmarkedCount: uCount,
      isToday: dateKey === todayStr,
    });

    runner.setDate(runner.getDate() + 1);
  }

  const thursDate = new Date(runner);
  thursDate.setDate(thursDate.getDate() - 1);

  const completed = totalPrayed + totalMissed;
  const completionRate = completed > 0 ? Math.round((totalPrayed / completed) * 100) : 0;

  return {
    startDate: formatDateKey(fridayStart),
    endDate: formatDateKey(thursDate),
    days,
    totalPrayed,
    totalMissed,
    totalPrayersExpected,
    completionRate,
    prayerBreakdown,
  };
}

export function calculateMonthlyStats(
  records: Record<string, DailySalahRecord>,
  year: number,
  monthIndex: number
): MonthlySalahStats {
  const todayStr = formatDateKey(new Date());
  const monthNameBn = BENGALI_MONTHS[monthIndex];
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();

  const days: MonthlySalahStats["days"] = [];
  let totalPrayed = 0;
  let totalMissed = 0;

  const prayerBreakdown: MonthlySalahStats["prayerBreakdown"] = {
    fajr: { prayed: 0, missed: 0, total: 0, rate: 0 },
    dhuhr: { prayed: 0, missed: 0, total: 0, rate: 0 },
    asr: { prayed: 0, missed: 0, total: 0, rate: 0 },
    maghrib: { prayed: 0, missed: 0, total: 0, rate: 0 },
    isha: { prayed: 0, missed: 0, total: 0, rate: 0 },
  };

  const weekdayNamesBn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, monthIndex, day);
    const dateKey = formatDateKey(d);
    const dayNameBn = weekdayNamesBn[d.getDay()];
    const rec = getOrCreateRecordForDate(records, dateKey);

    let pCount = 0;
    let mCount = 0;

    (["fajr", "dhuhr", "asr", "maghrib", "isha"] as PrayerKey[]).forEach((pKey) => {
      const st = rec.prayers[pKey] || "unmarked";
      if (st === "prayed") {
        pCount++;
        prayerBreakdown[pKey].prayed++;
        prayerBreakdown[pKey].total++;
      } else if (st === "missed") {
        mCount++;
        prayerBreakdown[pKey].missed++;
        prayerBreakdown[pKey].total++;
      }
    });

    totalPrayed += pCount;
    totalMissed += mCount;

    days.push({
      date: dateKey,
      dayOfMonth: day,
      dayNameBn,
      prayers: { ...rec.prayers },
      prayedCount: pCount,
      missedCount: mCount,
      isToday: dateKey === todayStr,
    });
  }

  // Calculate rates per prayer
  Object.keys(prayerBreakdown).forEach((k) => {
    const key = k as PrayerKey;
    const item = prayerBreakdown[key];
    item.rate = item.total > 0 ? Math.round((item.prayed / item.total) * 100) : 0;
  });

  const totalMarked = totalPrayed + totalMissed;
  const completionRate = totalMarked > 0 ? Math.round((totalPrayed / totalMarked) * 100) : 0;

  return {
    year,
    monthIndex,
    monthNameBn,
    totalDays,
    days,
    totalPrayed,
    totalMissed,
    completionRate,
    prayerBreakdown,
  };
}

export function calculateYearlyStats(
  records: Record<string, DailySalahRecord>,
  year: number
): YearlySalahStats {
  const months: YearlySalahStats["months"] = [];
  let totalPrayed = 0;
  let totalMissed = 0;

  const prayerBreakdown: YearlySalahStats["prayerBreakdown"] = {
    fajr: { prayed: 0, missed: 0, total: 0, rate: 0 },
    dhuhr: { prayed: 0, missed: 0, total: 0, rate: 0 },
    asr: { prayed: 0, missed: 0, total: 0, rate: 0 },
    maghrib: { prayed: 0, missed: 0, total: 0, rate: 0 },
    isha: { prayed: 0, missed: 0, total: 0, rate: 0 },
  };

  let bestMonthName = BENGALI_MONTHS[0];
  let highestRate = -1;

  for (let m = 0; m < 12; m++) {
    const monthStats = calculateMonthlyStats(records, year, m);
    totalPrayed += monthStats.totalPrayed;
    totalMissed += monthStats.totalMissed;

    (["fajr", "dhuhr", "asr", "maghrib", "isha"] as PrayerKey[]).forEach((pKey) => {
      prayerBreakdown[pKey].prayed += monthStats.prayerBreakdown[pKey].prayed;
      prayerBreakdown[pKey].missed += monthStats.prayerBreakdown[pKey].missed;
      prayerBreakdown[pKey].total += monthStats.prayerBreakdown[pKey].total;
    });

    if (monthStats.completionRate > highestRate && monthStats.totalPrayed > 0) {
      highestRate = monthStats.completionRate;
      bestMonthName = BENGALI_MONTHS[m];
    }

    const monthPrayerBreakdown = {
      fajr: { prayed: monthStats.prayerBreakdown.fajr.prayed, missed: monthStats.prayerBreakdown.fajr.missed },
      dhuhr: { prayed: monthStats.prayerBreakdown.dhuhr.prayed, missed: monthStats.prayerBreakdown.dhuhr.missed },
      asr: { prayed: monthStats.prayerBreakdown.asr.prayed, missed: monthStats.prayerBreakdown.asr.missed },
      maghrib: { prayed: monthStats.prayerBreakdown.maghrib.prayed, missed: monthStats.prayerBreakdown.maghrib.missed },
      isha: { prayed: monthStats.prayerBreakdown.isha.prayed, missed: monthStats.prayerBreakdown.isha.missed },
    };

    months.push({
      monthIndex: m,
      monthNameBn: BENGALI_MONTHS[m],
      monthShortBn: BENGALI_MONTHS[m].substring(0, 4),
      totalPrayed: monthStats.totalPrayed,
      totalMissed: monthStats.totalMissed,
      totalExpected: monthStats.totalDays * 5,
      completionRate: monthStats.completionRate,
      prayerBreakdown: monthPrayerBreakdown,
    });
  }

  Object.keys(prayerBreakdown).forEach((k) => {
    const key = k as PrayerKey;
    const item = prayerBreakdown[key];
    item.rate = item.total > 0 ? Math.round((item.prayed / item.total) * 100) : 0;
  });

  const totalEvaluated = totalPrayed + totalMissed;
  const overallRate = totalEvaluated > 0 ? Math.round((totalPrayed / totalEvaluated) * 100) : 0;

  return {
    year,
    months,
    totalPrayed,
    totalMissed,
    overallRate,
    bestMonthName: highestRate > 0 ? bestMonthName : "October",
    prayerBreakdown,
  };
}

/**
 * Calculates current streak of days where at least 4 prayers were prayed and no kaza.
 */
export function calculateCurrentStreak(records: Record<string, DailySalahRecord>): number {
  let streak = 0;
  const today = new Date();
  const runner = new Date(today);

  // Check today or start from yesterday if today is ongoing
  const todayKey = formatDateKey(runner);
  const todayRec = records[todayKey];
  if (todayRec) {
    const prayed = Object.values(todayRec.prayers).filter((s) => s === "prayed").length;
    const missed = Object.values(todayRec.prayers).filter((s) => s === "missed").length;
    if (missed === 0 && prayed >= 1) {
      streak++;
    }
  }

  runner.setDate(runner.getDate() - 1);

  for (let i = 0; i < 90; i++) {
    const key = formatDateKey(runner);
    const rec = records[key];
    if (!rec) break;

    const prayed = Object.values(rec.prayers).filter((s) => s === "prayed").length;
    const missed = Object.values(rec.prayers).filter((s) => s === "missed").length;

    if (prayed >= 4 && missed === 0) {
      streak++;
      runner.setDate(runner.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Evaluates today's record and generates a Reward or Shame response.
 */
export function evaluateRewardOrShame(
  todayRecord: DailySalahRecord,
  streak: number
): FeedbackResult {
  const prayers = todayRecord.prayers;
  let prayed = 0;
  let missed = 0;
  let unmarked = 0;

  MAIN_PRAYERS.forEach((p) => {
    const st = prayers[p.key] || "unmarked";
    if (st === "prayed") prayed++;
    else if (st === "missed") missed++;
    else unmarked++;
  });

  // 1. Perfect 5/5 Prayers Prayed
  if (prayed === 5) {
    return {
      tone: "reward_perfect",
      isReward: true,
      badgeTitle: "Shuktara Believer • Full Radiance",
      headline: "🏆 Celestial Mercy & Divine Reward!",
      message: `Masha'Allah! All 5 daily prayers were performed with complete devotion and focus today. Under your Lord's divine protection, your day is illuminated and blessed. Stay steadfast—you are the winged morning star!`,
      quoteOrHadith: "The Messenger of Allah (ﷺ) said: “Whoever observes the two cool prayers (Fajr and Asr) regularly will certainly enter Paradise.”",
      source: "Sahih al-Bukhari & Muslim",
      xpPoints: 250 + streak * 20,
    };
  }

  // 2. Good ongoing adherence (3-4 prayed, no missed)
  if (missed === 0 && prayed >= 3) {
    return {
      tone: "reward_good",
      isReward: true,
      badgeTitle: "Steadfast Luminary • Steps of Light",
      headline: "✨ Excellent Progress! You are in sacred rhythm.",
      message: `Alhamdulillah! No prayers missed so far (${prayed}/5 completed). Complete the remaining prayers on time to crown today in divine grace.`,
      quoteOrHadith: "The Messenger of Allah (ﷺ) said: “Whoever prays the dawn prayer is under the divine protection of Allah.”",
      source: "Sahih Muslim",
      xpPoints: 120,
    };
  }

  // 3. Critical: Multiple missed prayers
  if (missed >= 2) {
    return {
      tone: "shame_critical",
      isReward: false,
      badgeTitle: "Urgent Wake-Up Call • Critical Straying",
      headline: "⚡ Warning! You are losing your anchor point!",
      message: `Alas! Today already ${missed} prayers have been missed. Sloth and distraction are eroding your spiritual roots. Turn back in sincere repentance and make up these prayers now!`,
      quoteOrHadith: "The Quran states: “Then there succeeded them successors who neglected prayer and pursued desires; so they will surely meet ruin.”",
      source: "Surah Maryam, Ayah 59",
      xpPoints: -100,
    };
  }

  // 4. Warning: 1 missed prayer
  if (missed === 1) {
    return {
      tone: "shame_warning",
      isReward: false,
      badgeTitle: "Call to Repentance & Make-up",
      headline: "⚠️ A prayer was missed! Return quickly.",
      message: `A prayer was missed today. Sloth overtook you. Before going to sleep, make up this missed prayer and seek forgiveness from Allah. Prayer is your spiritual armor!`,
      quoteOrHadith: "The Messenger of Allah (ﷺ) said: “The first matter that the slave will be brought to account for on the Day of Judgment is the prayer.”",
      source: "Jami' at-Tirmidhi",
      xpPoints: -30,
    };
  }

  // 5. Still in early morning / early progress
  if (prayed >= 1 && missed === 0) {
    return {
      tone: "reward_good",
      isReward: true,
      badgeTitle: "Dawn Inception",
      headline: "🌅 Sacred Beginning! Remain steadfast through the day.",
      message: `Your journey began in the quiet light of Fajr dawn. Turn every prayer into your spiritual sanctuary today.`,
      quoteOrHadith: "“Indeed, prayer has been decreed upon the believers a decree of specified times.”",
      source: "Surah An-Nisa, Ayah 103",
      xpPoints: 50,
    };
  }

  // 6. Neutral: Not yet marked today
  return {
    tone: "neutral",
    isReward: false,
    badgeTitle: "Accountability Check",
    headline: "Take account of yourselves before you are held to account",
    message: "Have today's prayers been completed? Update your prayer tracker to keep your spiritual compass aligned.",
    quoteOrHadith: "Umar ibn al-Khattab (RA) said: “Take account of yourselves before you are called to account.”",
    source: "Imam Ahmad, Kitab az-Zuhd",
    xpPoints: 0,
  };
}
