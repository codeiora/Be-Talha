"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sparkles, ArrowRight, Lock, KeyRound } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

interface SecretGateProps {
  onUnlock: () => void;
}

export function SecretGate({ onUnlock }: SecretGateProps) {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passkey.trim().toLowerCase();

    const isMatch = APP_CONFIG.validPasskeys.some(
      (valid) => valid.toLowerCase() === cleanInput
    );

    if (isMatch) {
      setIsSuccess(true);
      setError(false);
      try {
        localStorage.setItem(APP_CONFIG.localStorageKey, "unlocked");
      } catch (err) {
        console.error("Storage error:", err);
      }
      setTimeout(() => {
        onUnlock();
      }, 900);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden select-none">
      {/* Background ambient cosmic & nebula glow */}
      <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-tr from-cyan-900/25 via-indigo-900/20 to-purple-900/25 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute w-[280px] h-[280px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

      {/* Main Secret Gate Card with Galaxy Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl bg-slate-950/70 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-950/50 text-center"
      >
        {/* Animated Compass Core with Orbiting Celestial Nodes */}
        <div className="relative flex items-center justify-center mx-auto mb-8 w-24 h-24">
          {/* Inner orbit ring with orbiting celestial cyan spark */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border border-dashed border-cyan-400/30"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]" />
          </motion.div>

          {/* Outer orbit ring with orbiting amber starlight node */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-full border border-dotted border-amber-400/30"
          >
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]" />
          </motion.div>

          {/* Center Reference Core */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {isSuccess ? (
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            ) : (
              <Compass className="w-6 h-6 text-cyan-300 animate-spin-slow" />
            )}
          </div>
        </div>

        {/* Title & Epigraph */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-badge tracking-[0.15em] text-cyan-300 uppercase mb-3">
            <Sparkles className="w-3 h-3 text-amber-300" /> Cosmic Gateway • Chapter 20
          </span>
          <h1 className="text-2xl md:text-3xl font-heading tracking-wide text-slate-100 font-medium">
            Be Talha
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-300/80 font-subheading leading-relaxed">
            &ldquo;To widen your circumference, never stray from the center of the circle...&rdquo;
          </p>
        </motion.div>

        {/* Input Form with Shake Animation on Error */}
        <motion.form
          onSubmit={handleSubmit}
          animate={
            error
              ? { x: [-12, 12, -8, 8, -4, 4, 0] }
              : isSuccess
              ? { scale: [1, 1.03, 1] }
              : {}
          }
          transition={{ duration: 0.5 }}
          className="mt-8 space-y-4"
        >
          <div className="relative group">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-amber-500/20 blur-sm opacity-50 group-hover:opacity-100 transition duration-300 pointer-events-none" />
            <div className="relative flex items-center rounded-xl bg-slate-900/90 border border-white/10 group-focus-within:border-cyan-400/50 transition">
              <span className="pl-4 text-slate-400">
                <KeyRound className="w-4 h-4 text-cyan-400/70" />
              </span>
              <input
                type="text"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter secret passkey (e.g. shuktara)..."
                autoFocus
                className="w-full py-3.5 pl-3 pr-12 text-sm bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none tracking-wider text-center"
              />
              <button
                type="submit"
                aria-label="Unlock Gate"
                className="absolute right-2 p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition duration-200"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feedback status */}
          <div className="min-h-[22px]">
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-rose-400 tracking-wide"
                >
                  Incorrect passkey. Call upon Shuktara...
                </motion.p>
              )}
              {isSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-amber-300 font-medium tracking-wide flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Opening cosmic gateway...
                </motion.p>
              )}
              {!error && !isSuccess && (
                <p className="text-[11px] text-slate-500 tracking-wider">
                  Hint: <span className="text-slate-400 italic">shuktara</span> or birthdate (<span className="text-slate-400 italic">2810</span>)
                </p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        {/* Subtle footer credit */}
        <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-light">
          <Lock className="w-3 h-3 text-slate-600" />
          <span>Locked in the custody of fading childhood</span>
        </div>
      </motion.div>
    </div>
  );
}
