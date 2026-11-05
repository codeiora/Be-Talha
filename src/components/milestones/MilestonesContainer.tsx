"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Anchor,
  Compass,
  Star,
  Sparkles,
  BookOpen,
  Layers,
  Orbit,
  Telescope,
  Eye,
  Trophy,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Flame,
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
import { DivineConstellationTab } from "./tabs/DivineConstellationTab";

interface MenuItem {
  id: MilestonePanelSection;
  label: string;
  bengali: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export function MilestonesContainer() {
  const [activeSection, setActiveSection] = useState<MilestonePanelSection>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

      const storedCollapsed = localStorage.getItem("milestones_left_panel_collapsed");
      if (storedCollapsed !== null) {
        setIsCollapsed(storedCollapsed === "true");
      }
    } catch (e) {
      console.error("Error reading milestones storage:", e);
      setTodayTasks(DEFAULT_TODAY_SPARKS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Collapse toggle helper
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("milestones_left_panel_collapsed", String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

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

  // Sidebar Menu Groupings (The Anchor, The Horizon, The Crucible, Divine Constellation)
  const MENU_GROUPS: { groupTitle: string; items: MenuItem[] }[] = [
    {
      groupTitle: "The Anchor",
      items: [
        {
          id: "overview",
          label: "Horizon Overview",
          bengali: "মহাজাগতিক ওভারভিউ ও ডেক",
          icon: LayoutDashboard,
        },
        {
          id: "daily",
          label: "Daily Sparks",
          bengali: "দৈনিক কর্মযজ্ঞ ও স্পার্কস",
          icon: Flame,
          badge: pendingTodayCount > 0 ? `${pendingTodayCount} left` : "Done",
          badgeColor: pendingTodayCount > 0 ? "text-amber-300 bg-amber-500/20 border border-amber-400/30" : "text-emerald-300 bg-emerald-500/20 border border-emerald-400/30",
        },
        {
          id: "daily_notes",
          label: "Daily Log & Notes",
          bengali: "আজকের বিশেষ চিন্তা ও নোট",
          icon: BookOpen,
        },
      ],
    },
    {
      groupTitle: "The Horizon",
      items: [
        {
          id: "weekly",
          label: "Weekly Sprints",
          bengali: "সাপ্তাহিক স্প্রিন্ট ও ফোকাস",
          icon: Layers,
          badge: `${weeklyGoals.length} Sprints`,
          badgeColor: "text-amber-300 bg-amber-500/15 border border-amber-400/30",
        },
        {
          id: "monthly",
          label: "Monthly Orbits",
          bengali: "মাসিক মাইলস্টোন ও আবর্তন",
          icon: Orbit,
        },
        {
          id: "yearly",
          label: "Yearly Pillars",
          bengali: "বাৎসরিক স্তম্ভ ও দূরদৃষ্টি",
          icon: Telescope,
        },
      ],
    },
    {
      groupTitle: "The Crucible",
      items: [
        {
          id: "murakaba_review",
          label: "Weekly Murakaba",
          bengali: "সাপ্তাহিক মোরাকাবা ও পর্যালোচনা",
          icon: Eye,
        },
        {
          id: "starlight_vault",
          label: "Starlight Vault",
          bengali: "XP, স্ট্রিক ও হিস্টোরি",
          icon: Trophy,
        },
      ],
    },
    {
      groupTitle: "Divine Constellation",
      items: [
        {
          id: "divine_constellation",
          label: "Hifz & Quran Orbit",
          bengali: "কুরআন হিফজ ও ৫টি স্তম্ভ",
          icon: Sparkles,
          badge: "114 Surahs",
          badgeColor: "text-amber-300 bg-amber-500/25 border border-amber-400/40",
        },
      ],
    },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-amber-300/60 font-mono text-xs">
        <span className="animate-pulse flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" />
          Synchronizing celestial command center...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Mobile Top Toggle Bar */}
      <div className="lg:hidden mb-4 p-3 rounded-2xl bg-slate-950/95 border border-amber-500/25 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <Anchor className="w-4 h-4 text-amber-400" />
          <span className="text-amber-200">Talha&apos;s Command Deck</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-xl bg-white/5 border border-amber-500/20 text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4 text-amber-400" /> : <Menu className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Main 2-Panel Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ========================================================
            LEFT PANEL: Command Deck Navigation (Gold & Obsidian)
           ======================================================== */}
        <div
          className={`transition-[width] duration-300 ease-in-out w-full flex-shrink-0 space-y-4 ${
            isCollapsed ? "lg:w-20" : "lg:w-80 xl:w-96"
          } ${isMobileMenuOpen ? "block" : "hidden lg:block"}`}
        >
          <div
            className={`sticky top-20 z-20 rounded-3xl bg-slate-950/90 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12),0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 ${
              isCollapsed ? "p-3 sm:p-3 lg:space-y-4 space-y-5" : "p-4 sm:p-5 space-y-5"
            }`}
          >
            {/* User Profile & Momentum Header */}
            {isCollapsed ? (
              <div className="pb-3 border-b border-amber-500/20">
                {/* Collapsed Desktop View */}
                <div className="hidden lg:flex flex-col items-center gap-2.5">
                  <button
                    type="button"
                    onClick={toggleCollapse}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-300 bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition group"
                    title="Expand sidebar (সাইডবার বড় করুন)"
                    aria-label="Expand sidebar"
                  >
                    <PanelLeftOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </button>
                  <div
                    className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 cursor-default"
                    title="5d Streak Active"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-300 animate-pulse" />
                  </div>
                </div>

                {/* Mobile View if opened when collapsed */}
                <div className="flex lg:hidden items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-badge text-amber-400/90 flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-amber-400" />
                      <span>COMMAND DECK</span>
                    </div>
                    <h3 className="text-base font-heading text-white">Talha&apos;s Roots</h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/15 text-amber-300 border border-amber-400/40 text-xs font-badge shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse" />
                    <span>5d Streak</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pb-4 border-b border-amber-500/20 flex items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-badge text-amber-400/90 flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate">COMMAND DECK</span>
                  </div>
                  <h3 className="text-base font-heading text-white truncate">Talha&apos;s Roots</h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* 3D Golden Star Streak Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/15 text-amber-300 border border-amber-400/40 text-xs font-badge shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse" />
                    <span>5d Streak</span>
                  </div>

                  {/* Collapse Toggle Button (Visible on lg+) */}
                  <button
                    type="button"
                    onClick={toggleCollapse}
                    className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-400/40 transition group"
                    title="Collapse sidebar (সাইডবার ছোট করুন)"
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Groups */}
            <div className={isCollapsed ? "lg:space-y-3 space-y-5" : "space-y-5"}>
              {MENU_GROUPS.map((group, idx) => (
                <div key={idx} className="space-y-1.5">
                  {/* Group Title (hidden on collapsed desktop) */}
                  <div
                    className={`text-xs font-subheading uppercase tracking-wider text-amber-400/80 px-2 font-semibold ${
                      isCollapsed ? "lg:hidden" : "block"
                    }`}
                  >
                    {group.groupTitle}
                  </div>

                  {/* Group Divider on collapsed desktop */}
                  {isCollapsed && idx > 0 && (
                    <div className="hidden lg:block my-2 border-t border-amber-500/20 mx-1" />
                  )}

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive =
                        activeSection === item.id ||
                        (item.id === "daily" && activeSection === "today_sparks") ||
                        (item.id === "weekly" && activeSection === "weekly_sprints") ||
                        (item.id === "monthly" && activeSection === "monthly_orbits") ||
                        (item.id === "yearly" && activeSection === "yearly_horizon");
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveSection(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          aria-label={item.label}
                          className={`w-full relative flex items-center transition group ${
                            isCollapsed
                              ? "lg:w-11 lg:h-11 lg:mx-auto lg:justify-center lg:p-0 lg:rounded-xl justify-between p-2.5 px-3 rounded-2xl"
                              : "justify-between p-2.5 px-3 rounded-2xl"
                          } text-xs font-medium text-left ${
                            isActive
                              ? "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent text-amber-100 border border-amber-400/40 shadow-[0_0_25px_rgba(245,158,11,0.2)]"
                              : "text-slate-400 hover:text-amber-200 hover:bg-amber-500/5 hover:border hover:border-amber-500/15"
                          }`}
                        >
                          {/* Active Indicator Glow Bar */}
                          {isActive && (
                            <motion.div
                              layoutId="active-deck-glow"
                              className={`absolute bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 rounded-full shadow-[0_0_12px_#f59e0b] ${
                                isCollapsed
                                  ? "left-0 top-1.5 bottom-1.5 w-1 lg:left-0.5 lg:top-2 lg:bottom-2 lg:w-1"
                                  : "left-0 top-1.5 bottom-1.5 w-1"
                              }`}
                            />
                          )}

                          <div
                            className={`flex items-center gap-3 min-w-0 ${
                              isCollapsed ? "lg:gap-0 lg:justify-center" : ""
                            }`}
                          >
                            <Icon
                              className={`flex-shrink-0 transition ${
                                isCollapsed ? "w-4.5 h-4.5 lg:w-5 lg:h-5" : "w-4.5 h-4.5"
                              } ${
                                isActive
                                  ? "text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                                  : "text-slate-500 group-hover:text-amber-300/80"
                              }`}
                            />
                            <div className={`min-w-0 ${isCollapsed ? "lg:hidden" : "block"}`}>
                              <span className={`font-subheading text-[13.5px] sm:text-sm tracking-wide truncate ${isActive ? "text-amber-100 font-semibold drop-shadow-[0_0_8px_rgba(251,191,36,0.25)]" : "text-slate-200 font-medium group-hover:text-amber-200"}`}>{item.label}</span>



                            </div>
                          </div>

                          {item.badge && (
                            <span
                              className={`text-[11px] font-badge px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${
                                isCollapsed ? "lg:hidden" : "inline-block"
                              } ${
                                item.badgeColor || "text-slate-400 bg-slate-900 border border-white/5"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          {/* Collapsed mini indicator dot when badge exists */}
                          {item.badge && isCollapsed && (
                            <span className="hidden lg:block absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] ring-2 ring-slate-950" />
                          )}

                          {/* Desktop Floating Tooltip when collapsed */}
                          {isCollapsed && (
                            <div className="hidden lg:flex pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-full ml-3.5 top-1/2 -translate-y-1/2 z-50 flex-col whitespace-nowrap bg-slate-950/95 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-white tracking-wide">{item.label}</span>
                                {item.badge && (
                                  <span
                                    className={`text-[9px] font-badge px-1.5 py-0.5 rounded-full ${
                                      item.badgeColor || "text-amber-300 bg-amber-500/20 border border-amber-400/30"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}

                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Anchor Quote (From the Sacred Letter of Roots) */}
            <div className="pt-3 border-t border-amber-500/20">
              {/* Full Quote (hidden on desktop if collapsed) */}
              <div className={`space-y-1 ${isCollapsed ? "lg:hidden" : "block"}`}>
                <p className="text-xs text-amber-200/80 italic leading-relaxed text-center font-subheading">
                  &ldquo;Never step away from the center of the circle merely to widen your circumference... This anchor point is your roots.&rdquo;
                </p>
                <div className="text-[10px] text-amber-400/70 font-badge text-center font-semibold">
                  — চিঠির দর্শন (The Letter of Roots)
                </div>
              </div>

              {/* Compact Anchor Icon (visible only on desktop if collapsed) */}
              {isCollapsed && (
                <div className="hidden lg:flex justify-center">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/10 cursor-help transition"
                    title="&ldquo;Never step away from the center of the circle merely to widen your circumference... This anchor point is your roots.&rdquo; — চিঠির দর্শন"
                  >
                    <Anchor className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT PANEL: Dynamic Stage & Interactive Canvas
           ======================================================== */}
        <div className="flex-1 min-w-0 transition-all duration-300 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {activeSection === "overview" && (
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
                  onNavigateToDaily={() => setActiveSection("daily")}
                />
              )}

              {(activeSection === "daily" || activeSection === "today_sparks") && (
                <TodaySparksTab
                  tasks={todayTasks}
                  weeklyGoals={weeklyGoals}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onCarryOverTasks={handleCarryOverTasks}
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

              {activeSection === "divine_constellation" && (
                <DivineConstellationTab />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
