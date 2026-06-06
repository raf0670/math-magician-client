"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Diamond, Target } from "lucide-react";

export default function ThreeSteps() {
    const [activeStep, setActiveStep] = useState(0);

    // Driven continuous circuit sequence loops through steps 0 -> 1 -> 2
    useEffect(() => {
        const circuitInterval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 3);
        }, 2500); // Transitions focus node every 2.5 seconds
        return () => clearInterval(circuitInterval);
    }, []);

    const stepsData = [
        {
            num: "01",
            title: "Enroll",
            description: "Pick your preferred program — offline or online. Complete a quick registration. Your IBA journey begins.",
            icon: Sparkles,
        },
        {
            num: "02",
            title: "Practice",
            description: "Attend live classes, solve hundreds of exam-type problems, sit for mock tests, and refine your weaknesses every day.",
            icon: Diamond,
        },
        {
            num: "03",
            title: "Master",
            description: "By admission day, walk in with confidence. You'll know the patterns, the tricks, the timing — nothing will surprise you.",
            icon: Target,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" },
        },
    };

    return (
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 DEEP SPACE GLOW CHANNELS */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[25vw] bg-indigo-950/10 rounded-full blur-[130px] pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">

                {/* 🏷️ SECTION TITLE BADGE */}
                <div className="w-full flex flex-col items-center text-center mb-20">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[10px] tracking-widest text-[#A78BFA] uppercase font-bold mb-4">
                        The Path
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white">
                        You&apos;re Only Three Steps Away from IBA
                    </h2>
                </div>

                {/* ⚡ THE INTERACTIVE CIRCUIT TIMELINE TIMINGS */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }} // Refreshes and cascades clean when viewport tracks it
                >

                    {/* 💻 STRUCTURAL HORIZONTAL CONNECTING CIRCUIT BACKBONE (Hidden on small screens) */}
                    <div className="absolute top-7 left-[15%] right-[15%] h-0.5 bg-white/4 hidden md:block z-0">
                        {/* Animated Loading Laser Thread Tracking Active State Position */}
                        <motion.div
                            className="h-full bg-linear-to-r from-[#DFB15B] to-[#E6C687] shadow-[0_0_8px_#DFB15B]"
                            initial={{ width: "0%" }}
                            animate={{
                                width: activeStep === 0 ? "0%" : activeStep === 1 ? "50%" : "100%"
                            }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                    </div>

                    {/* RENDERING MAP FOR STEPS */}
                    {stepsData.map((step, index) => {
                        const isActive = activeStep === index;
                        const StepIcon = step.icon;

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex flex-col items-center text-center group relative z-10"
                            >
                                {/* 🔘 TIMELINE CORE NODE SPHERE */}
                                <div className="relative mb-6">
                                    {/* Dynamic Glowing Outer Aura Ring */}
                                    <motion.div
                                        className="absolute -inset-3 rounded-full bg-[#DFB15B]/20 blur-md pointer-events-none z-0"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            opacity: isActive ? 1 : 0,
                                            scale: isActive ? [1, 1.15, 1] : 0.8
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    {/* Interactive Button Shield */}
                                    <div
                                        className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 z-10 relative bg-[#121017] 
                      ${isActive
                                                ? "border-[#DFB15B] shadow-[0_0_15px_rgba(223,177,91,0.3)] text-[#DFB15B] scale-110"
                                                : "border-white/8 text-[#6B667B] group-hover:border-white/20"
                                            }`}
                                    >
                                        <StepIcon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110 stroke-2" : "stroke-[1.5]"}`} />
                                    </div>
                                </div>

                                {/* 📝 STEP INFRASTRUCTURE CONTENT STRINGS */}
                                <div className="flex flex-col items-center gap-2 max-w-70">
                                    <span className={`text-[10px] font-sans tracking-widest font-bold transition-colors duration-300 ${isActive ? "text-[#DFB15B]" : "text-[#4A4557]"}`}>
                                        {step.num}
                                    </span>

                                    <h3 className={`font-serif text-2xl font-medium tracking-wide transition-colors duration-300 ${isActive ? "text-white" : "text-[#8E8A9F] group-hover:text-white"}`}>
                                        {step.title}
                                    </h3>

                                    <p className="text-[#6B667B] text-xs font-medium leading-relaxed mt-2 transition-colors duration-300 group-hover:text-[#8E8A9F]">
                                        {step.description}
                                    </p>
                                </div>

                            </motion.div>
                        );
                    })}

                </motion.div>

            </div>
        </section>
    );
}