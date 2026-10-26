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
  Award,
  BarChart,
  Star,
} from "lucide-react";
import {
  DailySalahRecord,
  MAIN_PRAYERS,
  PrayerKey,
  YearlySalahStats,
} from "@/types/salah";
import { calculateYearlyStats } from "@/lib/salahStorage";

interface YearlyChartTabProps {
  records: Record<string, DailySalahRecord>;
}

export function YearlyChartTab({ records }: YearlyChartTabProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const stats: YearlySalahStats = calculateYearlyStats(records, selectedYear);

  return (
    <div className="space-y-6">
      {/* Top Header & Year Switcher */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-badge tracking-wider text-cyan-400 uppercase mb-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Annual Overview</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading text-slate-100 font-semibold">
              {selectedYear} Salah Archive & Annual Performance
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-subheading">
              Comprehensive 12-month overview tracking total completed and missed counts for each prayer across the year.
            </p>
          </div>

          {/* Year Switcher Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedYear((y) => y - 1)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 transition flex items-center gap-1 text-xs font-badge"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span>Previous Year</span>
            </button>

            <div className="px-5 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 font-badge font-bold text-base">
              {selectedYear}
            </div>

            <button
              onClick={() => setSelectedYear((y) => y + 1)}
              disabled={selectedYear >= currentYear}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-white/5 transition flex items-center gap-1 text-xs font-badge"
            >
              <span>Next Year</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* ANNUAL SUMMARY TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Annual Prayed */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-badge text-emerald-400 mb-2">
            <span>Annual Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-badge font-bold text-slate-100">
            {stats.totalPrayed}
            <span className="text-xs text-slate-400 font-sans ml-1">Waqts</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Total prayers completed this year
          </div>
        </div>

        {/* Total Annual Missed */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-2">
            <span>Annual Missed</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            {stats.totalMissed}
            <span className="text-xs text-slate-400 font-sans ml-1">Missed</span>
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1">
            Recorded as missed
          </div>
        </div>

        {/* Overall Completion Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
            <span>Annual Adherence</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-300">
            {stats.overallRate}%
          </div>
          <div className="text-[11px] text-cyan-200/80 mt-1">
            Annual average completion rate
          </div>
        </div>

        {/* Best Month */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
            <span>Best Month</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-200">
            {stats.bestMonthName}
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">
            Month of highest steadfastness
          </div>
        </div>
      </div>

      {/* 1. 12-MONTH VISUAL BAR CHART */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm sm:text-base font-semibold text-slate-100">
              12-Month Prayer Consistency (Monthly Comparison)
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
          </div>
        </div>

        {/* 12 Months Columns */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 pt-2">
          {stats.months.map((m, idx) => {
            const totalMarked = m.totalPrayed + m.totalMissed;
            const prayedPct = totalMarked > 0 ? (m.totalPrayed / totalMarked) * 100 : 0;
            const missedPct = totalMarked > 0 ? (m.totalMissed / totalMarked) * 100 : 0;

            return (
              <div
                key={m.monthIndex}
                className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-cyan-400/40 transition-all group"
              >
                {/* Month Name */}
                <div className="text-center mb-2">
                  <div className="text-xs font-semibold text-slate-200">
                    {m.monthShortBn}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">
                    {m.completionRate}%
                  </div>
                </div>

                {/* Stacked Bar Meter */}
                <div className="w-7 sm:w-8 h-32 sm:h-40 bg-slate-950/80 rounded-xl p-0.5 flex flex-col justify-end border border-white/5 relative overflow-hidden">
                  {/* Tooltip on hover */}
                  <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity p-1 flex flex-col items-center justify-center text-[9px] font-mono text-center z-10 pointer-events-none">
                    <span className="text-emerald-400">✓{m.totalPrayed}</span>
                    <span className="text-rose-400">✗{m.totalMissed}</span>
                  </div>

                  {/* Missed */}
                  {m.totalMissed > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${missedPct}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.03 }}
                      className="w-full bg-rose-500 rounded-sm mb-0.5"
                    />
                  )}

                  {/* Prayed */}
                  {m.totalPrayed > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${prayedPct}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.03 }}
                      className="w-full bg-emerald-400 rounded-sm"
                    />
                  )}
                </div>

                {/* Prayed total */}
                <div className="mt-2 text-center text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-300 font-semibold">{m.totalPrayed}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ANNUAL PRAYER-BY-PRAYER TOTALS */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm sm:text-base font-semibold text-slate-100">
              Annual Total Completed vs Missed by Prayer
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            365 days cumulative breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {MAIN_PRAYERS.map((prayer) => {
            const pStat = stats.prayerBreakdown[prayer.key];
            const prayed = pStat?.prayed || 0;
            const missed = pStat?.missed || 0;
            const rate = pStat?.rate || 0;

            return (
              <div
                key={prayer.key}
                className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-white/5 hover:border-white/15 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-slate-100">
                      {prayer.bengaliName}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      {rate}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                    {prayer.meaning}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex border border-white/5 mb-3">
                    <div
                      style={{ width: `${rate}%` }}
                      className="bg-emerald-400 h-full transition-all duration-500"
                    />
                    <div
                      style={{ width: `${100 - rate}%` }}
                      className="bg-rose-500 h-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono pt-3 border-t border-white/5">
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
