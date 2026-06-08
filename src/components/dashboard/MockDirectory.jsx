"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Clock, Award, Play, BarChart2, Calendar } from "lucide-react";

export default function MockDirectory() {
    const [activeFilter, setActiveFilter] = useState("available"); // available, upcoming, completed

    // once the api is live

    // const [mockExams, setMockExams] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     // 📡 Fetch real mock data directly from your backend server API
    //     async function fetchMocks() {
    //         try {
    //             const response = await fetch("http://localhost:5000/api/mocks"); // Your backend port
    //             const data = await response.json();
    //             setMockExams(data);
    //         } catch (error) {
    //             console.error("Error loading mock matrix from database:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     fetchMocks();
    // }, []);

    const mockExams = [
        {
            id: "mock-01",
            title: "Full Length IBA Diagnostic Mock #14",
            type: "Full Mock",
            questions: 75,
            duration: "90 mins",
            status: "available",
            rewardPoints: "+150 XP"
        },
        {
            id: "mock-02",
            title: "Advanced Quantitative Geometry Sprint",
            type: "Sectional",
            questions: 25,
            duration: "30 mins",
            status: "available",
            rewardPoints: "+50 XP"
        },
        {
            id: "mock-03",
            title: "Grand Admission Mock Test 2026",
            type: "Premium Live",
            unlockDate: "June 12 • 04:00 PM",
            status: "upcoming",
            questions: 75,
            duration: "90 mins"
        },
        {
            id: "mock-04",
            title: "Verbal Subject-Verb & Critical Reasoning Quiz",
            type: "Sectional",
            score: "18 / 25",
            accuracy: "72%",
            status: "completed",
            duration: "30 mins"
        }
    ];

    const filteredExams = mockExams.filter(exam => exam.status === activeFilter);

    return (
        <div className="w-full select-none">

            {/* 🎛️ FILTER CONTROL BAR */}
            <div className="flex gap-2 pb-4 border-b border-white/5 mb-8 overflow-x-auto scrollbar-none">
                {["available", "upcoming", "completed"].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className="relative px-4 py-2 rounded-xl text-xs font-bold tracking-wide capitalize transition-colors duration-200 shrink-0"
                    >
                        {activeFilter === filter && (
                            <motion.div
                                layoutId="activeMockTab"
                                className="absolute inset-0 bg-[#1A1722] border border-white/5 rounded-xl z-0"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                        <span className={`relative z-10 ${activeFilter === filter ? "text-[#DFB15B]" : "text-[#6B667B] hover:text-white"}`}>
                            {filter} ({mockExams.filter(e => e.status === filter).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* 📋 EXAM GRID INTERFACE */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <AnimatePresence mode="popLayout">
                    {filteredExams.map((exam) => (
                        <motion.div
                            key={exam.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            whileHover={{ y: -3 }}
                            className="bg-[#121017] border border-white/5 hover:border-white/10 p-6 rounded-2xl flex flex-col justify-between items-start transition-all duration-200 shadow-md relative overflow-hidden group"
                        >
                            <div className="w-full">
                                {/* Header Row info badges */}
                                <div className="flex justify-between items-center w-full mb-4">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-white/2 border border-white/5 text-[9px] font-bold text-[#8E8A9F] tracking-wider uppercase">
                                        {exam.type}
                                    </span>
                                    {exam.rewardPoints && (
                                        <span className="text-[10px] font-bold text-[#DFB15B] flex items-center gap-1">
                                            <Award className="w-3.5 h-3.5" /> {exam.rewardPoints}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-sm font-semibold text-white tracking-wide group-hover:text-[#DFB15B] transition-colors duration-200 text-left mb-4 leading-snug">
                                    {exam.title}
                                </h3>
                            </div>

                            {/* Dynamic Action Area based on status state */}
                            <div className="w-full pt-4 border-t border-white/3 flex items-center justify-between">
                                <div className="flex gap-4 items-center text-[11px] font-semibold text-[#8E8A9F]">
                                    <span className="flex items-center gap-1.5">
                                        <ClipboardCheck className="w-3.5 h-3.5 text-[#6B667B]" /> {exam.questions} Qs
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-[#6B667B]" /> {exam.duration}
                                    </span>
                                </div>

                                {exam.status === "available" && (
                                    <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#DFB15B]/10 border border-[#DFB15B]/20 text-[11px] font-bold uppercase tracking-wider text-[#DFB15B] hover:bg-[#DFB15B] hover:text-black transition-all duration-200">
                                        <span>Start Sprint</span>
                                        <Play className="w-2.5 h-2.5 fill-current stroke-none" />
                                    </button>
                                )}

                                {exam.status === "upcoming" && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/2 border border-white/5 text-[10px] font-bold tracking-wider text-[#6B667B] uppercase">
                                        <Calendar className="w-3 h-3" /> {exam.unlockDate}
                                    </span>
                                )}

                                {exam.status === "completed" && (
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-[#6B667B] block uppercase tracking-wider">Score</span>
                                            <span className="text-xs font-bold text-emerald-400 block">{exam.score} ({exam.accuracy})</span>
                                        </div>
                                        <button className="p-2 rounded-xl bg-white/2 border border-white/5 text-[#8E8A9F] hover:text-white hover:border-white/20 transition-all duration-200">
                                            <BarChart2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

        </div>
    );
}