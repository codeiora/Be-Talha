"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Layers,
  Star,
  ShieldCheck,
  Award,
  BookOpen,
  Filter,
  Heart,
  Save,
  Compass,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  TodaySparkGoal,
  WeeklySprintGoal,
  DailyNoteEntry,
  GoalCategory,
  PriorityLevel,
  CATEGORY_MAP,
} from "@/types/milestones";
import { playMilestoneChime, getTodayDateKey } from "@/lib/milestoneData";

interface DailyHorizonDashboardProps {
  tasks: TodaySparkGoal[];
  weeklyGoals: WeeklySprintGoal[];
  dailyNote: DailyNoteEntry;
  onAddTask: (task: Omit<TodaySparkGoal, "id" | "createdAt" | "dateKey">) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onCarryOverTasks: () => void;
  onSaveNote: (updated: DailyNoteEntry) => void;
  onNavigateToWeekly?: () => void;
  onNavigateToDaily?: () => void;
}

export function DailyHorizonDashboard({
  tasks,
  weeklyGoals,
  dailyNote,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onCarryOverTasks,
  onSaveNote,
  onNavigateToWeekly,
  onNavigateToDaily,
}: DailyHorizonDashboardProps) {
  // Input states for new spark
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<GoalCategory>("deen");
  const [newPriority, setNewPriority] = useState<PriorityLevel>("high");
  const [newPoints, setNewPoints] = useState<number>(15);
  const [linkedWeeklyId, setLinkedWeeklyId] = useState<string>("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState<"all" | "pending" | "completed">("all");

  // Chart view toggle state: 'flow' = today's energy curve, 'velocity' = 7-day spark trend
  const [chartMode, setChartMode] = useState<"flow" | "velocity" | "monthly" | "yearly">("flow");

  // Mini Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Note Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteFocus, setNoteFocus] = useState(dailyNote.coreFocus || "");
  const [noteAyah, setNoteAyah] = useState(dailyNote.ayahReminder || "");
  const [noteThoughts, setNoteThoughts] = useState(dailyNote.thoughts || "");
  const [noteShukr, setNoteShukr] = useState(dailyNote.shukr || "");
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  const todayKey = getTodayDateKey();
  const uncompletedPreviousDays = tasks.filter(
    (t) => !t.completed && t.dateKey && t.dateKey < todayKey
  );

  // Statistics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalPointsEarned = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.points || 0), 0);
  const totalPossiblePoints = tasks.reduce((sum, t) => sum + (t.points || 0), 0);

  // Greeting based on current local hour
  const currentHour = new Date().getHours();
  let greeting = "Subhe Sadik & Dawn Focus, Talha! 🌅";
  if (currentHour >= 11 && currentHour < 16) {
    greeting = "High Noon Momentum, Talha! ☀️";
  } else if (currentHour >= 16 && currentHour < 20) {
    greeting = "Subhe Asr & Serene Momentum, Talha! 🌇";
  } else if (currentHour >= 20 || currentHour < 4) {
    greeting = "Subhe Maghrib & Night Contemplation, Talha! 🌙";
  }

  // Handle task submission
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      points: newPoints,
      estimatedMinutes: 25,
      completed: false,
      linkedWeeklyGoalId: linkedWeeklyId || undefined,
    });

    setNewTitle("");
    setIsQuickAddOpen(false);
  };

  // Toggle completion with chime and confetti
  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleTask(id);
    if (!currentlyCompleted) {
      playMilestoneChime(true);
      confetti({
        particleCount: 28,
        spread: 55,
        origin: { y: 0.75 },
        colors: ["#38bdf8", "#818cf8", "#f59e0b", "#34d399"],
      });
    }
  };

  // Save Note helper
  const handleSaveDailyNote = () => {
    onSaveNote({
      ...dailyNote,
      dateKey: todayKey,
      coreFocus: noteFocus,
      ayahReminder: noteAyah,
      thoughts: noteThoughts,
      shukr: noteShukr,
      updatedAt: Date.now(),
    });
    setIsNoteSaved(true);
    setTimeout(() => {
      setIsNoteSaved(false);
      setIsNoteModalOpen(false);
    }, 1200);
  };

  // Filter tasks list
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === "pending") return !t.completed;
    if (taskFilter === "completed") return t.completed;
    return true;
  });

  // Calendar generation helpers
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7; // Monday = 0
  const todayDate = new Date().getDate();
  const isCurrentMonthView =
    calendarMonth === new Date().getMonth() && calendarYear === new Date().getFullYear();

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================================
          1. GREETING & HEADER BAR
         ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-950/70 border border-amber-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(245,158,11,0.1),0_12px_32px_rgba(2,6,23,0.8)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-badge tracking-wider bg-amber-500/15 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              DAILY HORIZON COMMAND
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
          <h1 className="text-2xl sm:text-3xl font-heading text-white tracking-wide">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm font-subheading text-slate-300">
            Let&apos;s direct today&apos;s energy with disciplined intentionality and spiritual clarity.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigateToDaily && (
            <button
              onClick={onNavigateToDaily}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-badge hover:bg-amber-500/25 transition active:scale-95"
              title="Go to dedicated Daily Tasks deck"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Daily Tasks</span>
            </button>
          )}

          {uncompletedPreviousDays.length > 0 && (
            <button
              onClick={onCarryOverTasks}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-badge hover:bg-amber-500/25 transition active:scale-95"
              title="Carry forward unfinished sparks from yesterday"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Carry Over ({uncompletedPreviousDays.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-badge hover:text-white hover:border-amber-400/30 transition active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Daily Note</span>
          </button>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-badge text-xs font-bold transition shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Add Spark</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. TOP 4 TACTILE STATS CARDS (Structured Glanceability)
         ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sparks Completed */}
        <div className="relative overflow-hidden p-4 rounded-3xl bg-slate-950/80 border border-amber-500/20 backdrop-blur-xl shadow-lg hover:border-amber-400/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-subheading uppercase tracking-wider text-slate-400">
              Sparks Done
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-badge text-white tracking-wide">
              {completedTasks}
              <span className="text-lg text-slate-500 font-subheading"> / {totalTasks}</span>
            </span>
            <span className="text-xs font-badge text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {completionRate}%
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            />
          </div>
        </div>

        {/* Card 2: Deep Work & Cosmic XP */}
        <div className="relative overflow-hidden p-4 rounded-3xl bg-slate-950/80 border border-amber-500/20 backdrop-blur-xl shadow-lg hover:border-amber-400/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-subheading uppercase tracking-wider text-slate-400">
              Cosmic XP
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Star className="w-4 h-4 fill-amber-400/30 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-badge text-white tracking-wide">
              {totalPointsEarned}
              <span className="text-base text-slate-500 font-subheading"> XP</span>
            </span>
            <span className="text-xs font-badge text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              /{totalPossiblePoints} max
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-subheading">
            Focus &amp; Spiritual Energy generated
          </p>
        </div>

        {/* Card 3: Linked Sprints In Progress */}
        <div className="relative overflow-hidden p-4 rounded-3xl bg-slate-950/80 border border-indigo-500/20 backdrop-blur-xl shadow-lg hover:border-indigo-400/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-subheading uppercase tracking-wider text-slate-400">
              Weekly Links
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-badge text-white tracking-wide">
              {weeklyGoals.length}
            </span>
            <span className="text-xs text-indigo-300 font-badge">Active Sprints</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-subheading">
            Cascading into higher horizons
          </p>
        </div>

        {/* Card 4: Daily Momentum Streak */}
        <div className="relative overflow-hidden p-4 rounded-3xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-xl shadow-lg hover:border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.1)] transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-subheading uppercase tracking-wider text-slate-400">
              Momentum Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-badge text-white tracking-wide">5 Days</span>
            <span className="text-xs font-badge text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Unbroken ⭐
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-subheading">
            Steady discipline builds sacred gravity
          </p>
        </div>
      </div>

      {/* ========================================================
          3. MIDDLE ROW (2:1 Grid: Curve Graph & Mini Calendar)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================== LEFT: Smooth Bezier Curve Chart (8 cols) ================== */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-amber-500/20 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-heading text-white tracking-wide">
                  Productivity &amp; Energy Velocity
                </h3>
              </div>
              <p className="text-xs font-subheading text-slate-400 mt-0.5">
                {chartMode === "flow"
                  ? "Today's dynamic focus rhythm across dawn, noon, afternoon & night"
                  : chartMode === "velocity"
                  ? "7-Day velocity of completed sparks and consistency"
                  : chartMode === "monthly"
                  ? "Monthly trajectory across 4 strategic weekly sprint cycles"
                  : "Annual horizon velocity across 4 macro quarters"}
              </p>
            </div>

            {/* Mode Switcher: Flow, 7-Day, Monthly, Yearly */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-white/10 text-xs font-badge flex-wrap gap-1">
              <button
                onClick={() => setChartMode("flow")}
                className={`px-2.5 sm:px-3 py-1 rounded-xl transition ${
                  chartMode === "flow"
                    ? "bg-amber-500 text-slate-950 font-badge font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Today&apos;s Flow
              </button>
              <button
                onClick={() => setChartMode("velocity")}
                className={`px-2.5 sm:px-3 py-1 rounded-xl transition ${
                  chartMode === "velocity"
                    ? "bg-cyan-500 text-slate-950 font-badge font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                7-Day
              </button>
              <button
                onClick={() => setChartMode("monthly")}
                className={`px-2.5 sm:px-3 py-1 rounded-xl transition ${
                  chartMode === "monthly"
                    ? "bg-emerald-500 text-slate-950 font-badge font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly Orbit
              </button>
              <button
                onClick={() => setChartMode("yearly")}
                className={`px-2.5 sm:px-3 py-1 rounded-xl transition ${
                  chartMode === "yearly"
                    ? "bg-purple-500 text-slate-950 font-badge font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Yearly Pillars
              </button>
            </div>
          </div>

          {/* Interactive SVG Chart Container with Contained Labels */}
          <div className="relative pt-2 w-full flex flex-col justify-between">
            {/* Top Encouraging Speech Bubble Pill */}
            <div className="flex justify-end mb-2 pr-2">
              <div
                className={`px-3 py-1 rounded-full border text-[11px] font-subheading flex items-center gap-1.5 transition-all ${
                  chartMode === "flow"
                    ? "bg-amber-500/15 border-amber-400/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                    : chartMode === "velocity"
                    ? "bg-cyan-500/15 border-cyan-400/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : chartMode === "monthly"
                    ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                    : "bg-purple-500/15 border-purple-400/30 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                }`}
              >
                <span>
                  {chartMode === "flow" && "Great rhythm, Talha! 🎯"}
                  {chartMode === "velocity" && "5d Streak Maintained! 🔥"}
                  {chartMode === "monthly" && "Monthly Velocity: 84% 🚀"}
                  {chartMode === "yearly" && "Pillars Ascending! 🌟"}
                </span>
              </div>
            </div>

            {/* SVG Chart Graphic - explicit height wrapper */}
            <div className="relative w-full h-40 sm:h-44">
              <svg viewBox="0 0 600 150" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveGradientGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#eab308" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="curveGradientCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#0284c7" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="curveGradientEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#059669" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="curveGradientPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Grid Lines */}
                <line x1="20" y1="25" x2="580" y2="25" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="20" y1="65" x2="580" y2="65" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="20" y1="105" x2="580" y2="105" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                {/* Mode 1: Today's Flow */}
                {chartMode === "flow" && (
                  <>
                    <path
                      d="M 40 120 Q 140 25, 220 60 T 380 35 T 560 55 L 560 145 L 40 145 Z"
                      fill="url(#curveGradientGold)"
                    />
                    <path
                      d="M 40 120 Q 140 25, 220 60 T 380 35 T 560 55"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3.5"
                      filter="url(#glowEffect)"
                    />
                    <circle cx="40" cy="120" r="5" fill="#f59e0b" stroke="#02040a" strokeWidth="2" />
                    <circle cx="140" cy="45" r="6" fill="#fbbf24" stroke="#02040a" strokeWidth="2" />
                    <circle cx="220" cy="60" r="5.5" fill="#818cf8" stroke="#02040a" strokeWidth="2" />
                    <circle cx="380" cy="35" r="7" fill="#38bdf8" stroke="#02040a" strokeWidth="2" />
                    <circle cx="560" cy="55" r="6" fill="#a855f7" stroke="#02040a" strokeWidth="2" />
                  </>
                )}

                {/* Mode 2: 7-Day Velocity */}
                {chartMode === "velocity" && (
                  <>
                    <path
                      d="M 40 115 C 100 95, 160 50, 230 65 S 340 30, 410 40 S 500 20, 560 25 L 560 145 L 40 145 Z"
                      fill="url(#curveGradientCyan)"
                    />
                    <path
                      d="M 40 115 C 100 95, 160 50, 230 65 S 340 30, 410 40 S 500 20, 560 25"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      filter="url(#glowEffect)"
                    />
                    <circle cx="40" cy="115" r="5" fill="#38bdf8" stroke="#02040a" strokeWidth="2" />
                    <circle cx="120" cy="95" r="5" fill="#38bdf8" stroke="#02040a" strokeWidth="2" />
                    <circle cx="200" cy="60" r="5" fill="#818cf8" stroke="#02040a" strokeWidth="2" />
                    <circle cx="280" cy="55" r="5" fill="#818cf8" stroke="#02040a" strokeWidth="2" />
                    <circle cx="370" cy="30" r="6" fill="#fbbf24" stroke="#02040a" strokeWidth="2" />
                    <circle cx="460" cy="40" r="5" fill="#a855f7" stroke="#02040a" strokeWidth="2" />
                    <circle cx="560" cy="25" r="7" fill="#38bdf8" stroke="#02040a" strokeWidth="2" />
                  </>
                )}

                {/* Mode 3: Monthly Orbit */}
                {chartMode === "monthly" && (
                  <>
                    <path
                      d="M 40 100 C 120 70, 160 40, 220 45 S 330 25, 400 30 S 500 18, 560 20 L 560 145 L 40 145 Z"
                      fill="url(#curveGradientEmerald)"
                    />
                    <path
                      d="M 40 100 C 120 70, 160 40, 220 45 S 330 25, 400 30 S 500 18, 560 20"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      filter="url(#glowEffect)"
                    />
                    <circle cx="40" cy="100" r="5.5" fill="#10b981" stroke="#02040a" strokeWidth="2" />
                    <circle cx="220" cy="45" r="6" fill="#34d399" stroke="#02040a" strokeWidth="2" />
                    <circle cx="400" cy="30" r="6.5" fill="#6ee7b7" stroke="#02040a" strokeWidth="2" />
                    <circle cx="560" cy="20" r="7" fill="#10b981" stroke="#02040a" strokeWidth="2" />
                  </>
                )}

                {/* Mode 4: Yearly Pillars */}
                {chartMode === "yearly" && (
                  <>
                    <path
                      d="M 40 120 C 120 85, 160 60, 230 65 S 330 35, 400 38 S 490 18, 560 20 L 560 145 L 40 145 Z"
                      fill="url(#curveGradientPurple)"
                    />
                    <path
                      d="M 40 120 C 120 85, 160 60, 230 65 S 330 35, 400 38 S 490 18, 560 20"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="3.5"
                      filter="url(#glowEffect)"
                    />
                    <circle cx="40" cy="120" r="5.5" fill="#a855f7" stroke="#02040a" strokeWidth="2" />
                    <circle cx="230" cy="65" r="6" fill="#c084fc" stroke="#02040a" strokeWidth="2" />
                    <circle cx="400" cy="38" r="6.5" fill="#e879f9" stroke="#02040a" strokeWidth="2" />
                    <circle cx="560" cy="20" r="7" fill="#c084fc" stroke="#02040a" strokeWidth="2" />
                  </>
                )}
              </svg>
            </div>

            {/* X-Axis Labels - Cleanly contained inside the card with border-t */}
            <div className="flex justify-between items-center px-3 sm:px-4 pt-3 pb-1 text-[11px] sm:text-xs font-subheading text-slate-400 border-t border-white/5 mt-2">
              {chartMode === "flow" && (
                <>
                  <span className="text-center">Fajr<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> (Dawn)</span></span>
                  <span className="text-center">Dhuhr<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> (Noon)</span></span>
                  <span className="text-center">Asr<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> (Afternoon)</span></span>
                  <span className="text-center">Maghrib<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> &amp; Isha</span></span>
                  <span className="text-center">Qiyam<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> (Night)</span></span>
                </>
              )}
              {chartMode === "velocity" && (
                <>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span className="text-cyan-300 font-semibold">Sun (Today)</span>
                </>
              )}
              {chartMode === "monthly" && (
                <>
                  <span className="text-center">Week 01<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> (Seed)</span></span>
                  <span className="text-center">Week 02<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> (Sprint)</span></span>
                  <span className="text-center">Week 03<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> (Momentum)</span></span>
                  <span className="text-center text-emerald-300 font-semibold">Week 04<br className="sm:hidden" /><span className="text-[10px] text-emerald-400/80 sm:inline sm:text-emerald-300"> (Harvest)</span></span>
                </>
              )}
              {chartMode === "yearly" && (
                <>
                  <span className="text-center">Q1<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> Foundations</span></span>
                  <span className="text-center">Q2<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> Expansion</span></span>
                  <span className="text-center">Q3<br className="sm:hidden" /><span className="text-[10px] text-slate-500 sm:inline sm:text-slate-400"> Mastery</span></span>
                  <span className="text-center text-purple-300 font-semibold">Q4<br className="sm:hidden" /><span className="text-[10px] text-purple-400/80 sm:inline sm:text-purple-300"> Horizon</span></span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================== RIGHT: Mini Calendar & Routine Anchor (4 cols) ================== */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-950/80 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-4">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-badge text-white">
                {monthNames[calendarMonth]} {calendarYear}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (calendarMonth === 0) {
                    setCalendarMonth(11);
                    setCalendarYear(calendarYear - 1);
                  } else {
                    setCalendarMonth(calendarMonth - 1);
                  }
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (calendarMonth === 11) {
                    setCalendarMonth(0);
                    setCalendarYear(calendarYear + 1);
                  } else {
                    setCalendarMonth(calendarMonth + 1);
                  }
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-badge">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
              <span key={idx} className="text-slate-400 py-1">
                {day}
              </span>
            ))}

            {/* Empty slots for first week offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <span key={`empty-${idx}`} className="py-1 text-slate-800 text-xs">
                -
              </span>
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isToday = isCurrentMonthView && dayNum === todayDate;

              return (
                <div
                  key={dayNum}
                  className={`py-1 rounded-xl text-xs font-badge transition cursor-pointer flex items-center justify-center ${
                    isToday
                      ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-105 font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>

          {/* Today's Sacred Anchors & Reminders */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="text-[11px] font-subheading uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Upcoming Today</span>
              <span className="text-amber-400 font-badge">Fixed Anchors</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-slate-200 font-subheading">Subhe Sadik &amp; Hifz Amukhta</span>
                </div>
                <span className="text-xs font-badge text-amber-300">Dawn</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="text-slate-200 font-subheading">Deep Work Architecture Block</span>
                </div>
                <span className="text-xs font-badge text-indigo-300">10:00 AM</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-slate-200 font-subheading">Murakaba Review &amp; Sleep Anchor</span>
                </div>
                <span className="text-xs font-badge text-amber-300">09:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. BOTTOM ROW (Action Grid: Sprints + Top Tasks + Nasiha)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================== COLUMN 1: Cascading Weekly Sprints (4 cols) ================== */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-950/80 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-heading text-white">Active Weekly Sprints</h3>
            </div>
            {onNavigateToWeekly && (
              <button
                onClick={onNavigateToWeekly}
                className="text-xs font-badge text-indigo-300 hover:text-white flex items-center gap-1 transition"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {weeklyGoals.map((sprint) => {
              const meta = CATEGORY_MAP[sprint.category] || CATEGORY_MAP.other;
              return (
                <div
                  key={sprint.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 hover:border-indigo-400/30 transition space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-subheading font-medium text-slate-200 group-hover:text-white transition line-clamp-1">
                      {sprint.title}
                    </span>
                    <span
                      className={`text-[10px] font-badge px-2 py-0.5 rounded-full border flex-shrink-0 ${meta.bgLight} ${meta.color} ${meta.borderColor}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-subheading text-slate-400">
                      <span>Progress</span>
                      <span className="font-badge text-slate-200">{sprint.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${sprint.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {weeklyGoals.length === 0 && (
              <p className="text-xs font-subheading text-slate-500 italic py-4 text-center">
                No active sprints in orbit. Visit the Weekly Deck to deploy one.
              </p>
            )}
          </div>
        </div>

        {/* ================== COLUMN 2: Priority Sparks Checklist (5 cols) ================== */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-950/80 border border-amber-500/20 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-heading text-white">Today&apos;s Priority Sparks</h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {onNavigateToDaily && (
                <button
                  onClick={onNavigateToDaily}
                  className="text-xs font-badge text-amber-300 hover:text-white flex items-center gap-1 transition"
                  title="Go to full Daily Sparks task deck"
                >
                  <span>Open Daily Tasks</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}

              {/* Filter pills */}
            <div className="flex items-center gap-1 text-[11px] font-badge p-0.5 rounded-xl bg-slate-900 border border-white/10">
              <button
                onClick={() => setTaskFilter("all")}
                className={`px-2.5 py-0.5 rounded-lg transition ${
                  taskFilter === "all" ? "bg-amber-500 text-slate-950 font-badge font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setTaskFilter("pending")}
                className={`px-2.5 py-0.5 rounded-lg transition ${
                  taskFilter === "pending" ? "bg-amber-500 text-slate-950 font-badge font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                Pending ({pendingTasks})
              </button>
              <button
                onClick={() => setTaskFilter("completed")}
                className={`px-2.5 py-0.5 rounded-lg transition ${
                  taskFilter === "completed" ? "bg-amber-500 text-slate-950 font-badge font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                Done ({completedTasks})
              </button>
            </div>
            </div>
          </div>

          {/* Quick Add Form / Toggle */}
          {isQuickAddOpen ? (
            <form
              onSubmit={handleCreateTask}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-400/40 space-y-3 shadow-lg"
            >
              <input
                type="text"
                autoFocus
                placeholder="What is your immediate focus spark?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs font-subheading text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
              />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-subheading text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-subheading text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="deen">Deen &amp; Hifz</option>
                    <option value="intellect">Intellect &amp; Craft</option>
                    <option value="body">Body &amp; Armor</option>
                    <option value="tazkiyah">Tazkiyah &amp; Soul</option>
                    <option value="other">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-subheading text-slate-400 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-subheading text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="high">High Priority</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-subheading text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-badge text-xs shadow-md transition active:scale-95"
                >
                  Ignite Spark
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="w-full py-2.5 rounded-2xl border border-dashed border-amber-500/40 text-amber-400 hover:border-amber-400 hover:bg-amber-500/10 text-xs font-badge flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add Spark for Today</span>
            </button>
          )}

          {/* Tasks List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredTasks.map((task) => {
              const meta = CATEGORY_MAP[task.category] || CATEGORY_MAP.other;
              return (
                <div
                  key={task.id}
                  className={`group flex items-start justify-between gap-3 p-3 rounded-2xl border transition ${
                    task.completed
                      ? "bg-slate-900/40 border-white/5 opacity-60"
                      : "bg-slate-900/80 border-white/10 hover:border-amber-400/30"
                  }`}
                >
                  <button
                    onClick={() => handleToggle(task.id, task.completed)}
                    className="mt-0.5 text-slate-400 hover:text-amber-400 transition flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 hover:border-cyan-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-1">
                    <span
                      className={`text-xs block leading-relaxed font-subheading transition ${
                        task.completed
                          ? "line-through text-slate-500"
                          : "text-slate-200 group-hover:text-white"
                      }`}
                    >
                      {task.title}
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-badge px-2 py-0.5 rounded-full border ${meta.bgLight} ${meta.color} ${meta.borderColor}`}
                      >
                        {meta.label}
                      </span>

                      {task.priority === "high" && (
                        <span className="text-[10px] font-badge px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-400/30">
                          High
                        </span>
                      )}

                      <span className="text-[10px] font-badge text-slate-400">
                        +{task.points || 15} XP
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <p className="text-xs font-subheading text-slate-500 italic py-6 text-center">
                No sparks found under this filter.
              </p>
            )}
          </div>
        </div>

        {/* ================== COLUMN 3: Sacred Anchor & Nasiha (3 cols) ================== */}
        <div className="lg:col-span-3 space-y-4">
          {/* Affirmation / Encouragement Card */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-purple-950/70 to-slate-950/80 border border-indigo-400/30 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-badge tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
                SACRED AFFIRMATION
              </span>
              <span className="text-base">🌱</span>
            </div>

            <h4 className="text-base font-heading text-white leading-snug">
              You&apos;re doing amazing, Talha! 💜
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-subheading">
              &ldquo;Small, consistent deeds build unshakeable mountains. Keep steady discipline and preserve your inner peace.&rdquo;
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-badge text-indigo-300">
              <span>Consistent &bull; Calm &bull; Pure</span>
              <span>100% Intention</span>
            </div>
          </div>

          {/* Daily Note Snippet Card */}
          <div className="p-4 rounded-3xl bg-slate-950/80 border border-violet-500/20 backdrop-blur-xl shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-badge tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                The Cosmic Mirror Note
              </span>
              <div className="flex items-center gap-2">
                {dailyNote.stateOfHeart && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono">
                    {dailyNote.stateOfHeart === "full_moon" && "🌕 Full Moon"}
                    {dailyNote.stateOfHeart === "clear_sky" && "🌌 Clear Sky"}
                    {dailyNote.stateOfHeart === "eclipse" && "🌑 Eclipse"}
                    {dailyNote.stateOfHeart === "nebula" && "🌪️ Nebula"}
                  </span>
                )}
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="text-xs font-badge text-cyan-400 hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-badge text-amber-400 uppercase flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>North Star Focus:</span>
              </div>
              <p className="text-xs font-subheading text-slate-200 line-clamp-3 leading-relaxed">
                {dailyNote.coreFocus || "No core focus logged for today yet."}
              </p>
            </div>

            {dailyNote.shukrParticles && dailyNote.shukrParticles.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300/90 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{dailyNote.shukrParticles.length} Shukr Light Particles in Vault</span>
              </div>
            )}

            {dailyNote.ayahReminder && (
              <div className="pt-2 border-t border-white/5 space-y-1">
                <div className="text-[11px] font-badge text-amber-400 uppercase">Ayah Anchor:</div>
                <p className="text-xs font-subheading text-slate-300 italic line-clamp-3 leading-relaxed">
                  {dailyNote.ayahReminder}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          5. DAILY NOTE MODAL
         ======================================================== */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-heading text-white">Daily Contemplation &amp; Anchor</h3>
                </div>
                <button
                  onClick={() => setIsNoteModalOpen(false)}
                  className="text-xs font-badge text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-subheading uppercase text-slate-400 block mb-1">
                    Today&apos;s Core Focus
                  </label>
                  <input
                    type="text"
                    value={noteFocus}
                    onChange={(e) => setNoteFocus(e.target.value)}
                    placeholder="E.g., Subhe Sadik discipline without distraction..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-subheading text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-subheading uppercase text-slate-400 block mb-1">
                    Sacred Ayah / Hadith Reminder
                  </label>
                  <textarea
                    rows={2}
                    value={noteAyah}
                    onChange={(e) => setNoteAyah(e.target.value)}
                    placeholder="Ayah or sacred reminder that guides today..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-subheading text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-subheading uppercase text-slate-400 block mb-1">
                    Daily Shukr (Gratitude)
                  </label>
                  <input
                    type="text"
                    value={noteShukr}
                    onChange={(e) => setNoteShukr(e.target.value)}
                    placeholder="Alhamdulillah for..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-subheading text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-subheading text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDailyNote}
                  className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-badge text-xs transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isNoteSaved ? "Saved!" : "Save Anchor"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
