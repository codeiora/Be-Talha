"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  RotateCcw,
  Star,
  Flame,
  AlertTriangle,
  PenLine,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { HifzSurahMeta, HifzSurahProgress, StarLuminosityState } from "@/types/hifz";
import confetti from "canvas-confetti";
import { FacetedIlluminatedStar } from "./FacetedStar";

interface SurahDetailModalProps {
  surah: HifzSurahMeta | null;
  progress: HifzSurahProgress | undefined;
  onClose: () => void;
  onRecordRevision: (surahNumber: number) => void;
  onToggleAyah: (surahNumber: number, ayahNumber: number) => void;
  onOpenZenMode: (surahNumber: number) => void;
  onOpenReflection: (surahNumber: number, ayahNumber?: number) => void;
}

export function SurahDetailModal({
  surah,
  progress,
  onClose,
  onRecordRevision,
  onToggleAyah,
  onOpenZenMode,
  onOpenReflection,
}: SurahDetailModalProps) {
  const [selectedAyahTab, setSelectedAyahTab] = useState<"all" | "memorized" | "remaining">("all");

  if (!surah) return null;

  const totalAyahs = surah.totalAyahs;
  const memorizedList = progress?.memorizedAyahs || [];
  const memorizedCount = memorizedList.length;
  const percentMemorized = Math.round((memorizedCount / totalAyahs) * 100);
  const isFully = percentMemorized === 100;
  const daysSince = progress?.daysSinceRevision ?? 999;
  const lumScore = progress?.luminosityScore || 0;

  const handleReviseClick = () => {
    onRecordRevision(surah.number);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#ffffff", "#e2e8f0", "#94a3b8", "#38bdf8"],
      });
    } catch {
      // ignore
    }
  };

  const getLuminosityBadge = () => {
    if (lumScore >= 90) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-badge text-white bg-white/10 border border-white/40 shadow-sm shadow-white/30">
          <Sparkles className="w-3.5 h-3.5 text-white animate-spin-slow" />
          <span>Radiant (100% Pure White Light)</span>
        </span>
      );
    }
    if (lumScore >= 50) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-badge text-slate-200 bg-slate-900 border border-slate-600">
          <Star className="w-3.5 h-3.5 text-slate-300" />
          <span>Stable (60% Brightness)</span>
        </span>
      );
    }
    if (lumScore >= 25) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-badge text-slate-300 bg-slate-900/90 border border-slate-500 animate-pulse">
          <Flame className="w-3.5 h-3.5 text-slate-400" />
          <span>Dimming Star (30% Brightness • Needs Daur)</span>
        </span>
      );
    }
    if (lumScore > 0) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-badge text-rose-300 bg-rose-950/70 border border-rose-500/60">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Dark (10% Brightness • Urgent Daur Alert)</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-badge text-slate-400 bg-slate-900 border border-slate-700">
        Unmemorized
      </span>
    );
  };

  const ayahs = Array.from({ length: totalAyahs }, (_, i) => i + 1);
  const filteredAyahs = ayahs.filter((num) => {
    const isMem = memorizedList.includes(num);
    if (selectedAyahTab === "memorized") return isMem;
    if (selectedAyahTab === "remaining") return !isMem;
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950/95 border border-cyan-500/30 shadow-2xl shadow-cyan-950/80 overflow-hidden text-slate-100"
        >
          {/* Top Cosmic Header */}
          <div className="relative px-6 pt-6 pb-5 border-b border-white/10 bg-gradient-to-b from-slate-900/80 to-transparent">
            {/* Background Glow */}
            <div className="absolute top-0 right-1/4 w-48 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-[11px] font-badge font-medium text-cyan-300">
                    Surah #{surah.number}
                  </span>
                  <span className="text-xs text-slate-400 font-badge">
                    Juz {surah.juzNumber} • {surah.revelationType}
                  </span>
                  {getLuminosityBadge()}
                </div>

                <div className="flex items-baseline gap-3 pt-1">
                  <h3 className="text-2xl font-bold font-heading text-slate-100 tracking-wide">
                    {surah.nameEnglish}
                  </h3>
                  <span className="text-xl font-serif text-amber-200/90 font-medium">
                    {surah.nameArabic}
                  </span>
                  <span className="text-xs text-slate-400 font-bengali">
                    ({surah.nameBangla})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* 5-Pointed Faceted Illuminated Star Miniature */}
                <div
                  className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-center shadow-lg"
                  title={`5-Pointed Star: Brightness ${lumScore}%`}
                >
                  <svg width="36" height="36" viewBox="-18 -18 36 36" className="overflow-visible pointer-events-none">
                    <FacetedIlluminatedStar
                      x={0}
                      y={0}
                      size={13}
                      score={lumScore}
                    />
                  </svg>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-badge">
                  Memorization Progress
                </span>
                <span className="text-base font-bold font-badge text-cyan-300 mt-0.5">
                  {memorizedCount} / {totalAyahs} <span className="text-xs text-slate-500">({percentMemorized}%)</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-badge">
                  Last Revision
                </span>
                <span className="text-base font-bold font-badge text-amber-300 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                  {daysSince === 0 ? "Today" : daysSince === 999 ? "Never" : `${daysSince} days ago`}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-badge">
                  Star Brightness
                </span>
                <span className="text-base font-bold font-badge text-emerald-300 mt-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-emerald-400" />
                  {lumScore}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3.5 w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all duration-500 ${
                  isFully
                    ? "bg-gradient-to-r from-cyan-400 to-amber-300"
                    : "bg-gradient-to-r from-cyan-500 to-indigo-500"
                }`}
                style={{ width: `${percentMemorized}%` }}
              />
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="px-6 py-3 border-b border-white/5 bg-slate-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleReviseClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-badge font-medium text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 shadow-sm transition group"
                title="Record Daur completion to revitalize starlight"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>Mark Revised (Restore Light)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenZenMode(surah.number);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-badge font-medium text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 shadow-sm transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zen Focus Mode</span>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenReflection(surah.number);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-badge text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <PenLine className="w-3.5 h-3.5 text-purple-400" />
              <span>Add Reflection</span>
            </button>
          </div>

          {/* Ayah Checklist Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-subheading">
                Ayah Checklist (Click to toggle memorization):
              </span>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/5 font-badge">
                <button
                  onClick={() => setSelectedAyahTab("all")}
                  className={`px-2.5 py-0.5 rounded-lg transition ${
                    selectedAyahTab === "all" ? "bg-cyan-500/30 text-cyan-200 font-medium" : "hover:text-white"
                  }`}
                >
                  All ({totalAyahs})
                </button>
                <button
                  onClick={() => setSelectedAyahTab("memorized")}
                  className={`px-2.5 py-0.5 rounded-lg transition ${
                    selectedAyahTab === "memorized" ? "bg-emerald-500/30 text-emerald-200 font-medium" : "hover:text-white"
                  }`}
                >
                  Memorized ({memorizedCount})
                </button>
                <button
                  onClick={() => setSelectedAyahTab("remaining")}
                  className={`px-2.5 py-0.5 rounded-lg transition ${
                    selectedAyahTab === "remaining" ? "bg-amber-500/30 text-amber-200 font-medium" : "hover:text-white"
                  }`}
                >
                  Remaining ({totalAyahs - memorizedCount})
                </button>
              </div>
            </div>

            {/* Ayah Number Badges Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
              {filteredAyahs.map((ayahNum) => {
                const isMem = memorizedList.includes(ayahNum);
                return (
                  <button
                    key={ayahNum}
                    onClick={() => onToggleAyah(surah.number, ayahNum)}
                    className={`h-10 rounded-xl flex flex-col items-center justify-center font-badge text-xs transition border relative group ${
                      isMem
                        ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200 shadow-sm shadow-cyan-500/10 hover:bg-cyan-500/30"
                        : "bg-slate-900/60 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/20 hover:bg-slate-800"
                    }`}
                    title={`Ayah #${ayahNum}: ${isMem ? "Memorized" : "Click to mark memorized"}`}
                  >
                    <span>{ayahNum}</span>
                    {isMem && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="px-6 py-3 border-t border-white/5 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-subheading">Illuminating the Quranic light in your heart and across the cosmos.</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl font-badge bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
