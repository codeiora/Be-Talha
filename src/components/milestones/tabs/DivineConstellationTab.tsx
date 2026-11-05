"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Star,
  Compass,
  Layers,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  BookmarkCheck,
  Sun,
  Shield,
  Zap,
} from "lucide-react";

interface PillarCard {
  id: string;
  number: string;
  name: string;
  bengali: string;
  tagline: string;
  href: string;
  icon: React.ElementType;
  badge: string;
  colorBorder: string;
  colorGlow: string;
  colorIcon: string;
}

const HIFZ_PILLARS: PillarCard[] = [
  {
    id: "sabaq",
    number: "01",
    name: "Sabaq Studio",
    bengali: "Daily Sabaq (New Seed)",
    tagline: "Today's fresh seed. Memorize new verses with deep focus, immaculate Tajweed, and contemplation.",
    href: "/hifz/sabaq",
    icon: Sparkles,
    badge: "New Seed",
    colorBorder: "border-emerald-500/30 hover:border-emerald-400/60",
    colorGlow: "shadow-[0_0_25px_rgba(16,185,129,0.15)]",
    colorIcon: "text-emerald-400",
  },
  {
    id: "sabqi",
    number: "02",
    name: "Sabqi Orbit",
    bengali: "Sabqi Orbit (Recent Memorization)",
    tagline: "Fortress of recent Juz. Strengthen freshly memorized pages so their roots run unshakeably deep.",
    href: "/hifz/sabqi",
    icon: Layers,
    badge: "Recent Wall",
    colorBorder: "border-cyan-500/30 hover:border-cyan-400/60",
    colorGlow: "shadow-[0_0_25px_rgba(6,182,212,0.15)]",
    colorIcon: "text-cyan-400",
  },
  {
    id: "amukhta",
    number: "03",
    name: "Amukhta Daur",
    bengali: "Amukhta Daur (Full Revision)",
    tagline: "Preserve celestial brilliance. Systematic full-revision cycle so no surah's light ever fades.",
    href: "/hifz/amukhta",
    icon: Compass,
    badge: "Eternal Stars",
    colorBorder: "border-amber-500/40 hover:border-amber-400/70",
    colorGlow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    colorIcon: "text-amber-400",
  },
  {
    id: "takrar",
    number: "04",
    name: "Takrar Loop",
    bengali: "Takrar Loop (Cyclic Repetition)",
    tagline: "Repetition loops (10x, 20x, 40x). Madrasah method to embed verses permanently into subconscious memory.",
    href: "/hifz/takrar",
    icon: RotateCcw,
    badge: "Deep Orbit",
    colorBorder: "border-purple-500/30 hover:border-purple-400/60",
    colorGlow: "shadow-[0_0_25px_rgba(168,85,247,0.15)]",
    colorIcon: "text-purple-400",
  },
  {
    id: "mutashabihat",
    number: "05",
    name: "Mutashabihaat Vault",
    bengali: "Mutashabihaat Vault (Similar Ayahs)",
    tagline: "Master similar and easily conflated verses with surgical precision and cross-reference vigilance.",
    href: "/hifz/mutashabihaat",
    icon: ShieldAlert,
    badge: "Precision Armor",
    colorBorder: "border-rose-500/30 hover:border-rose-400/60",
    colorGlow: "shadow-[0_0_25px_rgba(244,63,94,0.15)]",
    colorIcon: "text-rose-400",
  },
];

