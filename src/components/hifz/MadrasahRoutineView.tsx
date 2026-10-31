"use client";

import React from "react";
import {
  HifzSurahProgress,
  SabaqDailyRoutine,
  MutashabihatItem,
} from "@/types/hifz";
import { PillarsHubCards } from "./pillars/PillarsHubCards";

interface MadrasahRoutineViewProps {
  routine: SabaqDailyRoutine;
  progressList: HifzSurahProgress[];
  mutashabihatList: MutashabihatItem[];
  onUpdateRoutine?: (updated: SabaqDailyRoutine) => void;
  onRecordRevision?: (surahNumber: number) => void;
  onOpenZenMode?: (surahNumber: number, startAyah?: number) => void;
  onAddMutashabihat?: () => void;
}

export function MadrasahRoutineView({
  routine,
  progressList,
  mutashabihatList,
}: MadrasahRoutineViewProps) {
  return (
    <div className="space-y-6">
      <PillarsHubCards
        routine={routine}
        progressList={progressList}
        mutashabihatList={mutashabihatList}
      />
    </div>
  );
}