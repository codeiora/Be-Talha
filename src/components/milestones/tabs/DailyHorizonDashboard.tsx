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
  const [chartMode, setChartMode] = useState<"flow" | "velocity">("flow");

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-xl shadow-[0_12px_32px_rgba(2,6,23,0.6)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-badge tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-badge hover:text-white hover:border-cyan-400/30 transition active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Daily Note</span>
          </button>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-badge text-xs transition shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95"
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
        <div className="relative overflow-hidden p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-xl shadow-lg hover:border-cyan-400/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-subheading uppercase tracking-wider text-slate-400">
              Sparks Done
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-badge text-white tracking-wide">
              {completedTasks}
              <span className="text-lg text-slate-500 font-subheading"> / {totalTasks}</span>
            </span>
            <span className="text-xs font-badge text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {completionRate}%
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
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
        <div className="relative overflow-hidden p-4 rounded-3xl bg-slate-950/80 border border-emerald-500/20 backdrop-blur-xl shadow-lg hover:border-emerald-400/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-subheading uppercase tracking-wider text-slate-400">
              Momentum Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-badge text-white tracking-wide">5 Days</span>
            <span className="text-xs font-badge text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Unbroken 🔥
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
        <div className="lg:col-span-8 p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-heading text-white tracking-wide">
                  Productivity &amp; Energy Velocity
                </h3>
              </div>
              <p className="text-xs font-subheading text-slate-400">
                {chartMode === "flow"
                  ? "Today's dynamic focus rhythm across dawn, noon, afternoon & night"
                  : "7-Day velocity of completed sparks and consistency"}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-white/10 text-xs font-badge">
              <button
                onClick={() => setChartMode("flow")}
                className={`px-3 py-1 rounded-xl transition ${
                  chartMode === "flow"
                    ? "bg-cyan-500 text-slate-950 font-badge shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Today&apos;s Flow
              </button>
              <button
                onClick={() => setChartMode("velocity")}
                className={`px-3 py-1 rounded-xl transition ${
                  chartMode === "velocity"
                    ? "bg-cyan-500 text-slate-950 font-badge shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                7-Day Velocity
              </button>
            </div>
          </div>

          {/* Interactive SVG Chart Container */}
          <div className="relative pt-4 pb-2 w-full h-[220px]">
            {/* Encouraging Speech Bubble Pill */}
            <div className="absolute top-2 right-12 z-10 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-subheading shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-1.5 animate-bounce">
              <span>Great rhythm, Talha! 🎯</span>
            </div>

            <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Grid Lines */}
              <line x1="20" y1="30" x2="580" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="20" y1="80" x2="580" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="20" y1="130" x2="580" y2="130" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Data Curves based on Mode */}
              {chartMode === "flow" ? (
                <>
                  {/* Filled Area */}
                  <path
                    d="M 40 140 Q 140 30, 220 70 T 380 40 T 560 65 L 560 160 L 40 160 Z"
                    fill="url(#curveGradient)"
                  />
                  {/* Stroke Line */}
                  <path
                    d="M 40 140 Q 140 30, 220 70 T 380 40 T 560 65"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3.5"
                    filter="url(#glowEffect)"
                  />
                  {/* Interactive Nodes */}
                  <circle cx="40" cy="140" r="5" fill="#38bdf8" stroke="#02040a" strokeWidth="2" />
                  <circle cx="140" cy="50" r="6" fill="#22d3ee" stroke="#02040a" strokeWidth="2" />
                  <circle cx="220" cy="70" r="5.5" fill="#818cf8" stroke="#02040a" strokeWidth="2" />
                  <circle cx="380" cy="40" r="7" fill="#38bdf8" stroke="#02040a" strokeWidth="2" />
                  <circle cx="560" cy="65" r="6" fill="#a855f7" stroke="#02040a" strokeWidth="2" />
                </>
              ) : (
                <>
                  {/* 7-Day Velocity Curve */}
                  <path
                    d="M 40 130 C 120 110, 180 60, 260 75 S 380 30, 460 50 S 530 25, 560 35 L 560 160 L 40 160 Z"
                    fill="url(#curveGradient)"
                  />
                  <path
                    d="M 40 130 C 120 110, 180 60, 260 75 S 380 30, 460 50 S 530 25, 560 35"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    filter="url(#glowEffect)"
                  />
                  {/* Nodes */}
                  <circle cx="40" cy="130" r="5" fill="#38bdf8" stroke="#02040a" strokeWidth="2" />
                  <circle cx="120" cy="110" r="5" fill="#38bdf8" stroke="#02040a" strokeWidth="2" />
                  <circle cx="200" cy="70" r="5" fill="#818cf8" stroke="#02040a" strokeWidth="2" />
                  <circle cx="280" cy="65" r="5" fill="#818cf8" stroke="#02040a" strokeWidth="2" />
                  <circle cx="370" cy="35" r="6" fill="#22d3ee" stroke="#02040a" strokeWidth="2" />
                  <circle cx="460" cy="50" r="5" fill="#a855f7" stroke="#02040a" strokeWidth="2" />
                  <circle cx="560" cy="35" r="7" fill="#38bdf8" stroke="#02040a" strokeWidth="2" />
                </>
              )}
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-6 text-xs font-subheading text-slate-400 mt-1">
              {chartMode === "flow" ? (
                <>
                  <span>Fajr (Dawn)</span>
                  <span>Dhuhr (Midday)</span>
                  <span>Asr (Afternoon)</span>
                  <span>Maghrib &amp; Isha</span>
                  <span>Night Qiyam</span>
                </>
              ) : (
                <>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun (Today)</span>
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
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-105"
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
              <span className="text-cyan-400 font-badge">Fixed Anchors</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-slate-200 font-subheading">Subhe Sadik &amp; Hifz Amukhta</span>
                </div>
                <span className="text-xs font-badge text-cyan-300">Dawn</span>
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
        <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-heading text-white">Today&apos;s Priority Sparks</h3>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 text-[11px] font-badge p-0.5 rounded-xl bg-slate-900 border border-white/10">
              <button
                onClick={() => setTaskFilter("all")}
                className={`px-2.5 py-0.5 rounded-lg transition ${
                  taskFilter === "all" ? "bg-cyan-500 text-slate-950 font-badge" : "text-slate-400 hover:text-white"
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setTaskFilter("pending")}
                className={`px-2.5 py-0.5 rounded-lg transition ${
                  taskFilter === "pending" ? "bg-cyan-500 text-slate-950 font-badge" : "text-slate-400 hover:text-white"
                }`}
              >
                Pending ({pendingTasks})
              </button>
              <button
                onClick={() => setTaskFilter("completed")}
                className={`px-2.5 py-0.5 rounded-lg transition ${
                  taskFilter === "completed" ? "bg-cyan-500 text-slate-950 font-badge" : "text-slate-400 hover:text-white"
                }`}
              >
                Done ({completedTasks})
              </button>
            </div>
          </div>

          {/* Quick Add Form / Toggle */}
          {isQuickAddOpen ? (
            <form
              onSubmit={handleCreateTask}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-400/40 space-y-3 shadow-lg"
            >
              <input
                type="text"
                autoFocus
                placeholder="What is your immediate focus spark?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs font-subheading text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-subheading text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-subheading text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="deen">Deen &amp; Hifz</option>
                    <option value="intellect">Intellect &amp; Craft</option>
                    <option value="body">Body &amp; Armor</option>
                    <option value="crucible">Crucible</option>
                    <option value="other">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-subheading text-slate-400 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-subheading text-slate-200 focus:outline-none focus:border-cyan-400"
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
              className="w-full py-2.5 rounded-2xl border border-dashed border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/5 text-xs font-badge flex items-center justify-center gap-1.5 transition"
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
                      : "bg-slate-900/80 border-white/10 hover:border-cyan-400/30"
                  }`}
                >
                  <button
                    onClick={() => handleToggle(task.id, task.completed)}
                    className="mt-0.5 text-slate-400 hover:text-cyan-400 transition flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
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
            <p className="text-xs text-slate-300 leading-relaxed font-subheading font-bengali">
              &ldquo;ছোট ছোট নিয়মিত আমলই পাহাড় গড়ে তোলে। Keep steady discipline and don&apos;t forget your inner peace.&rdquo;
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
                Today&apos;s Anchor Note
              </span>
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="text-xs font-badge text-cyan-400 hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-badge text-cyan-400 uppercase">Core Focus:</div>
              <p className="text-xs font-subheading text-slate-200 line-clamp-3 leading-relaxed">
                {dailyNote.coreFocus || "No core focus logged for today yet."}
              </p>
            </div>

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
              className="w-full max-w-lg p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 shadow-2xl space-y-4"
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
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-subheading text-white focus:outline-none focus:border-cyan-400"
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
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-subheading text-white focus:outline-none focus:border-cyan-400 resize-none"
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
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-subheading text-white focus:outline-none focus:border-cyan-400"
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
