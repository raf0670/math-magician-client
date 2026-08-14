"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Crown, Medal, Shield, Sparkles, Target, Trophy, Users, Zap } from "lucide-react";
import { getCompetitionSummary, getStoredUser } from "@/lib/api";
import FlashyLoader from "@/components/shared/FlashyLoader";
import { formatRankPoints, getRankInfo, getRankTone } from "@/lib/rank";

function formatNumber(value) {
    return Number(value || 0).toFixed(2);
}

function getStudentId(value) {
    return value?._id?.toString?.() || value?.id?.toString?.() || value?.studentId?.toString?.() || "";
}

function RankBadge({ rank }) {
    const isPodium = rank <= 3;

    return (
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-xs font-black ${isPodium ? "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]" : "border-white/6 bg-[#121017] text-[#8E8A9F]"}`}>
            {isPodium ? <Trophy className="h-4 w-4" /> : `#${rank}`}
        </div>
    );
}

export default function LeaderboardPortal() {
    const [summary, setSummary] = useState(null);
    const [currentUser] = useState(() => getStoredUser());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        getCompetitionSummary()
            .then((payload) => {
                if (!isMounted) return;
                setSummary(payload?.data || null);
            })
            .catch((err) => {
                if (!isMounted) return;
                setSummary(null);
                setError(err.message || "Unable to load competition standings.");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const leaderboard = useMemo(() => summary?.leaderboard || [], [summary?.leaderboard]);
    const houses = useMemo(() => summary?.houses || [], [summary?.houses]);
    const champions = summary?.champions || {};
    const currentUserId = getStudentId(currentUser);
    const currentUserEntry = useMemo(() => {
        return summary?.currentUserEntry || leaderboard.find((entry) => getStudentId(entry) === currentUserId) || null;
    }, [leaderboard, currentUserId, summary?.currentUserEntry]);
    const currentRankInfo = getRankInfo(currentUserEntry?.rankInfo);
    const currentRankTone = getRankTone(currentRankInfo);

    if (loading) {
        return (
            <FlashyLoader
                eyebrow="Leaderboard"
                title="Summoning the rankings"
                message="House points, badges, and champions are being pulled from live exams."
                iconName="analytics"
                skeleton="cards"
                className="min-h-[520px]"
            />
        );
    }

    return (
        <div className="flex w-full select-none flex-col gap-6 text-left">
            {error ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                    {error}
                </div>
            ) : null}

            <section className="relative overflow-hidden rounded-3xl border border-[#DFB15B]/15 bg-[#121017] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-7">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B] to-transparent" />
                <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
                            <Medal className="h-3.5 w-3.5" />
                            Your Standing
                        </div>
                        <h2 className={`mt-4 font-serif text-3xl font-semibold tracking-wide sm:text-4xl ${currentRankTone.name}`}>
                            {currentUserEntry ? `Rank #${currentUserEntry.rank}` : "No Rank Yet"}
                        </h2>
                        <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${currentRankTone.badge}`}>
                            {currentRankInfo.rankName}
                        </div>
                        <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#9D96B3]">
                            {currentUserEntry
                                ? "Your exact position is based on live exam scores. Your tier badge is calculated from finalized daily and weekly exam points."
                                : "Submit a live exam to enter the competition leaderboard."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
                        {[
                            { label: "Total Score", value: formatNumber(currentUserEntry?.totalScore), icon: Zap },
                            { label: "Live Exams", value: currentUserEntry?.examsTaken || 0, icon: BarChart3 },
                            { label: "Average", value: formatNumber(currentUserEntry?.averageScore), icon: Target },
                            { label: "Rank Points", value: formatRankPoints(currentRankInfo.rankPoints), icon: Sparkles },
                        ].map((item) => (
                            <div key={item.label} className="rounded-2xl border border-white/7 bg-white/5 px-4 py-3">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">
                                    <item.icon className="h-3.5 w-3.5 text-[#DFB15B]" />
                                    {item.label}
                                </div>
                                <div className="mt-2 text-lg font-bold text-white">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-white/5 bg-[#121017] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.28)] sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-serif text-2xl font-medium tracking-wide text-white">House Cup</h2>
                        <p className="mt-1 text-xs font-medium text-[#6B667B]">Points are exam averages by house participants.</p>
                    </div>
                    <Shield className="h-5 w-5 text-[#DFB15B]" />
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {houses.map((house, index) => (
                        <motion.div
                            key={house.name}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
                            className="rounded-2xl border border-white/6 bg-[#1A1722]/45 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-bold text-white">{house.name}</p>
                                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#8E8A9F]">{house.mode} - {house.location}</p>
                                </div>
                                <span className="rounded-xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-2.5 py-1 text-xs font-black text-[#DFB15B]">#{index + 1}</span>
                            </div>
                            <p className="mt-4 font-serif text-3xl font-bold text-white">{formatNumber(house.totalPoints)}</p>
                            <p className="mt-1 text-xs font-medium text-[#8E8A9F]">{house.examsCounted || 0} exams counted</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-3xl border border-white/5 bg-[#121017] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.28)] sm:p-6">
                    <h2 className="flex items-center gap-2 font-serif text-2xl font-medium tracking-wide text-white">
                        <Crown className="h-5 w-5 text-[#DFB15B]" />
                        Champions
                    </h2>
                    <div className="mt-4 space-y-2">
                        <ChampionRow title="Champion of Champions" item={champions.championOfChampions} highlight />
                        {(champions.houses || []).map((item) => (
                            <ChampionRow key={item.house} title={`${item.house} Champion`} item={item.champion} />
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-white/5 bg-[#121017] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.28)] sm:p-6">
                    <h2 className="flex items-center gap-2 font-serif text-2xl font-medium tracking-wide text-white">
                        <Sparkles className="h-5 w-5 text-[#DFB15B]" />
                        Master Badges
                    </h2>
                    <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                        {(summary?.badges || []).length ? summary.badges.map((badge) => (
                            <div key={badge.examId} className="rounded-2xl border border-white/5 bg-[#1A1722]/45 px-4 py-3">
                                <p className="text-sm font-bold text-white">{badge.examTitle}</p>
                                <p className="mt-1 text-xs font-semibold text-[#8E8A9F]">
                                    {badge.competitionCategory} - {formatNumber(badge.score)} - {badge.winners.map((winner) => winner.name).join(", ")}
                                </p>
                            </div>
                        )) : (
                            <p className="rounded-2xl border border-white/5 bg-[#1A1722]/45 px-4 py-5 text-sm text-[#8E8A9F]">No badges have been awarded yet.</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-white/5 bg-[#121017] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.28)] sm:p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="font-serif text-2xl font-medium tracking-wide text-white">Ranked Students</h2>
                        <p className="mt-1 text-xs font-medium text-[#6B667B]">
                            Showing all {leaderboard.length} ranked student{leaderboard.length === 1 ? "" : "s"}.
                        </p>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9D96B3]">
                        <Users className="h-3.5 w-3.5 text-[#DFB15B]" />
                        Exact Ranks
                    </div>
                </div>

                {leaderboard.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-[#1A1722]/40 px-4 py-8 text-center text-sm font-medium text-[#8E8A9F]">
                        No leaderboard entries are available yet.
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {leaderboard.map((entry, index) => {
                            const rank = entry.rank || index + 1;
                            const isCurrentUser = currentUserId && getStudentId(entry) === currentUserId;
                            const entryRankInfo = getRankInfo(entry.rankInfo);
                            const entryRankTone = getRankTone(entryRankInfo);

                            return (
                                <motion.div
                                    key={entry.studentId || `${entry.name}-${rank}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.4) }}
                                    className={`grid grid-cols-[auto_1fr] gap-3 rounded-2xl border px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center ${isCurrentUser ? "border-[#DFB15B]/30 bg-[#DFB15B]/10 shadow-[0_0_28px_rgba(223,177,91,0.08)]" : "border-white/5 bg-[#1A1722]/40"}`}
                                >
                                    <RankBadge rank={rank} />
                                    <div className="min-w-0">
                                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                                            <span className={`truncate text-sm font-semibold ${entryRankTone.name}`}>{entry.name || "Student"}</span>
                                            {isCurrentUser ? (
                                                <span className="rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#DFB15B]">
                                                    You
                                                </span>
                                            ) : null}
                                            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${entryRankTone.badge}`}>
                                                {entryRankInfo.rankName}
                                            </span>
                                        </div>
                                        <div className="mt-0.5 text-[11px] font-medium text-[#8E8A9F]">
                                            {entry.house || "No house"} - {entry.examsTaken || 0} live exams - {entry.badgeCount || 0} badges - Avg {formatNumber(entry.averageScore)} - RP {formatRankPoints(entryRankInfo.rankPoints)}
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex items-center justify-between rounded-xl border border-white/5 bg-[#121017]/70 px-3 py-2 sm:col-span-1 sm:block sm:border-0 sm:bg-transparent sm:p-0 sm:text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B667B] sm:block">score</span>
                                        <span className="text-sm font-bold text-[#DFB15B] sm:block">{formatNumber(entry.totalScore)}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

function ChampionRow({ title, item, highlight = false }) {
    const rankTone = getRankTone(item?.rankInfo);

    return (
        <div className={`rounded-2xl border px-4 py-3 ${highlight ? "border-[#DFB15B]/20 bg-[#DFB15B]/10" : "border-white/5 bg-[#1A1722]/45"}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">{title}</p>
            <p className={`mt-1 text-sm font-bold ${item ? rankTone.name : "text-white"}`}>{item?.name || "Not decided yet"}</p>
            {item ? (
                <p className={`mt-0.5 text-xs font-semibold ${rankTone.name}`}>{item.house} - {formatNumber(item.totalScore)} score</p>
            ) : null}
        </div>
    );
}
