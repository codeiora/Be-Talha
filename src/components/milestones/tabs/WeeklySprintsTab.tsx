"use client";

import React from "react";
import { WeeklySprintGoal, CATEGORY_MAP } from "@/types/milestones";
import { Layers, Sparkles, ArrowRight, Calendar } from "lucide-react";

interface WeeklySprintsTabProps {
  weeklyGoals: WeeklySprintGoal[];
  onNavigateToToday?: () => void;
}

export function WeeklySprintsTab({
  weeklyGoals,
  onNavigateToToday,
}: WeeklySprintsTabProps) {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0e172a]/95 to-slate-900/90 border border-indigo-500/20 p-5 sm:p-6 shadow-[0_0_30px_rgba(99,102,241,0.1)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-indigo-500/10 text-indigo-300 border border-indigo-400/30">
                WEEKLY SPRINT HORIZON
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Phase 2 Core Module
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
              Weekly Sprints &amp; Objectives
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Transform high-level monthly orbits into 7-day tactical commitments.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-200 text-xs font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Ready for Phase 2 Integration</span>
          </div>
        </div>
      </div>

      {/* Pre-seeded Weekly Goals Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Current Week Active Sprints ({weeklyGoals.length})
          </span>
          <span className="text-xs text-indigo-400">Connected to Daily Sparks</span>
        </div>

        {weeklyGoals.map((goal) => {
          const catMeta = CATEGORY_MAP[goal.category] || CATEGORY_MAP.other;
          return (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-400/30 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${catMeta.bgLight} ${catMeta.color} ${catMeta.borderColor}`}
                    >
                      {catMeta.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Week {goal.weekNumber} • {goal.year}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white">{goal.title}</h3>
                </div>

                <span className="text-xs font-mono font-bold text-indigo-300 px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-400/30">
                  {goal.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action to return to Today */}
      {onNavigateToToday && (
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Manage today&apos;s linked actions in the Daily tab:</span>
          <button
            onClick={onNavigateToToday}
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition"
          >
            Go to Today&apos;s Sparks
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
