"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
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
  Play,
  Anchor,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  Compass,
  Gauge,
  Zap,
  GripVertical,
  Settings,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  TodaySparkGoal,
  GoalCategory,
  PriorityLevel,
  CATEGORY_MAP,
  WeeklySprintGoal,
  SubTask,
} from "@/types/milestones";
import {
  playMilestoneChime,
  getTodayDateKey,
  getTaskDecayInfo,
  formatMinutes,
  getDailyCapacityStatus,
  BlueprintSparkItem,
  DEFAULT_DAILY_BLUEPRINT,
  MILESTONES_STORAGE_KEY_BLUEPRINT,
} from "@/lib/milestoneData";
import { DeepWorkOrbitModal } from "../modals/DeepWorkOrbitModal";
import { SupernovaRewardOverlay } from "../modals/SupernovaRewardOverlay";
import { ManageBlueprintModal } from "../modals/ManageBlueprintModal";

interface TodaySparksTabProps {
  tasks: TodaySparkGoal[];
  weeklyGoals: WeeklySprintGoal[];
  onAddTask: (task: Omit<TodaySparkGoal, "id" | "createdAt" | "dateKey">) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onCarryOverTasks: () => void;
  onUpdateTask?: (updatedTask: TodaySparkGoal) => void;
  onReorderTasks?: (newTasks: TodaySparkGoal[]) => void;
}

