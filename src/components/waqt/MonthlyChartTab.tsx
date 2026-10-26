"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BarChart2,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Filter,
} from "lucide-react";
import {
  BENGALI_MONTHS,
  DailySalahRecord,
  MAIN_PRAYERS,
  MonthlySalahStats,
  PrayerKey,
  PrayerStatus,
} from "@/types/salah";
import { calculateMonthlyStats } from "@/lib/salahStorage";

interface MonthlyChartTabProps {
  records: Record<string, DailySalahRecord>;
  onUpdatePrayerRecord?: (dateStr: string, prayerKey: PrayerKey, status: PrayerStatus) => void;
}

export function MonthlyChartTab({ records, onUpdatePrayerRecord }: MonthlyChartTabProps) {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(today.getMonth());
  const [activeDateModal, setActiveDateModal] = useState<string | null>(null);

  const stats: MonthlySalahStats = calculateMonthlyStats(records, selectedYear, selectedMonthIndex);

  const handlePrevMonth = () => {
    if (selectedMonthIndex === 0) {
      setSelectedYear((y) => y - 1);
      setSelectedMonthIndex(11);
    } else {
      setSelectedMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex === 11) {
      setSelectedYear((y) => y + 1);
      setSelectedMonthIndex(0);
    } else {
      setSelectedMonthIndex((m) => m + 1);
    }
  };

  const totalPossibleWaqts = stats.totalDays * 5;

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

  return (
    <div className="space-y-6">
      {/* Top Header & Month Switcher */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-badge tracking-wider text-cyan-400 uppercase mb-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Monthly Performance</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading text-slate-100 font-semibold">
              {stats.monthNameBn} {selectedYear} Salah Analytics
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-subheading">
              Select any month to inspect date-by-date records and individual breakdowns for Fajr, Zuhr, Asr, Maghrib, and Isha.
            </p>
          </div>

          {/* Month Prev/Next Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 transition flex items-center gap-1 text-xs font-badge"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Previous Month</span>
            </button>

            <div className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 font-badge font-semibold text-sm">
              {stats.monthNameBn}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 transition flex items-center gap-1 text-xs font-mono"
              title="Next Month"
            >
              <span className="hidden sm:inline">Next Month</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* 12-MONTH HORIZONTAL SWITCH PILLS */}
        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-2">
            <Filter className="w-3 h-3 text-cyan-400" />
            <span>Select Month (12-Month Switcher):</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {BENGALI_MONTHS.map((monthName, idx) => {
              const isSelected = selectedMonthIndex === idx;
              return (
                <button
                  key={monthName}
                  onClick={() => setSelectedMonthIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 scale-105"
                      : "bg-slate-800/70 hover:bg-slate-700 text-slate-300 border border-white/5"
                  }`}
                >
                  {monthName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MONTH SUMMARY OVERVIEW TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Prayed */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
            <span>Month Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            {stats.totalPrayed}
            <span className="text-xs text-slate-400 font-sans ml-1">
              / {totalPossibleWaqts}
            </span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Total prayers completed
          </div>
        </div>

        {/* Total Missed */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-2">
            <span>Month Missed</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            {stats.totalMissed}
            <span className="text-xs text-slate-400 font-sans ml-1">Missed</span>
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1">
            {stats.totalMissed === 0 ? "Zero prayers missed" : "Make-up required"}
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
            <span>Monthly Adherence</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-300">
            {stats.completionRate}%
          </div>
          <div className="text-[11px] text-cyan-200/80 mt-1">
            Overall completion rate
          </div>
        </div>

        {/* Days count */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
            <span>Days in Month</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-200">
            {stats.totalDays}
            <span className="text-xs text-slate-400 font-sans ml-1">Days</span>
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">
            {stats.monthNameBn}
          </div>
        </div>
      </div>

      {/* 1. SEPARATE BREAKDOWN FOR FAJR, DHUHR, ASR, MAGHRIB, ISHA */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm sm:text-base font-semibold text-slate-100">
              Prayer-by-Prayer Breakdown (Fajr, Zuhr, Asr, Maghrib, Isha)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Completed and missed statistics for each individual waqt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {MAIN_PRAYERS.map((prayer) => {
            const pStat = stats.prayerBreakdown[prayer.key];
            const Icon = getPrayerIcon(prayer.key);
            const prayed = pStat?.prayed || 0;
            const missed = pStat?.missed || 0;
            const rate = pStat?.rate || 0;

            return (
              <div
                key={prayer.key}
                className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-800 text-cyan-300 border border-white/5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-base font-semibold text-slate-100">
                        {prayer.bengaliName}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      {rate}%
                    </span>
                  </div>

                  {/* Dual Bar (Prayed vs Missed) */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Completed: {prayed}</span>
                      <span>Missed: {missed}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-white/5">
                      <div
                        style={{ width: `${(prayed / stats.totalDays) * 100}%` }}
                        className="bg-emerald-400 h-full transition-all duration-500"
                        title={`${prayed} completed`}
                      />
                      <div
                        style={{ width: `${(missed / stats.totalDays) * 100}%` }}
                        className="bg-rose-500 h-full transition-all duration-500"
                        title={`${missed} missed`}
                      />
                    </div>
                  </div>
                </div>

                {/* Stat details */}
                <div className="space-y-1.5 text-xs font-mono pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-emerald-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed:</span>
                    </span>
                    <strong>{prayed} days</strong>
                  </div>

                  <div className="flex items-center justify-between text-rose-300">
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Missed:</span>
                    </span>
                    <strong>{missed} days</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. DATE-BY-DATE GRID VIEW */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm sm:text-base font-semibold text-slate-100">
              Daily Prayer Calendar (Day 1 to {stats.totalDays})
            </h4>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>5/5 Completed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Missed Exists</span>
            </span>
          </div>
        </div>

        {/* Date Tiles Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-11 gap-2">
          {stats.days.map((day) => {
            const isFull = day.prayedCount === 5;
            const hasMissed = day.missedCount > 0;
            const isSelected = activeDateModal === day.date;

            return (
              <button
                key={day.date}
                onClick={() => setActiveDateModal(isSelected ? null : day.date)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between relative group ${
                  day.isToday
                    ? "bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : isSelected
                    ? "bg-slate-700/80 border-white ring-1 ring-white/50"
                    : isFull
                    ? "bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-400/60"
                    : hasMissed
                    ? "bg-rose-950/30 border-rose-500/30 hover:border-rose-400/60"
                    : "bg-slate-800/40 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono font-bold text-slate-100">
                    {day.dayOfMonth}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {day.dayNameBn}
                  </span>
                </div>

                {/* Prayer status indicator dots */}
                <div className="flex items-center gap-1 mt-2">
                  {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as PrayerKey[]).map((pk) => {
                    const st = day.prayers[pk];
                    return (
                      <span
                        key={pk}
                        className={`w-1.5 h-1.5 rounded-full ${
                          st === "prayed"
                            ? "bg-emerald-400"
                            : st === "missed"
                            ? "bg-rose-500"
                            : "bg-slate-700"
                        }`}
                        title={`${pk}: ${st}`}
                      />
                    );
                  })}
                </div>

                <div className="mt-1 text-[10px] font-mono text-slate-400 text-right">
                  <span className={isFull ? "text-emerald-400 font-semibold" : hasMissed ? "text-rose-400" : ""}>
                    {day.prayedCount}/5
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Date Detail Drawer */}
        <AnimatePresence>
          {activeDateModal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3"
            >
              {(() => {
                const targetDay = stats.days.find((d) => d.date === activeDateModal);
                if (!targetDay) return null;

                return (
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-semibold text-slate-100">
                          Date Details: {stats.monthNameBn} {targetDay.dayOfMonth} ({targetDay.dayNameBn})
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveDateModal(null)}
                        className="text-xs font-mono text-slate-400 hover:text-white"
                      >
                        Close ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                      {MAIN_PRAYERS.map((p) => {
                        const st = targetDay.prayers[p.key] || "unmarked";
                        const isP = st === "prayed";
                        const isM = st === "missed";

                        return (
                          <div
                            key={p.key}
                            className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                              isP
                                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                                : isM
                                ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                                : "bg-slate-800 border-white/10 text-slate-400"
                            }`}
                          >
                            <span className="font-semibold">{p.bengaliName}</span>
                            <div className="flex items-center justify-between mt-2">
                              <span>{isP ? "Completed" : isM ? "Missed" : "Pending"}</span>
                              {onUpdatePrayerRecord && (
                                <button
                                  onClick={() =>
                                    onUpdatePrayerRecord(
                                      targetDay.date,
                                      p.key,
                                      isP ? "missed" : "prayed"
                                    )
                                  }
                                  className="text-[10px] font-mono underline hover:text-white"
                                >
                                  Change
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
