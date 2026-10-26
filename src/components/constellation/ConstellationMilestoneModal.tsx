"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ConstellationMilestone,
} from "@/types/constellation";
import {
  X,
  Star,
  Sparkles,
  CheckCircle2,
  Calendar,
  Trash2,
  Save,
  MessageSquare,
} from "lucide-react";

interface ConstellationMilestoneModalProps {
  milestone: ConstellationMilestone | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onDeleteMilestone?: (id: string) => void;
}

export function ConstellationMilestoneModal({
  milestone,
  isOpen,
  onClose,
  onToggleComplete,
  onSaveNotes,
  onDeleteMilestone,
}: ConstellationMilestoneModalProps) {
  const [notes, setNotes] = useState("");
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  useEffect(() => {
    if (milestone) {
      setNotes(milestone.notes || "");
    }
  }, [milestone]);

  if (!isOpen || !milestone) return null;

  const handleSaveNotes = () => {
    onSaveNotes(milestone.id, notes);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
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
          className="relative w-full max-w-xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 z-10 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  {milestone.wingLabel}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-slate-400">
                  {milestone.categoryLabel}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
                {milestone.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
            {milestone.description}
          </p>

          {/* Meta Info Pill Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Horizon: {milestone.targetHorizon}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Radiance: Magnitude {milestone.magnitude}</span>
            </div>

            {milestone.completedAt && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Ignited:{" "}
                  {new Date(milestone.completedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Notes & Reflection Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Personal Reflection & Milestone Notes</span>
              </label>
              {isSavedRecently && (
                <span className="text-[10px] font-mono text-emerald-400">
                  Saved successfully!
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record your personal reflection, progress, or insights on this milestone..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 transition resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
              >
                <Save className="w-3 h-3" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
            {milestone.isCustom && onDeleteMilestone ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteMilestone(milestone.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-mono transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Star</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => onToggleComplete(milestone.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide transition shadow-lg ${
                milestone.completed
                  ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30"
                  : "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/30"
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  milestone.completed
                    ? "text-amber-400 fill-amber-400"
                    : "text-white"
                }`}
              />
              <span>
                {milestone.completed ? "Mark Dormant" : "Ignite Star"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
