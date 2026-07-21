"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowUpRight,
    BookOpenCheck,
    Brain,
    CheckCircle,
    ExternalLink,
    FolderOpen,
    Languages,
    Sigma,
    X,
} from "lucide-react";

const SUBJECTS = [
    {
        label: "English",
        caption: "Grammar, vocabulary, reading and writing files",
        description: "Browse English topic folders for class recordings, slides, worksheets, and companion resources.",
        icon: Languages,
        accent: "text-sky-200",
        surface: "border-sky-400/15 bg-sky-400/8",
        topics: [
            { label: "Error Detection", href: "https://drive.google.com/drive/u/5/folders/1q-BziwHHHaOYfyQ4ygjhBTun102Fv7M_" },
            { label: "Grammar 01", href: "https://drive.google.com/drive/u/5/folders/1zTdSW30nj30MDkhbwtpnrTPU9Bqdmz1R" },
            { label: "Grammar 02", href: "https://drive.google.com/drive/u/5/folders/1SaywznTO4pGtJbJtcHcyOYmz2jZOHBeo" },
            { label: "Grammar 03", href: "https://drive.google.com/drive/u/5/folders/1Hl9aoFsUqZL5GO2CpwYPLVlKNvTFuyBz" },
            { label: "Reading Comprehension", href: "https://drive.google.com/drive/u/5/folders/1p1DcarqQdmdy8ZktDU3uPIYv8OYIS99D" },
            { label: "Sentence Correction", href: "https://drive.google.com/drive/u/5/folders/1bnoxsafuF6zmlhskVTCVRNyz3Vai1MKU" },
            { label: "Vocabulary", href: "https://drive.google.com/drive/u/5/folders/1RCGcS3WGfIUaRqK4Oa77S2Hl978qbKB7" },
        ],
    },
    {
        label: "Maths",
        caption: "Quant practice, worksheets and class materials",
        description: "Browse Maths topic folders for class recordings, worksheets, and quant practice resources.",
        icon: Sigma,
        accent: "text-[#DFB15B]",
        surface: "border-[#DFB15B]/18 bg-[#DFB15B]/10",
        topics: [
            { label: "Number 1 & 2", href: "https://drive.google.com/drive/u/5/folders/1X5kekNccuoLzKND3IJ-BVqNilrtBKAc8" },
            { label: "Percentage", href: "https://drive.google.com/drive/u/5/folders/1JSXtRVdZpdptDWDKA2LkZQuASL4eLOGM" },
            { label: "Ratio & Proportion", href: "https://drive.google.com/drive/u/5/folders/1fiSoKsYEW9gxKyQZznBCzv7_TnK9apvF" },
            { label: "Age & Average", href: "https://drive.google.com/drive/u/5/folders/1QOksEKtO7Jh_1qKicWXfT6LNIkyMZ-Xh" },
            { label: "Profit & Loss", href: "https://drive.google.com/drive/u/5/folders/1WM5Rhqwi1kd34s_e69kg-NUF6cYpVjwt" },
            { label: "Speed, Distance & Time", href: "https://drive.google.com/drive/u/5/folders/1GFwxu-9L7fLF6S-C2q0zWjKXp4RgKuWE" },
            { label: "Set & Probability", href: "https://drive.google.com/drive/u/5/folders/1Dqrfj9JD3LIQq3801_b3eNq2Ya1uk7yk" },
            { label: "Work Done", href: "https://drive.google.com/drive/u/5/folders/1Wrj2aQehTnK8GgXy5Y11h80ljG1kjl5H" },
            { label: "Permutation Combination", href: "https://drive.google.com/drive/u/5/folders/1316nxWmRuSxIa8BOEtNZy3yC9Ii4yO7h" },
            { label: "Triangle, Angle & Polygons", href: "https://drive.google.com/drive/u/5/folders/1QftcVjAjLBGP3A1AW3omEL6vXJbFPiYD" },
            { label: "Circle", href: "https://drive.google.com/drive/u/5/folders/1ZykzuipZKaxk2dF1FLb9BTXkmlJJL8A_" },
        ],
    },
    {
        label: "Analytical Ability",
        caption: "Logic sets, analytical drills and companion files",
        description: "Browse analytical topic folders for logic practice, puzzles, and class files.",
        icon: Brain,
        accent: "text-emerald-200",
        surface: "border-emerald-400/15 bg-emerald-400/8",
        topics: [
            { label: "Data Sufficiency", href: "https://drive.google.com/drive/u/5/folders/1Lc8QAC9gN4Y5tNNwm678B9HuNEvjjYZb" },
            { label: "Puzzle 01", href: "https://drive.google.com/drive/u/5/folders/1RIcCfZVc5TTYY9jDhFEDadrSwHJYCi7v" },
            { label: "Puzzle 02", href: "https://drive.google.com/drive/u/5/folders/1O0XWWsdjBuA6BlcrboF2jAmHPujqTSdH" },
        ],
    },
];

