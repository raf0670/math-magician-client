"use client";
import { motion } from "framer-motion";
import { Headphones, MessageSquare, Users } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Community() {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 35 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
        }
    };

    return (
        // 🪄 Strict background matching anchor applied to section root element wrapper
        <section className="w-full bg-[#0D0B14] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden select-none">

            {/* 🌌 CONSTRAINED LIGHT FIELD — We position this strictly high up to ensure no color bleeds into the bottom edge */}
            <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[55vw] h-[55vw] bg-[#7C3AED]/5 rounded-full blur-[130px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">

                {/* Badge Header Area */}
                <div className="w-full flex flex-col items-center text-center mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[10px] tracking-widest text-[#A78BFA] uppercase font-bold mb-4">
                        Community
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-wide text-white mb-4">
                        Join the School
                    </h2>
                    <p className="text-[#6B667B] text-xs md:text-sm font-medium">
                        The most supportive IBA prep community in Bangladesh. Free to join.
                    </p>
                </div>

                {/* Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                >
                    {/* FB Community Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ y: -6 }}
                        className="bg-[#121017] border border-white/3 hover:border-white/10 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative group hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                                <Users className="w-5 h-5 stroke-[1.8]" />
                            </div>
                            <h3 className="font-serif text-xl font-semibold text-white tracking-wide mb-3">
                                FB Community
                            </h3>
                            <p className="text-[#6B667B] group-hover:text-[#8E8A9F] text-xs leading-relaxed font-medium transition-colors duration-300">
                                Our main Facebook community for announcements, resources, and peer support.
                            </p>
                        </div>
                        <div className="mt-8 pt-5 border-t border-white/3 flex items-center justify-between gap-4">
                            <span className="text-[11px] font-bold tracking-wide text-blue-400">
                                8,400+ members
                            </span>
                            <a href="#" className="px-4 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-95 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20">
                                Join Free
                            </a>
                        </div>
                    </motion.div>

                    {/* FB Group Chat Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ y: -6 }}
                        className="bg-[#121017] border border-[#DFB15B]/25 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative group shadow-[0_4px_30px_rgba(213,175,55,0.03)] hover:border-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#DFB15B]/10 text-[#DFB15B] border border-[#DFB15B]/20 mb-6">
                                <MessageSquare className="w-5 h-5 stroke-[1.8]" />
                            </div>
                            <h3 className="font-serif text-xl font-semibold text-white tracking-wide mb-3">
                                FB Group Chat
                            </h3>
                            <p className="text-[#6B667B] group-hover:text-[#8E8A9F] text-xs leading-relaxed font-medium transition-colors duration-300">
                                The daily discussion group. Ask doubts, share practice sets, help each other — 24/7.
                            </p>
                        </div>
                        <div className="mt-8 pt-5 border-t border-white/3 flex items-center justify-between gap-4">
                            <span className="text-[11px] font-bold tracking-wide text-[#DFB15B]">
                                3,200+ active
                            </span>
                            <a href="#" className="px-4 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-95 bg-[#DFB15B]/10 hover:bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/20">
                                Join Free
                            </a>
                        </div>
                    </motion.div>

                    {/* Discord Server Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ y: -6 }}
                        className="bg-[#121017] border border-white/3 hover:border-white/10 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative group hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
                                <Headphones className="w-5 h-5 stroke-[1.8]" />
                            </div>
                            <h3 className="font-serif text-xl font-semibold text-white tracking-wide mb-3">
                                Discord Server
                            </h3>
                            <p className="text-[#6B667B] group-hover:text-[#8E8A9F] text-xs leading-relaxed font-medium transition-colors duration-300">
                                Our organised server with dedicated channels for each subject, voice study rooms, and exam countdowns.
                            </p>
                        </div>
                        <div className="mt-8 pt-5 border-t border-white/3 flex items-center justify-between gap-4">
                            <span className="text-[11px] font-bold tracking-wide text-indigo-400">
                                1,500+ members
                            </span>
                            <a href="#" className="px-4 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-95 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                                Join Free
                            </a>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer Link Pills */}
                <motion.div
                    className="w-full flex flex-wrap justify-center gap-4 pt-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121017] border border-white/3 hover:border-white/10 text-xs font-semibold text-[#8E8A9F] hover:text-white shadow-md transition-all duration-200 hover:scale-[1.03]">
                        <FaFacebook className="w-3.5 h-3.5 text-[#6B667B] group-hover:text-white" />
                        <span>Facebook Page</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121017] border border-white/3 hover:border-white/10 text-xs font-semibold text-[#8E8A9F] hover:text-white shadow-md transition-all duration-200 hover:scale-[1.03]">
                        <FaYoutube className="w-3.5 h-3.5 text-[#6B667B] group-hover:text-white" />
                        <span>YouTube</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121017] border border-white/3 hover:border-white/10 text-xs font-semibold text-[#8E8A9F] hover:text-white shadow-md transition-all duration-200 hover:scale-[1.03]">
                        <FaInstagram className="w-3.5 h-3.5 text-[#6B667B] group-hover:text-white" />
                        <span>Instagram</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121017] border border-white/3 hover:border-white/10 text-xs font-semibold text-[#8E8A9F] hover:text-white shadow-md transition-all duration-200 hover:scale-[1.03]">
                        <FaLinkedin className="w-3.5 h-3.5 text-[#6B667B] group-hover:text-white" />
                        <span>LinkedIn</span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}