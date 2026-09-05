"use client";

import { useEffect, useState } from "react";
import { useProgram } from "@/lib/program";
import { motion } from "framer-motion";
import { Calendar, Clock3, ExternalLink, Video, VideoOff } from "lucide-react";
import { getCurrentLiveClass } from "@/lib/api";
import { InlineFlashyLoader } from "@/components/shared/FlashyLoader";

function formatDateTime(value) {
    if (!value) return "Not scheduled";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not scheduled";

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function getClassStatus(liveClass, now) {
    if (!liveClass) return "empty";

    const startsAt = new Date(liveClass.startsAt).getTime();
    const endsAt = new Date(liveClass.endsAt).getTime();

    if (Number.isNaN(startsAt) || Number.isNaN(endsAt)) return "scheduled";
    if (now < startsAt) return "upcoming";
    if (now <= endsAt) return "live";
    return "ended";
}

const STATUS_COPY = {
    upcoming: {
        label: "Scheduled Class",
        tone: "border-sky-400/20 bg-sky-400/10 text-sky-200",
        button: "Join opens at start time",
    },
    live: {
        label: "Class Live Now",
        tone: "border-red-500/20 bg-red-500/10 text-red-300",
        button: "Join Class",
    },
    ended: {
        label: "Class Ended",
        tone: "border-white/8 bg-white/5 text-[#8E8A9F]",
        button: "Class has ended",
    },
    scheduled: {
        label: "Class Scheduled",
        tone: "border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B]",
        button: "Waiting for schedule",
    },
    empty: {
        label: "No Class Scheduled",
        tone: "border-white/8 bg-white/5 text-[#8E8A9F]",
        button: "Waiting for class",
    },
};

export default function LiveArena() {
    const { program } = useProgram();
    const [liveClass, setLiveClass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("empty");

    useEffect(() => {
        let isMounted = true;

        getCurrentLiveClass(program)
            .then((payload) => {
                if (!isMounted) return;
                const classData = payload?.data || null;
                setLiveClass(classData);
                setStatus(getClassStatus(classData, Date.now()));
                setError("");
            })
            .catch((err) => {
                if (!isMounted) return;
                setLiveClass(null);
                setStatus("empty");
                setError(err.message || "Unable to load class schedule.");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [program]);

    useEffect(() => {
        if (!liveClass) return undefined;

        const timer = window.setInterval(() => {
            setStatus(getClassStatus(liveClass, Date.now()));
        }, 30000);

        return () => window.clearInterval(timer);
    }, [liveClass]);

    const statusCopy = STATUS_COPY[status];
    const canJoin = status === "live" && liveClass?.zoomUrl;

    const handleJoin = () => {
        if (!canJoin) return;
        window.open(liveClass.zoomUrl, "_blank", "noopener,noreferrer");
    };

    if (loading) {
        return (
            <InlineFlashyLoader
                text="Loading class schedule"
                iconName="video"
                rows={3}
                className="min-h-40"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 w-full select-none items-start">
            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#E6C687]/5 rounded-full blur-[60px] pointer-events-none" />

                <div className="relative flex items-center justify-between gap-4 mb-6">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border ${statusCopy.tone}`}>
                        {status === "live" ? <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> : null}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{statusCopy.label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6B667B] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Live classroom
                    </span>
                </div>

                {error ? (
                    <div className="relative rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                        {error}
                    </div>
                ) : null}

                {!error && !liveClass ? (
                    <div className="relative">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-[#8E8A9F]">
                            <VideoOff className="h-5 w-5" />
                        </div>
                        <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-white mb-2 leading-tight">
                            No live class is scheduled yet
                        </h1>
                        <p className="mb-6 max-w-2xl text-sm leading-6 text-[#8E8A9F]">
                            When an admin posts the next Zoom class, the schedule and join button will appear here.
                        </p>
                    </div>
                ) : null}

                {!error && liveClass ? (
                    <div className="relative">
                        <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-white mb-2 leading-tight">
                            {liveClass.title}
                        </h1>
                        {liveClass.note ? (
                            <p className="mb-5 max-w-2xl text-sm leading-6 text-[#A9A3BA]">{liveClass.note}</p>
                        ) : null}

                        <div className="mb-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/5 bg-[#0F0D15] px-4 py-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">Starts</p>
                                <p className="mt-1 text-sm font-semibold text-white">{formatDateTime(liveClass.startsAt)}</p>
                            </div>
                            <div className="rounded-2xl border border-white/5 bg-[#0F0D15] px-4 py-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">Ends</p>
                                <p className="mt-1 text-sm font-semibold text-white">{formatDateTime(liveClass.endsAt)}</p>
                            </div>
                        </div>
                    </div>
                ) : null}

                <motion.button
                    type="button"
                    onClick={handleJoin}
                    disabled={!canJoin}
                    whileHover={canJoin ? { scale: 1.01, boxShadow: "0 10px 30px rgba(212,175,55,0.12)" } : {}}
                    whileTap={canJoin ? { scale: 0.99 } : {}}
                    className="relative w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] text-xs font-bold text-black uppercase tracking-wider shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:grayscale disabled:opacity-55"
                >
                    <Video className="w-4 h-4 text-black stroke-[2.2]" />
                    <span>{statusCopy.button}</span>
                    {canJoin ? <ExternalLink className="w-3.5 h-3.5 text-black stroke-[2.2]" /> : <Clock3 className="w-3.5 h-3.5 text-black stroke-[2.2]" />}
                </motion.button>
            </div>
        </div>
    );
}
