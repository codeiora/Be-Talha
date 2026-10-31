"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Flame,
  RotateCcw,
  ShieldAlert,
  Compass,
} from "lucide-react";

interface PillarHeaderNavProps {
  currentPillar: "sabaq" | "sabqi" | "amukhta" | "takrar" | "mutashabihat";
}

const PILLARS = [
  { id: "sabaq", label: "1. Sabaq (New)", href: "/hifz/sabaq", icon: Sparkles, color: "text-emerald-400", activeBg: "bg-emerald-500/20 text-emerald-200 border-emerald-400/50" },
  { id: "sabqi", label: "2. Sabqi (Recent)", href: "/hifz/sabqi", icon: Layers, color: "text-cyan-400", activeBg: "bg-cyan-500/20 text-cyan-200 border-cyan-400/50" },
  { id: "amukhta", label: "3. Amukhta (Daur)", href: "/hifz/amukhta", icon: Flame, color: "text-amber-400", activeBg: "bg-amber-500/20 text-amber-200 border-amber-400/50" },
  { id: "takrar", label: "4. Takrar (Loops)", href: "/hifz/takrar", icon: RotateCcw, color: "text-purple-400", activeBg: "bg-purple-500/20 text-purple-200 border-purple-400/50" },
  { id: "mutashabihat", label: "5. Mutashabihaat", href: "/hifz/mutashabihaat", icon: ShieldAlert, color: "text-rose-400", activeBg: "bg-rose-500/20 text-rose-200 border-rose-400/50" },
];

export function PillarHeaderNav({ currentPillar }: PillarHeaderNavProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
      {/* Back to Hub Button */}
      <Link
        href="/hifz"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-400/40 text-xs font-badge text-slate-300 hover:text-white transition shadow-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4 text-cyan-400" />
        <span>Back to Celestial Canvas & The Hifz Orbit</span>
      </Link>

      {/* Quick Pillar Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md text-xs font-badge">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          const isActive = currentPillar === p.id;
          return (
            <Link
              key={p.id}
              href={p.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                isActive
                  ? `${p.activeBg} font-medium shadow-sm`
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${p.color}`} />
              <span>{p.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}