"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Flame,
  Award,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Send,
  Sun,
  Moon,
  Sunrise,
  Sunset,
} from "lucide-react";
import {
  DailySalahRecord,
  FeedbackResult,
  MAIN_PRAYERS,
  PrayerKey,
  PrayerMode,
  PrayerStatus,
} from "@/types/salah";
import { evaluateRewardOrShame } from "@/lib/salahStorage";
import { PostSalahDhikrModal } from "./PostSalahDhikrModal";

interface DailyTrackerTabProps {
  todayRecord: DailySalahRecord;
  streak: number;
  onUpdatePrayer: (prayerKey: PrayerKey, status: PrayerStatus) => void;
  onToggleOptional?: (key: "tahajjud" | "ishraq") => void;
  onQuickMakeUpKaza?: () => void;
}

export function DailyTrackerTab({
  todayRecord,
  streak,
  onUpdatePrayer,
  onToggleOptional,
  onQuickMakeUpKaza,
}: DailyTrackerTabProps) {
  const [activeDhikrPrayer, setActiveDhikrPrayer] = useState<{
    key: PrayerKey;
    bengaliName: string;
  } | null>(null);

  const [prayerModes, setPrayerModes] = useState<Record<PrayerKey, PrayerMode>>({
    fajr: "jamah",
    dhuhr: "jamah",
    asr: "individual",
    maghrib: "jamah",
    isha: "jamah",
  });

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(true);
  const [justSubmittedAnim, setJustSubmittedAnim] = useState<boolean>(false);

  const prayers = todayRecord.prayers;
  const prayedCount = Object.values(prayers).filter((s) => s === "prayed").length;
  const missedCount = Object.values(prayers).filter((s) => s === "missed").length;
  const isAllPrayed = prayedCount === 5;

  const feedback: FeedbackResult = evaluateRewardOrShame(todayRecord, streak);

  const getPrayerIcon = (key: PrayerKey) => {
    switch (key) {
      case "fajr":
        return Sunrise;
      case "dhuhr":
        return Sun;
      case "asr":
        return Sunset;
      case "maghrib":
        return Sunset;
      case "isha":
        return Moon;
    }
  };

  const handleSetPrayerStatus = (key: PrayerKey, status: PrayerStatus) => {
    onUpdatePrayer(key, status);
    setHasSubmitted(true);

    if (status === "prayed") {
      const willBePrayed = prayedCount + (prayers[key] !== "prayed" ? 1 : 0);
      if (willBePrayed === 5) {
        triggerCelebrationConfetti();
      }
    }
  };

  const handleToggleMode = (key: PrayerKey) => {
    setPrayerModes((prev) => ({
      ...prev,
      [key]: prev[key] === "jamah" ? "individual" : "jamah",
    }));
  };

  const triggerCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#10b981", "#38bdf8", "#fbbf24", "#a855f7"],
      });
    } catch {
      // ignore
    }
  };

  const handleSubmitTodayReport = () => {
    setHasSubmitted(true);
    setJustSubmittedAnim(true);
    setTimeout(() => setJustSubmittedAnim(false), 2000);

    if (isAllPrayed) {
      triggerCelebrationConfetti();
    }
  };

  const handleMarkAllPrayed = () => {
    (["fajr", "dhuhr", "asr", "maghrib", "isha"] as PrayerKey[]).forEach((k) => {
      onUpdatePrayer(k, "prayed");
    });
    setHasSubmitted(true);
    triggerCelebrationConfetti();
  };

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. HEADER & TODAY'S INVITATION
      ======================================================== */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[90px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-badge tracking-wider text-cyan-400 uppercase mb-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Today's Accountability • {dateFormatted}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading text-slate-100 font-bold">
              Which prayers have you performed today?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-subheading">
              Tap any prayer card below to mark it completed or missed. Instant feedback and rewards calculate live.
            </p>
          </div>

          {/* Quick Counter Pills */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-badge flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Completed: <strong className="text-sm font-bold">{prayedCount}</strong>/5
              </span>
            </div>

            {missedCount > 0 && (
              <div className="px-3.5 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-badge flex items-center gap-2 animate-pulse">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>
                  Missed: <strong className="text-sm font-bold">{missedCount}</strong>
                </span>
              </div>
            )}

            <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-badge flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Streak: {streak} days</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-[11px] font-subheading text-slate-400">
            <span>Daily Completion Rate</span>
            <span className="text-cyan-300 font-badge font-bold">
              {Math.round((prayedCount / 5) * 100)}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div
              className={`h-full rounded-full transition-all duration-500 ${
                isAllPrayed
                  ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 shadow-[0_0_12px_#34d399]"
                  : missedCount > 0
                  ? "bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500"
                  : "bg-gradient-to-r from-cyan-500 to-emerald-400"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(prayedCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          2. THE 5 PRAYER CARDS (DIRECT ONE-CLICK CHECK-IN)
      ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-badge uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Prayer Status Directly</span>
          </span>

          {prayedCount < 5 && (
            <button
              onClick={handleMarkAllPrayed}
              className="text-xs font-badge text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-4"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark all 5 as completed</span>
            </button>
          )}
        </div>

        {/* The 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {MAIN_PRAYERS.map((prayer, idx) => {
            const status = prayers[prayer.key] || "unmarked";
            const isPrayed = status === "prayed";
            const isMissed = status === "missed";
            const Icon = getPrayerIcon(prayer.key);
            const mode = prayerModes[prayer.key];

            return (
              <motion.div
                key={prayer.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-3xl border transition-all duration-200 flex flex-col justify-between relative ${
                  isPrayed
                    ? "bg-gradient-to-b from-emerald-950/60 to-slate-900/90 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/30"
                    : isMissed
                    ? "bg-gradient-to-b from-rose-950/60 to-slate-900/90 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/30"
                    : "bg-slate-900/70 border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  {/* Card Header: Icon + Name */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-xl border ${
                          isPrayed
                            ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                            : isMissed
                            ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                            : "bg-slate-800 border-white/5 text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-base font-heading font-semibold text-slate-100">
                          {prayer.bengaliName}
                        </h4>
                        <span className="text-[10px] font-badge text-cyan-300/80">
                          {prayer.englishName.split(" ")[1]?.replace("(", "").replace(")", "") || "Waqt"}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-badge text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-white/5">
                      {prayer.defaultTimeRange.split(" - ")[0]}
                    </span>
                  </div>

                  <p className="text-[12px] text-slate-300 font-subheading line-clamp-2 my-2 leading-relaxed">
                    {prayer.meaning}
                  </p>
                </div>

                {/* Direct Action Buttons Right Inside Card */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  {/* Status Toggle Button: Prayed */}
                  <button
                    onClick={() =>
                      handleSetPrayerStatus(prayer.key, isPrayed ? "unmarked" : "prayed")
                    }
                    className={`w-full py-2 px-3 rounded-xl text-xs font-badge transition-all flex items-center justify-center gap-1.5 ${
                      isPrayed
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-102 font-bold"
                        : "bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${isPrayed ? "text-slate-950" : "text-emerald-400"}`}
                    />
                    <span>{isPrayed ? "Completed ✓" : "Completed"}</span>
                  </button>

                  {/* Status Toggle Button: Missed */}
                  <button
                    onClick={() =>
                      handleSetPrayerStatus(prayer.key, isMissed ? "unmarked" : "missed")
                    }
                    className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-badge transition-all flex items-center justify-center gap-1.5 ${
                      isMissed
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 font-bold"
                        : "bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/5 hover:border-rose-500/30"
                    }`}
                  >
                    <XCircle
                      className={`w-3.5 h-3.5 ${isMissed ? "text-white" : "text-rose-400"}`}
                    />
                    <span>{isMissed ? "Marked as Missed" : "Missed / Kaza"}</span>
                  </button>

                  {/* Sub-features: Jam'ah vs Solo toggle & Tasbih */}
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <button
                      onClick={() => handleToggleMode(prayer.key)}
                      className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-badge"
                      title="Toggle Jam'ah or Solo"
                    >
                      <span>{mode === "jamah" ? "🕌 Jam'ah" : "📿 Solo"}</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveDhikrPrayer({
                          key: prayer.key,
                          bengaliName: prayer.bengaliName,
                        })
                      }
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-badge"
                      title="Post-prayer Tasbih counter"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Tasbih</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          3. SUBMIT / CONFIRM ACCOUNTABILITY BUTTON
      ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/40 backdrop-blur-xl gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-heading font-semibold text-slate-100">
              Confirm Today's Prayer Record
            </h4>
            <p className="text-xs text-slate-400 font-subheading">
              Selections save in real-time. Click to finalize today's accountability score and feedback.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmitTodayReport}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-badge font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transform active:scale-95"
        >
          <Send className="w-4 h-4 text-slate-950" />
          <span>Submit & View Results</span>
        </button>
      </div>

      {/* ========================================================
          4. INSTANT REWARD OR SHAME / ADMONITION RESULT CARD
      ======================================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={feedback.tone + prayedCount + missedCount + (justSubmittedAnim ? "anim" : "")}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className={`p-6 rounded-3xl border relative overflow-hidden backdrop-blur-xl shadow-2xl ${
            feedback.tone === "reward_perfect"
              ? "bg-gradient-to-r from-emerald-950/80 via-cyan-950/70 to-slate-900/90 border-emerald-400/60 shadow-[0_0_35px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50"
              : feedback.tone === "reward_good"
              ? "bg-gradient-to-r from-emerald-950/50 via-slate-900/70 to-cyan-950/40 border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.2)]"
              : feedback.tone === "shame_critical"
              ? "bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-amber-950/80 border-rose-500/70 shadow-[0_0_35px_rgba(244,63,94,0.35)] ring-1 ring-rose-500/50"
              : feedback.tone === "shame_warning"
              ? "bg-gradient-to-r from-amber-950/60 via-slate-900/70 to-rose-950/50 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
              : "bg-slate-900/70 border-white/10"
          }`}
        >
          {/* Subtle Ambient Light Orb */}
          <div
            className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[90px] pointer-events-none ${
              feedback.isReward ? "bg-emerald-400/25" : "bg-rose-500/25"
            }`}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-badge font-semibold tracking-wide border shadow-sm ${
                    feedback.isReward
                      ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300"
                      : "bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse"
                  }`}
                >
                  {feedback.isReward ? (
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span>{feedback.badgeTitle}</span>
                </span>

                {isAllPrayed && (
                  <span className="text-[11px] font-badge px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>نُورٌ عَلَىٰ نُورٍ (Light Upon Light)</span>
                  </span>
                )}

                {feedback.xpPoints !== 0 && (
                  <span
                    className={`text-[11px] font-badge px-2.5 py-0.5 rounded-full border ${
                      feedback.xpPoints > 0
                        ? "bg-cyan-950/70 border-cyan-500/40 text-cyan-300"
                        : "bg-red-950/70 border-red-500/40 text-rose-300"
                    }`}
                  >
                    {feedback.xpPoints > 0
                      ? `+${feedback.xpPoints} Spiritual XP`
                      : `${feedback.xpPoints} XP`}
                  </span>
                )}
              </div>

              <h4 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                {feedback.headline}
              </h4>

              <p className="text-sm text-slate-200 leading-relaxed">
                {feedback.message}
              </p>

              {/* Sacred Callout Quote */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <p className="text-xs text-amber-200/90 italic leading-relaxed">
                  &ldquo;{feedback.quoteOrHadith}&rdquo;
                </p>
                <div className="text-right text-[10px] font-mono text-slate-400">
                  — {feedback.source}
                </div>
              </div>
            </div>

            {/* Quick Action Button in Result */}
            <div className="flex flex-col gap-2.5 shrink-0 self-start w-full md:w-auto">
              {missedCount > 0 && onQuickMakeUpKaza && (
                <button
                  onClick={onQuickMakeUpKaza}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-wide transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-slate-950" />
                  <span>Make Up Missed Prayers Now</span>
                </button>
              )}

              {feedback.tone === "shame_critical" && (
                <div className="px-3.5 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Do not delay—perform wudu and bow in prostration!</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ========================================================
          5. OPTIONAL NAFL NAWAFIL (Tahajjud & Ishraq)
      ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Optional Voluntary Prayers (Celestial Light)</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">Spiritual Bonus</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tahajjud */}
          <button
            onClick={() => onToggleOptional && onToggleOptional("tahajjud")}
            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
              todayRecord.tahajjud
                ? "bg-amber-950/40 border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : "bg-slate-800/60 border-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div>
              <div className="text-xs font-semibold">Tahajjud & Qiyamul Layl</div>
              <div className="text-[11px] text-slate-400">
                Supplication in the profound stillness of the final third of night
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${
                todayRecord.tahajjud
                  ? "bg-amber-500 border-amber-400 text-slate-950"
                  : "border-slate-600 bg-slate-700/50"
              }`}
            >
              {todayRecord.tahajjud && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </button>

          {/* Ishraq */}
          <button
            onClick={() => onToggleOptional && onToggleOptional("ishraq")}
            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
              todayRecord.ishraq
                ? "bg-cyan-950/40 border-cyan-400/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "bg-slate-800/60 border-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div>
              <div className="text-xs font-semibold">Ishraq & Duha</div>
              <div className="text-[11px] text-slate-400">
                Morning gratitude and energetic inception after sunrise
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${
                todayRecord.ishraq
                  ? "bg-cyan-500 border-cyan-400 text-slate-950"
                  : "border-slate-600 bg-slate-700/50"
              }`}
            >
              {todayRecord.ishraq && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </div>

      {/* Post-Salah Digital Dhikr Modal */}
      {activeDhikrPrayer && (
        <PostSalahDhikrModal
          isOpen={true}
          onClose={() => setActiveDhikrPrayer(null)}
          prayerNameBn={activeDhikrPrayer.bengaliName}
        />
      )}
    </div>
  );
}
