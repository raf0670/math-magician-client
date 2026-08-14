export const POINTS_PER_LEVEL = 20;

const RANK_TONES = {
  Silver: {
    name: "text-slate-200",
    badge: "border-slate-300/25 bg-slate-200/10 text-slate-200",
    icon: "text-slate-200",
  },
  Gold: {
    name: "text-amber-300",
    badge: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    icon: "text-amber-300",
  },
  Platinum: {
    name: "text-cyan-100 drop-shadow-[0_0_10px_rgba(186,230,253,0.38)]",
    badge: "border-cyan-200/35 bg-cyan-200/10 text-cyan-100 shadow-[0_0_18px_rgba(125,211,252,0.18)]",
    icon: "text-cyan-100 drop-shadow-[0_0_8px_rgba(186,230,253,0.34)]",
  },
  Master: {
    name: "text-red-300 drop-shadow-[0_0_11px_rgba(248,113,113,0.58)]",
    badge: "border-red-400/35 bg-red-500/10 text-red-300 shadow-[0_0_20px_rgba(220,38,38,0.28)]",
    icon: "text-red-300 drop-shadow-[0_0_9px_rgba(248,113,113,0.52)]",
  },
  Challenger: {
    name: "text-sky-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.62)]",
    badge: "border-sky-300/40 bg-sky-500/10 text-sky-300 shadow-[0_0_22px_rgba(14,165,233,0.34)]",
    icon: "text-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.58)]",
  },
  Legendary: {
    name: "text-amber-100 drop-shadow-[0_0_16px_rgba(251,191,36,0.9)]",
    badge: "border-amber-300/55 bg-linear-to-r from-amber-300/20 via-orange-400/20 to-yellow-200/20 text-amber-100 shadow-[0_0_28px_rgba(251,191,36,0.48)]",
    icon: "text-amber-100 drop-shadow-[0_0_12px_rgba(251,191,36,0.84)]",
  },
};

export function getDefaultRankInfo() {
  return {
    rankName: "Silver III",
    tier: "Silver",
    level: "III",
    rankIndex: 0,
    rankPoints: 0,
    countedExamCount: 0,
    pointsIntoLevel: 0,
    pointsToNextLevel: POINTS_PER_LEVEL,
    nextRankName: "Silver II",
  };
}

export function getRankInfo(value) {
  return value && typeof value === "object" ? { ...getDefaultRankInfo(), ...value } : getDefaultRankInfo();
}

export function getRankTone(value) {
  const rankInfo = getRankInfo(value);
  return RANK_TONES[rankInfo.tier] || RANK_TONES.Silver;
}

export function getRankProgressPercent(value) {
  const rankInfo = getRankInfo(value);
  return Math.max(0, Math.min((Number(rankInfo.pointsIntoLevel || 0) / POINTS_PER_LEVEL) * 100, 100));
}

export function formatRankPoints(value) {
  return Number(value || 0).toFixed(2);
}

export function formatSubjectLabel(value) {
  const subject = value?.toString().trim() || "General";
  const normalized = subject.toLowerCase();

  if (["math", "maths", "mathematics"].includes(normalized)) return "Maths";
  if (normalized === "english") return "English";
  if (["analytical", "analysis", "analytic"].includes(normalized)) return "Analytical";

  return subject;
}
