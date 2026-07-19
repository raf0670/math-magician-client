/* eslint-disable react-hooks/purity */
"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock3, School, Building2, Laptop, MapPin, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getStoredToken, savePendingPaymentPlan } from "@/lib/api";

export default function ProgramsAndTestimonials() {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMounted(true);
    }, []);

    // 🪄 Localized floating background magic sparks for the highlight card
    const popularSparks = useMemo(() => {
        const magicGlyphs = ["★", "✦", "✧", "•"];
        return Array.from({ length: 14 }).map((_, idx) => ({
            id: idx,
            char: magicGlyphs[idx % magicGlyphs.length],
            left: `${Math.random() * 90 + 5}%`,
            bottom: `${Math.random() * 20}%`,
            size: Math.random() * 8 + 10,
            opacity: Math.random() * 0.4 + 0.2,
            driftX: [0, Math.random() * 30 - 15, Math.random() * -30 + 15, 0],
            driftY: [0, -120, -260, -400],
            speed: Math.random() * 5 + 4,
            delay: Math.random() * -8,
        }));
    }, []);

    // --- Programs Data ---
    const cardsData = [
        {
            id: "offline",
            badge: "Offline - Farmgate",
            title: "IBA Offline Batch",
            desc: "Full comprehensive offline preparation at our physical center with face-to-face mentorship and real-time exam simulations.",
            icon: School,
            location: {
                text: "RH Home Center, Farmgate",
                href: "https://maps.app.goo.gl/G6Qhf3stvisrsjXr6?g_st=ac"
            },
            schedule: {
                days: "Sunday, Tuesday, Thursday",
                time: "1:30 - 3:30 pm"
            },
            features: [
                "24+ Interactive Physical Lectures",
                "Weekly Specialized Topic Tests",
                "15+ Realistic Full Mock Exams",
                "Direct 1-on-1 Doubt Solving"
            ],
            price: "BDT 18,000",
            period: "/ full program",
            borderClass: "border-white/3 hover:border-white/10",
            bgClass: "bg-[#121017]",
            badgeStyle: "bg-white/5 border-white/10 text-white/80",
            iconStyle: "bg-white/5 text-white/80 border-white/10",
            buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10"
        },
        {
            id: "premium",
            badge: "Online Batch",
            title: "IBA Online Batch",
            desc: "Take your preparation sitting in you cozy study room. Best suited for those who are living far from offline batch locations",
            icon: Laptop,
            location: {
                text: "Your Cozy Study Room"
            },
            schedule: {
                days: "Sunday, Tuesday, Thursday",
                time: "7:30 - 9:30 pm"
            },
            features: [
               "24+ Interactive Online Lectures",
                "Weekly Specialized Topic Tests",
                "15+ Realistic Full Mock Exams",
                "Direct 1-on-1 Doubt Solving"
            ],
            price: "BDT 17,500",
            period: "/ full program",
            borderClass: "border-[#DFB15B]/25 shadow-[0_4px_30px_rgba(213,175,55,0.03)]",
            bgClass: "bg-[#121017]",
            badgeStyle: "bg-[#DFB15B]/10 border-[#DFB15B]/20 text-[#DFB15B]",
            iconStyle: "bg-[#DFB15B]/10 text-[#DFB15B] border-[#DFB15B]/20",
            buttonStyle: "bg-gradient-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-black font-bold shadow-[0_4px_20px_rgba(212,175,55,0.15)]",
            isPopular: true
        },
        {
            id: "online",
            badge: "Offline - Bailey road",
            title: "IBA Offline Batch",
            desc: "Full comprehensive offline preparation at our physical center with face-to-face mentorship and real-time exam simulations.",
            icon: Building2,
            location: {
                text: "Siddheswari Road, Bailey Road",
                href: "https://maps.app.goo.gl/aoFZ4eWXtpVx1RzEA?g_st=ac"
            },
            schedule: {
                days: "Sunday, Tuesday, Thursday",
                time: "4:00 - 6:00 pm"
            },
            features: [
               "24+ Interactive Physical Lectures",
                "Weekly Specialized Topic Tests",
                "15+ Realistic Full Mock Exams",
                "Direct 1-on-1 Doubt Solving"
            ],
            price: "BDT 18,000",
            period: "/ full program",
            borderClass: "border-white/3 hover:border-white/10",
            bgClass: "bg-[#121017]",
            badgeStyle: "bg-white/5 border-white/10 text-white/80",
            iconStyle: "bg-white/5 text-white/80 border-white/10",
            buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10"
        }
    ];

    // --- Testimonials Data ---
    const reviews = [
        {
            name: "Sakib Al Hasan",
            meta: "IBA 48th Batch — Selected ✓",
            text: '"MathMagician’s mock tests are identical in feel to the real IBA paper. The personal counselling sessions helped me fix my timing issues. I literally couldn’t have made it without this."',
        },
        {
            name: "Nusrat Jahan",
            meta: "IBA 47th Batch — Selected ✓",
            text: '"I was weak in Math but the structured approach here changed everything. Short-cut techniques, pattern recognition drills — I scored 90%+ in quantitative. Absolutely worth every taka."',
        },
        {
            name: "Rafiul Islam",
            meta: "IBA 49th Batch — Selected ✓",
            text: '"The community alone is worth enrolling for. Everyone is super serious and motivated. The live classes are engaging, and the instructor genuinely cares about each student\'s progress."',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 35 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
        }
    };

    const handleEnroll = (planId) => {
        setSelectedPlanId(planId);

        if (!getStoredToken()) {
            savePendingPaymentPlan(planId);
            router.push("/signup");
            return;
        }

        router.push(`/payment/details?plan=${encodeURIComponent(planId)}`);
    };

    return (
        // 🪄 This unified root section binds both layers into one solid continuous background sheet
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 BALANCED LAYER LIGHT FIELDS */}
            <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[65vw] h-[65vw] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[50%] -translate-x-1/2 w-[60vw] h-[60vw] bg-indigo-950/10 rounded-full blur-[150px] pointer-events-none" />

            {/* =========================================================================
                                     SECTION 1: PROGRAMS DECK
               ========================================================================= */}
            <div className="container mx-auto max-w-6xl relative z-10 mb-32">

                {/* Programs Header Block */}
                <div className="w-full flex flex-col items-center text-center mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#DFB15B]/5 border border-[#DFB15B]/15 text-[10px] tracking-widest text-[#DFB15B] uppercase font-bold mb-4">
                        Programs
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white mb-4">
                        Choose Your Battlefield
                    </h2>
                    <p className="text-[#6B667B] text-xs md:text-sm font-medium">
                        Tailored program tracks engineered explicitly to convert preparation into admission results.
                    </p>
                </div>

                {/* Programs Matrix Grid */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1 }}
                >
                    {cardsData.map((card, index) => {
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -6 }}
                                className={`${card.bgClass} ${card.borderClass} rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]`}
                            >
                                {/* Active Floating Sparks System for Highlighted Card */}
                                {card.isPopular && hasMounted && (
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0 opacity-40">
                                        {popularSparks.map((spark) => (
                                            <motion.span
                                                key={spark.id}
                                                className="absolute font-sans text-[#DFB15B]/40"
                                                style={{ left: spark.left, bottom: spark.bottom, fontSize: spark.size }}
                                                animate={{
                                                    x: spark.driftX,
                                                    y: spark.driftY,
                                                    opacity: [spark.opacity, spark.opacity * 2, spark.opacity, 0],
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

                                <div className="relative z-10">
                                    {/* Top Metadata Headers */}
                                    <div className="w-full flex items-center justify-between gap-4 mb-6">
                                        <div className={`px-2.5 py-1 rounded-md border text-[9px] font-bold tracking-wider uppercase ${card.badgeStyle}`}>
                                            {card.badge}
                                        </div>
                                    </div>

                                    {/* Title Header Structure */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.iconStyle}`}>
                                            <card.icon className="w-4 h-4 stroke-[1.8]" />
                                        </div>
                                        <h3 className="font-serif text-xl font-semibold text-white tracking-wide">
                                            {card.title}
                                        </h3>
                                    </div>

                                    <p className="text-[#6B667B] text-xs leading-relaxed font-medium mb-6">
                                        {card.desc}
                                    </p>

                                    {/* Core Features Checklists */}
                                    <ul className="flex flex-col gap-3 border-t border-white/3 pt-6 mb-8">
                                        {card.features.map((feat, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-2.5 text-xs font-semibold text-[#8E8A9F]">
                                                <Plus className="w-3.5 h-3.5 text-[#DFB15B] shrink-0 mt-0.5 opacity-70" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {card.location ? (
                                        <a
                                            href={card.location.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mb-3 flex items-center gap-3 rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/8 px-4 py-3 text-left transition hover:border-[#DFB15B]/45 hover:bg-[#DFB15B]/12"
                                        >
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#DFB15B] text-black shadow-[0_0_22px_rgba(223,177,91,0.22)]">
                                                <MapPin className="h-4 w-4 fill-black/10 stroke-[2.4]" />
                                            </span>
                                            <span className="min-w-0">
                                                {/* <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#DFB15B]">
                                                    Offline Center
                                                </span> */}
                                                <span className="mt-1 block text-xs font-bold leading-5 text-white">
                                                    {card.location.text}
                                                </span>
                                            </span>
                                        </a>
                                    ) : null}

                                    {card.schedule ? (
                                        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-left">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DFB15B]/25 bg-[#121017] text-[#DFB15B]">
                                                <Clock3 className="h-4 w-4 stroke-[2.4]" />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#DFB15B]">
                                                    Class Time
                                                </span>
                                                <span className="mt-1 block text-xs font-bold leading-5 text-white">
                                                    {card.schedule.days}
                                                </span>
                                                <span className="mt-0.5 block text-xs font-semibold leading-5 text-[#8E8A9F]">
                                                    {card.schedule.time}
                                                </span>
                                            </span>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Pricing Framework Footers */}
                                <div className="mt-auto pt-4 relative z-10">
                                    <div className="flex items-baseline gap-1.5 mb-6">
                                        <span className="font-serif text-3xl font-bold text-white tracking-tight">
                                            {card.price}
                                        </span>
                                        <span className="text-[11px] font-medium text-[#6B667B]">
                                            {card.period}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleEnroll(card.id)}
                                        disabled={selectedPlanId === card.id}
                                        className={`w-full py-3.5 rounded-2xl text-xs tracking-wide transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 ${card.buttonStyle}`}
                                    >
                                        {selectedPlanId === card.id ? "Opening form..." : "Enroll in This Program"}
                                    </button>
                                </div>

                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* =========================================================================
                                   SECTION 2: TESTIMONIALS LAYER
               ========================================================================= */}
            <div className="container mx-auto max-w-6xl relative z-10">

                {/* Testimonials Header Block */}
                <div className="w-full flex flex-col items-center text-center mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[10px] tracking-widest text-[#A78BFA] uppercase font-bold mb-4">
                        Testimonials
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white mb-4">
                        Stories from the Magic Guild
                    </h2>
                    <p className="text-[#6B667B] text-xs md:text-sm font-medium">
                        Real reports from successful applicants who navigated the system.
                    </p>
                </div>

                {/* Review Cards Grid Deck */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                >
                    {reviews.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -6 }}
                            className="bg-[#121017] border border-white/3 hover:border-white/10 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative group hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                        >
                            <div className="flex flex-col gap-4">
                                {/* Stars Row Block */}
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, starIdx) => (
                                        <Star key={starIdx} className="w-3.5 h-3.5 fill-[#DFB15B] text-[#DFB15B]" />
                                    ))}
                                </div>

                                {/* Text Quotes Area */}
                                <p className="text-[#8E8A9F] text-xs leading-relaxed font-medium italic">
                                    {item.text}
                                </p>
                            </div>

                            {/* User Profile Footer row */}
                            <div className="mt-8 pt-5 border-t border-white/3 flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#16131C] border border-white/8 relative shrink-0">
                                    <Image
                                        src="https://plus.unsplash.com/premium_photo-1661942126259-fb08e7cce1e2"
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover grayscale brightness-[0.9] contrast-[1.05] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                    />
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <span className="text-white text-xs font-semibold tracking-wide truncate">
                                        {item.name}
                                    </span>
                                    <span className="text-[#DFB15B] text-[10px] font-bold tracking-wide mt-0.5 truncate">
                                        {item.meta}
                                    </span>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </motion.div>
            </div>

        </section>
    );
}
