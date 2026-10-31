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
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { HifzSurahMeta, HifzSurahProgress, HifzCluster } from "@/types/hifz";
import { QURAN_SURAHS, JUZ_SURAHS_MAP } from "@/lib/quranData";
import { FacetedIlluminatedStar } from "./FacetedStar";

interface HifzSkyCanvasProps {
  progressList: HifzSurahProgress[];
  onSelectSurah: (surah: HifzSurahMeta) => void;
  onQuickRevision: (surahNumber: number) => void;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export function HifzSkyCanvas({
  progressList,
  onSelectSurah,
  onQuickRevision,
}: HifzSkyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasBgRef = useRef<HTMLCanvasElement>(null);

  // Viewport Pan & Zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredSurah, setHoveredSurah] = useState<HifzSurahMeta | null>(null);

  // Filter
  const [activeFilter, setActiveFilter] = useState<"all" | "dimming" | "short" | "long" | "para">("all");
  const [selectedPara, setSelectedPara] = useState<number | null>(null);
  const [isParaDropdownOpen, setIsParaDropdownOpen] = useState(false);
  const [hoveredPara, setHoveredPara] = useState<number | null>(null);
  const paraDropdownRef = useRef<HTMLDivElement>(null);

  // Close para popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paraDropdownRef.current && !paraDropdownRef.current.contains(e.target as Node)) {
        setIsParaDropdownOpen(false);
      }
    };
    if (isParaDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isParaDropdownOpen]);

  // Create progress lookup map
  const progressMap = useMemo(() => {
    const map = new Map<number, HifzSurahProgress>();
    progressList.forEach((p) => map.set(p.surahNumber, p));
    return map;
  }, [progressList]);

  // Starfield ambient twinkling background
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

    // Micro stars
    const starCount = 180;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep galactic nebula gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        30,
        width / 2,
        height * 0.45,
        width * 0.6
      );
      gradient.addColorStop(0, "rgba(250, 204, 21, 0.04)"); // Golden Noor heart
      gradient.addColorStop(0.35, "rgba(56, 189, 248, 0.05)"); // Cyan stardust
      gradient.addColorStop(0.7, "rgba(99, 102, 241, 0.03)"); // Indigo deep space
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw background stars
      const now = Date.now() * 0.002;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
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

  // Pan interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".hifz-star-node")) return;
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

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.4));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.65));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Filtered surahs
  const visibleSurahs = useMemo(() => {
    return QURAN_SURAHS.filter((s) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "dimming") {
        const prog = progressMap.get(s.number);
        return prog && (prog.luminosityState === "dimming" || prog.luminosityState === "critical");
      }
      if (activeFilter === "short") {
        return s.totalAyahs <= 35 || s.number >= 78;
      }
      if (activeFilter === "long") {
        return s.totalAyahs >= 75 || s.cluster === "tiwal";
      }
      if (activeFilter === "para") {
        if (!selectedPara) return true;
        const paraSurahs = JUZ_SURAHS_MAP[selectedPara] || [];
        return paraSurahs.includes(s.number);
      }
      return true;
    });
  }, [activeFilter, selectedPara, progressMap]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[620px] md:h-[720px] rounded-3xl bg-cosmic-950/90 border border-cyan-500/20 overflow-hidden select-none cursor-grab shadow-2xl shadow-cyan-950/40 ${
        isDragging ? "cursor-grabbing" : ""
      }`}
    >
      {/* 1. Starfield background canvas */}
      <canvas
        ref={canvasBgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 2. Celestial Coordinate Compass & Orbits */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.06" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="42%" fill="url(#centerGlow)" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="50%" cy="50%" r="28%" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 6" />
          <circle cx="50%" cy="50%" r="14%" fill="none" stroke="#facc15" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="50%" y1="4%" x2="50%" y2="96%" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 6" />
          <line x1="4%" y1="50%" x2="96%" y2="50%" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 6" />
        </svg>
      </div>

      {/* 3. Floating Filter Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md text-xs font-badge tracking-wider">
        <button
          onClick={() => {
            setActiveFilter("all");
            setIsParaDropdownOpen(false);
          }}
          className={`px-3 py-1.5 rounded-xl transition ${
            activeFilter === "all" ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-medium shadow-sm shadow-cyan-500/20" : "text-slate-400 hover:text-white"
          }`}
        >
          All 114 Surahs
        </button>

        <button
          onClick={() => {
            setActiveFilter("dimming");
            setIsParaDropdownOpen(false);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition ${
            activeFilter === "dimming" ? "bg-amber-500/20 text-amber-200 border border-amber-400/50 font-medium shadow-sm shadow-amber-500/20" : "text-amber-400/80 hover:text-amber-300"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Fading Stars (Daur Due)</span>
        </button>

        {/* 1. Short Surahs */}
        <button
          onClick={() => {
            setActiveFilter("short");
            setIsParaDropdownOpen(false);
          }}
          className={`px-3 py-1.5 rounded-xl transition ${
            activeFilter === "short"
              ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/50 font-medium shadow-sm shadow-indigo-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Short Surahs
        </button>

        {/* 2. Long Surahs */}
        <button
          onClick={() => {
            setActiveFilter("long");
            setIsParaDropdownOpen(false);
          }}
          className={`px-3 py-1.5 rounded-xl transition ${
            activeFilter === "long"
              ? "bg-purple-500/20 text-purple-200 border border-purple-400/50 font-medium shadow-sm shadow-purple-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Long Surahs
        </button>

        {/* 3. Specific Para Selector - Custom Cosmic Rounded UI */}
        <div ref={paraDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsParaDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-badge text-xs ${
              activeFilter === "para"
                ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/50 font-medium shadow-sm shadow-emerald-500/20"
                : isParaDropdownOpen
                ? "bg-slate-900 text-white border border-cyan-400/40"
                : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <span>
              {activeFilter === "para" && selectedPara
                ? `Para ${selectedPara}${selectedPara === 30 ? " ('Amma)" : selectedPara === 29 ? " (Tabarak)" : ""}`
                : "Select Para (1–30)"}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isParaDropdownOpen ? "rotate-180 text-cyan-300" : ""
              }`}
            />
          </button>

          {/* Compact Rounded Popover Menu */}
          <AnimatePresence>
            {isParaDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 z-50 w-72 sm:w-80 p-3 rounded-2xl bg-slate-950/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl shadow-cyan-950/70 text-slate-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <span className="text-xs font-badge text-white tracking-wide">
                      Select Para / Juz (1–30)
                    </span>
                  </div>
                  {activeFilter === "para" && (
                    <button
                      onClick={() => {
                        setActiveFilter("all");
                        setSelectedPara(null);
                        setIsParaDropdownOpen(false);
                      }}
                      className="text-[10px] font-badge text-slate-400 hover:text-rose-300 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Compact 6-column Grid of 30 Paras */}
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((paraNum) => {
                    const isSelected = activeFilter === "para" && selectedPara === paraNum;
                    const isAmma = paraNum === 30;
                    const isTabarak = paraNum === 29;

                    return (
                      <button
                        key={paraNum}
                        type="button"
                        onClick={() => {
                          setSelectedPara(paraNum);
                          setActiveFilter("para");
                          setIsParaDropdownOpen(false);
                        }}
                        onMouseEnter={() => setHoveredPara(paraNum)}
                        onMouseLeave={() => setHoveredPara(null)}
                        className={`relative h-8 rounded-xl font-badge text-xs flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/40 ring-1 ring-emerald-300 scale-105"
                            : isAmma
                            ? "bg-indigo-950/70 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30 hover:border-indigo-400"
                            : isTabarak
                            ? "bg-purple-950/70 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 hover:border-purple-400"
                            : "bg-slate-900/80 text-slate-300 border border-white/5 hover:bg-cyan-500/20 hover:text-cyan-200 hover:border-cyan-400/40 hover:scale-105"
                        }`}
                      >
                        {paraNum}
                        {(isAmma || isTabarak) && (
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#fbbf24]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Footer / Hover Surah Preview */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-subheading text-slate-400 min-h-[20px]">
                  {(() => {
                    const previewNum = hoveredPara ?? (activeFilter === "para" ? selectedPara : null);
                    if (!previewNum) {
                      return (
                        <span className="text-slate-500 italic text-[10px]">
                          Hover over any number to preview surahs
                        </span>
                      );
                    }
                    const surahs = JUZ_SURAHS_MAP[previewNum] || [];
                    const count = surahs.length;
                    const label =
                      previewNum === 30
                        ? "Juz 'Amma (Surahs 78–114)"
                        : previewNum === 29
                        ? "Juz Tabarak (Surahs 67–77)"
                        : `Surahs: ${surahs.join(", ")}`;
                    return (
                      <div className="w-full flex items-center justify-between font-badge">
                        <span className="text-cyan-300">Para {previewNum}</span>
                        <span className="text-slate-400 text-[10px] truncate max-w-[190px]">
                          {label} ({count} {count === 1 ? "surah" : "surahs"})
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Zoom & Reset Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 p-1 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-200 hover:bg-white/5 transition"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-200 hover:bg-white/5 transition"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-xl text-slate-400 hover:text-amber-200 hover:bg-white/5 transition"
          title="Reset canvas"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Main Interactive SVG Plane */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.15s ease-out",
        }}
        className="w-full h-full relative"
      >
        <svg
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Pure White Star Bloom Filter */}
            <filter id="whiteStarBloom" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial White Light Spread Gradient */}
            <radialGradient id="whiteLightSpread" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="65%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Draw connecting constellation filaments between sequential surahs in clusters */}
          {visibleSurahs.map((surah, idx) => {
            if (idx === 0) return null;
            const prev = visibleSurahs[idx - 1];
            // Only connect if they belong to same cluster
            if (prev.cluster !== surah.cluster) return null;

            const x1 = (prev.x / 100) * CANVAS_WIDTH;
            const y1 = (prev.y / 100) * CANVAS_HEIGHT;
            const x2 = (surah.x / 100) * CANVAS_WIDTH;
            const y2 = (surah.y / 100) * CANVAS_HEIGHT;

            return (
              <line
                key={`line-${prev.number}-${surah.number}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#38bdf8"
                strokeOpacity="0.12"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            );
          })}

          {/* Render all 114 Surah Stars as 5-Pointed Faceted Illuminated Stars (Like the Crystal Fairy-Light Lantern Star) */}
          {visibleSurahs.map((surah) => {
            const posX = (surah.x / 100) * CANVAS_WIDTH;
            const posY = (surah.y / 100) * CANVAS_HEIGHT;
            const prog = progressMap.get(surah.number);
            const isMem = (prog?.memorizedAyahs?.length || 0) > 0;
            const score = isMem ? (prog?.luminosityScore ?? 0) : 0;
            const isHovered = hoveredSurah?.number === surah.number;

            // 5-pointed star outer radius:
            // 100% = 15px (Fully illuminated faceted crystal star with fairy light nodes)
            // 60% = 11.5px (Medium illuminated star)
            // 30% = 8.5px (Fading stars - dim faint wireframe, fading lights)
            // 10% = 6.5px (Dark dormant - barely lit)
            // Unmemorized = 4.5px
            let baseSize = 4.5;
            if (isMem) {
              if (score >= 90) baseSize = 15;
              else if (score >= 50) baseSize = 11.5;
              else if (score >= 25) baseSize = 8.5;
              else baseSize = 6.5;
            }

            return (
              <FacetedIlluminatedStar
                key={`surah-star-${surah.number}`}
                x={posX}
                y={posY}
                size={baseSize}
                score={score}
                isHovered={isHovered}
                label={`${surah.number}. ${surah.nameEnglish}`}
                onClick={() => onSelectSurah(surah)}
                onMouseEnter={() => setHoveredSurah(surah)}
                onMouseLeave={() => setHoveredSurah(null)}
              />
            );
          })}
        </svg>
      </div>

      {/* 6. Hover Preview Popover Card */}
      <AnimatePresence>
        {hoveredSurah && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-5 left-5 z-30 max-w-sm p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/30 shadow-2xl backdrop-blur-xl text-slate-100 pointer-events-auto"
          >
            {(() => {
              const prog = progressMap.get(hoveredSurah.number);
              const memAyahs = prog?.memorizedAyahs?.length || 0;
              const total = hoveredSurah.totalAyahs;
              const days = prog?.daysSinceRevision ?? 999;
              const lum = prog?.luminosityScore ?? 0;

              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-badge text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                      Surah #{hoveredSurah.number} • Juz {hoveredSurah.juzNumber}
                    </span>
                    <span className="text-sm font-serif text-amber-200">
                      {hoveredSurah.nameArabic}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <h4 className="text-lg font-bold font-heading text-white">
                      {hoveredSurah.nameEnglish}{" "}
                      <span className="text-xs font-normal font-bengali text-slate-400">
                        ({hoveredSurah.nameBangla})
                      </span>
                    </h4>
                    <span className="text-xs font-badge text-cyan-300">
                      {memAyahs}/{total} Ayahs
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="pt-1 flex items-center justify-between text-xs font-badge">
                    <span className="text-slate-400 flex items-center gap-1 font-subheading">
                      <Clock className="w-3.5 h-3.5" />
                      {days === 0 ? "Revised today" : days === 999 ? "Never revised" : `${days} days ago`}
                    </span>
                    <span
                      className={`font-semibold ${
                        lum >= 90
                          ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                          : lum >= 50
                          ? "text-slate-200"
                          : lum >= 25
                          ? "text-slate-400 animate-pulse"
                          : "text-rose-400"
                      }`}
                    >
                      {lum >= 90
                        ? "✦ 100% Radiant"
                        : lum >= 50
                        ? "✧ 60% Stable"
                        : lum >= 25
                        ? "✦ 30% Dimming (Daur Due)"
                        : "✧ 10% Dark (Critical)"}
                    </span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickRevision(hoveredSurah.number);
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded-xl text-xs font-badge font-medium bg-white/10 hover:bg-white/20 border border-white/30 text-white transition text-center shadow-sm"
                    >
                      Mark Revised (100% Light)
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSurah(hoveredSurah);
                      }}
                      className="py-1.5 px-3 rounded-xl text-xs font-badge font-medium bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Bottom Legend (Exact White Starlight Brightness scale) */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md text-[11px] text-slate-300 font-badge">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
          <span>100% Radiant (1-3 days)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-slate-300 rounded-full opacity-60" />
          <span>60% Stable (4-7 days)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-30 animate-pulse" />
          <span>30% Dimming (8-15 days)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
          <span>10% Dark (15+ days)</span>
        </span>
      </div>
    </div>
  );
}
