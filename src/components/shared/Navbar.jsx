"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredUser } from "@/lib/api";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const syncUser = () => setCurrentUser(getStoredUser());
        syncUser();
        window.addEventListener("auth-state-changed", syncUser);
        window.addEventListener("storage", syncUser);

        return () => {
            window.removeEventListener("auth-state-changed", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Programs", href: "/#programs-section" },
        { name: "Community", href: "/community" },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);
    const firstName = currentUser?.name?.trim().split(" ")[0] || "Student";
    const isLoggedIn = Boolean(currentUser);
    const handleNavClick = (event, link) => {
        if (link.href === "/#programs-section" && pathname === "/") {
            event.preventDefault();
            document.getElementById("programs-section")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            window.history.replaceState(null, "", "/#programs-section");
        }

        setIsOpen(false);
    };

    return (
        <nav className="w-full bg-[#111015] border-b border-white/4 px-4 md:px-6 py-4 flex items-center justify-between relative z-50">
            <Link href="/" className="flex items-center gap-3 select-none z-50">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-linear-to-br from-[#4C1D95] via-[#6947cc] to-[#D4AF37] flex items-center justify-center font-serif text-lg md:text-xl font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                    M
                </div>
                <span className="font-serif text-lg md:text-2xl tracking-wide text-[#DFB15B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    MathMagician&apos;s School
                </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={(event) => handleNavClick(event, link)}
                            className={`text-sm tracking-wide font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-[#8E8A9F] hover:text-white"}`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>

            <div className="hidden md:flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <span className="rounded-full border border-[#DFB15B]/30 bg-[#1A1722] px-4 py-2 text-sm font-medium text-[#E6C687]">
                            Hi, {firstName}
                        </span>
                        <Link
                            href="/dashboard"
                            className="px-6 py-2 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-sm font-semibold text-black tracking-wide hover:brightness-110 shadow-[0_4px_12px_rgba(212,175,55,0.2)] transition-all duration-200"
                        >
                            Dashboard
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="px-6 py-2 rounded-full border border-[#DFB15B]/40 hover:border-[#DFB15B] text-sm font-medium text-white tracking-wide bg-transparent hover:bg-white/2 transition-all duration-200"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="px-6 py-2 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-sm font-semibold text-black tracking-wide hover:brightness-110 shadow-[0_4px_12px_rgba(212,175,55,0.2)] transition-all duration-200"
                        >
                            Create Account
                        </Link>
                    </>
                )}
            </div>

            <button
                onClick={toggleMenu}
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-50 text-white focus:outline-none"
                aria-label="Toggle Menu"
            >
                <span className={`h-0.5 w-6 bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`h-0.5 w-6 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-6 bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>

            <div className={`fixed inset-0 bg-[#0D0B14] flex flex-col pt-24 px-6 gap-6 transition-transform duration-300 ease-in-out md:hidden z-40 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={(event) => handleNavClick(event, link)}
                                className={`text-lg tracking-wide font-medium transition-colors ${isActive ? "text-white" : "text-[#8E8A9F]"}`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-center text-sm font-semibold text-black tracking-wide"
                        >
                            Continue as {firstName}
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 rounded-full border border-[#DFB15B]/40 text-center text-sm font-medium text-white tracking-wide"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-center text-sm font-semibold text-black tracking-wide"
                            >
                                Create Account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
