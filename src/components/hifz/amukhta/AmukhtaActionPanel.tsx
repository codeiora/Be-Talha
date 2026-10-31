"use client";

import React from "react";
import {
  Flame,
  AlertTriangle,
  Sparkles,
  Play,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { HifzSurahProgress } from "@/types/hifz";
import { getSurahMeta } from "@/lib/quranData";

interface AmukhtaActionPanelProps {
  progressList: HifzSurahProgress[];
  onRevise: (surahNumber: number) => void;
  onOpenZen: (surahNumber: number) => void;
}

export function AmukhtaActionPanel({
  progressList,
  onRevise,
  onOpenZen,
}: AmukhtaActionPanelProps) {
  const memorized = progressList.filter(
    (p) => p.isFullyMemorized || p.memorizedAyahs.length > 0
  );

  // Urgent revisions: Surahs with longest revision gap (descending)
  const urgentQueue = [...memorized]
    .sort((a, b) => b.daysSinceRevision - a.daysSinceRevision)
    .slice(0, 4);

  const criticalCount = memorized.filter(
    (p) => p.luminosityState === "critical"
  ).length;
  const dimmingCount = memorized.filter(
    (p) => p.luminosityState === "dimming"
  ).length;

  return (
    <div className="p-6 rounded-3xl bg-slate-950/80 border border-amber-500/20 backdrop-blur-xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-badge mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Today's Priority • আজকের জরুরি আমোখতা</span>
          </div>
          <h3 className="text-xl font-heading font-bold text-white tracking-wide">
            Starlight Rescue Queue{" "}
            <span className="text-sm font-bengali font-normal text-amber-400">
              (যে নক্ষত্রগুলোর আলো প্রায় নিভে যাচ্ছে)
            </span>
          </h3>
          <p className="text-xs font-subheading text-slate-300 mt-1">
            সিস্টেমের স্মার্ট অ্যালগরিদম অনুযায়ী আজ এই সূরাগুলোর নূর পুনরুজ্জীবিত করা সর্বাধিক জরুরি।
          </p>
        </div>

        {/* Quick status badge */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="px-3 py-1 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-badge font-bold animate-pulse">
              {criticalCount} Critical
            </span>
          )}
          {dimmingCount > 0 && (
            <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-badge">
              {dimmingCount} Dimming
            </span>
          )}
        </div>
      </div>

      {/* List of Urgent Surahs */}
      {urgentQueue.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-subheading text-slate-200">
            আলহামদুলিল্লাহ! আপনার মেমোরি ভল্টের সব নক্ষত্র সতেজ ও পূর্ণ আলোতে ভাসছে।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {urgentQueue.map((item) => {
            const meta = getSurahMeta(item.surahNumber);
            if (!meta) return null;

            const isCritical = item.luminosityState === "critical";
            const isDimming = item.luminosityState === "dimming";

            return (
              <div
                key={item.surahNumber}
                className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
                  isCritical
                    ? "bg-gradient-to-br from-rose-950/30 via-slate-950/70 to-slate-900/60 border-rose-500/40 shadow-lg shadow-rose-950/30"
                    : isDimming
                    ? "bg-gradient-to-br from-amber-950/30 via-slate-950/70 to-slate-900/60 border-amber-500/40 shadow-lg shadow-amber-950/20"
                    : "bg-slate-900/60 border-white/10 hover:border-white/20"
                }`}
              >
                {/* Glow Accent behind */}
                <div
                  className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
                    isCritical
                      ? "bg-rose-500/15"
                      : isDimming
                      ? "bg-amber-500/15"
                      : "bg-cyan-500/10"
                  }`}
                />

                {/* Top Row: Surah Info & Days elapsed */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-badge px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        সূরা #{meta.number}
                      </span>
                      <span className="text-xs font-badge text-slate-400">
                        পারা {meta.juzNumber} • {meta.totalAyahs} আয়াত
                      </span>
                    </div>
                    <h4 className="text-base font-heading font-bold text-white mt-1">
                      {meta.nameEnglish}{" "}
                      <span className="text-xs font-bengali font-normal text-slate-300">
                        ({meta.nameBangla})
                      </span>
                    </h4>
                  </div>

                  {/* Recency Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-badge font-bold ${
                      isCritical
                        ? "bg-rose-500/20 text-rose-300 border border-rose-400/40 animate-pulse"
                        : isDimming
                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {item.daysSinceRevision === 0
                        ? "আজকে"
                        : `${item.daysSinceRevision} দিন আগে`}
                    </span>
                  </div>
                </div>

                {/* Starlight Health Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-badge">
                    <span className="text-slate-400">আলোর স্থিতি (Starlight Health):</span>
                    <span
                      className={`font-bold ${
                        isCritical
                          ? "text-rose-400"
                          : isDimming
                          ? "text-amber-400"
                          : "text-cyan-300"
                      }`}
                    >
                      {item.luminosityScore}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCritical
                          ? "bg-gradient-to-r from-rose-600 to-red-500 animate-pulse"
                          : isDimming
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                          : "bg-gradient-to-r from-emerald-500 to-cyan-400"
                      }`}
                      style={{ width: `${item.luminosityScore}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons: Mark Revised & Zen Daur */}
                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => onRevise(meta.number)}
                    className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/25 via-amber-500/35 to-amber-600/25 hover:from-amber-500/40 hover:to-amber-600/40 border border-amber-400/50 text-amber-100 text-xs font-badge font-bold transition shadow-md shadow-amber-950/30 group/btn"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover/btn:rotate-180 transition-transform duration-500" />
                    <span>নূর পুনরুজ্জীবিত করুন</span>
                  </button>

                  <button
                    onClick={() => onOpenZen(meta.number)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 hover:border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-badge transition"
                    title="Zen Revision Mode"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Zen Daur</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
