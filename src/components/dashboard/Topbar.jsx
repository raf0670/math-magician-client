"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Flame, ChevronDown, Sparkles, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession, getMyStats, getStoredUser } from "@/lib/api";
import { getDefaultRankInfo, getRankInfo, getRankTone } from "@/lib/rank";

const SECTION_TITLES = {
    "/dashboard": "Overview",
    "/dashboard/classes": "Live Classes",
    "/dashboard/archived-classes": "Archived Classes",
    "/dashboard/live-exams": "Live Exams",
    "/dashboard/mock-tests": "Practice",
    "/dashboard/quiz": "Quiz",
    "/dashboard/analytics": "Analytics",
    "/dashboard/leaderboard": "Leaderboard",
    "/dashboard/profile": "Profile",
    "/dashboard/admin/enrollments": "Enrollments",
    "/dashboard/admin/classes": "Class Admin",
    "/dashboard/admin/live-exams": "Live Exam Admin",
};

export default function DashboardTopbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [rankInfo, setRankInfo] = useState(getDefaultRankInfo());

    useEffect(() => {
        const syncUser = () => {
            const storedUser = getStoredUser();
            setCurrentUser(storedUser);
            setRankInfo(getRankInfo(storedUser?.rankInfo));
        };
        syncUser();
        window.addEventListener("auth-state-changed", syncUser);
        window.addEventListener("storage", syncUser);

        getMyStats()
            .then((payload) => {
                setStats(payload?.stats || {});
                setHistory(Array.isArray(payload?.history) ? payload.history : []);
                setRankInfo(getRankInfo(payload?.rankInfo || payload?.stats?.rankInfo));
            })
            .catch(() => {
                setStats(null);
                setHistory([]);
            });

        return () => {
            window.removeEventListener("auth-state-changed", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    const notifications = useMemo(() => {
        if (!history.length) {
            return [{ id: 1, text: "Take your first exam to start building your live analytics trail.", time: "Ready to begin", unread: true }];
        }

        const latest = history[0];
        return [
            {
                id: 1,
                text: `Latest submission: ${latest?.exam?.title || "Practice exam"} scored ${Number(latest?.score || 0).toFixed(2)}.`,
                time: latest?.submittedAt ? new Date(latest.submittedAt).toLocaleString() : "Just now",
                unread: true,
            },
            {
                id: 2,
                text: `${stats?.totalExams || 0} exam${(stats?.totalExams || 0) === 1 ? "" : "s"} tracked so far.`,
                time: "Updated from database",
                unread: false,
            },
        ];
    }, [history, stats]);

    const fullName = currentUser?.name || "Student";
    const firstName = fullName.split(" ")[0] || "Student";
    const email = currentUser?.email || "student@example.com";
    const initials = firstName.slice(0, 1).toUpperCase();
    const rankTone = getRankTone(rankInfo);
    const sectionTitle = SECTION_TITLES[pathname] || "Workspace";
    const streak = useMemo(() => {
        const uniqueDays = new Set(
            history
                .filter((item) => item?.submittedAt)
                .map((item) => item.submittedAt)
                .map((value) => new Date(value).toISOString().slice(0, 10))
        );
        return uniqueDays.size || 0;
    }, [history]);

    const handleSignOut = () => {
        setShowProfileMenu(false);
        clearAuthSession();
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-20 flex h-20 w-full select-none items-center justify-between overflow-visible border-b border-[#DFB15B]/10 bg-[#0A090F]/72 px-4 text-white shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/70 to-transparent" />
                <motion.div
                    className="absolute -left-20 -top-28 h-52 w-52 rounded-full bg-[#DFB15B]/12 blur-3xl"
                    animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.62, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute right-20 -top-28 h-56 w-56 rounded-full bg-[#3156D4]/10 blur-3xl"
                    animate={{ x: [0, 26, -12, 0], opacity: [0.24, 0.52, 0.24] }}
                    transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="relative z-10 min-w-0">
                <div className="hidden min-w-0 items-center gap-3 sm:flex">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B] shadow-[0_0_24px_rgba(223,177,91,0.08)]">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#DFB15B]">Dashboard</p>
                        <h2 className="truncate font-serif text-xl font-semibold tracking-wide text-white">{sectionTitle}</h2>
                    </div>
                </div>

                <div className="flex min-w-0 items-center gap-2 sm:hidden">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B]">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="min-w-0 truncate font-serif text-sm font-semibold text-white">{sectionTitle}</span>
                </div>
            </div>

            <div className="relative z-10 flex min-w-0 items-center gap-2 sm:gap-4">
                <motion.div
                    whileHover={{ y: -2, boxShadow: "0 14px 34px rgba(223,177,91,0.12)" }}
                    className="group flex h-11 shrink-0 cursor-default items-center gap-2 rounded-2xl border border-[#DFB15B]/18 bg-[#DFB15B]/9 px-3 shadow-[0_0_18px_rgba(223,177,91,0.05)]"
                >
                    <Flame className="h-4 w-4 fill-[#DFB15B] text-[#DFB15B] transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-xs font-black text-white">{streak}</span>
                    <span className="hidden text-[10px] font-bold uppercase tracking-wider text-[#DFB15B] sm:inline-block">Day Streak</span>
                </motion.div>

                <div className="relative">
                    <motion.button
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-200 ${showNotifications ? "border-[#DFB15B]/30 bg-[#DFB15B]/12 text-[#DFB15B] shadow-[0_0_28px_rgba(223,177,91,0.12)]" : "border-white/7 bg-white/5 text-[#8E8A9F] hover:border-white/14 hover:text-white"}`}
                    >
                        <Bell className="h-4 w-4" />
                        {notifications.some((n) => n.unread) ? (
                            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#A78BFA] ring-4 ring-[#0A090F]">
                                <span className="absolute inset-0 animate-ping rounded-full bg-[#A78BFA]" />
                            </span>
                        ) : null}
                    </motion.button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-[-3.5rem] z-50 mt-3 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-[#DFB15B]/12 bg-[#121017]/96 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.62)] backdrop-blur-xl sm:right-0">
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/70 to-transparent" />
                                <div className="mb-2.5 flex items-center justify-between border-b border-white/5 pb-2.5">
                                    <span className="text-xs font-bold text-white tracking-wide">Notifications</span>
                                    <span className="text-[10px] text-[#DFB15B] font-bold uppercase cursor-pointer hover:underline">Live feed</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {notifications.map((item) => (
                                        <div key={item.id} className={`rounded-2xl border p-3 transition-colors duration-200 cursor-pointer ${item.unread ? "bg-[#DFB15B]/8 border-[#DFB15B]/14" : "bg-white/[0.025] border-white/5 hover:bg-white/5"}`}>
                                            <p className="break-words text-xs font-medium leading-normal text-[#B9B2C8]">{item.text}</p>
                                            <span className="text-[10px] text-[#6B667B] mt-1.5 block font-semibold">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative">
                    <motion.button
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`group flex min-w-0 items-center gap-2.5 rounded-2xl border py-1.5 pl-1.5 pr-2.5 transition-all duration-200 ${showProfileMenu ? "border-[#DFB15B]/30 bg-[#DFB15B]/10" : "border-white/7 bg-white/5 hover:border-white/14"}`}
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#DFB15B]/20 bg-linear-to-br from-[#DFB15B]/20 to-[#7C3AED]/12 text-sm font-black text-[#DFB15B] shadow-[0_0_20px_rgba(223,177,91,0.08)]">{initials}</div>
                        <div className="hidden min-w-0 max-w-44 flex-col items-start text-left sm:flex">
                            <span className={`max-w-full truncate text-xs font-bold tracking-wide leading-none ${rankTone.name}`}>{fullName}</span>
                            <span className={`mt-1 flex max-w-full items-center gap-1 truncate text-[9px] font-bold uppercase tracking-wide ${rankTone.name}`}>
                                <ShieldCheck className={`w-2.5 h-2.5 ${rankTone.icon}`} /> {rankInfo.rankName}
                            </span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-[#6B667B] group-hover:text-white transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`} />
                    </motion.button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 z-50 mt-3 flex w-64 flex-col gap-0.5 overflow-hidden rounded-3xl border border-[#DFB15B]/12 bg-[#121017]/96 p-2.5 shadow-[0_18px_55px_rgba(0,0,0,0.62)] backdrop-blur-xl">
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/70 to-transparent" />
                                <div className="mb-1.5 border-b border-white/5 px-3 py-2">
                                    <p className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider">Signed in as</p>
                                    <p className="text-xs font-semibold text-white truncate mt-0.5">{email}</p>
                                    <p className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${rankTone.badge}`}>
                                        {rankInfo.rankName}
                                    </p>
                                </div>
                                <button onClick={handleSignOut} className="w-full rounded-2xl px-3 py-2.5 text-left text-xs font-semibold text-red-300 transition-colors duration-150 hover:bg-red-500/8">Log Out</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
