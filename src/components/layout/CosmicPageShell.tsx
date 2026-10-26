"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowLeft,
  Menu,
  Lock,
  Sparkles,
} from "lucide-react";
import { InteractiveGalaxy } from "@/components/canvas/InteractiveGalaxy";
import { CosmicHubDrawer, ModuleType } from "@/components/navigation/CosmicHubDrawer";
import { SecretGate } from "@/components/gate/SecretGate";
import { APP_CONFIG } from "@/lib/constants";

interface CosmicPageShellProps {
  title: string;
  bengaliTitle: string;
  activeModule?: ModuleType;
  children: React.ReactNode;
  requireUnlock?: boolean;
}

export function CosmicPageShell({
  title,
  bengaliTitle,
  activeModule,
  children,
  requireUnlock = false,
}: CosmicPageShellProps) {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInspectingGalaxy, setIsInspectingGalaxy] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(APP_CONFIG.localStorageKey);
      setIsUnlocked(stored === "unlocked");
    } catch {
      setIsUnlocked(false);
    }
  }, []);

  const handleUnlock = () => {
    try {
      localStorage.setItem(APP_CONFIG.localStorageKey, "unlocked");
    } catch (e) {
      console.error(e);
    }
    setIsUnlocked(true);
  };

  const handleLock = () => {
    try {
      localStorage.removeItem(APP_CONFIG.localStorageKey);
    } catch (err) {
      console.error("Lock error:", err);
    }
    setIsUnlocked(false);
    setIsMenuOpen(false);
    router.push("/");
  };

  const handleSelectModule = (mod: ModuleType) => {
    setIsMenuOpen(false);
    if (!mod) return;
    router.push(`/${mod}`);
  };

  if (requireUnlock) {
    if (isUnlocked === null) {
      return (
        <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-slate-500 font-mono text-xs">
          <span className="animate-pulse">Aligning cosmic compass...</span>
        </div>
      );
    }

    if (!isUnlocked) {
      return (
        <div className="relative isolate min-h-screen text-slate-100 overflow-x-hidden">
          <InteractiveGalaxy onInspectChange={setIsInspectingGalaxy} />
          <SecretGate onUnlock={handleUnlock} />
        </div>
      );
    }
  }

  return (
    <div className="relative isolate min-h-screen text-slate-100 overflow-x-hidden flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 360-Degree Interactive Galaxy Canvas */}
      <InteractiveGalaxy onInspectChange={setIsInspectingGalaxy} />

      {/* Top Ambient Navigation Bar */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        {/* Left: Back to Horizon / Home */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-badge transition group"
            title="Return to Horizon (Home)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return Home</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="font-heading tracking-widest text-xs uppercase text-slate-300 font-medium">
              Be Talha
            </span>
          </div>
        </div>

        {/* Center: Current Module Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/60 border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-200 font-heading font-medium">
            {bengaliTitle}
          </span>
          {bengaliTitle !== title && (
            <span className="text-[10px] font-badge text-cyan-300/80">({title})</span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Main Cosmic Hub Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-badge font-medium text-cyan-200 bg-cyan-950/50 border border-cyan-500/40 hover:bg-cyan-900/60 hover:border-cyan-400 transition shadow-lg shadow-cyan-950/50 backdrop-blur-md group"
            title="Open side menu"
          >
            <Menu className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs">Cosmic Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          {/* Lock Gate */}
          <button
            onClick={handleLock}
            title="Lock chamber"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-white/5 hover:border-white/15 transition backdrop-blur-md"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: isInspectingGalaxy ? 0 : 1,
            y: isInspectingGalaxy ? 15 : 0,
            filter: isInspectingGalaxy ? "blur(10px)" : "blur(0px)",
            pointerEvents: isInspectingGalaxy ? "none" : "auto",
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </main>

      {/* Persistent Cosmic Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="font-heading tracking-widest text-slate-300 font-medium uppercase">
            Be Talha
          </span>
          <span className="text-slate-600">•</span>
          <span>Union of Roots & Fajr Dawn</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <span>May you have two wings. Be a winged morning star!</span>
        </div>
      </footer>

      {/* Cosmic Navigation Drawer */}
      <CosmicHubDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectModule={handleSelectModule}
        activeModule={activeModule || null}
        onLock={handleLock}
      />
    </div>
  );
}
