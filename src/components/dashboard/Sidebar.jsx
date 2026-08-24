"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Video, ClipboardCheck, BarChart3, User, LogOut, ShieldCheck, Brain, Archive, Radio, FileQuestion, Trophy, Sparkles, ClipboardList } from "lucide-react";
import { clearAuthSession, getProfile, getStoredUser, saveAuthSession } from "@/lib/api";
import BrandMark from "@/components/shared/BrandMark";
import { getDefaultRankInfo, getRankInfo, getRankProgressPercent, getRankTone } from "@/lib/rank";

const SHOW_STUDENT_LIVE_EXAMS_NAV = false;

const NAV_ACCENTS = {
    "/dashboard": "from-[#DFB15B]/24 via-[#F6D98B]/10 to-transparent",
    "/dashboard/classes": "from-emerald-400/20 via-teal-400/8 to-transparent",
    "/dashboard/archived-classes": "from-cyan-300/18 via-sky-400/8 to-transparent",
    "/dashboard/live-exams": "from-red-400/20 via-rose-400/8 to-transparent",
    "/dashboard/assignments": "from-amber-300/20 via-emerald-400/8 to-transparent",
    "/dashboard/assessment-test": "from-emerald-400/18 via-[#DFB15B]/10 to-transparent",
    "/dashboard/mock-tests": "from-[#7C3AED]/22 via-[#A78BFA]/9 to-transparent",
    "/dashboard/quiz": "from-fuchsia-400/18 via-[#7C3AED]/9 to-transparent",
    "/dashboard/analytics": "from-blue-400/20 via-cyan-300/8 to-transparent",
    "/dashboard/leaderboard": "from-[#DFB15B]/26 via-orange-400/10 to-transparent",
    "/dashboard/admin/enrollments": "from-emerald-400/20 via-[#DFB15B]/8 to-transparent",
    "/dashboard/admin/classes": "from-cyan-300/18 via-[#7C3AED]/8 to-transparent",
    "/dashboard/admin/live-exams": "from-red-400/20 via-[#DFB15B]/8 to-transparent",
    "/dashboard/admin/assignments": "from-amber-300/20 via-[#DFB15B]/8 to-transparent",
    "/dashboard/profile": "from-[#DFB15B]/22 via-[#7C3AED]/10 to-transparent",
};

