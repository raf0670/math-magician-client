"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
    // Track open state by matching item index index number strings
    const [openIndex, setOpenIndex] = useState(-1); // Default open first card like your design preview

    const faqItems = [
        {
            question: "What subjects does the IBA admission test cover?",
            answer: "The IBA DU test covers four main sections: Quantitative (Math), English, Analytical Ability, and a Written section. Our program covers all four comprehensively."
        },
        {
            question: "Who is eligible to apply for IBA?",
            answer: "Eligibility generally requires maintaining specific minimum GPA bars across both your SSC and HSC (or O/A Level equivalents) academic profiles. Detailed matching targets are broken down in our onboarding guidelines."
        },
        {
            question: "How long does the program run?",
            answer: "Our standard structured batch spans 3 months of comprehensive training, containing scheduled intensive live problem-solving sessions alongside real-time full-length mock diagnostic testing patterns."
        },
        {
            question: "Can I access recordings if I miss a live class?",
            answer: "Yes, absolutely. All interactive broadcast segments are saved automatically onto your student portal within a couple of hours and remain accessible for reference throughout your dynamic course tier."
        },
        {
            question: "Are the mock tests similar to the actual IBA paper?",
            answer: "Our diagnostic mock blueprints replicate the layout format, time constraints, section-weight balance matrices, and difficulty scaling found on genuine IBA distribution sheets."
        }
    ];

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 AMBIENT CANVAS DEEP LAYER RADIANT LIGHTS */}
            <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] bg-[#7C3AED]/5 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-15%] w-[50vw] h-[50vw] bg-indigo-950/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto max-w-4xl relative z-10">

                {/* 🏷️ BADGE HEADER BLOCK */}
                <div className="w-full flex flex-col items-center text-center mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#DFB15B]/5 border border-[#DFB15B]/15 text-[10px] tracking-widest text-[#DFB15B] uppercase font-bold mb-4">
                        FAQ
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white">
                        Questions from Aspiring Magicians
                    </h2>
                </div>

                {/* 🗂️ STACKED ACCORDION HOLDER */}
                <div className="flex flex-col gap-4 w-full">
                    {faqItems.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className={`bg-[#121017] rounded-2xl border transition-all duration-300 relative overflow-hidden
                  ${isOpen ? "border-[#DFB15B]/25 shadow-[0_4px_25px_rgba(213,175,55,0.03)]" : "border-white/3 hover:border-white/10"}`}
                            >
                                {/* Accordion Trigger Pane */}
                                <button
                                    onClick={() => handleToggle(index)}
                                    className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-6 text-left"
                                >
                                    <span className="text-white text-xs md:text-sm font-semibold tracking-wide transition-colors duration-200">
                                        {item.question}
                                    </span>

                                    {/* Operational Icon Wrapper Ring */}
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300
                      ${isOpen ? "bg-[#DFB15B]/10 border-[#DFB15B]/20 text-[#DFB15B]" : "bg-white/2 border-white/6 text-[#8E8A9F]"}`}
                                    >
                                        {isOpen ? (
                                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                                        ) : (
                                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                        )}
                                    </div>
                                </button>

                                {/* 🌊 FLUID SMOOTH DROP ACCORDION CANVAS */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                                transition: {
                                                    height: { duration: 0.35, ease: [0.25, 1, 0.5, 1] }, // Snappy, clean easing curve
                                                    opacity: { duration: 0.25, delay: 0.05 }
                                                }
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                                transition: {
                                                    height: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
                                                    opacity: { duration: 0.15 }
                                                }
                                            }}
                                        >
                                            {/* Inner Text Padding Body Block */}
                                            <div className="px-6 pb-6 pt-1 md:px-8 md:pb-7 text-[#8E8A9F] text-xs leading-relaxed font-medium max-w-3xl border-t border-white/2">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}