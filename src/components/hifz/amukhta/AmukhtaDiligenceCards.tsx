"use client";

import React from "react";
import {
  Flame,
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Layers,
  Star,
  Activity,
} from "lucide-react";
import { HifzSurahProgress, AmukhtaStreakData } from "@/types/hifz";
import { getSurahMeta } from "@/lib/quranData";

interface AmukhtaDiligenceCardsProps {
  progressList: HifzSurahProgress[];
  streakData: AmukhtaStreakData;
}

export function AmukhtaDiligenceCards({
  progressList,
  streakData,
}: AmukhtaDiligenceCardsProps) {
  const memorized = progressList.filter(
    (p) => p.isFullyMemorized || p.memorizedAyahs.length > 0
  );

  // 1. Memory Retention Rate % (Weighted average score)
  const averageHealth =
    memorized.length > 0
      ? Math.round(
          memorized.reduce((sum, item) => sum + item.luminosityScore, 0) /
            memorized.length
        )
      : 100;

  // 2. Total Amukhta counts (Total surahs, total distinct paras, total ayahs)
  const totalSurahs = memorized.length;
  const distinctParas = new Set(
    memorized.map((item) => {
      const meta = getSurahMeta(item.surahNumber);
      return meta?.juzNumber || 1;
    })
  ).size;

  const totalAyahs = memorized.reduce((sum, item) => {
    return sum + item.memorizedAyahs.length;
  }, 0);

  // 3. Starlight distribution breakdown
  const radiantCount = memorized.filter((p) => p.luminosityState === "radiant").length;
  const stableCount = memorized.filter((p) => p.luminosityState === "stable").length;
  const dimmingCount = memorized.filter((p) => p.luminosityState === "dimming").length;
  const criticalCount = memorized.filter((p) => p.luminosityState === "critical").length;

  // 4. Streak Alert: check if user revised today
  const today = new Date().toISOString().split("T")[0];
  const revisedToday = streakData.lastRevisionDate === today;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Memory Retention Rate */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-slate-950/80 border border-emerald-500/25 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-badge px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {averageHealth >= 85 ? "Celestial State" : "Needs Daur"}
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-heading font-extrabold text-white">
              {averageHealth}%
            </span>
            <span className="text-xs font-badge text-emerald-400 font-semibold">
              Active Memory Noor
            </span>
          </div>
          <p className="text-xs font-bengali text-slate-300 mt-1">
            আপনার মুখস্থ অংশের {averageHealth}% জ্যোতি বর্তমানে সতেজ ও প্রজ্বলিত।
          </p>
        </div>

        {/* Spectrum mini bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] font-badge text-slate-400">
            <span>Starlight Spectrum:</span>
            <span className="text-white font-mono">
              {radiantCount}W • {stableCount}Y • {dimmingCount}O • {criticalCount}R
            </span>
          </div>
          <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-900 border border-white/10">
            <div
              style={{ width: `${(radiantCount / Math.max(1, totalSurahs)) * 100}%` }}
              className="bg-white shadow-[0_0_8px_#ffffff]"
              title={`Radiant: ${radiantCount}`}
            />
            <div
              style={{ width: `${(stableCount / Math.max(1, totalSurahs)) * 100}%` }}
              className="bg-amber-400"
              title={`Stable: ${stableCount}`}
            />
            <div
              style={{ width: `${(dimmingCount / Math.max(1, totalSurahs)) * 100}%` }}
              className="bg-orange-500 animate-pulse"
              title={`Dimming: ${dimmingCount}`}
            />
            <div
              style={{ width: `${(criticalCount / Math.max(1, totalSurahs)) * 100}%` }}
              className="bg-rose-600 animate-pulse"
              title={`Critical: ${criticalCount}`}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Revision Streak */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-slate-950/80 border border-amber-500/25 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="w-5 h-5 animate-bounce" style={{ animationDuration: "2s" }} />
          </div>
          <span className="text-[11px] font-badge px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Best: {streakData.bestStreak} Days
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-heading font-extrabold text-amber-300">
              {streakData.currentStreak}
            </span>
            <span className="text-sm font-heading text-slate-300 font-bold">
              Days Streak 🔥
            </span>
          </div>
          <p className="text-xs font-bengali text-slate-300 mt-1">
            টানা {streakData.currentStreak} দিন আমোখতা রিভিশনের ধারাবাহিকতা অক্ষুণ্ণ রয়েছে।
          </p>
        </div>

        {/* Warning or Success Alert */}
        <div className="pt-2 border-t border-white/10">
          {revisedToday ? (
            <div className="flex items-center gap-2 text-xs font-badge text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>আজকের রিভিশন সম্পন্ন! স্ট্রিক সুরক্ষিত আছে।</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-badge text-rose-300 bg-rose-950/40 p-2 rounded-xl border border-rose-500/30">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 animate-pulse" />
              <span>সতর্কতা: আলো অক্ষুণ্ণ রাখতে আজ অন্তত ১টি সূরা রিভিশন দিন!</span>
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Total Amukhta Vault Capacity */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/25 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-badge px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Total Vault Assets
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-heading font-extrabold text-white">
              {totalSurahs}
            </span>
            <span className="text-xs font-badge text-cyan-400 font-semibold">
              Surahs Guarded
            </span>
          </div>
          <p className="text-xs font-bengali text-slate-300 mt-1">
            মোট {distinctParas} টি পারা এবং {totalAyahs} টি সংরক্ষিত আয়াত।
          </p>
        </div>

        {/* Revisions Count Summary */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-badge text-slate-400">
          <span>সর্বমোট রিভিশন সাইকেল:</span>
          <span className="text-cyan-300 font-bold">
            {streakData.totalRevisionsCount} বার
          </span>
        </div>
      </div>
    </div>
  );
}
