"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Compass } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Cosmic orbit anomaly:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-rose-950/50 border border-rose-500/30 flex items-center justify-center mb-6 shadow-xl shadow-rose-950/40">
        <AlertTriangle className="w-8 h-8 text-rose-400" />
      </div>
      <h1 className="text-2xl font-heading font-bold text-white mb-2">
        Cosmic Orbit Disruption
      </h1>
      <p className="text-xs font-subheading text-slate-400 max-w-md mb-6 leading-relaxed">
        A temporary turbulence occurred in the celestial space. You can recalibrate the orbit or return to the sanctuary.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-badge text-xs transition shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Recalibrate Orbit</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 font-badge text-xs transition shadow"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
