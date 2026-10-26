"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SecretGate } from "@/components/gate/SecretGate";
import { HeroSection } from "@/components/hero/HeroSection";
import { InteractiveGalaxy } from "@/components/canvas/InteractiveGalaxy";
import { CosmicHubDrawer, ModuleType } from "@/components/navigation/CosmicHubDrawer";
import { APP_CONFIG } from "@/lib/constants";
import { Compass } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [isInspectingGalaxy, setIsInspectingGalaxy] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(APP_CONFIG.localStorageKey);
      setIsUnlocked(stored === "unlocked");
    } catch {
      setIsUnlocked(false);
    }
  }, []);

  const handleUnlock = () => {
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
  };

  // Prevent flash of content during hydration
  if (isUnlocked === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#02040a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontFamily: "monospace",
          fontSize: "12px",
        }}
        className="min-h-screen bg-cosmic-950 flex items-center justify-center text-slate-500 font-mono text-xs"
      >
        <span className="animate-pulse">Aligning cosmic compass...</span>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen text-slate-100 overflow-x-hidden">
      {/* 360-Degree Interactive 3D Galaxy Canvas */}
      <InteractiveGalaxy onInspectChange={setIsInspectingGalaxy} />

      {/* Dynamic Screen Transition */}
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ duration: 0.6 }}
          >
            <SecretGate onUnlock={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="unlocked-dashboard"
            initial={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
            animate={{
              opacity: isInspectingGalaxy ? 0 : 1,
              scale: isInspectingGalaxy ? 0.96 : 1,
              filter: isInspectingGalaxy ? "blur(10px)" : "blur(0px)",
              pointerEvents: isInspectingGalaxy ? "none" : "auto",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col min-h-screen justify-between"
          >
            {/* The Horizon / Hero Section only */}
            <HeroSection
              onLock={handleLock}
              onOpenMenu={() => setIsMenuOpen(true)}
              onSelectModule={(mod) => {
                if (mod) router.push(`/${mod}`);
              }}
            />

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

            {/* Cosmic Navigation Hub Drawer */}
            <CosmicHubDrawer
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onSelectModule={(mod) => {
                setIsMenuOpen(false);
                if (mod) router.push(`/${mod}`);
              }}
              activeModule={null}
              onLock={handleLock}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
