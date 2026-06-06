/* eslint-disable react-hooks/purity */
"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Instructor() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMounted(true);
    }, []);

    const credentials = [
        { text: "IBA, DU Graduate" },
        { text: "GMAT 740" },
        { text: "5+ Years Teaching" },
        { text: "1,200+ Students Mentored" },
    ];

    // 🪄 Generate persistent localized background magic sparks around the card area
    const instructorSparks = useMemo(() => {
        const magicGlyphs = ["★", "✦", "✧", "z²", "x", "√", "•"];
        return Array.from({ length: 16 }).map((_, idx) => {
            // Position them intentionally bordering the 360px portrait frame space
            const angle = (idx / 16) * 2 * Math.PI;
            const radius = 160 + Math.random() * 60; // Spread radius around card
            const initialX = Math.cos(angle) * radius + 180; // Centered offset
            const initialY = Math.sin(angle) * radius + 225;

            return {
                id: idx,
                char: magicGlyphs[idx % magicGlyphs.length],
                x: initialX,
                y: initialY,
                size: Math.random() * 10 + 10,
                opacity: Math.random() * 0.35 + 0.15,
                driftX: [0, Math.random() * 25 - 12.5, Math.random() * -25 + 12.5, 0],
                driftY: [0, Math.random() * -35 - 10, Math.random() * 20 - 10, 0], // Tendency to drift upwards like embers
                duration: Math.random() * 4 + 3, // Faster, snappier wizard pacing
            };
        });
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
        },
    };

    const leftSlideVariants = {
        hidden: { opacity: 0, x: -50, scale: 0.95 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
        },
    };

    const rightSlideVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
        },
    };

    return (
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 AMBIENT BACKGROUND GLOW MATRIX */}
            <div className="absolute top-[30%] left-[-5%] w-[45vw] h-[45vw] bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[40%] left-[15%] w-[30vw] h-[30vw] bg-[#DFB15B]/5 rounded-full blur-[110px] pointer-events-none animate-pulse" />

            <motion.div
                className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >

                {/* 📸 LEFT COLUMN: MAGIC PORTRAIT DISPLAY SHIELD */}
                <motion.div
                    className="lg:col-span-5 flex justify-center lg:justify-start relative"
                    variants={leftSlideVariants}
                >
                    {/* Localized Floating Spark Layer Container */}
                    <div className="absolute inset-0 w-full max-w-90 h-full min-h-112.5 pointer-events-none z-0 overflow-visible hidden sm:block">
                        {hasMounted && instructorSparks.map((spark) => (
                            <motion.div
                                key={spark.id}
                                className="absolute font-serif font-bold text-[#DFB15B]"
                                style={{
                                    left: spark.x,
                                    top: spark.y,
                                    fontSize: spark.size,
                                    opacity: spark.opacity,
                                    filter: "drop-shadow(0 0 8px rgba(223,177,91,0.5))",
                                }}
                                animate={{
                                    x: spark.driftX,
                                    y: spark.driftY,
                                    opacity: [spark.opacity, spark.opacity + 0.2, 0.05, spark.opacity],
                                    scale: [1, 1.2, 0.8, 1],
                                }}
                                transition={{
                                    duration: spark.duration,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                {spark.char}
                            </motion.div>
                        ))}
                    </div>

                    {/* Core Profile Card Body Frame */}
                    <div className="relative w-full max-w-90 aspect-4/5 rounded-4xl bg-[#121017] border border-[#DFB15B]/10 p-1.5 shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:border-[#DFB15B]/30 transition-all duration-500 z-10 group overflow-visible">

                        {/* Prismatic corner shimmer bar */}
                        <div className="absolute inset-0 rounded-4xl bg-linear-to-tr from-[#7C3AED]/5 via-transparent to-[#DFB15B]/5 pointer-events-none z-10" />

                        <div className="w-full h-full rounded-[1.75rem] overflow-hidden bg-[#16131C] relative">
                            <Image
                                src="https://plus.unsplash.com/premium_photo-1661942126259-fb08e7cce1e2" // <-- Insert your custom photo link address asset map straight here
                                alt="Lead Instructor Profile"
                                width={1000}
                                height={1000}
                                className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] transition-transform duration-700 group-hover:scale-[1.04]"
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-[#16131C]/40 text-[10px] tracking-widest text-[#8E8A9F]/40 font-semibold uppercase p-4 text-center pointer-events-none">
                                Instructor Image Frame Placeholder
                            </div>
                        </div>

                        {/* Floating 'IBA Alumni' Shield */}
                        <motion.div
                            className="absolute bottom-6 -right-3 bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-black px-4 py-2 rounded-xl shadow-[0_8px_25px_rgba(212,175,55,0.4)] z-20 flex flex-col items-start min-w-25"
                            animate={{
                                y: [0, -8, 0],
                                boxShadow: [
                                    "0 8px 25px rgba(212,175,55,0.3)",
                                    "0 12px 30px rgba(212,175,55,0.5)",
                                    "0 8px 25px rgba(212,175,55,0.3)"
                                ]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="font-serif font-bold text-sm leading-tight tracking-tight">IBA</span>
                            <span className="text-[10px] font-bold tracking-wide uppercase opacity-80 flex items-center gap-0.5">
                                Alumni <span className="text-xs">✓</span>
                            </span>
                        </motion.div>

                    </div>
                </motion.div>


                {/* 📝 RIGHT COLUMN: CONTENT TEXT MATRIX */}
                <motion.div
                    className="lg:col-span-7 flex flex-col items-start text-left z-10"
                    variants={rightSlideVariants}
                >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[10px] tracking-widest text-[#A78BFA] uppercase font-bold mb-5">
                        <Sparkles className="w-3 h-3 text-[#DFB15B]" />
                        About the Instructor
                    </div>

                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white leading-tight mb-6">
                        Learn from the Best. <br />
                        <span className="text-[#DFB15B]">Not Just Anyone.</span>
                    </h2>

                    <p className="text-[#8E8A9F] text-xs md:text-sm font-medium leading-relaxed max-w-xl mb-10">
                        I’m an IBA graduate who’s helped thousands of students navigate the toughest admission test in Bangladesh. My approach is simple: no fluff, no fear — only strategy, shortcuts, and relentless practice. If IBA is your dream, I’ll make it your reality.
                    </p>

                    <div className="flex flex-wrap gap-3 w-full max-w-xl">
                        {credentials.map((badge, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.04, borderColor: "rgba(223, 177, 91, 0.4)" }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#121017] border border-[#DFB15B]/15 text-xs font-semibold text-[#DFB15B] shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all duration-200 cursor-default"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#DFB15B] shrink-0" />
                                <span>{badge.text}</span>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>

            </motion.div>
        </section>
    );
}