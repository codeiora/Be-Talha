"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Repeat,
  PenLine,
  Tag,
  Search,
  Calendar,
  Layers,
  Award,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  SlidersHorizontal,
  Trash2,
  ExternalLink,
  Star,
  Compass,
  Plus,
  Maximize2,
  Filter,
  Eye,
  EyeOff,
  Mic,
  MicOff,
  Square,
} from "lucide-react";
import {
  SabaqDailyRoutine,
  HifzSurahProgress,
  AyahReflectionNote,
  ReciterId,
} from "@/types/hifz";
import {
  loadDailyRoutine,
  saveDailyRoutine,
  loadHifzProgress,
  saveHifzProgress,
  loadReflections,
  saveReflections,
  addSabqiItem,
} from "@/lib/hifzStorage";
import { QURAN_SURAHS, getSurahMeta, getAyahAudioUrl } from "@/lib/quranData";
import { FacetedIlluminatedStar } from "@/components/hifz/FacetedStar";
import confetti from "canvas-confetti";

interface AyahData {
  number: number;
  arabic: string;
  translationEn: string;
  translationBn?: string;
  isLoading?: boolean;
}

// Built-in offline Quran text & English / Bengali translations for instant response
const OFFLINE_AYAH_SAMPLE: Record<string, { arabic: string; en: string; bn: string }> = {
  "1:1": {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    bn: "শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।",
  },
  "1:2": {
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    en: "[All] praise is [due] to Allah, Lord of the worlds -",
    bn: "সমস্ত প্রশংসা জগৎসমূহের প্রতিপালক আল্লাহর জন্য।",
  },
  "1:3": {
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    en: "The Entirely Merciful, the Especially Merciful,",
    bn: "যিনি পরম করুণাময়, অতি দয়ালু।",
  },
  "1:4": {
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    en: "Sovereign of the Day of Recompense.",
    bn: "যিনি বিচার দিবসের অধিপতি।",
  },
  "1:5": {
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    en: "It is You we worship and You we ask for help.",
    bn: "আমরা কেবলমাত্র আপনারই ইবাদত করি এবং কেবলমাত্র আপনারই সাহায্য প্রার্থনা করি।",
  },
  "1:6": {
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    en: "Guide us to the straight path -",
    bn: "আমাদেরকে সরল সঠিক পথ প্রদর্শন করুন।",
  },
  "1:7": {
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    en: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
    bn: "তাদের পথ, যাদেরকে আপনি পুরস্কৃত করেছেন; তাদের পথ নয় যারা ক্রোধের শিকার এবং যারা পথভ্রষ্ট।",
  },
  "67:1": {
    arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    en: "Blessed is He in whose hand is dominion, and He is over all things competent -",
    bn: "মহিমান্বিত তিনি, যাঁর হাতে সর্বময় কর্তৃত্ব; আর তিনি সব কিছুর উপর সর্বশক্তিমান।",
  },
  "67:2": {
    arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
    en: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
    bn: "যিনি সৃষ্টি করেছেন মৃত্যু ও জীবন, তোমাদেরকে পরীক্ষা করার জন্য—কে তোমাদের মধ্যে কর্মে শ্রেষ্ঠ? আর তিনি পরাক্রমশালী, ক্ষমাশীল।",
  },
  "67:3": {
    arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    en: "[And] who created seven heavens in layers. You see not in the creation of the Most Merciful any inconsistency. So return [your] vision to the sky, do you see any breaks?",
    bn: "যিনি সৃষ্টি করেছেন সপ্ত আকাশ স্তরে স্তরে; পরম করুণাময়ের সৃষ্টিতে তুমি কোন অসঙ্গতি দেখতে পাবে না। তুমি আবার দৃষ্টি ফেরাও, কোন ত্রুটি দেখতে পাও কি?",
  },
  "67:4": {
    arabic: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
    en: "Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.",
    bn: "অতঃপর তুমি বারবার দৃষ্টি ফেরাও, সে দৃষ্টি ব্যর্থ ও ক্লান্ত হয়ে তোমার দিকে ফিরে আসবে।",
  },
  "67:5": {
    arabic: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ",
    en: "And We have certainly beautified the nearest heaven with lamps and have made [from] them what is thrown at the devils and have prepared for them the punishment of the Blaze.",
    bn: "আর নিশ্চয় আমি নিকটবর্তী আকাশকে প্রদীপমালা দ্বারা সুশোভিত করেছি এবং সেগুলোকে শয়তানদের প্রতি নিক্ষেপের বস্তু বানিয়েছি, আর তাদের জন্য প্রস্তুত রেখেছি জ্বলন্ত আগুনের শাস্তি।",
  },
  "112:1": {
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    en: "Say, \"He is Allah, [who is] One,",
    bn: "বলুন, তিনিই আল্লাহ, একক ও অদ্বিতীয়।",
  },
  "112:2": {
    arabic: "اللَّهُ الصَّمَدُ",
    en: "Allah, the Eternal Refuge.",
    bn: "আল্লাহ কারও মুখাপেক্ষী নন, সবাই তাঁর মুখাপেক্ষী।",
  },
  "112:3": {
    arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    en: "He neither begets nor is born,",
    bn: "তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি।",
  },
  "112:4": {
    arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    en: "Nor is there to Him any equivalent.\"",
    bn: "এবং তাঁর সমকক্ষ কেউই নেই।",
  },
};

