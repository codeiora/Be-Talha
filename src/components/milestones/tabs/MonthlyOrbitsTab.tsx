"use client";

import React from "react";
import { MonthlyOrbitGoal, CATEGORY_MAP } from "@/types/milestones";
import { Orbit, Sparkles } from "lucide-react";

interface MonthlyOrbitsTabProps {
  monthlyGoals: MonthlyOrbitGoal[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function MonthlyOrbitsTab({ monthlyGoals }: MonthlyOrbitsTabProps) {
  const currentMonthName = MONTH_NAMES[new Date().getMonth()];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0e172a]/95 to-slate-900/90 border border-amber-500/20 p-5 sm:p-6 shadow-[0_0_30px_rgba(245,158,11,0.1)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-amber-500/10 text-amber-300 border border-amber-400/30">
                MONTHLY ORBITS
              </span>
              <span className="text-xs font-mono text-slate-400">
                {currentMonthName} {new Date().getFullYear()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
              Monthly Milestones &amp; Orbits
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Macro-level outcomes designed to move the needle every 30 days.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Phase 3 Milestone Engine</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {monthlyGoals.map((goal) => {
          const catMeta = CATEGORY_MAP[goal.category] || CATEGORY_MAP.other;
          return (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-amber-400/30 transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${catMeta.bgLight} ${catMeta.color} ${catMeta.borderColor}`}
                  >
                    {catMeta.label}
                  </span>
                  <h3 className="text-base font-semibold text-white pt-1">{goal.title}</h3>
                </div>

                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-400/20">
                  <Orbit className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Orbital Trajectory</span>
                  <span className="text-amber-300 font-bold">{goal.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-400 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
