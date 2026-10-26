"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CalendarCheck,
  BarChart3,
  Calendar,
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Compass,
} from "lucide-react";
import {
  DailySalahRecord,
  MAIN_PRAYERS,
  PrayerKey,
  PrayerStatus,
} from "@/types/salah";
import {
  calculateCurrentStreak,
  calculateWeeklyStats,
  formatDateKey,
  getOrCreateRecordForDate,
  loadSalahRecords,
  saveAllSalahRecords,
} from "@/lib/salahStorage";
import { WaqtScheduleTab } from "./WaqtScheduleTab";
import { DailyTrackerTab } from "./DailyTrackerTab";
import { WeeklyChartTab } from "./WeeklyChartTab";
import { MonthlyChartTab } from "./MonthlyChartTab";
import { YearlyChartTab } from "./YearlyChartTab";

export type DashboardTab = "schedule" | "today" | "weekly" | "monthly" | "yearly";

interface TabItem {
  id: DashboardTab;
  title: string;
  badge?: string;
  icon: React.ElementType;
}

const DASHBOARD_TABS: TabItem[] = [
  {
    id: "schedule",
    title: "Timetable & Schedule",
    icon: Clock,
  },
  {
    id: "today",
    title: "Today's Tracker",
    icon: CalendarCheck,
    badge: "Live",
  },
  {
    id: "weekly",
    title: "Weekly Analytics",
    icon: BarChart3,
    badge: "Fri — Thu",
  },
  {
    id: "monthly",
    title: "Monthly Report",
    icon: Calendar,
    badge: "12 Months",
  },
  {
    id: "yearly",
    title: "Yearly Overview",
    icon: Star,
  },
];

