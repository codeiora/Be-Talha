"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Flame, Trophy, X } from "lucide-react";
import confetti from "canvas-confetti";
import { TodaySparkGoal, CATEGORY_MAP } from "@/types/milestones";

interface SupernovaRewardOverlayProps {
  task: TodaySparkGoal | null;
  pointsAwarded: number;
  onClose: () => void;
}

export function SupernovaRewardOverlay({
  task,
  pointsAwarded,
  onClose,
}: SupernovaRewardOverlayProps) {
  useEffect(() => {
    if (!task) return;

    // Multi-stage cosmic supernova particle detonation
    // Stage 1: Intense center golden blast
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#fbbf24", "#f59e0b", "#d97706", "#fef08a", "#ffffff"],
      startVelocity: 45,
    });

    // Stage 2: Dual cosmic galaxy arms
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0.15, y: 0.6 },
        colors: ["#38bdf8", "#818cf8", "#c084fc", "#ffffff"],
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
        origin: { x: 0.85, y: 0.6 },
        colors: ["#fbbf24", "#f43f5e", "#fb923c", "#ffffff"],
      });
    }, 200);

    // Stage 3: Star sprinkles from top
    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 120,
        origin: { y: 0.3 },
        shapes: ["star", "circle"],
        colors: ["#fde047", "#67e8f9", "#ffffff"],
      });
    }, 450);

    // Auto close after 4.5 seconds if untouched
    const autoClose = setTimeout(() => {
      onClose();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(autoClose);
    };
  }, [task, onClose]);

  if (!task) return null;

  const catMeta = CATEGORY_MAP[task.category] || CATEGORY_MAP.other;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl cursor-pointer"
      >
        {/* Expanding Cosmic Shockwave Rings */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0.8 }}
          animate={{ scale: [0.4, 1.8, 3], opacity: [0.8, 0.4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-72 h-72 rounded-full border border-amber-400/50 pointer-events-none"
        />
        <motion.div
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: [0.2, 1.4, 2.5], opacity: [0.9, 0.5, 0] }}
          transition={{ duration: 2.2, delay: 0.4, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-72 h-72 rounded-full border border-cyan-400/40 pointer-events-none"
        />

        {/* Ambient Supernova Glow Core */}
        <div className="absolute w-96 h-96 bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Modal Content Card */}
        <motion.div
          initial={{ scale: 0.8, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 border-2 border-amber-400/60 p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(245,158,11,0.35),0_25px_50px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Supernova Icon Badge */}
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-rose-500 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.6)] mb-5 flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center relative overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-rose-500/20"
              />
              <Star className="w-10 h-10 text-amber-300 fill-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-pulse" />
            </div>
          </div>

          {/* Pill Headline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-badge tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SUPERNOVA REWARD UNLOCKED</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-wide mb-2">
            Cosmic Resonance Detonated!
          </h2>

          <p className="text-xs sm:text-sm font-subheading text-slate-300 mb-6 max-w-md mx-auto">
            You conquered today's highest priority challenge with relentless discipline.
          </p>

          {/* Task Highlight Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-left mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-badge">
              <span className={`px-2 py-0.5 rounded-full border ${catMeta.bgLight} ${catMeta.color} ${catMeta.borderColor}`}>
                {catMeta.label}
              </span>
              <span className="text-amber-300 flex items-center gap-1 font-bold">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                High Priority Spark
              </span>
            </div>
            <p className="text-sm sm:text-base font-subheading font-medium text-white">
              {task.title}
            </p>
          </div>

          {/* XP Bounty */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-yellow-500/20 border border-amber-400/50 text-amber-200 text-sm font-badge font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-6">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>+{pointsAwarded} Cosmic XP Awarded</span>
          </div>

          {/* Action button */}
          <div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl text-xs font-badge font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition active:scale-95"
            >
              Continue Momentum
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
