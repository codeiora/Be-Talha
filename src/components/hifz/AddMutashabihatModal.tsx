"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ShieldAlert } from "lucide-react";
import { MutashabihatItem } from "@/types/hifz";
import { QURAN_SURAHS, getSurahMeta } from "@/lib/quranData";

interface AddMutashabihatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MutashabihatItem) => void;
}

export function AddMutashabihatModal({
  isOpen,
  onClose,
  onSave,
}: AddMutashabihatModalProps) {
  const [title, setTitle] = useState("");
  const [surahA, setSurahA] = useState(2);
  const [ayahA, setAyahA] = useState(1);
  const [textA, setTextA] = useState("");
  const [transA, setTransA] = useState("");

  const [surahB, setSurahB] = useState(3);
  const [ayahB, setAyahB] = useState(1);
  const [textB, setTextB] = useState("");
  const [transB, setTransB] = useState("");

  const [differenceNote, setDifferenceNote] = useState("");
  const [tip, setTip] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !differenceNote.trim()) return;

    const newItem: MutashabihatItem = {
      id: `mut-${Date.now()}`,
      title: title.trim(),
      surahA,
      ayahA,
      textA: textA.trim() || "آية الأولى...",
      translationA: transA.trim() || "",
      surahB,
      ayahB,
      textB: textB.trim() || "آية الثانية...",
      translationB: transB.trim() || "",
      differenceNote: differenceNote.trim(),
      tip: tip.trim() || undefined,
      isCustom: true,
    };

    onSave(newItem);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950/95 border border-purple-500/30 shadow-2xl overflow-hidden text-slate-100"
        >
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold font-heading text-white">
                Add Mutashabihaat Pair
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
            <div>
              <label className="text-[11px] font-badge text-slate-400 block mb-1">
                Title / Topic *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Invitation to Paradise phrasing..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-sans"
              />
            </div>

            {/* Verse A inputs */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2.5">
              <span className="text-xs font-semibold text-cyan-300 font-badge">
                First Verse (Verse A)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={surahA}
                  onChange={(e) => setSurahA(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 font-sans"
                >
                  {QURAN_SURAHS.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.nameEnglish}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  placeholder="Verse number"
                  value={ayahA}
                  onChange={(e) => setAyahA(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 font-badge"
                />
              </div>
              <input
                type="text"
                dir="rtl"
                placeholder="Arabic verse text..."
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-amber-100 font-serif"
              />
            </div>

            {/* Verse B inputs */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2.5">
              <span className="text-xs font-semibold text-indigo-300 font-badge">
                Second Verse (Verse B)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={surahB}
                  onChange={(e) => setSurahB(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 font-sans"
                >
                  {QURAN_SURAHS.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.nameEnglish}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  placeholder="Verse number"
                  value={ayahB}
                  onChange={(e) => setAyahB(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 font-badge"
                />
              </div>
              <input
                type="text"
                dir="rtl"
                placeholder="Arabic verse text..."
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-indigo-100 font-serif"
              />
            </div>

            {/* Difference note */}
            <div>
              <label className="text-[11px] font-badge text-slate-400 block mb-1">
                Key Difference & Memory Anchor *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g., In Al-Baqarah 'Wa-kula' with 'raghadan', whereas in Al-A'raf 'Fa-kula'..."
                value={differenceNote}
                onChange={(e) => setDifferenceNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 resize-none focus:outline-none focus:border-purple-400 font-subheading"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-badge font-medium text-xs transition"
              >
                Save Pair
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
