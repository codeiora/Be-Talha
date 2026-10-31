"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Sparkles,
  CheckCircle2,
  PenLine,
  X,
  Settings,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { HifzSurahMeta, ReciterId } from "@/types/hifz";
import { QURAN_SURAHS, getAyahAudioUrl, getSurahMeta } from "@/lib/quranData";

interface ZenFocusModeProps {
  initialSurahNumber?: number;
  initialAyahNumber?: number;
  reciter: ReciterId;
  onClose: () => void;
  onOpenReflection: (surahNumber: number, ayahNumber: number, text?: string) => void;
  onToggleMemorized?: (surahNumber: number, ayahNumber: number) => void;
  isMemorized?: boolean;
}

// Fallback offline database for instant rendering without waiting for network
const OFFLINE_AYAH_SAMPLE: Record<string, { arabic: string; translation: string }> = {
  // Al-Fatihah
  "1:1": { arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  "1:2": { arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "All praise is due to Allah, Lord of the worlds." },
  "1:3": { arabic: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful." },
  "1:4": { arabic: "مَالِكِ يَوْمِ الدِّينِ", translation: "Sovereign of the Day of Recompense." },
  "1:5": { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help." },
  "1:6": { arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path." },
  "1:7": { arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." },

  // Al-Mulk 1-3
  "67:1": { arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "Blessed is He in whose hand is dominion, and He is over all things competent." },
  "67:2": { arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", translation: "He who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving." },
  "67:3": { arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ", translation: "Who created seven heavens in layers. You see not in the creation of the Most Merciful any inconsistency." },

  // Al-Ikhlas
  "112:1": { arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, He is Allah, [who is] One." },
  "112:2": { arabic: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge." },
  "112:3": { arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "He neither begets nor is born." },
  "112:4": { arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "Nor is there to Him any equivalent." },
};

export function ZenFocusMode({
  initialSurahNumber = 1,
  initialAyahNumber = 1,
  reciter = "husary",
  onClose,
  onOpenReflection,
  onToggleMemorized,
  isMemorized = false,
}: ZenFocusModeProps) {
  const [currentSurahNum, setCurrentSurahNum] = useState<number>(initialSurahNumber);
  const [currentAyahNum, setCurrentAyahNum] = useState<number>(initialAyahNumber);
  const [activeReciter, setActiveReciter] = useState<ReciterId>(reciter);

  // Quran Ayah Text & Translation state
  const [arabicText, setArabicText] = useState<string>("");
  const [translationText, setTranslationText] = useState<string>("");
  const [isLoadingAyah, setIsLoadingAyah] = useState(false);

  // Audio Playback & Takrar Loop state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [takrarTarget, setTakrarTarget] = useState<number>(5); // repeat 5x by default
  const [takrarCurrentLoop, setTakrarCurrentLoop] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const surahMeta = getSurahMeta(currentSurahNum) || QURAN_SURAHS[0];

  // Fetch Ayah Text (Online with fallback to offline or placeholder)
  useEffect(() => {
    let isCancelled = false;
    const cacheKey = `${currentSurahNum}:${currentAyahNum}`;

    if (OFFLINE_AYAH_SAMPLE[cacheKey]) {
      setArabicText(OFFLINE_AYAH_SAMPLE[cacheKey].arabic);
      setTranslationText(OFFLINE_AYAH_SAMPLE[cacheKey].translation);
      return;
    }

    setIsLoadingAyah(true);
    fetch(`https://api.alquran.cloud/v1/ayah/${currentSurahNum}:${currentAyahNum}/editions/quran-uthmani,en.sahih`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data.code === 200 && data.data?.length >= 2) {
          setArabicText(data.data[0].text);
          setTranslationText(data.data[1].text);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setArabicText(`آية رقم ${currentAyahNum} من سورة ${surahMeta.nameArabic}`);
          setTranslationText(`Verse ${currentAyahNum} of Surah ${surahMeta.nameEnglish}.`);
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingAyah(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [currentSurahNum, currentAyahNum, surahMeta]);

  // Audio setup and looping logic
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = getAyahAudioUrl(currentSurahNum, currentAyahNum, activeReciter);
    audio.playbackRate = playbackSpeed;

    const handleEnded = () => {
      if (takrarTarget === 0 || takrarCurrentLoop < takrarTarget) {
        // Repeat current ayah
        setTakrarCurrentLoop((prev) => prev + 1);
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        // Takrar cycle finished for this ayah
        setTakrarCurrentLoop(1);
        if (autoAdvance && currentAyahNum < surahMeta.totalAyahs) {
          setCurrentAyahNum((a) => a + 1);
        } else {
          setIsPlaying(false);
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentSurahNum, currentAyahNum, activeReciter, takrarCurrentLoop, takrarTarget, autoAdvance, playbackSpeed, surahMeta.totalAyahs]);

  // Audio Play/Pause trigger
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch((e) => console.log("Audio play error:", e));
    }
  };

  const handleNextAyah = () => {
    if (currentAyahNum < surahMeta.totalAyahs) {
      if (audioRef.current) audioRef.current.pause();
      setTakrarCurrentLoop(1);
      setCurrentAyahNum((prev) => prev + 1);
    }
  };

  const handlePrevAyah = () => {
    if (currentAyahNum > 1) {
      if (audioRef.current) audioRef.current.pause();
      setTakrarCurrentLoop(1);
      setCurrentAyahNum((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextAyah();
      if (e.key === "ArrowLeft") handlePrevAyah();
      if (e.key === " " && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#02040a] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Stardust Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent" />

      {/* Top Ambient Bar */}
      <div className="relative z-20 px-6 py-5 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-badge tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zen Hifz Canvas</span>
          </span>

          {/* Surah Dropdown Selector */}
          <select
            value={currentSurahNum}
            onChange={(e) => {
              setCurrentSurahNum(Number(e.target.value));
              setCurrentAyahNum(1);
              setTakrarCurrentLoop(1);
              if (audioRef.current) audioRef.current.pause();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-badge text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {QURAN_SURAHS.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.nameEnglish} ({s.nameArabic})
              </option>
            ))}
          </select>
        </div>

        {/* Reciter Toggle & Exit */}
        <div className="flex items-center gap-3">
          {/* Reciter Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/5 text-[11px] font-badge">
            <button
              onClick={() => setActiveReciter("husary")}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeReciter === "husary"
                  ? "bg-cyan-500/30 text-cyan-200 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Al-Husary (Tajweed)
            </button>
            <button
              onClick={() => setActiveReciter("alafasy")}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeReciter === "alafasy"
                  ? "bg-amber-500/30 text-amber-200 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Alafasy (Melodic)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition"
            title="Exit Focus Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Sanctuary: Center Arabic & Meaning Canvas */}
      <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 flex flex-col justify-center items-center text-center space-y-8">
        {/* Ayah Navigation Indicator */}
        <div className="flex items-center gap-4 text-xs font-badge text-slate-400">
          <button
            onClick={handlePrevAyah}
            disabled={currentAyahNum === 1}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span>
            <span className="font-heading text-slate-200">{surahMeta.nameEnglish}</span> • Verse{" "}
            <span className="text-cyan-300 font-bold">{currentAyahNum}</span> / {surahMeta.totalAyahs}
          </span>

          <button
            onClick={handleNextAyah}
            disabled={currentAyahNum === surahMeta.totalAyahs}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Arabic Verse Display */}
        <motion.div
          key={`${currentSurahNum}-${currentAyahNum}`}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full space-y-6"
        >
          <div className="py-4">
            <h2
              dir="rtl"
              lang="ar"
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-amber-100/95 leading-[2.1] md:leading-[2.2] tracking-wide select-text drop-shadow-[0_2px_12px_rgba(250,204,21,0.15)]"
              style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
            >
              {arabicText || "..."}
              <span className="inline-block text-2xl sm:text-3xl text-amber-400/80 mx-3 font-serif">
                ۝{currentAyahNum}
              </span>
            </h2>
          </div>

          {/* Translation */}
          <p className="text-base sm:text-lg text-slate-300/90 font-subheading max-w-2xl mx-auto leading-relaxed italic">
            &ldquo;{translationText}&rdquo;
          </p>
        </motion.div>

        {/* Action Button: Tadabbur Reflection Note */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenReflection(currentSurahNum, currentAyahNum, arabicText)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-badge font-medium text-purple-200 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 transition shadow-sm"
          >
            <PenLine className="w-3.5 h-3.5 text-purple-400" />
            <span>Reflect (Tadabbur Journal)</span>
          </button>

          {onToggleMemorized && (
            <button
              onClick={() => onToggleMemorized(currentSurahNum, currentAyahNum)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-badge font-medium transition border ${
                isMemorized
                  ? "bg-emerald-950/60 text-emerald-200 border-emerald-500/40"
                  : "bg-white/5 text-slate-300 hover:text-white border-white/10"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isMemorized ? "✓ Memorized" : "Mark Memorized"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Bar (Takrar & Audio Player) */}
      <div className="relative z-20 w-full max-w-2xl mx-auto px-6 py-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl rounded-t-3xl shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Takrar Loop Controller */}
          <div className="flex items-center gap-2 text-xs font-badge">
            <span className="text-slate-400 flex items-center gap-1 font-subheading">
              <Repeat className="w-3.5 h-3.5 text-cyan-400" />
              <span>Loop:</span>
            </span>

            {[1, 3, 5, 10, 20].map((count) => (
              <button
                key={count}
                onClick={() => {
                  setTakrarTarget(count);
                  setTakrarCurrentLoop(1);
                }}
                className={`px-2.5 py-1 rounded-lg transition ${
                  takrarTarget === count
                    ? "bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40"
                    : "text-slate-500 hover:text-slate-300 bg-white/5"
                }`}
              >
                {count}x
              </button>
            ))}

            {takrarTarget > 1 && (
              <span className="text-[11px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-badge">
                {takrarCurrentLoop} / {takrarTarget}
              </span>
            )}
          </div>

          {/* Primary Playback Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevAyah}
              disabled={currentAyahNum === 1}
              className="p-2.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
              title="Previous Verse"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-amber-300 hover:scale-105 transition-transform flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20"
              title={isPlaying ? "Pause" : "Play Recitation"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextAyah}
              disabled={currentAyahNum === surahMeta.totalAyahs}
              className="p-2.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
              title="Next Verse"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed & Auto-advance */}
          <div className="flex items-center gap-2 text-xs font-badge">
            <button
              onClick={() => setPlaybackSpeed((s) => (s === 1 ? 0.85 : 1))}
              className={`px-2.5 py-1 rounded-lg transition border ${
                playbackSpeed === 0.85
                  ? "bg-amber-500/30 text-amber-200 border-amber-400/40"
                  : "bg-white/5 text-slate-400 border-transparent hover:text-white"
              }`}
              title="Slow Tajweed practice pace"
            >
              {playbackSpeed}x Speed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
