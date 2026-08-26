"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowUpRight,
    Brain,
    CheckCircle,
    ExternalLink,
    FileText,
    FolderOpen,
    Languages,
    LibraryBig,
    Sigma,
    X,
} from "lucide-react";

const RESOURCE_CATEGORIES = [
    {
        label: "Analytical",
        caption: "Puzzle sets, solutions and solving guidance",
        description: "Browse analytical resources for puzzle practice, worked solutions, and focused puzzle suggestions.",
        icon: Brain,
        accent: "text-emerald-200",
        surface: "border-emerald-400/15 bg-emerald-400/8",
        resources: [
            { label: "200 Puzzles", href: "https://drive.google.com/file/d/1M2XBVdlVqLgwwi6kFD95UVrlt7Cdb-Eb/view?usp=drive_link" },
            { label: "Puzzles Solution", href: "https://drive.google.com/file/d/1MoJo_QTOSPik0wWtC94_JuwrQCZ4xk9N/view?usp=drive_link" },
            { label: "Suggestions For Puzzle", href: "https://drive.google.com/file/d/1RW4f52yzU3rbItMrA2Jx_oBlLitZQsu0/view?usp=drive_link" },
        ],
    },
    {
        label: "English",
        caption: "Vocabulary, grammar, SAT, GRE and TOEFL books",
        description: "Browse English PDFs for grammar rules, vocabulary books, sentence completion, analogies, and reading prep.",
        icon: Languages,
        accent: "text-sky-200",
        surface: "border-sky-400/15 bg-sky-400/8",
        resources: [
            { label: "Analogies", href: "https://drive.google.com/file/d/1ymI5j-ofMCRak0hc7a0nWlYh8_Nz6tb4/view?usp=drive_link" },
            { label: "50 Grammar Rules 01", href: "https://drive.google.com/file/d/1oY7wUasWVjstXXCaLzVnXQoLRfpH1lkE/view?usp=drive_link" },
            { label: "50 Grammar Rules 02", href: "https://drive.google.com/file/d/1htc2G0PVjkymHAFmOMIrxinUXQVNoPs_/view?usp=drive_link" },
            { label: "501 Sentence Completion Questions", href: "https://drive.google.com/file/d/1wTbdA6q1Mgl-8TPeGBlISw-zRlUxpzHz/view?usp=drive_link" },
            { label: "Barron's 800 HF Words", href: "https://drive.google.com/file/d/1xFKTJhBs5lTnlnoXKlwT-9URJR07R3Ly/view?usp=drive_link" },
            { label: "Barron's SAT", href: "https://drive.google.com/file/d/1Vo4d-lGTWk95yJW16yCRcr7MawAzeWaI/view?usp=drive_link" },
            { label: "Barron's 333 HF Words", href: "https://drive.google.com/file/d/1cHOsxCjgTsDWKrgkc1Rvw_D9SbqoO6wH/view?usp=drive_link" },
            { label: "GRE Big Book", href: "https://drive.google.com/file/d/1d3IZz9Fy8TagqZ5E-DolQzkfWaHDpJfs/view?usp=drive_link" },
            { label: "Cliffs TOEFL", href: "https://drive.google.com/file/d/1eFfGcseNmySSdkFnFhx9h9qd998I5ryK/view?usp=drive_link" },
            { label: "Common Mistakes in English by T.J. Fitikides", href: "https://drive.google.com/file/d/1ZUmADigDdw1VqhlnwYr5zMCDknYTR27w/view?usp=drive_link" },
            { label: "GRE Big Book Antonym Test", href: "https://drive.google.com/file/d/1t3qXAz1nQng5Sj_gRtUR8J19RMyPvFcA/view?usp=drive_link" },
            { label: "GRE Sentence Completion", href: "https://drive.google.com/file/d/1LpErFvuyd4Z4mKDQeHMZdEaNafg62tO2/view?usp=drive_link" },
            { label: "SAT Hit Parade", href: "https://drive.google.com/file/d/1VKI40EBrJ7JmvCH_2xKb5rLa_6Y_GjLB/view?usp=drive_link" },
            { label: "SC Grail", href: "https://drive.google.com/file/d/1Ka3x7GrEX7psl1dh23pC34UuWJtq5Hkx/view?usp=drive_link" },
            { label: "Word Smart 1", href: "https://drive.google.com/file/d/1gh8oskuz8PHYFSe0Jpi9PWMvFKevdCJz/view?usp=drive_link" },
            { label: "Word Smart 2", href: "https://drive.google.com/file/d/1kaw-_e16Qq1bCcFhM7XRt_-8Odry8IL_/view?usp=drive_link" },
            { label: "Word Smart 800", href: "https://drive.google.com/file/d/10T1CuwS5htEBiqipERQvKAuLp6OP_ve3/view?usp=drive_link" },
        ],
    },
    {
        label: "Maths",
        caption: "Math guides, shortcuts and question banks",
        description: "Browse Maths resources for quant concepts, marked practice, shortcuts, and question-bank drills.",
        icon: Sigma,
        accent: "text-[#DFB15B]",
        surface: "border-[#DFB15B]/18 bg-[#DFB15B]/10",
        resources: [
            { label: "GRE Math Bible", href: "https://drive.google.com/file/d/11EGsyuQtP3ZISxGzCQX1AELR4KGaUmcH/view?usp=drive_link" },
            { label: "ExamVeda Marked Maths", href: "https://drive.google.com/file/d/1LuMLj7eHQtwCpTT0b9f1VTHlBDkHHewG/view?usp=drive_link" },
            { label: "Math Shortcuts", href: "https://drive.google.com/file/d/1fi7dZU6Ejhmj6Sq2uDaY9djenJTAPDmq/view?usp=drive_link" },
            { label: "Mentors Math QBank", href: "https://drive.google.com/file/d/1OtIibAZphlmIagYTZByb_2LIDgn3KpNd/view?usp=drive_link" },
        ],
    },
    {
        label: "Miscellaneous",
        caption: "IBA guides, university QBanks and model tests",
        description: "Browse additional admission resources, model tests, and IBA-focused question banks.",
        icon: LibraryBig,
        accent: "text-violet-200",
        surface: "border-violet-400/15 bg-violet-400/8",
        resources: [
            { label: "BUP FBS Model Test", href: "https://drive.google.com/file/d/1S8mR16e3KmiqByGAL0f6GjB4qqkbeOC6/view?usp=drive_link" },
            { label: "DU IBA QBank", href: "https://drive.google.com/file/d/15mIHoS6xSf6IXCPYGLZebchGFBNphHfm/view?usp=drive_link" },
            { label: "JU IBA QBank", href: "https://drive.google.com/file/d/1v9KbiZEWD6iRpr4twfh5qV7j1ytRbZoR/view?usp=drive_link" },
            { label: "Mentors IBA BBA Guide", href: "https://drive.google.com/file/d/1YFBSF0vX6B_pSCBi_SpJBzMjyisWUCg_/view?usp=drive_link" },
        ],
    },
];

