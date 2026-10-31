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
} from "lucide-react";
import {
  TodaySparkGoal,
  WeeklySprintGoal,
  MonthlyOrbitGoal,
  YearlyHorizonGoal,
  CATEGORY_MAP,
  GoalCategory,
} from "@/types/milestones";

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
  const completedTasks = tasks.filter((t) => t.completed);
  const totalTaskXP = completedTasks.reduce((acc, t) => acc + (t.points || 0), 0);
  const baseXP = 320; // historical seed base XP
  const grandTotalXP = baseXP + totalTaskXP;

  // Calculate Level (Every 100 XP is 1 level)
  const level = Math.floor(grandTotalXP / 100) + 1;
  const currentLevelProgress = grandTotalXP % 100;

  // Category breakdown of completed tasks
  const categoryCount: Record<GoalCategory, number> = {
    deen: 0,
    intellect: 0,
    body: 0,
    crucible: 0,
    other: 0,
  };

  completedTasks.forEach((t) => {
    if (categoryCount[t.category] !== undefined) {
      categoryCount[t.category] += 1;
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
              <ShieldCheck className="w-3.5 h-3.5" />
              Current Rank: Winged Morning Star
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Starlight Tier {level}
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              Every completed spark fuels your starlight reservoir, carrying you toward complete self-mastery.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Total Cosmic XP
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-amber-300 flex items-center justify-end gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              {grandTotalXP} XP
            </div>
          </div>
        </div>

        {/* Progress to next level */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Next Tier Progression</span>
            <span className="text-cyan-300 font-bold">{currentLevelProgress} / 100 XP</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-all duration-500"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            Sparks Conquered
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {completedTasks.length}
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

      {/* 4. Domain Balance Breakdown */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          Life Domain Mastery Breakdown
        </div>

        <div className="space-y-3">
          {(Object.keys(CATEGORY_MAP) as GoalCategory[]).map((catKey) => {
            const meta = CATEGORY_MAP[catKey];
            const count = categoryCount[catKey] || 0;
            return (
              <div key={catKey} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`font-medium ${meta.color} flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full ${meta.dotColor}`} />
                    {meta.label} ({meta.bengaliLabel})
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
