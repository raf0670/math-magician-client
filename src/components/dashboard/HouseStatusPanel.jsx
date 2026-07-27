"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Crown, Sparkles } from "lucide-react";
import Image from "next/image";
import { getProfile, getStoredUser, saveAuthSession } from "@/lib/api";

const houses = [
    {
        name: "Gryffindor",
        mode: "Offline",
        location: "Farmgate",
        tone: "from-[#8B1E2D]/35 via-[#DFB15B]/10 to-transparent",
        iconClass: "border-[#DFB15B]/25 bg-[#8B1E2D]/20 text-[#F2C879]",
        imageSrc: "/gryffindor.jpeg",
        imageAlt: "Gryffindor house crest",
    },
    {
        name: "Hufflepuff",
        mode: "Offline",
        location: "Bailey Road",
        tone: "from-[#DFB15B]/24 via-[#F6E7A5]/8 to-transparent",
        iconClass: "border-[#DFB15B]/25 bg-[#DFB15B]/12 text-[#F6D98B]",
        imageSrc: "/hufflepuff.jpeg",
        imageAlt: "Hufflepuff house crest",
    },
    {
        name: "Ravenclaw",
        mode: "Online",
        location: "Live Room",
        tone: "from-[#3156D4]/30 via-[#7C3AED]/10 to-transparent",
        iconClass: "border-[#7C9DFF]/25 bg-[#3156D4]/16 text-[#AFC5FF]",
        imageSrc: "/ravenclaw.jpeg",
        imageAlt: "Ravenclaw house crest",
    },
];

export default function HouseStatusPanel() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const syncUser = () => setCurrentUser(getStoredUser());
        const refreshProfile = async () => {
            const token = window.localStorage.getItem("exam_archive_token");
            if (!token) return;

            const payload = await getProfile().catch(() => null);
            if (payload?.data) {
                saveAuthSession(token, payload.data);
                setCurrentUser(payload.data);
            }
        };

        syncUser();
        refreshProfile();
        window.addEventListener("auth-state-changed", syncUser);
        window.addEventListener("storage", syncUser);

        return () => {
            window.removeEventListener("auth-state-changed", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    const hasClassAccess = Boolean(currentUser?.hasClassAccess);
    const statusTitle = hasClassAccess ? "Portal Access Granted" : "Enrollment Review Pending";
    const statusCopy = hasClassAccess
        ? "Your class vault is open. Choose your practice route and keep your preparation streak alive."
        : "Your academy access will unlock after admin approval. The available houses are shown below without assigning you to one.";
    const StatusIcon = hasClassAccess ? CheckCircle2 : Clock3;

    return (
        <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-5 lg:grid-cols-[0.92fr_1.35fr]"
        >
            <div className="relative overflow-hidden rounded-3xl border border-[#DFB15B]/15 bg-[#121017]/92 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.32)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/70 to-transparent" />
                <motion.div
                    className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#DFB15B]/10 blur-3xl"
                    animate={{ scale: [1, 1.16, 1], opacity: [0.42, 0.72, 0.42] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative z-10 flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${hasClassAccess ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200" : "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]"}`}>
                        <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">House Status</p>
                        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-wide text-white">{statusTitle}</h2>
                        <p className="mt-3 text-sm font-medium leading-6 text-[#9D96B3]">{statusCopy}</p>
                    </div>
                </div>

                <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D8D4E5]">
                        <Crown className="h-3.5 w-3.5 text-[#DFB15B]" />
                        Premium Academy
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D8D4E5]">
                        <Sparkles className="h-3.5 w-3.5 text-[#A78BFA]" />
                        Three Houses
                    </span>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {houses.map((house, index) => (
                    <motion.div
                        key={house.name}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4 }}
                        className="group relative min-h-44 overflow-hidden rounded-3xl border border-white/6 bg-[#121017]/90 p-5 shadow-[0_14px_45px_rgba(0,0,0,0.28)]"
                    >
                        <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${house.tone}`} />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/24 to-transparent opacity-70" />
                        <div className="relative z-10 flex h-full flex-col">
                            <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border ${house.iconClass}`}>
                                <Image
                                    src={house.imageSrc}
                                    alt={house.imageAlt}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h3 className="mt-5 font-serif text-xl font-semibold tracking-wide text-white">{house.name}</h3>
                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#DFB15B]">{house.mode}</p>
                            <p className="mt-2 text-sm font-medium text-[#9D96B3]">{house.location}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
