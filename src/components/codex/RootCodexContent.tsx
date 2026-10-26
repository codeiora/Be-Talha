"use client";

import React from "react";
import { Compass, Sparkles, Flame, Clock, Shield } from "lucide-react";

export function RootCodexContent() {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-3 sm:px-6">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-badge uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          <span>The Center Point • Core Spirit</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading text-slate-100 font-bold">
          Root Principles & Life Philosophy
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-subheading mt-2 max-w-lg mx-auto leading-relaxed">
          The four foundational pillars to find your path and sustain inner balance in moments of trial.
        </p>
      </div>

      {/* Principle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Principle 1 */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-cyan-400/60 transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-cyan-300 mb-3">
            <span className="flex items-center gap-2 text-base font-heading font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              1. The Center Reference Point
            </span>
            <span className="text-[10px] text-slate-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full font-badge">
              The Anchor Point
            </span>
          </div>
          <p className="text-sm text-slate-200 font-subheading leading-relaxed italic bg-slate-950/60 p-4 rounded-2xl border border-white/5">
            &ldquo;To widen your circumference, never stray from the center of the circle. Know this: if you ever step away from the reference point, the compass will only spin in vain, and the circle will never close. This anchor point is your roots. Never forget your roots.&rdquo;
          </p>
          <div className="mt-3 text-right text-[11px] font-mono text-slate-500">
            Source: Care of: Childhood
          </div>
        </div>

        {/* Principle 2 */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-amber-400/60 transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-amber-300 mb-3">
            <span className="flex items-center gap-2 text-base font-heading font-semibold">
              <Flame className="w-4 h-4 text-amber-400" />
              2. Philosophy of Light & Darkness
            </span>
            <span className="text-[10px] text-slate-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full font-badge">
              Inner Light
            </span>
          </div>
          <p className="text-sm text-slate-200 font-subheading leading-relaxed italic bg-slate-950/60 p-4 rounded-2xl border border-white/5">
            &ldquo;Rise and fall are life’s eternal rhythm. The path is rugged and arduous! Just remember ... All darkness is not black! In the deepest depths of the darkest night, the first light of Fajr dawn is born.&rdquo;
          </p>
          <div className="mt-3 text-right text-[11px] font-mono text-slate-500">
            Source: Psycho Behen
          </div>
        </div>

        {/* Principle 3 */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-emerald-400/60 transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-emerald-300 mb-3">
            <span className="flex items-center gap-2 text-base font-heading font-semibold">
              <Clock className="w-4 h-4 text-emerald-400" />
              3. Subhe Sadik & Shuktara
            </span>
            <span className="text-[10px] text-slate-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full font-badge">
              The Winged Beacon
            </span>
          </div>
          <p className="text-sm text-slate-200 font-subheading leading-relaxed italic bg-slate-950/60 p-4 rounded-2xl border border-white/5">
            &ldquo;May you have two wings. Be a winged morning star! Radiate the wisdom of the Hijaz across millions of light-years to distant stars. Hold tight to your roots while spreading your wings to the highest skies.&rdquo;
          </p>
          <div className="mt-3 text-right text-[11px] font-mono text-slate-500">
            Source: 28th October 2025
          </div>
        </div>

        {/* Principle 4 */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-indigo-400/60 transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-indigo-300 mb-3">
            <span className="flex items-center gap-2 text-base font-heading font-semibold">
              <Shield className="w-4 h-4 text-indigo-400" />
              4. Perseverance & Discipline
            </span>
            <span className="text-[10px] text-slate-400 bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded-full font-badge">
              Chapter 20 Focus
            </span>
          </div>
          <p className="text-sm text-slate-200 font-subheading leading-relaxed italic bg-slate-950/60 p-4 rounded-2xl border border-white/5">
            &ldquo;Age twenty is the vibrant dawn before life fades into monochrome. Stay resolute in your purpose, character, and prayer times—striving tirelessly to improve by at least 1% each day and forge yourself into a purer soul.&rdquo;
          </p>
          <div className="mt-3 text-right text-[11px] font-mono text-slate-500">
            Source: Personal Resolution
          </div>
        </div>
      </div>
    </div>
  );
}
