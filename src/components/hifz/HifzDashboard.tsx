"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Flame,
  Star,
  Layers,
  BookOpen,
  Compass,
  RotateCcw,
  ShieldAlert,
  PenLine,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import {
  HifzSurahMeta,
  HifzSurahProgress,
  SabaqDailyRoutine,
  MutashabihatItem,
  AyahReflectionNote,
  HifzUserSettings,
} from "@/types/hifz";
import {
  loadHifzProgress,
  saveHifzProgress,
  recordSurahRevision,
  toggleAyahMemorized,
  loadDailyRoutine,
  saveDailyRoutine,
  loadMutashabihat,
  saveMutashabihat,
  loadReflections,
  saveReflections,
  loadHifzSettings,
} from "@/lib/hifzStorage";
import { QURAN_SURAHS, getSurahMeta } from "@/lib/quranData";
import { HifzSkyCanvas } from "./HifzSkyCanvas";
import { MadrasahRoutineView } from "./MadrasahRoutineView";
import { SurahDetailModal } from "./SurahDetailModal";
import { ZenFocusMode } from "./ZenFocusMode";
import { TadabburJournalModal } from "./TadabburJournalModal";
import { AddMutashabihatModal } from "./AddMutashabihatModal";
import { FacetedIlluminatedStar } from "./FacetedStar";

