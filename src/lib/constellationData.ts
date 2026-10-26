import { ConstellationMilestone, ConstellationConnection } from "@/types/constellation";

export const CONSTELLATION_STORAGE_KEY = "be_talha_winged_constellation_v3_en";
export const DAILY_TASKS_STORAGE_KEY = "be_talha_constellation_tasks_v3_en";

export const DEFAULT_CONSTELLATION_MILESTONES: ConstellationMilestone[] = [
  {
    id: "star-root",
    title: "Childhood Roots & Family Anchor",
    category: "roots",
    categoryLabel: "Roots & Anchor",
    wingSection: "anchor",
    wingLabel: "The Root Foundation",
    description:
      "The sacred ground of upbringing, parents' prayers, childhood innocence, and the foundational anchor where the journey began.",
    x: 50,
    y: 82,
    completed: true,
    completedAt: Date.now() - 86400000 * 30,
    magnitude: 3,
    color: "#38bdf8", // Sky cyan
    targetHorizon: "Lifelong Anchor",
  },
  {
    id: "star-core",
    title: "The Reference Point: Deep Reflection & Spiritual Anchor",
    category: "roots",
    categoryLabel: "Spiritual Center",
    wingSection: "anchor",
    wingLabel: "The Reference Point",
    description:
      "“Never stray from the center reference point. This point is your roots.” Subhe Sadik dawn contemplation, Quranic reflection, and unshakeable inner peace.",
    x: 50,
    y: 56,
    completed: true,
    completedAt: Date.now() - 86400000 * 20,
    magnitude: 5,
    color: "#fbbf24", // Celestial Gold
    targetHorizon: "Daily & Eternal",
  },
  {
    id: "star-heart",
    title: "Inner Conviction & Unyielding Resolve",
    category: "character",
    categoryLabel: "Heart & Resolve",
    wingSection: "anchor",
    wingLabel: "Heart of Light",
    description:
      "Unyielding belief in your own capacity. Never fearing the dark, but igniting light from within to conquer self-doubt and forge forward.",
    x: 50,
    y: 38,
    completed: true,
    completedAt: Date.now() - 86400000 * 10,
    magnitude: 4,
    color: "#67e8f9",
    targetHorizon: "2026 Core",
  },
  {
    id: "star-apex",
    title: "The Winged Morning Star: Radiating Singular Light",
    category: "beacon",
    categoryLabel: "Ultimate Emergence",
    wingSection: "apex",
    wingLabel: "Beacon of Dawn",
    description:
      "Transcending all limitations to spread your own unique radiance across the universe. “May you grow wings. Become the winged morning star!”",
    x: 50,
    y: 14,
    completed: false,
    magnitude: 5,
    color: "#f59e0b", // Radiant Amber
    targetHorizon: "Life's Zenith",
  },

  // --- LEFT WING: Mind, Intellect & Engineering Craftsmanship ---
  {
    id: "star-left-brace",
    title: "Deep Focused Study & Unbroken Attention",
    category: "intellect",
    categoryLabel: "Intellect & Mind",
    wingSection: "left-wing",
    wingLabel: "Left Wing (Mind & Craft)",
    description:
      "Eliminating digital noise and dedicating daily uninterrupted blocks to deep focus and the pursuit of foundational knowledge.",
    x: 32,
    y: 64,
    completed: true,
    completedAt: Date.now() - 86400000 * 5,
    magnitude: 3,
    color: "#38bdf8",
    targetHorizon: "Daily Habit",
  },
  {
    id: "star-left-inner",
    title: "Software Architecture & System Craftsmanship",
    category: "intellect",
    categoryLabel: "Tech & Systems",
    wingSection: "left-wing",
    wingLabel: "Left Wing (Mind & Craft)",
    description:
      "Mastering scalable distributed systems, resilient architectures, and clean code craftsmanship at global benchmarks.",
    x: 32,
    y: 44,
    completed: false,
    magnitude: 4,
    color: "#38bdf8",
    targetHorizon: "2026–2027",
  },
  {
    id: "star-left-mid",
    title: "Philosophical Depth & Expanding Wisdom",
    category: "intellect",
    categoryLabel: "Wisdom & Insight",
    wingSection: "left-wing",
    wingLabel: "Left Wing (Mind & Craft)",
    description:
      "Synthesizing philosophy, history, and technology into an authentic worldview, piercing down to the root essence of complex problems.",
    x: 20,
    y: 32,
    completed: false,
    magnitude: 4,
    color: "#818cf8", // Indigo glow
    targetHorizon: "2027",
  },
  {
    id: "star-left-tip",
    title: "Singular Digital Innovation & Global Impact",
    category: "creation",
    categoryLabel: "Creation & Impact",
    wingSection: "left-wing",
    wingLabel: "Left Wingtip",
    description:
      "Engineering purposeful software solutions that solve tangible human problems and leave a profound positive mark on society.",
    x: 8,
    y: 18,
    completed: false,
    magnitude: 5,
    color: "#a855f7", // Violet Star
    targetHorizon: "2027–2028",
  },

  // --- RIGHT WING: Discipline, Physical Armor & Character ---
  {
    id: "star-right-brace",
    title: "Peak Physical Vitality & Indomitable Endurance",
    category: "armor",
    categoryLabel: "Vitality & Strength",
    wingSection: "right-wing",
    wingLabel: "Right Wing (Discipline & Armor)",
    description:
      "Building athletic stamina, functional power, and nutritional discipline to forge the body into an invincible fortress.",
    x: 68,
    y: 64,
    completed: true,
    completedAt: Date.now() - 86400000 * 8,
    magnitude: 3,
    color: "#34d399", // Emerald
    targetHorizon: "Daily Discipline",
  },
  {
    id: "star-right-inner",
    title: "The Crucible: Confronting & Burning Flaws",
    category: "character",
    categoryLabel: "Crucible & Renewal",
    wingSection: "right-wing",
    wingLabel: "Right Wing (Discipline & Armor)",
    description:
      "Confronting shortcomings with unflinching honesty and burning away bad habits in the purifying forge of self-renewal.",
    x: 68,
    y: 44,
    completed: false,
    magnitude: 4,
    color: "#fb923c", // Amber-Orange
    targetHorizon: "2026 Focus",
  },
  {
    id: "star-right-mid",
    title: "Mental Armor: All Darkness Is Not Black",
    category: "armor",
    categoryLabel: "Fortitude & Armor",
    wingSection: "right-wing",
    wingLabel: "Right Wing (Discipline & Armor)",
    description:
      "“Rise and fall are life’s eternal rhythm. Just remember... All darkness is not black!” Standing firm through life’s harshest trials.",
    x: 80,
    y: 32,
    completed: false,
    magnitude: 4,
    color: "#f43f5e", // Rose flare
    targetHorizon: "Lifelong Creed",
  },
  {
    id: "star-right-tip",
    title: "Noble Leadership & Enduring Legacy",
    category: "character",
    categoryLabel: "Leadership & Legacy",
    wingSection: "right-wing",
    wingLabel: "Right Wingtip",
    description:
      "Leading with humility, championing truth, uplifting those around you, and leaving a legacy that resonates for generations.",
    x: 92,
    y: 18,
    completed: false,
    magnitude: 5,
    color: "#eab308", // Golden Star
    targetHorizon: "Long-Term Vision",
  },
];

