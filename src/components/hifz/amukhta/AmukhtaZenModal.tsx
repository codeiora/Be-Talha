"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flame,
  Star,
  Repeat,
} from "lucide-react";
import { getSurahMeta, getAyahAudioUrl } from "@/lib/quranData";
import { ReciterId } from "@/types/hifz";

interface AmukhtaZenModalProps {
  surahNumber: number;
  onClose: () => void;
  onCompleteRevision: (surahNumber: number) => void;
}

// Fallback offline verses for instant rendering
const OFFLINE_AYAH_SAMPLE: Record<string, { arabic: string; translation: string }> = {
  "1:1": { arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে।" },
  "1:2": { arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "সমস্ত প্রশংসা জগৎসমূহের প্রতিপালক আল্লাহর জন্য।" },
  "1:3": { arabic: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "যিনি পরম করুণাময়, অসীম দয়ালু।" },
  "1:4": { arabic: "مَالِكِ يَوْمِ الدِّينِ", translation: "যিনি বিচার দিবসের অধিপতি।" },
  "1:5": { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "আমরা কেবল আপনারই ইবাদত করি এবং কেবল আপনারই কাছে সাহায্য চাই।" },
  "1:6": { arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "আমাদেরকে সরল পথ প্রদর্শন করুন।" },
  "1:7": { arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "তাদের পথ, যাদের আপনি অনুগ্রহ করেছেন; তাদের নয় যারা ক্রোধের শিকার, আর পথভ্রষ্টদেরও নয়।" },

  // Al-Mulk
  "67:1": { arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "বরকতময় তিনি যাঁর হাতে রয়েছে সকল কর্তৃত্ব, এবং তিনি সকল কিছুর ওপর ক্ষমতাবান।" },
  "67:2": { arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", translation: "যিনি সৃষ্টি করেছেন মৃত্যু ও জীবন, তোমাদের পরীক্ষা করার জন্য—কে তোমাদের মধ্যে কর্মে শ্রেষ্ঠ।" },
  "67:3": { arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ", translation: "যিনি সৃষ্টি করেছেন সপ্ত আকাশ স্তরে স্তরে। দয়াময়ের সৃষ্টিতে তুমি কোনো অসংগতি দেখতে পাবে না।" },

  // Al-Ikhlas
  "112:1": { arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "বলুন, তিনিই আল্লাহ, একক ও অদ্বিতীয়।" },
  "112:2": { arabic: "اللَّهُ الصَّمَدُ", translation: "আল্লাহ কারো মুখাপেক্ষী নন, সকলেই তাঁর মুখাপেক্ষী।" },
  "112:3": { arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "তিনি কাউকেও জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি।" },
  "112:4": { arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "এবং তাঁর সমকক্ষ কেউই নেই।" },

  // Al-Falaq
  "113:1": { arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translation: "বলুন, আমি আশ্রয় প্রার্থনা করছি উষার প্রতিপালকের।" },
  "113:2": { arabic: "مِن شَرِّ مَا خَلَقَ", translation: "তিনি যা সৃষ্টি করেছেন তার অনিষ্ট হতে।" },

  // An-Nas
  "114:1": { arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "বলুন, আমি আশ্রয় প্রার্থনা করছি মানুষের প্রতিপালকের।" },
  "114:2": { arabic: "مَلِكِ النَّاسِ", translation: "মানুষের অধিপতির।" },
  "114:3": { arabic: "إِلَٰهِ النَّاسِ", translation: "মানুষের প্রকৃত উপাস্যের।" },
};

export function AmukhtaZenModal({
  surahNumber,
  onClose,
  onCompleteRevision,
}: AmukhtaZenModalProps) {
  const meta = getSurahMeta(surahNumber);
  const totalAyahs = meta?.totalAyahs || 7;

  const [currentAyah, setCurrentAyah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciter, setReciter] = useState<ReciterId>("husary");
  const [takrarLoop, setTakrarLoop] = useState(1);
  const [arabicText, setArabicText] = useState("");
  const [translationText, setTranslationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background slow galaxy rotation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const galaxyParticles = Array.from({ length: 220 }, () => ({
      dist: Math.random() * (Math.min(w, h) * 0.45) + 30,
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() * 0.0008 + 0.0003) * (Math.random() > 0.5 ? 1 : -1),
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      color: Math.random() > 0.4 ? "#fef08a" : "#38bdf8",
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Deep space ambient radial gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) * 0.6);
      grad.addColorStop(0, "rgba(245, 158, 11, 0.04)");
      grad.addColorStop(0.4, "rgba(56, 189, 248, 0.03)");
      grad.addColorStop(1, "rgba(2, 6, 23, 0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Rotate galaxy stars
      for (let i = 0; i < galaxyParticles.length; i++) {
        const p = galaxyParticles[i];
        p.angle += p.speed;

        const x = w / 2 + Math.cos(p.angle) * p.dist;
        const y = h / 2 + Math.sin(p.angle) * p.dist * 0.6; // subtle elliptical tilt

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Fetch Ayah Text
  useEffect(() => {
    let cancelled = false;
    const key = `${surahNumber}:${currentAyah}`;

    if (OFFLINE_AYAH_SAMPLE[key]) {
      setArabicText(OFFLINE_AYAH_SAMPLE[key].arabic);
      setTranslationText(OFFLINE_AYAH_SAMPLE[key].translation);
      return;
    }

    setIsLoading(true);
    fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${currentAyah}/editions/quran-uthmani,bn.bengali`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.code === 200 && data.data?.length >= 2) {
          setArabicText(data.data[0].text);
          setTranslationText(data.data[1].text);
        } else if (!cancelled && OFFLINE_AYAH_SAMPLE[`${surahNumber}:1`]) {
          setArabicText(OFFLINE_AYAH_SAMPLE[`${surahNumber}:1`].arabic);
          setTranslationText(OFFLINE_AYAH_SAMPLE[`${surahNumber}:1`].translation);
        } else if (!cancelled) {
          setArabicText(`آية رقم ${currentAyah} من سورة ${meta?.nameArabic}`);
          setTranslationText(`সূরা ${meta?.nameBangla}-এর ${currentAyah} নম্বর আয়াত।`);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setArabicText(`آية رقم ${currentAyah} من سورة ${meta?.nameArabic}`);
          setTranslationText(`সূরা ${meta?.nameBangla}-এর ${currentAyah} নম্বর আয়াত।`);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [surahNumber, currentAyah, meta]);

  // Audio setup
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = getAyahAudioUrl(surahNumber, currentAyah, reciter);

    const handleEnded = () => {
      if (currentAyah < totalAyahs) {
        setCurrentAyah((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [surahNumber, currentAyah, reciter]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const nextAyah = () => {
    if (currentAyah < totalAyahs) setCurrentAyah((a) => a + 1);
  };

  const prevAyah = () => {
    if (currentAyah > 1) setCurrentAyah((a) => a - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950/95 backdrop-blur-2xl">
      {/* Background Rotating Galaxy Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Main Focus Container */}
      <div className="relative z-10 w-full max-w-4xl p-6 sm:p-10 rounded-3xl bg-slate-950/80 border border-amber-500/30 shadow-[0_0_80px_rgba(245,158,11,0.15)] flex flex-col justify-between min-h-[600px] max-h-[92vh] overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-badge px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Zen Daur Mode
                </span>
                <span className="text-xs font-badge text-slate-400">
                  পারা {meta?.juzNumber} • {meta?.totalAyahs} আয়াত
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mt-0.5">
                {meta?.nameEnglish}{" "}
                <span className="text-base font-bengali font-normal text-amber-400">
                  ({meta?.nameBangla})
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reciter Toggle */}
            <button
              onClick={() => setReciter((r) => (r === "husary" ? "alafasy" : "husary"))}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-badge text-slate-300 hover:text-white transition"
              title="Switch Reciter"
            >
              🎙️ {reciter === "husary" ? "Al-Husary" : "Al-Afasy"}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition"
              title="Close Zen Mode"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Arabic Typography & Translation */}
        <div className="my-8 text-center space-y-6">
          <div className="text-xs font-badge text-amber-300/80 flex items-center justify-center gap-2">
            <span>আয়াত {currentAyah} / {totalAyahs}</span>
            <span>•</span>
            <span className="text-slate-400">তিকরার চক্র: {takrarLoop} বার সম্পন্ন</span>
          </div>

          {/* Majestic Arabic Text */}
          <div className="min-h-[160px] flex items-center justify-center px-4">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-arabic text-white leading-loose tracking-wide selection:bg-amber-500/30"
              dir="rtl"
            >
              {isLoading ? (
                <span className="text-slate-500 text-lg animate-pulse font-sans">
                  আয়াত লোড হচ্ছে...
                </span>
              ) : (
                arabicText
              )}
            </h1>
          </div>

          {/* Bengali Translation */}
          <p className="text-sm sm:text-base font-bengali text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {translationText}
          </p>

          {/* Ayah Navigation Dots */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-xl mx-auto pt-2">
            {Array.from({ length: Math.min(totalAyahs, 30) }, (_, i) => i + 1).map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentAyah(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentAyah
                    ? "bg-amber-400 scale-125 shadow-[0_0_8px_#f59e0b]"
                    : idx < currentAyah
                    ? "bg-emerald-500/60"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
                title={`আয়াত ${idx}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Audio Player & Completion Toolbar */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Audio Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevAyah}
                disabled={currentAyah <= 1}
                className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 transition"
                title="পূর্ববর্তী আয়াত"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={toggleAudio}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-badge font-bold transition shadow-md shadow-amber-950/40"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>পজ অডিও</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>তিলাওয়াত শুনুন</span>
                  </>
                )}
              </button>

              <button
                onClick={nextAyah}
                disabled={currentAyah >= totalAyahs}
                className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 transition"
                title="পরবর্তী আয়াত"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Takrar Increment */}
              <button
                onClick={() => setTakrarLoop((l) => l + 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-badge text-slate-300 hover:text-white transition"
                title="তিকরার কাউন্ট বাড়ান"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>+১ তিকরার ({takrarLoop})</span>
              </button>
            </div>

            {/* Grand Action: Complete Revision & Supernova */}
            <button
              onClick={() => onCompleteRevision(surahNumber)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-badge font-bold transition shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>আলহামদুলিল্লাহ, রিভিশন সম্পন্ন (নূর পুনরুজ্জীবিত করুন)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
