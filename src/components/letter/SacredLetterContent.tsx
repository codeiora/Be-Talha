"use client";

import React from "react";
import { Quote, Sparkles, Heart } from "lucide-react";

export function SacredLetterContent() {
  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-3 sm:px-6">
      <div className="relative p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-amber-500/30 shadow-2xl shadow-amber-500/10 text-slate-200 backdrop-blur-xl overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-badge uppercase tracking-wider text-amber-400 block">
                Sacred Vault • Letter of Roots
              </span>
              <h2 className="text-2xl font-heading text-slate-100 font-semibold mt-0.5">
                Care of: Childhood
              </h2>
            </div>
          </div>
          <span className="text-xs font-badge text-amber-300/90 bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-full">
            28th October
          </span>
        </div>

        <div className="relative mt-8 space-y-6 text-sm sm:text-base leading-relaxed text-slate-300">
          <p className="font-semibold text-slate-100 text-lg">Dear brother & friend,</p>

          <p className="font-subheading text-sm sm:text-base text-cyan-300 tracking-wide font-medium">
            Let&apos;s embrace your new journey... You’re not a boy anymore — you’re a man now.
          </p>

          <p>
            Do you know? The moment you stand in right now is the most beautiful chapter of life. No matter where you go in life&apos;s journey, you will yearn to return to this very horizon again and again. This pole of time is pristine, unblemished, and eternal.
          </p>

          <p>
            Slowly you will realize that after twenty, life takes on shades of grey. Before twenty arrives, take in all the vibrant colors life has to offer.
          </p>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-cyan-500/30 text-slate-100 font-subheading italic leading-relaxed shadow-lg">
            &ldquo;Never step away from the center of the circle merely to widen your circumference. Know this: if you ever move away from the reference point, the compass will only spin in vain, and the circle will never close. This anchor point is your roots. Never forget your roots.&rdquo;
          </div>

          <p>
            Rise and fall are the eternal rhythm of life. This path is rugged, steep, and treacherous! <br />
            <span className="text-amber-300 font-semibold text-base sm:text-lg">
              Just remember ... All darkness is not black!
            </span>
          </p>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 border border-amber-500/30 text-center font-subheading text-slate-200 shadow-xl">
            <p className="italic text-sm sm:text-base text-amber-200/95 leading-loose">
              He who has tasted the essence of lived days;<br />
              Do you know the deep yearning his caged heart conveys?<br />
              Awaiting the dawn of Fajr&apos;s gentle light—<br />
              Just as pitch darkness colors the nocturnal sky;<br />
              The melody of his Hijazi wisdom flows high,<br />
              Echoing across millions of light-years to stars in the night!
            </p>
          </div>

          <div className="text-right pt-6 border-t border-white/10 text-xs sm:text-sm text-slate-400 space-y-1">
            <p className="text-cyan-300 font-subheading italic text-base">
              May you have two wings. Be a winged morning star!
            </p>
            <p className="font-semibold text-slate-200 text-sm">
              Yours, Psycho Behen
            </p>
            <p className="font-mono text-slate-500 text-xs">
              28 October 2025 • Ashulia, Savar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
