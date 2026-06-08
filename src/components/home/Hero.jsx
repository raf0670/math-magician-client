/* eslint-disable react-hooks/purity */
"use client";
import { useEffect, useState, useMemo, useRef } from "react";
// 🪄 1. Added useScroll and useTransform for Parallax Magic
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, Target, Star, FileText, Video, ClipboardCheck, UserCheck, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UnifiedHeroDeck() {
    const [hasMounted, setHasMounted] = useState(false);

    // 🪄 2. Create a reference anchor to monitor the scroll container position
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // 🪄 3. Map scroll position to different movement values (Parallax Weights)
    // Background glows and back-layer elements move much slower
    const yGlowBg = useTransform(scrollYProgress, [0, 1], [0, 250]);
    const yGlyphsBg = useTransform(scrollYProgress, [0, 1], [0, -150]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMounted(true);
    }, []);

    // --- Hero Background Mathematical Glyphs Vault ---
    const floatingGlyphs = useMemo(() => {
        const symbols = [
            "∑", "π", "√", "∆", "∞", "≠", "∫", "A²", "B", "C", "x", "y", "IQ", "EQ",
            "θ", "λ", "Ω", "α", "β", "μ", "GMAT", "IBA", "log", "f(x)"
        ];
        return Array.from({ length: 24 }).map((_, idx) => ({
            id: idx,
            char: symbols[idx % symbols.length],
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            size: Math.random() * 12 + 30,
            opacity: Math.random() * 0.3 + 1,
            delay: Math.random() * -20,
            duration: Math.random() * 15 + 30,
        }));
    }, []);

    const statItems = [
        { icon: Target, value: "92%", label: "Success Rate" },
        { icon: Star, value: "1,200+", label: "Students Selected" },
        { icon: FileText, value: "45+", label: "Full Mock Tests" },
    ];

    const featureCards = [
        {
            title: "Live Classes",
            description: "Join interactive live sessions covering Math, English, Analytical Ability and Written. Ask questions. Solve problems in real time.",
            icon: Video,
            colorClass: "text-[#E6C687]",
            bgIconClass: "bg-[#E6C687]/10 border-[#E6C687]/20",
        },
        {
            title: "Mock Tests",
            description: "Simulate the real IBA exam with timed full-length mock tests. Detailed answer keys and rank-based performance reports included.",
            icon: ClipboardCheck,
            colorClass: "text-[#A78BFA]",
            bgIconClass: "bg-[#7C3AED]/10 border-[#7C3AED]/20",
        },
        {
            title: "Personal Counselling",
            description: "Get 1-on-1 guidance from mentors who cracked IBA themselves. Study plans, weak-area targeting, and mindset coaching.",
            icon: UserCheck,
            colorClass: "text-[#DFB15B]",
            bgIconClass: "bg-[#DFB15B]/10 border-[#DFB15B]/20",
        },
        {
            title: "Premium Community",
            description: "Access our exclusive, highly moderated group. Share solutions, discuss hard problems, and stay accountable with top peers.",
            icon: Users,
            colorClass: "text-blue-400",
            bgIconClass: "bg-blue-500/10 border-blue-500/20",
        },
    ];

    const credentials = [
        { text: "IBA, DU Graduate" },
        { text: "GMAT 740" },
        { text: "5+ Years Teaching" },
        { text: "1,200+ Students Mentored" },
    ];

    const instructorSparks = useMemo(() => {
        const magicGlyphs = ["★", "✦", "✧", "•"];
        return Array.from({ length: 14 }).map((_, idx) => {
            const angle = (idx / 14) * 2 * Math.PI;
            const radius = 150 + Math.random() * 40;
            return {
                id: idx,
                char: magicGlyphs[idx % magicGlyphs.length],
                x: Math.cos(angle) * radius + 200,
                y: Math.sin(angle) * radius + 200,
                size: Math.random() * 6 + 20,
                opacity: Math.random() * 0.35 + 1,
                delay: Math.random() * -1,
            };
        });
    }, []);

    // --- Animation Variants ---
    const heroContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.15 }
        }
    };

    const heroItemVariants = {
        hidden: { opacity: 0, y: 35 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
        }
    };

    const blockHeaderVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
        }
    };

    const gridContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const featureCardVariants = {
        hidden: { opacity: 0, y: 35 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
        }
    };

    return (
        // Added container ref to register scroll track boundaries
        <div ref={containerRef} className="w-full bg-[#0D0B14] relative overflow-hidden select-none">

            {/* 🌌 PARALLAX RADIANCE FIELDS: Attached style={{ y: yGlowBg }} so they glide smoothly at an offset pace */}
            <motion.div style={{ y: yGlowBg }} className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[85vw] h-[85vw] bg-indigo-950/15 rounded-full blur-[150px] pointer-events-none" />
            <motion.div style={{ y: yGlowBg }} className="absolute top-[35%] right-[-15%] w-[55vw] h-[55vw] bg-[#7C3AED]/4 rounded-full blur-[140px] pointer-events-none" />
            <motion.div style={{ y: yGlowBg }} className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-950/15 rounded-full blur-[140px] pointer-events-none" />

            {/* 🌌 PARALLAX GLYPH FIELD: Controlled by yGlyphsBg to float independently of layout panels */}
            {hasMounted && (
                <motion.div style={{ y: yGlyphsBg }} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <AnimatePresence>
                        {floatingGlyphs.map((glyph) => (
                            <motion.span
                                key={glyph.id}
                                className="absolute font-serif text-white/40 selection:bg-transparent"
                                style={{
                                    left: glyph.left,
                                    top: glyph.top,
                                    fontSize: glyph.size,
                                    opacity: glyph.opacity,
                                }}
                                animate={{
                                    y: [0, -35, 0, 35, 0],
                                    x: [0, 20, 0, -20, 0],
                                    rotate: [0, 15, 0, -15, 0],
                                }}
                                transition={{
                                    duration: glyph.duration,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: glyph.delay,
                                }}
                            >
                                {glyph.char}
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* =========================================================================
                                     SECTION 1: HERO CONTAINER
               ========================================================================= */}
            <section className="w-full pt-36 pb-24 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center relative z-10 min-h-[90vh]">
                <motion.div
                    className="max-w-4xl w-full flex flex-col items-center text-center"
                    variants={heroContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={heroItemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFB15B]/10 border border-[#DFB15B]/25 shadow-[0_0_15px_rgba(223,177,91,0.08)] mb-8">
                        <Sparkles className="w-3.5 h-3.5 text-[#DFB15B]" />
                        <span className="text-[10px] tracking-widest text-[#DFB15B] uppercase font-bold">
                            The Ultimate IBA Preparation Ecosystem
                        </span>
                    </motion.div>

                    <motion.h1 variants={heroItemVariants} className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-wide text-white leading-[1.12] mb-6">
                        Crack the Code of <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11]">
                            IBA Admission
                        </span>
                    </motion.h1>

                    <motion.p variants={heroItemVariants} className="text-[#8E8A9F] text-xs sm:text-sm md:text-base font-medium leading-relaxed max-w-2xl mb-12">
                        Master quantitative modules, speed shortcuts, and critical analytical frameworks under structured blueprints designed by real top-tier IBA graduates.
                    </motion.p>

                    <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-20">
                        <Link href="#programs-section" className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-xs font-bold text-black uppercase tracking-wider shadow-[0_4px_25px_rgba(212,175,55,0.2)] hover:shadow-[0_10px_35px_rgba(212,175,55,0.35)] transition-all duration-300 hover:scale-[1.02]">
                            Explore Programs
                        </Link>
                        <Link href="#" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/4 hover:border-[#DFB15B]/30 text-xs font-bold text-white uppercase tracking-wider bg-[#121017] hover:bg-[#1A1722] transition-all duration-300">
                            <Play className="w-3 h-3 text-[#DFB15B] fill-[#DFB15B]" />
                            Watch Demo
                        </Link>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl border-t border-white/3 pt-12" variants={heroItemVariants}>
                        {statItems.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center justify-center gap-1.5">
                                <stat.icon className="w-4 h-4 text-[#DFB15B] opacity-80" />
                                <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white">{stat.value}</span>
                                <span className="text-[10px] md:text-xs font-semibold text-[#6B667B] tracking-wide uppercase">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* =========================================================================
                                   SECTION 2: WHAT YOU GET VIEWPORT
               ========================================================================= */}
            <section className="w-full py-24 px-6 md:px-12 lg:px-24 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        className="w-full flex flex-col items-center text-center mb-16"
                        variants={blockHeaderVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        <div className="inline-block px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[10px] tracking-widest text-[#A78BFA] uppercase font-bold mb-4">
                            Features
                        </div>
                        <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white mb-4">
                            What You Actually Get
                        </h2>
                        <p className="text-[#6B667B] text-xs md:text-sm font-medium">
                            A rigorous tactical ecosystem packed with premium assets to build real speed and exam confidence.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
                        variants={gridContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.12 }}
                    >
                        {featureCards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                variants={featureCardVariants}
                                whileHover={{ y: -5 }}
                                className="bg-[#121017] border border-white/3 hover:border-white/10 p-7 rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col gap-6 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-white/1 to-transparent pointer-events-none" />
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${card.bgIconClass} ${card.colorClass}`}>
                                    <card.icon className="w-5 h-5 stroke-[1.8]" />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <h3 className="font-serif text-lg font-medium text-white tracking-wide transition-colors duration-200 group-hover:text-[#DFB15B]">
                                        {card.title}
                                    </h3>
                                    <p className="text-[#8E8A9F] text-xs leading-relaxed font-medium transition-colors duration-200 group-hover:text-white/70">
                                        {card.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* =========================================================================
                                   SECTION 3: INSTRUCTOR VIEWPORT
               ========================================================================= */}
            <section className="w-full py-24 px-6 md:px-12 lg:px-24 relative z-10">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                        <div className="lg:col-span-5 flex justify-center relative">
                            {hasMounted && (
                                <div className="absolute w-85 h-85 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible z-0 opacity-40">
                                    {instructorSparks.map((spark) => (
                                        <motion.span
                                            key={spark.id}
                                            className="absolute font-sans text-[#DFB15B]"
                                            style={{ left: spark.x, top: spark.y, fontSize: spark.size }}
                                            animate={{
                                                scale: [1, 1.2, 0.9, 1],
                                                opacity: [spark.opacity, spark.opacity * 1.8, spark.opacity * 0.5, spark.opacity],
                                            }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: spark.delay }}
                                        >
                                            {spark.char}
                                        </motion.span>
                                    ))}
                                </div>
                            )}

                            <motion.div
                                className="w-72 h-80 md:w-80 md:h-96 rounded-3xl bg-[#121017] border border-[#DFB15B]/20 p-3.5 relative z-10 shadow-[0_15px_45px_rgba(0,0,0,0.5)] group overflow-hidden hover:border-white/10 transition-all duration-300"
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: false, amount: 0.25 }}
                                transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
                            >
                                <div className="w-full h-full rounded-2xl overflow-hidden bg-[#16131C] border border-white/3 relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                                        alt="Instructor Portrait"
                                        fill
                                        className="object-cover grayscale brightness-[0.88] contrast-[1.03] group-hover:scale-[1.03] group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.25 }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            <motion.div variants={featureCardVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFB15B]/10 border border-[#DFB15B]/20 text-[10px] tracking-widest text-[#DFB15B] uppercase font-bold mb-4">
                                <Sparkles className="w-3 h-3 text-[#DFB15B]" />
                                <span>Your Instructor</span>
                            </motion.div>

                            <motion.h2 variants={featureCardVariants} className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white mb-6 leading-tight">
                                Learn from the Best. <br />
                                <span className="text-[#DFB15B]">Not Just Anyone.</span>
                            </motion.h2>

                            <motion.p variants={featureCardVariants} className="text-[#8E8A9F] text-xs md:text-sm font-medium leading-relaxed max-w-xl mb-10">
                                I’m an IBA graduate who’s helped thousands of students navigate the toughest admission test in Bangladesh. My approach is simple: no fluff, no fear — only strategy, shortcuts, and relentless practice. If IBA is your dream, I’ll make it your reality.
                            </motion.p>

                            <motion.div variants={featureCardVariants} className="flex flex-wrap gap-3 justify-center lg:justify-start w-full max-w-xl">
                                {credentials.map((badge, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.03, borderColor: "rgba(223, 177, 91, 0.35)" }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#121017] border border-white/4 text-xs font-semibold text-[#8E8A9F] hover:text-[#DFB15B] shadow-md transition-all duration-200 cursor-default"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#DFB15B] shrink-0 opacity-80" />
                                        <span>{badge.text}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
            </section>

        </div>
    );
}