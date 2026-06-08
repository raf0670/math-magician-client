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

    const instructorSparks = useMemo(() => {
        const magicGlyphs = ["★", "✦", "✧", "•"];
        return Array.from({ length: 14 }).map((_, idx) => {
            const angle = (idx / 14) * 2 * Math.PI;
            const radius = 150 + Math.random() * 50;
            return {
                id: idx,
                char: magicGlyphs[idx % magicGlyphs.length],
                x: Math.cos(angle) * radius + 170,
                y: Math.sin(angle) * radius + 170,
                size: Math.random() * 6 + 9,
                opacity: Math.random() * 0.35 + 0.15,
                delay: Math.random() * -6,
            };
        });
    }, []);

    return (
        // 🪄 Clean transition space using matching hex tokens to keep the flow uninterrupted
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 INSTRUCTOR AREA BALANCED LIGHTS */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[55vw] h-[55vw] bg-indigo-950/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    {/* Visual Media Engine Container */}
                    <div className="lg:col-span-5 flex justify-center relative select-none">

                        {/* Orbit Sparks System around the media card frame */}
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
                                        transition={{
                                            duration: 4,
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

                        {/* Portrait Frame Shield */}
                        <motion.div
                            className="w-72 h-80 md:w-80 md:h-96 rounded-3xl bg-[#121017] border border-[#DFB15B]/20 p-3.5 relative z-10 shadow-[0_15px_45px_rgba(0,0,0,0.5)] group overflow-hidden hover:border-white/10 transition-all duration-300"
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="w-full h-full rounded-2xl overflow-hidden bg-[#16131C] border border-white/3 relative">
                                <Image
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                                    alt="Instructor Portrait"
                                    fill
                                    priority
                                    className="object-cover grayscale brightness-[0.88] contrast-[1.03] group-hover:scale-[1.03] group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Content Columns info space */}
                    <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFB15B]/10 border border-[#DFB15B]/20 text-[10px] tracking-widest text-[#DFB15B] uppercase font-bold mb-4">
                            <Sparkles className="w-3 h-3 text-[#DFB15B]" />
                            <span>Your Instructor</span>
                        </div>

                        <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white mb-6 leading-tight">
                            Learn from the Best. <br />
                            <span className="text-[#DFB15B]">Not Just Anyone.</span>
                        </h2>

                        <p className="text-[#8E8A9F] text-xs md:text-sm font-medium leading-relaxed max-w-xl mb-10">
                            I’m an IBA graduate who’s helped thousands of students navigate the toughest admission test in Bangladesh. My approach is simple: no fluff, no fear — only strategy, shortcuts, and relentless practice. If IBA is your dream, I’ll make it your reality.
                        </p>

                        {/* Badges Hub Matrix Grid */}
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start w-full max-w-xl">
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
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}