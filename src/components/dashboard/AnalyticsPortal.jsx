"use client";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { BarChart3, Target, Zap, Clock, Sparkles } from "lucide-react";
import { getLeaderboard, getMyStats, getStoredUser } from "@/lib/api";

export default function AnalyticsPortal() {
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentUser(getStoredUser());

        let isMounted = true;
        Promise.all([getMyStats(), getLeaderboard()])
            .then(([statsPayload, leaderboardPayload]) => {
                if (!isMounted) return;
                setStats(statsPayload?.stats || {});
                setHistory(Array.isArray(statsPayload?.history) ? statsPayload.history : []);
                setLeaderboard(Array.isArray(leaderboardPayload?.data) ? leaderboardPayload.data : []);
            })
            .catch(() => {
                if (isMounted) {
                    setStats({});
                    setHistory([]);
                    setLeaderboard([]);
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const overviewMetrics = useMemo(() => {
        const totalMocksTaken = stats?.totalExams || 0;
        const averageScore = Number(stats?.averageScore || 0);
        const totalTimeSpentMinutes = history.reduce((sum, item) => sum + (item?.exam?.duration || 0), 0);

        const userId = currentUser?._id || currentUser?.id;
        const globalRank = leaderboard.findIndex((entry) => {
            const entryId = entry?.studentId?.toString();
            return entryId && userId && entryId === userId.toString();
        });

        return {
            totalMocksTaken,
            averageScore,
            totalTimeSpentMinutes,
            globalRank: globalRank >= 0 ? globalRank + 1 : leaderboard.length ? "—" : "—",
        };
    }, [stats, history, leaderboard, currentUser]);

    const timelineData = useMemo(() => {
        return history
            .slice()
            .reverse()
            .slice(0, 6)
            .map((item, index) => ({
                name: item?.exam?.title || `Attempt ${index + 1}`,
                score: Number(item?.score || 0),
            }));
    }, [history]);

    const recentResults = useMemo(() => {
        return history.slice(0, 4).map((item) => ({
            title: item?.exam?.title || "Practice exam",
            score: Number(item?.score || 0),
            submittedAt: item?.submittedAt,
        }));
    }, [history]);

    return (
        <div className="w-full flex flex-col gap-8 text-left select-none">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {[
                    { label: "Mocks Evaluated", val: overviewMetrics.totalMocksTaken, icon: BarChart3, color: "text-indigo-400" },
                    { label: "Average Score", val: overviewMetrics.averageScore.toFixed(2), icon: Target, color: "text-[#DFB15B]" },
                    { label: "Time Committed", val: `${overviewMetrics.totalTimeSpentMinutes}m`, icon: Clock, color: "text-teal-400" },
                    { label: "Global Standing", val: overviewMetrics.globalRank === "—" ? "—" : `#${overviewMetrics.globalRank}`, icon: Zap, color: "text-rose-400" }
                ].map((item, i) => (
                    <div key={i} className="bg-[#121017] border border-white/5 p-5 rounded-2xl flex flex-col items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center">
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider block">{item.label}</span>
                            <span className="text-xl font-bold text-white tracking-wide block mt-0.5">{item.val}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 w-full flex flex-col gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-white tracking-wide">Score Progression Timeline</h3>
                    <p className="text-[11px] text-[#6B667B] font-medium mt-0.5">This chart is built from your latest backend submission records.</p>
                </div>

                {loading ? (
                    <div className="text-sm text-[#8E8A9F]">Loading analytics from the database…</div>
                ) : timelineData.length === 0 ? (
                    <div className="text-sm text-[#8E8A9F]">Complete your first exam to populate this chart.</div>
                ) : (
                    <div className="w-full h-64 mt-2 font-mono text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#DFB15B" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#DFB15B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" stroke="#6B667B" tickLine={false} />
                                <YAxis stroke="#6B667B" tickLine={false} domain={[0, 60]} />
                                <Tooltip contentStyle={{ backgroundColor: "#1A1722", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }} labelStyle={{ color: "#8E8A9F", fontWeight: "bold" }} itemStyle={{ color: "#DFB15B" }} />
                                <Area type="monotone" dataKey="score" stroke="#DFB15B" strokeWidth={2} fillOpacity={1} fill="url(#scoreGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 w-full flex flex-col gap-6">
                <div>
                    <h3 className="text-sm font-semibold text-white tracking-wide">Recent Exam Results</h3>
                    <p className="text-[11px] text-[#6B667B] font-medium mt-0.5">Latest records from your submissions table.</p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    {recentResults.length === 0 ? (
                        <div className="text-sm text-[#8E8A9F]">No submission history is available yet.</div>
                    ) : (
                        recentResults.map((item, index) => (
                            <div key={`${item.title}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-[#1A1722]/40 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#DFB15B]/10 border border-[#DFB15B]/15 flex items-center justify-center text-[#DFB15B]">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{item.title}</div>
                                        <div className="text-[11px] text-[#8E8A9F]">{item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "Submitted"}</div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-[#DFB15B]">{item.score.toFixed(2)}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}