export function WaqtDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("today");
  const [records, setRecords] = useState<Record<string, DailySalahRecord>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load records from local storage on mount
  useEffect(() => {
    const loaded = loadSalahRecords();
    setRecords(loaded);
    setIsLoaded(true);
  }, []);

  const todayKey = formatDateKey(new Date());
  const todayRecord = getOrCreateRecordForDate(records, todayKey);
  const streak = calculateCurrentStreak(records);
  const weeklyStats = calculateWeeklyStats(records, new Date());

  const todayPrayed = Object.values(todayRecord.prayers).filter((s) => s === "prayed").length;

  const handleUpdateTodayPrayer = (prayerKey: PrayerKey, status: PrayerStatus) => {
    const updatedRecord: DailySalahRecord = {
      ...todayRecord,
      prayers: {
        ...todayRecord.prayers,
        [prayerKey]: status,
      },
      updatedAt: Date.now(),
    };

    const newRecords = {
      ...records,
      [todayKey]: updatedRecord,
    };

    setRecords(newRecords);
    saveAllSalahRecords(newRecords);
  };

  const handleToggleTodayOptional = (key: "tahajjud" | "ishraq") => {
    const currentVal = !!todayRecord[key];
    const updatedRecord: DailySalahRecord = {
      ...todayRecord,
      [key]: !currentVal,
      updatedAt: Date.now(),
    };

    const newRecords = {
      ...records,
      [todayKey]: updatedRecord,
    };

    setRecords(newRecords);
    saveAllSalahRecords(newRecords);
  };

  const handleQuickMakeUpKaza = () => {
    const updatedPrayers = { ...todayRecord.prayers };
    MAIN_PRAYERS.forEach((p) => {
      if (updatedPrayers[p.key] === "missed") {
        updatedPrayers[p.key] = "prayed";
      }
    });

    const updatedRecord: DailySalahRecord = {
      ...todayRecord,
      prayers: updatedPrayers,
      updatedAt: Date.now(),
    };

    const newRecords = {
      ...records,
      [todayKey]: updatedRecord,
    };

    setRecords(newRecords);
    saveAllSalahRecords(newRecords);
  };

  const handleUpdatePrayerRecord = (dateStr: string, prayerKey: PrayerKey, status: PrayerStatus) => {
    const targetRecord = getOrCreateRecordForDate(records, dateStr);
    const updatedRecord: DailySalahRecord = {
      ...targetRecord,
      prayers: {
        ...targetRecord.prayers,
        [prayerKey]: status,
      },
      updatedAt: Date.now(),
    };

    const newRecords = {
      ...records,
      [dateStr]: updatedRecord,
    };

    setRecords(newRecords);
    saveAllSalahRecords(newRecords);
  };

  if (!isLoaded) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center text-xs font-mono text-cyan-400">
        <Sparkles className="w-5 h-5 animate-spin mr-2" />
        <span>Loading Salah & Waqt Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* ========================================================
          1. TOP DASHBOARD SUMMARY STATS BAR
      ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Today's Prayers */}
        <button
          onClick={() => setActiveTab("today")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            activeTab === "today"
              ? "bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              : "bg-slate-900/60 border-white/5 hover:border-white/15"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-badge tracking-wider mb-1">
            <span>Today's Prayers</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-badge font-bold text-slate-100">
            {todayPrayed}
            <span className="text-xs text-slate-500 font-subheading ml-1">/ 5 Completed</span>
          </div>
          <div className="text-[12px] font-subheading text-cyan-300">
            {todayPrayed === 5 ? "All completed today" : "View daily tracker"}
          </div>
        </button>

        {/* Current Consistency Streak */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-badge tracking-wider mb-1">
            <span>Consistency Streak</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-badge font-bold text-amber-300">
            {streak}
            <span className="text-xs text-slate-500 font-subheading ml-1">Days</span>
          </div>
          <div className="text-[12px] font-subheading text-amber-300/80">
            Unbroken steadfastness
          </div>
        </div>

        {/* Weekly Adherence Rate */}
        <button
          onClick={() => setActiveTab("weekly")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            activeTab === "weekly"
              ? "bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              : "bg-slate-900/60 border-white/5 hover:border-white/15"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-badge tracking-wider mb-1">
            <span>Weekly Adherence</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-badge font-bold text-cyan-300">
            {weeklyStats.completionRate}%
          </div>
          <div className="text-[12px] font-subheading text-cyan-200/80">
            Fri — Thu report
          </div>
        </button>

        {/* Missed / Kaza Status */}
        <button
          onClick={() => setActiveTab("monthly")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            activeTab === "monthly"
              ? "bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              : "bg-slate-900/60 border-white/5 hover:border-white/15"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-badge tracking-wider mb-1">
            <span>Missed Prayers</span>
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-badge font-bold text-rose-300">
            {weeklyStats.totalMissed}
            <span className="text-xs text-slate-500 font-subheading ml-1">Missed</span>
          </div>
          <div className="text-[12px] font-subheading text-rose-300/80">
            {weeklyStats.totalMissed === 0 ? "Zero missed prayers" : "Review monthly report"}
          </div>
        </button>
      </div>

      {/* ========================================================
          2. DASHBOARD TABS NAVIGATION
      ======================================================== */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto p-1.5 rounded-2xl bg-slate-950/90 border border-white/10 backdrop-blur-xl gap-1.5 scrollbar-none shadow-xl">
        {DASHBOARD_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-medium tracking-wide whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? "text-slate-950 shadow-lg font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-dashboard-tab"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.35)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-cyan-400"}`} />
                <span>{tab.title}</span>

                {tab.badge && (
                  <span
                    className={`text-[9px] font-badge tracking-wider px-2 py-0.5 rounded-full border ${
                      isActive
                        ? "bg-slate-950 text-cyan-300 border-slate-900"
                        : "bg-cyan-950 text-cyan-300 border-cyan-500/30"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          3. TAB CONTENT VIEWS
      ======================================================== */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <WaqtScheduleTab />
            </motion.div>
          )}

          {activeTab === "today" && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <DailyTrackerTab
                todayRecord={todayRecord}
                streak={streak}
                onUpdatePrayer={handleUpdateTodayPrayer}
                onToggleOptional={handleToggleTodayOptional}
                onQuickMakeUpKaza={handleQuickMakeUpKaza}
              />
            </motion.div>
          )}

          {activeTab === "weekly" && (
            <motion.div
              key="weekly"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <WeeklyChartTab records={records} />
            </motion.div>
          )}

          {activeTab === "monthly" && (
            <motion.div
              key="monthly"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <MonthlyChartTab
                records={records}
                onUpdatePrayerRecord={handleUpdatePrayerRecord}
              />
            </motion.div>
          )}

          {activeTab === "yearly" && (
            <motion.div
              key="yearly"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <YearlyChartTab records={records} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
