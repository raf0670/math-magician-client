"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Target, Brain, TrendingUp } from "lucide-react";
import { getExams, getMyStats } from "@/lib/api";

export default function PerformanceMetrics() {
    const [stats, setStats] = useState(null);
    const [exams, setExams] = useState([]);

    useEffect(() => {
        Promise.all([getMyStats(), getExams()])
            .then(([statsPayload, examsPayload]) => {
                const studentStats = statsPayload?.stats || {};
                const examList = Array.isArray(examsPayload?.data) ? examsPayload.data : [];
                setStats(studentStats);
                setExams(examList);
            })
            .catch(() => {
                setStats(null);
                setExams([]);
            });
    }, []);

    const totalPossibleMarks = useMemo(() => {
        if (!stats?.history?.length) return 0;
        return stats.history.reduce((sum, submission) => sum + (submission?.exam?.totalMarks || 0), 0);
    }, [stats]);

    const accuracy = useMemo(() => {
        if (!stats?.history?.length || !totalPossibleMarks) return 0;
        return ((stats.totalPointsEarned / totalPossibleMarks) * 100).toFixed(1);
    }, [stats, totalPossibleMarks]);

    const totalQuestions = useMemo(() => exams.reduce((sum, exam) => sum + (exam?.questions?.length || 0), 0), [exams]);

    const metrics = [
        {
            title: "Mock Tests Solved",
            value: `${stats?.totalExams || 0}`,
            subtext: `${exams.length} exams available in MongoDB`,
            icon: ClipboardCheck,
            colorClass: "text-[#A78BFA]",
            bgIconClass: "bg-[#7C3AED]/10 border-[#7C3AED]/20",
            renderFooter: () => (
                <div className="w-full mt-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#6B667B] mb-1.5">
                        <span>Database coverage</span>
                        <span className="text-white">{exams.length}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1A1722] rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: exams.length ? `${Math.min((stats?.totalExams || 0) / exams.length * 100, 100)}%` : "0%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-linear-to-r from-indigo-500 to-[#A78BFA] rounded-full"
                        />
                    </div>
                </div>
            )
        },
        {
            title: "Overall Accuracy",
            value: `${accuracy}%`,
            subtext: `Based on ${stats?.history?.length || 0} submission${(stats?.history?.length || 0) === 1 ? "" : "s"}`,
            icon: Target,
            colorClass: "text-[#E6C687]",
            bgIconClass: "bg-[#E6C687]/10 border-[#E6C687]/20",
            renderFooter: () => (
                <div className="w-full mt-4 flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-3 py-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Performance is pulled from your MongoDB submission history</span>
                </div>
            )
        },
        {
            title: "Questions in Bank",
            value: `${totalQuestions}`,
            subtext: "Live question data from the database",
            icon: Brain,
            colorClass: "text-[#DFB15B]",
            bgIconClass: "bg-[#DFB15B]/10 border-[#DFB15B]/20",
            renderFooter: () => (
                <div className="w-full mt-4 flex gap-1.5 items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">Data source:</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        MongoDB
                    </span>
                </div>
            )
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
    };

    return (
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full select-none" variants={containerVariants} initial="hidden" animate="visible">
            {metrics.map((item, idx) => (
                <motion.div
                    key={idx}
                    variants={cardVariants}
                    whileHover={{ y: -4 }}
                    className="bg-[#121017] border border-white/5 rounded-2xl p-6 flex flex-col items-start relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.25)] group"
                >
                    <div className="absolute inset-0 bg-linear-to-b from-white/1 to-transparent pointer-events-none" />
                    <div className="flex items-center justify-between w-full mb-4">
                        <span className="text-xs font-semibold text-[#8E8A9F] group-hover:text-white transition-colors duration-200">{item.title}</span>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${item.bgIconClass} ${item.colorClass}`}>
                            <item.icon className="w-4 h-4 stroke-2" />
                        </div>
                    </div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">{item.value}</div>
                    <div className="text-[11px] font-medium text-[#6B667B]">{item.subtext}</div>
                    {item.renderFooter()}
                </motion.div>
            ))}
        </motion.div>
    );
}