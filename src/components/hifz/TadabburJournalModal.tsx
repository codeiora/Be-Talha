"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  PenLine,
  Sparkles,
  Search,
  Tag,
  BookOpen,
  Calendar,
  Trash2,
  Plus,
} from "lucide-react";
import { AyahReflectionNote } from "@/types/hifz";
import { QURAN_SURAHS, getSurahMeta } from "@/lib/quranData";

interface TadabburJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  reflections: AyahReflectionNote[];
  onSaveReflection: (note: AyahReflectionNote) => void;
  initialSurah?: number;
  initialAyah?: number;
  initialArabicText?: string;
}

export function TadabburJournalModal({
  isOpen,
  onClose,
  reflections,
  onSaveReflection,
  initialSurah = 1,
  initialAyah = 1,
  initialArabicText = "",
}: TadabburJournalModalProps) {
  const [isAddingNew, setIsAddingNew] = useState(true);
  const [surahNum, setSurahNum] = useState<number>(initialSurah);
  const [ayahNum, setAyahNum] = useState<number>(initialAyah);
  const [arabicText, setArabicText] = useState<string>(initialArabicText);
  const [reflectionText, setReflectionText] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  if (!isOpen) return null;

  const currentSurahMeta = getSurahMeta(surahNum) || QURAN_SURAHS[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    const tags = tagInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const newNote: AyahReflectionNote = {
      id: `ref-${Date.now()}`,
      surahNumber: surahNum,
      ayahNumber: ayahNum,
      arabicText: arabicText.trim() || undefined,
      reflection: reflectionText.trim(),
      tags: tags.length > 0 ? tags : ["Guidance"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onSaveReflection(newNote);
    setReflectionText("");
    setTagInput("");
    setIsAddingNew(false);
  };

  const filteredReflections = reflections.filter((r) => {
    const meta = getSurahMeta(r.surahNumber);
    const surahName = meta?.nameEnglish || "";
    const matchSearch =
      r.reflection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surahName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950/95 border border-purple-500/30 shadow-2xl shadow-purple-950/60 overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center">
                <PenLine className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Ayah Reflections (Tadabbur Journal)
                </h3>
                <span className="text-xs text-slate-400 font-subheading">
                  Record contemplative reflections, wisdom, and spiritual insights
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation Bar */}
          <div className="px-6 py-3 border-b border-white/5 bg-slate-900/30 flex items-center justify-between gap-3 text-xs font-badge">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingNew(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  isAddingNew
                    ? "bg-purple-500/30 text-purple-200 border border-purple-400/40 font-medium"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Reflection</span>
              </button>

              <button
                onClick={() => setIsAddingNew(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  !isAddingNew
                    ? "bg-purple-500/30 text-purple-200 border border-purple-400/40 font-medium"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Saved Reflections ({reflections.length})</span>
              </button>
            </div>

            {!isAddingNew && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reflections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-sans"
                />
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {isAddingNew ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-badge text-slate-400 block mb-1">
                      Surah
                    </label>
                    <select
                      value={surahNum}
                      onChange={(e) => setSurahNum(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-purple-400 font-sans"
                    >
                      {QURAN_SURAHS.map((s) => (
                        <option key={s.number} value={s.number}>
                          {s.number}. {s.nameEnglish} ({s.nameArabic})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-badge text-slate-400 block mb-1">
                      Verse Number
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={currentSurahMeta.totalAyahs}
                      value={ayahNum}
                      onChange={(e) => setAyahNum(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-purple-400 font-badge"
                    />
                  </div>
                </div>

                {/* Arabic Text (Optional) */}
                <div>
                  <label className="text-[11px] font-badge text-slate-400 block mb-1">
                    Arabic Text (Optional)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="Arabic verse..."
                    value={arabicText}
                    onChange={(e) => setArabicText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-amber-100 font-serif text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Reflection Textarea */}
                <div>
                  <label className="text-[11px] font-badge text-slate-400 block mb-1">
                    Your Contemplation / Tadabbur *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="What heart lessons did I derive from this verse? How does it illuminate my journey?..."
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-200 text-sm leading-relaxed focus:outline-none focus:border-purple-400 resize-none font-subheading"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[11px] font-badge text-slate-400 block mb-1">
                    Tags (comma-separated, e.g. Tawakkul, Sabr, Gratitude)
                  </label>
                  <input
                    type="text"
                    placeholder="Tawakkul, Gratitude, Akhirah"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-purple-400 font-sans"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-badge font-medium text-xs shadow-lg shadow-purple-950/40 transition"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5">
                {filteredReflections.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-subheading">
                    No reflections found.
                  </div>
                ) : (
                  filteredReflections.map((item) => {
                    const surah = getSurahMeta(item.surahNumber);
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5 hover:border-purple-500/30 transition"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-purple-300 font-heading text-sm">
                            {surah?.nameEnglish || `Surah ${item.surahNumber}`} : Verse {item.ayahNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-badge">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {item.arabicText && (
                          <p dir="rtl" className="font-serif text-amber-100/90 text-sm">
                            {item.arabicText}
                          </p>
                        )}

                        <p className="text-sm text-slate-200 leading-relaxed font-subheading italic">
                          &ldquo;{item.reflection}&rdquo;
                        </p>

                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/20 text-[10px] text-purple-300 font-badge"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
