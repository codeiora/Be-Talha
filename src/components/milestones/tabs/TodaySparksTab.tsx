"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Flame,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Layers,
  Star,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  TodaySparkGoal,
  GoalCategory,
  PriorityLevel,
  CATEGORY_MAP,
  WeeklySprintGoal,
} from "@/types/milestones";
import { playMilestoneChime, getTodayDateKey } from "@/lib/milestoneData";

interface TodaySparksTabProps {
  tasks: TodaySparkGoal[];
  weeklyGoals: WeeklySprintGoal[];
  onAddTask: (task: Omit<TodaySparkGoal, "id" | "createdAt" | "dateKey">) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onCarryOverTasks: () => void;
}

export function TodaySparksTab({
  tasks,
  weeklyGoals,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onCarryOverTasks,
}: TodaySparksTabProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("deen");
  const [priority, setPriority] = useState<PriorityLevel>("high");
  const [points, setPoints] = useState<number>(15);
  const [linkedWeeklyGoalId, setLinkedWeeklyGoalId] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isAddingOpen, setIsAddingOpen] = useState(false);

  const todayKey = getTodayDateKey();

  // Detect unfinished tasks from previous days
  const uncompletedPreviousDays = tasks.filter(
    (t) => !t.completed && t.dateKey && t.dateKey < todayKey
  );

  // Filter tasks based on selected view
  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const totalPointsEarned = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + (t.points || 0), 0);

  const totalPossiblePoints = tasks.reduce((acc, t) => acc + (t.points || 0), 0);
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      points,
      completed: false,
      linkedWeeklyGoalId: linkedWeeklyGoalId || undefined,
    });

    setTitle("");
    setIsAddingOpen(false);
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    onToggleTask(id);
    if (!currentStatus) {
      playMilestoneChime(true);
      confetti({
        particleCount: 28,
        spread: 55,
        origin: { y: 0.75 },
        colors: ["#fbbf24", "#f59e0b", "#38bdf8", "#34d399"],
      });
    } else {
      playMilestoneChime(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Progress & Stats Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950/80 border border-amber-500/30 p-5 sm:p-6 shadow-[0_0_35px_rgba(245,158,11,0.1),0_12px_32px_rgba(2,6,23,0.8)] backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-badge tracking-wider bg-amber-500/15 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                DAILY SPARKS &amp; TASKS
              </span>
              <span className="text-xs font-subheading text-slate-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading text-white flex items-center gap-2 tracking-wide">
              Today&apos;s Focus Sparks
              <span className="text-slate-400 text-sm font-subheading font-normal">
                ({completedCount}/{tasks.length} Completed)
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-subheading text-slate-300">
              Conquer today&apos;s non-negotiable sparks to fuel your cosmic momentum and spiritual ascent.
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 bg-slate-900/80 border border-amber-500/20 rounded-2xl p-3.5 px-5 shadow-inner">
            <div>
              <div className="text-[11px] font-subheading text-slate-400 uppercase tracking-wider">
                Cosmic XP Earned
              </div>
              <div className="text-xl font-badge text-amber-300 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse" />
                {totalPointsEarned} <span className="text-xs font-subheading text-slate-500">/ {totalPossiblePoints} max</span>
              </div>
            </div>

            <div className="w-[1px] h-10 bg-amber-500/20" />

            <div>
              <div className="text-[11px] font-subheading text-slate-400 uppercase tracking-wider">
                Day Progress
              </div>
              <div className="text-xl font-badge text-emerald-300">
                {progressPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 relative w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* 2. Unfinished Tasks Rollover Banner (If previous days exist) */}
      {uncompletedPreviousDays.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-3xl bg-amber-500/10 border border-amber-400/30 text-amber-200 backdrop-blur-md shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-subheading font-semibold text-amber-200">
                {uncompletedPreviousDays.length} unfinished spark{uncompletedPreviousDays.length > 1 ? "s" : ""} from previous days
              </div>
              <div className="text-xs font-subheading text-amber-300/80">
                Keep your momentum alive by rolling them over into today&apos;s orbit.
              </div>
            </div>
          </div>

          <button
            onClick={onCarryOverTasks}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-badge bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition active:scale-95 whitespace-nowrap"
          >
            <span>Carry Over to Today</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* 3. Action Bar: Filter & Add Task Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950/80 border border-amber-500/20 w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-badge transition ${
              filter === "all"
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-badge transition ${
              filter === "pending"
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-badge transition ${
              filter === "completed"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Done ({completedCount})
          </button>
        </div>

        {/* Add Spark Toggle */}
        <button
          onClick={() => setIsAddingOpen(!isAddingOpen)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-badge text-slate-950 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isAddingOpen ? "Close Spark Form" : "Ignite New Spark"}</span>
        </button>
      </div>

      {/* 4. Add Spark Modal / Inline Form */}
      <AnimatePresence>
        {isAddingOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl bg-slate-950/95 border border-amber-500/40 p-5 sm:p-6 shadow-[0_0_40px_rgba(245,158,11,0.15)] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-base font-heading text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Define Today&apos;s Non-Negotiable Spark
              </h3>
              <span className="text-xs font-badge text-amber-300 bg-amber-500/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                New Daily Focus
              </span>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-subheading text-slate-300 mb-1.5 uppercase tracking-wider">
                Spark Title / Objective
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Subhe Sadik reflection, 5 pages Amukhta revision, Next.js optimization..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 text-sm font-subheading focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition"
                autoFocus
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-subheading text-slate-300 mb-1.5 uppercase tracking-wider">
                Life Domain Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(Object.keys(CATEGORY_MAP) as GoalCategory[]).map((catKey) => {
                  const meta = CATEGORY_MAP[catKey];
                  const isSelected = category === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setCategory(catKey)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-subheading border transition ${
                        isSelected
                          ? `${meta.bgLight} ${meta.borderColor} ${meta.color} font-semibold ring-1 ring-amber-400/40`
                          : "bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${meta.dotColor}`} />
                      <span className="truncate">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority & Points Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-xs font-subheading text-slate-300 mb-1.5 uppercase tracking-wider">
                  Priority Weight
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPriority("high")}
                    className={`flex-1 py-2 rounded-xl text-xs font-badge border transition flex items-center justify-center gap-1.5 ${
                      priority === "high"
                        ? "bg-rose-500/20 border-rose-400/40 text-rose-300 font-bold"
                        : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    High Focus
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority("normal")}
                    className={`flex-1 py-2 rounded-xl text-xs font-badge border transition flex items-center justify-center gap-1.5 ${
                      priority === "normal"
                        ? "bg-amber-500/20 border-amber-400/40 text-amber-300 font-bold"
                        : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    ⚡ Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority("low")}
                    className={`flex-1 py-2 rounded-xl text-xs font-badge border transition flex items-center justify-center gap-1.5 ${
                      priority === "low"
                        ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 font-bold"
                        : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    🌿 Low
                  </button>
                </div>
              </div>

              {/* XP Value */}
              <div>
                <label className="block text-xs font-subheading text-slate-300 mb-1.5 uppercase tracking-wider">
                  Cosmic XP Bounty
                </label>
                <div className="flex gap-2">
                  {[10, 15, 20, 25].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setPoints(pts)}
                      className={`flex-1 py-2 rounded-xl text-xs font-badge border transition ${
                        points === pts
                          ? "bg-amber-500/20 border-amber-400/40 text-amber-300 font-bold"
                          : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      +{pts} XP
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Weekly Goal Link */}
            {weeklyGoals.length > 0 && (
              <div>
                <label className="block text-xs font-subheading text-slate-300 mb-1.5 uppercase tracking-wider">
                  Connect to Weekly Sprint Goal (Optional)
                </label>
                <select
                  value={linkedWeeklyGoalId}
                  onChange={(e) => setLinkedWeeklyGoalId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/15 text-slate-200 text-xs font-subheading focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- No weekly sprint link (standalone) --</option>
                  {weeklyGoals.map((w) => (
                    <option key={w.id} value={w.id}>
                      [{CATEGORY_MAP[w.category]?.label || w.category}] {w.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-subheading text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-badge text-slate-950 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,158,11,0.3)] transition active:scale-95"
              >
                Ignite Spark
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 5. Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="py-14 px-6 rounded-3xl bg-slate-950/70 border border-amber-500/20 text-center flex flex-col items-center justify-center space-y-3 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-base font-heading text-slate-300">
              {filter === "completed"
                ? "No completed sparks yet today."
                : filter === "pending"
                ? "All sparks are conquered! Glorious work."
                : "No sparks set for today."}
            </div>
            <p className="text-xs font-subheading text-slate-400 max-w-sm">
              Click &quot;Ignite New Spark&quot; above to add your non-negotiable commitments for today.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const catMeta = CATEGORY_MAP[task.category] || CATEGORY_MAP.other;
            const linkedWeekly = weeklyGoals.find((w) => w.id === task.linkedWeeklyGoalId);

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 ${
                  task.completed
                    ? "bg-slate-950/60 border-amber-500/10 text-slate-400 opacity-70"
                    : "bg-slate-950/80 border-amber-500/20 hover:border-amber-400/50 text-slate-100 shadow-md hover:shadow-[0_0_25px_rgba(245,158,11,0.1)]"
                }`}
              >
                {/* Checkbox & Content */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(task.id, task.completed)}
                    className="mt-0.5 sm:mt-0 flex-shrink-0 transition transform active:scale-90"
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-400/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition" />
                    )}
                  </button>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-badge px-2.5 py-0.5 rounded-full border ${catMeta.bgLight} ${catMeta.color} ${catMeta.borderColor}`}
                      >
                        {catMeta.label}
                      </span>

                      {task.priority === "high" && (
                        <span className="text-[10px] font-badge px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-400/30 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-400" />
                          High
                        </span>
                      )}

                      {task.isCarriedOver && (
                        <span className="text-[10px] font-badge px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <RotateCcw className="w-2.5 h-2.5" />
                          Carried Over
                        </span>
                      )}

                      {linkedWeekly && (
                        <span className="text-[10px] font-badge px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30 flex items-center gap-1 truncate max-w-[200px]">
                          <Layers className="w-2.5 h-2.5" />
                          {linkedWeekly.title}
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm sm:text-base font-subheading font-medium break-words leading-relaxed ${
                        task.completed ? "line-through text-slate-500" : "text-white"
                      }`}
                    >
                      {task.title}
                    </p>

                    {task.notes && (
                      <p className="text-xs text-slate-400 font-subheading italic">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: XP & Delete */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs font-badge px-2.5 py-1 rounded-xl border ${
                      task.completed
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border-amber-400/30"
                    }`}
                  >
                    +{task.points} XP
                  </span>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    aria-label="Delete spark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 6. Inspirational Cosmic Anchor Footer */}
      <div className="p-4 rounded-3xl bg-slate-950/60 border border-amber-500/20 text-center">
        <p className="text-xs text-amber-200/80 font-subheading italic">
          &ldquo;Never stray from the center reference point. Conquer the moment, and the cosmos will yield.&rdquo;
        </p>
      </div>
    </div>
  );
}