function isDriveReady(href) {
    return Boolean(href?.trim());
}

export default function ClassVault() {
    const [selectedSubject, setSelectedSubject] = useState(null);

    useEffect(() => {
        if (!selectedSubject) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedSubject(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedSubject]);

    const closeModal = () => setSelectedSubject(null);

    return (
        <>
            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#121017] p-6 shadow-[0_15px_35px_rgba(0,0,0,0.4)] sm:p-8"
            >
                <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E6C687]/5 blur-[60px]" />
                <div className="pointer-events-none absolute bottom-0 left-8 h-px w-52 bg-linear-to-r from-[#D4AF37]/0 via-[#D4AF37]/40 to-[#D4AF37]/0" />

                <div className="relative space-y-7">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-md border border-[#D4AF37]/15 bg-[#D4AF37]/10 px-2.5 py-1">
                                <CheckCircle className="h-3.5 w-3.5 text-[#DFB15B]" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DFB15B]">
                                    Approved student archive
                                </span>
                            </div>

                            <h2 className="mt-4 font-serif text-2xl font-medium leading-tight tracking-wide text-white sm:text-3xl">
                                Subject-wise class folders
                            </h2>
                            <p className="mt-3 text-xs font-medium leading-6 text-[#8E8A9F] sm:text-sm">
                                Choose a section to open its topic folders for recordings, slides, worksheets, and companion resources.
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6B667B]">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Google Drive topics
                        </span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {SUBJECTS.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <motion.article
                                    key={item.label}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: 0.12 + index * 0.06 }}
                                    className="flex min-h-72 flex-col justify-between rounded-2xl border border-white/5 bg-[#0F0D15] p-5"
                                >
                                    <div>
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${item.surface} ${item.accent}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <h3 className="mt-5 font-serif text-2xl font-medium tracking-wide text-white">
                                            {item.label}
                                        </h3>
                                        <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">
                                            {item.caption}
                                        </p>
                                        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">
                                            {item.topics.length} topic{item.topics.length === 1 ? "" : "s"}
                                        </p>
                                    </div>

                                    <div className="mt-7">
                                        <motion.button
                                            type="button"
                                            onClick={() => setSelectedSubject(item)}
                                            whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(212,175,55,0.12)" }}
                                            whileTap={{ scale: 0.99 }}
                                            className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-5 py-4 text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E6C687] focus:ring-offset-2 focus:ring-offset-[#121017]"
                                        >
                                            <FolderOpen className="h-4 w-4 text-black stroke-[2.2]" />
                                            Browse Topics
                                            <ArrowUpRight className="h-3.5 w-3.5 text-black stroke-[2.2] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                        </motion.button>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            <AnimatePresence>
                {selectedSubject ? (
                    <SubjectModal subject={selectedSubject} onClose={closeModal} />
                ) : null}
            </AnimatePresence>
        </>
    );
}

function SubjectModal({ subject, onClose }) {
    const Icon = subject.icon;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            role="presentation"
        >
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/8 bg-[#121017] text-white shadow-[0_28px_100px_rgba(0,0,0,0.65)]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="archive-subject-title"
            >
                <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E6C687]/6 blur-[70px]" />
                <div className="relative border-b border-white/6 px-5 py-5 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${subject.surface} ${subject.accent}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
                                    {subject.topics.length} topic{subject.topics.length === 1 ? "" : "s"}
                                </p>
                                <h2 id="archive-subject-title" className="mt-1 font-serif text-2xl font-medium tracking-wide text-white sm:text-3xl">
                                    {subject.label}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#8E8A9F]">
                                    {subject.description}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close topic folders"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-[#8E8A9F] transition hover:border-[#DFB15B]/30 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="relative overflow-y-auto px-5 py-5 sm:px-6">
                    <div className="grid gap-3">
                        {subject.topics.map((topic, index) => {
                            const ready = isDriveReady(topic.href);

                            return (
                                <div
                                    key={topic.label}
                                    className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#0F0D15] p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/3 font-serif text-sm font-bold text-[#DFB15B]">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-white">{topic.label}</p>
                                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B667B]">
                                                Google Drive folder
                                            </p>
                                        </div>
                                    </div>

                                    {ready ? (
                                        <a
                                            href={topic.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black"
                                        >
                                            Open Folder
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled
                                            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/5 bg-[#1A1722]/70 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6B667B]"
                                        >
                                            <BookOpenCheck className="h-3.5 w-3.5" />
                                            Link Pending
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
