"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Anchor,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  X,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  Plus,
} from "lucide-react";
import { TodaySparkGoal, SubTask, CATEGORY_MAP } from "@/types/milestones";
import { playMilestoneChime } from "@/lib/milestoneData";

interface DeepWorkOrbitModalProps {
  task: TodaySparkGoal;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (taskId: string, actualMinutes?: number) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
}

export function DeepWorkOrbitModal({
  task,
  isOpen,
  onClose,
  onCompleteTask,
  onToggleSubtask,
  onAddSubtask,
}: DeepWorkOrbitModalProps) {
  // Timer settings automatically configured from task.estimatedMinutes
  const initialSeconds = (task.estimatedMinutes || 25) * 60;
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showAddSubtask, setShowAddSubtask] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-sync timer duration whenever task changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const sec = (task.estimatedMinutes || 25) * 60;
      setTotalSeconds(sec);
      setSecondsRemaining(sec);
      setIsRunning(false);
    }
  }, [isOpen, task.id, task.estimatedMinutes]);

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsRunning(false);
            if (soundEnabled) {
              playMilestoneChime(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, soundEnabled]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
  const strokeDashoffset = 565.48 * (1 - progressRatio);

  const catMeta = CATEGORY_MAP[task.category] || CATEGORY_MAP.other;

  const setPreset = (mins: number) => {
    const sec = mins * 60;
    setTotalSeconds(sec);
    setSecondsRemaining(sec);
    setIsRunning(false);
  };

  const adjustMinutes = (delta: number) => {
    const newSec = Math.max(60, secondsRemaining + delta * 60);
    setSecondsRemaining(newSec);
    if (newSec > totalSeconds) setTotalSeconds(newSec);
  };

  const handleCreateSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !onAddSubtask) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
    setShowAddSubtask(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-3xl overflow-y-auto"
      >
        {/* Subtle Ambient Cosmic Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          className="relative w-full max-w-2xl rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.18),0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col items-center my-auto"
        >
          {/* Header Bar */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-amber-500/20 mb-6">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Anchor className="w-4 h-4 text-amber-400 animate-pulse" />
              </span>
              <div>
                <div className="text-[10px] font-badge tracking-widest uppercase text-amber-400/90">
                  THE ANCHOR • DEEP WORK ORBIT
                </div>
                <div className="text-xs font-subheading text-slate-400">
                  Deep focus & undivided presence
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border transition ${
                  soundEnabled
                    ? "bg-amber-500/10 border-amber-400/30 text-amber-300"
                    : "bg-slate-800 border-white/10 text-slate-500"
                }`}
                title={soundEnabled ? "Mute Chime" : "Enable Chime"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition"
                title="Exit Focus Mode"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Task Highlight */}
          <div className="w-full text-center mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-badge border shadow-sm">
              <span className={`${catMeta.bgLight} ${catMeta.color} ${catMeta.borderColor} px-2 py-0.5 rounded-full border`}>
                {catMeta.label}
              </span>
              {task.priority === "high" && (
                <span className="text-rose-300 bg-rose-500/20 border border-rose-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <Flame className="w-3 h-3 text-rose-400" />
                  High Focus
                </span>
              )}
              <span className="text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 px-2 py-0.5 rounded-full font-mono">
                ⏱️ {task.estimatedMinutes || 25}m Planned
              </span>
              <span className="text-amber-300 font-bold">+{task.points} XP</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white max-w-xl mx-auto leading-relaxed">
              {task.title}
            </h2>
          </div>

          {/* Circular Countdown Timer */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-6">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
              {/* Background Ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                className="stroke-slate-800/80"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                className="stroke-amber-400 transition-all duration-1000 ease-linear"
                strokeWidth="8"
                strokeDasharray="565.48"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center Digital Display */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                {timeFormatted}
              </span>
              <span className="text-xs font-badge tracking-wider text-amber-400/80 mt-1 uppercase">
                {isRunning ? "Deep Focus Orbit" : "Paused"}
              </span>
            </div>
          </div>

          {/* Preset Buttons & Minute Adjusters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => adjustMinutes(-5)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:bg-slate-700"
            >
              -5m
            </button>
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setPreset(mins)}
                className={`px-3 py-1 rounded-xl text-xs font-badge transition ${
                  totalSeconds === mins * 60
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                    : "bg-slate-800/80 border border-white/10 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {mins}m
              </button>
            ))}
            <button
              onClick={() => adjustMinutes(5)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:bg-slate-700"
            >
              +5m
            </button>
          </div>

          {/* Timer Controls: Play / Pause & Reset */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-badge font-bold text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] transition active:scale-95"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause Orbit</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Ignite Focus</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setSecondsRemaining(totalSeconds);
                setIsRunning(false);
              }}
              className="p-3 rounded-2xl bg-slate-800 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Subtasks in Focus Mode */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="w-full max-w-lg bg-slate-950/70 border border-white/10 rounded-2xl p-4 mb-6 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs font-badge text-slate-400 uppercase tracking-wider mb-1">
                <span>Action Checklist</span>
                <span className="text-amber-300">
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} Done
                </span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {task.subtasks.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onToggleSubtask && onToggleSubtask(task.id, sub.id)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 text-left transition"
                  >
                    {sub.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs font-subheading flex-1 ${
                        sub.completed ? "line-through text-slate-500" : "text-slate-200"
                      }`}
                    >
                      {sub.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action: Complete Spark & Exit */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-amber-500/20">
            <button
              onClick={() => {
                const elapsedSec = Math.max(0, totalSeconds - secondsRemaining);
                const actualMin = Math.max(1, Math.round(elapsedSec / 60));
                onCompleteTask(task.id, actualMin);
                onClose();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 hover:bg-emerald-500/30 text-emerald-300 font-badge font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Conquer &amp; Complete Spark (+{task.points} XP)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 border border-white/10 text-slate-400 hover:text-white text-xs font-subheading transition"
            >
              Exit Focus
            </button>
          </div>

          {/* Inspirational Anchor Quote */}
          <div className="mt-5 text-center">
            <p className="text-[11px] text-amber-300/70 italic font-subheading">
              &ldquo;Never step away from the center of the circle merely to widen your circumference... This anchor point is your roots.&rdquo;
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
