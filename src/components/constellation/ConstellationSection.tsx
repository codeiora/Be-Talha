"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Star,
  Plus,
  Trash2,
  Flame,
  CheckCircle2,
  Compass,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  ConstellationMilestone,
  ConstellationConnection,
  DailySparkTask,
} from "@/types/constellation";
import {
  DEFAULT_CONSTELLATION_MILESTONES,
  CONSTELLATION_CONNECTIONS,
  CONSTELLATION_STORAGE_KEY,
  DAILY_TASKS_STORAGE_KEY,
  playCosmicChime,
} from "@/lib/constellationData";
import { ConstellationSkyCanvas } from "./ConstellationSkyCanvas";
import { ConstellationMilestoneModal } from "./ConstellationMilestoneModal";
import { AddMilestoneModal } from "./AddMilestoneModal";

const DEFAULT_DAILY_TASKS: DailySparkTask[] = [
  {
    id: "task-1",
    title: "Subhe Sadik — Dawn Prayer & Sacred Reflection",
    points: 15,
    completed: true,
    createdAt: Date.now() - 3600000 * 4,
    linkedMilestoneId: "star-core",
  },
  {
    id: "task-2",
    title: "Returning to Roots — Quranic Contemplation",
    points: 10,
    completed: false,
    createdAt: Date.now() - 3600000 * 3,
    linkedMilestoneId: "star-root",
  },
  {
    id: "task-3",
    title: "Deep Work — Advanced System Architecture & Code Craft",
    points: 20,
    completed: false,
    createdAt: Date.now() - 3600000 * 2,
    linkedMilestoneId: "star-left-inner",
  },
  {
    id: "task-4",
    title: "Physical Mastery — Strength & Endurance Workout",
    points: 15,
    completed: false,
    createdAt: Date.now() - 3600000,
    linkedMilestoneId: "star-right-brace",
  },
];

type ActiveTab = "canvas" | "codex" | "daily";

