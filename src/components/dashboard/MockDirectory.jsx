"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Clock, Award, Play, BarChart2, Calendar } from "lucide-react";
import { getExams } from "@/lib/api";

export default function MockDirectory() {
    const [activeFilter, setActiveFilter] = useState("available");
    const [mockExams, setMockExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchMocks() {
            try {
                const data = await getExams();
                if (isMounted) {
                    setMockExams(data.data || []);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Unable to load exams");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchMocks();
        return () => {
            isMounted = false;
        };
    }, []);

    const normalizedExams = mockExams.map((exam) => {
        const startTime = exam.startTime ? new Date(exam.startTime) : null;
        const endTime = exam.endTime ? new Date(exam.endTime) : null;
        const now = new Date();

        let status = "available";
        if (exam.isLiveExam && startTime && startTime > now) {
            status = "upcoming";
        } else if (exam.isLiveExam && endTime && endTime < now) {
            status = "completed";
        }

        return {
            ...exam,
            id: exam._id,
            type: exam.isLiveExam ? "Premium Live" : "Practice Mock",
            questions: exam.questionCount || 0,
            duration: exam.duration ? `${exam.duration} mins` : "—",
            unlockDate: startTime ? startTime.toLocaleString() : "Scheduled soon",
            status,
        };
    });

    const filteredExams = normalizedExams.filter((exam) => exam.status === activeFilter);

    return (
        <div className="w-full select-none">
            <div className="mb-8 flex gap-2 overflow-x-auto border-b border-white/5 pb-4 scrollbar-none">
                {["available", "upcoming", "completed"].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className="relative shrink-0 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors duration-200"
                    >
                        {activeFilter === filter && (
                            <motion.div
                                layoutId="activeMockTab"
                                className="absolute inset-0 z-0 rounded-xl border border-white/5 bg-[#1A1722]"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                        <span className={`relative z-10 ${activeFilter === filter ? "text-[#DFB15B]" : "text-[#6B667B] hover:text-white"}`}>
                            {filter} ({normalizedExams.filter((exam) => exam.status === filter).length})
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-sm text-[#8E8A9F]">Loading available mock tests...</p>
            ) : error ? (
                <p className="text-sm text-red-400">{error}</p>
            ) : filteredExams.length === 0 ? (
                <p className="text-sm text-[#8E8A9F]">No exams are currently available in this category.</p>
            ) : (
                <motion.div layout className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
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
                                className="relative flex flex-col items-start justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#121017] p-6 shadow-md transition-all duration-200 hover:border-white/10"
                            >
                                <div className="w-full">
                                    <div className="mb-4 flex w-full items-center justify-between">
                                        <span className="rounded-lg border border-white/5 bg-white/2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#8E8A9F]">
                                            {exam.type}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#DFB15B]">
                                            <Award className="h-3.5 w-3.5" /> +{exam.totalMarks || 0} pts
                                        </span>
                                    </div>

                                    <h3 className="mb-4 text-left text-sm font-semibold leading-snug tracking-wide text-white transition-colors duration-200 group-hover:text-[#DFB15B]">
                                        {exam.title}
                                    </h3>
                                </div>

                                <div className="flex w-full items-center justify-between border-t border-white/3 pt-4">
                                    <div className="flex items-center gap-4 text-[11px] font-semibold text-[#8E8A9F]">
                                        <span className="flex items-center gap-1.5">
                                            <ClipboardCheck className="h-3.5 w-3.5 text-[#6B667B]" /> {exam.questions} Qs
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-[#6B667B]" /> {exam.duration}
                                        </span>
                                    </div>

                                    {exam.status === "available" && (
                                        <Link
                                            href={`/dashboard/mock-tests/${exam.id}`}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#DFB15B] transition-all duration-200 hover:bg-[#DFB15B] hover:text-black"
                                        >
                                            <span>Start Sprint</span>
                                            <Play className="h-2.5 w-2.5 fill-current stroke-none" />
                                        </Link>
                                    )}

                                    {exam.status === "upcoming" && (
                                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">
                                            <Calendar className="h-3 w-3" /> {exam.unlockDate}
                                        </span>
                                    )}

                                    {exam.status === "completed" && (
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">Score</span>
                                                <span className="block text-xs font-bold text-emerald-400">Completed</span>
                                            </div>
                                            <button className="rounded-xl border border-white/5 bg-white/2 p-2 text-[#8E8A9F] transition-all duration-200 hover:border-white/20 hover:text-white">
                                                <BarChart2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}