export const CONSTELLATION_CONNECTIONS: ConstellationConnection[] = [
  // Central Spine (The Anchor and Ascent)
  { fromId: "star-root", toId: "star-core" },
  { fromId: "star-core", toId: "star-heart" },
  { fromId: "star-heart", toId: "star-apex" },

  // Left Wing (Winged Falcon Form)
  { fromId: "star-core", toId: "star-left-brace" },
  { fromId: "star-left-brace", toId: "star-left-inner" },
  { fromId: "star-heart", toId: "star-left-inner" },
  { fromId: "star-left-inner", toId: "star-left-mid" },
  { fromId: "star-left-mid", toId: "star-left-tip" },
  { fromId: "star-apex", toId: "star-left-mid" },

  // Right Wing (Winged Falcon Form)
  { fromId: "star-core", toId: "star-right-brace" },
  { fromId: "star-right-brace", toId: "star-right-inner" },
  { fromId: "star-heart", toId: "star-right-inner" },
  { fromId: "star-right-inner", toId: "star-right-mid" },
  { fromId: "star-right-mid", toId: "star-right-tip" },
  { fromId: "star-apex", toId: "star-right-mid" },
];

/**
 * Procedural Celestial Audio Synthesis using Web Audio API.
 * Synthesizes a celestial crystal chime when a star is ignited!
 */
export function playCosmicChime(isIgniting: boolean = true) {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (isIgniting) {
      // Cosmic celestial chord: C5, E5, G5, B5, D6
      const freqs = [523.25, 659.25, 783.99, 987.77, 1174.66];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // Volume envelope with long ethereal shimmer
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.8);
      });
    } else {
      // Soft descending cosmic pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch {
    // Graceful silent fallback if AudioContext is blocked by browser policy
  }
}
