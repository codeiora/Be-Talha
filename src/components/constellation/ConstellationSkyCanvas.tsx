"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ConstellationMilestone,
  ConstellationConnection,
} from "@/types/constellation";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ConstellationSkyCanvasProps {
  milestones: ConstellationMilestone[];
  connections: ConstellationConnection[];
  selectedMilestoneId: string | null;
  onSelectMilestone: (milestone: ConstellationMilestone) => void;
  onToggleMilestone: (id: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// Fixed SVG coordinate canvas dimensions
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 680;

export function ConstellationSkyCanvas({
  milestones,
  connections,
  selectedMilestoneId,
  onSelectMilestone,
  onToggleMilestone,
  soundEnabled,
  onToggleSound,
}: ConstellationSkyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasBgRef = useRef<HTMLCanvasElement>(null);

  // Viewport Pan & Zoom state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredStar, setHoveredStar] = useState<ConstellationMilestone | null>(null);

  // Background ambient twinkling stars
  useEffect(() => {
    const canvas = canvasBgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate random micro stars
    const starCount = 140;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle celestial nebula haze
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        20,
        width / 2,
        height * 0.45,
        width * 0.55
      );
      gradient.addColorStop(0, "rgba(56, 189, 248, 0.05)");
      gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.03)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw twinkling background stars
      const now = Date.now() * 0.002;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const currentAlpha =
          s.alpha * (0.6 + 0.4 * Math.sin(now * s.speed * 40 + s.phase));

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

  // Map milestones by ID for fast lookup
  const milestoneMap = useMemo(() => {
    const map = new Map<string, ConstellationMilestone>();
    milestones.forEach((m) => map.set(m.id, m));
    return map;
  }, [milestones]);

  // Convert percentage coordinates to SVG absolute points
  const getCoordinates = useCallback((milestone: ConstellationMilestone) => {
    return {
      x: (milestone.x / 100) * CANVAS_WIDTH,
      y: (milestone.y / 100) * CANVAS_HEIGHT,
    };
  }, []);

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background, not on buttons or stars
    if ((e.target as HTMLElement).closest(".interactive-star")) return;
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.7));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(z + 0.1, 2.2));
    } else {
      setZoom((z) => Math.max(z - 0.1, 0.7));
    }
  };

  // Completion stats
  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;
  const radiancePct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-[580px] sm:h-[660px] md:h-[720px] rounded-3xl bg-slate-950/80 border border-cyan-500/20 overflow-hidden shadow-2xl shadow-cyan-950/40 select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* 1. Underlying Starfield Canvas */}
      <canvas
        ref={canvasBgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 2. Celestial Coordinate Lines (Subtle Astronomical Grids) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="gridGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse
            cx="50%"
            cy="50%"
            rx="45%"
            ry="40%"
            fill="url(#gridGlow)"
            stroke="#38bdf8"
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
          <ellipse
            cx="50%"
            cy="50%"
            rx="28%"
            ry="25%"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
          <line
            x1="50%"
            y1="5%"
            x2="50%"
            y2="95%"
            stroke="#38bdf8"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
          <line
            x1="5%"
            y1="50%"
            x2="95%"
            y2="50%"
            stroke="#38bdf8"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
        </svg>
      </div>

      {/* 3. Main Interactive Constellation SVG Plane with Pan & Zoom Transform */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.15s ease-out",
        }}
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
      >
        <svg
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="w-full h-full max-w-[1000px] max-h-[680px] overflow-visible pointer-events-auto"
        >
          <defs>
            {/* Filter for ignited starlight glow */}
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Filter for celestial beam paths */}
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial Gradients for Star Halos */}
            <radialGradient id="haloCyan">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="haloGold">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="haloBeacon">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Wing Aura Silhouette in background */}
          <g className="pointer-events-none opacity-25">
            <path
              d="M 500,100 Q 300,140 80,120 Q 200,280 500,380 Q 800,280 920,120 Q 700,140 500,100 Z"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.8"
              strokeDasharray="6 8"
            />
          </g>

          {/* 3.1 CONSTELLATION CONNECTION LINES */}
          <g className="constellation-chords">
            {connections.map((conn, idx) => {
              const fromStar = milestoneMap.get(conn.fromId);
              const toStar = milestoneMap.get(conn.toId);
              if (!fromStar || !toStar) return null;

              const p1 = getCoordinates(fromStar);
              const p2 = getCoordinates(toStar);

              const isBothCompleted = fromStar.completed && toStar.completed;
              const isOneCompleted = fromStar.completed || toStar.completed;

              return (
                <g key={`conn-${idx}`}>
                  {/* Guide Line */}
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={
                      isBothCompleted
                        ? "#38bdf8"
                        : isOneCompleted
                        ? "rgba(56, 189, 248, 0.4)"
                        : "rgba(148, 163, 184, 0.18)"
                    }
                    strokeWidth={isBothCompleted ? 2.5 : isOneCompleted ? 1.5 : 1}
                    strokeDasharray={isBothCompleted ? "none" : "4 6"}
                    filter={isBothCompleted ? "url(#lineGlow)" : undefined}
                  />

                  {/* Radiating Light Beam if both are completed */}
                  {isBothCompleted && (
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="#fef08a"
                      strokeWidth="1"
                      strokeOpacity="0.8"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* 3.2 CONSTELLATION STARS (NODES) */}
          <g className="constellation-stars">
            {milestones.map((milestone) => {
              const { x, y } = getCoordinates(milestone);
              const isSelected = selectedMilestoneId === milestone.id;
              const isCompleted = milestone.completed;
              const isHovered = hoveredStar?.id === milestone.id;

              // Size based on magnitude (2 to 5)
              const baseRadius = 5 + milestone.magnitude * 2;
              const spikeLength = baseRadius * 3.2;

              return (
                <g
                  key={milestone.id}
                  transform={`translate(${x}, ${y})`}
                  className="interactive-star cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMilestone(milestone);
                  }}
                  onMouseEnter={() => setHoveredStar(milestone)}
                  onMouseLeave={() => setHoveredStar(null)}
                >
                  {/* Invisible hit target */}
                  <circle
                    r={Math.max(baseRadius * 2.8, 26)}
                    fill="transparent"
                    className="cursor-pointer"
                  />

                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      r={baseRadius * 2.6}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Completed / Ignited Star Rendering */}
                  {isCompleted ? (
                    <g>
                      {/* Atmospheric Halo */}
                      <circle
                        r={baseRadius * 3}
                        fill={
                          milestone.category === "beacon"
                            ? "url(#haloBeacon)"
                            : milestone.category === "roots"
                            ? "url(#haloGold)"
                            : "url(#haloCyan)"
                        }
                        opacity={isHovered ? 1 : 0.75}
                      />

                      {/* Diffraction Spikes */}
                      <g className="diffraction-spikes pointer-events-none" filter="url(#starGlow)">
                        <line
                          x1={-spikeLength}
                          y1={0}
                          x2={spikeLength}
                          y2={0}
                          stroke="#ffffff"
                          strokeWidth={milestone.category === "beacon" ? 2.2 : 1.5}
                          strokeLinecap="round"
                          opacity="0.9"
                        />
                        <line
                          x1={0}
                          y1={-spikeLength}
                          x2={0}
                          y2={spikeLength}
                          stroke="#ffffff"
                          strokeWidth={milestone.category === "beacon" ? 2.2 : 1.5}
                          strokeLinecap="round"
                          opacity="0.9"
                        />
                        {milestone.magnitude >= 4 && (
                          <>
                            <line
                              x1={-spikeLength * 0.55}
                              y1={-spikeLength * 0.55}
                              x2={spikeLength * 0.55}
                              y2={spikeLength * 0.55}
                              stroke="#67e8f9"
                              strokeWidth="1"
                              strokeLinecap="round"
                              opacity="0.65"
                            />
                            <line
                              x1={-spikeLength * 0.55}
                              y1={spikeLength * 0.55}
                              x2={spikeLength * 0.55}
                              y2={-spikeLength * 0.55}
                              stroke="#67e8f9"
                              strokeWidth="1"
                              strokeLinecap="round"
                              opacity="0.65"
                            />
                          </>
                        )}
                      </g>

                      {/* Brilliant White Core */}
                      <circle
                        r={baseRadius * 0.8}
                        fill="#ffffff"
                        filter="url(#starGlow)"
                      />

                      {/* Star Accent Center */}
                      <circle
                        r={baseRadius * 0.45}
                        fill={milestone.color || "#38bdf8"}
                      />
                    </g>
                  ) : (
                    /* Dormant / In-Progress Star Rendering */
                    <g opacity={isHovered ? 0.95 : 0.65}>
                      <circle
                        r={baseRadius * 1.5}
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                        className="transition-all duration-300 group-hover:stroke-cyan-400 group-hover:scale-110"
                      />
                      <circle
                        r={baseRadius * 0.9}
                        fill="rgba(56, 189, 248, 0.12)"
                        className="transition-all duration-300 group-hover:fill-cyan-500/30"
                      />
                      <circle
                        r={baseRadius * 0.45}
                        fill="#94a3b8"
                        className="transition-all duration-300 group-hover:fill-cyan-300"
                      />
                    </g>
                  )}

                  {/* Label Text below star */}
                  <text
                    y={baseRadius + 18}
                    textAnchor="middle"
                    fill={isCompleted ? "#e2e8f0" : "#64748b"}
                    fontSize={isCompleted ? "11px" : "10px"}
                    fontWeight={isCompleted ? "600" : "400"}
                    className="font-sans pointer-events-none transition-all duration-200 group-hover:fill-cyan-200 select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {milestone.title}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 4. Top Overlay HUD: Wing Radiance Progress & Concept */}
      <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-none z-10">
        {/* Constellation Concept Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg pointer-events-auto">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              The Constellation • Winged Morning Star
            </div>
            <div className="text-xs text-slate-300 font-sans">
              Transcending limitations to radiate singular light across the cosmos
            </div>
          </div>
        </div>

        {/* Radiance & Wing Meter */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-lg pointer-events-auto">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Constellation Span
            </div>
            <div className="text-xs font-mono font-medium text-amber-300">
              <span className="font-bold text-sm text-cyan-300">{completedCount}</span> /{" "}
              {totalCount} Stars Ignited ({radiancePct}%)
            </div>
          </div>

          <div className="w-20 sm:w-28 h-2 rounded-full bg-slate-950 border border-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${radiancePct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
            />
          </div>
        </div>
      </div>

      {/* 5. Bottom Left: Floating Star Hover Tooltip */}
      <AnimatePresence>
        {hoveredStar && !isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-4 left-4 max-w-sm p-4 rounded-2xl bg-slate-900/90 border border-cyan-400/40 backdrop-blur-md shadow-2xl pointer-events-none z-20"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                {hoveredStar.wingLabel}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  hoveredStar.completed
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {hoveredStar.completed ? "★ Ignited Star" : "○ Dormant Star"}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100">
              {hoveredStar.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
              {hoveredStar.description}
            </p>
            <div className="mt-2 text-[10px] text-cyan-400/80 font-mono">
              Click star to inspect or ignite ↗
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Bottom Right: Navigation Controls (Zoom, Reset, Sound) */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/85 border border-white/10 backdrop-blur-md shadow-xl z-20">
        <button
          onClick={handleZoomIn}
          title="Zoom in (+)"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          title="Zoom out (-)"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          title="Reset canvas view"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

        <button
          onClick={onToggleSound}
          title={soundEnabled ? "Mute cosmic chime" : "Enable cosmic chime"}
          className={`p-2 rounded-xl transition ${
            soundEnabled
              ? "text-cyan-300 bg-cyan-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
