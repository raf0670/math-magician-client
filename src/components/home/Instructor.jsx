"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Instructor() {

    // Credential configuration tags array mirroring your design
    const credentials = [
        { text: "IBA, DU Graduate" },
        { text: "GMAT 740" },
        { text: "5+ Years Teaching" },
        { text: "1,200+ Students Mentored" },
    ];

    // Animation layout structural specs
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
            },
        },
    };

    const leftSlideVariants = {
        hidden: { opacity: 0, x: -40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
        },
    };

    const rightSlideVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
        },
    };

    const badgeVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    return (
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 AMBIENT RADIAL LIGHTING MASKS */}
            <div className="absolute top-[20%] left-[-10%] w-[45vw] h-[45vw] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] bg-indigo-950/20 rounded-full blur-[130px] pointer-events-none" />

            <motion.div
                className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }} // Loops animation whenever user scrolls back into viewport frame
            >

                {/* 📸 LEFT COLUMN: IMAGE DISPLAY SHIELD (Spans 5 Columns) */}
                <motion.div
                    className="lg:col-span-5 flex justify-center lg:justify-start relative"
                    variants={leftSlideVariants}
                >
                    <div className="relative w-full max-w-90 aspect-4/5 rounded-4xl bg-[#121017] border border-white/4 p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group overflow-visible">

                        {/* Smooth Outer Frame Inner Glow */}
                        <div className="absolute inset-0 rounded-4xl bg-linear-to-tr from-white/1 via-transparent to-transparent pointer-events-none z-10" />

                        {/* Main Profile Ingestion Element */}
                        <div className="w-full h-full rounded-[1.75rem] overflow-hidden bg-[#16131C] relative">
                            <Image
                                src={"https://plus.unsplash.com/premium_photo-1661942126259-fb08e7cce1e2"} // <-- Ingest your image address link right here when ready
                                alt={"Lead Instructor Profile"}
                                width={1000}
                                height={1000}
                                className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.02] transition-transform duration-700 group-hover:scale-[1.03]"
                                
                            />

                            {/* Fallback structural layout block before asset hook mapping */}
                            <div className="absolute inset-0 flex items-center justify-center bg-[#16131C]/40 text-[10px] tracking-widest text-[#8E8A9F]/40 font-semibold uppercase p-4 text-center pointer-events-none">
                                Instructor Image Frame Placeholder
                            </div>
                        </div>

                        {/* Floating 'IBA Alumni' Gold Validation Shield */}
                        <motion.div
                            className="absolute bottom-6 -right-3 bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-black px-4 py-2 rounded-xl shadow-[0_8px_20px_rgba(212,175,55,0.3)] z-20 flex flex-col items-start min-w-25"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="font-serif font-bold text-sm leading-tight tracking-tight">IBA</span>
                            <span className="text-[10px] font-bold tracking-wide uppercase opacity-80 flex items-center gap-0.5">
                                Alumni <span className="text-xs">✓</span>
                            </span>
                        </motion.div>

                    </div>
                </motion.div>


                {/* 📝 RIGHT COLUMN: CONTENT TEXT MATRIX (Spans 7 Columns) */}
                <motion.div
                    className="lg:col-span-7 flex flex-col items-start text-left"
                    variants={rightSlideVariants}
                >
                    {/* Section Marker Tag */}
                    <div className="px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[10px] tracking-widest text-[#A78BFA] uppercase font-bold mb-5">
                        About the Instructor
                    </div>

                    {/* Core Serif Headline Header */}
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white leading-tight mb-6">
                        Learn from the Best. <br />
                        <span className="text-[#DFB15B]">Not Just Anyone.</span>
                    </h2>

                    {/* Comprehensive Platform Description Bio */}
                    <p className="text-[#8E8A9F] text-xs md:text-sm font-medium leading-relaxed max-w-xl mb-10">
                        I’m an IBA graduate who’s helped thousands of students navigate the toughest admission test in Bangladesh. My approach is simple: no fluff, no fear — only strategy, shortcuts, and relentless practice. If IBA is your dream, I’ll make it your reality.
                    </p>

                    {/* Dynamic Grid Matrix for Verification Badges */}
                    <div className="flex flex-wrap gap-3 w-full max-w-xl">
                        {credentials.map((badge, idx) => (
                            <motion.div
                                key={idx}
                                variants={badgeVariants}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#121017] border border-[#DFB15B]/15 text-xs font-semibold text-[#DFB15B] shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:border-[#DFB15B]/40 transition-colors duration-200"
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