export function DivineConstellationTab() {
  const [completedSurahsCount, setCompletedSurahsCount] = useState(0);

  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem("hifz_surah_progress");
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        if (Array.isArray(parsed)) {
          const count = parsed.filter((p: { status?: string }) => p.status === "completed").length;
          setCompletedSurahsCount(count);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Banner: Gold & Obsidian Celestial Theme */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-slate-950 border border-amber-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.15),0_20px_40px_rgba(0,0,0,0.8)]">
        {/* Ambient Gold & Cosmic Nebula Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/15 border border-amber-400/40 text-amber-300 text-xs font-badge tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse" />
              <span>DIVINE CONSTELLATION</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-badge px-3 py-1 rounded-full bg-slate-900/90 text-amber-200/90 border border-amber-500/20">
                114 Clusters • 30 Juz
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading text-white font-bold tracking-tight">
              In Search of Light • <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">Quranic Orbit</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-subheading leading-relaxed max-w-3xl">
              Hifz and the Holy Quran are not merely a goal; they are a lifelong cosmic pilgrimage. Ground your anchor deep into the earth and soar toward the heavens.
            </p>
          </div>

          {/* Quote from the Sacred Letter */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/25 border border-amber-500/25 text-amber-100/90 font-subheading italic text-xs sm:text-sm leading-relaxed shadow-inner">
            <p className="flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                &ldquo;Awaiting the dawn of Fajr&apos;s gentle light— Just as pitch darkness colors the nocturnal sky; The melody of his Hijazi wisdom flows high, echoing across millions of light-years to stars in the night!&rdquo;
                <span className="block not-italic font-bold text-amber-400 text-xs mt-1.5">— The Letter of Roots (Care of: Childhood)</span>
              </span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/hifz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-badge text-xs font-bold transition shadow-[0_0_25px_rgba(245,158,11,0.35)] active:scale-95 group"
            >
              <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition" />
              <span>Launch 3D Celestial Sky Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/hifz/amukhta"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-amber-500/30 text-amber-200 text-xs font-badge transition hover:border-amber-400/50 shadow-sm"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Amukhta Routine</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Hifz Pillars: Madrasah Framework in Gold & Obsidian */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h3 className="text-base font-heading text-white font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>The Five Madrasah Pillars</span>
            </h3>
            <p className="text-xs text-slate-400 font-subheading">
              Five time-tested madrasah bastions engineered to protect and etch the Quran permanently into your soul.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIFZ_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.id}
                href={pillar.href}
                className={`relative group p-5 rounded-3xl bg-slate-950/85 border ${pillar.colorBorder} ${pillar.colorGlow} backdrop-blur-xl transition duration-300 hover:-translate-y-1 flex flex-col justify-between`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-amber-400/80 tracking-widest font-bold">
                      PILLAR {pillar.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-badge bg-white/5 border border-white/10 text-slate-300">
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-2xl bg-white/5 border border-white/10 ${pillar.colorIcon} group-hover:scale-110 transition shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-heading font-bold text-white group-hover:text-amber-300 transition">
                        {pillar.name}
                      </h4>
                      <div className="text-xs font-bengali text-amber-200/90 font-medium mt-0.5">
                        {pillar.bengali}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-subheading leading-relaxed line-clamp-3">
                    {pillar.tagline}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-badge text-amber-400/90 group-hover:text-amber-300">
                  <span>Enter Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}

          {/* 6th Card: Hifz Sky Canvas Summary */}
          <Link
            href="/hifz"
            className="relative group p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 border border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-300 tracking-widest font-bold">
                  CELESTIAL SKY
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-badge bg-amber-500/20 border border-amber-400/30 text-amber-300">
                  Interactive 3D
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 group-hover:scale-110 transition shadow-sm">
                  <Star className="w-5 h-5 fill-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white group-hover:text-amber-300 transition">
                    114 Star Constellations
                  </h4>
                  <div className="text-xs font-bengali text-amber-200/90 font-medium mt-0.5">
                    Interactive 3D Quran Constellation
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-subheading leading-relaxed">
                Every Surah shines as a living star. Regular revision keeps them ablaze in full radiance across your personal cosmic canvas.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-badge text-amber-300">
              <span>Explore The Sky</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>

      {/* Sacred Reminder Card */}
      <div className="p-5 rounded-3xl bg-slate-950/80 border border-amber-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-badge text-amber-400 uppercase tracking-wider">
              Divine Promise • Surah Al-Qamar (54:17)
            </div>
            <div className="text-sm font-subheading text-slate-200 mt-0.5">
              &ldquo;And We have certainly made the Quran easy for remembrance, so is there anyone who will remember?&rdquo;
            </div>
          </div>
        </div>

        <Link
          href="/waqt"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-badge text-slate-300 hover:text-white transition whitespace-nowrap"
        >
          <span>Waqt & Salah Orbit</span>
          <ArrowRight className="w-3 h-3 text-amber-400" />
        </Link>
      </div>
    </div>
  );
}
