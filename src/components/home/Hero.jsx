/* eslint-disable react-hooks/purity */
"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Play, Target, Star, FileText } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    const [session, setSession] = useState(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMounted(true);

        // fetch("/api/auth/session")
        //     .then((res) => {
        //         if (!res.ok) throw new Error("Unauthorized");
        //         return res.json();
        //     })
        //     .then((data) => setSession(data))
        //     .catch(() => setSession(false));
    }, []);

    const floatingGlyphs = useMemo(() => {
        const symbols = [
            "∑", "π", "√", "∆", "∞", "≠", "∫", "A²", "B", "C", "x", "y", "IQ", "EQ",
            "θ", "λ", "Ω", "α", "β", "μ", "GMAT", "IBA", "log", "f(x)", "π²", "3.14"
        ];

        return Array.from({ length: 28 }).map((_, idx) => {
            const isLeft = idx % 2 === 0;
            const initialX = isLeft ? Math.random() * 30 : Math.random() * 30 + 70;
            const initialY = Math.random() * 85 + 5;

            return {
                id: idx,
                char: symbols[idx % symbols.length],
                x: `${initialX}%`,
                y: `${initialY}%`,
                size: Math.random() * 14 + 14,
                opacity: Math.random() * 0.18 + 0.05,
                driftX: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
                driftY: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
                duration: Math.random() * 15 + 2,
            };
        });
    }, []);

    // Structural orchestrations for screen entry
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const statItems = [
        { value: "3,200+", label: "Students Enrolled", icon: FileText },
        { value: "94%", label: "IBA Selection Rate", icon: Target },
        { value: "5★", label: "Average Rating", icon: Star },
    ];

    return (
        <div className="w-full bg-[#0D0B14] min-h-[92vh] flex flex-col items-center justify-center pt-20 pb-12 px-6 relative overflow-hidden">

            {/* 🌌 AMBIENT BACKGROUND GLOWS */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,transparent_30%,#0D0B14_95%)] pointer-events-none z-0" />
            <div className="absolute top-[-10%] left-[-15%] w-[55vw] h-[55vw] bg-[#7C3AED]/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-15%] w-[45vw] h-[45vw] bg-indigo-950/20 rounded-full blur-[140px] pointer-events-none" />

            {/* 🛸 FLOATING ARCANE MATH SYMBOLS MATRIX */}
            <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
                {hasMounted && floatingGlyphs.map((glyph) => (
                    <motion.div
                        key={glyph.id}
                        className="absolute font-serif font-semibold text-[#DFB15B]"
                        style={{
                            left: glyph.x,
                            top: glyph.y,
                            fontSize: glyph.size,
                            opacity: glyph.opacity,
                            filter: "drop-shadow(0 0 4px rgba(223,177,91,0.15))",
                        }}
                        animate={{
                            x: glyph.driftX,
                            y: glyph.driftY,
                            rotate: [0, Math.random() * 45 - 22.5, Math.random() * -45 + 22.5, 0],
                        }}
                        transition={{
                            duration: glyph.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {glyph.char}
                    </motion.div>
                ))}
            </div>

            {/* 🏰 HERO CONTENT CONTAINER FRAME */}
            {/* Controlled via whileInView with once: false to re-trigger every time it hitches into view */}
            <motion.div
                className="container mx-auto max-w-5xl text-center z-10 flex flex-col items-center justify-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
            >

                {/* Badge */}
                <motion.div
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#DFB15B] shadow-[0_0_20px_rgba(124,58,237,0.15)] mb-6"
                    variants={itemVariants}
                >
                    <Sparkles className="w-3.5 h-3.5 text-[#DFB15B]" />
                    BANGLADESH’S #1 IBA ADMISSION PREP
                </motion.div>

                {/* Headline */}
                <motion.h1
                    className="font-serif text-4xl sm:text-6xl md:text-8xl tracking-tight text-white leading-[1.1]"
                    variants={itemVariants}
                >
                    Welcome to the School <br />
                    of <span className="text-[#DFB15B]">Magicians</span>
                </motion.h1>

                {/* Subtitle description */}
                <motion.p
                    className="text-[#8E8A9F] max-w-xl mt-6 text-xs md:text-sm font-medium leading-relaxed px-4"
                    variants={itemVariants}
                >
                    Learn the magic to easily crack IBA — Dhaka University’s most coveted admission test. Everything you need. Right here.
                </motion.p>

                {/* Academic Modules Stack Links */}
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-4 text-[#DFB15B] text-xs font-semibold tracking-wide"
                    variants={itemVariants}
                >
                    {["Math", "English", "Analytical Ability", "Written"].map((sub, i) => (
                        <span key={sub} className="flex items-center gap-2.5">
                            <span className="hover:text-white transition-colors cursor-default">{sub}</span>
                            {i < 3 && <span className="opacity-30 font-sans text-[10px]">|</span>}
                        </span>
                    ))}
                    <span className="opacity-40 text-[#8E8A9F] font-normal font-sans ml-0.5">— all in one place</span>
                </motion.div>

                {/* Core Interactive Portal Links */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center gap-4 mt-12 mb-20 w-full max-w-md justify-center px-4"
                    variants={itemVariants}
                >
                    <Link
                        href="/enroll"
                        className="px-8 py-3 w-full sm:w-auto rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-sm font-bold text-black tracking-wide shadow-[0_4px_14px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_22px_rgba(212,175,55,0.45)] hover:brightness-110 transition-all duration-300 text-center"
                    >
                        {session === null ? "Enroll Now" : "Login / Enroll Now"}
                    </Link>

                    <Link
                        href="/demo"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3 rounded-full border border-white/4 hover:border-[#DFB15B]/30 text-sm font-semibold text-white tracking-wide bg-[#15131C] hover:bg-[#1E1A29] transition-all duration-300 text-center"
                    >
                        <Play className="w-3.5 h-3.5 text-[#DFB15B] fill-[#DFB15B]" />
                        Watch Demo
                    </Link>
                </motion.div>

                {/* Stats Analytics Dashboard Footprint */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl border-t border-white/4 pt-12"
                    variants={itemVariants}
                >
                    {statItems.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center justify-center gap-1.5">
                            <stat.icon className="w-5 h-5 text-[#DFB15B] opacity-80" />
                            <span className="font-serif text-3xl font-bold tracking-tight text-white">
                                {stat.value}
                            </span>
                            <span className="text-xs font-semibold text-[#8E8A9F] tracking-wide">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </motion.div>

            </motion.div>
        </div>
    );
}