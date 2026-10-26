"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, Sun, Moon, Sunrise, Sunset, Clock, Sparkles } from "lucide-react";

interface WaqtPeriod {
  name: string;
  bengaliName: string;
  timeRange: string;
  description: string;
  icon: React.ElementType;
  isSpecialAnchor?: boolean;
}

const WAQT_STATIONS: WaqtPeriod[] = [
  {
    name: "Subhe Sadik / Fajr",
    bengaliName: "সুবহে সাদিক ও ফজর",
    timeRange: "০৪:৩০ - ০৫:৫০",
    description: "তালহার জন্মমুহূর্ত (০৪:৪৫)। দিনের প্রথম জ্যোতির্ময় সূচনা ও আত্মিক শিকড়।",
    icon: Sunrise,
    isSpecialAnchor: true,
  },
  {
    name: "Ishraq & Duha",
    bengaliName: "ইশরাক ও চাশত",
    timeRange: "০৬:২০ - ১১:১৫",
    description: "সূর্যোদয়ের দীপ্তি, উচ্চাকাঙ্ক্ষা, পাঠ ও কর্মপ্রেরণার উন্মেষ।",
    icon: Sun,
  },
  {
    name: "Zuhr",
    bengaliName: "জুহর (মধ্যাহ্নের স্থিরতা)",
    timeRange: "১১:৪৫ - ০৩:৩০",
    description: "দিনের মধ্যভাগে অবিচল একাগ্রতা ও লক্ষ্য থেকে বিচ্যুত না হওয়া।",
    icon: Sun,
  },
  {
    name: "Asr",
    bengaliName: "আসর (সময়ের শপথ)",
    timeRange: "০৩:৪৫ - ০৫:১৫",
    description: "“সময়ের কসম, নিশ্চয় মানুষ ক্ষতির মাঝে নিমজ্জিত।” সময়ের হিসেব রাখা।",
    icon: Sunset,
  },
  {
    name: "Maghrib",
    bengaliName: "মাগরিব (গোধূলির নির্যাস)",
    timeRange: "০৫:২৫ - ০৬:৪০",
    description: "দিনের কর্ম সমাপ্তি, শিকড়ে ফেরা ও সান্ধ্যকালীন নীরব আত্মনিমগ্নতা।",
    icon: Sunset,
  },
  {
    name: "Isha & Qiyam",
    bengaliName: "ইশা ও কিয়ামুল লাইল",
    timeRange: "০৭:০০ - ০৪:৩০",
    description: "নীরব রাত, গভীর অধ্যায়ন ও তারায় তারায় ডানা মেলার প্রস্তুতি।",
    icon: Moon,
  },
];

export function WaqtTimeline() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("bn-BD", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-badge uppercase tracking-wider mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>বর্তমান সময়: {currentTime || "গণনা হচ্ছে..."}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading text-slate-100 font-medium">
          সুবহে সাদিক ও মহাজাগতিক ওয়াক্ত
        </h2>
        <p className="mt-2 text-sm text-slate-400 font-bengali max-w-xl mx-auto">
          ২৮ অক্টোবর ২০০৬ সালের সুবহে সাদিকের ক্ষণে শুরু হওয়া যাত্রা—দিনের প্রতিটা প্রহরের সাথে আত্মিক সংযোগ।
        </p>
      </div>

      {/* Anchor highlight card */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900/40 border border-emerald-500/30 shadow-lg">
        <div className="flex items-center gap-3 text-emerald-300 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <h3 className="text-sm font-semibold font-mono tracking-wide uppercase">
            The Birth Anchor • Subhe Sadik (০৪:৪৫ AM)
          </h3>
        </div>
        <p className="text-sm text-slate-300 font-bengali leading-relaxed">
          &ldquo;সুবহে সাদিকের প্রতীক্ষায়—কৃষ্ণবর্ণ যেমন যামিনীর অম্বর রাঙায়; সে জনার হেজাজি প্রজ্ঞার সুর ছড়ায়, কোটি আলোকবর্ষ দূর তারায়–তারায়!&rdquo;
        </p>
      </div>

      {/* Timeline items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WAQT_STATIONS.map((station, idx) => {
          const Icon = station.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`p-4 rounded-xl bg-slate-900/60 border ${
                station.isSpecialAnchor
                  ? "border-emerald-500/40 bg-emerald-950/20"
                  : "border-white/5 hover:border-white/15"
              } transition-all`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-lg ${
                    station.isSpecialAnchor
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-200 font-bengali">
                      {station.bengaliName}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {station.timeRange}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-light mt-1 font-bengali leading-relaxed">
                    {station.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
