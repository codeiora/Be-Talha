"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Flame,
  Award,
} from "lucide-react";
import {
  DailySalahRecord,
  MAIN_PRAYERS,
  PrayerKey,
  PrayerStatus,
  toBengaliNumber,
} from "@/types/salah";

interface CelestialSalahOrbitProps {
  todayRecord: DailySalahRecord;
  selectedPrayerKey: PrayerKey | null;
  onSelectPrayer: (key: PrayerKey) => void;
  onTogglePrayer: (key: PrayerKey, targetStatus: PrayerStatus) => void;
}

// 5 Orbital Stations positioned symmetrically on a circle (radius 145px)
const ORBIT_STATIONS: {
  key: PrayerKey;
  angle: number; // degrees
  labelBn: string;
  subBn: string;
  icon: React.ElementType;
}[] = [
  { key: "fajr", angle: -90, labelBn: "Fajr", subBn: "Morning Star", icon: Sunrise },
  { key: "dhuhr", angle: -18, labelBn: "Zuhr", subBn: "Midday Meridian", icon: Sun },
  { key: "asr", angle: 54, labelBn: "Asr", subBn: "The Oath of Time", icon: Sunset },
  { key: "maghrib", angle: 126, labelBn: "Maghrib", subBn: "Dusk Twilight", icon: Sunset },
  { key: "isha", angle: 198, labelBn: "Isha", subBn: "Sea of Stars", icon: Moon },
];

