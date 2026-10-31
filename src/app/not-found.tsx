import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-xl shadow-cyan-950/40">
        <Compass className="w-8 h-8 text-cyan-400 animate-spin-slow" />
      </div>
      <h1 className="text-3xl font-heading font-bold text-white mb-2">
        Coordinates Lost in Space (404)
      </h1>
      <p className="text-sm font-subheading text-slate-400 max-w-md mb-6">
        The star cluster you are seeking does not exist or has drifted away into the cosmic void.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-badge text-xs transition shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Horizon</span>
      </Link>
    </div>
  );
}
