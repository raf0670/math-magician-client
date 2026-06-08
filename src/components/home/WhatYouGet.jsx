"use client";
import { motion } from "framer-motion";
import { Video, ClipboardCheck, UserCheck, Users } from "lucide-react";

export default function WhatYouGet() {

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
        }
    };

    return (
        // 🪄 Balanced padding bridges the Hero and Instructor sections cleanly
        <section className="w-full bg-[#0D0B14] py-20 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 MID-SECTION CONTROLLED AMBIENT GLOW CORES */}
            <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] bg-indigo-950/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-0 left-[-5%] w-[40vw] h-[40vw] bg-[#7C3AED]/3 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">

                {/* Section Header Block */}
                <div className="w-full flex flex-col items-center text-center mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[10px] tracking-widest text-[#A78BFA] uppercase font-bold mb-4">
                        Features
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white mb-4">
                        What You Actually Get
                    </h2>
                    <p className="text-[#6B667B] text-xs md:text-sm font-medium">
                        A rigorous tactical ecosystem packed with premium assets to build real speed and exam confidence.
                    </p>
                </div>

                {/* Grid Deck */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                >
                    {featureCards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                            className="bg-[#121017] border border-white/3 hover:border-white/10 p-7 rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col gap-6 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-white/1 to-transparent pointer-events-none" />

                            {/* Icon Wrapper Shield */}
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${card.bgIconClass} ${card.colorClass}`}>
                                <card.icon className="w-5 h-5 stroke-[1.8]" />
                            </div>

                            {/* Info Blocks */}
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
    );
}