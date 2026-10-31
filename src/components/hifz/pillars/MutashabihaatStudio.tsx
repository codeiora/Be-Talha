"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Sparkles,
  Plus,
  Search,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import {
  MutashabihatItem,
} from "@/types/hifz";
import {
  loadMutashabihat,
  saveMutashabihat,
} from "@/lib/hifzStorage";
import { getSurahMeta } from "@/lib/quranData";
import { AddMutashabihatModal } from "@/components/hifz/AddMutashabihatModal";

export function MutashabihaatStudio() {
  const [items, setItems] = useState<MutashabihatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setItems(loadMutashabihat());
  }, []);

  const handleSaveItem = (item: MutashabihatItem) => {
    const updated = [item, ...items];
    setItems(updated);
    saveMutashabihat(updated);
  };

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const metaA = getSurahMeta(item.surahA);
    const metaB = getSurahMeta(item.surahB);
    return (
      item.title.toLowerCase().includes(q) ||
      item.differenceNote.toLowerCase().includes(q) ||
      metaA?.nameEnglish.toLowerCase().includes(q) ||
      metaB?.nameEnglish.toLowerCase().includes(q) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/40 border border-rose-500/30 shadow-2xl backdrop-blur-xl">
        <div className="absolute -bottom-6 -right-4 text-9xl font-serif text-rose-400/[0.04] pointer-events-none select-none">
          متشابهات
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-badge mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Pillar 05 • Dedicated Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
              Mutashabihaat Studio{" "}
              <span className="text-base sm:text-lg font-bengali font-normal text-rose-400">
                (মুতাশাবিহাত - বিভ্রান্তিকর সদৃশ আয়াত)
              </span>
            </h1>
            <p className="text-sm font-subheading text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Untangle identically phrased and mirrored Quranic verses. Study word-by-word variations side-by-side with classical memory anchors to eliminate confusion during recitation.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 text-rose-200 text-xs font-badge transition shadow-lg shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tricky Verse Pair</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by keyword, Surah name (e.g. Baqarah, A'raf), or tag..."
          className="w-full bg-transparent text-xs font-badge text-white placeholder-slate-500 outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-badge text-slate-400 hover:text-white px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Verses Comparison Cards */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-950/60 border border-white/10 space-y-2">
            <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-subheading text-slate-300">
              No matching Mutashabihaat pairs found.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const metaA = getSurahMeta(item.surahA);
            const metaB = getSurahMeta(item.surahB);

            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 hover:border-rose-500/40 backdrop-blur-md shadow-xl transition-all space-y-4"
              >
                {/* Title & Tags */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>{item.title}</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-badge text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Side-by-Side Verses Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Surah A */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-badge text-cyan-300">
                        {metaA?.nameEnglish || `Surah #${item.surahA}`} : Verse {item.ayahA}
                      </span>
                      <span className="text-xs font-serif text-amber-200">
                        {metaA?.nameArabic}
                      </span>
                    </div>
                    <p className="text-lg font-serif text-slate-100 text-right leading-loose pt-1">
                      {item.textA}
                    </p>
                    <p className="text-xs font-subheading text-slate-400 pt-1 border-t border-white/5">
                      {item.translationA}
                    </p>
                  </div>

                  {/* Surah B */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-badge text-rose-300">
                        {metaB?.nameEnglish || `Surah #${item.surahB}`} : Verse {item.ayahB}
                      </span>
                      <span className="text-xs font-serif text-amber-200">
                        {metaB?.nameArabic}
                      </span>
                    </div>
                    <p className="text-lg font-serif text-slate-100 text-right leading-loose pt-1">
                      {item.textB}
                    </p>
                    <p className="text-xs font-subheading text-slate-400 pt-1 border-t border-white/5">
                      {item.translationB}
                    </p>
                  </div>
                </div>

                {/* Difference Note & Memory Anchor Rule */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2 text-xs">
                  <div>
                    <span className="font-badge text-rose-300 block mb-0.5">
                      Key Contrast & Difference:
                    </span>
                    <p className="font-subheading text-slate-300 leading-relaxed">
                      {item.differenceNote}
                    </p>
                  </div>
                  {item.tip && (
                    <div className="pt-2 border-t border-rose-500/20">
                      <span className="font-badge text-amber-300 flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Memory Anchor Rule:
                      </span>
                      <p className="font-subheading text-amber-200/90 leading-relaxed">
                        {item.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      <AddMutashabihatModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
}