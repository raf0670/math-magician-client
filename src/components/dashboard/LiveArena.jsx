"use client";
import { motion } from "framer-motion";
import { Video, ExternalLink, Calendar, HelpCircle, FolderGit2, ArrowUpRight, CheckCircle } from "lucide-react";

export default function LiveArena() {
    // Mocking active classroom session state
    const activeClass = {
        title: "Quantitative Geometry & Speed Shortcuts",
        module: "Quant Module 08",
        instructor: "Zayan Rahman",
        institute: "IBA, DU Graduate",
        zoomLink: "https://zoom.us/mock-link-your-id", // Replace with real routing link or dynamic API pointer later
        agenda: [
            "Advanced Triangle & Polygon Theorems",
            "Cracking 45-Second Speed Traps",
            "Live Practice: 12 Past-Year GMAT/IBA Problems"
        ]
    };

    // Google Drive Directory target anchors
    const driveResources = [
        { title: "Quant Lecture Slides (PDF)", size: "4.2 MB", category: "Math" },
        { title: "Geometry Problem Sheet #08", size: "1.8 MB", category: "Practice" },
        { title: "Formula Cheat Sheet Matrix", size: "940 KB", category: "Reference" }
    ];

    const handleJoinZoom = () => {
        window.open(activeClass.zoomLink, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full select-none items-start">

            {/* =========================================================================
                          LEFT PANEL: LIVE LECTURE HUB & ZOOM PORTAL (8 COLS)
               ========================================================================= */}
            <div className="lg:col-span-8 flex flex-col gap-6">

                {/* Primary Broadcast Card */}
                <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-[#E6C687]/5 rounded-full blur-[60px] pointer-events-none" />

                    {/* Live Badge Meta */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Class Arena Active</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#6B667B] flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {activeClass.module}
                        </span>
                    </div>

                    {/* Topic Headings */}
                    <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-white mb-2 leading-tight">
                        {activeClass.title}
                    </h1>

                    <p className="text-[#8E8A9F] text-xs font-medium mb-6">
                        Led by <strong className="text-white">{activeClass.instructor}</strong> ({activeClass.institute})
                    </p>

                    {/* High-Tactile External Zoom Launch Trigger */}
                    <motion.button
                        onClick={handleJoinZoom}
                        whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(212,175,55,0.12)" }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-xs font-bold text-black uppercase tracking-wider shadow-lg transition-all duration-300"
                    >
                        <Video className="w-4 h-4 text-black stroke-[2.2]" />
                        <span>Launch Zoom Lecture Client</span>
                        <ExternalLink className="w-3.5 h-3.5 text-black stroke-[2.2]" />
                    </motion.button>
                </div>

                {/* Agenda Syllabus Checklist Card */}
                <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 shadow-md">
                    <h3 className="text-xs font-bold uppercase text-[#8E8A9F] tracking-wider mb-4">
                        Today&apos;s Interactive Agenda
                    </h3>
                    <div className="flex flex-col gap-3">
                        {activeClass.agenda.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-[#1A1722]/30 border border-white/2">
                                <CheckCircle className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
                                <span className="text-xs font-medium text-[#8E8A9F] leading-normal">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* =========================================================================
                          RIGHT PANEL: VAULT RESOURCES DRIVE SYNC (4 COLS)
               ========================================================================= */}
            <div className="lg:col-span-4 flex flex-col gap-6">

                <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.25)]">
                    <div className="flex flex-col gap-1 mb-6 border-b border-white/3 pb-4">
                        <h2 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
                            <FolderGit2 className="w-4 h-4 text-[#DFB15B]" /> Companion Materials
                        </h2>
                        <p className="text-[10px] font-medium text-[#6B667B]">
                            Live matching documents synchronized from Google Drive.
                        </p>
                    </div>

                    {/* Resources Stack Loop */}
                    <div className="flex flex-col gap-3">
                        {driveResources.map((file, index) => (
                            <div
                                key={index}
                                className="p-3.5 rounded-xl bg-[#1A1722]/50 border border-white/3 hover:border-white/10 transition-colors duration-200 flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex flex-col items-start text-left min-w-0 pr-2">
                                    <span className="text-xs font-semibold text-white tracking-wide truncate w-full group-hover:text-[#DFB15B] transition-colors duration-200">
                                        {file.title}
                                    </span>
                                    <span className="text-[10px] font-bold tracking-wide mt-1 text-[#6B667B] uppercase">
                                        {file.category} • {file.size}
                                    </span>
                                </div>
                                <div className="w-7 h-7 rounded-lg bg-white/2 border border-white/5 flex items-center justify-center shrink-0 text-[#8E8A9F] group-hover:text-white transition-colors duration-200">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Scratchpad Question Notification Hint */}
                    <div className="mt-6 p-4 rounded-2xl bg-[#7C3AED]/5 border border-[#7C3AED]/10 flex gap-3">
                        <HelpCircle className="w-4 h-4 text-[#A78BFA] shrink-0 mt-0.5" />
                        <div className="flex flex-col text-left">
                            <span className="text-[11px] font-bold text-white tracking-wide">Stuck on an equation?</span>
                            <p className="text-[10px] text-[#8E8A9F] leading-relaxed mt-0.5 font-medium">
                                Keep your Zoom window running, copy complex formulas down, and check them against the archived solution decks loaded inside your profile folder.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}