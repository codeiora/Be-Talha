"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ConstellationMilestone,
  MilestoneCategory,
  WingSection,
} from "@/types/constellation";
import { X, Sparkles, Plus, Star } from "lucide-react";

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMilestone: (newMilestone: ConstellationMilestone) => void;
}

const WING_OPTIONS: { id: WingSection; label: string; defaultX: number; defaultY: number }[] = [
  { id: "left-wing", label: "Left Wing (Mind & Craft)", defaultX: 25, defaultY: 38 },
  { id: "right-wing", label: "Right Wing (Discipline & Armor)", defaultX: 75, defaultY: 38 },
  { id: "anchor", label: "The Root Foundation (Anchor)", defaultX: 50, defaultY: 70 },
];

const CATEGORY_OPTIONS: { id: MilestoneCategory; label: string; color: string }[] = [
  { id: "intellect", label: "Intellect & Mind", color: "#38bdf8" },
  { id: "armor", label: "Discipline & Armor", color: "#34d399" },
  { id: "roots", label: "Roots & Spiritual", color: "#fbbf24" },
  { id: "creation", label: "Creation & Impact", color: "#a855f7" },
  { id: "character", label: "Character & Leadership", color: "#f59e0b" },
];

export function AddMilestoneModal({
  isOpen,
  onClose,
  onAddMilestone,
}: AddMilestoneModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedWing, setSelectedWing] = useState<WingSection>("left-wing");
  const [selectedCategory, setSelectedCategory] =
    useState<MilestoneCategory>("intellect");
  const [targetHorizon, setTargetHorizon] = useState("2026–2027");
  const [magnitude, setMagnitude] = useState<number>(4);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const wingInfo = WING_OPTIONS.find((w) => w.id === selectedWing)!;
    const catInfo = CATEGORY_OPTIONS.find((c) => c.id === selectedCategory)!;

    // Jitter slightly to avoid overlapping existing stars
    const jitterX = (Math.random() - 0.5) * 8;
    const jitterY = (Math.random() - 0.5) * 8;

    const newMilestone: ConstellationMilestone = {
      id: "custom-star-" + Date.now(),
      title: title.trim(),
      description: description.trim() || "Long-term celestial milestone.",
      wingSection: selectedWing,
      wingLabel: wingInfo.label,
      category: selectedCategory,
      categoryLabel: catInfo.label,
      color: catInfo.color,
      x: Math.max(10, Math.min(90, wingInfo.defaultX + jitterX)),
      y: Math.max(15, Math.min(85, wingInfo.defaultY + jitterY)),
      completed: false,
      magnitude,
      targetHorizon: targetHorizon.trim() || "Ongoing",
      isCustom: true,
    };

    onAddMilestone(newMilestone);
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          className="relative w-full max-w-lg bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 z-10 overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                Add New Milestone Star
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Milestone Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Systems Architecture & Kubernetes Mastery..."
                className="w-full px-4 py-2.5 text-sm bg-slate-950/80 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Description & Purpose
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this milestone essential to your Winged Morning Star evolution?"
                className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-950/80 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 transition resize-none"
              />
            </div>

            {/* Wing Selection */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Constellation Wing Section
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {WING_OPTIONS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWing(w.id)}
                    className={`px-3 py-2 text-xs rounded-xl border text-left transition ${
                      selectedWing === w.id
                        ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/60 shadow-sm"
                        : "bg-slate-950/50 text-slate-400 border-white/5 hover:border-white/15"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 text-xs rounded-xl border transition ${
                      selectedCategory === c.id
                        ? "bg-amber-500/20 text-amber-300 border-amber-400/60"
                        : "bg-slate-950/50 text-slate-400 border-white/5 hover:border-white/15"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Horizon & Magnitude */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Target Horizon
                </label>
                <input
                  type="text"
                  value={targetHorizon}
                  onChange={(e) => setTargetHorizon(e.target.value)}
                  placeholder="e.g. 2026–2027"
                  className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-white/10 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-400/60"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Star Radiance (Magnitude)
                </label>
                <div className="flex items-center gap-1 mt-1">
                  {[3, 4, 5].map((mag) => (
                    <button
                      key={mag}
                      type="button"
                      onClick={() => setMagnitude(mag)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono flex items-center justify-center gap-1 ${
                        magnitude === mag
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/60"
                          : "bg-slate-950/50 text-slate-500 border-white/5"
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span>{mag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-semibold tracking-wide uppercase transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Place in Sky</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
