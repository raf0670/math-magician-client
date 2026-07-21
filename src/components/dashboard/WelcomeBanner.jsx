"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, ArrowUpRight, Sparkles } from "lucide-react";
import { getExams, getStoredUser } from "@/lib/api";

export default function WelcomeBanner() {
    const [currentUser, setCurrentUser] = useState(null);
    const [nextExam, setNextExam] = useState(null);

    useEffect(() => {
        const syncUser = () => setCurrentUser(getStoredUser());
        syncUser();
        window.addEventListener("auth-state-changed", syncUser);
        window.addEventListener("storage", syncUser);

        getExams()
            .then((payload) => {
                const exams = Array.isArray(payload?.data) ? payload.data : [];
                const sorted = [...exams].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
                setNextExam(sorted[sorted.length - 1] || null);
            })
            .catch(() => setNextExam(null));

        return () => {
            window.removeEventListener("auth-state-changed", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    const firstName = currentUser?.name?.trim().split(" ")[0] || "Student";
    const title = nextExam?.title || "Practice exam bank";
    const duration = nextExam?.duration ? `${nextExam.duration} min` : "Live practice";
    const questionCount = nextExam?.questionCount || nextExam?.questions?.length || 0;

    return (
        <div className="w-full bg-[#121017] border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)] select-none">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#DFB15B]/5 rounded-full blur-[70px] pointer-events-none translate-x-10 -translate-y-10" />
            <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                <div className="lg:col-span-8 flex flex-col items-start text-left">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 mb-4 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                            EXPERT POWERED PREP
                        </span>
                    </div>

                    <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-white mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-linear-to-r from-[#E6C687] to-[#AA7C11] font-bold">{firstName}</span>!
                    </h1>

                    <p className="text-[#8E8A9F] text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                        Your latest exam was <strong className="text-white">“{title}”</strong> with {questionCount} question{questionCount === 1 ? "" : "s"}
                    </p>

                    <div className="flex items-center gap-6 mt-6 pt-5 border-t border-white/3 w-full max-w-md">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B667B] block">Duration</span>
                            <span className="text-xs font-bold text-[#DFB15B] mt-0.5 block">{duration}</span>
                        </div>
                        <div className="w-px h-6 bg-white/5" />
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B667B] block">Next Step</span>
                            <span className="text-xs font-bold text-white mt-0.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#DFB15B]" /> Open Practice
                            </span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex justify-start lg:justify-end w-full">
                    <motion.a
                        href="/dashboard/mock-tests"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(212,175,55,0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center justify-between gap-4 w-full sm:w-auto px-6 py-4 rounded-2xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-xs font-bold text-black uppercase tracking-wider shadow-lg transition-all duration-300"
                    >
                        <span className="flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4 text-black stroke-[2.2]" />
                            Start Practicing
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-black stroke-[2.2]" />
                    </motion.a>
                </div>
            </div>
        </div>
    );
}
