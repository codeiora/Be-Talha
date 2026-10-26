"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Sparkles,
  ShieldCheck,
  Calendar,
  Lock,
  ChevronDown,
  Trash2,
} from "lucide-react";

export interface ReflectionEntry {
  id: string;
  text: string;
  date: string;
  timestamp: number;
}

const STORAGE_KEY_REFLECTIONS = "be_talha_crucible_reflections_v1";

export function CrucibleSection() {
  const [reflectionText, setReflectionText] = useState("");
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [isForging, setIsForging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [justForged, setJustForged] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load reflections from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REFLECTIONS);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load reflections from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_REFLECTIONS, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save reflections to localStorage:", e);
    }
  }, [entries, isLoaded]);

  const handleSaveToVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    setIsForging(true);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const newEntry: ReflectionEntry = {
      id: "reflection-" + Date.now(),
      text: reflectionText.trim(),
      date: formattedDate,
      timestamp: Date.now(),
    };

    // Fade out and transform animation sequence
    setTimeout(() => {
      setEntries((prev) => [newEntry, ...prev]);
      setReflectionText("");
      setIsForging(false);
      setJustForged(true);

      setTimeout(() => {
        setJustForged(false);
      }, 4000);
    }, 700);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 selection:bg-amber-500/30">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-badge tracking-wider uppercase text-amber-400 mb-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>The Crucible • Self-Purification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading text-slate-100 font-semibold">
            Accountability & Forging Wisdom
          </h2>
          <p className="text-sm text-slate-300 mt-1 font-subheading">
            &ldquo;All darkness is not black.&rdquo; Admitting flaws is the cradle of self-restraint and wisdom.
          </p>
        </div>

        {/* Counter of Transformed Stumbles */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            <strong className="text-slate-200 font-badge font-medium">
              {entries.length}
            </strong>{" "}
            stumbles forged into wisdom
          </span>
        </div>
      </div>

      {/* Main Crucible Writing Box Card */}
      <div className="relative rounded-3xl bg-slate-950/70 border border-slate-800/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Ambient flame glow effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

        <form onSubmit={handleSaveToVault} className="relative z-10 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300/80">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Daily Confession & Reflection</span>
            </span>
            <span className="text-[11px] text-slate-400 font-light hidden sm:inline">
              Writing strips away arrogance.
            </span>
          </div>

          {/* Text Area with Smooth Fade & Transformation Animation */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {isForging ? (
                <motion.div
                  key="forging"
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full min-h-[140px] flex flex-col items-center justify-center rounded-2xl bg-slate-900/40 border border-amber-400/40 p-6 text-amber-300"
                >
                  <Sparkles className="w-7 h-7 text-amber-400 animate-spin mb-2" />
                  <p className="text-sm font-medium tracking-wide">
                    Darkness is transmuting into wisdom...
                  </p>
                </motion.div>
              ) : (
                <motion.textarea
                  key="textarea"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Today I made this mistake: ..."
                  rows={4}
                  className="w-full p-4 sm:p-5 text-sm sm:text-base text-slate-100 placeholder:text-slate-400 bg-slate-900/60 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition duration-300 resize-none leading-relaxed"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Your private reflections are encrypted locally in your browser.</span>
            </div>

            <button
              type="submit"
              disabled={!reflectionText.trim() || isForging}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-badge text-xs tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Save to Vault</span>
            </button>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {justForged && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center flex items-center justify-center gap-2 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>The reflection has been forged into your vault. You took one step closer to wisdom.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* History / Vault Accordion Toggle */}
        {entries.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <button
              onClick={() => setShowHistory((prev) => !prev)}
              className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 transition py-1"
            >
              <span className="flex items-center gap-2 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  Crucible Archive ({entries.length} reflections stored)
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showHistory ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* List of Previous Reflections */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-3 overflow-hidden"
                >
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <span className="inline-block text-[10px] font-mono text-cyan-400/90 tracking-wider">
                          {entry.date}
                        </span>
                        <p className="text-slate-300 font-bengali text-sm leading-relaxed whitespace-pre-wrap">
                          {entry.text}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        title="Delete reflection"
                        className="self-end sm:self-auto p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
