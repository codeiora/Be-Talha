"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Lock,
  Mail,
  Quote,
  Menu,
  Layers,
  Star,
  Flame,
} from "lucide-react";
import { LifeCounter } from "./LifeCounter";
import { COSMIC_QUOTES } from "@/lib/constants";
import { ModuleType } from "../navigation/CosmicHubDrawer";

interface HeroSectionProps {
  onLock: () => void;
  onOpenMenu: () => void;
  onSelectModule: (module: ModuleType) => void;
}

export function HeroSection({ onLock, onOpenMenu, onSelectModule }: HeroSectionProps) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  const currentQuote = COSMIC_QUOTES[activeQuoteIndex];

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Ambient Navigation Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          </div>
          <div>
            <span className="font-heading tracking-widest text-sm font-semibold uppercase text-slate-200 block">
              Be Talha
            </span>
            <span className="text-[10px] text-slate-500 tracking-wider">
              Digital Compass & Mirror
            </span>
          </div>
        </div>

        {/* Action Menubar */}
        <div className="flex items-center gap-2.5">
          {/* Main Cosmic Hub Menu Button */}
          <button
            onClick={onOpenMenu}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-badge font-medium text-cyan-200 bg-cyan-950/50 border border-cyan-500/40 hover:bg-cyan-900/60 hover:border-cyan-400 transition shadow-lg shadow-cyan-950/50 backdrop-blur-md group"
            title="Open side menu"
          >
            <Menu className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs">Cosmic Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          {/* Letter Shortcut Button */}
          <Link
            href="/letter"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-badge text-amber-300/90 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition backdrop-blur-md"
            title="Care of: Childhood"
          >
            <Mail className="w-3 h-3 text-amber-400" />
            <span>Care of: Childhood</span>
          </Link>

          {/* Lock Gate */}
          <button
            onClick={onLock}
            title="Relock the gate"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-white/5 hover:border-white/15 transition backdrop-blur-md"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </motion.header>

      {/* Main Hero Body */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col items-center justify-center text-center">
        {/* Chapter 20 Celestial Greeting Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-badge tracking-wider uppercase mb-6 shadow-sm shadow-cyan-500/20 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Welcome to Chapter 20 • The Horizon</span>
        </motion.div>

        {/* Hero Title */}
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 blur-3xl rounded-full pointer-events-none" />

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-medium tracking-[0.05em] uppercase text-slate-50 max-w-4xl leading-[1.08] drop-shadow-[0_0_24px_rgba(255,255,255,0.2)]"
          >
            RISE, TALHA.
          </motion.h1>
        </div>

        {/* Philosophical Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-300/90 font-subheading max-w-2xl leading-relaxed tracking-wide"
        >
          Beyond twenty, life begins to bleed into grey. Before the world demands its heavy dues, hold fast to every color—never lifting the needle from your center, from your roots to the edge of what can be seen.
        </motion.p>

        {/* The Live Countdown / Uptime Counter */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full mt-8 md:mt-10"
        >
          <LifeCounter />
        </motion.div>

        {/* Dynamic Philosophy Quote Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 max-w-xl mx-auto p-4 rounded-2xl bg-slate-950/40 border border-white/5 backdrop-blur-md cursor-pointer hover:border-cyan-500/20 transition group"
          onClick={() =>
            setActiveQuoteIndex((prev) => (prev + 1) % COSMIC_QUOTES.length)
          }
        >
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 text-amber-400/90">
              <Quote className="w-3 h-3" />
              <span>{currentQuote.source}</span>
            </span>
            <span className="text-slate-600 group-hover:text-slate-400 transition">
              Click to cycle quote ({activeQuoteIndex + 1}/{COSMIC_QUOTES.length})
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed italic">
            &ldquo;{currentQuote.english}&rdquo;
          </p>
        </motion.div>
      </main>

      {/* Floating Bottom Quick-Launcher Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 w-full max-w-2xl mx-auto px-4 py-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        <Link
          href="/hifz"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-amber-500/20 hover:border-amber-400/50 text-xs text-slate-300 hover:text-amber-200 transition backdrop-blur-md shadow-lg group"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Divine Constellation</span>
        </Link>

        <Link
          href="/constellation"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-400/50 text-xs text-slate-300 hover:text-cyan-200 transition backdrop-blur-md shadow-lg group"
        >
          <Star className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>The Constellation</span>
        </Link>

        <Link
          href="/crucible"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-amber-500/20 hover:border-amber-400/50 text-xs text-slate-300 hover:text-amber-200 transition backdrop-blur-md shadow-lg group"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>The Crucible</span>
        </Link>

        <button
          onClick={onOpenMenu}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-xs text-cyan-300 font-mono transition backdrop-blur-md shadow-lg"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>All Modules...</span>
        </button>
      </motion.div>
    </div>
  );
}
