/* eslint-disable react-hooks/purity */
"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ReadyToCrack() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMounted(true);
    }, []);

    // 🌀 Generate localized deep-space star orbits swirling continuously around the core elements
    const orbitSparks = useMemo(() => {
        const symbols = ["✦", "★", "✧", "•"];
        return Array.from({ length: 18 }).map((_, idx) => {
            const radiusX = 140 + Math.random() * 100;
            const radiusY = 50 + Math.random() * 40;
            return {
                id: idx,
                char: symbols[idx % symbols.length],
                radiusX,
                radiusY,
                size: Math.random() * 8 + 10,
                opacity: Math.random() * 0.4 + 0.2,
                speed: Math.random() * 4 + 3, // Orbit cycle durations
                delay: Math.random() * -10, // Randomized offset start points
            };
        });
    }, []);

    // 🚀 Native smooth scroll layout handler targeting your programs component anchor
    const handleScrollToPrograms = () => {
        const targetElement = document.getElementById("programs-section");
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // 🌌 Unfamiliar 3D Vortex Entry Transition Profile (triggers every time it hits viewport)
    const vortexContainerVariants = {
        hidden: {
            opacity: 0,
            scale: 1.15,
            rotateY: -25,
            rotateX: 12,
            z: -100
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            z: 0,
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1], // Custom cinematic cubic bezier curve
                staggerChildren: 0.15
            }
        }
    };

    const textNodeVariants = {
        hidden: { opacity: 0, filter: "blur(8px)", y: 20 },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section className="w-full bg-[#0D0B14] py-28 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none perspective-distant">

            {/* 🔮 MASTER BACKGROUND NEBULA MASKS */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] bg-indigo-950/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

            {/* 🛸 REVOLVING ORBIT CONSTELLATION FIELDS */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden sm:block">
                {hasMounted && orbitSparks.map((spark) => (
                    <motion.div
                        key={spark.id}
                        className="absolute left-[50%] top-[45%] font-serif text-[#DFB15B]"
                        style={{
                            fontSize: spark.size,
                            filter: "drop-shadow(0 0 8px rgba(223,177,91,0.6))",
                        }}
                        animate={{
                            // Math equation based ellipse tracking models for unconventional cosmic loops
                            x: orbitSparks.map((_, i) => Math.cos((i / 5) * 2 * Math.PI) * spark.radiusX),
                            y: orbitSparks.map((_, i) => Math.sin((i / 5) * 2 * Math.PI) * spark.radiusY),
                            opacity: [spark.opacity, spark.opacity + 0.3, 0.1, spark.opacity],
                            scale: [1, 1.25, 0.75, 1]
                        }}
                        transition={{
                            duration: spark.speed,
                            repeat: Infinity,
                            ease: "linear",
                            delay: spark.delay
                        }}
                    >
                        {spark.char}
                    </motion.div>
                ))}
            </div>

            {/* 🏰 CORE CONTAINER BLOCK */}
            <motion.div
                className="container mx-auto max-w-3xl flex flex-col items-center text-center relative z-10"
                variants={vortexContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.25 }} // Re-triggers continuously upon re-scrolling
            >

                {/* Magic Floating Top Emblem */}
                <motion.div
                    variants={textNodeVariants}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-8"
                >
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#1A1625] to-[#121017] border border-[#DFB15B]/20 flex items-center justify-center shadow-[0_8px_25px_rgba(212,175,55,0.1)] relative group">
                        <div className="absolute inset-0 bg-[#DFB15B]/5 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Sparkles className="w-7 h-7 text-[#DFB15B] filter drop-shadow-[0_0_6px_rgba(223,177,91,0.5)]" />
                    </div>
                </motion.div>

                {/* Serif Headline Header */}
                <motion.h2
                    variants={textNodeVariants}
                    className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-white leading-tight mb-6"
                >
                    Are You Ready <br />
                    to <span className="text-[#DFB15B]">Crack IBA?</span>
                </motion.h2>

                {/* Supporting Pitch Bio Description */}
                <motion.p
                    variants={textNodeVariants}
                    className="text-[#8E8A9F] text-xs md:text-sm font-medium leading-relaxed max-w-xl mb-12 px-2"
                >
                    Every IBA topper started exactly where you are right now. The only difference is — they started. Your seat at Dhaka University’s most prestigious institute is waiting.
                </motion.p>

                {/* Interactive Smooth Scroll Launch Call to Action button */}
                <motion.button
                    variants={textNodeVariants}
                    onClick={handleScrollToPrograms}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-4 rounded-2xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-xs font-bold text-black uppercase tracking-wider shadow-[0_10px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.45)] transition-all duration-300 relative group overflow-hidden"
                >
                    {/* Subtle horizontal laser flash swipe across button background */}
                    <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover:animate-shine transition-transform duration-1000" />
                    Start Your Journey
                </motion.button>

                {/* Small Baseline Footnote Notification */}
                <motion.span
                    variants={textNodeVariants}
                    className="text-[10px] md:text-xs font-semibold text-[#6B667B] tracking-wide mt-6"
                >
                    Next batch starts soon — limited seats available
                </motion.span>

            </motion.div>
        </section>
    );
}