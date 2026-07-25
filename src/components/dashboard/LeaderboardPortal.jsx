"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Medal, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { getLeaderboard, getStoredUser } from "@/lib/api";
import FlashyLoader from "@/components/shared/FlashyLoader";

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
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUserEntry, setCurrentUserEntry] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentUser] = useState(() => getStoredUser());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        getLeaderboard()
            .then((payload) => {
                if (!isMounted) return;
                setLeaderboard(Array.isArray(payload?.data) ? payload.data : []);
                setCurrentUserEntry(payload?.currentUserEntry || null);
                setTotalCount(Number(payload?.totalCount || payload?.count || 0));
            })
            .catch((err) => {
                if (!isMounted) return;
                setLeaderboard([]);
                setCurrentUserEntry(null);
                setTotalCount(0);
                setError(err.message || "Unable to load leaderboard.");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const currentUserId = getStudentId(currentUser);
    const visibleCurrentUserEntry = useMemo(() => {
        if (currentUserEntry) return currentUserEntry;
        return leaderboard.find((entry) => getStudentId(entry) === currentUserId) || null;
    }, [currentUserEntry, leaderboard, currentUserId]);

    if (loading) {
        return (
            <FlashyLoader
                eyebrow="Leaderboard"
                title="Summoning the rankings"
                message="Global scores and your standing are being pulled from the database."
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
                <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#DFB15B]/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-[-80px] left-[18%] h-56 w-56 rounded-full bg-[#7C3AED]/10 blur-3xl" />

                <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
                            <Medal className="h-3.5 w-3.5" />
                            Your Standing
                        </div>
                        <h2 className="mt-4 font-serif text-3xl font-semibold tracking-wide text-white sm:text-4xl">
                            {visibleCurrentUserEntry ? `Rank #${visibleCurrentUserEntry.rank}` : "No Rank Yet"}
                        </h2>
                        <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#9D96B3]">
                            {visibleCurrentUserEntry
                                ? "Your position is calculated across all submitted exams, sorted by total score with average score as the tie-breaker."
                                : "Complete your first exam submission to enter the global leaderboard."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
                        {[
                            { label: "Total Score", value: formatNumber(visibleCurrentUserEntry?.totalScore), icon: Zap },
                            { label: "Exams Taken", value: visibleCurrentUserEntry?.examsTaken || 0, icon: BarChart3 },
                            { label: "Average", value: formatNumber(visibleCurrentUserEntry?.averageScore), icon: Target },
                            { label: "Best", value: formatNumber(visibleCurrentUserEntry?.bestScore), icon: Sparkles },
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
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="font-serif text-2xl font-medium tracking-wide text-white">Ranked Students</h2>
                        <p className="mt-1 text-xs font-medium text-[#6B667B]">
                            Showing {leaderboard.length} of {totalCount || leaderboard.length} ranked student{(totalCount || leaderboard.length) === 1 ? "" : "s"}.
                        </p>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9D96B3]">
                        <Trophy className="h-3.5 w-3.5 text-[#DFB15B]" />
                        Global
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
                                            <span className="truncate text-sm font-semibold text-white">{entry.name || "Student"}</span>
                                            {isCurrentUser ? (
                                                <span className="rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#DFB15B]">
                                                    You
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mt-0.5 text-[11px] font-medium text-[#8E8A9F]">
                                            {entry.examsTaken || 0} exams - Avg {formatNumber(entry.averageScore)} - Best {formatNumber(entry.bestScore)}
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex items-center justify-between rounded-xl border border-white/5 bg-[#121017]/70 px-3 py-2 sm:col-span-1 sm:block sm:border-0 sm:bg-transparent sm:p-0 sm:text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B667B] sm:block">points</span>
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
