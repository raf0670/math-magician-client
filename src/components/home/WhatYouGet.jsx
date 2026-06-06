"use client";
import { motion } from "framer-motion";
import { Video, ClipboardCheck, UserCheck, Users } from "lucide-react";
import Image from "next/image";

export default function WhatYouGet() {

    // High-fidelity structured content array mirroring your design text layout
    const featureCards = [
        {
            title: "Live Classes",
            description: "Join interactive live sessions covering Math, English, Analytical Ability and Written. Ask questions. Solve problems in real time.",
            icon: Video,
            colorClass: "text-[#E6C687]", // Gold asset accent matching the live badge
            bgIconClass: "bg-[#E6C687]/10 border-[#E6C687]/20",
        },
        {
            title: "Mock Tests",
            description: "Simulate the real IBA exam with timed full-length mock tests. Detailed answer keys and rank-based performance reports included.",
            icon: ClipboardCheck,
            colorClass: "text-[#A78BFA]", // Mystic Purple accent
            bgIconClass: "bg-[#7C3AED]/10 border-[#7C3AED]/20",
        },
        {
            title: "Personal Counselling",
            description: "Get 1-on-1 guidance from mentors who cracked IBA themselves. Study plans, weak-area targeting, and mindset coaching.",
            icon: UserCheck,
            colorClass: "text-[#DFB15B]", // Academy Gold core
            bgIconClass: "bg-[#DFB15B]/10 border-[#DFB15B]/20",
        },
        {
            title: "Best Community",
            description: "Join 3,000+ aspirants in our close-knit community. Peer discussions, doubt-solving, and motivation — every single day.",
            icon: Users,
            colorClass: "text-[#6366F1]", // Indigo star glow
            bgIconClass: "bg-[#6366F1]/10 border-[#6366F1]/20",
        },
    ];

    // Viewport stagger orchestration variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] },
        },
    };

    return (
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 AMBIENT BACKGROUND GLOW */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vw] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* 🏷️ HEADLINE HEADER BLOCK */}
                <div className="w-full flex flex-col items-center text-center mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#DFB15B]/5 border border-[#DFB15B]/20 text-[10px] tracking-widest text-[#DFB15B] uppercase font-bold mb-4">
                        What You Get
                    </div>

                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white">
                        What to Expect from Me?
                    </h2>
                </div>

                {/* 📇 REUSABLE CARDS RESPONSIVE GRID */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-100px" }} // Triggers once when scrolled into layout scope
                >
                    {featureCards.map((card, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                backgroundColor: "rgba(26, 22, 37, 0.4)",
                                borderColor: "rgba(124, 92, 250, 0.25)"
                            }}
                            className="bg-[#121017] border border-white/3 p-8 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col gap-6 group relative overflow-hidden"
                        >
                            {/* Subtle inner soft corner hover glow vector */}
                            <div className="absolute inset-0 bg-linear-to-br from-white/1 to-transparent pointer-events-none" />

                            {/* Icon Container Shield */}
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${card.bgIconClass} ${card.colorClass}`}>
                                <card.icon className="w-5 h-5 stroke-[1.75]" />
                            </div>

                            {/* Title Content Block */}
                            <div className="flex flex-col gap-3">
                                <h3 className="font-serif text-xl font-medium text-white tracking-wide transition-colors duration-200 group-hover:text-[#DFB15B]">
                                    {card.title}
                                </h3>

                                <p className="text-[#8E8A9F] text-xs leading-relaxed font-medium">
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