"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { SecretGate } from "@/components/gate/SecretGate";
import { HeroSection } from "@/components/hero/HeroSection";
import { GalaxyScrollytelling } from "@/components/canvas/GalaxyScrollytelling";

// Dynamically import heavy Three.js 3D WebGL background to prevent SSR blocking and hydration freezing
const InteractiveGalaxy = dynamic(
  () => import("@/components/canvas/InteractiveGalaxy"),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#02040a] -z-10" />,
  }
);

import { CosmicHubDrawer } from "@/components/navigation/CosmicHubDrawer";
import { APP_CONFIG } from "@/lib/constants";
import { Compass } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [hasCompletedJourney, setHasCompletedJourney] = useState<boolean>(false);
  const [isInspectingGalaxy, setIsInspectingGalaxy] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(APP_CONFIG.localStorageKey);
      const unlocked = stored === "unlocked";
      setIsUnlocked(unlocked);
      // Check if user already completed the cinematic voyage in this session
      const journeySeen = sessionStorage.getItem("talha_cosmic_voyage_completed");
      if (journeySeen === "true") {
        setHasCompletedJourney(true);
      }
    } catch {
      setIsUnlocked(false);
      setHasCompletedJourney(false);
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    // On fresh unlock, user starts the 3D cinematic universe journey
    setHasCompletedJourney(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleLock = () => {
    try {
      localStorage.removeItem(APP_CONFIG.localStorageKey);
      sessionStorage.removeItem("talha_cosmic_voyage_completed");
    } catch (err) {
      console.error("Lock error:", err);
    }
    setIsUnlocked(false);
    setHasCompletedJourney(false);
    setIsMenuOpen(false);
  };

  const handleCompleteJourney = () => {
    try {
      sessionStorage.setItem("talha_cosmic_voyage_completed", "true");
    } catch {}
    window.scrollTo({ top: 0, behavior: "instant" });
    setHasCompletedJourney(true);
  };

  const handleReplayJourney = () => {
    try {
      sessionStorage.removeItem("talha_cosmic_voyage_completed");
    } catch {}
    window.scrollTo({ top: 0, behavior: "instant" });
    setHasCompletedJourney(false);
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
    <div className="relative isolate min-h-screen text-slate-100 bg-[#02040a]">
      {/* Dynamic Screen Transition */}
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          // 1. GATE VIEW: Secret Gate authentication screen
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ duration: 0.6 }}
          >
            <SecretGate onUnlock={handleUnlock} />
          </motion.div>
        ) : !hasCompletedJourney ? (
          // 2. SCROLLYTELLING JOURNEY: Pinned Fullscreen 360-Frame Cinematic Voyage
          <div key="cosmic-scrollytelling" className="relative w-full">
            <GalaxyScrollytelling onComplete={handleCompleteJourney} />
          </div>
        ) : (
          // 3. OPTION A ARRIVAL: Grand Reveal of Interactive 3D Galaxy Canvas + Sanctuary Dashboard
          <motion.div
            key="unlocked-dashboard"
            initial={false}
            animate={{
              opacity: isInspectingGalaxy ? 0 : 1,
              scale: isInspectingGalaxy ? 0.96 : 1,
              filter: isInspectingGalaxy ? "blur(10px)" : "blur(0px)",
              pointerEvents: isInspectingGalaxy ? "none" : "auto",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col min-h-screen justify-between overflow-x-hidden"
          >
            {/* 360-Degree Interactive 3D Galaxy Canvas (Mounted live in Sanctuary) */}
            <InteractiveGalaxy onInspectChange={setIsInspectingGalaxy} />

            {/* The Horizon / Hero Section */}
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

              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <button
                  onClick={handleReplayJourney}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-slate-500 hover:underline"
                >
                  Relive Universe Flythrough
                </button>
                <span>•</span>
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
