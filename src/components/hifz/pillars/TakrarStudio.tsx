"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  Repeat,
  CheckCircle2,
  Users,
  Award,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";

export function TakrarStudio() {
  const [takrarCount, setTakrarCount] = useState<number>(0);
  const [takrarTarget, setTakrarTarget] = useState<number>(20);

  const handleIncrement = () => {
    const next = takrarCount + 1;
    setTakrarCount(next);

    if (next === takrarTarget) {
      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ec4899", "#ffffff"],
        });
      } catch {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setTakrarCount(0);
  };

  const progressPercent = Math.min(100, Math.round((takrarCount / takrarTarget) * 100));

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/40 border border-purple-500/30 shadow-2xl backdrop-blur-xl">
        <div className="absolute -bottom-6 -right-4 text-9xl font-serif text-purple-400/[0.04] pointer-events-none select-none">
          تكرار
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-badge mb-3">
              <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
              <span>Pillar 04 • Dedicated Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
              Takrar Studio{" "}
              <span className="text-base sm:text-lg font-bengali font-normal text-purple-400">
                (তাকরার - পুনরাবৃত্তি ও গভীর আত্মস্থকরণ)
              </span>
            </h1>
            <p className="text-sm font-subheading text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Neurological etching through high-frequency recitation loops. Repeat the target verse 20 to 50 times until speech flows naturally and without hesitation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[10, 20, 30, 50].map((num) => (
              <button
                key={num}
                onClick={() => setTakrarTarget(num)}
                className={`px-3 py-1.5 rounded-xl text-xs font-badge transition ${
                  takrarTarget === num
                    ? "bg-purple-500 text-white font-bold shadow-md shadow-purple-500/40"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {num}x Goal
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Counter & Rubric */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Big Interactive Loop Clicker */}
        <div className="p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-xl flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-badge text-purple-400 uppercase tracking-widest">
              Live Loop Progress
            </span>
            <h3 className="text-2xl font-heading font-bold text-white">
              Repetition Counter
            </h3>
          </div>

          {/* Big Circular Tap Button */}
          <button
            onClick={handleIncrement}
            className="group relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-purple-950/60 to-slate-900/90 border-2 border-purple-500/40 hover:border-purple-400 shadow-2xl shadow-purple-950/60 hover:shadow-purple-500/30 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
            <div className="absolute inset-2 rounded-full border border-purple-400/20 group-hover:border-purple-400/40" />
            <span className="text-5xl sm:text-6xl font-badge font-bold text-white group-hover:text-purple-200 drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]">
              {takrarCount}
            </span>
            <span className="text-xs font-badge text-purple-300 mt-1">
              / {takrarTarget} Loops
            </span>
            <span className="text-[10px] font-subheading text-slate-400 mt-2">
              Tap / Click to count
            </span>
          </button>

          {/* Progress bar */}
          <div className="w-full max-w-xs space-y-2">
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-white/10">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-badge text-slate-400">
              <span>{progressPercent}% Achieved</span>
              {takrarCount >= takrarTarget && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Target Reached!
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="text-xs font-badge text-slate-500 hover:text-slate-300 transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Counter</span>
          </button>
        </div>

        {/* Right Column: Classical Madrasah Takrar Rubric */}
        <div className="p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-xl space-y-5">
          <div className="pb-3 border-b border-white/10">
            <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Traditional 3-Tier Takrar Method</span>
            </h3>
            <p className="text-xs font-subheading text-slate-400 mt-0.5">
              Follow the time-tested division for foolproof retention:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-purple-500/20 space-y-1">
              <div className="flex items-center justify-between text-xs font-badge text-purple-300">
                <span>Phase 1: Visual Reading (Nazirah)</span>
                <span>10x Repeats</span>
              </div>
              <p className="text-xs font-subheading text-slate-400">
                Look attentively at the printed Arabic text. Focus on Harakaat, Waqf marks, and flawless pronunciation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-purple-500/20 space-y-1">
              <div className="flex items-center justify-between text-xs font-badge text-pink-300">
                <span>Phase 2: Closed-Eyes Recall (Hifz)</span>
                <span>10x-20x Repeats</span>
              </div>
              <p className="text-xs font-subheading text-slate-400">
                Close your eyes and recite from memory. Train your mind to see the internal mental picture of the verse.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-purple-500/20 space-y-1">
              <div className="flex items-center justify-between text-xs font-badge text-cyan-300">
                <span>Phase 3: Mutual Pair Testing (Tasmee&apos;)</span>
                <span>5x-10x Repeats</span>
              </div>
              <p className="text-xs font-subheading text-slate-400">
                Recite to a study partner or teacher without hesitations. Immediate feedback prevents ingrained mistakes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}