"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface GalaxyScrollytellingProps {
  onComplete: () => void;
}

const TOTAL_FRAMES = 360;

export function GalaxyScrollytelling({ onComplete }: GalaxyScrollytellingProps) {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  // Smooth lerp progress tracking for 60fps canvas scrubbing
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastDrawnFrame = useRef(-1);
  const rafId = useRef<number | null>(null);
  const isCompletedRef = useRef(false);

  // Render a specific frame onto the full-bleed canvas
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Enable high-fidelity bilinear/bicubic smoothing for crisp canvas rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Nearest loaded frame fallback to prevent blank flashing
    let img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = frameIdx; i >= 0; i--) {
        if (imagesRef.current[i] && imagesRef.current[i]!.complete && imagesRef.current[i]!.naturalWidth > 0) {
          img = imagesRef.current[i];
          break;
        }
      }
      if (!img) {
        for (let i = frameIdx; i < TOTAL_FRAMES; i++) {
          if (imagesRef.current[i] && imagesRef.current[i]!.complete && imagesRef.current[i]!.naturalWidth > 0) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover math: preserve aspect ratio, fill canvas, center image
    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const destW = iw * ratio;
    const destH = ih * ratio;
    const destX = (cw - destW) / 2;
    const destY = (ch - destH) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, destX, destY, destW, destH);
    lastDrawnFrame.current = frameIdx;
  }, []);

  // Progressive Preloading: Frame 1 immediately, then streams the rest
  useEffect(() => {
    let isMounted = true;

    // High-priority frames: first 10 frames and key anchor frames
    const priority = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 100, 180, 270, 360];
    const secondary: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!priority.includes(i)) secondary.push(i);
    }

    const loadFrame = (idx: number): Promise<void> => {
      return new Promise((resolve) => {
        const numStr = String(idx).padStart(3, "0");
        const img = new Image();
        img.src = `/galaxy-sequence/frame-${numStr}.jpg`;

        img.onload = () => {
          if (!isMounted) return resolve();
          imagesRef.current[idx - 1] = img;

          if (idx === 1) {
            renderFrame(0);
          }
          resolve();
        };

        img.onerror = () => {
          resolve();
        };
      });
    };

    // Load priority frames first
    Promise.all(priority.map(loadFrame)).then(() => {
      if (!isMounted) return;
      renderFrame(0);

      // Stream remaining frames in chunks to prevent network choking
      const chunkSize = 12;
      const loadQueue = async () => {
        for (let i = 0; i < secondary.length; i += chunkSize) {
          if (!isMounted) break;
          const chunk = secondary.slice(i, i + chunkSize);
          await Promise.all(chunk.map(loadFrame));
          await new Promise((r) => setTimeout(r, 16));
        }
      };
      loadQueue();
    });

    return () => {
      isMounted = false;
    };
  }, [renderFrame]);

  // Keep canvas size synchronized with window resolution & DPR
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (lastDrawnFrame.current >= 0) {
        renderFrame(lastDrawnFrame.current);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame]);

  // Scroll listener & 60FPS RAF animation loop
  useEffect(() => {
    const handleScroll = () => {
      const track = scrollTrackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollableDist = track.offsetHeight - window.innerHeight;
      if (scrollableDist <= 0) return;

      const scrolled = -rect.top;
      const p = Math.min(1, Math.max(0, scrolled / scrollableDist));
      targetProgress.current = p;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 60FPS Lerp loop
    const loop = () => {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * 0.14;
      } else {
        currentProgress.current = targetProgress.current;
      }

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentProgress.current * (TOTAL_FRAMES - 1)))
      );

      if (frameIdx !== lastDrawnFrame.current) {
        renderFrame(frameIdx);
      }

      // Automatically transition when user scrolls to the end of the galaxy
      if (currentProgress.current >= 0.985 && !isCompletedRef.current) {
        isCompletedRef.current = true;
        onComplete();
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [renderFrame, onComplete]);

  return (
    <div
      ref={scrollTrackRef}
      className="relative w-full bg-[#02040a]"
      style={{ height: "450vh" }}
    >
      {/* 
        FIXED VIEWPORT: 
        Pure fullscreen canvas. No text, no vignettes, no overlays.
        Only pure, cinematic 3D galaxy motion controlled by scroll.
      */}
      <div className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center z-20 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block select-none pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            imageRendering: "auto",
          }}
        />
      </div>
    </div>
  );
}