export function TodaySparksTab({
  tasks,
  weeklyGoals,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onCarryOverTasks,
  onUpdateTask,
  onReorderTasks,
}: TodaySparksTabProps) {
  // Input bar state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("deen");
  const [priority, setPriority] = useState<PriorityLevel>("high");
  const [points, setPoints] = useState<number>(15);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(25);
  const [linkedWeeklyGoalId, setLinkedWeeklyGoalId] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  // Blueprint routine state
  const [blueprint, setBlueprint] = useState<BlueprintSparkItem[]>(DEFAULT_DAILY_BLUEPRINT);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);

  // Subtask local inputs state (map of taskId -> string)
  const [subtaskInputs, setSubtaskInputs] = useState<Record<string, string>>({});
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});

  // Deep Work Focus Modal state
  const [focusTask, setFocusTask] = useState<TodaySparkGoal | null>(null);

  // Supernova Celebration state
  const [supernovaTask, setSupernovaTask] = useState<TodaySparkGoal | null>(null);
  const [supernovaPoints, setSupernovaPoints] = useState<number>(0);

  // Load custom blueprint from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(MILESTONES_STORAGE_KEY_BLUEPRINT);
      if (stored) {
        const parsed: BlueprintSparkItem[] = JSON.parse(stored);
        const LEGACY_MAP: Record<string, string> = {
          "ফজর সালাত, মাসনুন দুআ ও আত্মিক সূচনা": "Dawn Prayer, Sunnah Adhkar & Spiritual Grounding",
          "কুরআন মুখস্থ ও পুনরাবৃত্তি (সবক ও রিভিশন)": "Quran Memorization — Sabaq Recitation & Precision Revision",
          "সকালের প্রাতরাশ, গোসল ও ফ্রেশ হওয়া": "Morning Routine — Grooming, Shower & Wholesome Breakfast",
          "ডিপ ওয়ার্ক পর্ব ১ — কোর সিস্টেম ও কোডিং": "Deep Work Block 1 — Architecture & Core Systems Craft",
          "ডিপ ওয়ার্ক পর্ব ১ — কোর সিস্টেম ও কোডিং": "Deep Work Block 1 — Architecture & Core Systems Craft",
          "জোহর সালাত ও মধ্যাহ্ন বিরতি": "Dhuhr Prayer & Mindful Nourishment Break",
          "ব্যায়াম, হাঁটা অথবা শরীরচর্চা": "Physical Discipline — Calisthenics or Outdoor Run",
          "সান্ধ্যকালীন হিসেব-নিকেশ ও আত্মশুদ্ধি": "Evening Murakaba, Accountability & Soul Alignment",
        };
        const sanitized = parsed.map((bp) => ({
          ...bp,
          title: LEGACY_MAP[bp.title] || bp.title,
        }));
        setBlueprint(sanitized);
        localStorage.setItem(MILESTONES_STORAGE_KEY_BLUEPRINT, JSON.stringify(sanitized));
      } else {
        localStorage.setItem(MILESTONES_STORAGE_KEY_BLUEPRINT, JSON.stringify(DEFAULT_DAILY_BLUEPRINT));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveBlueprint = (updated: BlueprintSparkItem[]) => {
    setBlueprint(updated);
    try {
      localStorage.setItem(MILESTONES_STORAGE_KEY_BLUEPRINT, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // 1-Click Load Blueprint into Today's Tasks
  const handleLoadBlueprint = () => {
    const existingTitles = new Set(tasks.map((t) => t.title.toLowerCase().trim()));
    const itemsToAdd = blueprint.filter(
      (bp) => !existingTitles.has(bp.title.toLowerCase().trim())
    );

    if (itemsToAdd.length === 0) {
      alert("All routine blueprint habits are already active in today's orbit!");
      return;
    }

    itemsToAdd.forEach((bp) => {
      onAddTask({
        title: bp.title,
        category: bp.category,
        priority: bp.priority,
        points: bp.points,
        estimatedMinutes: bp.estimatedMinutes,
        completed: false,
        subtasks: [],
      });
    });

    playMilestoneChime(true);
    confetti({
      particleCount: 45,
      spread: 75,
      origin: { y: 0.7 },
      colors: ["#fbbf24", "#38bdf8", "#34d399", "#f43f5e"],
    });
  };

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

  // Calculate today's points earned
  const totalPointsEarned = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => {
      const decay = getTaskDecayInfo(t);
      return acc + (decay.effectivePoints || t.points || 0);
    }, 0);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Time & Capacity Planning calculations
  const totalPlannedMinutes = tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 25), 0);
  const completedPlannedMinutes = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes || 25), 0);
  const capacity = getDailyCapacityStatus(totalPlannedMinutes);

  // Add spark
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      points,
      estimatedMinutes,
      completed: false,
      linkedWeeklyGoalId: linkedWeeklyGoalId || undefined,
      subtasks: [],
    });

    setTitle("");
    setIsInputExpanded(false);
  };

  // Toggle completion with Supernova celebration on High-priority
  const handleToggle = (task: TodaySparkGoal, actualMin?: number) => {
    const currentStatus = task.completed;
    
    // If actual minutes passed from focus mode, update task
    if (actualMin && onUpdateTask && !currentStatus) {
      onUpdateTask({
        ...task,
        actualMinutes: actualMin,
        completed: true,
        completedAt: Date.now(),
      });
    } else {
      onToggleTask(task.id);
    }

    if (!currentStatus) {
      const decay = getTaskDecayInfo(task);
      const pointsToAward = decay.effectivePoints;

      if (task.priority === "high") {
        playMilestoneChime(true);
        setSupernovaTask(task);
        setSupernovaPoints(pointsToAward);
      } else {
        playMilestoneChime(true);
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.75 },
          colors: ["#fbbf24", "#f59e0b", "#38bdf8", "#34d399"],
        });
      }
    } else {
      playMilestoneChime(false);
    }
  };

  // Subtask handlers
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !onUpdateTask) return;
    const subtasks = task.subtasks || [];
    const updated = subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s));
    onUpdateTask({ ...task, subtasks: updated });
  };

  const handleAddSubtask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const subTitle = (subtaskInputs[taskId] || "").trim();
    if (!task || !subTitle || !onUpdateTask) return;

    const newSub: SubTask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: subTitle,
      completed: false,
    };
    const updated = [...(task.subtasks || []), newSub];
    onUpdateTask({ ...task, subtasks: updated });
    setSubtaskInputs((prev) => ({ ...prev, [taskId]: "" }));
  };

  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !onUpdateTask) return;
    const updated = (task.subtasks || []).filter((s) => s.id !== subtaskId);
    onUpdateTask({ ...task, subtasks: updated });
  };

  const toggleSubtaskExpand = (taskId: string) => {
    setExpandedSubtasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Helper to render structured 2-line task row: Line 1 for full title & actions, Line 2 for badges
  const renderTaskCardContent = (task: TodaySparkGoal, isDragEnabled: boolean = false) => {
    const catMeta = CATEGORY_MAP[task.category] || CATEGORY_MAP.other;
    const linkedWeekly = weeklyGoals.find((w) => w.id === task.linkedWeeklyGoalId);
    const decay = getTaskDecayInfo(task);
    const isSubtasksOpen = !!expandedSubtasks[task.id];
    const subtasks = task.subtasks || [];
    const completedSubCount = subtasks.filter((s) => s.completed).length;

    return (
      <div
        className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 px-3.5 py-3 sm:px-4 sm:py-3 space-y-1.5 ${
          task.completed
            ? "bg-slate-950/50 border-white/5 text-slate-400 opacity-65"
            : decay.isDecayed
            ? "bg-gradient-to-r from-purple-950/30 via-slate-950 to-slate-950/90 border-purple-500/40 shadow-[0_0_20px_rgba(147,51,234,0.18)] text-slate-100"
            : "bg-slate-950/80 border-amber-500/20 hover:border-amber-400/40 text-slate-100 shadow-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]"
        }`}
      >
        {/* Line 1: Grip + Checkbox + FULL TITLE + Right Actions */}
        <div className="flex items-start sm:items-center justify-between gap-3 min-w-0">
          {/* Left: Grip Handle + Checkbox + Full Title */}
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            {/* Drag Grip Handle */}
            {isDragEnabled && (
              <div
                className="mt-0.5 sm:mt-0 text-slate-600 group-hover:text-amber-400 cursor-grab active:cursor-grabbing transition flex-shrink-0"
                title="Drag to reorder"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            )}

            {/* Complete Checkbox */}
            <button
              onClick={() => handleToggle(task)}
              className="mt-0.5 sm:mt-0 flex-shrink-0 transition transform active:scale-90"
              aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
            >
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              ) : (
                <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-amber-400 transition" />
              )}
            </button>

            {/* Full Task Title - No aggressive truncate */}
            <p
              className={`text-xs sm:text-sm md:text-[15px] font-subheading font-medium leading-snug break-words flex-1 min-w-0 ${
                task.completed ? "line-through text-slate-500" : "text-white"
              }`}
            >
              {task.title}
            </p>
          </div>

          {/* Right Side Actions: Focus, XP, Subtask, Delete */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {!task.completed && (
              <button
                onClick={() => setFocusTask(task)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/35 hover:bg-amber-500/25 text-amber-300 text-xs font-badge transition shadow-sm active:scale-95"
                title={`Start Deep Work Focus (${task.estimatedMinutes || 25}m auto-synced)`}
              >
                <Play className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                <span className="text-[11px] font-semibold">Focus</span>
              </button>
            )}

            {/* XP Badge */}
            <span
              className={`text-xs font-badge font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border ${
                task.completed
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  : decay.isDecayed
                  ? "bg-purple-900/30 text-purple-200 border-purple-500/40 line-through-subtle"
                  : "bg-amber-500/15 text-amber-300 border-amber-400/30"
              }`}
              title={decay.isDecayed ? `Base XP: ${task.points}, Decayed XP: ${decay.effectivePoints}` : undefined}
            >
              +{decay.effectivePoints} XP
            </span>

            {/* Subtasks expand toggle */}
            <button
              onClick={() => toggleSubtaskExpand(task.id)}
              className={`p-1 sm:p-1.5 rounded-xl border transition ${
                isSubtasksOpen || subtasks.length > 0
                  ? "bg-slate-800 border-white/10 text-amber-300"
                  : "text-slate-500 hover:text-white border-transparent"
              }`}
              title="Toggle Sub-tasks"
            >
              <span className="text-[10px] font-badge mr-0.5">
                {subtasks.length > 0 ? `${completedSubCount}/${subtasks.length}` : "+"}
              </span>
              {isSubtasksOpen ? <ChevronUp className="w-3.5 h-3.5 inline" /> : <ChevronDown className="w-3.5 h-3.5 inline" />}
            </button>

            {/* Delete button */}
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1 sm:p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-60 group-hover:opacity-100"
              aria-label="Delete spark"
              title="Delete spark"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Line 2: Clean, Minimalist Metadata (Icons & Subtle Typography — No Bulky Pills) */}
        <div className="flex flex-wrap items-center gap-3 pl-6 sm:pl-7 text-xs">
          {/* Category: Clean colored dot + short name */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${catMeta.color}`}
            title={`Domain: ${catMeta.label}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${catMeta.dotColor || "bg-current"}`} />
            <span>{catMeta.label.split(" ")[0]}</span>
          </span>

          {/* Priority: Just the glowing flame icon with tooltip */}
          {task.priority === "high" && (
            <span
              className="inline-flex items-center text-rose-400 cursor-help"
              title="High Focus Priority"
            >
              <Flame className="w-3.5 h-3.5 fill-rose-400/20 text-rose-400 animate-pulse" />
            </span>
          )}

          {/* Estimated Duration: Clock icon + minutes */}
          <span
            className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400"
            title={`Estimated duration: ${task.estimatedMinutes || 25} minutes`}
          >
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{task.estimatedMinutes || 25}m</span>
          </span>

          {/* Carried Over: Just the icon with tooltip */}
          {task.isCarriedOver && !decay.isDecayed && (
            <span
              className="inline-flex items-center text-amber-400/80 cursor-help"
              title="Carried over from yesterday"
            >
              <RotateCcw className="w-3 h-3" />
            </span>
          )}

          {/* Blackhole Decay Alert: Compact icon + -50% */}
          {decay.isDecayed && !task.completed && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-400 cursor-help"
              title={`Pending ${decay.daysPending}+ days! Sinking into the blackhole — complete now to salvage XP.`}
            >
              <Compass className="w-3 h-3 text-purple-400 animate-spin-slow" />
              <span>-50% XP</span>
            </span>
          )}

          {/* Linked Weekly Sprint: Muted breadcrumb link (no heavy border) */}
          {linkedWeekly && (
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400/70 hover:text-slate-300 transition truncate max-w-[220px]"
              title={`Linked Sprint: ${linkedWeekly.title}`}
            >
              <Layers className="w-3 h-3 text-slate-500" />
              <span className="truncate">{linkedWeekly.title}</span>
            </span>
          )}
        </div>

        {/* Sub-tasks Expandable Section */}
        <AnimatePresence>
          {isSubtasksOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2.5 mt-2.5 border-t border-white/5 space-y-2 pl-6 sm:pl-9"
            >
              {/* Sub-tasks list */}
              {subtasks.length > 0 && (
                <div className="space-y-1">
                  {subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-white/5 hover:border-white/10 transition"
                    >
                      <button
                        onClick={() => handleToggleSubtask(task.id, sub.id)}
                        className="flex items-center gap-2 text-left flex-1 min-w-0"
                      >
                        {sub.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        )}
                        <span
                          className={`text-xs font-subheading truncate ${
                            sub.completed ? "line-through text-slate-500" : "text-slate-200"
                          }`}
                        >
                          {sub.title}
                        </span>
                      </button>

                      <button
                        onClick={() => handleDeleteSubtask(task.id, sub.id)}
                        className="p-0.5 text-slate-500 hover:text-rose-400 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new subtask input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={subtaskInputs[task.id] || ""}
                  onChange={(e) =>
                    setSubtaskInputs((prev) => ({ ...prev, [task.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubtask(task.id);
                    }
                  }}
                  placeholder="+ Add subtask (e.g. Part 1 done, review)..."
                  className="flex-1 px-3 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-subheading text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => handleAddSubtask(task.id)}
                  disabled={!(subtaskInputs[task.id] || "").trim()}
                  className="px-3 py-1 rounded-xl text-xs font-badge font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 disabled:opacity-40 transition"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================================
          1. CLEAN FLOATING HEADER & CAPACITY MONITOR
         ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-slate-950/80 border border-amber-500/25 shadow-[0_0_35px_rgba(245,158,11,0.08)] backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-badge tracking-wider bg-amber-500/15 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              DAILY SPARKS • THE ANCHOR
            </span>
            <span className="text-xs font-subheading text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading text-white tracking-wide">
            Today&apos;s Active Orbit
          </h1>
        </div>

        {/* Floating Minimal Today Metrics: XP, Tasks & Capacity Time */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* XP Badge */}
          <div className="px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-2 text-xs font-badge shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30 animate-pulse" />
            <span className="text-slate-300">Earned Today:</span>
            <span className="text-amber-300 font-bold">+{totalPointsEarned} XP</span>
          </div>

          {/* Tasks Count */}
          <div className="px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-2 text-xs font-badge shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300 font-bold">
              {completedCount}/{tasks.length} ({progressPercent}%)
            </span>
          </div>

          {/* Time Budget & Capacity Status Pill */}
          <div
            className={`px-3 py-1.5 rounded-2xl ${capacity.bgColor} border ${capacity.borderColor} flex items-center gap-2 text-xs font-badge shadow-sm`}
            title={capacity.description}
          >
            <Clock className={`w-3.5 h-3.5 ${capacity.badgeColor}`} />
            <span className="text-slate-300">Budget:</span>
            <span className={`${capacity.badgeColor} font-bold font-mono`}>
              {formatMinutes(completedPlannedMinutes)} / {formatMinutes(totalPlannedMinutes)}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${capacity.badgeColor} bg-slate-950/60 font-semibold border ${capacity.borderColor}`}>
              {capacity.label}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          CAPACITY OVERLOAD ALERT (PREVENT BURNOUT)
         ======================================================== */}
      {capacity.status === "overload" && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-3xl bg-rose-500/15 border border-rose-400/40 text-rose-200 backdrop-blur-md shadow-lg"
        >
          <div className="p-2 rounded-2xl bg-rose-500/20 text-rose-300 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-subheading font-bold text-rose-200 flex items-center gap-2">
              <span>⚠️ Energy Capacity Alert — High Overload Risk ({formatMinutes(totalPlannedMinutes)})</span>
            </div>
            <p className="text-xs font-subheading text-rose-200/90 leading-relaxed">
              Your planned focus time exceeds healthy daily cognitive capacity (8+ hours). Consider deferring secondary sparks to tomorrow or weekly sprints to prevent burnout.
            </p>
          </div>
        </motion.div>
      )}

      {/* ========================================================
          2. UNFINISHED TASKS ROLLOVER & DECAY NOTICE
         ======================================================== */}
      {uncompletedPreviousDays.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-3xl bg-amber-500/10 border border-amber-400/30 text-amber-200 backdrop-blur-md shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300">
              <RotateCcw className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="text-sm font-subheading font-semibold text-amber-200">
                {uncompletedPreviousDays.length} unfinished spark{uncompletedPreviousDays.length > 1 ? "s" : ""} from previous days
              </div>
              <div className="text-xs font-subheading text-amber-300/80">
                Roll them into today&apos;s orbit to keep your streak alive. Sparks pending 3+ days begin Blackhole Decay.
              </div>
            </div>
          </div>

          <button
            onClick={onCarryOverTasks}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-badge font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition active:scale-95 whitespace-nowrap"
          >
            <span>Carry Over to Today</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* ========================================================
          3. TASK INPUT BAR WITH 1-CLICK BLUEPRINT LOADER
         ======================================================== */}
      <div className="rounded-3xl bg-slate-950/90 border border-amber-500/30 p-4 sm:p-5 shadow-[0_0_30px_rgba(245,158,11,0.1)] backdrop-blur-xl space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setIsInputExpanded(true)}
                placeholder="Enter new spark or focus objective (e.g. 10 pages Amukhta, Tazkiyah check)..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 text-sm font-subheading focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                type="submit"
                disabled={!title.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-badge font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,158,11,0.3)] transition active:scale-95 whitespace-nowrap flex-1 sm:flex-initial"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Ignite Spark</span>
              </button>

              {/* 1-Click Load Routine Blueprint Button */}
              <button
                type="button"
                onClick={handleLoadBlueprint}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl text-xs font-badge font-semibold text-amber-200 bg-amber-500/15 border border-amber-400/30 hover:bg-amber-500/25 shadow-sm transition active:scale-95 whitespace-nowrap"
                title="Load routine habits (Prayer, Quran, Workout, Study) in one click"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span className="hidden sm:inline">Load Routine</span>
                <span className="sm:hidden">Routine</span>
              </button>

              {/* Edit Blueprint Settings Button */}
              <button
                type="button"
                onClick={() => setIsBlueprintModalOpen(true)}
                className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-amber-400/40 transition"
                title="Manage routine habits blueprint"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Config Row (Category pills with Tazkiyah, Priority, Time Duration, Points) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Category Selector with Tazkiyah */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-badge text-slate-400 uppercase mr-1">Category:</span>
              {(["deen", "intellect", "body", "tazkiyah", "other"] as GoalCategory[]).map((catKey) => {
                const meta = CATEGORY_MAP[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-subheading border transition flex items-center gap-1.5 ${
                      isSelected
                        ? `${meta.bgLight} ${meta.borderColor} ${meta.color} font-semibold ring-1 ring-amber-400/40`
                        : "bg-slate-900/80 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
                    <span>{meta.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Duration, Priority & Points Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Estimated Time Selector (First Planning) */}
              <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5 text-xs font-mono">
                <span className="px-2 text-[10px] text-cyan-400 font-badge flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Time:
                </span>
                {[15, 25, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setEstimatedMinutes(mins)}
                    className={`px-2 py-1 rounded-lg transition ${
                      estimatedMinutes === mins
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* Priority */}
              <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5 text-xs font-badge">
                <button
                  type="button"
                  onClick={() => setPriority("high")}
                  className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                    priority === "high"
                      ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-400/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>High</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("normal")}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    priority === "normal"
                      ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Normal
                </button>
              </div>

              {/* Points */}
              <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5 text-xs font-badge">
                {[10, 15, 20, 25].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setPoints(pts)}
                    className={`px-2 py-1 rounded-lg transition ${
                      points === pts
                        ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    +{pts}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Linked Weekly Sprint Selector (shown when input expanded) */}
          {isInputExpanded && weeklyGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-2 border-t border-white/5"
            >
              <label className="block text-[11px] font-subheading text-slate-400 mb-1">
                Link to Weekly Sprint Goal (Optional):
              </label>
              <select
                value={linkedWeeklyGoalId}
                onChange={(e) => setLinkedWeeklyGoalId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-subheading text-slate-300 focus:outline-none focus:border-amber-400"
              >
                <option value="">-- Standalone spark (no sprint link) --</option>
                {weeklyGoals.map((w) => (
                  <option key={w.id} value={w.id}>
                    [{CATEGORY_MAP[w.category]?.label || w.category}] {w.title}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </form>
      </div>

      {/* ========================================================
          4. FILTER TABS & DRAG NOTICE
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

        <div className="text-xs font-subheading text-slate-400 flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-amber-400/80" />
          <span>Drag &amp; drop cards to reorder your daily sequence</span>
        </div>
      </div>

      {/* ========================================================
          5. ACTIVE ORBIT: REORDERABLE TASK LIST (DRAG & DROP)
         ======================================================== */}
      {filteredTasks.length === 0 ? (
        <div className="py-14 px-6 rounded-3xl bg-slate-950/70 border border-amber-500/20 text-center flex flex-col items-center justify-center space-y-3 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-base font-heading text-slate-300">
            {filter === "completed"
              ? "No sparks completed yet today."
              : filter === "pending"
              ? "All sparks completed! Glorious momentum!"
              : "No sparks planned for today."}
          </div>
          <p className="text-xs font-subheading text-slate-400 max-w-sm">
            Click &quot;Load Routine&quot; above to seed your daily habits with one tap.
          </p>
        </div>
      ) : filter === "all" ? (
        /* Full Reorderable Drag & Drop List when in 'all' view */
        <Reorder.Group
          axis="y"
          values={tasks}
          onReorder={(newOrder) => {
            if (onReorderTasks) onReorderTasks(newOrder);
          }}
          className="space-y-2"
        >
          {tasks.map((task) => (
            <Reorder.Item
              key={task.id}
              value={task}
              className="cursor-default select-none"
            >
              {renderTaskCardContent(task, true)}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        /* Filtered view list (Pending or Completed) */
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div key={task.id}>
              {renderTaskCardContent(task, false)}
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          6. INSPIRATIONAL ANCHOR FOOTER
         ======================================================== */}
      <div className="p-4 rounded-3xl bg-slate-950/60 border border-amber-500/20 text-center">
        <p className="text-xs text-amber-200/80 font-subheading italic">
          &ldquo;Never stray from the center reference point. Conquer the moment, and the cosmos will yield.&rdquo;
        </p>
      </div>

      {/* ========================================================
          7. MODALS: DEEP WORK ORBIT, SUPERNOVA & BLUEPRINT
         ======================================================== */}
      {focusTask && (
        <DeepWorkOrbitModal
          task={focusTask}
          isOpen={!!focusTask}
          onClose={() => setFocusTask(null)}
          onCompleteTask={(taskId, actualMin) => {
            const t = tasks.find((item) => item.id === taskId);
            if (t) handleToggle(t, actualMin);
          }}
          onToggleSubtask={handleToggleSubtask}
          onAddSubtask={handleAddSubtask}
        />
      )}

      {supernovaTask && (
        <SupernovaRewardOverlay
          task={supernovaTask}
          pointsAwarded={supernovaPoints}
          onClose={() => setSupernovaTask(null)}
        />
      )}

      <ManageBlueprintModal
        isOpen={isBlueprintModalOpen}
        onClose={() => setIsBlueprintModalOpen(false)}
        blueprint={blueprint}
        onSaveBlueprint={handleSaveBlueprint}
      />
    </div>
  );
}
