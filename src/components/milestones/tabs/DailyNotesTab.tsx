"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Star,
  Sparkles,
  Save,
  CheckCircle2,
  Calendar,
  Sun,
  Moon,
  Cloud,
  Flame,
  AlertTriangle,
  Clock,
  Heart,
  Plus,
  Trash2,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Orbit,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  DailyNoteEntry,
  StateOfHeartType,
  ShukrParticleItem,
} from "@/types/milestones";
import { getTodayDateKey } from "@/lib/milestoneData";

interface DailyNotesTabProps {
  note: DailyNoteEntry;
  onSaveNote: (updated: DailyNoteEntry) => void;
}

// 5 Curated Divine Quranic Anchors for rapid selection or inspiration
const DIVINE_AYAH_PRESETS = [
  {
    text: "“And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.”",
    source: "Surah At-Talaq: 3",
    label: "তাওয়াক্কুল (Tawakkul)",
  },
  {
    text: "“Indeed, with hardship comes ease.”",
    source: "Surah Ash-Sharh: 6",
    label: "স্বস্তি ও ধৈর্য (Ease & Sabr)",
  },
  {
    text: "“And be patient for the decision of your Lord, for indeed, you are in Our eyes.”",
    source: "Surah At-Tur: 48",
    label: "অবিচলতা (Patience)",
  },
  {
    text: "“Say: Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds.”",
    source: "Surah Al-An'am: 162",
    label: "ইখলাস (Pure Devotion)",
  },
  {
    text: "“If you are grateful, I will surely increase you [in favor].”",
    source: "Surah Ibrahim: 7",
    label: "শুকরগোযারি (Gratitude)",
  },
];