export function HifzDashboard() {
  const [activeView, setActiveView] = useState<"sky" | "madrasah">("sky");

  // Core Persistent State
  const [progressList, setProgressList] = useState<HifzSurahProgress[]>([]);
  const [routine, setRoutine] = useState<SabaqDailyRoutine | null>(null);
  const [mutashabihatList, setMutashabihatList] = useState<MutashabihatItem[]>([]);
  const [reflections, setReflections] = useState<AyahReflectionNote[]>([]);
  const [settings, setSettings] = useState<HifzUserSettings | null>(null);

  // Modals & Zen mode state
  const [selectedSurah, setSelectedSurah] = useState<HifzSurahMeta | null>(null);
  const [zenSurahNumber, setZenSurahNumber] = useState<number | null>(null);
  const [zenStartAyah, setZenStartAyah] = useState<number>(1);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [reflectionInitialData, setReflectionInitialData] = useState<{ surah: number; ayah: number; text?: string }>({
    surah: 1,
    ayah: 1,
  });
  const [isAddMutashabihatOpen, setIsAddMutashabihatOpen] = useState(false);

  // Load storage on mount
  useEffect(() => {
    setProgressList(loadHifzProgress());
    setRoutine(loadDailyRoutine());
    setMutashabihatList(loadMutashabihat());
    setReflections(loadReflections());
    setSettings(loadHifzSettings());
  }, []);

  // Handlers
  const handleRecordRevision = (surahNumber: number) => {
    const updated = recordSurahRevision(surahNumber);
    setProgressList(updated);
  };

  const handleToggleAyah = (surahNumber: number, ayahNumber: number) => {
    const updated = toggleAyahMemorized(surahNumber, ayahNumber);
    setProgressList(updated);
  };

  const handleUpdateRoutine = (updated: SabaqDailyRoutine) => {
    setRoutine(updated);
    saveDailyRoutine(updated);
  };

  const handleSaveReflection = (note: AyahReflectionNote) => {
    const updated = [note, ...reflections];
    setReflections(updated);
    saveReflections(updated);
  };

  const handleSaveMutashabihat = (item: MutashabihatItem) => {
    const updated = [item, ...mutashabihatList];
    setMutashabihatList(updated);
    saveMutashabihat(updated);
  };

  // Open Zen Mode helper
  const handleOpenZenMode = (surahNumber: number, startAyah: number = 1) => {
    setZenSurahNumber(surahNumber);
    setZenStartAyah(startAyah);
  };

  // Open Reflection helper
  const handleOpenReflection = (surahNumber: number, ayahNumber: number = 1, text?: string) => {
    setReflectionInitialData({ surah: surahNumber, ayah: ayahNumber, text });
    setIsReflectionModalOpen(true);
  };

  // Computed metrics
  const totalMemorizedAyahs = progressList.reduce((acc, curr) => acc + (curr.memorizedAyahs?.length || 0), 0);
  const radiantStarsCount = progressList.filter((p) => p.luminosityState === "radiant").length;
  const dimmingStarsCount = progressList.filter((p) => p.luminosityState === "dimming" || p.luminosityState === "critical").length;
  const fullyMemorizedSurahsCount = progressList.filter((p) => p.isFullyMemorized).length;

  if (!routine || !settings) {
    return (
      <div className="py-20 flex items-center justify-center text-slate-500 font-mono text-xs">
        <span className="animate-pulse">Aligning the celestial constellation...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Celestial KPI Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Memorized Ayahs */}
        <div className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md shadow-lg shadow-cyan-950/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition" />
          <span className="text-[10px] font-badge text-cyan-300 uppercase tracking-widest block">
            Memorized Ayahs
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-badge font-bold text-white">
              {totalMemorizedAyahs}
            </span>
            <span className="text-xs text-slate-400 font-badge">/ 6,236</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block font-subheading">
            {fullyMemorizedSurahsCount} Surahs Completed
          </span>
        </div>

        {/* Radiant Stars (100% White Light Spread) */}
        <div className="p-4 rounded-3xl bg-slate-950/80 border border-white/20 backdrop-blur-md shadow-lg shadow-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition" />
          <div className="absolute top-3 right-3 opacity-90 group-hover:scale-110 transition-transform">
            <svg width="34" height="34" viewBox="-17 -17 34 34" className="overflow-visible pointer-events-none">
              <FacetedIlluminatedStar x={0} y={0} size={11.5} score={100} />
            </svg>
          </div>
          <span className="text-[10px] font-badge text-slate-300 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-white" />
            <span>100% Radiant (1-3 Days)</span>
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-badge font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
              {radiantStarsCount}
            </span>
            <span className="text-xs text-slate-400 font-badge">Stars</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block font-subheading">
            Radiating pure white light
          </span>
        </div>

        {/* Fading Stars (Dimming / 30% Brightness) */}
        <div
          onClick={() => setActiveView("madrasah")}
          className={`p-4 rounded-3xl border backdrop-blur-md shadow-lg cursor-pointer transition relative overflow-hidden group ${
            dimmingStarsCount > 0
              ? "bg-slate-900/90 border-slate-600 shadow-slate-950/60 hover:border-slate-400"
              : "bg-slate-950/80 border-white/5"
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-400/5 rounded-full blur-xl group-hover:bg-slate-400/10 transition" />
          <div className="absolute top-3 right-3 opacity-70 group-hover:scale-110 transition-transform">
            <svg width="28" height="28" viewBox="-14 -14 28 28" className="overflow-visible pointer-events-none">
              <FacetedIlluminatedStar x={0} y={0} size={9} score={30} />
            </svg>
          </div>
          <span className="text-[10px] font-badge text-slate-300 uppercase tracking-widest flex items-center gap-1">
            <Flame className="w-3 h-3 text-slate-400 animate-pulse" />
            <span>Fading Stars (Daur Due)</span>
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-badge font-bold text-slate-300">
              {dimmingStarsCount}
            </span>
            <span className="text-xs text-slate-400 font-badge">Stars (30%)</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block font-subheading">
            {dimmingStarsCount > 0 ? "Revise Amukhta to restore light" : "All stars radiant & fresh"}
          </span>
        </div>

        {/* Sabaq Today Status */}
        <div className="p-4 rounded-3xl bg-slate-950/80 border border-emerald-500/20 backdrop-blur-md shadow-lg shadow-emerald-950/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition" />
          <span className="text-[10px] font-badge text-emerald-300 uppercase tracking-widest block">
            Daily Sabaq Target
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg sm:text-xl font-heading font-bold text-white">
              Surah #{routine.sabaqSurah}
            </span>
            <span className="text-xs text-emerald-400 font-badge">
              (v.{routine.sabaqAyahStart}-{routine.sabaqAyahEnd})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-badge">
            {routine.sabaqCompleted ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>
            ) : (
              <span className="text-slate-500 font-subheading">In Progress</span>
            )}
          </span>
        </div>
      </div>

      {/* 2. Primary Navigation Switcher (Sky Canvas vs Madrasah Routine) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-950/60 border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("sky")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-badge tracking-wider transition ${
              activeView === "sky"
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-sm shadow-cyan-500/20 font-medium"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Star className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. Celestial Sky Canvas</span>
          </button>

          <button
            onClick={() => setActiveView("madrasah")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-badge tracking-wider transition ${
              activeView === "madrasah"
                ? "bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-sm shadow-amber-500/20 font-medium"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>2. The Hifz Orbit</span>
          </button>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenZenMode(routine.sabaqSurah, routine.sabaqAyahStart)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-badge font-medium text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 transition shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zen Focus Mode</span>
          </button>

          <button
            onClick={() => setIsReflectionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-badge font-medium text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 transition shadow-sm"
          >
            <PenLine className="w-3.5 h-3.5 text-purple-400" />
            <span>Ayah Reflections ({reflections.length})</span>
          </button>
        </div>
      </div>

      {/* 3. Main Dynamic View Container */}
      <AnimatePresence mode="wait">
        {activeView === "sky" ? (
          <motion.div
            key="sky-view"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3 }}
          >
            <HifzSkyCanvas
              progressList={progressList}
              onSelectSurah={(surah) => setSelectedSurah(surah)}
              onQuickRevision={handleRecordRevision}
            />
          </motion.div>
        ) : (
          <motion.div
            key="madrasah-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <MadrasahRoutineView
              routine={routine}
              progressList={progressList}
              mutashabihatList={mutashabihatList}
              onUpdateRoutine={handleUpdateRoutine}
              onRecordRevision={handleRecordRevision}
              onOpenZenMode={handleOpenZenMode}
              onAddMutashabihat={() => setIsAddMutashabihatOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Modals */}
      {/* Surah Detail Modal */}
      {selectedSurah && (
        <SurahDetailModal
          surah={selectedSurah}
          progress={progressList.find((p) => p.surahNumber === selectedSurah.number)}
          onClose={() => setSelectedSurah(null)}
          onRecordRevision={handleRecordRevision}
          onToggleAyah={handleToggleAyah}
          onOpenZenMode={handleOpenZenMode}
          onOpenReflection={(sNum, aNum) => handleOpenReflection(sNum, aNum || 1)}
        />
      )}

      {/* Zen Focus Mode Overlay */}
      {zenSurahNumber !== null && (
        <ZenFocusMode
          initialSurahNumber={zenSurahNumber}
          initialAyahNumber={zenStartAyah}
          reciter={settings.preferredReciter}
          onClose={() => setZenSurahNumber(null)}
          onOpenReflection={handleOpenReflection}
          onToggleMemorized={handleToggleAyah}
          isMemorized={Boolean(
            progressList
              .find((p) => p.surahNumber === zenSurahNumber)
              ?.memorizedAyahs.includes(zenStartAyah)
          )}
        />
      )}

      {/* Tadabbur Reflections Journal Modal */}
      <TadabburJournalModal
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        reflections={reflections}
        onSaveReflection={handleSaveReflection}
        initialSurah={reflectionInitialData.surah}
        initialAyah={reflectionInitialData.ayah}
        initialArabicText={reflectionInitialData.text}
      />

      {/* Add Mutashabihat Modal */}
      <AddMutashabihatModal
        isOpen={isAddMutashabihatOpen}
        onClose={() => setIsAddMutashabihatOpen(false)}
        onSave={handleSaveMutashabihat}
      />
    </div>
  );
}
