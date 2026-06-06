"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {

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
            transition: { staggerChildren: 0.15 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
        },
    };

    return (
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 CANVAS BACKGROUND NEBULA MASKS */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[45vw] h-[45vw] bg-[#7C3AED]/5 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[35vw] h-[35vw] bg-indigo-950/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">

                {/* 🏷️ SECTION HEADLINE BADGE GRID */}
                <div className="w-full flex flex-col items-center text-center mb-20">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#DFB15B]/5 border border-[#DFB15B]/15 text-[10px] tracking-widest text-[#DFB15B] uppercase font-bold mb-4">
                        Student Stories
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white mb-4">
                        Voices from IBA&apos;s Newest Magicians
                    </h2>
                    <p className="text-[#6B667B] text-xs md:text-sm font-medium">
                        Real students. Real results. Real IBA selection letters.
                    </p>
                </div>

                {/* 🗃️ TESTIMONIAL GRID CONTAINER */}
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
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            className="bg-[#121017] border border-white/3 hover:border-[#DFB15B]/25 rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 relative shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(212,175,55,0.08)] group overflow-hidden"
                        >

                            {/* ⚡ HOVER MAGICAL LENS FLARE SHIMMER */}
                            <div className="absolute inset-0 w-[200%] h-full bg-linear-to-r from-transparent via-white/1.5 to-transparent skew-x-[-35deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out pointer-events-none" />

                            {/* Top half: Rating Stars and Bio Paragraph Block */}
                            <div>
                                {/* 5-Star Rating Array */}
                                <div className="flex items-center gap-1 mb-6">
                                    {Array.from({ length: 5 }).map((_, sIdx) => (
                                        <Star
                                            key={sIdx}
                                            className="w-3.5 h-3.5 fill-[#DFB15B] text-[#DFB15B] filter drop-shadow-[0_0_4px_rgba(223,177,91,0.4)]"
                                        />
                                    ))}
                                </div>

                                <p className="text-[#8E8A9F] group-hover:text-white text-xs md:text-[13px] leading-relaxed font-medium transition-colors duration-300">
                                    {item.text}
                                </p>
                            </div>

                            {/* Bottom half: Horizontal Split Profiling */}
                            <div className="mt-8 pt-6 border-t border-white/3 flex items-center gap-4">
                                {/* User Requested Micro Image Shield */}
                                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#16131C] border border-white/8 relative shrink-0">
                                    <Image
                                        src={"https://plus.unsplash.com/premium_photo-1661942126259-fb08e7cce1e2"}
                                        alt={item.name}
                                        width={1000}
                                        height={1000}
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