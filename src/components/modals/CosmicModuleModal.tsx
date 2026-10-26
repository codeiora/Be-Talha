"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Flame,
  Quote,
  Clock,
  Compass,
  Menu,
  Sparkles,
  Shield,
  BookOpen,
} from "lucide-react";
import { ModuleType } from "../navigation/CosmicHubDrawer";
import { ConstellationSection } from "../constellation/ConstellationSection";
import { CrucibleSection } from "../crucible/CrucibleSection";
import { WaqtDashboard } from "../waqt/WaqtDashboard";

interface CosmicModuleModalProps {
  activeModule: ModuleType;
  onClose: () => void;
  onOpenMenu: () => void;
  onSwitchModule: (module: ModuleType) => void;
}

const MODULE_TABS = [
  { id: "constellation" as ModuleType, label: "The Constellation (Goals)", icon: Star },
  { id: "crucible" as ModuleType, label: "The Crucible", icon: Flame },
  { id: "letter" as ModuleType, label: "Sacred Letter", icon: Quote },
  { id: "waqt" as ModuleType, label: "Celestial Waqt", icon: Clock },
  { id: "codex" as ModuleType, label: "Root Codex", icon: Compass },
];

export function CosmicModuleModal({
  activeModule,
  onClose,
  onOpenMenu,
  onSwitchModule,
}: CosmicModuleModalProps) {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (activeModule) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModule, onClose]);

  if (!activeModule) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          onWheel={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950/95 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl shadow-cyan-950/40 flex flex-col overflow-hidden z-10"
        >
          {/* Cosmic Accent Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-48 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute top-0 right-1/4 w-96 h-48 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

          {/* Sticky Modal Navigation Header */}
          <div className="relative px-4 sm:px-6 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 backdrop-blur-md z-20">
            {/* Left: Back to Menu / Hub button */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenMenu}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-slate-100 hover:bg-slate-800 border border-white/10 text-xs font-mono transition"
                title="Open side menu"
              >
                <Menu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">View Menu</span>
                <span className="sm:hidden">Menu</span>
              </button>
            </div>

            {/* Center: Module Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-white/5 overflow-x-auto max-w-full">
              {MODULE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeModule === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSwitchModule(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition whitespace-nowrap ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-cyan-300" : "text-slate-500"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 border border-transparent hover:border-white/10 transition"
              aria-label="Close modal"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-6 custom-scrollbar">
            {activeModule === "constellation" && (
              <div className="w-full">
                <ConstellationSection />
              </div>
            )}

            {activeModule === "crucible" && (
              <div className="w-full">
                <CrucibleSection />
              </div>
            )}

            {activeModule === "waqt" && (
              <div className="w-full">
                <WaqtDashboard />
              </div>
            )}

            {activeModule === "letter" && (
              <div className="w-full max-w-3xl mx-auto py-4 px-3 sm:px-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-amber-500/30 shadow-2xl shadow-amber-500/10 text-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                        Sacred Vault • Letter of Roots
                      </span>
                      <h3 className="text-xl font-heading text-slate-100 mt-1">
                        Care of: Childhood
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-white/5">
                      28th October
                    </span>
                  </div>

                  <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-slate-300">
                    <p className="font-semibold text-slate-200">Dear brother & friend,</p>
                    <p className="font-sans text-xs text-cyan-300 tracking-wide">
                      Let&apos;s embrace your new journey... You’re not a boy
                      anymore — you’re a man now.
                    </p>
                    <p>
                      Do you know? The moment you stand in right now is the most beautiful
                      chapter of life. No matter where you go in life&apos;s journey, you will yearn to return
                      to this very horizon again and again. This pole of time is pristine, unblemished, and eternal.
                    </p>
                    <p>
                      Slowly you will realize that after twenty, life takes on shades of grey. Before twenty arrives,
                      take in all the vibrant colors life has to offer.
                    </p>
                    <p className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 text-slate-200 italic leading-relaxed">
                      &ldquo;Never step away from the center of the circle merely to widen your circumference.
                      Know this: if you ever move away from the reference point, the
                      compass will only spin in vain, and the circle will never close. This anchor point is your
                      roots. Never forget your roots.&rdquo;
                    </p>
                    <p>
                      Rise and fall are the eternal rhythm of life. This path is rugged, steep, and treacherous! <br />
                      <span className="text-amber-300 font-medium">
                        Just remember ... All darkness is not black!
                      </span>
                    </p>

                    <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/25 text-center font-subheading text-slate-200 shadow-inner">
                      <p className="italic text-xs sm:text-sm text-amber-200/90 leading-loose">
                        He who has tasted the essence of lived days;<br />
                        Do you know the deep yearning his caged heart conveys?<br />
                        Awaiting the dawn of Fajr&apos;s gentle light—<br />
                        Just as pitch darkness colors the nocturnal sky;<br />
                        The melody of his Hijazi wisdom flows high,<br />
                        Echoing across millions of light-years to stars in the night!
                      </p>
                    </div>

                    <p className="text-right pt-4 text-xs text-slate-400">
                      May you have two wings. Be a winged morning star!<br />
                      <span className="font-semibold text-slate-300">
                        Yours, Psycho Behen
                      </span>
                      <br />
                      28 October 2025 • Ashulia, Savar
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeModule === "codex" && (
              <div className="w-full max-w-3xl mx-auto py-4 px-3 sm:px-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-wider mb-2">
                    <Compass className="w-3.5 h-3.5" />
                    <span>The Center Point • Core Spirit</span>
                  </div>
                  <h3 className="text-2xl font-heading text-slate-100">
                    Root Principles & Life Philosophy
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    The four foundational pillars to find your path and sustain inner balance in moments of trial.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 shadow-lg">
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>1. The Center Reference Point (The Anchor Point)</span>
                      </span>
                      <span className="text-slate-500">Care of: Childhood</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed italic">
                      &ldquo;To widen your circumference, never stray from the center of the circle. Know this: if you ever step away from the reference point, the compass will only spin in vain, and the circle will never close. This anchor point is your roots. Never forget your roots.&rdquo;
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/30 shadow-lg">
                    <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>2. Philosophy of Light & Darkness (All Darkness is Not Black)</span>
                      </span>
                      <span className="text-slate-500">Psycho Behen</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed italic">
                      &ldquo;Rise and fall are life’s eternal rhythm. The path is rugged and arduous! Just remember ... All darkness is not black! In the deepest depths of the darkest night, the first light of Fajr dawn is born.&rdquo;
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 shadow-lg">
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>3. Subhe Sadik & Shuktara (The Winged Beacon)</span>
                      </span>
                      <span className="text-slate-500">28th October 2006</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed italic">
                      &ldquo;May you have two wings. Be a winged morning star! Radiate the wisdom of the Hijaz across millions of light-years to distant stars. Hold tight to your roots while spreading your wings to the highest skies.&rdquo;
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/30 shadow-lg">
                    <div className="flex items-center justify-between text-xs font-mono text-indigo-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-indigo-400" />
                        <span>4. Perseverance & Discipline (Chapter 20 Focus)</span>
                      </span>
                      <span className="text-slate-500">Self-Discipline</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed italic">
                      &ldquo;Age twenty is the vibrant dawn before life fades into monochrome. Stay resolute in your purpose, character, and prayer times—striving tirelessly to improve by at least 1% each day and forge yourself into a purer soul.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