export function ConstellationSection() {
  const [milestones, setMilestones] = useState<ConstellationMilestone[]>([]);
  const [connections, setConnections] = useState<ConstellationConnection[]>(
    CONSTELLATION_CONNECTIONS
  );
  const [dailyTasks, setDailyTasks] = useState<DailySparkTask[]>([]);
  const [newDailyTaskTitle, setNewDailyTaskTitle] = useState("");
  const [selectedPoints, setSelectedPoints] = useState<number>(10);

  const [activeTab, setActiveTab] = useState<ActiveTab>("canvas");
  const [selectedMilestone, setSelectedMilestone] =
    useState<ConstellationMilestone | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load from localStorage on mount
  useEffect(() => {
    try {
      const storedMilestones = localStorage.getItem(CONSTELLATION_STORAGE_KEY);
      if (storedMilestones) {
        setMilestones(JSON.parse(storedMilestones));
      } else {
        setMilestones(DEFAULT_CONSTELLATION_MILESTONES);
        localStorage.setItem(
          CONSTELLATION_STORAGE_KEY,
          JSON.stringify(DEFAULT_CONSTELLATION_MILESTONES)
        );
      }

      const storedDaily = localStorage.getItem(DAILY_TASKS_STORAGE_KEY);
      if (storedDaily) {
        setDailyTasks(JSON.parse(storedDaily));
      } else {
        setDailyTasks(DEFAULT_DAILY_TASKS);
        localStorage.setItem(
          DAILY_TASKS_STORAGE_KEY,
          JSON.stringify(DEFAULT_DAILY_TASKS)
        );
      }
    } catch (e) {
      console.error("Failed to load constellation data:", e);
      setMilestones(DEFAULT_CONSTELLATION_MILESTONES);
      setDailyTasks(DEFAULT_DAILY_TASKS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Save milestones to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        CONSTELLATION_STORAGE_KEY,
        JSON.stringify(milestones)
      );
    } catch (e) {
      console.error("Failed to save milestones:", e);
    }
  }, [milestones, isLoaded]);

  // 3. Save daily tasks to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        DAILY_TASKS_STORAGE_KEY,
        JSON.stringify(dailyTasks)
      );
    } catch (e) {
      console.error("Failed to save daily tasks:", e);
    }
  }, [dailyTasks, isLoaded]);

  // Milestone Calculations
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const totalMilestones = milestones.length;
  const wingExpansionPct =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  // Daily Score Calculations
  const dailyScore = dailyTasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + t.points, 0);
  const totalDailyScore = dailyTasks.reduce((acc, t) => acc + t.points, 0);

  // Toggle Milestone Star Ignition
  const handleToggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const willBeCompleted = !m.completed;

        if (willBeCompleted) {
          // Trigger celebration confetti
          confetti({
            particleCount: 42,
            spread: 80,
            origin: { y: 0.65 },
            colors: ["#38bdf8", "#fbbf24", "#fef08a", "#a855f7", "#34d399"],
            disableForReducedMotion: true,
          });
          if (soundEnabled) playCosmicChime(true);
        } else {
          if (soundEnabled) playCosmicChime(false);
        }

        const updated = {
          ...m,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? Date.now() : undefined,
        };

        if (selectedMilestone?.id === id) {
          setSelectedMilestone(updated);
        }

        return updated;
      })
    );
  };

  // Add custom milestone
  const handleAddMilestone = (newMilestone: ConstellationMilestone) => {
    setMilestones((prev) => [newMilestone, ...prev]);

    if (newMilestone.wingSection === "left-wing") {
      setConnections((prev) => [
        ...prev,
        { fromId: "star-left-inner", toId: newMilestone.id },
      ]);
    } else if (newMilestone.wingSection === "right-wing") {
      setConnections((prev) => [
        ...prev,
        { fromId: "star-right-inner", toId: newMilestone.id },
      ]);
    } else {
      setConnections((prev) => [
        ...prev,
        { fromId: "star-core", toId: newMilestone.id },
      ]);
    }

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#38bdf8", "#fbbf24"],
    });
  };

  // Delete custom milestone
  const handleDeleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    setConnections((prev) =>
      prev.filter((c) => c.fromId !== id && c.toId !== id)
    );
  };

  // Save notes for milestone
  const handleSaveMilestoneNotes = (id: string, notes: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, notes } : m))
    );
    if (selectedMilestone?.id === id) {
      setSelectedMilestone((prev) => (prev ? { ...prev, notes } : null));
    }
  };

  // Daily Tasks handlers
  const handleAddDailyTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDailyTaskTitle.trim()) return;

    const newTask: DailySparkTask = {
      id: "daily-" + Date.now(),
      title: newDailyTaskTitle.trim(),
      points: selectedPoints,
      completed: false,
      createdAt: Date.now(),
    };

    setDailyTasks((prev) => [newTask, ...prev]);
    setNewDailyTaskTitle("");
  };

  const handleToggleDailyTask = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      confetti({
        particleCount: 22,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#38bdf8", "#fbbf24", "#fef08a"],
      });
      if (soundEnabled) playCosmicChime(true);
    }
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteDailyTask = (id: string) => {
    setDailyTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Group milestones by wing section for Codex view
  const groupedMilestones = useMemo(() => {
    return {
      apex: milestones.filter((m) => m.wingSection === "apex"),
      leftWing: milestones.filter((m) => m.wingSection === "left-wing"),
      rightWing: milestones.filter((m) => m.wingSection === "right-wing"),
      anchor: milestones.filter((m) => m.wingSection === "anchor"),
    };
  }, [milestones]);

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 selection:bg-cyan-500/30">
      {/* 1. Header with Concept & Wing Expansion HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-badge tracking-wider uppercase text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Evolution of Goals • The Winged Morning Star</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-slate-100 font-medium">
            The Constellation
          </h2>

          <p className="text-sm sm:text-base text-slate-300 mt-2 font-subheading max-w-2xl leading-relaxed">
            <strong className="text-cyan-300 font-medium">Concept:</strong>{" "}
            Transcending limitations to radiate one&apos;s own singular light across the cosmos.
            Rather than ordinary checklists, long-term aspirations are plotted across a celestial canvas.
            Each major breakthrough ignites a new star, gradually weaving your personal constellation.
          </p>
        </div>

        {/* HUD Card: Wing Expansion & Star Radiance */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md shadow-xl shadow-cyan-950/40 self-start md:self-auto"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-400/40 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-300 fill-amber-300/40 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              Constellation Span
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-badge font-bold text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">
                {wingExpansionPct}%
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({completedMilestones}/{totalMilestones} Stars)
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("canvas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === "canvas"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-400/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Sky Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab("codex")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === "codex"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-400/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Milestone Codex</span>
          </button>

          <button
            onClick={() => setActiveTab("daily")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              activeTab === "daily"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-400/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Daily Sparks ({dailyScore}/{totalDailyScore} pts)</span>
          </button>
        </div>

        {/* Add New Milestone Trigger Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-sky-600/30 hover:from-cyan-500/30 hover:to-sky-600/40 border border-cyan-400/40 text-cyan-200 text-xs font-badge tracking-wider uppercase transition duration-200 shadow-lg shadow-cyan-950/50"
        >
          <Plus className="w-4 h-4 text-cyan-300" />
          <span>Add Milestone Star</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* 3.1 CANVAS MODE */}
      {activeTab === "canvas" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <ConstellationSkyCanvas
            milestones={milestones}
            connections={connections}
            selectedMilestoneId={selectedMilestone?.id || null}
            onSelectMilestone={(m) => {
              setSelectedMilestone(m);
              setIsMilestoneModalOpen(true);
            }}
            onToggleMilestone={handleToggleMilestone}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((v) => !v)}
          />

          {/* Quick Guide & Concept footer */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-950/60 border border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-75" />
              <span>
                Click stars to inspect details or ignite breakthroughs. Drag and scroll to explore the cosmos.
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-300" /> Ignited Star
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full border border-slate-500" />{" "}
                Dormant Star
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3.2 CODEX MODE: Grouped by Wing Structure */}
      {activeTab === "codex" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* APEX BEACON */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-300 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Beacon of Dawn • The Apex Shuktara</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {groupedMilestones.apex.map((m) => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  onSelect={() => {
                    setSelectedMilestone(m);
                    setIsMilestoneModalOpen(true);
                  }}
                  onToggle={() => handleToggleMilestone(m.id)}
                />
              ))}
            </div>
          </div>

          {/* TWO WINGS SIDE BY SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT WING: Mind, Intellect & Creation */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-300 mb-3">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Left Wing: Mind, Intellect & Creation</span>
              </div>
              <div className="space-y-3">
                {groupedMilestones.leftWing.map((m) => (
                  <MilestoneCard
                    key={m.id}
                    milestone={m}
                    onSelect={() => {
                      setSelectedMilestone(m);
                      setIsMilestoneModalOpen(true);
                    }}
                    onToggle={() => handleToggleMilestone(m.id)}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT WING: Discipline, Vitality & Character */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-300 mb-3">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Right Wing: Discipline, Vitality & Character</span>
              </div>
              <div className="space-y-3">
                {groupedMilestones.rightWing.map((m) => (
                  <MilestoneCard
                    key={m.id}
                    milestone={m}
                    onSelect={() => {
                      setSelectedMilestone(m);
                      setIsMilestoneModalOpen(true);
                    }}
                    onToggle={() => handleToggleMilestone(m.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ANCHOR & ROOTS */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400 mb-3">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>The Root Foundation • Ground & Reference Point</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupedMilestones.anchor.map((m) => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  onSelect={() => {
                    setSelectedMilestone(m);
                    setIsMilestoneModalOpen(true);
                  }}
                  onToggle={() => handleToggleMilestone(m.id)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 3.3 DAILY SPARK TASKS MODE */}
      {activeTab === "daily" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Daily Score Progress Bar */}
          <div className="mb-6 p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>
                  {dailyTasks.filter((t) => t.completed).length} / {dailyTasks.length} Daily
                  Sparks Achieved
                </span>
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                {dailyScore} / {totalDailyScore} pts
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    totalDailyScore > 0
                      ? Math.round((dailyScore / totalDailyScore) * 100)
                      : 0
                  }%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.7)]"
              />
            </div>
          </div>

          {/* Add Daily Task Input */}
          <form
            onSubmit={handleAddDailyTask}
            className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={newDailyTaskTitle}
                onChange={(e) => setNewDailyTaskTitle(e.target.value)}
                placeholder="Enter new daily spark task (e.g. Dawn prayer, 2 hours deep programming)..."
                className="flex-1 px-4 py-3 text-sm bg-slate-950/80 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60"
              />

              <div className="flex items-center gap-1.5 justify-center">
                {[5, 10, 15, 20].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setSelectedPoints(pts)}
                    className={`px-3 py-2 text-xs font-mono font-medium rounded-xl border transition ${
                      selectedPoints === pts
                        ? "bg-amber-500/20 text-amber-300 border-amber-400/50"
                        : "bg-slate-950/50 text-slate-400 border-white/5"
                    }`}
                  >
                    +{pts} pt
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!newDailyTaskTitle.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Ignite Spark</span>
              </button>
            </div>
          </form>

          {/* Task List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {dailyTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md transition-all ${
                    task.completed
                      ? "bg-slate-950/40 border-cyan-500/20"
                      : "bg-slate-900/50 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleDailyTask(task.id, task.completed)
                      }
                      className="p-1 focus:outline-none"
                    >
                      {task.completed ? (
                        <Star className="w-5 h-5 text-amber-300 fill-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      ) : (
                        <Star className="w-5 h-5 text-slate-500 hover:text-cyan-400 transition" />
                      )}
                    </button>

                    <span
                      onClick={() =>
                        handleToggleDailyTask(task.id, task.completed)
                      }
                      className={`text-sm sm:text-base cursor-pointer truncate ${
                        task.completed
                          ? "line-through text-slate-400 italic"
                          : "text-slate-100 group-hover:text-cyan-200"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
                        task.completed
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                          : "bg-slate-950/60 text-slate-400 border-white/5"
                      }`}
                    >
                      +{task.points} pts
                    </span>

                    <button
                      onClick={() => handleDeleteDailyTask(task.id)}
                      className="p-1.5 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {dailyTasks.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-slate-950/30 border border-dashed border-white/5 text-slate-500 text-xs font-mono">
                No daily tasks remaining. Ignite a new spark.
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 4. MODALS */}
      <ConstellationMilestoneModal
        milestone={selectedMilestone}
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        onToggleComplete={handleToggleMilestone}
        onSaveNotes={handleSaveMilestoneNotes}
        onDeleteMilestone={handleDeleteMilestone}
      />

      <AddMilestoneModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMilestone={handleAddMilestone}
      />
    </section>
  );
}

/**
 * Reusable Card component for Milestone Codex mode
 */
function MilestoneCard({
  milestone,
  onSelect,
  onToggle,
}: {
  milestone: ConstellationMilestone;
  onSelect: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group relative p-4.5 rounded-2xl border backdrop-blur-md cursor-pointer transition-all duration-200 ${
        milestone.completed
          ? "bg-slate-950/60 border-amber-500/30 shadow-lg shadow-amber-950/20"
          : "bg-slate-900/50 border-white/5 hover:border-cyan-500/30 hover:bg-slate-900/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {milestone.categoryLabel}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {milestone.targetHorizon}
            </span>
          </div>

          <h4
            className={`text-sm sm:text-base font-semibold transition ${
              milestone.completed
                ? "text-amber-200"
                : "text-slate-100 group-hover:text-cyan-200"
            }`}
          >
            {milestone.title}
          </h4>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {milestone.description}
          </p>
        </div>

        {/* Toggle Ignition Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`p-2 rounded-xl transition duration-200 ${
            milestone.completed
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "bg-slate-950/60 text-slate-500 hover:text-cyan-400 border border-white/5"
          }`}
          title={milestone.completed ? "Mark dormant" : "Ignite star"}
        >
          <Star
            className={`w-5 h-5 ${
              milestone.completed
                ? "fill-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
