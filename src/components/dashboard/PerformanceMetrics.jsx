"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Brain, ClipboardCheck, Target, TrendingUp } from "lucide-react";
import { getMyStats } from "@/lib/api";

function clampPercent(value) {
    return Math.max(0, Math.min(Number(value) || 0, 100));
}

export default function PerformanceMetrics() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getMyStats()
            .then((statsPayload) => {
                const studentStats = statsPayload?.stats || {};
                setStats(studentStats);
            })
            .catch(() => {
                setStats(null);
            });
    }, []);

    const accuracy = useMemo(() => {
        return Number(stats?.accuracyPercentage || 0).toFixed(1);
    }, [stats]);
    const totalExams = Number(stats?.totalExams || 0);
    const availableExamCount = Number(stats?.availableExamCount || 0);
    const questionBankCount = Number(stats?.questionBankCount || 0);
    const totalPossibleMarks = Number(stats?.totalPossibleMarks || 0);
    const coveragePercent = availableExamCount ? clampPercent((totalExams / availableExamCount) * 100) : 0;
    const accuracyPercent = clampPercent(accuracy);
    const bankSignal = questionBankCount ? 100 : 0;

    const metrics = [
        {
            title: "Practice Solved",
            value: `${totalExams}`,
            subtext: `${availableExamCount} official exam${availableExamCount === 1 ? "" : "s"} available`,
            icon: ClipboardCheck,
            accent: "from-[#7C3AED] to-[#A78BFA]",
            glow: "bg-[#7C3AED]/12",
            progress: coveragePercent,
            footerLabel: "Coverage",
            footerValue: `${coveragePercent.toFixed(0)}%`,
        },
        {
            title: "Overall Accuracy",
            value: `${accuracy}%`,
            subtext: `Based on ${totalPossibleMarks} possible point${totalPossibleMarks === 1 ? "" : "s"}`,
            icon: Target,
            accent: "from-[#DFB15B] to-[#F6D98B]",
            glow: "bg-[#DFB15B]/12",
            progress: accuracyPercent,
            footerLabel: "Accuracy",
            footerValue: `${accuracy}%`,
        },
        {
            title: "Questions in Bank",
            value: `1000+`,
            subtext: "Live questions made by experts",
            icon: Brain,
            accent: "from-emerald-400 to-[#DFB15B]",
            glow: "bg-emerald-400/10",
            progress: bankSignal,
            footerLabel: "Potential",
            footerValue: "Live",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <section className="select-none">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#DFB15B]">Performance Ledger</p>
                    <h2 className="mt-2 font-serif text-2xl font-semibold tracking-wide text-white">Your Practice Signal</h2>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9D96B3]">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
                    Synced from submissions
                </div>
            </div>

            <motion.div
                className="grid w-full grid-cols-1 gap-5 md:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {metrics.map((item) => (
                    <motion.div
                        key={item.title}
                        variants={cardVariants}
                        whileHover={{ y: -5 }}
                        className="group relative min-h-56 overflow-hidden rounded-3xl border border-white/6 bg-[#121017]/92 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.30)]"
                    >
                        <div className={`pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full ${item.glow} blur-3xl transition-opacity duration-300 group-hover:opacity-90`} />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/3 to-transparent" />

                        <div className="relative z-10 flex h-full flex-col">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-[#9D96B3] transition-colors group-hover:text-white">{item.title}</p>
                                    <p className="mt-3 font-serif text-4xl font-bold tracking-tight text-white">{item.value}</p>
                                </div>
                                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
                                    <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${item.accent} opacity-14`} />
                                    <item.icon className="relative h-5 w-5 text-[#DFB15B]" />
                                </div>
                            </div>

                            <p className="mt-3 min-h-10 text-sm font-medium leading-5 text-[#6B667B]">{item.subtext}</p>

                            <div className="mt-auto pt-6">
                                <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">
                                    <span>{item.footerLabel}</span>
                                    <span className="text-white">{item.footerValue}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full border border-white/6 bg-[#0B0A10]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.progress}%` }}
                                        transition={{ duration: 1.05, ease: "easeOut" }}
                                        className={`h-full rounded-full bg-linear-to-r ${item.accent} shadow-[0_0_24px_rgba(223,177,91,0.22)]`}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
