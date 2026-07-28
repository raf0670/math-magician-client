/* eslint-disable react-hooks/purity */
"use client";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { BookmarkCheck, ChevronLeft, ChevronRight, Clock3, MapPin, Plus, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getStoredToken, savePendingPaymentPlan, savePendingProgramAction } from "@/lib/api";

const REVIEW_CARD_GAP = 32;
const PROGRAM_ACCENT_MARKS = [
    { className: "left-[12%] top-[18%]", size: "h-3 w-3", delay: 0 },
    { className: "right-[14%] top-[34%]", size: "h-3.5 w-3.5", delay: 0.12 },
    { className: "right-[24%] bottom-[30%]", size: "h-2.5 w-2.5", delay: 0.24 },
];

export default function ProgramsAndTestimonials() {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [selectedProgramAction, setSelectedProgramAction] = useState("");
    const [activeReviewIndex, setActiveReviewIndex] = useState(0);
    const [visibleReviewCount, setVisibleReviewCount] = useState(3);
    const [reviewSlideOffset, setReviewSlideOffset] = useState(0);
    const [isReviewPaused, setIsReviewPaused] = useState(false);
    const [expandedPortraitIndex, setExpandedPortraitIndex] = useState(null);
    const reviewViewportRef = useRef(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMounted(true);
    }, []);

    const testimonialSparks = useMemo(() => (
        Array.from({ length: 42 }).map((_, idx) => ({
            id: idx,
            left: `${Math.random() * 96 + 2}%`,
            top: `${Math.random() * 78 + 12}%`,
            size: Math.random() * 22 + 18,
            opacity: Math.random() * 0.36 + 0.3,
            driftX: [0, Math.random() * 58 - 29, Math.random() * -58 + 29, 0],
            driftY: [0, Math.random() * -48 - 22, Math.random() * 30 - 15, 0],
            rotate: Math.random() * 140 - 70,
            speed: Math.random() * 3.8 + 3.6,
            delay: Math.random() * -5,
        }))
    ), []);

    // --- Programs Data ---
    const cardsData = [
        {
            id: "offline",
            badge: "Offline - Farmgate",
            title: "Gryffindor",
            desc: "An offline batch taken at our Farmgate center, built for face-to-face mentorship and real-time exam simulations.",
            imageSrc: "/gryffindor.jpeg",
            imageAlt: "Gryffindor house crest",
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
            borderClass: "border-[#F97316]/18 hover:border-[#F97316]/35",
            bgClass: "bg-[#121017]",
            badgeStyle: "bg-white/5 border-white/10 text-white/80",
            iconStyle: "bg-white/5 text-white/80 border-[#F97316]/25",
            accentGlowClass: "bg-[#F97316]/16",
            accentLineClass: "from-transparent via-[#F97316]/45 to-transparent",
            sparkleClass: "text-[#F97316]/45",
            crestFrameClass: "shadow-[0_0_34px_rgba(249,115,22,0.18)]",
            buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10"
        },
        {
            id: "premium",
            badge: "Online Batch",
            title: "Ravenclaw",
            desc: "An online batch taken live from your study room, built for students who want the full program without traveling to a physical center.",
            imageSrc: "/ravenclaw.jpeg",
            imageAlt: "Ravenclaw house crest",
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
            borderClass: "border-[#60A5FA]/18 hover:border-[#60A5FA]/35 shadow-[0_4px_30px_rgba(96,165,250,0.04)]",
            bgClass: "bg-[#121017]",
            badgeStyle: "bg-[#60A5FA]/10 border-[#60A5FA]/20 text-[#BFDBFE]",
            iconStyle: "bg-[#60A5FA]/10 text-[#BFDBFE] border-[#60A5FA]/25",
            accentGlowClass: "bg-[#60A5FA]/16",
            accentLineClass: "from-transparent via-[#60A5FA]/45 to-transparent",
            sparkleClass: "text-[#93C5FD]/45",
            crestFrameClass: "shadow-[0_0_34px_rgba(96,165,250,0.18)]",
            buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10"
        },
        {
            id: "online",
            badge: "Offline - Bailey Road",
            title: "Hufflepuff",
            desc: "An offline batch taken at our Bailey Road center, built for face-to-face mentorship and real-time exam simulations.",
            imageSrc: "/hufflepuff.jpeg",
            imageAlt: "Hufflepuff house crest",
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
            borderClass: "border-[#FACC15]/18 hover:border-[#FACC15]/35",
            bgClass: "bg-[#121017]",
            badgeStyle: "bg-white/5 border-white/10 text-white/80",
            iconStyle: "bg-white/5 text-white/80 border-[#FACC15]/25",
            accentGlowClass: "bg-[#FACC15]/14",
            accentLineClass: "from-transparent via-[#FACC15]/40 to-transparent",
            sparkleClass: "text-[#FACC15]/45",
            crestFrameClass: "shadow-[0_0_34px_rgba(250,204,21,0.16)]",
            buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10"
        }
    ];

    // --- Testimonials Data ---
    const reviews = [
        {
            name: "Sumaiyl Kader",
            image: "https://i.ibb.co.com/Q4Y1bmW/one.jpg",
            meta: "IBA 34th Batch",
            text: '"Mehrab Bhai was a pivotal figure in one of the most challenging stages of my life. His constant guidance allowed me to find my weaknesses and fix them. He was an amazing teacher. His advices were very helpful for me in mocks and were crucial in the main exam. Without Mehrab Bhai, I would never have been able to get where I am today. For this, I will always be grateful to him."',
        },
        {
            name: "Ekramul Haque Jahin",
            image: "https://i.ibb.co.com/NcyJGJ4/two.jpg",
            meta: "IBA 34th Batch",
            text: '"I knew IBA maths prep was all about calculation hacks but i knew 0 of them till the last week of my admission prep. After watching Mehrab bhai\'s maths marathon class, i got to know the only math hacks i know to this day and i still use those tricks even after getting into IBA. Besides this, bhai is genuinely someone to look up to because of his work ethic and the way he juggles so many activities efficiently. Definitely one of the top IBA seniors."',
        },
        {
            name: "Romaisa Majid",
            image: "https://i.ibb.co.com/4R9fxYPs/Whats-App-Image-2026-07-21-at-15-26-18.jpg",
            meta: "IBA 34th Batch",
            text: '"I think what makes MathMagician different from other platforms is the dedication Bhaiya put in throughout the entire admission season. His consistency, effort, and genuine commitment to helping us succeed made a huge difference. Besides, he covered every topic thoroughly, starting from the basics and gradually moving to the advanced level.Furthermore,the community was one of the best parts of the batch. Everyone was supportive, and motivating. Being surrounded by people working toward the same goal made the journey much less stressful and kept me motivated throughout the admission season"',
        },
        {
            name: "Aditya Ariyan",
            image: "https://i.ibb.co.com/DPPrV4TC/four.jpg",
            meta: "IBA 34th Batch",
            text: '"I primarily joined Bhaiya’s batch to get better at solving hard math problems. However, his course offered much more than I expected; along with the advanced math playlist, I also got access to basic math modules and regular mock tests. Bhaiya was always active and supportive throughout our admission preparation phase. He constantly cleared our doubts, and it felt great to have someone reliable to count on."',
        },
        {
            name: "Radh Chowdhury",
            image: "https://i.ibb.co.com/gZgVR57y/five.jpg",
            meta: "IBA 34th Batch",
            text: '"It was just a few days before the IBA exam, and I knew that I was struggling a bit in Math. I signed up quickly and haven’t regretted the decision since.  The complete revision of all the math topics was all I needed and the classes were really interactive too. The classes were divided into timings convenient for us to ensure the proper attention. The topics I struggled with were resolved fully by vai’s classes and feedback. The worksheets were the perfect supplement for the last-minute revision I did the night before the exam. My confidence level was better than ever and the entire course played this huge role in acing the exam. I would definitely recommend every aspirant to sign up for Mehrab vai’s course anyday."',
        },
        {
            name: "Tahmid Taseen",
            image: "https://i.ibb.co.com/842ZHf9w/six.jpg",
            meta: "IBA 34th Batch",
            text: '"He is obviously one of the most well known IBA tutors out there right now. His classes are full of examples that actually make concepts stick. What really got me though were his exam questions, sitting for those under pressure taught me more about time management and strategy than I expected. That really helped me out on the main exam day."',
        },
        {
            name: "Tasin Ahasan",
            image: "https://i.ibb.co.com/fYNP2kYc/Whats-App-Image-2026-07-21-at-15-27-04.jpg",
            meta: "IBA 34th Batch",
            text: '"Mehrab bhai was the guardian angel Allah sent for me. I hated math, but his concise classes made me fall in love with quantitative math, at least during the IBA admission journey, and I\'m genuinely not exaggerating. Most importantly, his constant support, especially his words after my crash-outs in mock exams, was enough to keep me on the right track."',
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

    const maxReviewIndex = Math.max(reviews.length - visibleReviewCount, 0);

    const updateReviewLayout = useCallback(() => {
        const nextVisibleCount = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        const viewportWidth = reviewViewportRef.current?.clientWidth || 0;
        const totalGapWidth = REVIEW_CARD_GAP * (nextVisibleCount - 1);
        const cardWidth = viewportWidth > 0 ? (viewportWidth - totalGapWidth) / nextVisibleCount : 0;
        const nextMaxReviewIndex = Math.max(reviews.length - nextVisibleCount, 0);

        setVisibleReviewCount(nextVisibleCount);
        setReviewSlideOffset(cardWidth + REVIEW_CARD_GAP);
        setActiveReviewIndex((currentIndex) => Math.min(currentIndex, nextMaxReviewIndex));
    }, [reviews.length]);

    useEffect(() => {
        const animationFrame = window.requestAnimationFrame(updateReviewLayout);
        window.addEventListener("resize", updateReviewLayout);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", updateReviewLayout);
        };
    }, [updateReviewLayout]);

    useEffect(() => {
        if (isReviewPaused || maxReviewIndex === 0) return undefined;

        const slideTimer = window.setInterval(() => {
            setActiveReviewIndex((currentIndex) => (
                currentIndex >= maxReviewIndex ? 0 : currentIndex + 1
            ));
        }, 4500);

        return () => window.clearInterval(slideTimer);
    }, [isReviewPaused, maxReviewIndex]);

    const goToPreviousReview = () => {
        setActiveReviewIndex((currentIndex) => (
            currentIndex === 0 ? maxReviewIndex : currentIndex - 1
        ));
    };

    const goToNextReview = () => {
        setActiveReviewIndex((currentIndex) => (
            currentIndex >= maxReviewIndex ? 0 : currentIndex + 1
        ));
    };

    const handleProgramAction = (planId, action = "enroll") => {
        setSelectedPlanId(planId);
        setSelectedProgramAction(action);

        if (!getStoredToken()) {
            savePendingPaymentPlan(planId);
            savePendingProgramAction(action);
            router.push("/signup");
            return;
        }

        const mode = action === "book" ? "&mode=book" : "";
        router.push(`/payment/details?plan=${encodeURIComponent(planId)}${mode}`);
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
                        Choose Your Potion
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
                                <div className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full ${card.accentGlowClass} blur-3xl opacity-[0.55] transition-opacity duration-500 group-hover:opacity-90`} />
                                <div className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r ${card.accentLineClass} opacity-70`} />
                                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/[0.055] via-transparent to-white/[0.025] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="pointer-events-none absolute bottom-6 right-6 h-24 w-24 rounded-full border border-white/5 opacity-[0.08] transition group-hover:scale-110" />
                                {hasMounted && PROGRAM_ACCENT_MARKS.map((mark) => (
                                    <motion.span
                                        key={mark.className}
                                        className={`pointer-events-none absolute ${mark.className} ${card.sparkleClass} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                                        animate={{ scale: [0.92, 1.15, 0.92], rotate: [0, 12, 0] }}
                                        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: mark.delay + index * 0.08 }}
                                    >
                                        <Sparkles className={mark.size} strokeWidth={1.7} />
                                    </motion.span>
                                ))}

                                <div className="relative z-10">
                                    {/* Top Metadata Headers */}
                                    <div className="w-full flex items-center justify-between gap-4 mb-6">
                                        <div className={`px-2.5 py-1 rounded-md border text-[9px] font-bold tracking-wider uppercase ${card.badgeStyle}`}>
                                            {card.badge}
                                        </div>
                                    </div>

                                    {/* Title Header Structure */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden border ${card.iconStyle} ${card.crestFrameClass}`}>
                                            <div className={`absolute inset-[-10px] ${card.accentGlowClass} blur-xl opacity-[0.55] transition-opacity group-hover:opacity-95`} />
                                            <Image
                                                src={card.imageSrc}
                                                alt={card.imageAlt}
                                                width={48}
                                                height={48}
                                                className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
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

                                    <div className="grid gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleProgramAction(card.id, "enroll")}
                                            disabled={selectedPlanId === card.id}
                                            className={`w-full py-3.5 rounded-2xl text-xs tracking-wide transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 ${card.buttonStyle}`}
                                        >
                                            {selectedPlanId === card.id && selectedProgramAction === "enroll" ? "Opening form..." : "Enroll in This Program"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleProgramAction(card.id, "book")}
                                            disabled={selectedPlanId === card.id}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#DFB15B]/25 bg-[#DFB15B]/8 px-4 py-3.5 text-xs font-bold tracking-wide text-[#DFB15B] transition-all duration-300 hover:border-[#DFB15B]/45 hover:bg-[#DFB15B]/12 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                                        >
                                            <BookmarkCheck className="h-4 w-4" />
                                            {selectedPlanId === card.id && selectedProgramAction === "book" ? "Opening booking..." : "Book Seat"}
                                        </button>
                                    </div>
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
                {hasMounted && (
                    <div className="pointer-events-none absolute inset-x-[-8%] top-10 bottom-0 z-0 overflow-hidden">
                        {testimonialSparks.map((spark) => (
                            <motion.span
                                key={spark.id}
                                className="absolute text-[#DFB15B]/70 drop-shadow-[0_0_18px_rgba(223,177,91,0.58)]"
                                style={{
                                    left: spark.left,
                                    top: spark.top,
                                    opacity: spark.opacity,
                                }}
                                animate={{
                                    x: spark.driftX,
                                    y: spark.driftY,
                                    rotate: [spark.rotate, spark.rotate + 90, spark.rotate],
                                    scale: [0.82, 1.45, 0.95],
                                    opacity: [0.08, spark.opacity, spark.opacity * 0.7, 0.08],
                                }}
                                transition={{
                                    duration: spark.speed,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: spark.delay,
                                }}
                            >
                                <Sparkles style={{ width: spark.size, height: spark.size }} strokeWidth={1.7} />
                            </motion.span>
                        ))}

                        <motion.div
                            className="absolute left-[-22%] top-[24%] h-0.5 w-[54%] bg-linear-to-r from-transparent via-[#DFB15B]/55 to-transparent blur-[1px]"
                            animate={{ x: ["0%", "300%"], opacity: [0, 0.9, 0] }}
                            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute right-[-22%] bottom-[30%] h-0.5 w-[50%] bg-linear-to-r from-transparent via-[#A78BFA]/50 to-transparent blur-[1px]"
                            animate={{ x: ["0%", "-315%"], opacity: [0, 0.82, 0] }}
                            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                        />
                        <motion.div
                            className="absolute left-[-20%] bottom-[14%] h-px w-[46%] bg-linear-to-r from-transparent via-white/35 to-transparent blur-[1px]"
                            animate={{ x: ["0%", "320%"], opacity: [0, 0.72, 0] }}
                            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
                        />
                    </div>
                )}

                {/* Testimonials Header Block */}
                <div className="w-full flex flex-col items-center text-center mb-16 relative z-10">
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

                {/* Review Cards Marquee Deck */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    className="relative z-10"
                    onMouseEnter={() => setIsReviewPaused(true)}
                    onMouseLeave={() => setIsReviewPaused(false)}
                >
                    <div ref={reviewViewportRef} className="overflow-hidden">
                        <motion.div
                            className="flex items-stretch"
                            style={{
                                gap: REVIEW_CARD_GAP,
                            }}
                            animate={{ x: -activeReviewIndex * reviewSlideOffset }}
                            transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                        >
                            {reviews.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -6 }}
                                    className="min-w-0 shrink-0 bg-[#121017] border border-white/3 hover:border-white/10 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative group hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                                    style={{
                                        width: `calc((100% - ${REVIEW_CARD_GAP * (visibleReviewCount - 1)}px) / ${visibleReviewCount})`,
                                    }}
                                >
                                    <div className="flex flex-col gap-4">
                                        {/* Stars Row Block */}
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, starIdx) => (
                                                <Star key={starIdx} className="w-3.5 h-3.5 fill-[#DFB15B] text-[#DFB15B]" />
                                            ))}
                                        </div>

                                        {/* Text Quotes Area */}
                                        <p className="text-white text-xs leading-relaxed font-medium italic">
                                            {item.text}
                                        </p>
                                    </div>

                                    {/* User Profile Footer row */}
                                    <div className="mt-8 pt-5 border-t border-white/3 flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setExpandedPortraitIndex((currentIndex) => (
                                                currentIndex === index ? null : index
                                            ))}
                                            aria-label={`Enlarge ${item.name}'s photo`}
                                            className={`w-11 h-11 rounded-full overflow-hidden bg-[#16131C] border relative shrink-0 transition-all duration-500 hover:z-30 hover:scale-[2.15] hover:border-[#DFB15B]/60 hover:shadow-[0_0_34px_rgba(223,177,91,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DFB15B]/70 ${expandedPortraitIndex === index
                                                ? "z-30 scale-[2.35] border-[#DFB15B]/70 shadow-[0_0_38px_rgba(223,177,91,0.34)]"
                                                : "border-white/8"
                                                }`}
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                unoptimized
                                                className="w-full h-full object-cover brightness-[0.9] contrast-[1.05] transition-all duration-500 hover:brightness-105"
                                            />
                                        </button>

                                        <div className="flex flex-col min-w-0">
                                            <span className="text-white text-sm md:text-[15px] font-semibold tracking-wide truncate">
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

                    <div className="mt-8 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={goToPreviousReview}
                            aria-label="Previous testimonial"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/80 transition hover:border-[#DFB15B]/30 hover:bg-[#DFB15B]/10 hover:text-[#DFB15B]"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: maxReviewIndex + 1 }).map((_, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    onClick={() => setActiveReviewIndex(index)}
                                    aria-label={`Show testimonial slide ${index + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${activeReviewIndex === index
                                        ? "w-7 bg-[#DFB15B]"
                                        : "w-1.5 bg-white/20 hover:bg-white/40"
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={goToNextReview}
                            aria-label="Next testimonial"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/80 transition hover:border-[#DFB15B]/30 hover:bg-[#DFB15B]/10 hover:text-[#DFB15B]"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            </div>

        </section>
    );
}
