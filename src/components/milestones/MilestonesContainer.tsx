"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  BookOpen,
  Layers,
  Orbit,
  Star,
  Compass,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import {
  MilestonePanelSection,
  TodaySparkGoal,
  DailyNoteEntry,
  WeeklySprintGoal,
  MonthlyOrbitGoal,
  YearlyHorizonGoal,
  MurakabaEntry,
} from "@/types/milestones";
import {
  MILESTONES_STORAGE_KEY_TODAY,
  MILESTONES_STORAGE_KEY_NOTES,
  MILESTONES_STORAGE_KEY_WEEKLY,
  MILESTONES_STORAGE_KEY_MONTHLY,
  MILESTONES_STORAGE_KEY_YEARLY,
  MILESTONES_STORAGE_KEY_MURAKABA,
  DEFAULT_TODAY_SPARKS,
  DEFAULT_DAILY_NOTE,
  DEFAULT_WEEKLY_SPRINTS,
  DEFAULT_MONTHLY_ORBITS,
  DEFAULT_YEARLY_HORIZONS,
  DEFAULT_MURAKABA_ENTRIES,
  getTodayDateKey,
} from "@/lib/milestoneData";
import { DailyHorizonDashboard } from "./tabs/DailyHorizonDashboard";
import { TodaySparksTab } from "./tabs/TodaySparksTab";
import { DailyNotesTab } from "./tabs/DailyNotesTab";
import { WeeklySprintsTab } from "./tabs/WeeklySprintsTab";
import { MonthlyOrbitsTab } from "./tabs/MonthlyOrbitsTab";
import { YearlyHorizonTab } from "./tabs/YearlyHorizonTab";
import { MurakabaReviewTab } from "./tabs/MurakabaReviewTab";
import { StarlightVaultTab } from "./tabs/StarlightVaultTab";

