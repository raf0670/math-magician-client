/* eslint-disable react-hooks/purity */
"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { School, Building2, Laptop, Plus } from "lucide-react";

export default function Programs() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMounted(true);
    }, []);

    // 🪄 Generate continuous localized magical floating sparks for the center card
    const popularSparks = useMemo(() => {
        const magicGlyphs = ["★", "✦", "✧", "•"];
        return Array.from({ length: 14 }).map((_, idx) => ({
            id: idx,
            char: magicGlyphs[idx % magicGlyphs.length],
            left: `${Math.random() * 90 + 5}%`,
            bottom: `${Math.random() * 20}%`, // Sparks initiate from base area
            size: Math.random() * 8 + 10,
            opacity: Math.random() * 0.4 + 0.2,
            driftX: [0, Math.random() * 30 - 15, Math.random() * -30 + 15, 0],
            driftY: [0, -120, -260, -400], // Smooth continuous upward float sequence
            duration: Math.random() * 3 + 3, // Fast, snappy ember float
        }));
    }, []);

    const programCards = [
        {
            title: "Offline",
            location: "Farmgate",
            description: "In-person classes at our Farmgate center. Best for students who thrive face-to-face with structured daily sessions.",
            price: "৳ 8,000",
            period: "/ 3 month batch",
            badge: "Most Popular",
            badgeStyle: "bg-gradient-to-r from-[#E6C687] to-[#D4AF37] text-black font-bold border border-[#DFB15B]/30 shadow-[0_0_15px_rgba(212,175,55,0.4)]",
            isPopular: true,
            glowHoverClass: "hover:shadow-[0_0_50px_rgba(212,175,55,0.25)] hover:border-[#DFB15B]/50",
            buttonStyle: "bg-gradient-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-black font-bold shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_22px_rgba(212,175,55,0.5)]",
            icon: School,
            iconColor: "text-[#DFB15B]",
            features: [
                "Daily 2-hr live classes",
                "Printed study materials",
                "On-site mock exams",
                "Small batch (30 max)"
            ]
        },
        {
            title: "Offline",
            location: "Bailey Road",
            description: "Our Bailey Road branch — closer to Dhaka University. Evening batches available for school/college students.",
            price: "৳ 8,000",
            period: "/ 3 month batch",
            badge: null,
            isPopular: false,
            glowHoverClass: "hover:shadow-[0_0_45px_rgba(124,58,237,0.2)] hover:border-[#7C3AED]/40",
            buttonStyle: "bg-[#1E1A29] text-white border border-white/[0.04] hover:bg-[#252033] font-semibold",
            icon: Building2,
            iconColor: "text-[#8E8A9F]",
            features: [
                "Evening & weekend batches",
                "Printed study materials",
                "On-site mock exams",
                "Small batch (30 max)"
            ]
        },
        {
            title: "Online",
            location: "Anywhere in Bangladesh",
            description: "Full access from anywhere in Bangladesh or abroad. Live classes, recordings, digital materials, and online mock tests.",
            price: "৳ 5,500",
            period: "/ 3 month batch",
            badge: "Study Anywhere",
            badgeStyle: "bg-[#7C3AED] text-white font-semibold border border-[#A78BFA]/20",
            isPopular: false,
            glowHoverClass: "hover:shadow-[0_0_45px_rgba(99,102,241,0.25)] hover:border-[#6366F1]/50",
            buttonStyle: "bg-[#1E1A29] text-white border border-white/[0.04] hover:bg-[#252033] font-semibold",
            icon: Laptop,
            iconColor: "text-[#A78BFA]",
            features: [
                "Live + recorded sessions",
                "Digital study materials",
                "Online mock tests",
                "WhatsApp doubt support"
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
        }
    };

    return (
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 AMBIENT CANVAS BACKGROUND GLOWS */}
            <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-indigo-950/20 rounded-full blur-[130px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">

                {/* 🏷️ SECTION HEADLINE BLOCK */}
                <div className="w-full flex flex-col items-center text-center mb-20">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#DFB15B]/5 border border-[#DFB15B]/15 text-[10px] tracking-widest text-[#DFB15B] uppercase font-bold mb-4">
                        Programs
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white mb-4">
                        Pick Your Program
                    </h2>
                    <p className="text-[#6B667B] text-xs md:text-sm font-medium">
                        Offline or online — same world-class content, same results.
                    </p>
                </div>

                {/* 🗃️ PRICING STRUCUTURAL CARDS GRID */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                >
                    {programCards.map((card, index) => {
                        const IconComponent = card.icon;

                        return (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover={{ y: -10 }}
                                className={`bg-[#121017] border rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 relative shadow-[0_10px_30px_rgba(0,0,0,0.5)] group overflow-visible
                  ${card.isPopular ? "border-[#DFB15B]/25 shadow-[0_0_30px_rgba(212,175,55,0.08)]" : "border-white/3"}
                  ${card.glowHoverClass}`}
                            >

                                {/* 🌟 PERSISTENT FLOATING SPARK LAYER FOR THE MOST POPULAR CARD */}
                                {card.isPopular && hasMounted && (
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
                                        {popularSparks.map((spark) => (
                                            <motion.div
                                                key={spark.id}
                                                className="absolute font-serif text-[#DFB15B] pointer-events-none font-bold"
                                                style={{
                                                    left: spark.left,
                                                    bottom: spark.bottom,
                                                    fontSize: spark.size,
                                                    opacity: spark.opacity,
                                                    filter: "drop-shadow(0 0 6px rgba(223,177,91,0.6))",
                                                }}
                                                animate={{
                                                    x: spark.driftX,
                                                    y: spark.driftY,
                                                    opacity: [spark.opacity, spark.opacity + 0.3, 0, 0],
                                                }}
                                                transition={{
                                                    duration: spark.duration,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                {spark.char}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* Card Top Structural content */}
                                <div className="relative z-10">
                                    {/* Absolute Card Header Pill Badges */}
                                    {card.badge && (
                                        <div className={`absolute -top-11 -left-2 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest ${card.badgeStyle}`}>
                                            {card.badge}
                                        </div>
                                    )}

                                    {/* Program Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex flex-col">
                                            <h3 className="font-serif text-2xl font-semibold text-white tracking-wide transition-colors duration-300 group-hover:text-white">
                                                {card.title}
                                            </h3>
                                            <span className={`text-xs font-semibold mt-0.5 ${card.isPopular ? "text-[#DFB15B]" : "text-[#8E8A9F]"}`}>
                                                {card.location}
                                            </span>
                                        </div>
                                        <IconComponent className={`w-6 h-6 ${card.iconColor} opacity-90`} />
                                    </div>

                                    {/* Card Main Body Pitch Text */}
                                    <p className="text-[#6B667B] text-xs leading-relaxed font-medium mb-8 group-hover:text-[#8E8A9F] transition-colors duration-300">
                                        {card.description}
                                    </p>

                                    {/* Bullet Feature Set Matrix */}
                                    <ul className="flex flex-col gap-3.5 border-t border-white/3 pt-6 mb-8">
                                        {card.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-xs font-medium text-[#8E8A9F] group-hover:text-white transition-colors duration-300">
                                                <Plus className="w-3.5 h-3.5 text-[#DFB15B]/80 shrink-0" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Card Bottom Pricing Anchor Framework */}
                                <div className="mt-auto pt-4 relative z-10">
                                    <div className="flex items-baseline gap-1.5 mb-6">
                                        <span className="font-serif text-3xl font-bold text-white tracking-tight">
                                            {card.price}
                                        </span>
                                        <span className="text-[11px] font-medium text-[#6B667B]">
                                            {card.period}
                                        </span>
                                    </div>

                                    <button className={`w-full py-3.5 rounded-2xl text-xs tracking-wide transition-all duration-300 hover:brightness-110 active:scale-[0.98] ${card.buttonStyle}`}>
                                        Enroll in This Program
                                    </button>
                                </div>

                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}