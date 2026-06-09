"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getExams } from "@/lib/api";

export default function ClassVault() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("all");
    const [archives, setArchives] = useState([]);

    useEffect(() => {
        getExams()
            .then((payload) => {
                const exams = Array.isArray(payload?.data) ? payload.data : [];
                const mapped = exams.map((exam) => ({
                    id: exam._id,
                    title: exam.title,
                    category: deriveCategory(exam.title),
                    date: exam.createdAt ? new Date(exam.createdAt).toLocaleDateString() : "Newly added",
                    duration: `${exam.duration || 0} min`,
                    questionCount: exam.questionCount || exam.questions?.length || 0,
                }));
                setArchives(mapped);
            })
            .catch(() => setArchives([]));
    }, []);

    const categories = useMemo(() => [
        { id: "all", label: "All Archives" },
        { id: "quant", label: "Quantitative (Math)" },
        { id: "english", label: "English (Verbal)" },
        { id: "analytical", label: "Analytical Ability" },
    ], []);

    const filteredArchives = activeTab === "all" ? archives : archives.filter((item) => item.category === activeTab);

    return (
        <div className="w-full select-none mt-4">
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

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <AnimatePresence mode="popLayout">
                    {filteredArchives.length === 0 ? (
                        <div className="md:col-span-2 rounded-2xl border border-dashed border-white/10 bg-[#1A1722]/30 px-4 py-6 text-sm text-[#8E8A9F]">No exam archives are available from the database yet.</div>
                    ) : (
                        filteredArchives.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ y: -3 }}
                                onClick={() => router.push(`/dashboard/mock-tests/${item.id}`)}
                                className="bg-[#121017] border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col justify-between items-start cursor-pointer group transition-all duration-200 shadow-md"
                            >
                                <div className="w-full">
                                    <h3 className="text-sm font-semibold text-white tracking-wide leading-snug group-hover:text-[#DFB15B] transition-colors duration-200 text-left mb-4">{item.title}</h3>
                                </div>

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
                                        <span>{item.questionCount} Qs</span>
                                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function deriveCategory(title) {
    const normalized = title.toLowerCase();
    if (normalized.includes("english") || normalized.includes("verbal")) return "english";
    if (normalized.includes("analytical") || normalized.includes("logic") || normalized.includes("reasoning")) return "analytical";
    return "quant";
}