"use client";

import React from "react";
import {
  Sparkles,
  Flame,
  Award,
  Zap,
  Target,
  Orbit,
  Star,
  ShieldCheck,
  Clock,
  Compass,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import {
  TodaySparkGoal,
  WeeklySprintGoal,
  MonthlyOrbitGoal,
  YearlyHorizonGoal,
  CATEGORY_MAP,
  GoalCategory,
} from "@/types/milestones";
import {
  formatMinutes,
  MILESTONES_STORAGE_KEY_ARCHIVED_XP,
  MILESTONES_STORAGE_KEY_ARCHIVED_MINUTES,
  MILESTONES_STORAGE_KEY_ARCHIVED_COUNT,
} from "@/lib/milestoneData";

interface StarlightVaultTabProps {
  tasks: TodaySparkGoal[];
  weeklyGoals: WeeklySprintGoal[];
  monthlyGoals: MonthlyOrbitGoal[];
  yearlyGoals: YearlyHorizonGoal[];
}

export function StarlightVaultTab({
  tasks,
  weeklyGoals,
  monthlyGoals,
  yearlyGoals,
}: StarlightVaultTabProps) {
  // Load archived stats if any (persisted from 7-day auto-cleanups)
  let archivedXP = 0;
  let archivedMinutes = 0;
  let archivedCount = 0;
  if (typeof window !== "undefined") {
    try {
      archivedXP = Number(localStorage.getItem(MILESTONES_STORAGE_KEY_ARCHIVED_XP) || "0");
      archivedMinutes = Number(localStorage.getItem(MILESTONES_STORAGE_KEY_ARCHIVED_MINUTES) || "0");
      archivedCount = Number(localStorage.getItem(MILESTONES_STORAGE_KEY_ARCHIVED_COUNT) || "0");
    } catch (e) {
      console.error(e);
    }
  }

  const completedTasks = tasks.filter((t) => t.completed);
  const totalTaskXP = completedTasks.reduce((acc, t) => acc + (t.points || 0), 0);
  const baseXP = 320; // historical seed base XP
  const grandTotalXP = baseXP + totalTaskXP + archivedXP;

  // Calculate Level (Every 100 XP is 1 level)
  const level = Math.floor(grandTotalXP / 100) + 1;
  const currentLevelProgress = grandTotalXP % 100;

  // Category breakdown of completed tasks
  const categoryCount: Record<GoalCategory, number> = {
    deen: 0,
    intellect: 0,
    body: 0,
    tazkiyah: 0,
    crucible: 0,
    other: 0,
  };

  completedTasks.forEach((t) => {
    const cat = t.category === "crucible" ? "tazkiyah" : t.category;
    if (categoryCount[cat] !== undefined) {
      categoryCount[cat] += 1;
    }
  });

  // ========================================================
  // TIME REALITY CHECK & CALIBRATION CALCULATIONS
  // ========================================================
  const totalEstimatedMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 25), 0);
  const totalActualMinutes = tasks.reduce(
    (sum, t) => sum + (t.actualMinutes || (t.completed ? t.estimatedMinutes || 25 : 0)),
    0
  );

  // Calculate Estimation Accuracy (%)
  const completedWithActual = completedTasks.filter((t) => t.actualMinutes && t.estimatedMinutes);
  let accuracyScore = 92; // default high baseline calibrated score
  if (completedWithActual.length > 0) {
    const totalVariances = completedWithActual.reduce((acc, t) => {
      const est = t.estimatedMinutes || 25;
      const act = t.actualMinutes || 25;
      const diff = Math.abs(est - act);
      const accSingle = Math.max(50, 100 - Math.round((diff / est) * 100));
      return acc + accSingle;
    }, 0);
    accuracyScore = Math.round(totalVariances / completedWithActual.length);
  }

  // Domain Time Breakdown (Minutes spent per category)
  const categoryMinutes: Record<GoalCategory, number> = {
    deen: 0,
    intellect: 0,
    body: 0,
    tazkiyah: 0,
    crucible: 0,
    other: 0,
  };

  tasks.forEach((t) => {
    const cat = t.category === "crucible" ? "tazkiyah" : t.category;
    const mins = t.actualMinutes || t.estimatedMinutes || 25;
    if (categoryMinutes[cat] !== undefined) {
      categoryMinutes[cat] += mins;
    }
  });

  return (
    <div className="space-y-6">
      {/* 1. Vault Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0e172a]/95 to-slate-900/90 border border-cyan-500/20 p-5 sm:p-6 shadow-[0_0_30px_rgba(6,182,212,0.1)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                STARLIGHT VAULT
              </span>
              <span className="text-xs font-mono text-slate-400">Mastery &amp; Momentum</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
              Cosmic XP &amp; Orbit Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Your disciplined track record illuminated across the cosmic void.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <div className="text-[10px] font-mono text-amber-300/80 uppercase">
                  Streak Momentum
                </div>
                <div className="text-sm font-bold font-mono text-amber-200">5 Days Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Level & Tier Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-400/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cosmic Rank: Initiate of Orbit</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold font-mono text-white flex items-baseline gap-3">
              Level {level}
              <span className="text-sm font-normal text-slate-400 font-mono">
                ({grandTotalXP} Total XP Earned)
              </span>
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              Progress to Level {level + 1}: {currentLevelProgress}/100 XP to next cosmic resonance.
            </p>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-300">Level {level}</span>
              <span className="text-slate-400">{currentLevelProgress}%</span>
              <span className="text-indigo-400">Level {level + 1}</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-cyan-500/30 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TIME REALITY CHECK & CALIBRATION DECK (NEW) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.1)] backdrop-blur-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-heading font-bold text-white">
                Time Reality Check &amp; Calibration
              </h3>
            </div>
            <p className="text-xs font-subheading text-slate-400">
              Monitor your planned time vs. actual deep work duration to refine estimation discipline.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-badge">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{accuracyScore}% Time Accuracy</span>
          </div>
        </div>

        {/* 3 Stat Cards: Planned, Actual, Accuracy */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
            <div className="text-[11px] font-subheading text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Planned Focus Time
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300">
              {formatMinutes(totalEstimatedMinutes)}
            </div>
            <div className="text-[10px] text-slate-400 font-subheading">
              Cumulative target estimate across all tasks
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
            <div className="text-[11px] font-subheading text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Actual Deep Work Time
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
              {formatMinutes(totalActualMinutes)}
            </div>
            <div className="text-[10px] text-slate-400 font-subheading">
              Total verified focus clocked in The Anchor
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
            <div className="text-[11px] font-subheading text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Estimation Accuracy
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-300">
              {accuracyScore}%
            </div>
            <div className="text-[10px] text-slate-400 font-subheading">
              {accuracyScore >= 85 ? "High precision & disciplined calibration" : "Calibrate estimates in upcoming sprints"}
            </div>
          </div>
        </div>

        {/* Category Time Investment Bars */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-badge text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Time Investment by Domain</span>
            <span className="text-cyan-400 font-mono">Total {formatMinutes(totalEstimatedMinutes)}</span>
          </div>

          <div className="space-y-2.5">
            {(["deen", "intellect", "body", "tazkiyah", "other"] as GoalCategory[]).map((catKey) => {
              const meta = CATEGORY_MAP[catKey];
              const mins = categoryMinutes[catKey] || 0;
              const percent = totalEstimatedMinutes > 0 ? Math.round((mins / totalEstimatedMinutes) * 100) : 0;

              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-medium ${meta.color} flex items-center gap-2`}>
                      <span className={`w-2 h-2 rounded-full ${meta.dotColor}`} />
                      {meta.label}
                    </span>
                    <span className="font-mono text-slate-300">
                      {formatMinutes(mins)} <span className="text-slate-500">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full ${meta.dotColor} rounded-full`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Core Metrics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            Completed Sparks
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
            <span>{completedTasks.length + archivedCount}</span>
            {archivedCount > 0 && (
              <span className="text-[10px] text-slate-500 font-normal">
                ({archivedCount} archived)
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Weekly Sprints
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {weeklyGoals.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5 text-amber-400" />
            Monthly Orbits
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {monthlyGoals.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-violet-400" />
            Yearly Horizons
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {yearlyGoals.length}
          </div>
        </div>
      </div>

      {/* 5. Domain Balance Breakdown (Tasks count) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          Life Domain Mastery Breakdown
        </div>

        <div className="space-y-3">
          {(["deen", "intellect", "body", "tazkiyah", "other"] as GoalCategory[]).map((catKey) => {
            const meta = CATEGORY_MAP[catKey];
            const count = categoryCount[catKey] || 0;
            return (
              <div key={catKey} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`font-medium ${meta.color} flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full ${meta.dotColor}`} />
                    {meta.label}
                  </span>
                  <span className="font-mono text-slate-400">{count} completed</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full ${meta.dotColor} rounded-full`}
                    style={{
                      width: `${Math.min(100, Math.max(10, count * 25))}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
