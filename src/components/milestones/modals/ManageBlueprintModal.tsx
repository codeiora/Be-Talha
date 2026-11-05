"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  Trash2,
  X,
  Clock,
  Flame,
  Save,
  RotateCcw,
  Check,
  Zap,
} from "lucide-react";
import {
  BlueprintSparkItem,
  DEFAULT_DAILY_BLUEPRINT,
} from "@/lib/milestoneData";
import { GoalCategory, PriorityLevel, CATEGORY_MAP } from "@/types/milestones";

interface ManageBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: BlueprintSparkItem[];
  onSaveBlueprint: (updated: BlueprintSparkItem[]) => void;
}

export function ManageBlueprintModal({
  isOpen,
  onClose,
  blueprint,
  onSaveBlueprint,
}: ManageBlueprintModalProps) {
  const [items, setItems] = useState<BlueprintSparkItem[]>(blueprint);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<GoalCategory>("deen");
  const [newPriority, setNewPriority] = useState<PriorityLevel>("normal");
  const [newMinutes, setNewMinutes] = useState<number>(30);
  const [newPoints, setNewPoints] = useState<number>(15);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BlueprintSparkItem = {
      id: `bp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      estimatedMinutes: newMinutes,
      points: newPoints,
    };

    const updated = [...items, newItem];
    setItems(updated);
    onSaveBlueprint(updated);
    setNewTitle("");
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onSaveBlueprint(updated);
  };

  const handleResetDefault = () => {
    setItems(DEFAULT_DAILY_BLUEPRINT);
    onSaveBlueprint(DEFAULT_DAILY_BLUEPRINT);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          className="relative w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-amber-500/30 p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-2xl space-y-5 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  <Zap className="w-4 h-4 text-amber-400" />
                </span>
                <h3 className="text-lg font-heading font-bold text-white">
                  Manage Daily Orbit Blueprint
                </h3>
              </div>
              <p className="text-xs font-subheading text-slate-400">
                Configure recurring anchor habits (Salat, Hifz, Workout, Routine) to instantly seed your day with 1 click.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Add New Recurring Task to Blueprint */}
          <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
            <div className="text-xs font-badge text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Recurring Habit to Blueprint</span>
            </div>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Habit title (e.g. Tahajjud, Morning Hifz Revision, Workout)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs font-subheading text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Category */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 mr-1">Domain:</span>
                {(["deen", "intellect", "body", "tazkiyah", "other"] as GoalCategory[]).map((catKey) => {
                  const meta = CATEGORY_MAP[catKey];
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setNewCategory(catKey)}
                      className={`px-2 py-0.5 rounded-lg border text-[11px] font-subheading transition ${
                        newCategory === catKey
                          ? `${meta.bgLight} ${meta.borderColor} ${meta.color} font-bold`
                          : "bg-slate-900 border-white/5 text-slate-400"
                      }`}
                    >
                      {meta.label}
                    </button>
                  );
                })}
              </div>

              {/* Time & Points */}
              <div className="flex items-center gap-2">
                <select
                  value={newMinutes}
                  onChange={(e) => setNewMinutes(Number(e.target.value))}
                  className="bg-slate-900 border border-white/15 rounded-xl px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
                >
                  <option value={15}>15m</option>
                  <option value={20}>20m</option>
                  <option value={30}>30m</option>
                  <option value={45}>45m</option>
                  <option value={60}>60m</option>
                  <option value={90}>90m</option>
                </select>

                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                  className="bg-slate-900 border border-white/15 rounded-xl px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="high">High Priority</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>

                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-badge font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:opacity-40 transition active:scale-95"
                >
                  Add Habit
                </button>
              </div>
            </div>
          </form>

          {/* Current Blueprint Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-badge text-slate-400 uppercase tracking-wider px-1">
              <span>Blueprint Routine Habits ({items.length})</span>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 lowercase"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const catMeta = CATEGORY_MAP[item.category] || CATEGORY_MAP.other;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-white/10 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className={`text-[10px] font-badge px-2 py-0.5 rounded-full border ${catMeta.bgLight} ${catMeta.color} ${catMeta.borderColor}`}>
                        {catMeta.label}
                      </span>
                      <span className="text-xs font-subheading text-white truncate flex-1">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {item.estimatedMinutes}m
                      </span>

                      <span className="text-[10px] font-badge text-amber-300">
                        +{item.points} XP
                      </span>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                        title="Delete from blueprint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Close */}
          <div className="flex items-center justify-between pt-3 border-t border-amber-500/20">
            {isSavedNotice ? (
              <span className="text-xs font-badge text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Blueprint Saved!
              </span>
            ) : (
              <span className="text-xs font-subheading text-slate-400">
                Changes are automatically saved.
              </span>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-badge font-bold bg-slate-800 border border-white/10 text-white hover:bg-slate-700 transition"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
