"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Flame,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Star,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Compass,
  Layers,
  HeartHandshake,
} from "lucide-react";
import { HifzSurahProgress, AmukhtaStreakData } from "@/types/hifz";
import {
  loadHifzProgress,
  recordSurahRevision,
  loadAmukhtaStreak,
  recordAmukhtaRevision,
} from "@/lib/hifzStorage";
import { getSurahMeta } from "@/lib/quranData";
import confetti from "canvas-confetti";
import { AmukhtaConstellationCanvas } from "../amukhta/AmukhtaConstellationCanvas";
import { AmukhtaActionPanel } from "../amukhta/AmukhtaActionPanel";
import { AmukhtaDiligenceCards } from "../amukhta/AmukhtaDiligenceCards";
import { AmukhtaZenModal } from "../amukhta/AmukhtaZenModal";

export function AmukhtaRadar() {
  const [progressList, setProgressList] = useState<HifzSurahProgress[]>([]);
  const [streakData, setStreakData] = useState<AmukhtaStreakData>({
    currentStreak: 3,
    bestStreak: 7,
    lastRevisionDate: new Date().toISOString().split("T")[0],
    totalRevisionsCount: 14,
  });
  const [zenSurahNumber, setZenSurahNumber] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setProgressList(loadHifzProgress());
    setStreakData(loadAmukhtaStreak());
  }, []);

  // Supernova celebration trigger
  const triggerSupernovaCelebration = useCallback((surahName: string) => {
    try {
      // First burst - Golden Starlight
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#ffffff", "#f59e0b"],
      });

      // Second burst - Cyan Celestial Ring
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 100,
          origin: { y: 0.5 },
          colors: ["#38bdf8", "#818cf8", "#ffffff"],
        });
      }, 200);
    } catch {
      // Ignore if confetti fails
    }

    setToastMessage(`সুবহানাল্লাহ! ${surahName}-এর নূর পূর্ণ শুভ্র জ্যোতিতে পুনরুজ্জীবিত হয়েছে!`);
    setTimeout(() => setToastMessage(null), 4500);
  }, []);

  // Handle Mark as Revised (From Canvas or Priority List)
  const handleRevise = useCallback((surahNumber: number) => {
    const { progressList: updatedList, streak } = recordAmukhtaRevision(surahNumber);
    setProgressList(updatedList);
    setStreakData(streak);

    const meta = getSurahMeta(surahNumber);
    triggerSupernovaCelebration(meta ? meta.nameBangla : `সূরা #${surahNumber}`);
  }, [triggerSupernovaCelebration]);

  // Handle completion from Zen Focus Mode
  const handleCompleteZenRevision = useCallback((surahNumber: number) => {
    handleRevise(surahNumber);
    setZenSurahNumber(null);
  }, [handleRevise]);

  const memorizedSurahs = progressList.filter(
    (p) => p.isFullyMemorized || p.memorizedAyahs.length > 0
  );
  const criticalCount = memorizedSurahs.filter(
    (p) => p.luminosityState === "critical"
  ).length;

  return (
    <div className="space-y-8">
      {/* 1. Header Section & Philosophical Text */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-2xl backdrop-blur-xl">
        {/* Subtle decorative watermark */}
        <div className="absolute -bottom-8 -right-4 text-9xl font-serif text-amber-400/[0.04] pointer-events-none select-none">
          المَحْفُوظ
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-badge">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Pillar 03 • The Guardian Vault • আমোখতা</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-wide">
              AMUKHTA : <span className="text-amber-400">THE MEMORY VAULT</span>
            </h1>

            {/* Philosophical Subtitle / Quote */}
            <blockquote className="border-l-2 border-amber-400/60 pl-3.5 py-1">
              <p className="text-sm sm:text-base font-bengali text-amber-200/95 font-medium leading-relaxed italic">
                “যে আলো একবার হৃদয়ে ধারণ করেছ, তাকে নিভতে দিও না। নক্ষত্ররা তখনই পথ দেখায়, যখন তাদের আলো ধরে রাখা যায়।”
              </p>
              <footer className="text-[11px] font-bengali text-slate-400 mt-1">
                রাসূলুল্লাহ ﷺ বলেছেন: কুরআনের দৃষ্টান্ত সেই উটের মতো, যাকে যত্নসহ বেঁধে না রাখলে সে পালিয়ে যায় (সহীহ বুখারী)।
              </footer>
            </blockquote>
          </div>

          {/* Quick Header Badges */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-badge text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{memorizedSurahs.length} টি নক্ষত্র সুরক্ষিত</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-badge text-slate-300">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{streakData.currentStreak} দিন স্ট্রিক 🔥</span>
            </div>

            {criticalCount > 0 && (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-xs font-badge text-rose-300 animate-pulse font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>{criticalCount} টি নক্ষত্রের আলো বিপদে!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Supernova Toast notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-slate-950/95 border border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-2xl flex items-center gap-3 text-xs font-badge text-amber-200 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Canvas: The Fading Constellation Canvas */}
      <section className="space-y-3">
        <AmukhtaConstellationCanvas
          progressList={progressList}
          onRevise={handleRevise}
          onOpenZen={(num) => setZenSurahNumber(num)}
        />
      </section>

      {/* 3. Action Panel & Today's Priority */}
      <section className="space-y-3">
        <AmukhtaActionPanel
          progressList={progressList}
          onRevise={handleRevise}
          onOpenZen={(num) => setZenSurahNumber(num)}
        />
      </section>

      {/* 4. Diligence Cards & Analytics */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-heading font-bold text-slate-200">
            Diligence Analytics & Starlight Retention
          </h3>
        </div>
        <AmukhtaDiligenceCards
          progressList={progressList}
          streakData={streakData}
        />
      </section>

      {/* 5. Zen Revision Focus Mode Modal */}
      {zenSurahNumber !== null && (
        <AmukhtaZenModal
          surahNumber={zenSurahNumber}
          onClose={() => setZenSurahNumber(null)}
          onCompleteRevision={handleCompleteZenRevision}
        />
      )}
    </div>
  );
}