export function DailyNotesTab({ note, onSaveNote }: DailyNotesTabProps) {
  // Default to 'all' so both columns are always balanced and visible with zero blank space
  const [activePhase, setActivePhase] = useState<"all" | "morning" | "evening">("all");

  // Morning Intent fields
  const [coreFocus, setCoreFocus] = useState(note.coreFocus || "");
  const [stateOfHeart, setStateOfHeart] = useState<StateOfHeartType>(
    note.stateOfHeart || "clear_sky"
  );
  const [spiritualAnchor, setSpiritualAnchor] = useState(
    note.spiritualAnchor || ""
  );

  // Evening Reflection fields
  const [realityCheckStatus, setRealityCheckStatus] = useState<
    "achieved" | "partial" | "missed"
  >(note.realityCheckStatus || "achieved");
  const [realityCheckNotes, setRealityCheckNotes] = useState(
    note.realityCheckNotes || ""
  );
  const [theEclipse, setTheEclipse] = useState(note.theEclipse || "");
  const [tomorrowsOrbit, setTomorrowsOrbit] = useState(
    note.tomorrowsOrbit || ""
  );

  // Divine Ayah companion
  const [ayahReminder, setAyahReminder] = useState(
    note.ayahReminder || DIVINE_AYAH_PRESETS[0].text
  );
  const [ayahSource, setAyahSource] = useState(
    note.ayahSource || DIVINE_AYAH_PRESETS[0].source
  );

  // Shukr & Light Particles
  const [shukrInput, setShukrInput] = useState("");
  const [shukrParticles, setShukrParticles] = useState<ShukrParticleItem[]>(() => {
    if (note.shukrParticles && note.shukrParticles.length > 0) {
      return note.shukrParticles;
    }
    if (note.shukr && note.shukr.trim()) {
      return [
        {
          id: "shukr-init-1",
          text: note.shukr.trim(),
          createdAt: Date.now(),
        },
      ];
    }
    return [];
  });

  const [isSaved, setIsSaved] = useState(false);

  // Sync state if prop changes externally
  useEffect(() => {
    setCoreFocus(note.coreFocus || "");
    if (note.stateOfHeart) setStateOfHeart(note.stateOfHeart);
    setSpiritualAnchor(note.spiritualAnchor || "");
    if (note.realityCheckStatus) setRealityCheckStatus(note.realityCheckStatus);
    setRealityCheckNotes(note.realityCheckNotes || "");
    setTheEclipse(note.theEclipse || "");
    setTomorrowsOrbit(note.tomorrowsOrbit || "");
    setAyahReminder(note.ayahReminder || DIVINE_AYAH_PRESETS[0].text);
    setAyahSource(note.ayahSource || DIVINE_AYAH_PRESETS[0].source);
    if (note.shukrParticles && note.shukrParticles.length > 0) {
      setShukrParticles(note.shukrParticles);
    }
  }, [note]);

  // Master Save Handler
  const handleSave = (customParticles?: ShukrParticleItem[]) => {
    const particles = customParticles || shukrParticles;
    const combinedShukr =
      particles.length > 0
        ? particles.map((p) => p.text).join(" • ")
        : note.shukr || "";

    const updated: DailyNoteEntry = {
      ...note,
      dateKey: getTodayDateKey(),
      coreFocus,
      stateOfHeart,
      spiritualAnchor,
      realityCheckStatus,
      realityCheckNotes,
      theEclipse,
      tomorrowsOrbit,
      ayahReminder,
      ayahSource,
      shukr: combinedShukr,
      shukrParticles: particles,
      updatedAt: Date.now(),
    };

    onSaveNote(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Add Shukr Particle with gold confetti celebration
  const handleAddShukrParticle = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!shukrInput.trim()) return;

    const newParticle: ShukrParticleItem = {
      id: `shukr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: shukrInput.trim(),
      createdAt: Date.now(),
    };

    const nextParticles = [newParticle, ...shukrParticles];
    setShukrParticles(nextParticles);
    setShukrInput("");

    // Trigger golden celestial particle confetti
    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#fbbf24", "#f59e0b", "#38bdf8", "#ffffff"],
        ticks: 200,
        gravity: 0.8,
      });
    } catch {
      // safe fallback if window/canvas not ready
    }

    handleSave(nextParticles);
  };

  // Delete a shukr particle
  const handleDeleteShukrParticle = (id: string) => {
    const filtered = shukrParticles.filter((p) => p.id !== id);
    setShukrParticles(filtered);
    handleSave(filtered);
  };

  // Quick select an Ayah preset
  const handleSelectAyahPreset = (preset: (typeof DIVINE_AYAH_PRESETS)[0]) => {
    setAyahReminder(preset.text);
    setAyahSource(preset.source);
    onSaveNote({
      ...note,
      dateKey: getTodayDateKey(),
      coreFocus,
      stateOfHeart,
      spiritualAnchor,
      realityCheckStatus,
      realityCheckNotes,
      theEclipse,
      tomorrowsOrbit,
      ayahReminder: preset.text,
      ayahSource: preset.source,
      shukr: shukrParticles.map((p) => p.text).join(" • "),
      shukrParticles,
      updatedAt: Date.now(),
    });
  };

  // Reusable Component: Morning Intent Card
  const renderMorningIntentCard = () => (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-amber-500/25 space-y-5 shadow-[0_0_30px_rgba(245,158,11,0.08)] backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white">
              পর্ব ১: সকালের সংকল্প (Morning Intent)
            </h3>
            <p className="text-xs text-slate-400 font-subheading">
              দিনের শুরুতে অন্তরের প্রস্তুতি ও বরকত অর্জনের সুনির্দিষ্ট পদক্ষেপ।
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-amber-300/90 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/20">
          ৩ মিনিট
        </span>
      </div>

      {/* Sub-item A: রূহানী আবহাওয়া (State of Heart) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold font-heading text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            রূহানী আবহাওয়া (State of Heart)
          </label>
          <span className="text-[11px] font-subheading text-slate-400">
            আজ অন্তরের হালত কেমন?
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Full Moon */}
          <button
            type="button"
            onClick={() => {
              setStateOfHeart("full_moon");
              onSaveNote({ ...note, stateOfHeart: "full_moon" });
            }}
            className={`p-3 rounded-2xl border text-left transition flex flex-col items-center justify-center text-center gap-1.5 group ${
              stateOfHeart === "full_moon"
                ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-emerald-200"
                : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-emerald-400/40 hover:text-slate-200"
            }`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🌕
            </span>
            <span className="text-xs font-bold font-heading">
              Full Moon
            </span>
            <span className="text-[10px] font-subheading text-slate-400">
              প্রশান্ত ও স্থির
            </span>
          </button>

          {/* Clear Sky */}
          <button
            type="button"
            onClick={() => {
              setStateOfHeart("clear_sky");
              onSaveNote({ ...note, stateOfHeart: "clear_sky" });
            }}
            className={`p-3 rounded-2xl border text-left transition flex flex-col items-center justify-center text-center gap-1.5 group ${
              stateOfHeart === "clear_sky"
                ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] text-cyan-200"
                : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-cyan-400/40 hover:text-slate-200"
            }`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🌌
            </span>
            <span className="text-xs font-bold font-heading">
              Clear Sky
            </span>
            <span className="text-[10px] font-subheading text-slate-400">
              তীক্ষ্ণ ফোকাসড
            </span>
          </button>

          {/* Eclipse */}
          <button
            type="button"
            onClick={() => {
              setStateOfHeart("eclipse");
              onSaveNote({ ...note, stateOfHeart: "eclipse" });
            }}
            className={`p-3 rounded-2xl border text-left transition flex flex-col items-center justify-center text-center gap-1.5 group ${
              stateOfHeart === "eclipse"
                ? "bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] text-amber-200"
                : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-amber-400/40 hover:text-slate-200"
            }`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🌑
            </span>
            <span className="text-xs font-bold font-heading">
              Eclipse
            </span>
            <span className="text-[10px] font-subheading text-slate-400">
              বিক্ষিপ্ত মন
            </span>
          </button>

          {/* Nebula */}
          <button
            type="button"
            onClick={() => {
              setStateOfHeart("nebula");
              onSaveNote({ ...note, stateOfHeart: "nebula" });
            }}
            className={`p-3 rounded-2xl border text-left transition flex flex-col items-center justify-center text-center gap-1.5 group ${
              stateOfHeart === "nebula"
                ? "bg-violet-500/20 border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.25)] text-violet-200"
                : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-violet-400/40 hover:text-slate-200"
            }`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🌪️
            </span>
            <span className="text-xs font-bold font-heading">
              Nebula
            </span>
            <span className="text-[10px] font-subheading text-slate-400">
              ক্লান্ত ও দ্বিধাগ্রস্ত
            </span>
          </button>
        </div>
      </div>

      {/* Sub-item B: Spiritual Anchor (রূহানী প্রস্তুতি ও দুআ) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold font-heading text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-emerald-400" />
            Spiritual Anchor (রূহানী প্রস্তুতি ও দুআ)
          </label>
          <span className="text-[11px] font-mono text-slate-500">
            দৈনিক মুনাজাত
          </span>
        </div>
        <textarea
          rows={3}
          value={spiritualAnchor}
          onChange={(e) => setSpiritualAnchor(e.target.value)}
          onBlur={() => handleSave()}
          placeholder="আজ কাজ শুরু করার মুহূর্তে আমার ভেতরের অবস্থা কেমন এবং স্রষ্টার কাছে আজ আমার বিশেষ কোনো চাওয়া (দুআ) আছে কি?"
          className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-emerald-500/30 text-white placeholder-slate-500 text-xs sm:text-sm font-subheading leading-relaxed focus:outline-none focus:border-emerald-400 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition resize-none"
        />
      </div>
    </div>
  );

  // Reusable Component: Evening Reflection Card
  const renderEveningReflectionCard = () => (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/25 space-y-5 shadow-[0_0_30px_rgba(99,102,241,0.08)] backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white">
              পর্ব ২: রাতের মোরাকাবা (Evening Reflection)
            </h3>
            <p className="text-xs text-slate-400 font-subheading">
              সারাদিনের আমল ও কাজের হিসাব মেলাতে আত্মসমালোচনা ও আত্মশুদ্ধি।
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-indigo-300/90 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-400/20">
          ৫ মিনিট
        </span>
      </div>

      {/* Sub-item A: The Reality Check (অর্জনের হিসাব) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold font-heading text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            The Reality Check (অর্জনের হিসাব)
          </label>
          <span className="text-[11px] font-subheading text-slate-400">
            ধ্রুবতারা ছুঁতে পেরেছি কি?
          </span>
        </div>

        {/* Status Toggle Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setRealityCheckStatus("achieved");
              onSaveNote({ ...note, realityCheckStatus: "achieved" });
            }}
            className={`p-2.5 rounded-xl border text-center text-xs font-bold font-heading transition flex items-center justify-center gap-1.5 ${
              realityCheckStatus === "achieved"
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <span>🌟 অর্জিত</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRealityCheckStatus("partial");
              onSaveNote({ ...note, realityCheckStatus: "partial" });
            }}
            className={`p-2.5 rounded-xl border text-center text-xs font-bold font-heading transition flex items-center justify-center gap-1.5 ${
              realityCheckStatus === "partial"
                ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <span>⚖️ আংশিক</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRealityCheckStatus("missed");
              onSaveNote({ ...note, realityCheckStatus: "missed" });
            }}
            className={`p-2.5 rounded-xl border text-center text-xs font-bold font-heading transition flex items-center justify-center gap-1.5 ${
              realityCheckStatus === "missed"
                ? "bg-rose-500/20 border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <span>⏳ অপূর্ণ / বাধা</span>
          </button>
        </div>

        <textarea
          rows={2}
          value={realityCheckNotes}
          onChange={(e) => setRealityCheckNotes(e.target.value)}
          onBlur={() => handleSave()}
          placeholder="যদি North Star ছুঁতে না পারি, তবে আমাকে কোন জিনিসটি বাধা দিয়েছে?"
          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm font-subheading leading-relaxed focus:outline-none focus:border-cyan-400 transition resize-none"
        />
      </div>

      {/* Sub-item B: The Eclipse (হোঁচট খাওয়ার জায়গা) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold font-heading text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            The Eclipse (হোঁচট খাওয়ার জায়গা / নফসের ফাঁদ)
          </label>
          <span className="text-[11px] font-subheading text-slate-400">
            আত্মশুদ্ধি
          </span>
        </div>
        <textarea
          rows={2}
          value={theEclipse}
          onChange={(e) => setTheEclipse(e.target.value)}
          onBlur={() => handleSave()}
          placeholder="আজ নফসের সাথে লড়াইয়ে বা কাজের ক্ষেত্রে কোথায় আমি হোঁচট খেয়েছি বা সময় নষ্ট করেছি?"
          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-rose-500/25 text-white placeholder-slate-500 text-xs sm:text-sm font-subheading leading-relaxed focus:outline-none focus:border-rose-400 transition resize-none"
        />
      </div>

      {/* Sub-item C: Tomorrow's Orbit (আগামীকালের প্রতিজ্ঞা) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold font-heading text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5 text-amber-400" />
            Tomorrow&apos;s Orbit (আগামীকালের প্রতিজ্ঞা)
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            একক প্রতিশ্রুতি
          </span>
        </div>
        <input
          type="text"
          value={tomorrowsOrbit}
          onChange={(e) => setTomorrowsOrbit(e.target.value)}
          onBlur={() => handleSave()}
          placeholder="আজকের ভুলগুলো থেকে শিক্ষা নিয়ে আগামীকালের জন্য নিজের প্রতি আমার ছোট্ট একটি প্রতিশ্রুতি কী?"
          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-amber-500/25 text-white placeholder-slate-500 text-xs sm:text-sm font-subheading focus:outline-none focus:border-amber-400 transition"
        />
      </div>
    </div>
  );

  // Reusable Component: Divine Ayah Widget
  const renderAyahWidget = () => (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c1322] to-slate-950 border border-amber-500/25 space-y-4 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-heading text-amber-200">
              ঐশী বাণী (Divine Ayah / Hadith Widget)
            </h4>
            <span className="text-[10px] text-slate-400 font-subheading">
              আজকের দিনের অনুপ্রেরণাদায়ক আলো
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
          {ayahSource}
        </span>
      </div>

      {/* Ayah Display / Edit */}
      <div className="relative p-4 rounded-2xl bg-black/40 border border-amber-400/20 text-center space-y-2">
        <p className="text-sm sm:text-base font-serif italic text-amber-100/90 leading-relaxed">
          {ayahReminder}
        </p>
        <p className="text-xs font-mono font-medium text-amber-400/90">
          — {ayahSource}
        </p>
      </div>

      {/* Quick Preset Selector Buttons */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase text-slate-400 block">
          Quick Ayah Anchors:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {DIVINE_AYAH_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectAyahPreset(p)}
              className={`text-[11px] px-2.5 py-1 rounded-xl transition border flex items-center gap-1 ${
                ayahSource === p.source
                  ? "bg-amber-500/25 text-amber-200 border-amber-400/40 font-semibold"
                  : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Reusable Component: Shukr Particles & Vault
  const renderShukrVault = () => (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-amber-400/30 space-y-4 shadow-[0_0_35px_rgba(245,158,11,0.1)] relative overflow-hidden backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Heart className="w-4 h-4 fill-amber-400/40 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-amber-200">
              Shukr Particles &amp; Vault
            </h3>
            <p className="text-xs text-slate-400 font-subheading">
              আজকের নিয়ামতের শুকরিয়া আলোর কণা হয়ে নক্ষত্রমণ্ডলে যুক্ত হয়।
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{shukrParticles.length} Light Particles</span>
        </div>
      </div>

      {/* Add Shukr Particle Input */}
      <form onSubmit={handleAddShukrParticle} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={shukrInput}
            onChange={(e) => setShukrInput(e.target.value)}
            placeholder="আজ কোন বিশেষ নিয়ামত বা প্রাপ্তির জন্য আপনি সবচেয়ে বেশি কৃতজ্ঞ?"
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-amber-400/25 text-white placeholder-slate-500 text-xs sm:text-sm font-subheading focus:outline-none focus:border-amber-400 transition"
          />
          <button
            type="submit"
            disabled={!shukrInput.trim()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold font-badge transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>আলো যোগ করুন</span>
          </button>
        </div>
      </form>

      {/* Glassmorphic Constellation Jar (Visualizing Particles) */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5 max-h-56 overflow-y-auto">
        {shukrParticles.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs font-subheading flex flex-col items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-amber-400/50" />
            <span>এখনও কোনো শুকরিয়ার আলো জমা হয়নি। একটি নিয়ামত লিখে সাবমিট করুন।</span>
          </div>
        ) : (
          shukrParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-3 rounded-xl bg-slate-900/90 border border-amber-400/20 flex items-start justify-between gap-3 group hover:border-amber-400/40 transition"
            >
              <div className="flex items-start gap-2.5 flex-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shadow-[0_0_8px_#fbbf24] flex-shrink-0 animate-pulse" />
                <p className="text-xs sm:text-sm font-subheading text-slate-200 leading-relaxed font-serif">
                  {particle.text}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteShukrParticle(particle.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-1"
                title="Delete particle"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. HEADER BANNER & TIME-BASED HORIZON SWITCHER
         ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950/95 via-[#0c1427]/95 to-slate-950/95 border border-amber-500/25 p-5 sm:p-6 shadow-[0_0_40px_rgba(245,158,11,0.12)] backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-amber-500/15 text-amber-300 border border-amber-400/35 flex items-center gap-1.5 shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                DAILY LOG &amp; NOTES • রূহানী নোটবুক
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {getTodayDateKey()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-wide flex items-center gap-2.5">
              <span>The Cosmic Mirror</span>
              <span className="text-amber-400 text-lg font-normal font-sans opacity-85">
                (রূহানী আয়না)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-subheading leading-relaxed">
              সকালের সংকল্পে ধ্রুবতারা নির্ধারণ, অন্তরের রূহানী আবহাওয়া পর্যবেক্ষণ এবং রাতের শান্ত মোরাকাবায় নফসের পুঙ্খানুপুঙ্খ হিসাব।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quick Phase Selector Pills */}
            <div className="p-1 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setActivePhase("all")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activePhase === "all"
                    ? "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>এক নজরে সব (All)</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePhase("morning")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activePhase === "morning"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>সকাল (Morning)</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePhase("evening")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activePhase === "evening"
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>রাত (Evening)</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={() => handleSave()}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-badge transition active:scale-95 shadow-lg ${
                isSaved
                  ? "bg-emerald-500 text-slate-950 shadow-emerald-500/25"
                  : "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 border border-amber-300/40 shadow-amber-500/20"
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Saved to Starlight</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Save Today&apos;s Log</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. THE NORTH STAR (উজ্জ্বল ধ্রুবতারা — HERO FOCUS CARD)
          FIX: Moved badge to header row so it NEVER overlaps input text!
         ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-amber-400/40 p-5 sm:p-7 shadow-[0_0_35px_rgba(245,158,11,0.18)] backdrop-blur-xl group hover:border-amber-400/60 transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/15 transition" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Pulsing Star Icon Badge */}
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.35)] relative">
                <Star className="w-6 h-6 text-amber-300 fill-amber-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-heading text-amber-200 tracking-wide">
                    The North Star
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
                    আজকের প্রধান একক লক্ষ্য
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-subheading">
                  সারাদিনের সবচেয়ে গুরুত্বপূর্ণ একটি লক্ষ্য, যা তালহাকে চূড়ান্ত গন্তব্যের দিকে এগিয়ে নেবে।
                </p>
              </div>
            </div>

            {/* Badges in the top-right header: NO OVERLAP WITH INPUT! */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-medium text-slate-400 bg-black/40 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Non-negotiable Anchor
              </span>
              {coreFocus.trim() ? (
                <span className="text-[11px] font-mono text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  Locked in Starlight
                </span>
              ) : (
                <span className="text-[11px] font-mono text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  Awaiting Input
                </span>
              )}
            </div>
          </div>

          {/* North Star Input (Clear, unobstructed text area) */}
          <div className="relative">
            <input
              type="text"
              value={coreFocus}
              onChange={(e) => setCoreFocus(e.target.value)}
              onBlur={() => handleSave()}
              placeholder="আজকের দিনে আমার সবচেয়ে গুরুত্বপূর্ণ একক লক্ষ্যটি কী, যা সম্পন্ন করলে আজকের দিনটি সফল?"
              className="w-full px-5 py-4 rounded-2xl bg-slate-950/80 border-2 border-amber-400/30 text-white placeholder-slate-500 text-sm sm:text-base font-subheading font-medium focus:outline-none focus:border-amber-400 focus:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition duration-200"
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MAIN CONTENT 2-COLUMN BALANCED LAYOUT
          FIX: Both columns are ALWAYS populated! Zero blank spaces!
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ====================================================
            COLUMN 1 (LEFT COLUMN)
           ==================================================== */}
        <div className="space-y-6">
          {activePhase === "morning" ? (
            // In Morning-only mode: Morning Intent card
            renderMorningIntentCard()
          ) : activePhase === "evening" ? (
            // In Evening-only mode: Evening Reflection on Left
            renderEveningReflectionCard()
          ) : (
            // In All mode: Morning Intent on Left + Divine Ayah
            <>
              {renderMorningIntentCard()}
              {renderAyahWidget()}
            </>
          )}
        </div>

        {/* ====================================================
            COLUMN 2 (RIGHT COLUMN)
            Always filled with rich content — NEVER BLANK!
           ==================================================== */}
        <div className="space-y-6">
          {activePhase === "morning" ? (
            // In Morning-only mode: Right column has Ayah Widget + Shukr Vault
            <>
              {renderAyahWidget()}
              {renderShukrVault()}
            </>
          ) : activePhase === "evening" ? (
            // In Evening-only mode: Right column has Shukr Vault + Ayah Widget
            <>
              {renderShukrVault()}
              {renderAyahWidget()}
            </>
          ) : (
            // In All mode: Right column has Evening Reflection + Shukr Vault
            <>
              {renderEveningReflectionCard()}
              {renderShukrVault()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