export function SabaqStudio() {
  const [routine, setRoutine] = useState<SabaqDailyRoutine | null>(null);
  const [progressList, setProgressList] = useState<HifzSurahProgress[]>([]);
  const [reflections, setReflections] = useState<AyahReflectionNote[]>([]);

  // Sabaq Target State
  const [sabaqSurah, setSabaqSurah] = useState<number>(67);
  const [ayahStart, setAyahStart] = useState<number>(1);
  const [ayahEnd, setAyahEnd] = useState<number>(3);

  // Focused Ayah: Single-Ayah Focus Mode (shows only 1 active verse at a time)
  const [focusedAyah, setFocusedAyah] = useState<number>(1);

  // Reading Modes: 'individual' (single focused verse + quoted meaning) vs 'mushaf' (continuous full page)
  const [readingMode, setReadingMode] = useState<"individual" | "mushaf">("individual");

  // Translation language toggle: 'en' (default) vs 'bn'
  const [translationLang, setTranslationLang] = useState<"en" | "bn">("en");

  // Ayahs Text & Translations
  const [ayahsMap, setAyahsMap] = useState<Record<number, AyahData>>({});
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);

  // Audio Looper / Takrar State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [reciter, setReciter] = useState<ReciterId>("husary");
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [takrarTarget, setTakrarTarget] = useState<number>(5); // 5x default loop
  const [takrarCurrentLoop, setTakrarCurrentLoop] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Reflection Box State & Manual Tag System
  const [reflectionInputText, setReflectionInputText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Reflection"]);
  const [customTagInput, setCustomTagInput] = useState<string>("");
  const [reflectionSaveSuccess, setReflectionSaveSuccess] = useState(false);

  // Full-Screen Stored Notes Modal State & Filters
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [vaultSearchQuery, setVaultSearchQuery] = useState("");
  const [vaultSurahFilter, setVaultSurahFilter] = useState<number | "all">("all");

  // 'Light a New Star' Celebration Modal State
  const [isStarCelebrationOpen, setIsStarCelebrationOpen] = useState(false);

  // Mushaf mode active focused Ayah
  const [mushafFocusedAyah, setMushafFocusedAyah] = useState<number | null>(null);

  // Memory Mask / Blur Mode (First-Word Mode for self-testing)
  const [isMemoryMaskActive, setIsMemoryMaskActive] = useState(false);

  // Quick Voice Mirror (Self-Recitation MediaRecorder Check)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isUserAudioPlaying, setIsUserAudioPlaying] = useState(false);
  const [voiceMirrorError, setVoiceMirrorError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial data
  useEffect(() => {
    const r = loadDailyRoutine();
    const p = loadHifzProgress();
    const refl = loadReflections();
    setRoutine(r);
    setProgressList(p);
    setReflections(refl);

    if (r) {
      setSabaqSurah(r.sabaqSurah || 67);
      setAyahStart(r.sabaqAyahStart || 1);
      setAyahEnd(r.sabaqAyahEnd || 3);
      setFocusedAyah(r.sabaqAyahStart || 1);
    }
  }, []);

  const currentSurahMeta = getSurahMeta(sabaqSurah) || QURAN_SURAHS[0];

  const targetAyahs = useMemo(() => {
    const list: number[] = [];
    const maxA = Math.min(ayahEnd, currentSurahMeta.totalAyahs);
    const minA = Math.max(1, ayahStart);
    for (let a = minA; a <= maxA; a++) {
      list.push(a);
    }
    return list;
  }, [ayahStart, ayahEnd, currentSurahMeta.totalAyahs]);

  // Keep focusedAyah inside bounds whenever range changes
  useEffect(() => {
    if (focusedAyah < ayahStart || focusedAyah > ayahEnd) {
      setFocusedAyah(ayahStart);
    }
  }, [ayahStart, ayahEnd, focusedAyah]);

  // Sync focusedAyah with audio playingAyah
  useEffect(() => {
    if (playingAyah !== null) {
      setFocusedAyah(playingAyah);
    }
  }, [playingAyah]);

  // Clear input box and reset voice mirror when shifting ayahs
  useEffect(() => {
    setReflectionInputText("");
    setReflectionSaveSuccess(false);

    // Stop and reset user voice mirror on ayah shift
    if (userAudioElementRef.current) {
      userAudioElementRef.current.pause();
      setIsUserAudioPlaying(false);
    }
    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }
    if (isRecordingVoice && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setRecordingDuration(0);
    setVoiceMirrorError(null);
  }, [focusedAyah]);

  // Clean up Voice Mirror on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (userAudioElementRef.current) {
        userAudioElementRef.current.pause();
      }
    };
  }, []);

  // Track client mount for React Portal rendering into document.body
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent background body scrolling when any full-screen modal is active
  useEffect(() => {
    if (isVaultOpen || isStarCelebrationOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVaultOpen, isStarCelebrationOpen]);

  // Close modals on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVaultOpen(false);
        setIsStarCelebrationOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Fetch Ayah Text and English + Bengali Translations
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingAyahs(true);

    const fetchAllAyahs = async () => {
      const results: Record<number, AyahData> = {};

      for (const aNum of targetAyahs) {
        const cacheKey = `${sabaqSurah}:${aNum}`;
        const localKey = `cached_ayah_en_v1_${sabaqSurah}_${aNum}`;

        // 1. Check built-in offline sample
        if (OFFLINE_AYAH_SAMPLE[cacheKey]) {
          results[aNum] = {
            number: aNum,
            arabic: OFFLINE_AYAH_SAMPLE[cacheKey].arabic,
            translationEn: OFFLINE_AYAH_SAMPLE[cacheKey].en,
            translationBn: OFFLINE_AYAH_SAMPLE[cacheKey].bn,
          };
          continue;
        }

        // 2. Check localStorage cache
        if (typeof window !== "undefined") {
          try {
            const cached = localStorage.getItem(localKey);
            if (cached) {
              const parsed = JSON.parse(cached);
              results[aNum] = parsed;
              continue;
            }
          } catch {
            // ignore
          }
        }

        // 3. Fetch from API (Uthmani + Saheeh International English + Muhiuddin Khan Bengali)
        try {
          const res = await fetch(
            `https://api.alquran.cloud/v1/ayah/${sabaqSurah}:${aNum}/editions/quran-uthmani,en.sahih,bn.bengali`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.code === 200 && data.data?.length >= 2) {
              const ayahItem: AyahData = {
                number: aNum,
                arabic: data.data[0].text,
                translationEn: data.data[1].text,
                translationBn: data.data[2]?.text || "",
              };
              results[aNum] = ayahItem;

              if (typeof window !== "undefined") {
                localStorage.setItem(localKey, JSON.stringify(ayahItem));
              }
              continue;
            }
          }
        } catch {
          // fallback
        }

        // 4. Graceful fallback placeholder
        results[aNum] = {
          number: aNum,
          arabic: `آية رقم ${aNum} من سورة ${currentSurahMeta.nameArabic}`,
          translationEn: `Verse ${aNum} of Surah ${currentSurahMeta.nameEnglish}.`,
          translationBn: `সূরা ${currentSurahMeta.nameBangla}, আয়াত ${aNum}`,
        };
      }

      if (!isCancelled) {
        setAyahsMap(results);
        setIsLoadingAyahs(false);
      }
    };

    fetchAllAyahs();

    return () => {
      isCancelled = true;
    };
  }, [sabaqSurah, targetAyahs, currentSurahMeta]);

  // Audio setup and looper logic
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleEnded = () => {
      if (takrarTarget === 0 || takrarCurrentLoop < takrarTarget) {
        // Repeat current ayah
        setTakrarCurrentLoop((prev) => prev + 1);
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        // Takrar cycle finished for this ayah
        setTakrarCurrentLoop(1);
        if (autoAdvance && playingAyah !== null && playingAyah < ayahEnd) {
          const nextAyah = playingAyah + 1;
          setPlayingAyah(nextAyah);
          setFocusedAyah(nextAyah);
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
  }, [takrarTarget, takrarCurrentLoop, autoAdvance, playingAyah, ayahEnd]);

  // Update audio source when playingAyah changes
  useEffect(() => {
    if (!audioRef.current || playingAyah === null) return;
    const audio = audioRef.current;
    audio.src = getAyahAudioUrl(sabaqSurah, playingAyah, reciter);
    audio.playbackRate = playbackSpeed;
    audio.currentTime = 0;
    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [playingAyah, sabaqSurah, reciter, playbackSpeed]);

  const togglePlayAyah = (aNum: number) => {
    if (!audioRef.current) return;
    if (playingAyah === aNum && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setPlayingAyah(aNum);
      setFocusedAyah(aNum);
      setTakrarCurrentLoop(1);
      audioRef.current.src = getAyahAudioUrl(sabaqSurah, aNum, reciter);
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Ayah Shift Navigation Handlers
  const handleNextAyah = () => {
    if (focusedAyah < ayahEnd) {
      const nextA = focusedAyah + 1;
      setFocusedAyah(nextA);
      if (isPlaying) {
        setPlayingAyah(nextA);
        setTakrarCurrentLoop(1);
      }
    }
  };

  const handlePrevAyah = () => {
    if (focusedAyah > ayahStart) {
      const prevA = focusedAyah - 1;
      setFocusedAyah(prevA);
      if (isPlaying) {
        setPlayingAyah(prevA);
        setTakrarCurrentLoop(1);
      }
    }
  };

  // Quick Voice Mirror (Self-recitation check using MediaRecorder)
  const startVoiceRecording = async () => {
    try {
      setVoiceMirrorError(null);
      if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
        setVoiceMirrorError("Microphone recording is not supported in this browser.");
        return;
      }

      // Stop Sheikh playback if running
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      // Stop previous user playback if active
      if (userAudioElementRef.current && isUserAudioPlaying) {
        userAudioElementRef.current.pause();
        setIsUserAudioPlaying(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (userAudioUrl) {
          URL.revokeObjectURL(userAudioUrl);
        }
        const newUrl = URL.createObjectURL(audioBlob);
        setUserAudioUrl(newUrl);
        setIsRecordingVoice(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
      setRecordingDuration(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone recording error:", err);
      setVoiceMirrorError(
        err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError"
          ? "Microphone access was denied. Please allow microphone permission in your browser."
          : err?.message || "Could not access microphone."
      );
      setIsRecordingVoice(false);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecordingVoice(false);
  };

  const togglePlayUserAudio = () => {
    if (!userAudioUrl) return;

    // Pause Sheikh audio if running
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (!userAudioElementRef.current) {
      userAudioElementRef.current = new Audio(userAudioUrl);
    } else {
      userAudioElementRef.current.src = userAudioUrl;
    }

    userAudioElementRef.current.onended = () => {
      setIsUserAudioPlaying(false);
    };

    if (isUserAudioPlaying) {
      userAudioElementRef.current.pause();
      setIsUserAudioPlaying(false);
    } else {
      userAudioElementRef.current.play().then(() => {
        setIsUserAudioPlaying(true);
      }).catch((err) => {
        console.error("User audio play error:", err);
        setIsUserAudioPlaying(false);
      });
    }
  };

  const clearUserAudio = () => {
    if (userAudioElementRef.current) {
      userAudioElementRef.current.pause();
      setIsUserAudioPlaying(false);
    }
    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }
    setRecordingDuration(0);
  };

  // Memorization checklist check
  const surahProgress = progressList.find((p) => p.surahNumber === sabaqSurah);
  const memorizedAyahs = surahProgress?.memorizedAyahs || [];

  const handleToggleAyahMemorized = (aNum: number) => {
    const current = loadHifzProgress();
    const idx = current.findIndex((p) => p.surahNumber === sabaqSurah);
    const total = currentSurahMeta.totalAyahs;
    const now = Date.now();

    if (idx !== -1) {
      const item = current[idx];
      const exists = item.memorizedAyahs.includes(aNum);
      const newAyahs = exists
        ? item.memorizedAyahs.filter((a) => a !== aNum)
        : [...item.memorizedAyahs, aNum].sort((a, b) => a - b);

      current[idx] = {
        ...item,
        memorizedAyahs: newAyahs,
        isFullyMemorized: newAyahs.length === total,
        lastRevisedAt: now,
        luminosityState: "radiant",
        luminosityScore: 100,
        daysSinceRevision: 0,
      };
    } else {
      current.push({
        surahNumber: sabaqSurah,
        memorizedAyahs: [aNum],
        isFullyMemorized: total === 1,
        lastRevisedAt: now,
        luminosityState: "radiant",
        luminosityScore: 100,
        daysSinceRevision: 0,
        difficultyRating: 1,
      });
    }

    saveHifzProgress(current);
    setProgressList(current);
  };

  // Keyboard navigation for shifting ayahs, loop playback, blur toggle (B), and memorization check (M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      if (isVaultOpen || isStarCelebrationOpen) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextAyah();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevAyah();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayAyah(focusedAyah);
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        setIsMemoryMaskActive((prev) => !prev);
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        handleToggleAyahMemorized(focusedAyah);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // 'Light a New Star' (Sabaq Complete Button)
  const handleCompleteSabaq = () => {
    if (!routine) return;

    // 1. Mark all targeted ayahs as memorized
    const current = loadHifzProgress();
    const total = currentSurahMeta.totalAyahs;
    const now = Date.now();
    const sevenDaysLater = now + 7 * 24 * 60 * 60 * 1000;

    const idx = current.findIndex((p) => p.surahNumber === sabaqSurah);
    let updatedProgress: HifzSurahProgress[];

    if (idx !== -1) {
      const item = current[idx];
      const merged = Array.from(new Set([...item.memorizedAyahs, ...targetAyahs])).sort((a, b) => a - b);
      current[idx] = {
        ...item,
        memorizedAyahs: merged,
        isFullyMemorized: merged.length === total,
        lastRevisedAt: now,
        luminosityState: "radiant",
        luminosityScore: 100,
        daysSinceRevision: 0,
        sabqiUntil: sevenDaysLater,
      };
      updatedProgress = [...current];
    } else {
      updatedProgress = [
        ...current,
        {
          surahNumber: sabaqSurah,
          memorizedAyahs: targetAyahs,
          isFullyMemorized: targetAyahs.length === total,
          lastRevisedAt: now,
          luminosityState: "radiant",
          luminosityScore: 100,
          daysSinceRevision: 0,
          difficultyRating: 1,
          sabqiUntil: sevenDaysLater,
        },
      ];
    }

    saveHifzProgress(updatedProgress);
    setProgressList(updatedProgress);

    // 2. Automate next day's Sabqi queue
    const currentSabqi = routine.sabqiTargetSurahs || [];
    const nextSabqi = Array.from(new Set([...currentSabqi, sabaqSurah]));

    // Automatically push completed Sabaq portion into Sabqi retention queue (Segment 1)
    addSabqiItem({
      surahNumber: sabaqSurah,
      ayahStart,
      ayahEnd,
      completedAt: now,
      lastRevisedAt: now,
      confidenceRating: null, // Ready for Sabqi revision
    });

    const updatedRoutine: SabaqDailyRoutine = {
      ...routine,
      sabaqSurah,
      sabaqAyahStart: ayahStart,
      sabaqAyahEnd: ayahEnd,
      sabaqCompleted: true,
      sabqiTargetSurahs: nextSabqi,
    };

    saveDailyRoutine(updatedRoutine);
    setRoutine(updatedRoutine);

    // 3. Celestial Starlight Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#34d399", "#38bdf8", "#fbbf24", "#ffffff"],
      });
    } catch {
      // ignore
    }

    setIsStarCelebrationOpen(true);
  };

  // Tag Management Handlers (Manual + Preset)
  const handleAddCustomTag = () => {
    const cleanTag = customTagInput.trim().replace(/^#+/, "");
    if (!cleanTag) return;
    if (!selectedTags.includes(cleanTag)) {
      setSelectedTags([...selectedTags, cleanTag]);
    }
    setCustomTagInput("");
  };

  const handleTogglePresetTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      if (selectedTags.length > 1) {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      }
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (selectedTags.length > 1) {
      setSelectedTags(selectedTags.filter((t) => t !== tagToRemove));
    }
  };

  // Save Reflection Note
  const handleSaveReflection = (ayahNum: number) => {
    if (!reflectionInputText.trim()) return;

    const ayahText = ayahsMap[ayahNum]?.arabic || "";
    const newNote: AyahReflectionNote = {
      id: `ref-${Date.now()}`,
      surahNumber: sabaqSurah,
      ayahNumber: ayahNum,
      arabicText: ayahText,
      reflection: reflectionInputText.trim(),
      tags: selectedTags.length > 0 ? selectedTags : ["Reflection"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updated = [newNote, ...reflections];
    setReflections(updated);
    saveReflections(updated);

    setReflectionSaveSuccess(true);
    setTimeout(() => {
      setReflectionSaveSuccess(false);
      setReflectionInputText("");
    }, 1800);
  };

  // Jump from full-screen vault card directly to that verse in Sabaq Studio
  const handleJumpToNoteVerse = (note: AyahReflectionNote) => {
    const meta = getSurahMeta(note.surahNumber);
    if (note.surahNumber !== sabaqSurah) {
      setSabaqSurah(note.surahNumber);
      setAyahStart(Math.min(note.ayahNumber, meta?.totalAyahs || 1));
      setAyahEnd(Math.max(note.ayahNumber, Math.min(note.ayahNumber + 2, meta?.totalAyahs || 1)));
    }
    setFocusedAyah(note.ayahNumber);
    setIsVaultOpen(false);
  };

  const currentAyahReflections = reflections.filter(
    (r) => r.surahNumber === sabaqSurah && r.ayahNumber === focusedAyah
  );

  const uniqueSurahNumbersWithNotes = useMemo(() => {
    return Array.from(new Set(reflections.map((r) => r.surahNumber)));
  }, [reflections]);

  const filteredVaultReflections = useMemo(() => {
    return reflections.filter((r) => {
      if (vaultSurahFilter !== "all" && r.surahNumber !== vaultSurahFilter) {
        return false;
      }
      if (!vaultSearchQuery.trim()) return true;
      const meta = getSurahMeta(r.surahNumber);
      const query = vaultSearchQuery.toLowerCase();
      const surahName = `${meta?.nameEnglish || ""} ${meta?.nameBangla || ""}`.toLowerCase();
      return (
        r.reflection.toLowerCase().includes(query) ||
        surahName.includes(query) ||
        r.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [reflections, vaultSurahFilter, vaultSearchQuery]);

  const activeAyahData = ayahsMap[focusedAyah];
  const isCurrentAyahChecked = memorizedAyahs.includes(focusedAyah);
  const isCurrentAyahPlaying = playingAyah === focusedAyah && isPlaying;

  const arabicWords = activeAyahData?.arabic ? activeAyahData.arabic.trim().split(/\s+/) : [];
  const firstWord = arabicWords.length > 0 ? arabicWords[0] : "";
  const remainingWords = arabicWords.length > 1 ? arabicWords.slice(1).join(" ") : "";

  const currentTranslationText =
    translationLang === "bn" && activeAyahData?.translationBn
      ? activeAyahData.translationBn
      : activeAyahData?.translationEn;

  return (
    <div className="space-y-6 select-text">
      {/* Studio Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-2xl backdrop-blur-xl">
        <div className="absolute -bottom-6 -right-4 text-9xl font-serif text-emerald-400/[0.04] pointer-events-none select-none">
          سبق
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-badge mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pillar 01 • Sabaq Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
              Sabaq Studio{" "}
              <span className="text-base sm:text-lg font-subheading font-normal text-emerald-400">
                (Daily Quran Lesson)
              </span>
            </h1>
            <p className="text-sm font-subheading text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Focus deeply on one verse at a time with repeat audio loops. Capture meaningful life reflections, commit each ayah to memory, and ignite a radiant new star in your celestial hifz constellation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Open Vault Button */}
            <button
              onClick={() => setIsVaultOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 text-purple-200 text-xs font-badge shadow-lg transition"
            >
              <PenLine className="w-4 h-4 text-purple-400" />
              <span>Stored Notes ({reflections.length})</span>
            </button>

            {/* Light a New Star Button */}
            <button
              onClick={handleCompleteSabaq}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-badge font-semibold transition shadow-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-emerald-500/25 active:scale-95"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>Complete Sabaq • Light a Star</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout: Left Sidebar + Right Ayah Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR (Controls, Mood, Audio Looper, Stored Notes, Target Config) */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Segment 1: Daily Target Configuration */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/85 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Daily Sabaq Target</span>
              </h3>
              <span className="text-[11px] font-badge text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                Juz {currentSurahMeta.juzNumber}
              </span>
            </div>

            {/* Surah Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-badge text-slate-400 block">
                Select Surah
              </label>
              <select
                value={sabaqSurah}
                onChange={(e) => {
                  const sNum = Number(e.target.value);
                  setSabaqSurah(sNum);
                  setAyahStart(1);
                  setAyahEnd(Math.min(3, getSurahMeta(sNum)?.totalAyahs || 3));
                  setFocusedAyah(1);
                  setPlayingAyah(null);
                  setIsPlaying(false);
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs font-badge outline-none focus:border-emerald-400 cursor-pointer shadow-inner"
              >
                {QURAN_SURAHS.map((s) => (
                  <option key={s.number} value={s.number} className="bg-slate-950 text-white">
                    {s.number}. {s.nameEnglish} ({s.nameArabic}) • {s.totalAyahs} Ayahs
                  </option>
                ))}
              </select>
            </div>

            {/* Ayah Range (From -> To) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-badge text-slate-400 block">From Ayah</label>
                <input
                  type="number"
                  min={1}
                  max={currentSurahMeta.totalAyahs}
                  value={ayahStart}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value));
                    setAyahStart(val);
                    if (val > ayahEnd) setAyahEnd(val);
                    setFocusedAyah(val);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-badge outline-none focus:border-emerald-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-badge text-slate-400 block">To Ayah</label>
                <input
                  type="number"
                  min={ayahStart}
                  max={currentSurahMeta.totalAyahs}
                  value={ayahEnd}
                  onChange={(e) =>
                    setAyahEnd(
                      Math.max(ayahStart, Math.min(currentSurahMeta.totalAyahs, Number(e.target.value)))
                    )
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-badge outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Surah Mini Info Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-badge">Type</span>
                <span className="text-white font-badge font-semibold">{currentSurahMeta.revelationType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-badge">Total Verses</span>
                <span className="text-emerald-400 font-badge font-semibold">{currentSurahMeta.totalAyahs}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-badge">Today&apos;s Portion</span>
                <span className="text-cyan-400 font-badge font-semibold">{targetAyahs.length} Verses</span>
              </div>
            </div>
          </div>

          {/* Segment 2: Reading Mode Switcher */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/85 border border-white/10 backdrop-blur-md shadow-xl space-y-3">
            <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Reading Mode</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-white/5">
              <button
                onClick={() => setReadingMode("individual")}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-badge transition text-center ${
                  readingMode === "individual"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="block text-sm mb-0.5">📖</span>
                <span>Single Ayah (Focus)</span>
                <span className="text-[10px] opacity-75 font-normal">One verse at a time</span>
              </button>

              <button
                onClick={() => setReadingMode("mushaf")}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-badge transition text-center ${
                  readingMode === "mushaf"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="block text-sm mb-0.5">📜</span>
                <span>Mushaf Page</span>
                <span className="text-[10px] opacity-75 font-normal">Continuous page view</span>
              </button>
            </div>
          </div>

          {/* Segment 3: Audio Looper & Takrar Studio */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/85 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Repeat className="w-4 h-4 text-amber-400" />
                <span>Audio Looper (Takrar)</span>
              </h3>
              {isPlaying && (
                <span className="flex items-center gap-1.5 text-[10px] font-badge text-emerald-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Playing
                </span>
              )}
            </div>

            {/* Reciter Toggle */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-badge text-slate-400 block">Reciter</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-badge">
                <button
                  onClick={() => setReciter("husary")}
                  className={`py-2 px-3 rounded-xl border transition ${
                    reciter === "husary"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold"
                      : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  Al-Husary (Tajweed)
                </button>
                <button
                  onClick={() => setReciter("alafasy")}
                  className={`py-2 px-3 rounded-xl border transition ${
                    reciter === "alafasy"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold"
                      : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  Alafasy (Mishary)
                </button>
              </div>
            </div>

            {/* Repeat Target (Loop count) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-badge text-slate-400">
                <span>Loop Count (Takrar)</span>
                <span className="text-amber-300 font-bold">
                  {takrarTarget === 0 ? "Infinite (∞)" : `${takrarTarget} Loops`}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-xs font-badge">
                {[1, 3, 5, 7, 10].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setTakrarTarget(count);
                      setTakrarCurrentLoop(1);
                    }}
                    className={`py-1.5 rounded-xl border text-center transition ${
                      takrarTarget === count
                        ? "bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm"
                        : "bg-slate-900 border-white/5 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {count}x
                  </button>
                ))}
              </div>
            </div>

            {/* Loop Status Bar */}
            {isPlaying && playingAyah !== null && (
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between font-badge">
                  <span className="text-amber-200">Verse #{playingAyah} Looping</span>
                  <span className="text-amber-400 font-bold">
                    Loop {takrarCurrentLoop} of {takrarTarget === 0 ? "∞" : takrarTarget}
                  </span>
                </div>
                {takrarTarget > 0 && (
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (takrarCurrentLoop / takrarTarget) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Playback Controls */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={handlePrevAyah}
                disabled={focusedAyah <= ayahStart}
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition"
                title="Previous Verse"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => togglePlayAyah(focusedAyah)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-badge font-bold text-xs shadow-lg transition"
              >
                {isCurrentAyahPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-slate-950" />
                )}
                <span>
                  {isCurrentAyahPlaying
                    ? `Pause Verse #${focusedAyah}`
                    : `Loop Verse #${focusedAyah}`}
                </span>
              </button>

              <button
                onClick={handleNextAyah}
                disabled={focusedAyah >= ayahEnd}
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition"
                title="Next Verse"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Auto Advance Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-subheading text-slate-400">
              <span>Auto-advance after loop completes</span>
              <button
                onClick={() => setAutoAdvance(!autoAdvance)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  autoAdvance ? "bg-emerald-500" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoAdvance ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SEGMENT 4: SIDEBAR STORED NOTES LAUNCHER (Opens Full-Screen Modal)        */}
          {/* ========================================================================= */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/85 border border-purple-500/30 backdrop-blur-md shadow-xl space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <PenLine className="w-4 h-4 text-purple-400" />
                <span>Stored Reflections</span>
              </h3>
              <span className="text-[11px] font-badge text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-lg">
                {reflections.length} Notes
              </span>
            </div>

            <p className="text-xs font-subheading text-slate-300 leading-relaxed">
              {reflections.length === 0
                ? "No reflections saved yet. Record your personal life lessons below each verse."
                : `You have ${reflections.length} recorded personal life lessons and reflections across your journey.`}
            </p>

            {/* Latest note preview card if available */}
            {reflections.length > 0 && (
              <div
                onClick={() => setIsVaultOpen(true)}
                className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 hover:border-purple-400/50 cursor-pointer transition text-xs space-y-1.5 group"
                title="Click to view in full-screen modal"
              >
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-badge">
                  <span>Latest Note:</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {new Date(reflections[0].createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-slate-200 text-xs italic font-bengali line-clamp-2 leading-relaxed">
                  &ldquo;{reflections[0].reflection}&rdquo;
                </p>
              </div>
            )}

            {/* Prominent Action Button: Opens the Large Full-Screen Modal */}
            <button
              type="button"
              onClick={() => setIsVaultOpen(true)}
              className="w-full py-2.5 px-4 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-badge transition flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 text-purple-300" />
              <span>Open Stored Notes (Full Screen)</span>
            </button>
          </div>

          {/* Segment 5: Celestial Completion Preview Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-cyan-950/40 border border-emerald-500/30 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-300">
              <Star className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-badge text-emerald-300">Light a New Star</h4>
              <p className="text-[11px] font-subheading text-slate-300 mt-1 leading-relaxed">
                When all target verses are committed to memory, click &ldquo;Complete Sabaq&rdquo;. A new star will ignite in your sky and automatically schedule into tomorrow&apos;s Sabqi revision orbit.
              </p>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT AYAH CANVAS (Mode 1: Single-Ayah Focus | Mode 2: Entire Page)       */}
        {/* ========================================================================= */}
        <main className="lg:col-span-8 space-y-5">
          {/* Canvas Header Bar with Surah details and Stepper */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/85 border border-white/10 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-lg font-serif text-amber-300">
                  {currentSurahMeta.number}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-heading font-bold text-white flex items-center gap-2">
                    <span>{currentSurahMeta.nameEnglish}</span>
                    <span className="text-emerald-400 font-serif text-sm font-normal">
                      ({currentSurahMeta.nameArabic})
                    </span>
                  </h2>
                  <p className="text-xs font-subheading text-slate-400">
                    Target: Verses {ayahStart} to {ayahEnd} • {targetAyahs.length} Verses Total
                  </p>
                </div>
              </div>

              {/* Progress summary */}
              <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-2xl border border-white/10 text-xs font-badge text-slate-300 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {targetAyahs.filter((a) => memorizedAyahs.includes(a)).length} / {targetAyahs.length} Memorized
                </span>
              </div>
            </div>

            {/* Horizontal Ayah Stepper / Pagination Pills */}
            <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] font-badge text-slate-400 shrink-0 mr-1">
                Verse Stepper:
              </span>
              {targetAyahs.map((aNum) => {
                const isSelected = focusedAyah === aNum;
                const isChecked = memorizedAyahs.includes(aNum);
                const hasRefl = reflections.some(
                  (r) => r.surahNumber === sabaqSurah && r.ayahNumber === aNum
                );
                const isItemPlaying = playingAyah === aNum && isPlaying;

                return (
                  <button
                    key={aNum}
                    onClick={() => {
                      setFocusedAyah(aNum);
                      if (isPlaying) {
                        togglePlayAyah(aNum);
                      }
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-badge transition shrink-0 flex items-center gap-1 border ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20 scale-105"
                        : isChecked
                        ? "bg-emerald-950/50 text-emerald-300 border-emerald-500/30 hover:border-emerald-400"
                        : "bg-slate-900 text-slate-300 border-white/5 hover:bg-slate-800"
                    }`}
                    title={`Verse #${aNum}`}
                  >
                    <span>{aNum}</span>
                    {isItemPlaying && <Volume2 className="w-3 h-3 text-amber-300 animate-pulse" />}
                    {isChecked && !isItemPlaying && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {hasRefl && !isChecked && !isItemPlaying && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoadingAyahs && (
            <div className="p-8 rounded-3xl bg-slate-950/60 border border-white/5 space-y-4 animate-pulse">
              <div className="h-6 w-1/3 bg-slate-800 rounded-lg" />
              <div className="h-24 w-full bg-slate-800/60 rounded-2xl" />
              <div className="h-10 w-2/3 bg-slate-800/40 rounded-xl" />
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* MODE 1: SINGLE-AYAH FOCUS MODE (One verse at a time, others hidden)    */}
          {/* ----------------------------------------------------------------------- */}
          {!isLoadingAyahs && readingMode === "individual" && (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sabaqSurah}-${focusedAyah}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-2xl backdrop-blur-md relative ${
                    isCurrentAyahPlaying
                      ? "bg-slate-900/95 border-amber-500/60 shadow-amber-500/10 ring-1 ring-amber-500/40"
                      : isCurrentAyahChecked
                      ? "bg-emerald-950/20 border-emerald-500/40"
                      : "bg-slate-950/90 border-white/10"
                  }`}
                >
                  {/* Active Ayah Navigation Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 font-badge text-xs">
                        Verse #{focusedAyah} (Verse {focusedAyah - ayahStart + 1} of {targetAyahs.length})
                      </span>
                      {isCurrentAyahChecked && (
                        <span className="flex items-center gap-1 text-[11px] font-badge text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Memorized
                        </span>
                      )}
                      {isCurrentAyahPlaying && (
                        <span className="flex items-center gap-1 text-[11px] font-badge text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-lg animate-pulse">
                          <Volume2 className="w-3.5 h-3.5" />
                          Loop {takrarCurrentLoop} / {takrarTarget === 0 ? "∞" : takrarTarget}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Memory Mask (Blur Toggle / First-Word Mode) */}
                      <button
                        type="button"
                        onClick={() => setIsMemoryMaskActive(!isMemoryMaskActive)}
                        className={`p-2 rounded-xl border text-xs font-badge transition flex items-center justify-center ${
                          isMemoryMaskActive
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10"
                            : "bg-slate-900 hover:bg-slate-800 text-slate-400 border-white/10 hover:border-amber-400/40"
                        }`}
                        title={
                          isMemoryMaskActive
                            ? "Memory Mask Active (First-Word Mode)"
                            : "Toggle Memory Mask (Blur Mode)"
                        }
                      >
                        {isMemoryMaskActive ? (
                          <EyeOff className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                      {/* Quick checkmark toggle */}
                      <button
                        onClick={() => handleToggleAyahMemorized(focusedAyah)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-badge transition flex items-center gap-1.5 ${
                          isCurrentAyahChecked
                            ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold"
                            : "bg-slate-900 hover:bg-slate-800 text-slate-400 border-white/10 hover:border-emerald-400/50"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{isCurrentAyahChecked ? "Memorized ✓" : "Mark as Memorized"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Arabic Verse (Prominent, large Arabic font) */}
                  <div className="py-8 sm:py-10 text-center">
                    <p
                      dir="rtl"
                      lang="ar"
                      className="text-3xl sm:text-4xl md:text-5xl text-amber-100/95 leading-[2.3] md:leading-[2.4] select-text drop-shadow-[0_2px_12px_rgba(250,204,21,0.12)] font-serif"
                      style={{
                        fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif",
                      }}
                    >
                      {isMemoryMaskActive && arabicWords.length > 0 ? (
                        <span>
                          <span className="text-amber-300 font-bold drop-shadow-[0_0_14px_rgba(251,191,36,0.5)]">
                            {firstWord}
                          </span>{" "}
                          <span
                            className="blur-md select-none opacity-40 hover:blur-none hover:opacity-100 transition-all duration-300 cursor-pointer"
                            title="Hover to peek"
                          >
                            {remainingWords}
                          </span>
                        </span>
                      ) : (
                        activeAyahData?.arabic || "..."
                      )}
                      <span className="inline-block text-2xl sm:text-3xl text-amber-400/80 mx-3 font-serif select-none">
                        ۝{focusedAyah}
                      </span>
                    </p>
                  </div>

                  {/* Quoted Translation (Uses designated Atma font for Bengali, Delius for English) */}
                  <div className="mt-2 pt-5 border-t border-white/10 text-center space-y-2">
                    <p
                      className={`text-base sm:text-lg text-emerald-200/90 leading-relaxed max-w-2xl mx-auto transition-all duration-300 ${
                        isMemoryMaskActive
                          ? "blur-sm opacity-25 select-none hover:blur-none hover:opacity-100 cursor-pointer"
                          : ""
                      } ${
                        translationLang === "bn"
                          ? "font-bengali text-lg sm:text-xl not-italic"
                          : "font-subheading italic"
                      }`}
                    >
                      &ldquo;{currentTranslationText || "Loading translation..."}&rdquo;
                    </p>

                    {/* Language Switcher Pill */}
                    <div className="flex items-center justify-center gap-1.5 pt-1">
                      <button
                        onClick={() => setTranslationLang("en")}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-badge transition ${
                          translationLang === "en"
                            ? "bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        English
                      </button>
                      <span className="text-slate-600 text-[10px]">•</span>
                      <button
                        onClick={() => setTranslationLang("bn")}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-badge transition ${
                          translationLang === "bn"
                            ? "bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        বাংলা
                      </button>
                    </div>
                  </div>

                  {/* Ayah Shift Controller (Previous / Next Buttons & Voice Mirror) */}
                  <div className="pt-6 mt-6 border-t border-white/5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={handlePrevAyah}
                        disabled={focusedAyah <= ayahStart}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-badge transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Verse</span>
                      </button>

                      {/* Main Audio & Voice Mirror Action Group */}
                      <div className="flex items-center gap-2">
                        {/* Sheikh Loop Playback Button */}
                        <button
                          onClick={() => togglePlayAyah(focusedAyah)}
                          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-badge font-semibold transition ${
                            isCurrentAyahPlaying
                              ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                              : "bg-slate-900 hover:bg-slate-800 border border-white/10 text-cyan-300"
                          }`}
                        >
                          {isCurrentAyahPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span>{isCurrentAyahPlaying ? "Pause Loop" : "Loop This Verse"}</span>
                        </button>

                        {/* Quick Voice Mirror: Record My Voice Button */}
                        {!isRecordingVoice ? (
                          <button
                            type="button"
                            onClick={startVoiceRecording}
                            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs font-badge transition border ${
                              userAudioUrl
                                ? "bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/50"
                                : "bg-slate-900 hover:bg-slate-800 border-white/10 text-rose-400 hover:border-rose-500/40"
                            }`}
                            title="Record your own voice to check Makhraj & Tajweed against the Sheikh"
                          >
                            <Mic className="w-4 h-4 text-rose-400" />
                            <span>{userAudioUrl ? "Re-record Voice" : "Record My Voice"}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopVoiceRecording}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-badge font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition animate-pulse"
                            title="Click to stop recording"
                          >
                            <Square className="w-3.5 h-3.5 fill-white" />
                            <span>Stop ({recordingDuration}s)</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={handleNextAyah}
                        disabled={focusedAyah >= ayahEnd}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-badge transition"
                      >
                        <span>Next Verse</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Voice Mirror Recorded Player Bar */}
                    {userAudioUrl && !isRecordingVoice && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-purple-950/40 border border-rose-500/30 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={togglePlayUserAudio}
                            className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition"
                            title={isUserAudioPlaying ? "Pause My Recitation" : "Play My Recitation"}
                          >
                            {isUserAudioPlaying ? (
                              <Pause className="w-4 h-4 fill-slate-950" />
                            ) : (
                              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                            )}
                          </button>
                          <div>
                            <div className="text-white font-badge font-bold flex items-center gap-1.5">
                              <span>My Voice Mirror</span>
                              <span className="text-[10px] text-rose-300 bg-rose-950 px-1.5 py-0.2 rounded font-normal border border-rose-500/30">
                                {recordingDuration > 0 ? `${recordingDuration}s` : "Recorded"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-subheading">
                              Listen to check your Makhraj & Tajweed against the Sheikh
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={startVoiceRecording}
                            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-[11px] font-badge transition"
                            title="Re-record"
                          >
                            Re-record
                          </button>
                          <button
                            type="button"
                            onClick={clearUserAudio}
                            className="p-1.5 rounded-xl hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition"
                            title="Delete recording"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {voiceMirrorError && (
                      <p className="text-xs text-rose-400 text-center font-subheading">
                        {voiceMirrorError}
                      </p>
                    )}
                  </div>

                  {/* =============================================================== */}
                  {/* DEDICATED REFLECTION BOX (Always visible under active verse)   */}
                  {/* =============================================================== */}
                  <div className="mt-8 pt-6 border-t-2 border-purple-500/30">
                    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-purple-500/30 space-y-4 shadow-xl">
                      {/* Box Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-purple-300 font-heading text-sm font-bold">
                          <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-400/40 flex items-center justify-center">
                            <PenLine className="w-3.5 h-3.5 text-purple-300" />
                          </div>
                          <span>Verse Reflection (Tadabbur) • Verse #{focusedAyah}</span>
                        </div>
                        <span className="text-[11px] font-badge text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-lg">
                          Personal Life Lesson
                        </span>
                      </div>

                      <p className="text-xs font-subheading text-slate-300 leading-relaxed">
                        What spiritual insight or practical lesson did you derive for your daily life from today&apos;s verse? Write in 1-2 lines:
                      </p>

                      {/* Text Input Area */}
                      <textarea
                        rows={2}
                        value={reflectionInputText}
                        onChange={(e) => setReflectionInputText(e.target.value)}
                        placeholder="e.g. This verse inspires me to remain steadfast in trials, perform good deeds sincerely, and maintain full reliance on Allah..."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs font-subheading focus:outline-none focus:border-purple-400 resize-none shadow-inner leading-relaxed"
                      />

                      {/* Tag Selection & Action: Selected Tags + Quick Presets + Manual Hashtag Input */}
                      <div className="space-y-2.5 pt-1">
                        {/* Selected Tags Display */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-badge text-purple-300 flex items-center gap-1 mr-1">
                            <Tag className="w-3 h-3 text-purple-400" />
                            Tags:
                          </span>
                          {selectedTags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 text-[11px] font-badge px-2.5 py-0.5 rounded-lg bg-purple-600 text-white shadow-sm"
                            >
                              <span>#{t}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(t)}
                                className="hover:text-rose-200 transition text-[11px] ml-0.5"
                                title="Remove tag"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Presets + Manual Input + Save Button Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          {/* Left: Preset Suggestions & Custom Hashtag Input */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Preset Tag Buttons */}
                            <div className="flex flex-wrap items-center gap-1">
                              {["Patience", "Gratitude", "Tawakkul", "Action", "Mindfulness"].map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleTogglePresetTag(tag)}
                                    className={`px-2 py-0.5 rounded-md text-[11px] font-badge transition ${
                                      isSelected
                                        ? "bg-purple-900/80 text-purple-200 border border-purple-400/50"
                                        : "bg-slate-950 border border-white/5 text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    #{tag}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Manual Hashtag Input Box */}
                            <div className="flex items-center gap-1 bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1 focus-within:border-purple-400 shadow-inner">
                              <span className="text-purple-400 text-xs font-badge">#</span>
                              <input
                                type="text"
                                value={customTagInput}
                                onChange={(e) => setCustomTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddCustomTag();
                                  }
                                }}
                                placeholder="Custom hashtag..."
                                className="bg-transparent text-white text-xs font-subheading outline-none w-28 sm:w-36 placeholder:text-slate-500"
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomTag}
                                disabled={!customTagInput.trim()}
                                className="px-2 py-0.5 rounded-lg bg-purple-700 hover:bg-purple-600 disabled:opacity-30 text-[10px] font-badge text-white transition flex items-center gap-0.5"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>Add</span>
                              </button>
                            </div>
                          </div>

                          {/* Right: Save Button & Success message */}
                          <div className="flex items-center gap-3">
                            {reflectionSaveSuccess && (
                              <span className="text-emerald-400 text-xs font-badge flex items-center gap-1 animate-pulse">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Saved successfully! ✓
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleSaveReflection(focusedAyah)}
                              disabled={!reflectionInputText.trim()}
                              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-badge font-semibold transition shadow-md shadow-purple-600/20 active:scale-95"
                            >
                              Save Reflection
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Display previously saved reflections for THIS Ayah with specific height & scroll */}
                      {currentAyahReflections.length > 0 && (
                        <div className="pt-4 border-t border-purple-500/20 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-badge text-purple-300">
                            <span>Saved Reflections for this Verse ({currentAyahReflections.length}):</span>
                            <button
                              type="button"
                              onClick={() => setIsVaultOpen(true)}
                              className="text-cyan-400 hover:text-cyan-300 transition text-[11px] flex items-center gap-1 font-normal"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>View All Notes Full Screen</span>
                            </button>
                          </div>

                          <div className="max-h-48 overflow-y-auto pr-1.5 space-y-2.5">
                            {currentAyahReflections.map((r) => (
                              <div
                                key={r.id}
                                className="p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/20 text-xs font-subheading flex items-start justify-between gap-2 text-purple-200"
                              >
                                <div className="space-y-1">
                                  <p className="italic leading-relaxed font-bengali text-slate-100">&ldquo;{r.reflection}&rdquo;</p>
                                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 font-badge">
                                    <span>
                                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                    {r.tags.map((t) => (
                                      <span key={t} className="text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded">
                                        #{t}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    const updated = reflections.filter((item) => item.id !== r.id);
                                    setReflections(updated);
                                    saveReflections(updated);
                                  }}
                                  className="text-rose-400 hover:text-rose-300 p-1 shrink-0"
                                  title="Delete note"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* MODE 2: ENTIRE PAGE / CONTINUOUS MUSHAF VIEW                            */}
          {/* ----------------------------------------------------------------------- */}
          {!isLoadingAyahs && readingMode === "mushaf" && (
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/95 border-2 border-amber-500/30 shadow-2xl backdrop-blur-xl relative space-y-6">
              {/* Traditional Mushaf Ornamental Frame Header */}
              <div className="text-center py-4 border-b border-amber-500/20 relative">
                <div className="inline-block px-8 py-2 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 font-serif text-lg tracking-widest">
                  سُورَةُ {currentSurahMeta.nameArabic}
                </div>
                <div className="text-xs text-amber-300/80 mt-1.5 font-subheading">
                  {currentSurahMeta.nameEnglish} • {currentSurahMeta.revelationType} Revelation
                </div>
              </div>

              {/* Bismillah Header (except for Surah At-Tawbah) */}
              {sabaqSurah !== 9 && (
                <div className="text-center py-2">
                  <p
                    dir="rtl"
                    className="text-2xl sm:text-3xl text-amber-200 font-serif"
                    style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}

              {/* Continuous Flow of Ayahs (Classical Mushaf Flow) */}
              <div
                dir="rtl"
                className="text-2xl sm:text-3xl md:text-[32px] text-amber-100/90 font-serif leading-[2.6] select-text text-justify"
                style={{ fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif" }}
              >
                {targetAyahs.map((aNum) => {
                  const ayahItem = ayahsMap[aNum];
                  const isFocused = (mushafFocusedAyah || focusedAyah) === aNum;
                  const isCurrentlyPlaying = playingAyah === aNum && isPlaying;
                  const isChecked = memorizedAyahs.includes(aNum);

                  return (
                    <span
                      key={aNum}
                      onClick={() => {
                        setMushafFocusedAyah(aNum);
                        setFocusedAyah(aNum);
                        togglePlayAyah(aNum);
                      }}
                      className={`cursor-pointer transition-all rounded-lg px-1.5 py-0.5 inline ${
                        isCurrentlyPlaying
                          ? "bg-amber-400/25 text-amber-100 shadow-sm ring-1 ring-amber-400"
                          : isFocused
                          ? "bg-cyan-500/20 text-white"
                          : isChecked
                          ? "text-emerald-100 hover:bg-emerald-500/10"
                          : "hover:bg-white/5"
                      }`}
                      title={`Click to listen and view verse #${aNum}`}
                    >
                      {ayahItem?.arabic || "..."}
                      <span className="inline-block text-xl sm:text-2xl text-amber-400/80 mx-2 select-none">
                        ۝{aNum}
                      </span>
                    </span>
                  );
                })}
              </div>

              {/* Mushaf Mode Floating Interactive Footer */}
              <div className="mt-8 pt-5 border-t border-amber-500/20">
                {mushafFocusedAyah ? (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-badge text-cyan-300">
                        Verse #{mushafFocusedAyah} Translation:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePlayAyah(mushafFocusedAyah)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-badge border border-amber-500/40"
                        >
                          {playingAyah === mushafFocusedAyah && isPlaying ? "Pause" : "Play Loop"}
                        </button>
                        <button
                          onClick={() => {
                            setFocusedAyah(mushafFocusedAyah);
                            setReadingMode("individual");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-badge border border-purple-500/40"
                        >
                          Write Reflection
                        </button>
                      </div>
                    </div>
                    <p
                      className={`text-sm text-slate-200 leading-relaxed ${
                        translationLang === "bn"
                          ? "font-bengali text-base not-italic"
                          : "font-subheading italic"
                      }`}
                    >
                      &ldquo;
                      {translationLang === "bn" && ayahsMap[mushafFocusedAyah]?.translationBn
                        ? ayahsMap[mushafFocusedAyah]?.translationBn
                        : ayahsMap[mushafFocusedAyah]?.translationEn || "Loading translation..."}
                      &rdquo;
                    </p>
                  </div>
                ) : (
                  <p className="text-xs font-subheading text-slate-400 text-center">
                    (Click on any verse to start audio loop and inspect its translation)
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* CELEBRATION MODAL: 'Light a New Star' (Portaled to document.body)         */}
      {/* ========================================================================= */}
      {isMounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isStarCelebrationOpen && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                onClick={() => setIsStarCelebrationOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg rounded-3xl bg-slate-950/95 border-2 border-emerald-500/50 shadow-2xl p-6 sm:p-8 text-center space-y-6 text-slate-100 overflow-hidden"
                >
                  {/* Radial celestial ambient glow */}
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent" />

                  {/* Close Button */}
                  <button
                    onClick={() => setIsStarCelebrationOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Radiant Star Graphic */}
                  <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse" />
                    <svg viewBox="-60 -60 120 120" className="w-24 h-24 filter drop-shadow-[0_0_16px_rgba(52,211,153,0.9)]">
                      <FacetedIlluminatedStar x={0} y={0} size={42} score={100} label="New Star" />
                    </svg>
                  </div>

                  {/* Header Title & Blessings */}
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-badge">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Alhamdulillah • New Celestial Star Ignited</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide">
                      Masha&apos;Allah! A New Star Lights Your Sky 🌟
                    </h3>
                    <p className="text-xs sm:text-sm font-subheading text-slate-300 leading-relaxed max-w-md mx-auto">
                      Surah <span className="text-emerald-400 font-bold">{currentSurahMeta.nameEnglish}</span>,{" "}
                      <span className="text-emerald-300 font-bold">Verses {ayahStart} to {ayahEnd}</span> have been committed to memory with full radiance.
                    </p>
                  </div>

                  {/* Automatic Sabqi Queue Notification */}
                  <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-left space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-cyan-300 font-badge">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Automatic Sabqi Revision Scheduled:</span>
                    </div>
                    <p className="text-slate-300 font-subheading leading-relaxed">
                      This portion has been automatically scheduled in tomorrow&apos;s **Sabqi (Recent Revision)** orbit. It will remain in active daily rotation for the next 7 to 10 days to solidify retention.
                    </p>
                  </div>

                  {/* Navigation Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/hifz"
                      onClick={() => setIsStarCelebrationOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-badge transition"
                    >
                      <Compass className="w-4 h-4 text-emerald-400" />
                      <span>View in Celestial Sky</span>
                    </Link>

                    <Link
                      href="/hifz/sabqi"
                      onClick={() => setIsStarCelebrationOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-badge font-bold transition shadow-lg hover:brightness-110"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Go to Sabqi Orbit</span>
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* EXPANSIVE FULL-SCREEN MODAL: STORED REFLECTIONS & NOTES (Portaled to body) */}
      {/* ========================================================================= */}
      {isMounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isVaultOpen && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md"
                onClick={() => setIsVaultOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-6xl h-[88vh] sm:h-[92vh] rounded-3xl bg-slate-950 border-2 border-purple-500/40 shadow-2xl flex flex-col overflow-hidden text-slate-100"
                >
                  {/* Radial ambient glow */}
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent" />

                  {/* Modal Top Header */}
                  <div className="relative z-10 p-5 sm:p-6 border-b border-white/10 bg-slate-900/70 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-950 border border-purple-400/40 flex items-center justify-center shadow-lg">
                        <PenLine className="w-5 h-5 text-purple-300" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-white flex items-center gap-2">
                          <span>Stored Reflections & Life Lessons</span>
                          <span className="text-xs font-badge text-purple-300 bg-purple-950/80 border border-purple-500/30 px-2.5 py-0.5 rounded-lg">
                            {filteredVaultReflections.length} {filteredVaultReflections.length === 1 ? "Note" : "Notes"}
                          </span>
                        </h3>
                        <p className="text-xs font-subheading text-slate-400">
                          Personal insights, tadabbur, and practical life takeaways recorded across your Hifz journey
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Close Button */}
                      <button
                        onClick={() => setIsVaultOpen(false)}
                        className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition border border-white/5"
                        title="Close (Esc)"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Bar Row */}
                  <div className="relative z-10 p-4 border-b border-white/10 bg-slate-900/40 flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={vaultSearchQuery}
                        onChange={(e) => setVaultSearchQuery(e.target.value)}
                        placeholder="Search by note content, tag (#patience), or Surah name..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-xs font-subheading text-white focus:outline-none focus:border-purple-400 shadow-inner"
                      />
                      {vaultSearchQuery && (
                        <button
                          onClick={() => setVaultSearchQuery("")}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Filter by Surah */}
                    <select
                      value={vaultSurahFilter}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVaultSurahFilter(val === "all" ? "all" : Number(val));
                      }}
                      className="w-full sm:w-56 px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-xs font-badge text-white focus:outline-none focus:border-purple-400 cursor-pointer shadow-inner"
                    >
                      <option value="all">All Surahs ({reflections.length})</option>
                      {uniqueSurahNumbersWithNotes.map((sNum) => {
                        const meta = getSurahMeta(sNum);
                        const count = reflections.filter((r) => r.surahNumber === sNum).length;
                        return (
                          <option key={sNum} value={sNum}>
                            {sNum}. {meta?.nameEnglish} ({count} notes)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Main Notes Grid (Multi-column) */}
                  <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6">
                    {filteredVaultReflections.length === 0 ? (
                      <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center py-16 space-y-3 text-slate-500">
                        <div className="w-14 h-14 rounded-3xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400">
                          <PenLine className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-heading font-bold text-slate-300">
                            No reflections found
                          </h4>
                          <p className="text-xs font-subheading text-slate-400 max-w-sm">
                            {vaultSearchQuery || vaultSurahFilter !== "all"
                              ? "Try clearing your search query or surah filter to see all notes."
                              : "Start writing your personal life takeaways in the reflection box below each verse to store them here."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredVaultReflections.map((r) => {
                          const meta = getSurahMeta(r.surahNumber);
                          return (
                            <div
                              key={r.id}
                              className="p-5 rounded-3xl bg-slate-900/80 border border-purple-500/20 hover:border-purple-400/50 hover:bg-slate-900 transition-all flex flex-col justify-between space-y-3.5 shadow-lg group relative"
                            >
                              <div className="space-y-2.5">
                                {/* Card Top: Surah badge + Date */}
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-badge text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-xl">
                                    {meta?.nameEnglish} • Verse #{r.ayahNumber}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-badge">
                                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>

                                {/* Arabic Verse Excerpt */}
                                {r.arabicText && (
                                  <p
                                    dir="rtl"
                                    className="text-base text-amber-200/90 font-serif leading-relaxed line-clamp-2 select-text"
                                    style={{ fontFamily: "'Traditional Arabic', serif" }}
                                  >
                                    {r.arabicText}
                                  </p>
                                )}

                                {/* Quoted Reflection Note in designated Atma Bengali font */}
                                <p className="text-sm text-slate-100 leading-relaxed italic font-bengali bg-black/30 p-3.5 rounded-2xl border border-white/5 select-text">
                                  &ldquo;{r.reflection}&rdquo;
                                </p>
                              </div>

                              {/* Card Bottom: Tags + Action Buttons (Jump to Verse, Delete) */}
                              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-1">
                                  {r.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="text-[10px] font-badge px-2 py-0.5 rounded-lg bg-purple-950/80 border border-purple-500/30 text-purple-300"
                                    >
                                      #{t}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleJumpToNoteVerse(r)}
                                    className="px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-badge transition flex items-center gap-1"
                                    title="Study this verse in Sabaq Studio"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Go to Verse</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = reflections.filter((item) => item.id !== r.id);
                                      setReflections(updated);
                                      saveReflections(updated);
                                    }}
                                    className="p-1.5 rounded-xl hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition"
                                    title="Delete note"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
