"use client";
import { motion } from "framer-motion";
import { Video, ClipboardCheck, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ScheduleTimeline() {
    // Array representing a typical intense preparation schedule frame
    const scheduleEvents = [
        {
            id: 1,
            time: "7:30 PM — 9:00 PM",
            title: "Geometry Blueprints & Speed Traps",
            subtitle: "Live Lecture Block • Quant Module 08",
            type: "class",
            icon: Video,
            status: "live", // live, upcoming, completed
            color: "text-[#E6C687]",
            bgIcon: "bg-[#E6C687]/10 border-[#E6C687]/20",
            actionHref: "/dashboard/classes"
        },
        {
            id: 2,
            time: "9:30 PM — 11:00 PM",
            title: "Analytical Ability Sentence Matching Sync",
            subtitle: "Interactive Problem Solving Drill",
            type: "class",
            icon: Video,
            status: "upcoming",
            color: "text-[#A78BFA]",
            bgIcon: "bg-[#7C3AED]/10 border-[#7C3AED]/20",
            actionHref: "/dashboard/classes"
        },
        {
            id: 3,
            time: "Released at 4:00 PM",
            title: "Daily Diagnostic Sprint Sheet #14",
            subtitle: "30 Questions • Advanced Verbal Logic",
            type: "test",
            icon: ClipboardCheck,
            status: "completed",
            color: "text-[#6B667B]",
            bgIcon: "bg-white/5 border-white/5",
            actionHref: "/dashboard/mock-tests"
        }
    ];

    return (
        <div className="w-full bg-[#121017] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.25)] select-none">

            {/* Component Layout Section Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/3">
                <div className="flex flex-col gap-1">
                    <h2 className="font-serif text-lg font-medium text-white tracking-wide">
                        Today&apos;s Preparation Timeline
                    </h2>
                    <p className="text-[11px] font-medium text-[#6B667B]">
                        Stay on schedule. Missing a live dashboard slot drops your streak multiplier.
                    </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/2 border border-white/5 text-[10px] font-bold text-[#8E8A9F] tracking-wide uppercase">
                    <Clock className="w-3 h-3 text-[#DFB15B]" /> Mon, June 08
                </div>
            </div>

            {/* 📈 Timeline Iterative Container Map */}
            <div className="relative flex flex-col gap-8 pl-4 sm:pl-6">

                {/* Continuous Center vertical vector alignment line */}
                <div className="absolute left-4.75 sm:left-5.75 top-3 bottom-3 w-px bg-linear-to-b from-[#DFB15B]/40 via-white/5 to-transparent" />

                {scheduleEvents.map((event, idx) => {
                    const isLive = event.status === "live";
                    const isCompleted = event.status === "completed";

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`flex gap-4 items-start relative ${isCompleted ? "opacity-50" : ""}`}
                        >

                            {/* 🎯 TIMELINE NODE EMBLEM INDICATOR */}
                            <div className="relative z-10 shrink-0">
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${event.bgIcon} ${event.color} ${isLive ? "shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-2 ring-[#DFB15B]/20" : ""}`}>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-2" />
                                    ) : (
                                        <event.icon className="w-4 h-4 stroke-[1.8]" />
                                    )}
                                </div>

                                {/* Live pulse beacon positioned at top-right edge of active icons */}
                                {isLive && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                                    </span>
                                )}
                            </div>

                            {/* 📝 TIMELINE CARD DESCRIPTION DATA BLOCK */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#1A1722]/40 border border-white/2 hover:border-white/5 p-4 rounded-2xl transition-all duration-200">

                                {/* Info fields */}
                                <div className="md:col-span-8 flex flex-col items-start text-left">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-[10px] font-bold tracking-wide uppercase ${isLive ? "text-[#DFB15B]" : "text-[#6B667B]"}`}>
                                            {event.time}
                                        </span>
                                        {isLive && (
                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-red-500/10 border border-red-500/20 text-red-400 tracking-widest animate-pulse">
                                                Active Now
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-semibold text-white tracking-wide leading-tight group-hover:text-[#DFB15B] transition-colors duration-200">
                                        {event.title}
                                    </h3>
                                    <p className="text-[#8E8A9F] text-xs font-medium mt-1">
                                        {event.subtitle}
                                    </p>
                                </div>

                                {/* Link Context CTA Buttons */}
                                <div className="md:col-span-4 flex justify-start md:justify-end w-full">
                                    {!isCompleted ? (
                                        <Link
                                            href={event.actionHref}
                                            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all duration-200 w-full sm:w-auto ${isLive
                                                    ? "bg-[#DFB15B]/10 border-[#DFB15B]/20 text-[#DFB15B] hover:bg-[#DFB15B] hover:text-black"
                                                    : "bg-transparent border-white/5 text-[#8E8A9F] hover:border-white/20 hover:text-white"
                                                }`}
                                        >
                                            <span>{isLive ? "Enter Session" : "View Vault"}</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    ) : (
                                        <span className="text-[10px] font-bold text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-2.5 py-1 select-none cursor-default uppercase tracking-wider">
                                            Task Verified
                                        </span>
                                    )}
                                </div>

                            </div>

                        </motion.div>
                    );
                })}

            </div>
        </div>
    );
}