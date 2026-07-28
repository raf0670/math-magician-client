"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Flame, ChevronDown, Sparkles, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAuthSession, getMyStats, getStoredUser } from "@/lib/api";

export default function DashboardTopbar() {
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const syncUser = () => setCurrentUser(getStoredUser());
        syncUser();
        window.addEventListener("auth-state-changed", syncUser);
        window.addEventListener("storage", syncUser);

        getMyStats()
            .then((payload) => {
                setStats(payload?.stats || {});
                setHistory(Array.isArray(payload?.history) ? payload.history : []);
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
        <header className="w-full h-20 border-b border-white/5 bg-[#0A090F]/40 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 select-none">
            <div className="hidden sm:block" />
            <div className="sm:hidden flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#DFB15B]" />
                <span className="font-serif text-sm font-semibold text-white">Workspace</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DFB15B]/5 border border-[#DFB15B]/15 shadow-[0_0_15px_rgba(223,177,91,0.04)] cursor-default group">
                    <Flame className="w-4 h-4 text-[#DFB15B] fill-[#DFB15B] animate-pulse group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-xs font-bold text-white">{streak}</span>
                    <span className="hidden text-[10px] text-[#DFB15B] font-bold uppercase tracking-wider sm:inline-block pl-0.5">Day Streak</span>
                </div>

                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl bg-[#121017] border border-white/3 hover:border-white/10 text-[#8E8A9F] hover:text-white transition-all duration-200 relative">
                        <Bell className="w-4 h-4" />
                        {notifications.some((n) => n.unread) && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-[#0A090F]" />}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-3 w-80 bg-[#121017] border border-white/5 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50">
                                <div className="flex items-center justify-between border-b border-white/3 pb-2.5 mb-2.5">
                                    <span className="text-xs font-bold text-white tracking-wide">Notifications</span>
                                    <span className="text-[10px] text-[#DFB15B] font-bold uppercase cursor-pointer hover:underline">Live feed</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {notifications.map((item) => (
                                        <div key={item.id} className={`p-2.5 rounded-xl border transition-colors duration-200 cursor-pointer ${item.unread ? "bg-white/2 border-white/5" : "bg-transparent border-transparent hover:bg-white/1"}`}>
                                            <p className="text-[#8E8A9F] text-xs leading-normal font-medium">{item.text}</p>
                                            <span className="text-[10px] text-[#6B667B] mt-1.5 block font-semibold">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative">
                    <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-[#121017] border border-white/3 hover:border-white/8 transition-all duration-200 group">
                        <div className="w-7 h-7 rounded-lg bg-[#1F1A2B] border border-white/10 flex items-center justify-center text-sm font-bold text-[#DFB15B]">{initials}</div>
                        <div className="hidden flex-col items-start text-left sm:flex">
                            <span className="text-xs font-bold text-white tracking-wide leading-none">{fullName}</span>
                            <span className="text-[9px] text-[#6B667B] font-bold mt-1 tracking-wide uppercase flex items-center gap-1">
                                <ShieldCheck className="w-2.5 h-2.5 text-[#DFB15B]" /> {firstName}&apos;s Workspace
                            </span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-[#6B667B] group-hover:text-white transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-3 w-56 bg-[#121017] border border-white/5 rounded-2xl p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 flex flex-col gap-0.5">
                                <div className="px-3 py-2 border-b border-white/3 mb-1.5">
                                    <p className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider">Signed in as</p>
                                    <p className="text-xs font-semibold text-white truncate mt-0.5">{email}</p>
                                </div>
                                <button onClick={handleSignOut} className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/5 transition-colors duration-150">Log Out</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
