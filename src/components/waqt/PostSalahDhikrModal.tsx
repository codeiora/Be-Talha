"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Heart,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toBengaliNumber } from "@/types/salah";

interface PostSalahDhikrModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerNameBn: string;
}

type DhikrStep = "subhanallah" | "alhamdulillah" | "allahuakbar" | "completed";

export function PostSalahDhikrModal({
  isOpen,
  onClose,
  prayerNameBn,
}: PostSalahDhikrModalProps) {
  const [step, setStep] = useState<DhikrStep>("subhanallah");
  const [count, setCount] = useState<number>(0);
  const [totalCycleCount, setTotalCycleCount] = useState<number>(0);

  if (!isOpen) return null;

  const targetForStep = step === "allahuakbar" ? 34 : 33;

  const handleTap = () => {
    const nextCount = count + 1;
    setCount(nextCount);

    if (nextCount >= targetForStep) {
      if (step === "subhanallah") {
        setStep("alhamdulillah");
        setCount(0);
      } else if (step === "alhamdulillah") {
        setStep("allahuakbar");
        setCount(0);
      } else if (step === "allahuakbar") {
        setStep("completed");
        setCount(34);
        setTotalCycleCount((c) => c + 1);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#34d399", "#38bdf8", "#fbbf24"],
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleReset = () => {
    setStep("subhanallah");
    setCount(0);
  };

  const getDhikrText = () => {
    switch (step) {
      case "subhanallah":
        return {
          arabic: "سُبْحَانَ اللَّهِ",
          bengali: "SubhanAllah",
          meaning: "Glory be to Allah, free from all imperfection",
          target: 33,
        };
      case "alhamdulillah":
        return {
          arabic: "الْحَمْدُ لِلَّهِ",
          bengali: "Alhamdulillah",
          meaning: "All praise and gratitude is due solely to Allah",
          target: 33,
        };
      case "allahuakbar":
        return {
          arabic: "اللَّهُ أَكْبَرُ",
          bengali: "Allahu Akbar",
          meaning: "Allah is the Greatest",
          target: 34,
        };
      case "completed":
        return {
          arabic: "لَا إِلٰهَ إِلَّا اللَّهُ",
          bengali: "100 Dhikr Completed!",
          meaning: "Masha'Allah! 100 counts of remembrance completed.",
          target: 100,
        };
    }
  };

  const currentDhikr = getDhikrText();
  const progressPct = step === "completed" ? 100 : (count / targetForStep) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#090e1c] to-[#040711] border border-cyan-400/40 p-6 shadow-2xl shadow-cyan-950/80 text-center"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300">
                {prayerNameBn} Post-Salah Dhikr
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                step === "subhanallah"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              SubhanAllah (33)
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                step === "alhamdulillah"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold"
                  : step === "allahuakbar" || step === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              Alhamdulillah (33)
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                step === "allahuakbar"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold"
                  : step === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              Allahu Akbar (34)
            </span>
          </div>

          {/* Large Arabic Calligraphy */}
          <div className="my-4">
            <h3 className="text-3xl sm:text-4xl font-heading text-slate-100 font-bold tracking-wide">
              {currentDhikr.arabic}
            </h3>
            <p className="text-lg font-semibold text-cyan-300 mt-1">
              {currentDhikr.bengali}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentDhikr.meaning}
            </p>
          </div>

          {/* Interactive Tap Counter Ring Button */}
          <div className="my-6 flex items-center justify-center">
            <button
              onClick={step === "completed" ? handleReset : handleTap}
              className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center group focus:outline-none transition-transform active:scale-95"
            >
              {/* Rotating outer ring */}
              <div
                className="absolute inset-0 rounded-full border-4 border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors"
                style={{
                  background: `conic-gradient(#22d3ee ${progressPct}%, rgba(255,255,255,0.05) ${progressPct}% 100%)`,
                }}
              />

              {/* Inner Circle Button */}
              <div className="relative w-36 h-36 rounded-full bg-slate-900 border border-cyan-400/40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all">
                {step === "completed" ? (
                  <div className="flex flex-col items-center text-emerald-300">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1" />
                    <span className="text-xs font-bold">Alhamdulillah</span>
                    <span className="text-[10px] font-mono text-slate-400">Tap to reset</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-mono font-bold text-slate-100">
                      {toBengaliNumber(count)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      / {toBengaliNumber(targetForStep)}
                    </span>
                    <span className="text-[10px] text-cyan-300 mt-1">
                      Tap to count
                    </span>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Ayat-ul-Kursi Tip */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-[11px] text-amber-200/90 leading-relaxed text-left">
            💡 <strong>Noble Hadith:</strong> The Messenger of Allah (ﷺ) said: “Whoever recites Ayat al-Kursi after every obligatory prayer, nothing stands between him and entering Paradise except death.”
          </div>

          {/* Action Row */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 text-xs transition font-semibold"
            >
              Mark as Completed
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
