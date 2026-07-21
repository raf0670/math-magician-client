"use client";

import { motion } from "framer-motion";
import {
    ArrowUpRight,
    BookOpenCheck,
    Brain,
    CheckCircle,
    ExternalLink,
    FolderOpen,
    Languages,
    Sigma,
} from "lucide-react";

const SUBJECT_DRIVES = [
    {
        label: "English",
        caption: "Grammar, vocabulary, reading and writing files",
        href: "https://drive.google.com/drive/u/5/folders/1hwcC2sxsKFYshon0SljGl_ZOiK7JN1OV",
        icon: Languages,
        accent: "text-sky-200",
        surface: "border-sky-400/15 bg-sky-400/8",
    },
    {
        label: "Maths",
        caption: "Quant practice, worksheets and class materials",
        href: "https://drive.google.com/drive/u/5/folders/1ljlGcrgeiBlIbOZZSfZu54zhn6fIlBxt",
        icon: Sigma,
        accent: "text-[#DFB15B]",
        surface: "border-[#DFB15B]/18 bg-[#DFB15B]/10",
    },
    {
        label: "Analytical Ability",
        caption: "Logic sets, analytical drills and companion files",
        href: "https://drive.google.com/drive/u/5/folders/1PnrtEVzIpekaCD5H-Q9gBplCkfED7vih",
        icon: Brain,
        accent: "text-emerald-200",
        surface: "border-emerald-400/15 bg-emerald-400/8",
    },
];

function isDriveReady(href) {
    return Boolean(href?.trim());
}

export default function ClassVault() {
    return (
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
                            Open the Drive folder for each section to browse recordings, slides, worksheets, and companion resources.
                        </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6B667B]">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Google Drive folders
                    </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {SUBJECT_DRIVES.map((item, index) => {
                        const Icon = item.icon;
                        const ready = isDriveReady(item.href);

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
                                </div>

                                <div className="mt-7">
                                    {ready ? (
                                        <motion.a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(212,175,55,0.12)" }}
                                            whileTap={{ scale: 0.99 }}
                                            className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-5 py-4 text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E6C687] focus:ring-offset-2 focus:ring-offset-[#121017]"
                                        >
                                            <FolderOpen className="h-4 w-4 text-black stroke-[2.2]" />
                                            Open Folder
                                            <ArrowUpRight className="h-3.5 w-3.5 text-black stroke-[2.2] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                        </motion.a>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled
                                            className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-2xl border border-white/5 bg-[#1A1722]/70 px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B667B]"
                                        >
                                            <BookOpenCheck className="h-4 w-4" />
                                            Link Pending
                                        </button>
                                    )}
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
