"use client";
import { motion } from "framer-motion";
import { ClipboardCheck, Target, Timer, TrendingUp } from "lucide-react";

export default function PerformanceMetrics() {
    // Mock metric points calculated to represent an active IBA applicant
    const metrics = [
        {
            title: "Mock Tests Solved",
            value: "14 / 45",
            subtext: "Next full diagnostic scheduled: Friday",
            icon: ClipboardCheck,
            colorClass: "text-[#A78BFA]",
            bgIconClass: "bg-[#7C3AED]/10 border-[#7C3AED]/20",
            // Custom metric mini visual: Simple completion progress bar
            renderFooter: () => (
                <div className="w-full mt-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#6B667B] mb-1.5">
                        <span>Syllabus Target</span>
                        <span className="text-white">31%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1A1722] rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "31%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-linear-to-r from-indigo-500 to-[#A78BFA] rounded-full"
                        />
                    </div>
                </div>
            )
        },
        {
            title: "Overall Accuracy",
            value: "78.4%",
            subtext: "Target boundary for IBA: >82%",
            icon: Target,
            colorClass: "text-[#E6C687]",
            bgIconClass: "bg-[#E6C687]/10 border-[#E6C687]/20",
            renderFooter: () => (
                <div className="w-full mt-4 flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-3 py-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Up +3.2% vs last week (Quant improved)</span>
                </div>
            )
        },
        {
            title: "Avg. Time / Question",
            value: "42s",
            subtext: "Recommended pace: Under 50s",
            icon: Timer,
            colorClass: "text-[#DFB15B]",
            bgIconClass: "bg-[#DFB15B]/10 border-[#DFB15B]/20",
            renderFooter: () => (
                <div className="w-full mt-4 flex gap-1.5 items-center">
                    {/* Visual speed thresholds indicators */}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">Pace State:</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        Optimal
                    </span>
                </div>
            )
        }
    ];

    // Stagger layout container animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
        }
    };

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full select-none"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {metrics.map((item, idx) => (
                <motion.div
                    key={idx}
                    variants={cardVariants}
                    whileHover={{ y: -4 }}
                    className="bg-[#121017] border border-white/5 rounded-2xl p-6 flex flex-col items-start relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.25)] group"
                >
                    <div className="absolute inset-0 bg-linear-to-b from-white/1 to-transparent pointer-events-none" />

                    {/* Header Matrix Block */}
                    <div className="flex items-center justify-between w-full mb-4">
                        <span className="text-xs font-semibold text-[#8E8A9F] group-hover:text-white transition-colors duration-200">
                            {item.title}
                        </span>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${item.bgIconClass} ${item.colorClass}`}>
                            <item.icon className="w-4 h-4 stroke-2" />
                        </div>
                    </div>

                    {/* Numeric Main Value Metric */}
                    <div className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
                        {item.value}
                    </div>

                    {/* Context Descriptor Subtext */}
                    <div className="text-[11px] font-medium text-[#6B667B]">
                        {item.subtext}
                    </div>

                    {/* Render the custom footer graphical tracking blocks */}
                    {item.renderFooter()}

                </motion.div>
            ))}
        </motion.div>
    );
}