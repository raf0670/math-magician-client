export const POINTS_PER_LEVEL = 20;

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
