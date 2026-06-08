"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Calendar, Clock, FolderKanban, ArrowUpRight } from "lucide-react";

export default function ClassVault() {
    // Current category selector state
    const [activeTab, setActiveTab] = useState("all"); // all, quant, english, analytical

    const categories = [
        { id: "all", label: "All Archives" },
        { id: "quant", label: "Quantitative (Math)" },
        { id: "english", label: "English (Verbal)" },
        { id: "analytical", label: "Analytical Ability" },
    ];

    // Mocking historical folder schema that routes directly out to Google Drive links
    const archives = [
        {
            id: "v1",
            title: "Permutations, Combinations & Probability Matrices",
            category: "quant",
            date: "June 04, 2026",
            duration: "1h 42m",
            driveLink: "https://drive.google.com/drive/folders/mock-quant-link-1",
            status: "watched" // watched, in-progress, unwatched
        },
        {
            id: "v2",
            title: "Advanced Subject-Verb Agreement & Error Hunting",
            category: "english",
            date: "June 01, 2026",
            duration: "1h 25m",
            driveLink: "https://drive.google.com/drive/folders/mock-english-link-1",
            status: "in-progress"
        },
        {
            id: "v3",
            title: "Data Sufficiency Blueprints & Logical Deductions",
            category: "analytical",
            date: "May 28, 2026",
            duration: "1h 55m",
            driveLink: "https://drive.google.com/drive/folders/mock-analytical-link-1",
            status: "unwatched"
        },
        {
            id: "v4",
            title: "Algebraic Sequences, Series & Functions Sprint",
            category: "quant",
            date: "May 25, 2026",
            duration: "2h 02m",
            driveLink: "https://drive.google.com/drive/folders/mock-quant-link-2",
            status: "watched"
        }
    ];

    // Filter array conditionally based on active choice state
    const filteredArchives = activeTab === "all"
        ? archives
        : archives.filter(item => item.category === activeTab);

    return (
        <div className="w-full select-none mt-4">

            {/* 🎛️ FILTER TABS CONTAINER */}
            <div className="flex items-center overflow-x-auto gap-2 pb-4 border-b border-white/5 scrollbar-none mb-8">
                {categories.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="relative px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-colors duration-200 shrink-0"
                            style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeVaultTab"
                                    className="absolute inset-0 bg-[#1A1722] border border-white/5 rounded-xl z-0"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-[#DFB15B]" : "text-[#6B667B] hover:text-white"}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* 🗄️ ARCHIVE CARDS GRID */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
            >
                <AnimatePresence mode="popLayout">
                    {filteredArchives.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ y: -3 }}
                            onClick={() => window.open(item.driveLink, "_blank", "noopener,noreferrer")}
                            className="bg-[#121017] border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col justify-between items-start cursor-pointer group transition-all duration-200 shadow-md"
                        >
                            <div className="w-full">
                                {/* Main Title String */}
                                <h3 className="text-sm font-semibold text-white tracking-wide leading-snug group-hover:text-[#DFB15B] transition-colors duration-200 text-left mb-4">
                                    {item.title}
                                </h3>
                            </div>

                            {/* Card Footer Summary Strip */}
                            <div className="w-full flex items-center justify-between pt-3 border-t border-white/3 text-[11px] font-medium text-[#8E8A9F]">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-[#6B667B]" /> {item.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-[#6B667B]" /> {item.duration}
                                    </span>
                                </div>
                                <div className="text-[#6B667B] group-hover:text-white transition-colors duration-200 flex items-center gap-0.5 font-bold text-[10px] uppercase tracking-wider">
                                    <span>Stream Drive</span>
                                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

        </div>
    );
}