"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
  ShieldCheck,
  Hourglass,
  CalendarDays,
} from "lucide-react";
import { toBengaliNumber } from "@/types/salah";

interface WaqtPeriod {
  id: string;
  name: string;
  bengaliName: string;
  timeRange: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  description: string;
  spiritualNote: string;
  icon: React.ElementType;
  isSpecialAnchor?: boolean;
}

const WAQT_PERIODS: WaqtPeriod[] = [
  {
    id: "fajr",
    name: "Subhe Sadik / Fajr",
    bengaliName: "Subhe Sadik & Fajr",
    timeRange: "04:30 - 05:50",
    startHour: 4,
    startMinute: 30,
    endHour: 5,
    endMinute: 50,
    description: "Talha's birth anchor (04:45 AM). The day's first radiant beginning and spiritual roots.",
    spiritualNote: "The darkness breaks as the radiant morning star ascends. A new dawn for creation.",
    icon: Sunrise,
    isSpecialAnchor: true,
  },
  {
    id: "ishraq",
    name: "Ishraq & Duha",
    bengaliName: "Ishraq & Duha",
    timeRange: "06:20 - 11:15",
    startHour: 6,
    startMinute: 20,
    endHour: 11,
    endMinute: 15,
    description: "Sunrise brilliance, ambition, study, and the spark of purposeful endeavor.",
    spiritualNote: "Gratitude offered for every joint of the body, invigorating spirit and mind.",
    icon: Sun,
  },
  {
    id: "dhuhr",
    name: "Zuhr",
    bengaliName: "Zuhr (Midday Anchor)",
    timeRange: "11:45 - 03:30",
    startHour: 11,
    startMinute: 45,
    endHour: 15,
    endMinute: 30,
    description: "Steadfast focus in the middle of the day, refusing to be pulled off target.",
    spiritualNote: "Pausing worldly haste under the midday sun for serene surrender before the Lord.",
    icon: Sun,
  },
  {
    id: "asr",
    name: "Asr",
    bengaliName: "Asr (The Oath of Time)",
    timeRange: "03:45 - 05:15",
    startHour: 15,
    startMinute: 45,
    endHour: 17,
    endMinute: 15,
    description: "“By time, indeed mankind is in loss.” Exacting accountability of every single hour.",
    spiritualNote: "As the sun descends westward, a sharp reminder of fleeting moments.",
    icon: Sunset,
  },
  {
    id: "maghrib",
    name: "Maghrib",
    bengaliName: "Maghrib (Dusk's Twilight)",
    timeRange: "05:25 - 06:40",
    startHour: 17,
    startMinute: 25,
    endHour: 18,
    endMinute: 40,
    description: "Day's toil completed, returning to roots, and evening contemplative stillness.",
    spiritualNote: "Crimson horizons slowly dissolving into night sky. Praising the Lord for the day.",
    icon: Sunset,
  },
  {
    id: "isha",
    name: "Isha & Qiyam",
    bengaliName: "Isha & Qiyam al-Layl",
    timeRange: "07:00 - 04:30",
    startHour: 19,
    startMinute: 0,
    endHour: 28, // 4:30 AM next day (represented as 24+4.5)
    endMinute: 30,
    description: "Silent night, deep scholarship, and preparing wings among the stars.",
    spiritualNote: "Silent adoration of celestial constellations and profound midnight supplication.",
    icon: Moon,
  },
];

export function WaqtScheduleTab() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [activeWaqtId, setActiveWaqtId] = useState<string>("fajr");
  const [currentMinutesInDay, setCurrentMinutesInDay] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      const hours = now.getHours();
      const mins = now.getMinutes();
      const totalMins = hours * 60 + mins;
      setCurrentMinutesInDay(totalMins);

      // Determine active waqt
      if (totalMins >= 4 * 60 + 30 && totalMins < 5 * 60 + 50) {
        setActiveWaqtId("fajr");
      } else if (totalMins >= 6 * 60 + 20 && totalMins < 11 * 60 + 15) {
        setActiveWaqtId("ishraq");
      } else if (totalMins >= 11 * 60 + 45 && totalMins < 15 * 60 + 30) {
        setActiveWaqtId("dhuhr");
      } else if (totalMins >= 15 * 60 + 45 && totalMins < 17 * 60 + 15) {
        setActiveWaqtId("asr");
      } else if (totalMins >= 17 * 60 + 25 && totalMins < 18 * 60 + 40) {
        setActiveWaqtId("maghrib");
      } else {
        setActiveWaqtId("isha");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner with live clock and cosmic anchor */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900/60 border border-emerald-500/30 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-badge tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>THE CELESTIAL TIMETABLE • PRAYER TIMES</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading text-slate-100 font-semibold">
              Celestial Rhythm of Dawn & Daily Waqt
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed font-subheading">
              The journey that began at Fajr dawn on 28 October 2006—spiritual connection and discipline across every hour of the day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-emerald-300 font-badge text-xs flex items-center gap-2 shadow-inner">
              <Clock className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Current Time: <strong className="text-white text-sm font-semibold">{currentTime || "Calculating..."}</strong></span>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-badge flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Current Waqt: {WAQT_PERIODS.find((w) => w.id === activeWaqtId)?.bengaliName.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Birth Anchor Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900/60 to-cyan-950/40 border border-emerald-400/40 shadow-lg relative group hover:border-emerald-400/70 transition-all">
        <div className="flex items-center gap-2.5 text-emerald-300 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <h4 className="text-xs font-semibold font-heading tracking-wider uppercase">
            The Birth Anchor • Subhe Sadik (04:45 AM)
          </h4>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-badge">
            Anchor Coordinate
          </span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed italic font-subheading">
          &ldquo;Awaiting the dawn of Fajr&apos;s gentle light—just as pitch darkness colors the nocturnal sky; the melody of his Hijazi wisdom flows high, echoing across millions of light-years to stars in the night!&rdquo;
        </p>
      </div>

      {/* Waqt Timeline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WAQT_PERIODS.map((period, idx) => {
          const Icon = period.icon;
          const isActive = activeWaqtId === period.id;

          return (
            <motion.div
              key={period.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                isActive
                  ? "bg-gradient-to-b from-cyan-950/60 to-slate-900/90 border-cyan-400 ring-1 ring-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
                  : period.isSpecialAnchor
                  ? "bg-gradient-to-b from-emerald-950/40 to-slate-900/80 border-emerald-500/40 hover:border-emerald-400"
                  : "bg-slate-900/60 border-white/5 hover:border-white/15"
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-[10px] font-badge text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Active Now</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-3 rounded-xl ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                        : period.isSpecialAnchor
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800/80 text-slate-300 border border-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-heading font-semibold text-slate-100">
                      {period.bengaliName}
                    </h4>
                    <span className="text-xs font-badge text-cyan-300/90 font-medium">
                      {period.timeRange}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-1 font-subheading">
                  {period.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 italic flex items-center gap-1.5 font-subheading">
                <Compass className="w-3 h-3 text-cyan-400/80 shrink-0" />
                <span className="line-clamp-1">{period.spiritualNote}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-emerald-400" />
          <span>Observing prayers on time sharpens mental clarity and brings sublime structure to daily life.</span>
        </div>
        <span className="font-mono text-[11px] text-cyan-400/80">Be Talha • Chapter 20 Anchor</span>
      </div>
    </div>
  );
}