const sidebarSparks = [
    { left: "14%", top: "13%", delay: 0 },
    { left: "84%", top: "22%", delay: 0.8 },
    { left: "20%", top: "50%", delay: 1.5 },
    { left: "78%", top: "72%", delay: 0.4 },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);
    const [rankInfo, setRankInfo] = useState(getDefaultRankInfo());

    useEffect(() => {
        const syncUser = () => {
            const storedUser = getStoredUser();
            setCurrentUser(storedUser);
            setRankInfo(getRankInfo(storedUser?.rankInfo));
        };
        const refreshProfile = async () => {
            const token = window.localStorage.getItem("exam_archive_token");
            if (!token) return;

            const payload = await getProfile().catch(() => null);
            if (payload?.data) {
                saveAuthSession(token, payload.data);
            }
        };

        syncUser();
        refreshProfile();
        window.addEventListener("auth-state-changed", syncUser);
        window.addEventListener("storage", syncUser);

        return () => {
            window.removeEventListener("auth-state-changed", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/classes", label: "Live Classes", icon: Video },
        { href: "/dashboard/archived-classes", label: "Archived Classes", icon: Archive },
        SHOW_STUDENT_LIVE_EXAMS_NAV ? { href: "/dashboard/live-exams", label: "Live Exams", icon: Radio } : null,
        { href: "/dashboard/assignments", label: "Assignments", icon: ClipboardList },
        { href: "/dashboard/assessment-test", label: "Assessment Test", icon: FileQuestion },
        { href: "/dashboard/mock-tests", label: "Practice", icon: ClipboardCheck },
        { href: "/dashboard/quiz", label: "Quiz", icon: Brain },
        { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
        currentUser?.role === "admin" ? { href: "/dashboard/admin/enrollments", label: "Enrollments", icon: ShieldCheck } : null,
        currentUser?.role === "admin" ? { href: "/dashboard/admin/classes", label: "Class Admin", icon: Video } : null,
        currentUser?.role === "admin" ? { href: "/dashboard/admin/live-exams", label: "Live Exam Admin", icon: FileQuestion } : null,
        currentUser?.role === "admin" ? { href: "/dashboard/admin/assignments", label: "Assignment Admin", icon: ClipboardList } : null,
        { href: "/dashboard/profile", label: "Profile", icon: User },
    ].filter(Boolean);

    const firstName = currentUser?.name?.trim().split(" ")[0] || "Student";
    const rankTone = getRankTone(rankInfo);
    const rankProgress = getRankProgressPercent(rankInfo).toFixed(0);

    const handleSignOut = () => {
        clearAuthSession();
        router.push("/");
    };

    return (
        <>
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 select-none flex-col justify-center overflow-hidden border-r border-[#DFB15B]/10 bg-[#0D0B14]/95 px-4 py-6 shadow-[22px_0_70px_rgba(0,0,0,0.28)]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.035)_1px,transparent_1px)] bg-size-[38px_38px]" />
                <motion.div
                    className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#DFB15B]/13 blur-3xl"
                    animate={{ scale: [1, 1.18, 1], opacity: [0.36, 0.68, 0.36] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="pointer-events-none absolute -right-28 top-72 h-64 w-64 rounded-full bg-[#3156D4]/12 blur-3xl"
                    animate={{ y: [0, 34, -14, 0], opacity: [0.28, 0.58, 0.28] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                {sidebarSparks.map((point, index) => (
                    <motion.span
                        key={index}
                        className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#DFB15B] shadow-[0_0_16px_rgba(223,177,91,0.72)]"
                        style={{ left: point.left, top: point.top }}
                        animate={{ opacity: [0.18, 0.9, 0.18], scale: [0.7, 1.35, 0.7] }}
                        transition={{ duration: 3.1, delay: point.delay, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}

                {/* <div className="relative z-10 mb-5 overflow-hidden rounded-3xl border border-[#DFB15B]/16 bg-white/5 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/70 to-transparent" />
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ boxShadow: ["0 0 0 rgba(223,177,91,0)", "0 0 26px rgba(223,177,91,0.28)", "0 0 0 rgba(223,177,91,0)"] }}
                            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#DFB15B]/25 bg-[#DFB15B]/10"
                        >
                            <BrandMark className="h-7 w-7" />
                        </motion.div>
                        <div className="min-w-0 flex flex-col">
                            <span className="font-serif text-base font-bold tracking-wide text-white">MathMagician</span>
                            <span className="text-[9px] font-bold tracking-[0.26em] text-[#DFB15B] uppercase">IBA Portal</span>
                        </div>
                    </div>
                </div> */}

                <div className={`relative z-10 mb-5 overflow-hidden rounded-3xl border px-4 py-4 backdrop-blur ${rankTone.card}`}>
                    <div className={`pointer-events-none absolute inset-0 ${rankTone.cardAura}`} />
                    <div className="relative z-10 flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${rankTone.avatar}`}>
                            {firstName.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className={`text-[10px] font-bold uppercase tracking-[0.24em] ${rankTone.mutedText}`}>Signed in</p>
                            <p className={`mt-1 truncate text-sm font-semibold ${rankTone.name}`}>Hi, {firstName}</p>
                            <p className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${rankTone.badge}`}>
                                {rankInfo.rankName}
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-4">
                        <div className={`mb-1.5 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider ${rankTone.mutedText}`}>
                            <span>Rank Charge</span>
                            <span className={rankTone.name}>{rankProgress}%</span>
                        </div>
                        <div className={`h-2 overflow-hidden rounded-full border ${rankTone.progressTrack}`}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${rankProgress}%` }}
                                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                                className={`h-full rounded-full ${rankTone.progressFill}`}
                            />
                        </div>
                    </div>
                </div>

                <nav className="relative z-10 flex max-h-[52vh] flex-none flex-col gap-1.5 overflow-y-auto pr-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const accent = NAV_ACCENTS[item.href] || "from-[#DFB15B]/20 via-white/6 to-transparent";
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative group flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors duration-200"
                                style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeDesktopIndicator"
                                        className={`absolute inset-0 z-0 rounded-2xl border border-[#DFB15B]/20 bg-linear-to-r ${accent} shadow-[0_12px_34px_rgba(223,177,91,0.08)]`}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span className="absolute inset-0 rounded-2xl border border-transparent bg-white/2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                {isActive ? (
                                    <motion.span
                                        layoutId="activeDesktopRail"
                                        className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-[#DFB15B] shadow-[0_0_18px_rgba(223,177,91,0.7)]"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                ) : null}

                                <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${isActive ? "border-[#DFB15B]/24 bg-[#DFB15B]/12 text-[#DFB15B]" : "border-white/6 bg-white/4 text-[#6B667B] group-hover:border-white/12 group-hover:text-white"}`}>
                                    <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                </span>
                                <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-white font-bold" : "text-[#8E8A9F] group-hover:text-white"}`}>
                                    {item.label}
                                </span>
                                {isActive ? <Sparkles className="relative z-10 ml-auto h-3.5 w-3.5 text-[#DFB15B]" /> : null}
                            </Link>
                        );
                    })}
                </nav>

                <div className="relative z-10 mt-5 border-t border-white/5 pt-4">
                    <button
                        onClick={handleSignOut}
                        className="group flex w-full items-center gap-3 rounded-2xl border border-white/6 bg-white/3 px-3 py-3 text-xs font-semibold text-[#8E8A9F] transition-all duration-200 hover:border-red-400/20 hover:bg-red-500/8 hover:text-red-300"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/6 bg-white/4">
                            <LogOut className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        </span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#DFB15B]/12 bg-[#0D0B14]/88 pb-safe pt-2 shadow-[0_-18px_45px_rgba(0,0,0,0.58)] backdrop-blur-xl select-none">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/65 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(ellipse_at_bottom,rgba(223,177,91,0.14),transparent_64%)]" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-[#0D0B14] to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-[#0D0B14] to-transparent z-10" />

                <div className="flex items-center gap-1.5 overflow-x-auto overscroll-x-contain px-3 pb-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const accent = NAV_ACCENTS[item.href] || "from-[#DFB15B]/20 via-white/6 to-transparent";
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex h-16 w-20 shrink-0 flex-col items-center justify-center rounded-2xl px-2 py-2"
                                style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeMobileIndicator"
                                        className={`absolute inset-x-1 inset-y-1 -z-10 rounded-2xl border border-[#DFB15B]/20 bg-linear-to-b ${accent} shadow-[0_8px_26px_rgba(223,177,91,0.12)]`}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}

                                <span className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all duration-200 ${isActive ? "border-[#DFB15B]/24 bg-[#DFB15B]/12 text-[#DFB15B]" : "border-white/6 bg-white/4 text-[#6B667B]"}`}>
                                    <item.icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                                </span>

                                <span className={`mt-1 max-w-full text-center text-[9px] font-bold leading-tight tracking-wide transition-colors duration-200 ${isActive ? "text-white" : "text-[#6B667B]"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