export function CelestialSalahOrbit({
  todayRecord,
  selectedPrayerKey,
  onSelectPrayer,
  onTogglePrayer,
}: CelestialSalahOrbitProps) {
  const prayers = todayRecord.prayers;
  const prayedCount = Object.values(prayers).filter((s) => s === "prayed").length;
  const missedCount = Object.values(prayers).filter((s) => s === "missed").length;
  const isAllPrayed = prayedCount === 5;
  const hasMissed = missedCount > 0;

  // Orbit radius in SVG viewBox (center at 200, 200)
  const cx = 200;
  const cy = 200;
  const r = 135;

  const getCoordinates = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-950/90 via-[#060c1d]/90 to-slate-950/90 border border-cyan-500/30 p-6 backdrop-blur-2xl overflow-hidden shadow-2xl">
      {/* Background celestial ambient glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-700 blur-[100px] opacity-25 ${
          isAllPrayed
            ? "bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400"
            : hasMissed
            ? "bg-gradient-to-r from-rose-600 via-amber-500 to-slate-900"
            : "bg-cyan-500/20"
        }`}
      />

      {/* Orbit Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
              Five-Star Celestial Orbit • The 5-Star Celestial Orbit
            </h4>
            <p className="text-[11px] text-slate-400">
              Each prayer is a luminous celestial star on your cosmic compass. Click any star to update prayer status.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isAllPrayed ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Winged Morning Star fully radiant!</span>
            </span>
          ) : hasMissed ? (
            <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-1.5 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>{toBengaliNumber(missedCount)} star(s) darkened (Missed)</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Orbit active ({toBengaliNumber(prayedCount)}/5)</span>
            </span>
          )}
        </div>
      </div>

      {/* Interactive Orbit Graphic */}
      <div className="relative w-full max-w-[420px] mx-auto aspect-square my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full select-none"
        >
          <defs>
            {/* Center Anchor Glow */}
            <radialGradient id="centerCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0891b2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>

            {/* Prayed Beam Gradient */}
            <linearGradient id="beamPrayed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
            </linearGradient>

            {/* Missed Beam Gradient */}
            <linearGradient id="beamMissed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.3" />
            </linearGradient>

            {/* Perfect Pentagram Gold Glow */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Outer Orbital Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          {/* Secondary Sub-orbital Rings */}
          <circle
            cx={cx}
            cy={cy}
            r={r - 40}
            fill="none"
            stroke="rgba(6, 182, 212, 0.12)"
            strokeWidth="1"
          />
          <circle
            cx={cx}
            cy={cy}
            r={r + 30}
            fill="none"
            stroke="rgba(6, 182, 212, 0.06)"
            strokeWidth="1"
          />

          {/* If all 5 prayers prayed: Draw Radiant Constellation Lines (Pentagram of Noor) */}
          {isAllPrayed && (
            <motion.path
              d={`
                M ${getCoordinates(-90).x} ${getCoordinates(-90).y}
                L ${getCoordinates(54).x} ${getCoordinates(54).y}
                L ${getCoordinates(198).x} ${getCoordinates(198).y}
                L ${getCoordinates(-18).x} ${getCoordinates(-18).y}
                L ${getCoordinates(126).x} ${getCoordinates(126).y}
                Z
              `}
              fill="rgba(52, 211, 153, 0.06)"
              stroke="#34d399"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              filter="url(#goldGlow)"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />
          )}

          {/* Connecting Laser Beams from Center Anchor to each Orbital Star */}
          {ORBIT_STATIONS.map((station) => {
            const coord = getCoordinates(station.angle);
            const status = prayers[station.key] || "unmarked";
            const isPrayed = status === "prayed";
            const isMissed = status === "missed";

            return (
              <g key={`beam-${station.key}`}>
                {isPrayed ? (
                  <motion.line
                    x1={cx}
                    y1={cy}
                    x2={coord.x}
                    y2={coord.y}
                    stroke="url(#beamPrayed)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                ) : isMissed ? (
                  <motion.line
                    x1={cx}
                    y1={cy}
                    x2={coord.x}
                    y2={coord.y}
                    stroke="url(#beamMissed)"
                    strokeWidth="2"
                    strokeDasharray="2 3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                ) : (
                  <line
                    x1={cx}
                    y1={cy}
                    x2={coord.x}
                    y2={coord.y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}

          {/* Central Anchor Glow Field */}
          <circle cx={cx} cy={cy} r="50" fill="url(#centerCoreGlow)" />

          {/* Center Anchor Base Circle */}
          <circle
            cx={cx}
            cy={cy}
            r="38"
            className={`transition-colors duration-500 ${
              isAllPrayed
                ? "fill-emerald-950 stroke-emerald-400 stroke-2"
                : hasMissed
                ? "fill-slate-900 stroke-rose-500/80 stroke-2"
                : "fill-slate-900/90 stroke-cyan-400/60 stroke-2"
            }`}
          />
        </svg>

        {/* Center Anchor DOM Content (Overlaid exactly at center) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <div
            className={`w-16 h-16 rounded-full flex flex-col items-center justify-center p-1 border shadow-xl ${
              isAllPrayed
                ? "bg-gradient-to-tr from-emerald-950 via-teal-900 to-cyan-900 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.5)]"
                : hasMissed
                ? "bg-slate-900 border-rose-500/60 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                : "bg-slate-900 border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            }`}
          >
            {isAllPrayed ? (
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow mb-0.5" />
            ) : hasMissed ? (
              <Flame className="w-5 h-5 text-rose-400 animate-pulse mb-0.5" />
            ) : (
              <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow mb-0.5" />
            )}
            <span className="text-[10px] font-mono font-bold tracking-tight">
              {toBengaliNumber(prayedCount)}/5 Light
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-200/80 mt-1 uppercase tracking-wider font-semibold">
            The Anchor
          </span>
          <span className="text-[8px] text-slate-400">
            Roots & Fajr Dawn
          </span>
        </div>

        {/* 5 Interactive Orbital Star Nodes (Positioned on top of the circle) */}
        {ORBIT_STATIONS.map((station) => {
          const coord = getCoordinates(station.angle);
          const status = prayers[station.key] || "unmarked";
          const isPrayed = status === "prayed";
          const isMissed = status === "missed";
          const isSelected = selectedPrayerKey === station.key;
          const Icon = station.icon;

          // Convert viewBox coordinate (0-400) to percentage (0-100%)
          const leftPct = (coord.x / 400) * 100;
          const topPct = (coord.y / 400) * 100;

          return (
            <div
              key={station.key}
              style={{
                position: "absolute",
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="z-20"
            >
              <button
                onClick={() => {
                  onSelectPrayer(station.key);
                }}
                className={`relative group flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? "scale-115 ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)]"
                    : "hover:scale-110"
                }`}
                title={`${station.labelBn}: Click to toggle status & details`}
              >
                {/* Outer halo aura */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border relative ${
                    isPrayed
                      ? "bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-slate-950 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                      : isMissed
                      ? "bg-gradient-to-tr from-rose-900 to-rose-700 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse"
                      : "bg-slate-900/90 text-slate-400 border-white/10 hover:border-cyan-400/50 hover:text-cyan-300 shadow-md"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />

                  {/* Tiny Status indicator pill */}
                  <div className="absolute -top-1 -right-1">
                    {isPrayed ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-3 h-3 text-slate-950" />
                      </span>
                    ) : isMissed ? (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                        <XCircle className="w-3 h-3 text-white" />
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Name Label */}
                <div className="text-center mt-1">
                  <span
                    className={`text-xs font-semibold font-bengali block leading-tight ${
                      isPrayed
                        ? "text-emerald-300 font-bold"
                        : isMissed
                        ? "text-rose-300"
                        : "text-slate-300 group-hover:text-cyan-300"
                    }`}
                  >
                    {station.labelBn}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 hidden sm:block">
                    {station.subBn}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Orbit Footer Quick Legend */}
      <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span>Completed Star (Radiant)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            <span>Missed Star (Darkened)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span>Pending</span>
          </span>
        </div>

        <div className="text-[11px] font-mono text-cyan-400/90 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Click any star to toggle its status directly</span>
        </div>
      </div>
    </div>
  );
}
