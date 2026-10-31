"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Layers,
  Flame,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Compass,
  CheckCircle2,
  Clock,
  BookOpen,
  Star,
  Activity,
  Repeat,
} from "lucide-react";
import {
  HifzSurahProgress,
  SabaqDailyRoutine,
  MutashabihatItem,
} from "@/types/hifz";
import { getSurahMeta } from "@/lib/quranData";

interface PillarsHubCardsProps {
  routine: SabaqDailyRoutine;
  progressList: HifzSurahProgress[];
  mutashabihatList: MutashabihatItem[];
}

export function PillarsHubCards({
  routine,
  progressList,
  mutashabihatList,
}: PillarsHubCardsProps) {
  // Live metrics calculation
  const sabaqMeta = getSurahMeta(routine.sabaqSurah);
  const dimmingStarsCount = progressList.filter(
    (p) => p.luminosityState === "dimming" || p.luminosityState === "critical"
  ).length;
  const radiantStarsCount = progressList.filter(
    (p) => p.luminosityState === "radiant"
  ).length;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-badge mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>The 5 Sacred Spheres of Retention</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide">
            The Hifz Orbit
          </h2>
          <p className="text-xs sm:text-sm font-subheading text-slate-400 max-w-2xl mt-1">
            The 5 sacred orbits of Quran memorization and preservation. Click on any orbit box below to enter its dedicated studio.
          </p>
        </div>
      </div>

      {/* Top Row: 3 Core Daily Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Sabaq (Daily New Lesson) */}
        <Link href="/hifz/sabaq" className="group block focus:outline-none">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative h-full overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-emerald-950/30 border border-emerald-500/25 group-hover:border-emerald-400/60 shadow-xl shadow-slate-950/60 group-hover:shadow-emerald-950/40 transition-all flex flex-col justify-between"
          >
            {/* Background Calligraphy Watermark */}
            <div className="absolute -bottom-4 -right-2 text-8xl font-serif text-emerald-400/[0.04] group-hover:text-emerald-400/[0.08] select-none pointer-events-none transition-all duration-500">
              سبق
            </div>

            {/* Top row: Pillar ID & Status Pill */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-badge uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  Pillar 01 • Daily Seed
                </span>
                {routine.sabaqCompleted ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-badge text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Completed Today
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-badge text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
                    In Progress
                  </span>
                )}
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 group-hover:bg-emerald-500/25 transition-all shadow-lg shadow-emerald-950/40">
                  <Sparkles className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-emerald-200 transition">
                    Sabaq
                  </h3>
                  <span className="text-xs font-bengali text-emerald-400/90 block">
                    (সবক - প্রতিদিনের নতুন পাঠ)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-subheading text-slate-300/90 leading-relaxed mb-5">
                The daily memorization seed. Commit fresh ayahs to memory with deep presence, precise Tajweed, and meditative focus.
              </p>
            </div>

            {/* Live Stats Bar & Action */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-badge">
                <span className="text-slate-400">Current Target</span>
                <span className="text-emerald-300 font-medium">
                  {sabaqMeta?.nameEnglish || `Surah #${routine.sabaqSurah}`} (v.{routine.sabaqAyahStart}-{routine.sabaqAyahEnd})
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs font-badge text-emerald-300 group-hover:text-emerald-200">
                <span>Open Sabaq Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* 2. Sabqi (Recent Revision) */}
        <Link href="/hifz/sabqi" className="group block focus:outline-none">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative h-full overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-cyan-950/30 border border-cyan-500/25 group-hover:border-cyan-400/60 shadow-xl shadow-slate-950/60 group-hover:shadow-cyan-950/40 transition-all flex flex-col justify-between"
          >
            {/* Background Calligraphy Watermark */}
            <div className="absolute -bottom-4 -right-2 text-8xl font-serif text-cyan-400/[0.04] group-hover:text-cyan-400/[0.08] select-none pointer-events-none transition-all duration-500">
              سبقي
            </div>

            {/* Top row: Pillar ID & Status Pill */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-badge uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
                  Pillar 02 • Orbit Stabilizer
                </span>
                {routine.sabqiCompleted ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-badge text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    Revised Today
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-badge text-slate-300 bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    Pending Today
                  </span>
                )}
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 group-hover:bg-cyan-500/25 transition-all shadow-lg shadow-cyan-950/40">
                  <Layers className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-cyan-200 transition">
                    Sabqi
                  </h3>
                  <span className="text-xs font-subheading text-cyan-400/90 block">
                    Recent Revision • Orbit Stabilizer
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-subheading text-slate-300/90 leading-relaxed mb-5">
                The short-term memory bridge. Daily revision of portions memorized in the last 7 to 10 days to solidify retention before it decays.
              </p>
            </div>

            {/* Live Stats Bar & Action */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-badge">
                <span className="text-slate-400">Retention Window</span>
                <span className="text-cyan-300 font-medium">Last 7–10 Days / Current Juz</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs font-badge text-cyan-300 group-hover:text-cyan-200">
                <span>Enter Sabqi Orbit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* 3. Amukhta (Long-Term Revision & Fading Stars) */}
        <Link href="/hifz/amukhta" className="group block focus:outline-none">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative h-full overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-amber-950/30 border border-amber-500/25 group-hover:border-amber-400/60 shadow-xl shadow-slate-950/60 group-hover:shadow-amber-950/40 transition-all flex flex-col justify-between"
          >
            {/* Background Calligraphy Watermark */}
            <div className="absolute -bottom-4 -right-2 text-8xl font-serif text-amber-400/[0.04] group-hover:text-amber-400/[0.08] select-none pointer-events-none transition-all duration-500">
              আমুখতা
            </div>

            {/* Top row: Pillar ID & Status Pill */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-badge uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  Pillar 03 • Daur Radar
                </span>
                {dimmingStarsCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-badge text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
                    <Flame className="w-3 h-3 text-amber-400" />
                    {dimmingStarsCount} Fading Stars
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-badge text-white bg-slate-900 border border-white/20 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 text-white" />
                    All Radiant
                  </span>
                )}
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 group-hover:bg-amber-500/25 transition-all shadow-lg shadow-amber-950/40">
                  <Flame className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-amber-200 transition">
                    Amukhta (Daur)
                  </h3>
                  <span className="text-xs font-bengali text-amber-400/90 block">
                    (আমোখতা / দওর - নিভু নিভু তারার রিভিশন)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-subheading text-slate-300/90 leading-relaxed mb-5">
                The long-term revision engine. Systematically review old memorized surahs so their celestial light never dims below 100%.
              </p>
            </div>

            {/* Live Stats Bar & Action */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-badge">
                <span className="text-slate-400">Constellation Health</span>
                <span className="text-amber-300 font-medium">
                  {radiantStarsCount} Radiant • {dimmingStarsCount} Dimming
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs font-badge text-amber-300 group-hover:text-amber-200">
                <span>Launch Daur Radar</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Bottom Row: 2 Mastery & Precision Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 4. Takrar (Repetition Loops) */}
        <Link href="/hifz/takrar" className="group block focus:outline-none">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative h-full overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-purple-950/30 border border-purple-500/25 group-hover:border-purple-400/60 shadow-xl shadow-slate-950/60 group-hover:shadow-purple-950/40 transition-all flex flex-col justify-between"
          >
            {/* Background Calligraphy Watermark */}
            <div className="absolute -bottom-4 -right-2 text-8xl font-serif text-purple-400/[0.04] group-hover:text-purple-400/[0.08] select-none pointer-events-none transition-all duration-500">
              تكرار
            </div>

            {/* Top row: Pillar ID & Badge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-badge uppercase tracking-wider text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                  Pillar 04 • Deep Etching
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-badge text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded-full">
                  <Repeat className="w-3 h-3 text-purple-400" />
                  20x-50x Repetition Loops
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-105 group-hover:bg-purple-500/25 transition-all shadow-lg shadow-purple-950/40">
                  <RotateCcw className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-purple-200 transition">
                    Takrar
                  </h3>
                  <span className="text-xs font-bengali text-purple-400/90 block">
                    (তাকরার - গভীর আত্মস্থকরণ ও পুনরাবৃত্তি)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-subheading text-slate-300/90 leading-relaxed mb-5">
                The science of deep neuro-retention. Practice repeated recitation loops and partner check-ins to make Quranic verses flow effortlessly like running water.
              </p>
            </div>

            {/* Live Stats Bar & Action */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-badge">
                <span className="text-slate-400">Methodology</span>
                <span className="text-purple-300 font-medium">Digital Loop Counter & Peer Rubric</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs font-badge text-purple-300 group-hover:text-purple-200">
                <span>Launch Takrar Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* 5. Mutashabihaat (Similar Verses) */}
        <Link href="/hifz/mutashabihaat" className="group block focus:outline-none">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative h-full overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-rose-950/30 border border-rose-500/25 group-hover:border-rose-400/60 shadow-xl shadow-slate-950/60 group-hover:shadow-rose-950/40 transition-all flex flex-col justify-between"
          >
            {/* Background Calligraphy Watermark */}
            <div className="absolute -bottom-4 -right-2 text-8xl font-serif text-rose-400/[0.04] group-hover:text-rose-400/[0.08] select-none pointer-events-none transition-all duration-500">
              متشابهات
            </div>

            {/* Top row: Pillar ID & Badge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-badge uppercase tracking-wider text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
                  Pillar 05 • Precision Anchors
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-badge text-rose-300 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-full">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  {mutashabihatList.length} Tricky Pairs
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-300 group-hover:scale-105 group-hover:bg-rose-500/25 transition-all shadow-lg shadow-rose-950/40">
                  <ShieldAlert className="w-6 h-6 text-rose-300" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-rose-200 transition">
                    Mutashabihaat
                  </h3>
                  <span className="text-xs font-bengali text-rose-400/90 block">
                    (মুতাশাবিহাত - বিভ্রান্তিকর সদৃশ আয়াত)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-subheading text-slate-300/90 leading-relaxed mb-5">
                The confusion breaker. Catalog and master similarly worded verses with side-by-side contrast notes, memory anchors, and difference highlights.
              </p>
            </div>

            {/* Live Stats Bar & Action */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-badge">
                <span className="text-slate-400">Cataloged Anchors</span>
                <span className="text-rose-300 font-medium">Side-by-Side Diff Inspector</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs font-badge text-rose-300 group-hover:text-rose-200">
                <span>Explore Mutashabihaat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}