interface MenuItem {
  id: MilestonePanelSection;
  label: string;
  bengali: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export function MilestonesContainer() {
  const [activeSection, setActiveSection] = useState<MilestonePanelSection>("daily");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // States
  const [todayTasks, setTodayTasks] = useState<TodaySparkGoal[]>([]);
  const [dailyNote, setDailyNote] = useState<DailyNoteEntry>(DEFAULT_DAILY_NOTE);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklySprintGoal[]>([]);
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyOrbitGoal[]>([]);
  const [yearlyGoals, setYearlyGoals] = useState<YearlyHorizonGoal[]>([]);
  const [murakabaEntries, setMurakabaEntries] = useState<MurakabaEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load from localStorage
  useEffect(() => {
    try {
      const storedToday = localStorage.getItem(MILESTONES_STORAGE_KEY_TODAY);
      if (storedToday) {
        setTodayTasks(JSON.parse(storedToday));
      } else {
        setTodayTasks(DEFAULT_TODAY_SPARKS);
        localStorage.setItem(MILESTONES_STORAGE_KEY_TODAY, JSON.stringify(DEFAULT_TODAY_SPARKS));
      }

      const storedNotes = localStorage.getItem(MILESTONES_STORAGE_KEY_NOTES);
      if (storedNotes) {
        setDailyNote(JSON.parse(storedNotes));
      } else {
        setDailyNote(DEFAULT_DAILY_NOTE);
        localStorage.setItem(MILESTONES_STORAGE_KEY_NOTES, JSON.stringify(DEFAULT_DAILY_NOTE));
      }

      const storedWeekly = localStorage.getItem(MILESTONES_STORAGE_KEY_WEEKLY);
      if (storedWeekly) {
        setWeeklyGoals(JSON.parse(storedWeekly));
      } else {
        setWeeklyGoals(DEFAULT_WEEKLY_SPRINTS);
        localStorage.setItem(MILESTONES_STORAGE_KEY_WEEKLY, JSON.stringify(DEFAULT_WEEKLY_SPRINTS));
      }

      const storedMonthly = localStorage.getItem(MILESTONES_STORAGE_KEY_MONTHLY);
      if (storedMonthly) {
        setMonthlyGoals(JSON.parse(storedMonthly));
      } else {
        setMonthlyGoals(DEFAULT_MONTHLY_ORBITS);
        localStorage.setItem(MILESTONES_STORAGE_KEY_MONTHLY, JSON.stringify(DEFAULT_MONTHLY_ORBITS));
      }

      const storedYearly = localStorage.getItem(MILESTONES_STORAGE_KEY_YEARLY);
      if (storedYearly) {
        setYearlyGoals(JSON.parse(storedYearly));
      } else {
        setYearlyGoals(DEFAULT_YEARLY_HORIZONS);
        localStorage.setItem(MILESTONES_STORAGE_KEY_YEARLY, JSON.stringify(DEFAULT_YEARLY_HORIZONS));
      }

      const storedMura = localStorage.getItem(MILESTONES_STORAGE_KEY_MURAKABA);
      if (storedMura) {
        setMurakabaEntries(JSON.parse(storedMura));
      } else {
        setMurakabaEntries(DEFAULT_MURAKABA_ENTRIES);
        localStorage.setItem(MILESTONES_STORAGE_KEY_MURAKABA, JSON.stringify(DEFAULT_MURAKABA_ENTRIES));
      }
    } catch (e) {
      console.error("Error reading milestones storage:", e);
      setTodayTasks(DEFAULT_TODAY_SPARKS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Today sparks save helper
  const saveTodayTasks = (newTasks: TodaySparkGoal[]) => {
    setTodayTasks(newTasks);
    try {
      localStorage.setItem(MILESTONES_STORAGE_KEY_TODAY, JSON.stringify(newTasks));
    } catch (e) {
      console.error(e);
    }
  };

  // Add spark
  const handleAddTask = (taskData: Omit<TodaySparkGoal, "id" | "createdAt" | "dateKey">) => {
    const newTask: TodaySparkGoal = {
      ...taskData,
      id: `spark-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      dateKey: getTodayDateKey(),
    };
    saveTodayTasks([newTask, ...todayTasks]);
  };

  // Toggle spark
  const handleToggleTask = (id: string) => {
    const updated = todayTasks.map((t) => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? Date.now() : undefined,
        };
      }
      return t;
    });
    saveTodayTasks(updated);
  };

  // Delete spark
  const handleDeleteTask = (id: string) => {
    saveTodayTasks(todayTasks.filter((t) => t.id !== id));
  };

  // Carry over unfinished sparks
  const handleCarryOverTasks = () => {
    const todayKey = getTodayDateKey();
    const updated = todayTasks.map((t) => {
      if (!t.completed && t.dateKey < todayKey) {
        return {
          ...t,
          dateKey: todayKey,
          isCarriedOver: true,
        };
      }
      return t;
    });
    saveTodayTasks(updated);
  };

  // Save Daily Note
  const handleSaveNote = (updatedNote: DailyNoteEntry) => {
    setDailyNote(updatedNote);
    try {
      localStorage.setItem(MILESTONES_STORAGE_KEY_NOTES, JSON.stringify(updatedNote));
    } catch (e) {
      console.error(e);
    }
  };

  // Add Murakaba review
  const handleAddReview = (review: Omit<MurakabaEntry, "id" | "reviewedAt">) => {
    const newEntry: MurakabaEntry = {
      ...review,
      id: `mura-${Date.now()}`,
      reviewedAt: Date.now(),
    };
    const updated = [newEntry, ...murakabaEntries];
    setMurakabaEntries(updated);
    try {
      localStorage.setItem(MILESTONES_STORAGE_KEY_MURAKABA, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const pendingTodayCount = todayTasks.filter((t) => !t.completed).length;

  // Sidebar Menu Groupings
  const MENU_GROUPS: { groupTitle: string; items: MenuItem[] }[] = [
    {
      groupTitle: "Core Horizon Decks (মূল দিগন্ত ড্যাশবোর্ড)",
      items: [
        {
          id: "daily",
          label: "Daily Horizon",
          bengali: "দৈনিক ড্যাশবোর্ড ও স্পার্কস",
          icon: Flame,
          badge: pendingTodayCount > 0 ? `${pendingTodayCount} left` : "Done",
          badgeColor: pendingTodayCount > 0 ? "text-amber-300 bg-amber-500/20" : "text-emerald-300 bg-emerald-500/20",
        },
        {
          id: "daily_notes",
          label: "Daily Log & Notes",
          bengali: "আজকের বিশেষ নোট ও চিন্তা",
          icon: BookOpen,
        },
      ],
    },
    {
      groupTitle: "Celestial Horizons (ভবিষ্যতের রূপরেখা)",
      items: [
        {
          id: "weekly",
          label: "Weekly Sprints",
          bengali: "সাপ্তাহিক স্প্রিন্ট",
          icon: Layers,
          badge: `${weeklyGoals.length} Sprints`,
          badgeColor: "text-indigo-300 bg-indigo-500/15",
        },
        {
          id: "monthly",
          label: "Monthly Orbits",
          bengali: "মাসিক মাইলস্টোন",
          icon: Orbit,
        },
        {
          id: "yearly",
          label: "Yearly Pillars",
          bengali: "বাৎসরিক দিগন্ত",
          icon: Star,
        },
      ],
    },
    {
      groupTitle: "Sanctuary & Vault (আত্মশুদ্ধি ও হিস্টোরি)",
      items: [
        {
          id: "murakaba_review",
          label: "Weekly Murakaba",
          bengali: "সাপ্তাহিক পর্যালোচনা",
          icon: Compass,
        },
        {
          id: "starlight_vault",
          label: "Starlight Vault",
          bengali: "XP ও স্ট্রিক অ্যানালিটিক্স",
          icon: Award,
        },
      ],
    },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-mono text-xs">
        <span className="animate-pulse flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
          Synchronizing command center...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Mobile Top Toggle Bar */}
      <div className="lg:hidden mb-4 p-3 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <Flame className="w-4 h-4 text-cyan-400" />
          <span>Talha&apos;s Command Deck</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Main 2-Panel Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================
            LEFT PANEL: Command Deck Navigation
           ======================================================== */}
        <div
          className={`lg:col-span-4 xl:col-span-3 space-y-4 ${
            isMobileMenuOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="sticky top-20 rounded-3xl bg-slate-950/85 border border-cyan-500/20 p-4 sm:p-5 shadow-[0_0_40px_rgba(6,182,212,0.1)] backdrop-blur-2xl space-y-5">
            {/* User Profile & Momentum Header */}
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-badge text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>COMMAND DECK</span>
                </div>
                <h3 className="text-base font-heading text-white">Talha&apos;s Orbits</h3>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-badge">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>5d Streak</span>
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="space-y-5">
              {MENU_GROUPS.map((group, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="text-xs font-subheading uppercase tracking-wider text-slate-400 px-2">
                    {group.groupTitle}
                  </div>

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = activeSection === item.id;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full relative flex items-center justify-between p-2.5 px-3 rounded-2xl text-xs font-medium transition text-left group ${
                            isActive
                              ? "bg-gradient-to-r from-cyan-600/30 via-indigo-600/25 to-transparent text-white border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                          }`}
                        >
                          {/* Active Indicator Glow Bar */}
                          {isActive && (
                            <motion.div
                              layoutId="active-deck-glow"
                              className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
                            />
                          )}

                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 transition ${
                                isActive
                                  ? "text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                                  : "text-slate-500 group-hover:text-slate-300"
                              }`}
                            />
                            <div className="min-w-0">
                              <div className="font-subheading font-medium truncate">{item.label}</div>
                              <div className="text-[11px] font-bengali text-slate-400 truncate">
                                {item.bengali}
                              </div>
                            </div>
                          </div>

                          {item.badge && (
                            <span
                              className={`text-[10px] font-badge px-2 py-0.5 rounded-full border border-white/5 ${
                                item.badgeColor || "text-slate-400 bg-slate-900"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Anchor Quote */}
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-slate-400 italic leading-relaxed text-center font-subheading">
                &ldquo;Never stray from the center reference point. This anchor is your roots.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT PANEL: Dynamic Stage & Interactive Canvas
           ======================================================== */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Top Quick Horizon Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-xl overflow-x-auto scrollbar-none">
            {[
              { id: "daily", label: "☀️ Daily Horizon" },
              { id: "weekly", label: "🗓️ Weekly Sprints" },
              { id: "monthly", label: "🪐 Monthly Orbits" },
              { id: "yearly", label: "⭐ Yearly Pillars" },
              { id: "murakaba_review", label: "🧭 Murakaba Review" },
              { id: "starlight_vault", label: "🏆 Starlight Vault" },
            ].map((horizon) => {
              const isSelected =
                activeSection === horizon.id ||
                (horizon.id === "daily" && activeSection === "today_sparks") ||
                (horizon.id === "weekly" && activeSection === "weekly_sprints") ||
                (horizon.id === "monthly" && activeSection === "monthly_orbits") ||
                (horizon.id === "yearly" && activeSection === "yearly_horizon");

              return (
                <button
                  key={horizon.id}
                  onClick={() => setActiveSection(horizon.id as MilestonePanelSection)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-badge whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500/25 to-indigo-600/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{horizon.label}</span>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {(activeSection === "daily" || activeSection === "today_sparks") && (
                <DailyHorizonDashboard
                  tasks={todayTasks}
                  weeklyGoals={weeklyGoals}

                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onCarryOverTasks={handleCarryOverTasks}
                  dailyNote={dailyNote}
                  onSaveNote={handleSaveNote}
                  onNavigateToWeekly={() => setActiveSection("weekly")}
                />
              )}

              {activeSection === "daily_notes" && (
                <DailyNotesTab
                  note={dailyNote}
                  onSaveNote={handleSaveNote}
                />
              )}

              {(activeSection === "weekly" || activeSection === "weekly_sprints") && (
                <WeeklySprintsTab
                  weeklyGoals={weeklyGoals}

                  onNavigateToToday={() => setActiveSection("daily")}
                />
              )}

              {(activeSection === "monthly" || activeSection === "monthly_orbits") && (
                <MonthlyOrbitsTab monthlyGoals={monthlyGoals} />
              )}

              {(activeSection === "yearly" || activeSection === "yearly_horizon") && (
                <YearlyHorizonTab yearlyGoals={yearlyGoals} />
              )}

              {activeSection === "murakaba_review" && (
                <MurakabaReviewTab
                  entries={murakabaEntries}
                  onAddReview={handleAddReview}
                />
              )}

              {activeSection === "starlight_vault" && (
                <StarlightVaultTab
                  tasks={todayTasks}
                  weeklyGoals={weeklyGoals}

                  monthlyGoals={monthlyGoals}
                  yearlyGoals={yearlyGoals}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
