"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Flame,
  Star,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Info,
} from "lucide-react";
import { HifzSurahMeta, HifzSurahProgress } from "@/types/hifz";
import { QURAN_SURAHS } from "@/lib/quranData";

interface AmukhtaConstellationCanvasProps {
  progressList: HifzSurahProgress[];
  onRevise: (surahNumber: number) => void;
  onOpenZen: (surahNumber: number) => void;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 720;

export function AmukhtaConstellationCanvas({
  progressList,
  onRevise,
  onOpenZen,
}: AmukhtaConstellationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasBgRef = useRef<HTMLCanvasElement>(null);

  // Pan & Zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover & Selection
  const [hoveredSurah, setHoveredSurah] = useState<{
    meta: HifzSurahMeta;
    progress: HifzSurahProgress;
    clientX: number;
    clientY: number;
  } | null>(null);

  // Filter mode for canvas
  const [canvasFilter, setCanvasFilter] = useState<"all" | "urgent" | "juz30">("all");

  // Create progress lookup map
  const progressMap = useMemo(() => {
    const map = new Map<number, HifzSurahProgress>();
    progressList.forEach((p) => map.set(p.surahNumber, p));
    return map;
  }, [progressList]);

  // Memorized Surahs on canvas
  const activeSurahs = useMemo(() => {
    return QURAN_SURAHS.filter((meta) => {
      const prog = progressMap.get(meta.number);
      const isMem = prog && (prog.isFullyMemorized || prog.memorizedAyahs.length > 0);
      if (!isMem) return false;

      if (canvasFilter === "urgent") {
        return prog.luminosityState === "dimming" || prog.luminosityState === "critical";
      }
      if (canvasFilter === "juz30") {
        return meta.juzNumber === 30;
      }
      return true;
    });
  }, [progressMap, canvasFilter]);

  // Starfield ambient canvas background
  useEffect(() => {
    const canvas = canvasBgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Micro stars in deep cosmic space
    const microStars = Array.from({ length: 160 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.02 + 0.006,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep celestial radial aura
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        40,
        width * 0.5,
        height * 0.45,
        width * 0.65
      );
      grad.addColorStop(0, "rgba(245, 158, 11, 0.06)"); // Warm golden center
      grad.addColorStop(0.35, "rgba(56, 189, 248, 0.04)"); // Cyan celestial haze
      grad.addColorStop(0.7, "rgba(99, 102, 241, 0.03)"); // Deep indigo space
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render twinkling micro stars
      const now = Date.now() * 0.002;
      for (let i = 0; i < microStars.length; i++) {
        const s = microStars[i];
        const currentAlpha =
          s.alpha * (0.6 + 0.4 * Math.sin(now * s.speed * 30 + s.phase));

        ctx.fillStyle = `rgba(226, 232, 240, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".amukhta-star-node")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Constellation lines connecting memorized surahs of the same cluster
  const constellationLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; cluster: string }[] = [];
    const grouped = new Map<string, HifzSurahMeta[]>();

    activeSurahs.forEach((s) => {
      const list = grouped.get(s.cluster) || [];
      list.push(s);
      grouped.set(s.cluster, list);
    });

    grouped.forEach((surahs, cluster) => {
      for (let i = 0; i < surahs.length - 1; i++) {
        const p1 = surahs[i];
        const p2 = surahs[i + 1];
        lines.push({
          x1: (p1.x / 100) * CANVAS_WIDTH,
          y1: (p1.y / 100) * CANVAS_HEIGHT,
          x2: (p2.x / 100) * CANVAS_WIDTH,
          y2: (p2.y / 100) * CANVAS_HEIGHT,
          cluster,
        });
      }
    });

    return lines;
  }, [activeSurahs]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-amber-500/20 bg-slate-950/90 shadow-2xl backdrop-blur-xl">
      {/* Background Twinkling Canvas */}
      <canvas
        ref={canvasBgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Top Bar: Controls & Legend */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        {/* Left: Section Badge & Current Active count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-badge">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Fading Constellation Canvas</span>
          </div>
          <span className="text-xs font-badge text-slate-300">
            {activeSurahs.length} Active Memorized Stars
          </span>
        </div>

        {/* Center: Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-badge">
          <button
            onClick={() => setCanvasFilter("all")}
            className={`px-3 py-1 rounded-lg transition ${
              canvasFilter === "all"
                ? "bg-amber-500/20 text-amber-200 border border-amber-400/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Memorized ({progressList.filter((p) => p.isFullyMemorized || p.memorizedAyahs.length > 0).length})
          </button>
          <button
            onClick={() => setCanvasFilter("urgent")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
              canvasFilter === "urgent"
                ? "bg-rose-500/30 text-rose-200 border border-rose-400/50 font-bold"
                : "text-amber-400/80 hover:text-amber-200"
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Dimming & Critical</span>
          </button>
          <button
            onClick={() => setCanvasFilter("juz30")}
            className={`px-3 py-1 rounded-lg transition ${
              canvasFilter === "juz30"
                ? "bg-amber-500/20 text-amber-200 border border-amber-400/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            30th Para (Amma)
          </button>
        </div>

        {/* Right: Zoom & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-white/10">
            <button
              onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[11px] font-badge text-slate-400 hidden sm:inline">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Main Interactive Celestial Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[520px] sm:h-[600px] overflow-hidden select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <svg
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="absolute inset-0 w-full h-full pointer-events-auto"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          {/* Defs for Starlight Glows */}
          <defs>
            {/* 100% Radiant Diamond White Halo */}
            <radialGradient id="amukhta-radiant-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>

            {/* Stable Warm Golden Halo */}
            <radialGradient id="amukhta-stable-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            {/* Dimming Amber Halo */}
            <radialGradient id="amukhta-dimming-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>

            {/* Critical Blood Red Halo */}
            <radialGradient id="amukhta-critical-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#dc2626" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Constellation Connection Lines */}
          <g className="constellation-lines" opacity="0.35">
            {constellationLines.map((line, idx) => (
              <line
                key={idx}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#f59e0b"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
            ))}
          </g>

          {/* Render Active Memorized Surahs as Stars */}
          {activeSurahs.map((meta) => {
            const prog = progressMap.get(meta.number);
            if (!prog) return null;

            const posX = (meta.x / 100) * CANVAS_WIDTH;
            const posY = (meta.y / 100) * CANVAS_HEIGHT;

            const state = prog.luminosityState;
            const score = prog.luminosityScore;
            const days = prog.daysSinceRevision;

            // Visual Styling based on fading algorithm
            let haloGrad = "url(#amukhta-radiant-glow)";
            let starColor = "#ffffff";
            let outerHaloRadius = 32;
            let isPulsing = false;
            let isCritical = false;

            if (state === "radiant") {
              haloGrad = "url(#amukhta-radiant-glow)";
              starColor = "#ffffff";
              outerHaloRadius = 36;
            } else if (state === "stable") {
              haloGrad = "url(#amukhta-stable-glow)";
              starColor = "#fef08a";
              outerHaloRadius = 26;
            } else if (state === "dimming") {
              haloGrad = "url(#amukhta-dimming-glow)";
              starColor = "#fb923c";
              outerHaloRadius = 22;
              isPulsing = true;
            } else if (state === "critical") {
              haloGrad = "url(#amukhta-critical-glow)";
              starColor = "#ef4444";
              outerHaloRadius = 28;
              isCritical = true;
            }

            const isCurrentHover = hoveredSurah?.meta.number === meta.number;

            return (
              <g
                key={meta.number}
                className="amukhta-star-node cursor-pointer group"
                transform={`translate(${posX}, ${posY})`}
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  setHoveredSurah({
                    meta,
                    progress: prog,
                    clientX: e.clientX - (rect?.left || 0),
                    clientY: e.clientY - (rect?.top || 0),
                  });
                }}
                onClick={() => onOpenZen(meta.number)}
              >
                {/* Outer Celestial Halo Aura */}
                <circle
                  cx="0"
                  cy="0"
                  r={isCurrentHover ? outerHaloRadius * 1.4 : outerHaloRadius}
                  fill={haloGrad}
                  className={
                    isCritical
                      ? "animate-ping opacity-60"
                      : isPulsing
                      ? "animate-pulse"
                      : ""
                  }
                  style={{
                    animationDuration: isCritical ? "2.5s" : "4s",
                  }}
                />

                {/* If Critical: Warning Ring */}
                {isCritical && (
                  <circle
                    cx="0"
                    cy="0"
                    r={outerHaloRadius + 4}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                    style={{ animationDuration: "10s" }}
                  />
                )}

                {/* Star Core Glow */}
                <circle
                  cx="0"
                  cy="0"
                  r={isCurrentHover ? 8 : 6}
                  fill={starColor}
                  className="transition-all duration-200"
                  style={{
                    filter: `drop-shadow(0 0 ${isCurrentHover ? "10px" : "6px"} ${starColor})`,
                  }}
                />

                {/* Cross Flares for Radiant / Stable */}
                {(state === "radiant" || isCurrentHover) && (
                  <g stroke={starColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
                    <line x1="-12" y1="0" x2="12" y2="0" />
                    <line x1="0" y1="-12" x2="0" y2="12" />
                  </g>
                )}

                {/* Surah Number Label */}
                <text
                  x="0"
                  y="18"
                  textAnchor="middle"
                  fill={starColor}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="sans-serif"
                  className="pointer-events-none drop-shadow-md"
                >
                  {meta.number}. {meta.nameArabic}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Glassmorphism Tooltip */}
        <AnimatePresence>
          {hoveredSurah && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                left: Math.min(hoveredSurah.clientX + 16, (containerRef.current?.clientWidth || 800) - 300),
                top: Math.max(hoveredSurah.clientY - 90, 20),
              }}
              onMouseEnter={() => {}}
              onMouseLeave={() => setHoveredSurah(null)}
              className="absolute z-30 w-72 p-4 rounded-2xl bg-slate-950/95 border border-amber-500/40 shadow-2xl backdrop-blur-2xl text-left pointer-events-auto space-y-3"
            >
              {/* Header: Surah Name & Para */}
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-badge px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Surah #{hoveredSurah.meta.number}
                    </span>
                    <span className="text-[11px] font-badge text-slate-400">
                      পারা {hoveredSurah.meta.juzNumber} • {hoveredSurah.meta.totalAyahs} আয়াত
                    </span>
                  </div>
                  <h4 className="text-base font-heading font-bold text-white mt-1">
                    {hoveredSurah.meta.nameEnglish}{" "}
                    <span className="text-xs font-bengali font-normal text-slate-300">
                      ({hoveredSurah.meta.nameBangla})
                    </span>
                  </h4>
                </div>
                <span className="text-lg font-serif text-amber-300">
                  {hoveredSurah.meta.nameArabic}
                </span>
              </div>

              {/* Revision Recency & Health */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-badge">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    সর্বশেষ রিভিশন:
                  </span>
                  <span
                    className={`font-bold ${
                      hoveredSurah.progress.daysSinceRevision === 0
                        ? "text-emerald-400"
                        : hoveredSurah.progress.daysSinceRevision > 15
                        ? "text-rose-400 animate-pulse"
                        : hoveredSurah.progress.daysSinceRevision > 7
                        ? "text-amber-400"
                        : "text-cyan-300"
                    }`}
                  >
                    {hoveredSurah.progress.daysSinceRevision === 0
                      ? "আজকে"
                      : `${hoveredSurah.progress.daysSinceRevision} দিন আগে`}
                  </span>
                </div>

                {/* Health Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-badge">
                    <span className="text-slate-400">Memory Retention:</span>
                    <span
                      className={`font-bold ${
                        hoveredSurah.progress.luminosityScore >= 80
                          ? "text-emerald-400"
                          : hoveredSurah.progress.luminosityScore >= 50
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {hoveredSurah.progress.luminosityScore}% Health
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        hoveredSurah.progress.luminosityScore >= 80
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                          : hoveredSurah.progress.luminosityScore >= 50
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                          : "bg-gradient-to-r from-rose-600 to-red-500 animate-pulse"
                      }`}
                      style={{ width: `${hoveredSurah.progress.luminosityScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-bengali text-slate-400 italic">
                    {hoveredSurah.progress.luminosityScore >= 80
                      ? "আলহামদুলিল্লাহ, পূর্ণ জ্যোতিতে ভাসছে!"
                      : hoveredSurah.progress.luminosityScore >= 50
                      ? "আলো ম্লান হচ্ছে, দ্রুত রিভিশন প্রয়োজন।"
                      : "সতর্কতা: নক্ষত্রের জ্যোতি প্রায় নিভে যাচ্ছে!"}
                  </p>
                </div>
              </div>

              {/* Action Buttons in Tooltip */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRevise(hoveredSurah.meta.number);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/30 to-amber-600/20 hover:from-amber-500/40 hover:to-amber-600/30 border border-amber-400/50 text-amber-200 text-xs font-badge font-bold transition shadow-md shadow-amber-950/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
                  <span>নূর পুনরুজ্জীবিত করুন</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenZen(hoveredSurah.meta.number);
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-cyan-300 hover:text-white transition"
                  title="Zen Daur Mode"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Canvas Legend */}
      <div className="px-6 py-3 border-t border-white/10 bg-slate-950/70 flex flex-wrap items-center justify-between gap-4 text-xs font-badge text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            <span>Radiant (১–৩ দিন)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <span>Stable (৪–৭ দিন)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ea580c] animate-pulse" />
            <span>Dimming (৮–১৫ দিন)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444] animate-ping" />
            <span className="text-rose-300 font-bold">Critical (১৬+ দিন)</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Info className="w-3 h-3 text-amber-400" />
          <span>নক্ষত্রের উপর হোভার করে স্থিতি দেখুন বা ক্লিক করে জেন রিভিশন শুরু করুন</span>
        </div>
      </div>
    </div>
  );
}
