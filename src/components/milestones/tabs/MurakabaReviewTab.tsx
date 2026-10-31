"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Award,
  AlertTriangle,
  Compass,
  Plus,
  Calendar,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { MurakabaEntry } from "@/types/milestones";
import { getCurrentWeekNumber, getTodayDateKey } from "@/lib/milestoneData";

interface MurakabaReviewTabProps {
  entries: MurakabaEntry[];
  onAddReview: (review: Omit<MurakabaEntry, "id" | "reviewedAt">) => void;
}

export function MurakabaReviewTab({
  entries,
  onAddReview,
}: MurakabaReviewTabProps) {
  const currentWeek = getCurrentWeekNumber();
  const currentYear = new Date().getFullYear();

  const [highlight, setHighlight] = useState("");
  const [stumblingBlock, setStumblingBlock] = useState("");
  const [nextWeekPledge, setNextWeekPledge] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!highlight.trim() || !nextWeekPledge.trim()) return;

    onAddReview({
      dateKey: getTodayDateKey(),
      weekNumber: currentWeek,
      year: currentYear,
      highlight: highlight.trim(),
      stumblingBlock: stumblingBlock.trim() || "No critical lapses noted.",
      nextWeekPledge: nextWeekPledge.trim(),
    });

    setHighlight("");
    setStumblingBlock("");
    setNextWeekPledge("");
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0e172a]/95 to-slate-900/90 border border-amber-500/20 p-5 sm:p-6 shadow-[0_0_30px_rgba(245,158,11,0.1)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-amber-500/10 text-amber-300 border border-amber-400/30">
                MURAKABA &amp; AUDIT
              </span>
              <span className="text-xs font-mono text-slate-400">
                Week {currentWeek} • {currentYear}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
              Weekly Murakaba Review (সাপ্তাহিক মুরাকাবা)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Hold yourself accountable before you are held to account.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {isFormOpen ? "Close Review" : "Start Weekly Audit"}
          </button>
        </div>
      </div>

      {/* 2. Review Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl bg-slate-900/95 border border-amber-400/40 p-5 sm:p-6 shadow-xl space-y-4"
          >
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Conduct Weekly Self-Examination
              </h3>
            </div>

            <div>
              <label className="block text-xs font-mono text-emerald-300 mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                1. What was your greatest victory / positive breakthrough this week?
              </label>
              <textarea
                rows={3}
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="e.g. Mastered 1 Para revision, maintained 5 days of Fajr wakeups..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-rose-300 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                2. Where did you stumble, procrastinate, or allow flaws to creep in?
              </label>
              <textarea
                rows={3}
                value={stumblingBlock}
                onChange={(e) => setStumblingBlock(e.target.value)}
                placeholder="Be ruthlessly honest with yourself in the crucible..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                3. What is your unshakeable pledge &amp; 3 core targets for next week?
              </label>
              <textarea
                rows={3}
                value={nextWeekPledge}
                onChange={(e) => setNextWeekPledge(e.target.value)}
                placeholder="Define your tactical commitments..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow-md shadow-amber-500/20"
              >
                Seal Review in Vault
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 3. Past Reviews Archive */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
          Historical Murakaba Audits ({entries.length})
        </div>

        {entries.map((entry) => {
          const isExpanded = expandedId === entry.id;
          return (
            <div
              key={entry.id}
              className="rounded-2xl bg-slate-900/70 border border-white/10 overflow-hidden hover:border-amber-400/30 transition"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
                      Week {entry.weekNumber} • {entry.year}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.dateKey}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-200 line-clamp-1">
                    {entry.highlight}
                  </div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 pt-1 border-t border-white/5 space-y-3 text-xs leading-relaxed"
                  >
                    <div>
                      <span className="font-mono text-emerald-400 block mb-1">
                        🏆 Greatest Victory:
                      </span>
                      <p className="text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                        {entry.highlight}
                      </p>
                    </div>

                    {entry.stumblingBlock && (
                      <div>
                        <span className="font-mono text-rose-400 block mb-1">
                          ⚠️ Crucible Lesson &amp; Stumble:
                        </span>
                        <p className="text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                          {entry.stumblingBlock}
                        </p>
                      </div>
                    )}

                    <div>
                      <span className="font-mono text-cyan-400 block mb-1">
                        🧭 Next Week Pledge:
                      </span>
                      <p className="text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                        {entry.nextWeekPledge}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
