"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpenCheck, ClipboardCheck, Sparkles, WandSparkles } from "lucide-react";
import { getExams, getStoredUser } from "@/lib/api";
import { getRankInfo, getRankTone } from "@/lib/rank";

const starPoints = [
    { left: "10%", top: "20%", delay: 0 },
    { left: "24%", top: "70%", delay: 0.9 },
    { left: "42%", top: "16%", delay: 1.5 },
    { left: "68%", top: "28%", delay: 0.4 },
    { left: "83%", top: "64%", delay: 1.1 },
    { left: "92%", top: "18%", delay: 1.8 },
];

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
    const rankInfo = getRankInfo(currentUser?.rankInfo);
    const rankTone = getRankTone(rankInfo);
    const title = nextExam?.title || "Practice exam bank";
    const duration = nextExam?.duration ? `${nextExam.duration} min` : "Live practice";
    const questionCount = nextExam?.questionCount || nextExam?.questions?.length || 0;

    return (
        <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-90 max-w-full overflow-hidden rounded-3xl border border-[#DFB15B]/18 bg-[#100E16] p-4 shadow-[0_26px_90px_rgba(0,0,0,0.48)] select-none sm:p-7 lg:p-8"
        >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[42px_42px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B] to-transparent" />
            <motion.div
                className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#DFB15B]/13 blur-3xl"
                animate={{ scale: [1, 1.18, 1], opacity: [0.42, 0.75, 0.42] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute -bottom-30 left-[18%] h-72 w-72 rounded-full bg-[#3156D4]/12 blur-3xl"
                animate={{ x: [0, 36, -18, 0], opacity: [0.3, 0.58, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <svg className="pointer-events-none absolute right-4 top-8 hidden h-60 w-[46%] opacity-45 lg:block" viewBox="0 0 420 240" fill="none">
                <path d="M28 178L112 82L202 136L292 48L390 112" stroke="url(#constellation)" strokeWidth="1.4" strokeDasharray="6 10" />
                <circle cx="28" cy="178" r="4" fill="#DFB15B" />
                <circle cx="112" cy="82" r="3" fill="#A78BFA" />
                <circle cx="202" cy="136" r="4" fill="#F6D98B" />
                <circle cx="292" cy="48" r="3" fill="#93C5FD" />
                <circle cx="390" cy="112" r="4" fill="#DFB15B" />
                <defs>
                    <linearGradient id="constellation" x1="28" y1="178" x2="390" y2="112" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#DFB15B" />
                        <stop offset="0.52" stopColor="#A78BFA" />
                        <stop offset="1" stopColor="#93C5FD" />
                    </linearGradient>
                </defs>
            </svg>

            {starPoints.map((point, index) => (
                <motion.span
                    key={index}
                    className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#DFB15B] shadow-[0_0_18px_rgba(223,177,91,0.72)]"
                    style={{ left: point.left, top: point.top }}
                    animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.75, 1.35, 0.75] }}
                    transition={{ duration: 3.2, delay: point.delay, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}

            <div className="relative z-10 grid min-h-75 min-w-0 max-w-full gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
                <div className="flex min-w-0 max-w-2xl flex-col items-start">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#DFB15B] sm:tracking-[0.24em]">
                        <WandSparkles className="h-3.5 w-3.5" />
                        <span className="min-w-0 truncate">Premium Academy</span>
                    </div>

                    <h1 className="mt-5 max-w-full wrap-break-word font-serif text-2xl font-semibold leading-tight tracking-wide text-white sm:text-4xl lg:text-5xl">
                        Welcome back, <span className={rankTone.name}>{firstName}</span>
                    </h1>

                    <p className="mt-4 max-w-xl wrap-break-word text-sm font-medium leading-7 text-[#A9A3BA]">
                        Your dashboard is tuned for focused IBA preparation: live progress, house identity, and practice access in one calm workspace.
                    </p>

                    <div className="mt-7 grid w-full min-w-0 max-w-2xl gap-3 sm:grid-cols-3">
                        <div className="min-w-0 rounded-2xl border border-white/7 bg-white/5 px-4 py-3 backdrop-blur">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">Latest Exam</span>
                            <span className="mt-1 block truncate text-sm font-semibold text-white">{title}</span>
                        </div>
                        <div className="min-w-0 rounded-2xl border border-white/7 bg-white/5 px-4 py-3 backdrop-blur">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">Duration</span>
                            <span className="mt-1 block truncate text-sm font-semibold text-[#DFB15B]">{duration}</span>
                        </div>
                        <div className="min-w-0 rounded-2xl border border-white/7 bg-white/5 px-4 py-3 backdrop-blur">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">Questions</span>
                            <span className="mt-1 block truncate text-sm font-semibold text-white">{questionCount || "Ready"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex min-w-0 max-w-full flex-col gap-4 rounded-3xl border border-white/8 bg-[#121017]/78 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]">
                            <BookOpenCheck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="wrap-break-word text-[10px] font-bold uppercase tracking-[0.18em] text-[#DFB15B] sm:tracking-[0.22em]">Practice Portal</p>
                            <p className="mt-1 wrap-break-word text-sm font-medium leading-6 text-[#D8D4E5]">
                                Enter the mock arena and keep the preparation record moving.
                            </p>
                        </div>
                    </div>

                    <motion.a
                        href="/dashboard/mock-tests"
                        whileHover={{ scale: 1.015, boxShadow: "0 18px 42px rgba(212,175,55,0.18)" }}
                        whileTap={{ scale: 0.985 }}
                        className="inline-flex min-h-14 w-full min-w-0 items-center justify-between gap-3 rounded-2xl bg-linear-to-r from-[#F6D98B] via-[#DFB15B] to-[#A46F18] px-4 py-4 text-xs font-bold uppercase tracking-wide text-black shadow-lg transition-all duration-300 sm:gap-4 sm:px-5 sm:tracking-wider"
                    >
                        <span className="flex min-w-0 items-center gap-2">
                            <ClipboardCheck className="h-4 w-4 text-black stroke-[2.2]" />
                            <span className="truncate">Start Practicing</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-black stroke-[2.2]" />
                    </motion.a>

                    <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#A78BFA]/15 bg-[#A78BFA]/7 px-4 py-3 text-xs font-semibold text-[#CFC6FF]">
                        <Sparkles className="h-4 w-4 shrink-0 text-[#A78BFA]" />
                        <span className="min-w-0 wrap-break-word">Performance updates automatically after every submission.</span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
