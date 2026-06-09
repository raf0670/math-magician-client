"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { BarChart3, Target, Zap, Clock } from "lucide-react";

export default function AnalyticsPortal() {
    // 🗄️ Mocking the exact backend data contracts we aligned on
    const overviewMetrics = {
        totalMocksTaken: 14,
        averageScore: 48.50,
        totalTimeSpentMinutes: 1260,
        globalRank: 87
    };

    const timelineData = [
        { name: "Mock 01", score: 32.50 },
        { name: "Mock 04", score: 38.00 },
        { name: "Mock 08", score: 41.25 },
        { name: "Mock 11", score: 45.00 },
        { name: "Mock 14", score: 48.50 }
    ];

    const subjectBreakdown = [
        { name: "Quantitative (Math)", correct: 120, total: 175, color: "bg-[#DFB15B]" },
        { name: "English (Verbal)", correct: 95, total: 125, color: "bg-indigo-400" },
        { name: "Analytical Ability", correct: 60, total: 93, color: "bg-teal-400" }
    ];

    return (
        <div className="w-full flex flex-col gap-8 text-left select-none">

            {/* 📊 1. METRIC OVERVIEW STRIP */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {[
                    { label: "Mocks Evaluated", val: overviewMetrics.totalMocksTaken, icon: BarChart3, color: "text-indigo-400" },
                    { label: "Average Score", val: `${overviewMetrics.averageScore.toFixed(2)}`, icon: Target, color: "text-[#DFB15B]" },
                    { label: "Time Committed", val: `${overviewMetrics.totalTimeSpentMinutes}m`, icon: Clock, color: "text-teal-400" },
                    { label: "Global Standing", val: `#${overviewMetrics.globalRank}`, icon: Zap, color: "text-rose-400" }
                ].map((item, i) => (
                    <div key={i} className="bg-[#121017] border border-white/5 p-5 rounded-2xl flex flex-col items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center">
                            <item.icon className={`w- 4 h - 4 ${item.color}`} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider block">{item.label}</span>
                            <span className="text-xl font-bold text-white tracking-wide block mt-0.5">{item.val}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 📈 2. TIMELINE PROGRESSION CHART */}
            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 w-full flex flex-col gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-white tracking-wide">Score Progression Timeline</h3>
                    <p className="text-[11px] text-[#6B667B] font-medium mt-0.5">Tracks final backend calculated scores across consecutive examination dates.</p>
                </div>

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
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1A1722", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                                labelStyle={{ color: "#8E8A9F", fontWeight: "bold" }}
                                itemStyle={{ color: "#DFB15B" }}
                            />
                            <Area type="monotone" dataKey="score" stroke="#DFB15B" strokeWidth={2} fillOpacity={1} fill="url(#scoreGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 🎯 3. SUBJECT ACCURACY MATRICES */}
            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 w-full flex flex-col gap-6">
                <div>
                    <h3 className="text-sm font-semibold text-white tracking-wide">Accuracy Calibration by Section</h3>
                    <p className="text-[11px] text-[#6B667B] font-medium mt-0.5">Identifies topic strength distribution based on cumulative database logs.</p>
                </div>

                <div className="flex flex-col gap-5 w-full">
                    {subjectBreakdown.map((subject, index) => {
                        const accuracy = ((subject.correct / subject.total) * 100).toFixed(1);
                        return (
                            <div key={index} className="flex flex-col gap-2 w-full">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-white/90">{subject.name}</span>
                                    <span className="text-[#8E8A9F] font-mono">{subject.correct} / {subject.total} Qs ({accuracy}%)</span>
                                </div>
                                {/* Progress Track Rail */}
                                <div className="w-full h-2 rounded-full bg-white/3 overflow-hidden">
                                    <div
                                        className={`h - full rounded - full ${subject.color} transition - all duration - 500`}
                                        style={{ width: `${accuracy} % ` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}