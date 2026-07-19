"use client";

import { motion } from "framer-motion";
import {
    ArrowUpRight,
    BookOpenCheck,
    CheckCircle,
    ExternalLink,
    FileText,
    FolderOpen,
    Video,
} from "lucide-react";

const CLASS_DRIVE_URL = "https://drive.google.com/drive/u/5/folders/1rOT0PjAo3cpvW7m08-ZarquFTOThwZ-y";
const DRIVE_PLACEHOLDER = "PASTE_GOOGLE_DRIVE_LINK_HERE";
const isDriveUrlReady = CLASS_DRIVE_URL.trim() !== "" && CLASS_DRIVE_URL !== DRIVE_PLACEHOLDER;

const driveResources = [
    { label: "Recordings", caption: "Class replays", icon: Video },
    { label: "Slides", caption: "Lecture decks", icon: FileText },
    { label: "Worksheets", caption: "Practice files", icon: BookOpenCheck },
    { label: "Resources", caption: "Shared folders", icon: FolderOpen },
];

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

            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
                <div className="flex flex-col justify-between gap-8">
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center gap-2 rounded-md border border-[#D4AF37]/15 bg-[#D4AF37]/10 px-2.5 py-1">
                                <CheckCircle className="h-3.5 w-3.5 text-[#DFB15B]" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DFB15B]">
                                    Approved student resources
                                </span>
                            </div>

                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6B667B]">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Google Drive
                            </span>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-serif text-2xl font-medium leading-tight tracking-wide text-white sm:text-3xl">
                                Everything from class, in one Drive
                            </h3>
                            <p className="max-w-2xl text-xs font-medium leading-6 text-[#8E8A9F] sm:text-sm">
                                Recordings, slides, worksheets, and companion resources now live in
                                the shared Drive folder instead of an internal archive grid.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {driveResources.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: 0.12 + index * 0.05 }}
                                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#1A1722]/45 p-3.5"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-[#DFB15B]">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <p className="truncate text-xs font-bold tracking-wide text-white">
                                            {item.label}
                                        </p>
                                        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B667B]">
                                            {item.caption}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col justify-between border-t border-white/5 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <div className="space-y-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/10 text-[#DFB15B]">
                            <FolderOpen className="h-6 w-6" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-bold tracking-wide text-white">
                                Shared materials folder
                            </p>
                            <p className="text-xs font-medium leading-6 text-[#8E8A9F]">
                                The folder opens in a new tab so the dashboard stays available while
                                students browse class files.
                            </p>
                        </div>
                    </div>

                    <div className="mt-7">
                        {isDriveUrlReady ? (
                            <motion.a
                                href={CLASS_DRIVE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(212,175,55,0.12)" }}
                                whileTap={{ scale: 0.99 }}
                                className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-5 py-4 text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E6C687] focus:ring-offset-2 focus:ring-offset-[#121017]"
                            >
                                <FolderOpen className="h-4 w-4 text-black stroke-[2.2]" />
                                Open Google Drive
                                <ArrowUpRight className="h-3.5 w-3.5 text-black stroke-[2.2] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </motion.a>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    disabled
                                    className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-2xl border border-white/5 bg-[#1A1722]/70 px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B667B]"
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    Paste Drive Link First
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </button>
                                <p className="text-[11px] font-medium leading-5 text-[#8E8A9F]">
                                    Replace the CLASS_DRIVE_URL placeholder in ClassVault.jsx with
                                    the real Google Drive link before launch.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
