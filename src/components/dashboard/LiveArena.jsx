"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video, ExternalLink, Calendar, HelpCircle, FolderGit2, ArrowUpRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getExams } from "@/lib/api";

export default function LiveArena() {
    const router = useRouter();
    const [activeExam, setActiveExam] = useState(null);
    const [examResources, setExamResources] = useState([]);

    useEffect(() => {
        getExams()
            .then((payload) => {
                const exams = Array.isArray(payload?.data) ? payload.data : [];
                if (exams.length) {
                    const sorted = [...exams].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                    setActiveExam(sorted[0]);
                    setExamResources(sorted.slice(0, 3));
                }
            })
            .catch(() => {
                setActiveExam(null);
                setExamResources([]);
            });
    }, []);

    const handleOpenExam = () => {
        if (activeExam?._id) {
            // paste zoom live class link here
            router.push(`https://www.zoom.com/`);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full select-none items-start">
            <div className="lg:col-span-12 flex flex-col gap-6">
                <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-[#E6C687]/5 rounded-full blur-[60px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-6">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Practice Arena</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#6B667B] flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {activeExam?.isLiveExam ? "Live exam" : "Practice set"}
                        </span>
                    </div>

                    <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-white mb-2 leading-tight">
                        {activeExam?.title || "No exam data available yet"}
                    </h1>

                    <p className="text-[#8E8A9F] text-xs font-medium mb-6">
                        {activeExam ? `This exam contains ${activeExam.questionCount || activeExam.questions?.length || 0} question${(activeExam.questionCount || activeExam.questions?.length || 0) === 1 ? "" : "s"} and lasts ${activeExam.duration || 0} minutes.` : "Create or seed an exam in the database to populate this view."}
                    </p>

                    <motion.button
                        onClick={handleOpenExam}
                        whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(212,175,55,0.12)" }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-xs font-bold text-black uppercase tracking-wider shadow-lg transition-all duration-300"
                    >
                        <Video className="w-4 h-4 text-black stroke-[2.2]" />
                        <span>{activeExam ? "Open Latest Class" : "Waiting for exam data"}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-black stroke-[2.2]" />
                    </motion.button>
                </div>

                {/* <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 shadow-md">
                    <h3 className="text-xs font-bold uppercase text-[#8E8A9F] tracking-wider mb-4">Why this matters</h3>
                    <div className="flex flex-col gap-3">
                        {activeExam ? (
                            [
                                `Questions available: ${activeExam.questionCount || activeExam.questions?.length || 0}`,
                                `Duration: ${activeExam.duration || 0} minutes`,
                                `Live exam status: ${activeExam.isLiveExam ? "Enabled" : "Practice mode"}`
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-[#1A1722]/30 border border-white/2">
                                    <CheckCircle className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
                                    <span className="text-xs font-medium text-[#8E8A9F] leading-normal">{item}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-[#8E8A9F]">No exam records have been synced from the database yet.</div>
                        )}
                    </div>
                </div> */}
            </div>

            {/* <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.25)]">
                    <div className="flex flex-col gap-1 mb-6 border-b border-white/3 pb-4">
                        <h2 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
                            <FolderGit2 className="w-4 h-4 text-[#DFB15B]" /> Available practice sets
                        </h2>
                        <p className="text-[10px] font-medium text-[#6B667B]">Each card opens a real exam from the database.</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {examResources.length === 0 ? (
                            <div className="text-sm text-[#8E8A9F]">No practice content is available yet.</div>
                        ) : (
                            examResources.map((exam) => (
                                <button
                                    key={exam._id}
                                    onClick={() => router.push(`/dashboard/mock-tests/${exam._id}`)}
                                    className="p-3.5 rounded-xl bg-[#1A1722]/50 border border-white/3 hover:border-white/10 transition-colors duration-200 flex items-center justify-between group text-left"
                                >
                                    <div className="flex flex-col items-start text-left min-w-0 pr-2">
                                        <span className="text-xs font-semibold text-white tracking-wide truncate w-full group-hover:text-[#DFB15B] transition-colors duration-200">{exam.title}</span>
                                        <span className="text-[10px] font-bold tracking-wide mt-1 text-[#6B667B] uppercase">{exam.duration} min • {exam.questionCount || exam.questions?.length || 0} questions</span>
                                    </div>
                                    <div className="w-7 h-7 rounded-lg bg-white/2 border border-white/5 flex items-center justify-center shrink-0 text-[#8E8A9F] group-hover:text-white transition-colors duration-200">
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-[#7C3AED]/5 border border-[#7C3AED]/10 flex gap-3">
                        <HelpCircle className="w-4 h-4 text-[#A78BFA] shrink-0 mt-0.5" />
                        <div className="flex flex-col text-left">
                            <span className="text-[11px] font-bold text-white tracking-wide">Study flow is now data-driven</span>
                            <p className="text-[10px] text-[#8E8A9F] leading-relaxed mt-0.5 font-medium">Practice content, exam details, and progress all come from the backend records you&apos;ve seeded.</p>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}