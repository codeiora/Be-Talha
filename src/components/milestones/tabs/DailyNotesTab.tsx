"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Save,
  CheckCircle2,
  Heart,
  Lightbulb,
  Compass,
  Calendar,
} from "lucide-react";
import { DailyNoteEntry } from "@/types/milestones";
import { getTodayDateKey } from "@/lib/milestoneData";

interface DailyNotesTabProps {
  note: DailyNoteEntry;
  onSaveNote: (updated: DailyNoteEntry) => void;
}

export function DailyNotesTab({ note, onSaveNote }: DailyNotesTabProps) {
  const [coreFocus, setCoreFocus] = useState(note.coreFocus || "");
  const [ayahReminder, setAyahReminder] = useState(note.ayahReminder || "");
  const [thoughts, setThoughts] = useState(note.thoughts || "");
  const [shukr, setShukr] = useState(note.shukr || "");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCoreFocus(note.coreFocus || "");
    setAyahReminder(note.ayahReminder || "");
    setThoughts(note.thoughts || "");
    setShukr(note.shukr || "");
  }, [note]);

  const handleSave = () => {
    onSaveNote({
      ...note,
      dateKey: getTodayDateKey(),
      coreFocus,
      ayahReminder,
      thoughts,
      shukr,
      updatedAt: Date.now(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0e172a]/95 to-slate-900/90 border border-violet-500/20 p-5 sm:p-6 shadow-[0_0_30px_rgba(139,92,246,0.1)] backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-violet-500/10 text-violet-300 border border-violet-400/30 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                SACRED DAILY LOG
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {getTodayDateKey()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
              Daily Note &amp; Contemplation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Preserve today&apos;s revelations, spiritual anchors, and profound thoughts.
            </p>
          </div>

          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition active:scale-95 shadow-md ${
              isSaved
                ? "bg-emerald-500 text-slate-950 shadow-emerald-500/20"
                : "bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border border-violet-400/40 shadow-violet-500/20"
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved to Starlight
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Today&apos;s Log
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Four Sacred Journal Containers */}
      <div className="grid grid-cols-1 gap-5">
        {/* Container 1: Core North Star Focus */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/20 space-y-3 shadow-sm hover:border-cyan-400/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
              <Compass className="w-4 h-4" />
              <span>North Star: Today&apos;s Single Core Focus (আজকের মূল সংকল্প)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Non-negotiable</span>
          </div>
          <input
            type="text"
            value={coreFocus}
            onChange={(e) => setCoreFocus(e.target.value)}
            onBlur={handleSave}
            placeholder="What is the one thing that will make today victorious if completed?"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Container 2: Ayah / Sacred Anchor of the Day */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-amber-500/20 space-y-3 shadow-sm hover:border-amber-400/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Sacred Ayah / Hadith / Anchor of the Day (আজকের আয়াত বা প্রেরণা)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Spiritual Grounding</span>
          </div>
          <textarea
            rows={3}
            value={ayahReminder}
            onChange={(e) => setAyahReminder(e.target.value)}
            onBlur={handleSave}
            placeholder="e.g. “And whoever relies upon Allah - then He is sufficient for him.” (Surah At-Talaq: 3)"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition resize-none font-serif leading-relaxed"
          />
        </div>

        {/* Container 3: Free Thoughts & Brain Dump */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 space-y-3 shadow-sm hover:border-indigo-400/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
              <Lightbulb className="w-4 h-4" />
              <span>Cosmic Journal &amp; Brain Dump (মুক্ত ভাবনা ও উপলব্ধি)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Unfiltered Stream</span>
          </div>
          <textarea
            rows={5}
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            onBlur={handleSave}
            placeholder="Write down any ideas, system architectural breakthroughs, reflections on errors, or personal insights from today..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400 transition resize-none leading-relaxed"
          />
        </div>

        {/* Container 4: Daily Shukr & Gratitude */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-rose-500/20 space-y-3 shadow-sm hover:border-rose-400/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Daily Shukr &amp; Gratitude (আজকের শোকরিয়া)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Inner Peace</span>
          </div>
          <textarea
            rows={3}
            value={shukr}
            onChange={(e) => setShukr(e.target.value)}
            onBlur={handleSave}
            placeholder="What 2 or 3 blessings are you deeply grateful to Allah for today?"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400 transition resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
