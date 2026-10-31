"use client";

import React from "react";
import { YearlyHorizonGoal, CATEGORY_MAP } from "@/types/milestones";
import { Star, Compass, Sparkles } from "lucide-react";

interface YearlyHorizonTabProps {
  yearlyGoals: YearlyHorizonGoal[];
}

export function YearlyHorizonTab({ yearlyGoals }: YearlyHorizonTabProps) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0e172a]/95 to-slate-900/90 border border-violet-500/20 p-5 sm:p-6 shadow-[0_0_30px_rgba(139,92,246,0.1)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-violet-500/10 text-violet-300 border border-violet-400/30">
                CELESTIAL HORIZON
              </span>
              <span className="text-xs font-mono text-slate-400">
                The {new Date().getFullYear()} Horizon
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
              Yearly Horizons &amp; Life Pillars
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              The grand celestial landmarks that define your lifelong character and destiny.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-violet-500/10 border border-violet-400/30 text-violet-200 text-xs font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Lifelong Blueprint</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {yearlyGoals.map((horizon) => {
          const catMeta = CATEGORY_MAP[horizon.category] || CATEGORY_MAP.other;
          return (
            <div
              key={horizon.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-violet-400/30 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${catMeta.bgLight} ${catMeta.color} ${catMeta.borderColor}`}
                  >
                    {horizon.pillar}
                  </span>
                  <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-400/20">
                    <Star className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-white leading-snug">
                  {horizon.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {horizon.vision}
                </p>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Yearly Progress</span>
                  <span className="text-violet-300 font-bold">{horizon.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full"
                    style={{ width: `${horizon.progress}%` }}
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
