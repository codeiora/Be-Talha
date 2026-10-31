"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Plus,
  X,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Compass,
  Check,
  Calendar,
  Lock,
  Unlock,
  Trash2,
  Star,
  ExternalLink,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  SabqiItem,
  SabqiConfidenceRating,
  SabaqDailyRoutine,
  HifzSurahProgress,
  ReciterId,
} from "@/types/hifz";
import {
  loadDailyRoutine,
  saveDailyRoutine,
  loadSabqiItems,
  saveSabqiItems,
  addSabqiItem,
  updateSabqiRating,
  deleteSabqiItem,
  loadHifzSettings,
  getInitialSabqiItems,
} from "@/lib/hifzStorage";
import { QURAN_SURAHS, getSurahMeta, getAyahAudioUrl } from "@/lib/quranData";
import confetti from "canvas-confetti";

interface AyahData {
  number: number;
  arabic: string;
  translationEn: string;
  translationBn?: string;
  isLoading?: boolean;
}

// Built-in offline Quran text & English translations for instant response
const OFFLINE_AYAH_SAMPLE: Record<string, { arabic: string; en: string }> = {
  // Surah Al-Fatihah
  "1:1": { arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  "1:2": { arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "[All] praise is [due] to Allah, Lord of the worlds -" },
  "1:3": { arabic: "الرَّحْمَٰنِ الرَّحِيمِ", en: "The Entirely Merciful, the Especially Merciful," },
  "1:4": { arabic: "مَالِكِ يَوْمِ الدِّينِ", en: "Sovereign of the Day of Recompense." },
  "1:5": { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", en: "It is You we worship and You we ask for help." },
  "1:6": { arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", en: "Guide us to the straight path -" },
  "1:7": { arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", en: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." },

  // Surah Al-Mulk (1-10)
  "67:1": { arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", en: "Blessed is He in whose hand is dominion, and He is over all things competent -" },
  "67:2": { arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ الْعَزِيزُ الْغَفُورُ", en: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -" },
  "67:3": { arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ", en: "[And] who created seven heavens in layers. You see no flaw in the creation of the Most Merciful. So turn your vision again; can you see any break?" },
  "67:4": { arabic: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ", en: "Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued." },
  "67:5": { arabic: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ", en: "And We have certainly beautified the nearest heaven with stars and made them missiles for devils and have prepared for them the punishment of the Blaze." },
  "67:6": { arabic: "وَلِلَّذِينَ كَفَرُوا بِرَبِّهِمْ عَذَابُ جَهَنَّمَ وَبِئْسَ الْمَصِيرُ", en: "And for those who disbelieved in their Lord is the punishment of Hell, and wretched is the destination." },
  "67:7": { arabic: "إِذَا أُلْقُوا فِيهَا سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ", en: "When they are thrown into it, they hear from it a dreadful inhaling while it boils up." },
  "67:8": { arabic: "تَكَادُ تَمَيَّزُ مِنَ الْغَيْظِ كُلَّمَا أُلْقِيَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَا أَلَمْ يَأْتِكُمْ نَذِيرٌ", en: "It almost bursts with rage. Every time a company is thrown into it, its keepers ask them, 'Did there not come to you a warner?'" },
  "67:9": { arabic: "قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ اللَّهُ مِن شَيْءٍ إِنْ أَنتُمْ إِلَّا فِي ضَلَالٍ كَبِيرٍ", en: "They will say,'Yes, a warner had come to us, but we denied and said, 'Allah has not sent down anything. You are not except in great error.'' " },
  "67:10": { arabic: "وَقَالُوا لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِي أَصْحَابِ السَّعِيرِ", en: "And they will say, 'If only we had been listening or reasoning, we would not be among the companions of the Blaze.'" },

  // Surah Al-Ikhlas
  "112:1": { arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", en: "Say, 'He is Allah, [who is] One," },
  "112:2": { arabic: "اللَّهُ الصَّمَدُ", en: "Allah, the Eternal Refuge." },
  "112:3": { arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", en: "He neither begets nor is born," },
  "112:4": { arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", en: "Nor is there to Him any equivalent.'" },

  // Surah Al-Falaq
  "113:1": { arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", en: "Say, 'I seek refuge in the Lord of daybreak" },
  "113:2": { arabic: "مِن شَرِّ مَا خَلَقَ", en: "From the evil of that which He created" },
  "113:3": { arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", en: "And from the evil of darkness when it settles" },
  "113:4": { arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", en: "And from the evil of the blowers in knots" },
  "113:5": { arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", en: "And from the evil of an envier when he envies.'" },

  // Surah An-Nas
  "114:1": { arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", en: "Say, 'I seek refuge in the Lord of mankind," },
  "114:2": { arabic: "مَلِكِ النَّاسِ", en: "The Sovereign of mankind," },
  "114:3": { arabic: "إِلَٰهِ النَّاسِ", en: "The God of mankind," },
  "114:4": { arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", en: "From the evil of the retreating whisperer -" },
  "114:5": { arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", en: "Who whispers [evil] into the breasts of mankind -" },
  "114:6": { arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", en: "From among the jinn and mankind.'" },
};

export function SabqiOrbit() {
  const [routine, setRoutine] = useState<SabaqDailyRoutine | null>(null);
  const [sabqiList, setSabqiList] = useState<SabqiItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "weak" | "hesitated" | "smooth" | "unrated">("all");

  // Segment 2: Global Blind Test Toggle
  const [isGlobalBlindTest, setIsGlobalBlindTest] = useState(true);

  // Active Practice / Review Modal
  const [activeReviewItem, setActiveReviewItem] = useState<SabqiItem | null>(null);
  const [activeAyahs, setActiveAyahs] = useState<AyahData[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);
  const [reviewViewMode, setReviewViewMode] = useState<"mushaf" | "cards">("mushaf");
  const [focusedMushafAyah, setFocusedMushafAyah] = useState<number | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  // Per-ayah revealed states in blind test mode: Set of ayah numbers currently peeked/unblurred
  const [revealedAyahs, setRevealedAyahs] = useState<Set<number>>(new Set());

  // Audio playback state
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [reciter, setReciter] = useState<ReciterId>("husary");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Add Custom Sabqi Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customSurah, setCustomSurah] = useState<number>(67);
  const [customStart, setCustomStart] = useState<number>(1);
  const [customEnd, setCustomEnd] = useState<number>(10);
  const [customNotes, setCustomNotes] = useState<string>("");

  // Initialize
  useEffect(() => {
    setRoutine(loadDailyRoutine());
    const items = loadSabqiItems();
    setSabqiList(items);

    const settings = loadHifzSettings();
    if (settings.preferredReciter) {
      setReciter(settings.preferredReciter);
    }
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Prevent background scrolling when side panel or modal is open (Body Scroll Lock)
  useEffect(() => {
    if (activeReviewItem || isAddModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
      };
    }
  }, [activeReviewItem, isAddModalOpen]);

  // Segment 1 & Segment 3 Core Rule:
  // Sort cards strictly such that:
  // 1. All "Weak" portions are prioritized at the VERY TOP!
  // 2. "Hesitated" portions
  // 3. Unrated portions
  // 4. "Smooth" portions
  // Within each group, sorted by completedAt (most recent first)
  const sortedAndFilteredList = useMemo(() => {
    let filtered = [...sabqiList];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const meta = getSurahMeta(item.surahNumber);
        if (!meta) return false;
        return (
          meta.nameEnglish.toLowerCase().includes(q) ||
          meta.nameArabic.includes(q) ||
          String(item.surahNumber).includes(q) ||
          `ayah ${item.ayahStart}-${item.ayahEnd}`.includes(q)
        );
      });
    }

    // Filter by confidence rating tab
    if (statusFilter !== "all") {
      if (statusFilter === "unrated") {
        filtered = filtered.filter((item) => !item.confidenceRating);
      } else {
        filtered = filtered.filter((item) => item.confidenceRating === statusFilter);
      }
    }

    // Priority weights: weak (0) -> hesitated (1) -> unrated (2) -> smooth (3)
    const getWeight = (rating?: SabqiConfidenceRating | null) => {
      if (rating === "weak") return 0; // Highest priority -> stays at the top!
      if (rating === "hesitated") return 1;
      if (!rating) return 2;
      return 3; // smooth
    };

    return filtered.sort((a, b) => {
      const weightA = getWeight(a.confidenceRating);
      const weightB = getWeight(b.confidenceRating);

      if (weightA !== weightB) {
        return weightA - weightB;
      }
      return b.completedAt - a.completedAt;
    });
  }, [sabqiList, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = sabqiList.length;
    const weakCount = sabqiList.filter((s) => s.confidenceRating === "weak").length;
    const hesitatedCount = sabqiList.filter((s) => s.confidenceRating === "hesitated").length;
    const smoothCount = sabqiList.filter((s) => s.confidenceRating === "smooth").length;
    const unratedCount = sabqiList.filter((s) => !s.confidenceRating).length;

    const scoredTotal = total > 0 ? total : 1;
    const stabilityScore = Math.max(
      0,
      Math.min(100, Math.round(((smoothCount * 1.0 + hesitatedCount * 0.5) / scoredTotal) * 100))
    );

    return { total, weakCount, hesitatedCount, smoothCount, unratedCount, stabilityScore };
  }, [sabqiList]);

  // Handle Routine Checkmark
  const handleToggleDailySabqi = () => {
    if (!routine) return;
    const updated: SabaqDailyRoutine = {
      ...routine,
      sabqiCompleted: !routine.sabqiCompleted,
    };
    setRoutine(updated);
    saveDailyRoutine(updated);

    if (!routine.sabqiCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#38bdf8", "#06b6d4", "#ffffff"],
        });
      } catch {
        // ignore
      }
    }
  };

  // Segment 3: Handle Confidence Rating (Strength Meter)
  const handleRateStrength = (item: SabqiItem, rating: SabqiConfidenceRating) => {
    const updated = updateSabqiRating(item.id, rating);
    setSabqiList([...updated]);

    if (activeReviewItem && activeReviewItem.id === item.id) {
      setActiveReviewItem({
        ...activeReviewItem,
        confidenceRating: rating,
        confidenceRatedAt: Date.now(),
        lastRevisedAt: Date.now(),
      });
    }

    if (rating === "smooth") {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.65 },
          colors: ["#10b981", "#38bdf8", "#fbbf24"],
        });
      } catch {
        // ignore
      }
    }
  };

  // Delete / Graduate to Amukhta
  const handleDeleteItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = deleteSabqiItem(id);
    setSabqiList(updated);
    if (activeReviewItem?.id === id) {
      setActiveReviewItem(null);
    }
  };

  // Open Review / Revision Mode for a specific card
  const handleOpenReview = async (item: SabqiItem) => {
    setActiveReviewItem(item);
    setRevealedAyahs(new Set()); // Reset peeked ayahs
    setFocusedMushafAyah(item.ayahStart);
    setIsLoadingAyahs(true);

    const surahNum = item.surahNumber;
    const start = item.ayahStart;
    const end = item.ayahEnd;
    const results: AyahData[] = [];

    for (let a = start; a <= end; a++) {
      const cacheKey = `${surahNum}:${a}`;
      const localKey = `be_talha_ayah_cache_${surahNum}_${a}`;

      // 1. Check Offline Sample
      if (OFFLINE_AYAH_SAMPLE[cacheKey]) {
        results.push({
          number: a,
          arabic: OFFLINE_AYAH_SAMPLE[cacheKey].arabic,
          translationEn: OFFLINE_AYAH_SAMPLE[cacheKey].en,
        });
        continue;
      }

      // 2. Check localStorage cache
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem(localKey);
          if (cached) {
            results.push(JSON.parse(cached));
            continue;
          }
        } catch {
          // ignore
        }
      }

      // 3. Fetch from Quran API
      try {
        const res = await fetch(
          `https://api.alquran.cloud/v1/ayah/${surahNum}:${a}/editions/quran-uthmani,en.sahih`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.code === 200 && json.data?.length >= 2) {
            const itemData: AyahData = {
              number: a,
              arabic: json.data[0].text,
              translationEn: json.data[1].text,
            };
            results.push(itemData);
            try {
              localStorage.setItem(localKey, JSON.stringify(itemData));
            } catch {
              // ignore
            }
            continue;
          }
        }
      } catch {
        // network fallback
      }

      // Fallback placeholder
      results.push({
        number: a,
        arabic: `الْآيَةُ ${a}`,
        translationEn: `Ayah ${a} of Surah #${surahNum}`,
      });
    }

    setActiveAyahs(results);
    setIsLoadingAyahs(false);
  };

  // Segment 2: Click to peek / unblur a specific Ayah when stuck
  const handleToggleAyahPeek = (ayahNumber: number) => {
    setRevealedAyahs((prev) => {
      const next = new Set(prev);
      if (next.has(ayahNumber)) {
        next.delete(ayahNumber); // re-blur
      } else {
        next.add(ayahNumber); // reveal!
      }
      return next;
    });
  };

  const handleRevealAll = () => {
    const all = new Set(activeAyahs.map((a) => a.number));
    setRevealedAyahs(all);
  };

  const handleBlurAll = () => {
    setRevealedAyahs(new Set());
  };

  // Play audio recitation for an ayah
  const handlePlayAudio = (ayahNum: number) => {
    if (!activeReviewItem) return;

    if (playingAyah === ayahNum) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAyah(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const url = getAyahAudioUrl(activeReviewItem.surahNumber, ayahNum, reciter);
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingAyah(ayahNum);

    audio.onended = () => {
      setPlayingAyah(null);
    };
    audio.onerror = () => {
      setPlayingAyah(null);
    };

    audio.play().catch(() => {
      setPlayingAyah(null);
    });
  };

  // Add Custom Sabqi Handler
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const meta = getSurahMeta(customSurah);
    const maxAyahs = meta?.totalAyahs || 7;
    const start = Math.max(1, Math.min(customStart, maxAyahs));
    const end = Math.max(start, Math.min(customEnd, maxAyahs));

    const updated = addSabqiItem({
      surahNumber: customSurah,
      ayahStart: start,
      ayahEnd: end,
      completedAt: Date.now(),
      notes: customNotes.trim() || undefined,
      isCustom: true,
    });

    setSabqiList([...updated]);
    setIsAddModalOpen(false);
    setCustomNotes("");
  };

  const calculateDaysAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Completed today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
  };

  return (
    <div className="space-y-8">
      {/* -------------------------------------------------------------------------- */}
      {/* Hero Header Banner: Stabilizing the Orbit Theme                            */}
      {/* -------------------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
        {/* Arabic Calligraphy Watermark */}
        <div className="absolute -bottom-8 -right-6 text-9xl font-serif text-cyan-400/[0.04] pointer-events-none select-none">
          سبقي
        </div>

        {/* Orbit Rings Background Effect */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full border border-cyan-500/10 animate-spin-slow pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full border border-cyan-400/15 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-badge">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pillar 02 • Orbit Stabilizer (Recent Retention)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
              Sabqi Orbit{" "}
              <span className="text-xl sm:text-2xl font-serif text-cyan-400/90 font-normal">
                (سبقي — Stabilizing the Orbit)
              </span>
            </h1>

            <p className="text-sm font-subheading text-slate-300 max-w-2xl leading-relaxed">
              Consolidate portions memorized over the last 7 to 15 days before short-term memory decays.
              Regular revision prevents forgetting and anchors newly formed constellations into permanent memory.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-badge font-semibold bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Custom Sabqi</span>
            </button>

            <button
              onClick={handleToggleDailySabqi}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-badge font-semibold transition shadow-xl active:scale-95 ${
                routine?.sabqiCompleted
                  ? "bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-cyan-500/30"
                  : "bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 shadow-md"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{routine?.sabqiCompleted ? "Sabqi Revised Today ✓" : "Mark Sabqi Revised"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
          {/* Orbit Stability Score */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-badge text-slate-400">
              <span>Orbit Stability</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-heading font-bold text-cyan-300">
                {stats.stabilityScore}%
              </span>
              <span className="text-[10px] font-badge text-slate-400">
                {stats.stabilityScore >= 80 ? "Stable Orbit ✨" : stats.stabilityScore >= 50 ? "Stabilizing ⏳" : "Needs Attention ⚠️"}
              </span>
            </div>
          </div>

          {/* Weak Items Alert */}
          <div className={`p-3.5 rounded-2xl border space-y-1 ${
            stats.weakCount > 0
              ? "bg-rose-950/40 border-rose-500/40 shadow-sm shadow-rose-950/40"
              : "bg-slate-900/60 border-white/5"
          }`}>
            <div className="flex items-center justify-between text-xs font-badge text-slate-400">
              <span className={stats.weakCount > 0 ? "text-rose-300" : ""}>Weak (Priority)</span>
              <ShieldAlert className={`w-3.5 h-3.5 ${stats.weakCount > 0 ? "text-rose-400 animate-pulse" : "text-slate-500"}`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-heading font-bold ${stats.weakCount > 0 ? "text-rose-400" : "text-slate-200"}`}>
                {stats.weakCount}
              </span>
              <span className="text-[10px] font-badge text-slate-400">
                {stats.weakCount > 0 ? "Prioritized at top" : "All sound ✓"}
              </span>
            </div>
          </div>

          {/* Hesitated Items */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-badge text-slate-400">
              <span>Hesitated</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-heading font-bold text-amber-300">
                {stats.hesitatedCount}
              </span>
              <span className="text-[10px] font-badge text-slate-400">Extra loops needed</span>
            </div>
          </div>

          {/* Retention Loop Count */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-badge text-slate-400">
              <span>7–15 Day Queue</span>
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-heading font-bold text-white">
                {stats.total}
              </span>
              <span className="text-[10px] font-badge text-slate-400">Active portions</span>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* Control Toolbar: Search, Filters & Global Blind Test Toggle                */}
      {/* -------------------------------------------------------------------------- */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Surah name or Ayah..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 text-xs font-subheading text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-badge">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === "all"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
            }`}
          >
            All ({stats.total})
          </button>

          <button
            onClick={() => setStatusFilter("weak")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              statusFilter === "weak"
                ? "bg-rose-500/20 text-rose-300 border border-rose-400/50 shadow-sm shadow-rose-950/50"
                : "bg-slate-900/60 text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 border border-white/5"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>Weak ({stats.weakCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter("hesitated")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              statusFilter === "hesitated"
                ? "bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-amber-300 hover:bg-amber-950/20 border border-white/5"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Hesitated ({stats.hesitatedCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter("smooth")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              statusFilter === "smooth"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/20 border border-white/5"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Smooth ({stats.smoothCount})</span>
          </button>
        </div>

        {/* Segment 2: Global Blind Test Switch */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <button
            onClick={() => setIsGlobalBlindTest(!isGlobalBlindTest)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-badge transition shadow-sm ${
              isGlobalBlindTest
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-cyan-950/40"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/10"
            }`}
            title="Blur Arabic text during revision to test pure memory"
          >
            {isGlobalBlindTest ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                <span>Blind Test: Active (Blurred)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Blind Test: Off (Clear)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* Segment 1: Auto-Generated Sabqi List (Recent Queue)                        */}
      {/* -------------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <span>Auto-Generated Recent Queue</span>
              <span className="text-xs font-badge px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {sortedAndFilteredList.length} Portions
              </span>
            </h2>
            <p className="text-xs font-subheading text-slate-400">
              Portions completed in your daily Sabaq automatically appear here. Portions marked as &lsquo;Weak&rsquo; stay prioritized at the very top.
            </p>
          </div>

          <div className="text-[11px] font-badge text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
            <span>Retention Window: 7–15 Days</span>
          </div>
        </div>

        {sortedAndFilteredList.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-950/60 border border-white/10 space-y-3">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-heading font-bold text-white">No Portions Found</h3>
            <p className="text-xs font-subheading text-slate-400 max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "No portions match your current search or filter criteria."
                : "Your 7–15 day queue is currently empty. Completing a daily Sabaq will automatically populate this orbit."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => {
                  const initial = getInitialSabqiItems();
                  saveSabqiItems(initial);
                  setSabqiList(initial);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-badge bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Starter Queue</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-badge bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Sabqi Portion</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedAndFilteredList.map((item, index) => {
              const meta = getSurahMeta(item.surahNumber);
              if (!meta) return null;

              const isWeak = item.confidenceRating === "weak";
              const isHesitated = item.confidenceRating === "hesitated";
              const isSmooth = item.confidenceRating === "smooth";
              const totalAyahs = item.ayahEnd - item.ayahStart + 1;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`relative overflow-hidden rounded-3xl p-5 backdrop-blur-md transition-all flex flex-col justify-between space-y-4 ${
                    isWeak
                      ? "bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-950 border-2 border-rose-500/70 shadow-xl shadow-rose-950/40 ring-1 ring-rose-500/30"
                      : isHesitated
                      ? "bg-gradient-to-br from-amber-950/20 via-slate-900/90 to-slate-950 border border-amber-500/40 hover:border-amber-400/60 shadow-lg shadow-slate-950/60"
                      : isSmooth
                      ? "bg-gradient-to-br from-emerald-950/20 via-slate-900/90 to-slate-950 border border-emerald-500/30 hover:border-emerald-400/50 shadow-lg shadow-slate-950/60"
                      : "bg-slate-950/80 border border-cyan-500/20 hover:border-cyan-400/40 shadow-lg shadow-slate-950/60"
                  }`}
                >
                  {/* Priority Highlight Banner for 'Weak' */}
                  {isWeak && (
                    <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white px-3 py-1 flex items-center justify-between text-[10px] font-badge tracking-wide shadow-sm">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Flame className="w-3 h-3 text-amber-200 animate-pulse" />
                        <span>⚠️ Weak • Highlighted at Top</span>
                      </div>
                      <span className="opacity-90 font-medium">Immediate Revision Needed</span>
                    </div>
                  )}

                  {/* Top Bar: Surah Number & Time Elapsed */}
                  <div className={`flex items-center justify-between ${isWeak ? "pt-4" : ""}`}>
                    <span className="text-[10px] font-badge px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                      Surah #{meta.number}
                    </span>

                    <span className="text-[11px] font-badge text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{calculateDaysAgo(item.completedAt)}</span>
                    </span>
                  </div>

                  {/* Surah Titles & Ayah Range */}
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-lg font-heading font-bold text-white group-hover:text-cyan-200 transition">
                        {meta.nameEnglish}
                      </h3>
                      <span className="text-xl font-serif text-cyan-400/80">
                        {meta.nameArabic}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-subheading text-slate-400">
                      <span>Juz {meta.juzNumber} • {meta.revelationType}</span>
                      <span className="font-badge text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        Ayahs {item.ayahStart} – {item.ayahEnd} ({totalAyahs} Ayahs)
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] font-subheading text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-white/5 italic">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Segment 2 Quick Peek / Blind Test Trigger */}
                  <button
                    onClick={() => handleOpenReview(item)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-400/40 text-xs font-badge text-slate-200 hover:text-white transition group/btn shadow-inner"
                  >
                    <div className="flex items-center gap-2">
                      {isGlobalBlindTest ? (
                        <EyeOff className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:scale-110 transition-transform" />
                      ) : (
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:scale-110 transition-transform" />
                      )}
                      <span>{isGlobalBlindTest ? "Start Blind Test Revision" : "Recite & Review Ayahs"}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  {/* Segment 3: Strength Meter (3 Confidence Buttons) */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-badge text-slate-400">
                      <span>Orbit Stability (Confidence):</span>
                      <span>
                        {isWeak ? (
                          <span className="text-rose-400 font-bold">Weak</span>
                        ) : isHesitated ? (
                          <span className="text-amber-400 font-bold">Hesitated</span>
                        ) : isSmooth ? (
                          <span className="text-emerald-400 font-bold">Smooth ✓</span>
                        ) : (
                          <span className="text-slate-400">Unrated</span>
                        )}
                      </span>
                    </div>

                    {/* The 3 Specific Buttons: Smooth, Hesitated, Weak */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* 1. Smooth */}
                      <button
                        onClick={() => handleRateStrength(item, "smooth")}
                        className={`group relative flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl text-[11px] font-badge transition-all duration-200 active:scale-95 backdrop-blur-md ${
                          isSmooth
                            ? "bg-emerald-500/20 border-2 border-emerald-400/80 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/50"
                            : "bg-white/[0.04] hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40"
                        }`}
                        title="Smooth: Flawless recitation with effortless flow"
                      >
                        <Check
                          className={`w-4 h-4 mb-1 transition-all ${
                            isSmooth
                              ? "text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)] stroke-[2.5] scale-110"
                              : "text-emerald-400/75 group-hover:text-emerald-300 group-hover:scale-110"
                          }`}
                        />
                        <span className={isSmooth ? "text-emerald-100 font-bold" : "font-medium"}>Smooth</span>
                      </button>

                      {/* 2. Hesitated */}
                      <button
                        onClick={() => handleRateStrength(item, "hesitated")}
                        className={`group relative flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl text-[11px] font-badge transition-all duration-200 active:scale-95 backdrop-blur-md ${
                          isHesitated
                            ? "bg-amber-500/20 border-2 border-amber-400/80 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50"
                            : "bg-white/[0.04] hover:bg-amber-500/10 text-slate-400 hover:text-amber-300 border border-white/10 hover:border-amber-500/40"
                        }`}
                        title="Hesitated: Stumbled or paused slightly, needs more repetition"
                      >
                        <Clock
                          className={`w-4 h-4 mb-1 transition-all ${
                            isHesitated
                              ? "text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] stroke-[2.5] scale-110"
                              : "text-amber-400/75 group-hover:text-amber-300 group-hover:scale-110"
                          }`}
                        />
                        <span className={isHesitated ? "text-amber-100 font-bold" : "font-medium"}>Hesitated</span>
                      </button>

                      {/* 3. Weak */}
                      <button
                        onClick={() => handleRateStrength(item, "weak")}
                        className={`group relative flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl text-[11px] font-badge transition-all duration-200 active:scale-95 backdrop-blur-md ${
                          isWeak
                            ? "bg-rose-500/20 border-2 border-rose-400/80 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.35)] ring-1 ring-rose-400/50"
                            : "bg-white/[0.04] hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/40"
                        }`}
                        title="Weak: Struggled or forgot verses — prioritized at the top tomorrow!"
                      >
                        <AlertTriangle
                          className={`w-4 h-4 mb-1 transition-all ${
                            isWeak
                              ? "text-rose-300 drop-shadow-[0_0_8px_rgba(251,113,133,0.9)] stroke-[2.5] scale-110"
                              : "text-rose-400/75 group-hover:text-rose-300 group-hover:scale-110"
                          }`}
                        />
                        <span className={isWeak ? "text-rose-100 font-bold" : "font-medium"}>Weak</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="flex items-center justify-between pt-1 text-[10px] font-badge text-slate-500">
                    <span>
                      {item.lastRevisedAt
                        ? `Last revised: ${calculateDaysAgo(item.lastRevisedAt)}`
                        : "Pending revision today"}
                    </span>
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title="Remove from Sabqi / Graduate to Amukhta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* Segment 2: Interactive Blind Test & Revision Studio (Slide-Over Side Panel) */}
      {/* -------------------------------------------------------------------------- */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activeReviewItem && (
              <div className="fixed inset-0 z-[100] flex justify-end">
                {/* Backdrop Click-Away Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveReviewItem(null)}
                  onWheel={(e) => e.preventDefault()}
                  className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
                />

                {/* Slide-Over Side Panel (Right Drawer) */}
                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 28, stiffness: 280 }}
                  onWheel={(e) => e.stopPropagation()}
                  className={`relative z-10 h-full flex flex-col bg-slate-950 border-l border-cyan-500/40 shadow-[-20px_0_50px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 ${
                    isPanelExpanded
                      ? "w-full max-w-5xl"
                      : "w-full sm:w-[620px] md:w-[720px] lg:w-[820px] xl:w-[900px]"
                  }`}
                >
                  {/* Side Panel Header */}
                  {(() => {
                    const meta = getSurahMeta(activeReviewItem.surahNumber);
                    const isItemWeak = activeReviewItem.confidenceRating === "weak";

                    return (
                      <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-badge px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                              Surah #{activeReviewItem.surahNumber}
                            </span>
                            <span className="text-xs font-badge text-cyan-400">
                              Ayahs {activeReviewItem.ayahStart} – {activeReviewItem.ayahEnd}
                            </span>
                            {isItemWeak && (
                              <span className="text-[10px] font-badge px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                ⚠️ Weak Retention
                              </span>
                            )}
                          </div>

                          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
                            <span>{meta?.nameEnglish}</span>
                            <span className="text-cyan-400 font-serif text-lg sm:text-xl">{meta?.nameArabic}</span>
                            <span className="text-xs sm:text-sm font-subheading text-slate-400 font-normal">
                              (Juz {meta?.juzNumber})
                            </span>
                          </h2>
                        </div>

                        {/* View Switcher, Blind Test Controls, Expand & Close */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* View Switcher: Mushaf Page vs Cards View */}
                          <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-white/10 text-xs font-badge shadow-inner">
                            <button
                              onClick={() => setReviewViewMode("mushaf")}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                                reviewViewMode === "mushaf"
                                  ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold shadow-sm"
                                  : "text-slate-400 hover:text-white"
                              }`}
                              title="Continuous classical Mushaf page view"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                              <span>Mushaf Page</span>
                            </button>
                            <button
                              onClick={() => setReviewViewMode("cards")}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                                reviewViewMode === "cards"
                                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold shadow-sm"
                                  : "text-slate-400 hover:text-white"
                              }`}
                              title="Step-by-step card review"
                            >
                              <Layers className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Cards View</span>
                            </button>
                          </div>

                          {/* Segment 2: Blind Test Toggle Button */}
                          <button
                            onClick={() => setIsGlobalBlindTest(!isGlobalBlindTest)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-badge transition shadow-md ${
                              isGlobalBlindTest
                                ? "bg-cyan-500 text-slate-950 font-bold shadow-cyan-500/30"
                                : "bg-slate-900 text-slate-300 hover:text-white border border-white/10"
                            }`}
                          >
                            {isGlobalBlindTest ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-slate-950" />
                                <span>Blind Test Active</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Text Clear</span>
                              </>
                            )}
                          </button>

                          {/* Expand / Compact Width Button */}
                          <button
                            onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                            className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
                            title={isPanelExpanded ? "Compact Side Panel" : "Expand Side Panel Width"}
                          >
                            {isPanelExpanded ? (
                              <Minimize2 className="w-4 h-4 text-cyan-400" />
                            ) : (
                              <Maximize2 className="w-4 h-4 text-slate-300" />
                            )}
                          </button>

                          {/* Close Button */}
                          <button
                            onClick={() => setActiveReviewItem(null)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition"
                            title="Close side panel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Blind Test Instruction Banner */}
                  {isGlobalBlindTest && (
                    <div className="px-6 py-2.5 bg-cyan-950/60 border-b border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-subheading text-cyan-200">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>
                          <strong>Blind Test Active:</strong> Recite from memory. If you stumble or hesitate, click on any verse to peek and verify!
                        </span>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] font-badge">
                        <button
                          onClick={handleRevealAll}
                          className="text-cyan-300 hover:text-white underline underline-offset-2"
                        >
                          Reveal All
                        </button>
                        <span className="text-cyan-600">•</span>
                        <button
                          onClick={handleBlurAll}
                          className="text-cyan-300 hover:text-white underline underline-offset-2"
                        >
                          Blur All
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Ayahs Display Area */}
                  <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
                    {isLoadingAyahs ? (
                      <div className="py-16 text-center space-y-3">
                        <RotateCcw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                        <p className="text-xs font-badge text-slate-400">Loading verses...</p>
                      </div>
                    ) : reviewViewMode === "mushaf" ? (
                      /* CLASSICAL CONTINUOUS MUSHAF PAGE VIEW */
                      <div className="space-y-6">
                        <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/90 border-2 border-amber-500/30 shadow-2xl relative space-y-6">
                          {/* Traditional Mushaf Ornamental Frame Header */}
                          <div className="text-center py-3 border-b border-amber-500/20 relative">
                            <div className="inline-block px-8 py-2 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 font-serif text-lg tracking-widest shadow-inner">
                              سُورَةُ {getSurahMeta(activeReviewItem.surahNumber)?.nameArabic}
                            </div>
                            <div className="text-xs text-amber-300/80 mt-2 font-subheading flex flex-wrap items-center justify-center gap-2">
                              <span>{getSurahMeta(activeReviewItem.surahNumber)?.nameEnglish}</span>
                              <span>•</span>
                              <span>Juz {getSurahMeta(activeReviewItem.surahNumber)?.juzNumber}</span>
                              <span>•</span>
                              <span>{getSurahMeta(activeReviewItem.surahNumber)?.revelationType} Revelation</span>
                              <span>•</span>
                              <span className="text-cyan-300 font-badge">
                                Ayahs {activeReviewItem.ayahStart} – {activeReviewItem.ayahEnd}
                              </span>
                            </div>
                          </div>

                          {/* Bismillah Header (if beginning of Surah and not At-Tawbah) */}
                          {activeReviewItem.ayahStart === 1 && activeReviewItem.surahNumber !== 9 && (
                            <div className="text-center py-2 border-b border-amber-500/10">
                              <p
                                dir="rtl"
                                className="text-2xl sm:text-3xl text-amber-200 font-serif"
                                style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
                              >
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                              </p>
                            </div>
                          )}

                          {/* Continuous Flow of Ayahs (Classical Mushaf Text) */}
                          <div
                            dir="rtl"
                            className="text-2xl sm:text-3xl md:text-[32px] text-amber-100/95 font-serif leading-[2.8] select-text text-justify px-1 sm:px-4"
                            style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
                          >
                            {activeAyahs.map((ayah) => {
                              const isRevealed = revealedAyahs.has(ayah.number);
                              const isBlurred = isGlobalBlindTest && !isRevealed;
                              const isFocused = (focusedMushafAyah || playingAyah) === ayah.number;
                              const isPlaying = playingAyah === ayah.number;

                              return (
                                <span
                                  key={ayah.number}
                                  onClick={() => {
                                    if (isGlobalBlindTest) {
                                      handleToggleAyahPeek(ayah.number);
                                    }
                                    setFocusedMushafAyah(ayah.number);
                                  }}
                                  className={`cursor-pointer transition-all duration-200 rounded-xl px-2 py-1 inline ${
                                    isBlurred
                                      ? "blur-md select-none opacity-40 hover:opacity-70 hover:bg-white/5"
                                      : isPlaying
                                      ? "bg-amber-400/25 text-amber-100 ring-2 ring-amber-400 shadow-md"
                                      : isRevealed && isGlobalBlindTest
                                      ? "bg-amber-950/40 text-amber-200 ring-1 ring-amber-500/60"
                                      : isFocused
                                      ? "bg-cyan-500/20 text-white ring-1 ring-cyan-400/50"
                                      : "hover:bg-white/10"
                                  }`}
                                  title={`Ayah #${ayah.number} • Click to ${
                                    isGlobalBlindTest ? (isRevealed ? "blur" : "peek") : "listen / focus"
                                  }`}
                                >
                                  {ayah.arabic}
                                  <span className="inline-block text-xl sm:text-2xl text-amber-400/90 mx-2 select-none font-sans font-normal">
                                    ۝{ayah.number}
                                  </span>
                                </span>
                              );
                            })}
                          </div>

                          {/* Mushaf Interactive Floating Footer (Focused Verse Drawer) */}
                          <div className="pt-5 border-t border-amber-500/20">
                            {focusedMushafAyah && (
                              <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-left space-y-2 backdrop-blur-md shadow-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-badge text-cyan-300">
                                      Verse #{focusedMushafAyah}
                                    </span>
                                    {isGlobalBlindTest && (
                                      <button
                                        onClick={() => handleToggleAyahPeek(focusedMushafAyah)}
                                        className="text-[11px] font-badge text-cyan-400 hover:text-cyan-200 underline"
                                      >
                                        {revealedAyahs.has(focusedMushafAyah) ? "Hide / Blur" : "Peek / Reveal"}
                                      </button>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handlePlayAudio(focusedMushafAyah)}
                                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-badge transition ${
                                        playingAyah === focusedMushafAyah
                                          ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                                          : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
                                      }`}
                                    >
                                      {playingAyah === focusedMushafAyah ? (
                                        <>
                                          <Pause className="w-3.5 h-3.5" />
                                          <span>Pause</span>
                                        </>
                                      ) : (
                                        <>
                                          <Play className="w-3.5 h-3.5" />
                                          <span>Play Recitation</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {(!isGlobalBlindTest || revealedAyahs.has(focusedMushafAyah)) ? (
                                  <p className="text-xs font-subheading text-slate-300 leading-relaxed italic">
                                    &ldquo;{activeAyahs.find((a) => a.number === focusedMushafAyah)?.translationEn || "Loading translation..."}&rdquo;
                                  </p>
                                ) : (
                                  <p className="text-[11px] font-subheading text-slate-500 italic">
                                    Translation hidden in blind test. Click verse or &lsquo;Peek / Reveal&rsquo; to view.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* CARDS VIEW */
                      activeAyahs.map((ayah) => {
                        const isRevealed = revealedAyahs.has(ayah.number);
                        const isBlurred = isGlobalBlindTest && !isRevealed;
                        const isPlaying = playingAyah === ayah.number;

                        return (
                          <div
                            key={ayah.number}
                            onClick={() => {
                              if (isGlobalBlindTest) {
                                handleToggleAyahPeek(ayah.number);
                              }
                            }}
                            className={`relative p-5 rounded-2xl border transition-all ${
                              isBlurred
                                ? "bg-slate-900/40 border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer shadow-inner"
                                : isRevealed && isGlobalBlindTest
                                ? "bg-amber-950/20 border-amber-500/60 ring-2 ring-amber-500/30 shadow-lg"
                                : "bg-slate-900/60 border-white/10"
                            }`}
                          >
                            {/* Ayah Header & Action Bar */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-cyan-950 border border-cyan-500/30 text-xs font-badge text-cyan-300">
                                  {ayah.number}
                                </span>
                                {isBlurred && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-badge text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/30 animate-pulse">
                                    <Lock className="w-3 h-3" />
                                    <span>Blurred (Click to peek)</span>
                                  </span>
                                )}
                                {isRevealed && isGlobalBlindTest && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-badge text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-500/40">
                                    <Unlock className="w-3 h-3 text-amber-400" />
                                    <span>Revealed (Hesitated here)</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayAudio(ayah.number);
                                  }}
                                  className={`p-1.5 rounded-xl border transition ${
                                    isPlaying
                                      ? "bg-cyan-500 text-slate-950 border-cyan-400"
                                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-white/10"
                                  }`}
                                  title={isPlaying ? "Pause audio" : "Play Qari recitation"}
                                >
                                  {isPlaying ? (
                                    <Pause className="w-3.5 h-3.5" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Arabic Quranic Text (Blurred when in blind test unless peeked) */}
                            <div className="relative py-2">
                              <p
                                className={`text-2xl sm:text-3xl font-serif text-right text-white leading-loose tracking-wide transition-all duration-300 ${
                                  isBlurred
                                    ? "blur-md select-none opacity-40 hover:opacity-60"
                                    : "blur-none opacity-100"
                                }`}
                                dir="rtl"
                              >
                                {ayah.arabic}
                              </p>

                              {/* Click-to-peek overlay hint */}
                              {isBlurred && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-badge backdrop-blur-md shadow-lg">
                                    👁️ Click to Peek
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* English Translation (Shown when unblurred) */}
                            {!isBlurred && (
                              <div className="pt-3 mt-3 border-t border-white/5 space-y-1 text-xs font-subheading text-slate-300">
                                <p className="text-slate-300 leading-relaxed">{ayah.translationEn}</p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Modal Footer: Segment 3 Strength Meter Buttons */}
                  <div className="p-5 border-t border-white/10 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-badge text-white">
                        Rate your revision strength (Strength Meter):
                      </h4>
                      <p className="text-[11px] font-subheading text-slate-400">
                        Portions marked as &lsquo;Weak&rsquo; will remain highlighted at the very top tomorrow.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleRateStrength(activeReviewItem, "smooth")}
                        className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-badge transition-all active:scale-95 backdrop-blur-md ${
                          activeReviewItem.confidenceRating === "smooth"
                            ? "bg-emerald-500/20 border-2 border-emerald-400/80 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/50 font-bold"
                            : "bg-white/[0.04] hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30"
                        }`}
                      >
                        <Check
                          className={`w-4 h-4 transition-transform ${
                            activeReviewItem.confidenceRating === "smooth"
                              ? "text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] stroke-[2.5]"
                              : "text-emerald-400/75 group-hover:scale-110"
                          }`}
                        />
                        <span>1. Smooth</span>
                      </button>

                      <button
                        onClick={() => handleRateStrength(activeReviewItem, "hesitated")}
                        className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-badge transition-all active:scale-95 backdrop-blur-md ${
                          activeReviewItem.confidenceRating === "hesitated"
                            ? "bg-amber-500/20 border-2 border-amber-400/80 text-amber-100 shadow-[0_0_18px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50 font-bold"
                            : "bg-white/[0.04] hover:bg-amber-500/10 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30"
                        }`}
                      >
                        <Clock
                          className={`w-4 h-4 transition-transform ${
                            activeReviewItem.confidenceRating === "hesitated"
                              ? "text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)] stroke-[2.5]"
                              : "text-amber-400/75 group-hover:scale-110"
                          }`}
                        />
                        <span>2. Hesitated</span>
                      </button>

                      <button
                        onClick={() => handleRateStrength(activeReviewItem, "weak")}
                        className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-badge transition-all active:scale-95 backdrop-blur-md ${
                          activeReviewItem.confidenceRating === "weak"
                            ? "bg-rose-500/20 border-2 border-rose-400/80 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.35)] ring-1 ring-rose-400/50 font-bold"
                            : "bg-white/[0.04] hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30"
                        }`}
                      >
                        <AlertTriangle
                          className={`w-4 h-4 transition-transform ${
                            activeReviewItem.confidenceRating === "weak"
                              ? "text-rose-300 drop-shadow-[0_0_6px_rgba(251,113,133,0.9)] stroke-[2.5]"
                              : "text-rose-400/75 group-hover:scale-110"
                          }`}
                        />
                        <span>3. Weak</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* -------------------------------------------------------------------------- */}
      {/* Modal: Add Custom Sabqi Portion                                            */}
      {/* -------------------------------------------------------------------------- */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isAddModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl overflow-hidden p-6 space-y-5"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Add Portion to Sabqi Queue</span>
                    </h3>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      className="p-1 rounded-xl text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddCustom} className="space-y-4">
                    {/* Surah Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-badge text-slate-300">Select Surah:</label>
                      <select
                        value={customSurah}
                        onChange={(e) => {
                          const num = Number(e.target.value);
                          setCustomSurah(num);
                          const m = getSurahMeta(num);
                          setCustomStart(1);
                          setCustomEnd(Math.min(10, m?.totalAyahs || 7));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-xs font-subheading text-white focus:outline-none focus:border-cyan-400"
                      >
                        {QURAN_SURAHS.map((s) => (
                          <option key={s.number} value={s.number}>
                            #{s.number} {s.nameEnglish} ({s.totalAyahs} Ayahs)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ayah Range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-badge text-slate-300">Start Ayah:</label>
                        <input
                          type="number"
                          min={1}
                          max={getSurahMeta(customSurah)?.totalAyahs || 286}
                          value={customStart}
                          onChange={(e) => setCustomStart(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-2xl bg-slate-900 border border-white/10 text-xs font-badge text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-badge text-slate-300">End Ayah:</label>
                        <input
                          type="number"
                          min={customStart}
                          max={getSurahMeta(customSurah)?.totalAyahs || 286}
                          value={customEnd}
                          onChange={(e) => setCustomEnd(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-2xl bg-slate-900 border border-white/10 text-xs font-badge text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Optional Notes */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-badge text-slate-300">Notes (Optional):</label>
                      <input
                        type="text"
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        placeholder="e.g. Needs extra attention at waqf stops..."
                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-900 border border-white/10 text-xs font-subheading text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-badge text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-badge font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-md shadow-cyan-500/25"
                      >
                        Add to Sabqi Queue
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
