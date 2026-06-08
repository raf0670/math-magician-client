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
                speed: Math.random() * 4 + 3,
                delay: Math.random() * -10,
            };
        });
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const textNodeVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
        }
    };

    const handleScrollToPrograms = () => {
        const programAnchor = document.getElementById("programs-section");
        if (programAnchor) {
            programAnchor.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        // 🪄 Strict matching base background color applied here to keep everything uniform
        <section className="w-full bg-[#0D0B14] py-28 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none flex items-center justify-center">

            {/* 🌌 CENTRALIZED BLENDED AMBIENT GLOW BACKDROP */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] bg-indigo-950/15 rounded-full blur-[130px] pointer-events-none" />

            {/* Particle Orbits */}
            {hasMounted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    {orbitSparks.map((spark) => (
                        <motion.span
                            key={spark.id}
                            className="absolute font-sans text-white/40 selection:bg-transparent"
                            style={{ fontSize: spark.size }}
                            animate={{
                                x: [0, spark.radiusX, 0, -spark.radiusX, 0],
                                y: [-spark.radiusY, 0, spark.radiusY, 0, -spark.radiusY],
                                opacity: [spark.opacity, spark.opacity * 2, spark.opacity, spark.opacity * 0.5, spark.opacity],
                                scale: [1, 1.2, 0.9, 0.8, 1],
                            }}
                            transition={{
                                duration: spark.speed,
                                repeat: Infinity,
                                ease: "linear",
                                delay: spark.delay,
                            }}
                        >
                            {spark.char}
                        </motion.span>
                    ))}
                </div>
            )}

            <motion.div
                className="max-w-3xl w-full flex flex-col items-center text-center relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >
                <motion.div
                    variants={textNodeVariants}
                    className="w-11 h-11 rounded-2xl bg-[#DFB15B]/10 border border-[#DFB15B]/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(223,177,91,0.1)]"
                >
                    <Sparkles className="w-5 h-5 text-[#DFB15B]" />
                </motion.div>

                <motion.h2
                    variants={textNodeVariants}
                    className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium tracking-wide text-white mb-6 leading-tight"
                >
                    Ready to Crack <span className="text-[#DFB15B]">IBA?</span>
                </motion.h2>

                <motion.p
                    variants={textNodeVariants}
                    className="text-[#8E8A9F] text-xs md:text-sm font-medium leading-relaxed max-w-xl mb-10"
                >
                    Stop waiting for the perfect moment. The best resources, structured lessons, and guidance are right here. Dhaka University’s most prestigious institute is waiting.
                </motion.p>

                <motion.button
                    variants={textNodeVariants}
                    onClick={handleScrollToPrograms}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-xs font-bold text-black uppercase tracking-wider shadow-[0_10px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.45)] transition-all duration-300 relative group overflow-hidden"
                >
                    Start Your Journey
                </motion.button>

                <motion.span
                    variants={textNodeVariants}
                    className="text-[10px] md:text-xs font-semibold text-[#6B667B] tracking-wide mt-6"
                >
                    Instant access available immediately upon registration confirmation • Join today
                </motion.span>
            </motion.div>
        </section>
    );
}