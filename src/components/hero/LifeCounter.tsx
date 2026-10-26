"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Activity, Zap, Compass, Sparkles } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

interface TimeBreakdown {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalSeconds: number;
}

// Fixed positions for floating golden stardust particles inside the rectangle
const CARD_STARDUST = [
  { top: "18%", left: "12%", size: 3, delay: 0 },
  { top: "72%", left: "22%", size: 2.5, delay: 0.8 },
  { top: "35%", left: "38%", size: 3.5, delay: 1.4 },
  { top: "80%", left: "46%", size: 2, delay: 0.3 },
  { top: "25%", left: "58%", size: 3, delay: 1.8 },
  { top: "68%", left: "68%", size: 2.5, delay: 0.5 },
  { top: "30%", left: "82%", size: 3.5, delay: 1.1 },
  { top: "75%", left: "88%", size: 2, delay: 1.6 },
  { top: "50%", left: "95%", size: 3, delay: 0.2 },
];

export function LifeCounter() {
  const [time, setTime] = useState<TimeBreakdown | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const birth = new Date(APP_CONFIG.birthDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - birth);

      const birthDateObj = new Date(APP_CONFIG.birthDate);
      const nowDateObj = new Date();

      // Calendar year calculation
      let years = nowDateObj.getFullYear() - birthDateObj.getFullYear();
      const currentYearBirthday = new Date(birthDateObj);
      currentYearBirthday.setFullYear(nowDateObj.getFullYear());

      let lastBirthday: Date;
      if (nowDateObj.getTime() < currentYearBirthday.getTime()) {
        years -= 1;
        lastBirthday = new Date(birthDateObj);
        lastBirthday.setFullYear(nowDateObj.getFullYear() - 1);
      } else {
        lastBirthday = currentYearBirthday;
      }

      const diffSinceLastBirthday = Math.max(
        0,
        nowDateObj.getTime() - lastBirthday.getTime()
      );

      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const totalSeconds = Math.floor(diff / 1000);

      const days = Math.floor(
        diffSinceLastBirthday / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (diffSinceLastBirthday / (1000 * 60 * 60)) % 24
      );
      const minutes = Math.floor(
        (diffSinceLastBirthday / (1000 * 60)) % 60
      );
      const seconds = Math.floor(
        (diffSinceLastBirthday / 1000) % 60
      );

      setTime({
        years,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        totalSeconds,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 font-mono text-sm animate-pulse">
        Calculating cosmic uptime...
      </div>
    );
  }

  const units = [
    { label: "YEARS", value: time.years, highlight: false },
    { label: "DAYS", value: time.days, highlight: false },
    { label: "HOURS", value: time.hours, highlight: false },
    { label: "MINUTES", value: time.minutes, highlight: false },
    { label: "SECONDS", value: time.seconds, highlight: true },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 
        Unified Rounded Glass Rectangle Card
        Directly matching the laptop mockup in the reference design
      */}
      <div className="relative group overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 bg-slate-950/40 border border-white/10 backdrop-blur-sm shadow-2xl shadow-cyan-950/40 transition-all duration-500 hover:border-cyan-500/30">
        
        {/* Subtle ambient gradient aura behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 blur-xl opacity-50 group-hover:opacity-80 transition duration-700 pointer-events-none" />

        {/* Floating sparkling golden stardust embers inside the rectangle */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {CARD_STARDUST.map((dust, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{
                opacity: [0.2, 0.9, 0.2],
                scale: [0.8, 1.4, 0.8],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 3 + (idx % 3),
                repeat: Infinity,
                delay: dust.delay,
                ease: "easeInOut",
              }}
              className="absolute rounded-full bg-amber-300 shadow-[0_0_8px_#fde047]"
              style={{
                top: dust.top,
                left: dust.left,
                width: `${dust.size}px`,
                height: `${dust.size}px`,
              }}
            />
          ))}
        </div>

        {/* Counter Numbers Grid inside the unified card */}
        <div className="relative z-10 grid grid-cols-5 gap-2 sm:gap-4 md:gap-6 divide-x divide-white/5">
          {units.map((unit) => {
            const formatted = String(unit.value).padStart(2, "0");
            return (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center px-1 sm:px-2"
              >
                {/* Number display */}
                <div className="relative flex items-center justify-center">
                  <span
                    className={`font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight ${
                      unit.highlight
                        ? "text-cyan-300 drop-shadow-[0_0_16px_rgba(56,189,248,0.85)] font-normal"
                        : "text-slate-50 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    }`}
                  >
                    {formatted}
                  </span>
                  
                  {/* Real-time pulsing second indicator */}
                  {unit.highlight && (
                    <span className="hidden sm:inline-block relative h-2.5 w-2.5 ml-1.5 -top-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300 shadow-[0_0_8px_#38bdf8]"></span>
                    </span>
                  )}
                </div>

                {/* Unit label below */}
                <span className="mt-2 text-[10px] sm:text-xs md:text-sm font-light tracking-[0.2em] uppercase text-slate-400">
                  {unit.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-bar: Real-time passing seconds ribbon & Anchor */}
      <div className="mt-4 px-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/40 border border-white/5 backdrop-blur-sm">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>
            <strong className="text-slate-200 font-mono font-medium">
              {time.totalSeconds.toLocaleString()}
            </strong>{" "}
            seconds elapsed — every moment is priceless.
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>Anchor: 28 Oct 2006 • Subhe Sadik</span>
        </div>
      </div>
    </div>
  );
}

export default LifeCounter;
