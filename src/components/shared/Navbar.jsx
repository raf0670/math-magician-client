"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogIn, LogOut, Menu, Sparkles, UserRound, X } from "lucide-react";
import { clearAuthSession, getStoredUser } from "@/lib/api";
import BrandMark from "@/components/shared/BrandMark";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const userMenuRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const syncUser = () => {
            const nextUser = getStoredUser();
            setCurrentUser(nextUser);
            if (!nextUser) setShowUserMenu(false);
        };
        syncUser();
        window.addEventListener("auth-state-changed", syncUser);
        window.addEventListener("storage", syncUser);

        return () => {
            window.removeEventListener("auth-state-changed", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    useEffect(() => {
        if (!showUserMenu) return undefined;

        const handlePointerDown = (event) => {
            if (!userMenuRef.current?.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showUserMenu]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Programs", href: "/#programs-section" },
        { name: "Community", href: "/#community-section" },
    ];

    const toggleMenu = () => {
        setShowUserMenu(false);
        setIsOpen(!isOpen);
    };
    const firstName = currentUser?.name?.trim().split(" ")[0] || "Student";
    const isLoggedIn = Boolean(currentUser);
    const handleSignOut = () => {
        setShowUserMenu(false);
        setIsOpen(false);
        clearAuthSession();
        router.push("/");
    };
    const handleNavClick = (event, link) => {
        if (link.href.startsWith("/#") && pathname === "/") {
            const sectionId = link.href.slice(2);
            event.preventDefault();
            document.getElementById(sectionId)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            window.history.replaceState(null, "", link.href);
        }

        setIsOpen(false);
    };

    const portalTarget = typeof document !== "undefined" ? document.body : null;
    const mobileMenu = (
        <AnimatePresence>
            {isOpen ? (
                <motion.div
                    initial={{ opacity: 0, x: "100%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-1000 flex flex-col overflow-y-auto bg-[#0D0B14]/98 px-5 pt-24 text-white shadow-[0_0_80px_rgba(0,0,0,0.55)] backdrop-blur-xl md:hidden"
                >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[42px_42px]" />
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#DFB15B]/14 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-30 -left-20 h-72 w-72 rounded-full bg-[#3156D4]/14 blur-3xl" />

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="absolute right-5 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DFB15B]/18 bg-[#DFB15B]/10 text-[#DFB15B] shadow-[0_0_24px_rgba(223,177,91,0.08)] transition hover:border-[#DFB15B]/35"
                        aria-label="Close Menu"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="relative z-20 flex flex-col gap-3 border-b border-white/7 pb-6">
                        {navLinks.map((link, index) => {
                            const isActive = pathname === link.href;
                            return (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.28, delay: index * 0.04 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={(event) => handleNavClick(event, link)}
                                        className={`flex items-center justify-between rounded-3xl border px-4 py-4 text-lg font-semibold tracking-wide transition-colors ${isActive ? "border-[#DFB15B]/22 bg-[#DFB15B]/10 text-white" : "border-white/7 bg-white/[0.035] text-[#B9B2C8]"}`}
                                    >
                                        {link.name}
                                        {isActive ? <Sparkles className="h-4 w-4 text-[#DFB15B]" /> : null}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="relative z-20 mt-6 flex flex-col gap-3 pb-8">
                        {isLoggedIn ? (
                            <>
                                <div className="rounded-3xl border border-white/7 bg-white/[0.035] px-4 py-3">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6B667B]">Signed in</p>
                                    <p className="mt-1 truncate text-sm font-semibold text-[#F6D98B]">Hi, {firstName}</p>
                                </div>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-[#F6D98B] via-[#DFB15B] to-[#A46F18] py-4 text-sm font-bold tracking-wide text-black"
                                >
                                    Continue to Dashboard
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-red-400/18 bg-red-500/8 py-4 text-sm font-semibold text-red-300"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-[#DFB15B]/28 bg-white/[0.035] py-4 text-sm font-semibold tracking-wide text-white"
                                >
                                    <LogIn className="h-4 w-4 text-[#DFB15B]" />
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-[#F6D98B] via-[#DFB15B] to-[#A46F18] py-4 text-sm font-bold tracking-wide text-black"
                                >
                                    Create Account
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );

    return (
        <>
            <nav className="sticky top-0 z-100 w-full overflow-visible border-b border-[#DFB15B]/10 bg-[#0D0B14]/82 px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,0.26)] backdrop-blur-xl md:px-6">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/75 to-transparent" />
                    <motion.div
                        className="absolute -left-20 -top-28 h-56 w-56 rounded-full bg-[#DFB15B]/13 blur-3xl"
                        animate={{ scale: [1, 1.18, 1], opacity: [0.32, 0.68, 0.32] }}
                        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute right-20 -top-32 h-64 w-64 rounded-full bg-[#3156D4]/10 blur-3xl"
                        animate={{ x: [0, 32, -14, 0], opacity: [0.24, 0.56, 0.24] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

            <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4">
                <Link href="/" className="group flex min-w-0 items-center gap-3 select-none">
                    <motion.div
                        whileHover={{ rotate: -4, scale: 1.05 }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 shadow-[0_0_26px_rgba(223,177,91,0.12)]"
                    >
                        <BrandMark className="h-8 w-8" />
                    </motion.div>
                    <div className="min-w-0">
                        <span className="block truncate font-serif text-lg tracking-wide text-[#DFB15B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] md:text-2xl">
                            MathMagician&apos;s School
                        </span>
                        <span className="hidden text-[9px] font-bold uppercase tracking-[0.28em] text-[#8E8A9F] md:block">
                            IBA Preparation Portal
                        </span>
                    </div>
                </Link>

                <div className="hidden items-center gap-2 rounded-2xl border border-white/6 bg-white/[0.035] p-1 backdrop-blur md:flex">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={(event) => handleNavClick(event, link)}
                                className={`relative rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 ${isActive ? "text-white" : "text-[#9D96B3] hover:text-white"}`}
                            >
                                {isActive ? (
                                    <motion.span
                                        layoutId="publicNavbarActive"
                                        className="absolute inset-0 rounded-xl border border-[#DFB15B]/18 bg-[#DFB15B]/10 shadow-[0_0_24px_rgba(223,177,91,0.10)]"
                                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                                    />
                                ) : null}
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    {isLoggedIn ? (
                        <>
                            <div ref={userMenuRef} className="relative">
                                <motion.button
                                    type="button"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowUserMenu((isVisible) => !isVisible)}
                                    aria-expanded={showUserMenu}
                                    className={`flex items-center gap-2 rounded-2xl border py-1.5 pl-1.5 pr-3 text-sm font-semibold transition-all duration-200 ${showUserMenu ? "border-[#DFB15B]/35 bg-[#DFB15B]/10 text-[#F6D98B]" : "border-white/7 bg-white/5 text-[#E6C687] hover:border-[#DFB15B]/35 hover:bg-[#DFB15B]/8"}`}
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DFB15B]/20 bg-linear-to-br from-[#DFB15B]/20 to-[#7C3AED]/12 text-xs font-black text-[#DFB15B]">
                                        <UserRound className="h-4 w-4" />
                                    </span>
                                    <span className="max-w-28 truncate">Hi, {firstName}</span>
                                    <ChevronDown className={`h-3.5 w-3.5 text-[#8E8A9F] transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
                                </motion.button>

                                <AnimatePresence>
                                    {showUserMenu ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.16 }}
                                            className="absolute right-0 mt-3 w-52 overflow-hidden rounded-3xl border border-[#DFB15B]/12 bg-[#121017]/96 p-2.5 shadow-[0_18px_55px_rgba(0,0,0,0.62)] backdrop-blur-xl"
                                        >
                                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/70 to-transparent" />
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-semibold text-[#D8D4E5] transition hover:bg-white/5 hover:text-white"
                                            >
                                                <LayoutDashboard className="h-4 w-4 text-[#DFB15B]" />
                                                Dashboard
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-xs font-semibold text-red-300 transition hover:bg-red-500/8"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Log Out
                                            </button>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#F6D98B] via-[#DFB15B] to-[#A46F18] px-5 py-2.5 text-sm font-bold tracking-wide text-black shadow-[0_14px_34px_rgba(223,177,91,0.18)] transition-all duration-200 hover:brightness-110"
                                >
                                    Dashboard
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </motion.div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-2xl border border-[#DFB15B]/28 bg-white/2.5 px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:border-[#DFB15B]/50 hover:bg-[#DFB15B]/8"
                            >
                                <LogIn className="h-4 w-4 text-[#DFB15B]" />
                                Log In
                            </Link>
                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#F6D98B] via-[#DFB15B] to-[#A46F18] px-5 py-2.5 text-sm font-bold tracking-wide text-black shadow-[0_14px_34px_rgba(223,177,91,0.18)] transition-all duration-200 hover:brightness-110"
                                >
                                    Create Account
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={toggleMenu}
                    className="z-120 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DFB15B]/18 bg-[#DFB15B]/10 text-[#DFB15B] shadow-[0_0_24px_rgba(223,177,91,0.08)] transition hover:border-[#DFB15B]/35 md:hidden"
                    aria-label="Toggle Menu"
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            </nav>
            {portalTarget ? createPortal(mobileMenu, portalTarget) : null}
        </>
    );
}
