"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Flame,
  Mail,
  Clock,
  Compass,
  Layers,
  Lock,
  CheckCircle2,
  Target,
} from "lucide-react";

export type ModuleType =
  | "milestones"
  | "constellation"
  | "crucible"
  | "letter"
  | "waqt"
  | "codex"
  | "hifz"
  | null;

interface CosmicHubDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: ModuleType) => void;
  activeModule: ModuleType;
  onLock?: () => void;
}

interface HubModule {
  id: ModuleType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

/**
 * Custom illuminated Holy Quran Icon
 * Designed specifically for "In Search of Light" (Quran Memorization & Revision)
 */
export function QuranIcon({
  className = "w-4 h-4",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Open Holy Quran pages */}
      <path d="M2 4.5C5.5 3 8.5 4 12 5.8C15.5 4 18.5 3 22 4.5V19C18.5 17.5 15.5 18.5 12 20.3C8.5 18.5 5.5 17.5 2 19V4.5Z" />
      {/* Center spine */}
      <line x1="12" y1="6" x2="12" y2="20" strokeWidth="1.5" />
      {/* Center bookmark ribbon */}
      <path
        d="M12 6V13.5L10 12L8 13.5V6"
        fill="currentColor"
        fillOpacity="0.3"
        strokeWidth="1.5"
      />
      {/* Sacred Scripture lines */}
      <line x1="5" y1="9" x2="8" y2="8.3" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="5" y1="12.5" x2="8" y2="11.8" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="16" y1="8.3" x2="19" y2="9" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="16" y1="11.8" x2="19" y2="12.5" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  );
}

// 1. LEFT COLUMN: Active Work & Goals
const WORK_MODULES: HubModule[] = [
  {
    id: "milestones",
    title: "Celestial Milestones",
    description: "Daily Sparks, Weekly Sprints, Monthly Orbits, and Yearly Cascading Horizons.",
    icon: Target,
    color: "text-violet-300 bg-violet-500/20 border-violet-400/40",
  },
  {
    id: "hifz",
    title: "In Search of Light",
    description: "Quran memorization & Fading Stars revision tracker across the 114 celestial clusters.",
    icon: QuranIcon,
    color: "text-amber-300 bg-amber-500/20 border-amber-400/40",
  },
  {
    id: "constellation",
    title: "The Winged Morning Star",
    description: "Transcending limitations to radiate singular light across the cosmos—long-term goals & canvas.",
    icon: Star,
    color: "text-cyan-300 bg-cyan-500/20 border-cyan-400/40",
  },
  {
    id: "crucible",
    title: "The Inner Crucible",
    description: "Admitting errors, shedding flaws, and deep self-examination.",
    icon: Flame,
    color: "text-amber-300 bg-amber-500/20 border-amber-400/40",
  },
];

// 2. RIGHT COLUMN: Sanctuary & Principles
const VISIT_MODULES: HubModule[] = [
  {
    id: "letter",
    title: "Care of Childhood",
    description: "Special letter from Psycho Behen: “Never stray from the center point.”",
    icon: Mail,
    color: "text-rose-300 bg-rose-500/20 border-rose-400/40",
  },
  {
    id: "waqt",
    title: "Celestial Waqt & Salah",
    description: "Daily Salah tracker, prayer timetable, and weekly-monthly-yearly analytics.",
    icon: Clock,
    color: "text-emerald-300 bg-emerald-500/20 border-emerald-400/40",
  },
  {
    id: "codex",
    title: "The Root Codex",
    description: "Life compass, anchor points, and inspirational wisdom.",
    icon: Compass,
    color: "text-indigo-300 bg-indigo-500/20 border-indigo-400/40",
  },
];

export function CosmicHubDrawer({
  isOpen,
  onClose,
  onSelectModule,
  activeModule,
  onLock,
}: CosmicHubDrawerProps) {
  const router = useRouter();

  const handleModuleClick = (moduleId: ModuleType) => {
    if (onSelectModule) {
      onSelectModule(moduleId);
    }
    if (moduleId) {
      router.push(`/${moduleId}`);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 
            Transparent Click-Away Overlay:
            NO blur on background, fully transparent click catcher
          */}
          <div
            className="fixed inset-0 z-40 bg-transparent cursor-default"
            onClick={onClose}
          />

          {/* 
            Lighter, Glowing Popover Panel
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onWheel={(e) => e.stopPropagation()}
            className="fixed top-18 sm:top-20 right-3 sm:right-6 md:right-8 z-50 w-[calc(100vw-24px)] sm:w-[580px] md:w-[680px] max-h-[min(650px,calc(100vh-100px))] bg-gradient-to-b from-[#18233d]/95 via-[#111a2f]/95 to-[#0d1527]/95 border border-cyan-400/40 ring-1 ring-white/15 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25),0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Top Glowing Iridescent Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_14px_#22d3ee] pointer-events-none" />

            {/* Ambient Inner Lights */}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-cyan-400/15 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-500/15 blur-3xl pointer-events-none rounded-full" />

            {/* Header */}
            <div className="relative px-6 pt-5 pb-3.5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-sm shadow-cyan-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-heading font-semibold text-slate-50 flex items-center gap-2">
                    Cosmic Hub
                  </h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Two-Column Structure: Distinct Roles */}
            <div className="relative flex-1 overflow-y-auto px-6 py-4.5 space-y-4 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 
                  ========================================
                  LEFT COLUMN: ACTIVE WORK
                  ========================================
                */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-badge uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Workspace & Endeavor
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {WORK_MODULES.map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeModule === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleModuleClick(item.id)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 flex items-start gap-3.5 group relative ${
                            isSelected
                              ? "bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                              : "bg-slate-800/75 hover:bg-slate-800 border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl border shrink-0 ${item.color} group-hover:scale-105 transition-transform shadow-sm`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-heading font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-300/85 font-subheading mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Tip for Active Work */}
                  <div className="p-3 rounded-2xl bg-slate-800/40 border border-cyan-500/20 flex items-center gap-2.5 text-[11px] text-cyan-200/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Daily goals, action plans, and continuous self-purification.</span>
                  </div>
                </div>

                {/* 
                  ==============================================
                  RIGHT COLUMN: SANCTUARY & ARCHIVE
                  ==============================================
                */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-badge uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      Sanctuary & Principles
                    </span>
                  </div>

                  <div className="space-y-2">
                    {VISIT_MODULES.map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeModule === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleModuleClick(item.id)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all duration-150 flex items-start gap-3 group relative ${
                            isSelected
                              ? "bg-amber-950/50 border-amber-400 ring-1 ring-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                              : "bg-slate-800/75 hover:bg-slate-800 border-white/10 hover:border-amber-400/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.12)]"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl border shrink-0 ${item.color} group-hover:scale-105 transition-transform shadow-sm`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-heading font-semibold text-slate-100 group-hover:text-amber-200 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-300/85 font-subheading mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}

                    {/* Lock Gate Trigger (Under Visit Column) */}
                    {onLock && (
                      <button
                        onClick={onLock}
                        className="w-full text-left p-2.5 rounded-2xl bg-slate-800/60 hover:bg-red-500/15 border border-white/10 hover:border-red-400/40 transition flex items-center gap-2.5 group text-xs text-slate-300 hover:text-red-300 font-mono"
                      >
                        <Lock className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                        <span>Lock Chamber</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/10 bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-heading text-slate-300 font-medium">Be Talha • Chapter 20</span>
              <span className="text-cyan-300">Union of Roots & Fajr Dawn</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
