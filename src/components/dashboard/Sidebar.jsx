"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Video, ClipboardCheck, BarChart3, User, LogOut, ShieldCheck, Sparkles, Brain, Archive } from "lucide-react";
import { clearAuthSession, getProfile, getStoredUser, saveAuthSession } from "@/lib/api";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const syncUser = () => setCurrentUser(getStoredUser());
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
        { href: "/dashboard/mock-tests", label: "Practice", icon: ClipboardCheck },
        { href: "/dashboard/quiz", label: "Quiz", icon: Brain },
        { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
        currentUser?.role === "admin" ? { href: "/dashboard/admin/enrollments", label: "Enrollments", icon: ShieldCheck } : null,
        currentUser?.role === "admin" ? { href: "/dashboard/admin/classes", label: "Class Admin", icon: Video } : null,
        { href: "/dashboard/profile", label: "Profile", icon: User },
    ].filter(Boolean);

    const firstName = currentUser?.name?.trim().split(" ")[0] || "Student";

    const handleSignOut = () => {
        clearAuthSession();
        router.push("/");
    };

    return (
        <>
            <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 bg-[#0D0B14] border-r border-white/5 z-30 px-5 py-8 select-none">
                <div className="flex items-center gap-2 px-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#E6C687] to-[#AA7C11] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                        <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-sm font-bold text-white tracking-wide">MathMagician</span>
                        <span className="text-[9px] font-bold tracking-widest text-[#DFB15B] uppercase opacity-80">IBA Portal</span>
                    </div>
                </div>

                <div className="mb-6 rounded-2xl border border-white/5 bg-[#121017] px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6B667B]">Signed in</p>
                    <p className="mt-1 text-sm font-semibold text-white">Hi, {firstName}</p>
                </div>

                <nav className="flex-1 flex flex-col gap-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative group flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200"
                                style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeDesktopIndicator"
                                        className="absolute inset-0 bg-[#1A1722] border border-white/5 rounded-xl z-0 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}

                                <item.icon className={`w-4 h-4 z-10 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-[#DFB15B]" : "text-[#6B667B] group-hover:text-white/90"}`} />
                                <span className={`z-10 transition-colors duration-200 ${isActive ? "text-white font-bold" : "text-[#8E8A9F] group-hover:text-white"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-white/3 pt-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-[#6B667B] hover:text-red-400 transition-colors duration-200 group"
                    >
                        <LogOut className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#0D0B14]/80 backdrop-blur-xl border-t border-white/5 z-40 px-3 pb-safe pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] select-none">
                <div className="flex items-center justify-around max-w-lg mx-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-16"
                                style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeMobileIndicator"
                                        className="absolute inset-x-1 inset-y-1 bg-[#1A1722] border border-white/5 rounded-xl -z-10"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}

                                <item.icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "text-[#DFB15B] scale-110" : "text-[#6B667B]"}`} />

                                <span className={`text-center text-[9px] font-bold mt-1 tracking-wide transition-colors duration-200 ${isActive ? "text-white" : "text-[#6B667B]"}`}>
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
