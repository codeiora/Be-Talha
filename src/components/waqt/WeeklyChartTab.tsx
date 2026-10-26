"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BarChart3,
  Flame,
} from "lucide-react";
import {
  DailySalahRecord,
  MAIN_PRAYERS,
  PrayerKey,
  WeeklySalahStats,
} from "@/types/salah";
import { calculateWeeklyStats, formatDateKey } from "@/lib/salahStorage";

interface WeeklyChartTabProps {
  records: Record<string, DailySalahRecord>;
  onSelectDate?: (dateStr: string) => void;
}

export function WeeklyChartTab({ records, onSelectDate }: WeeklyChartTabProps) {
  const [weekOffset, setWeekOffset] = useState<number>(0);

  const today = new Date();
  const anchorDate = new Date(today);
  anchorDate.setDate(today.getDate() + weekOffset * 7);

  const stats: WeeklySalahStats = calculateWeeklyStats(records, anchorDate);

  const handlePrevWeek = () => setWeekOffset((prev) => prev - 1);
  const handleNextWeek = () => setWeekOffset((prev) => prev + 1);
  const handleCurrentWeek = () => setWeekOffset(0);

  // Format date range in English
  const [startY, startM, startD] = stats.startDate.split("-").map(Number);
  const [endY, endM, endD] = stats.endDate.split("-").map(Number);
  const startObj = new Date(startY, startM - 1, startD);
  const endObj = new Date(endY, endM - 1, endD);

  const rangeTitle = `${startObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} (Friday) — ${endObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} (Thursday)`;

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-[90px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-badge tracking-wider text-cyan-400 uppercase mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Weekly Analytics • Friday to Thursday</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading text-slate-100 font-semibold">
              7-Day Salah Report (Starts from Friday)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-subheading">
              Structured tracking starting from the sacred day of Jumu&apos;ah (Friday) through Thursday with comprehensive breakdown.
            </p>
          </div>

          {/* Week Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevWeek}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 transition flex items-center gap-1 text-xs font-badge"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {weekOffset !== 0 && (
              <button
                onClick={handleCurrentWeek}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-badge hover:bg-cyan-900/60 transition"
              >
                Current Week
              </button>
            )}

            <button
              onClick={handleNextWeek}
              disabled={weekOffset >= 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-white/5 transition flex items-center gap-1 text-xs font-badge"
              title="Next Week"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Date range sub-bar */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-badge font-medium">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{rangeTitle}</span>
          </div>

          <div className="text-[11px] font-badge text-slate-400">
            {weekOffset === 0
              ? "Current Active Week"
              : weekOffset < 0
              ? `${Math.abs(weekOffset)} week(s) ago`
              : `${weekOffset} week(s) ahead`}
          </div>
        </div>
      </div>

      {/* WEEKLY STAT SUMMARY TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Prayed */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
            <span>Total Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            {stats.totalPrayed}
            <span className="text-xs text-slate-400 font-sans ml-1">/ 35 Waqts</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Successfully completed
          </div>
        </div>

        {/* Total Missed / Kaza */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-2">
            <span>Total Missed</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            {stats.totalMissed}
            <span className="text-xs text-slate-400 font-sans ml-1">Missed</span>
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1">
            {stats.totalMissed === 0 ? "Alhamdulillah zero missed" : "Make-up required"}
          </div>
        </div>

        {/* Adherence Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
            <span>Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-300">
            {stats.completionRate}%
          </div>
          <div className="text-[11px] text-cyan-200/80 mt-1">
            Adherence percentage
          </div>
        </div>

        {/* Spiritual Status */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
            <span>Weekly Evaluation</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-200 truncate">
            {stats.completionRate >= 90
              ? "Radiant Luminary"
              : stats.completionRate >= 75
              ? "Steadfast Believer"
              : "Accountability Needed"}
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">
            {stats.totalMissed === 0 ? "Flawless consistency" : `${stats.totalMissed} missed prayer(s) to make up`}
          </div>
        </div>
      </div>

      {/* 1. DAY-BY-DAY BAR CHART (Starting with Friday) */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm sm:text-base font-semibold text-slate-100">
              Daily Breakdown (Friday through Thursday)
            </h4>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span>Completed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span>Missed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
              <span>Pending</span>
            </span>
          </div>
        </div>

        {/* The 7 Day Columns */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 pt-2">
          {stats.days.map((day, idx) => {
            const prayedPct = (day.prayedCount / 5) * 100;
            const missedPct = (day.missedCount / 5) * 100;

            return (
              <div
                key={day.date}
                className={`flex flex-col items-center p-2 sm:p-3 rounded-2xl border transition-all ${
                  day.isToday
                    ? "bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "bg-slate-800/40 border-white/5 hover:border-white/20"
                }`}
              >
                {/* Day Header */}
                <div className="text-center mb-3">
                  <div className="text-xs sm:text-sm font-semibold text-slate-200">
                    {day.dayShortBn}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono text-cyan-300">
                    {day.dayNumber}
                  </div>
                  {day.isToday && (
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-mono bg-cyan-400 text-slate-950 rounded font-bold">
                      TODAY
                    </span>
                  )}
                </div>

                {/* Vertical Stacked Bar Meter */}
                <div className="w-7 sm:w-10 h-36 sm:h-44 bg-slate-950/80 rounded-xl p-1 flex flex-col justify-end border border-white/5 relative overflow-hidden group">
                  {/* Tooltip on hover */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-1 flex flex-col items-center justify-center text-[10px] font-mono text-center z-10 pointer-events-none">
                    <span className="text-emerald-400">✓ {day.prayedCount}</span>
                    {day.missedCount > 0 && <span className="text-rose-400">✗ {day.missedCount}</span>}
                    <span className="text-slate-400 text-[9px]">/5</span>
                  </div>

                  {/* Missed segment */}
                  {day.missedCount > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${missedPct}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="w-full bg-rose-500 rounded-sm mb-0.5 shadow-sm"
                      title={`${day.missedCount} missed`}
                    />
                  )}

                  {/* Prayed segment */}
                  {day.prayedCount > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${prayedPct}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      title={`${day.prayedCount} completed`}
                    />
                  )}
                </div>

                {/* Day Result Summary */}
                <div className="mt-2 text-center text-[11px] font-mono">
                  <span className="text-emerald-300 font-semibold">
                    {day.prayedCount}
                  </span>
                  <span className="text-slate-500">/5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. PRAYER-BY-PRAYER BREAKDOWN */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm sm:text-base font-semibold text-slate-100">
              Prayer Breakdown (Completed vs Missed)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            7 days total (7 waqts each)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {MAIN_PRAYERS.map((prayer) => {
            const pStat = stats.prayerBreakdown[prayer.key];
            const prayed = pStat?.prayed || 0;
            const missed = pStat?.missed || 0;
            const rate = prayed + missed > 0 ? Math.round((prayed / (prayed + missed)) * 100) : 0;

            return (
              <div
                key={prayer.key}
                className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-white/15 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-100">
                      {prayer.bengaliName}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300/80">
                      {rate}%
                    </span>
                  </div>

                  {/* Progress meter */}
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex mb-3">
                    <div
                      style={{ width: `${(prayed / 7) * 100}%` }}
                      className="bg-emerald-400 h-full"
                    />
                    <div
                      style={{ width: `${(missed / 7) * 100}%` }}
                      className="bg-rose-500 h-full"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-emerald-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed:</span>
                    </span>
                    <strong>{prayed} times</strong>
                  </div>

                  <div className="flex items-center justify-between text-rose-300">
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Missed:</span>
                    </span>
                    <strong>{missed} times</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