function isDriveReady(href) {
    return Boolean(href?.trim());
}

export default function ResourcesVault() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (!selectedCategory) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedCategory(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedCategory]);

    const closeModal = () => setSelectedCategory(null);

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
                                    Approved student resources
                                </span>
                            </div>

                            <h2 className="mt-4 font-serif text-2xl font-medium leading-tight tracking-wide text-white sm:text-3xl">
                                Curated PDF resource library
                            </h2>
                            <p className="mt-3 text-xs font-medium leading-6 text-[#8E8A9F] sm:text-sm">
                                Choose a category to open its Google Drive files for question banks, vocabulary books, puzzle files, and exam guides.
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6B667B]">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Google Drive files
                        </span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-4">
                        {RESOURCE_CATEGORIES.map((item, index) => {
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
                                            {item.resources.length} file{item.resources.length === 1 ? "" : "s"}
                                        </p>
                                    </div>

                                    <div className="mt-7">
                                        <motion.button
                                            type="button"
                                            onClick={() => setSelectedCategory(item)}
                                            whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(212,175,55,0.12)" }}
                                            whileTap={{ scale: 0.99 }}
                                            className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-5 py-4 text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E6C687] focus:ring-offset-2 focus:ring-offset-[#121017]"
                                        >
                                            <FolderOpen className="h-4 w-4 text-black stroke-[2.2]" />
                                            Browse Files
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
                {selectedCategory ? (
                    <ResourceModal category={selectedCategory} onClose={closeModal} />
                ) : null}
            </AnimatePresence>
        </>
    );
}

function ResourceModal({ category, onClose }) {
    const Icon = category.icon;

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
                aria-labelledby="resources-category-title"
            >
                <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E6C687]/6 blur-[70px]" />
                <div className="relative border-b border-white/6 px-5 py-5 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${category.surface} ${category.accent}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
                                    {category.resources.length} file{category.resources.length === 1 ? "" : "s"}
                                </p>
                                <h2 id="resources-category-title" className="mt-1 font-serif text-2xl font-medium tracking-wide text-white sm:text-3xl">
                                    {category.label}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#8E8A9F]">
                                    {category.description}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close resource files"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-[#8E8A9F] transition hover:border-[#DFB15B]/30 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="relative overflow-y-auto px-5 py-5 sm:px-6">
                    <div className="grid gap-3">
                        {category.resources.map((resource, index) => {
                            const ready = isDriveReady(resource.href);

                            return (
                                <div
                                    key={resource.label}
                                    className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#0F0D15] p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/3 font-serif text-sm font-bold text-[#DFB15B]">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="break-words font-semibold text-white">{resource.label}</p>
                                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B667B]">
                                                Google Drive file
                                            </p>
                                        </div>
                                    </div>

                                    {ready ? (
                                        <a
                                            href={resource.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black"
                                        >
                                            Open File
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled
                                            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/5 bg-[#1A1722]/70 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6B667B]"
                                        >
                                            <FileText className="h-3.5 w-3.5" />
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
