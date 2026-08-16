"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, CreditCard, Crown, Shield, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCompetitionSummary, getProfile, getStoredUser, saveAuthSession } from "@/lib/api";

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
    {
        name: "Slytherin",
        mode: "Advanced",
        location: "Coming Soon",
        tone: "from-emerald-500/24 via-white/8 to-transparent",
        iconClass: "border-emerald-300/25 bg-emerald-500/12 text-emerald-200",
        imageSrc: "/slytherin.jpg",
        imageAlt: "Slytherin house crest",
    },
];

function formatPoints(value) {
    return Number(value || 0).toFixed(2);
}

export default function HouseStatusPanel() {
    const [currentUser, setCurrentUser] = useState(null);
    const [standings, setStandings] = useState([]);

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
        getCompetitionSummary()
            .then((payload) => setStandings(payload?.data?.houses || []))
            .catch(() => setStandings([]));
        window.addEventListener("auth-state-changed", syncUser);
        window.addEventListener("storage", syncUser);

        return () => {
            window.removeEventListener("auth-state-changed", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    const hasClassAccess = Boolean(currentUser?.hasClassAccess);
    const hasBooked = Boolean(currentUser?.hasBooked);
    const isPartiallyPaid = currentUser?.paymentStatus === "partiallyPaid";
    const canCheckout = hasBooked && !hasClassAccess;
    const statusTitle = hasClassAccess ? "Portal Access Granted" : canCheckout ? "Seat Booked" : "Enrollment Review Pending";
    const statusCopy = hasClassAccess
        ? isPartiallyPaid
            ? "Your class vault is open after partial payment approval. The final installment is still due later."
            : "Your class vault is open. Choose your practice route and keep your preparation streak alive."
        : canCheckout
            ? "Your seat is reserved. Submit your payment reference when you are ready, then class access will unlock after admin approval."
            : "Your academy access will unlock after admin approval. The available houses are shown below without assigning you to one.";
    const StatusIcon = hasClassAccess ? CheckCircle2 : Clock3;
    const standingByHouse = new Map(standings.map((item) => [item.name, item]));

    return (
        <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="grid min-w-0 max-w-full gap-5 lg:grid-cols-[0.82fr_1.55fr]"
        >
            <div className="relative min-w-0 max-w-full overflow-hidden rounded-3xl border border-[#DFB15B]/15 bg-[#121017]/92 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.32)] sm:p-5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/70 to-transparent" />
                <motion.div
                    className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#DFB15B]/10 blur-3xl"
                    animate={{ scale: [1, 1.16, 1], opacity: [0.42, 0.72, 0.42] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative z-10 flex min-w-0 items-start gap-3 sm:gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${hasClassAccess ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200" : "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]"}`}>
                        <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="break-words text-[10px] font-bold uppercase tracking-[0.18em] text-[#DFB15B] sm:tracking-[0.24em]">House Status</p>
                        <h2 className="mt-2 break-words font-serif text-xl font-semibold tracking-wide text-white [overflow-wrap:anywhere] sm:text-2xl">{statusTitle}</h2>
                        <p className="mt-3 break-words text-sm font-medium leading-6 text-[#9D96B3]">{statusCopy}</p>
                    </div>
                </div>

                <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#D8D4E5] sm:tracking-wider">
                        <Crown className="h-3.5 w-3.5 shrink-0 text-[#DFB15B]" />
                        <span className="min-w-0 truncate">{currentUser?.house || (canCheckout ? "Seat Reserved" : isPartiallyPaid ? "Partial Payment" : "Premium Academy")}</span>
                    </span>
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#D8D4E5] sm:tracking-wider">
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#A78BFA]" />
                        <span className="min-w-0 truncate">Four Houses</span>
                    </span>
                </div>

                {canCheckout ? (
                    <Link
                        href="/payment/checkout"
                        className="relative z-10 mt-5 inline-flex w-full max-w-full items-center justify-center gap-2 rounded-2xl bg-[#DFB15B] px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-black transition hover:brightness-110 sm:w-auto sm:px-5 sm:tracking-wider"
                    >
                        <CreditCard className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 truncate">Proceed to Checkout</span>
                    </Link>
                ) : null}
            </div>

            <div className="grid min-w-0 max-w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {houses.map((house, index) => {
                    const standing = standingByHouse.get(house.name);
                    const isCurrentHouse = currentUser?.house === house.name;

                    return (
                        <motion.div
                            key={house.name}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -4 }}
                            className={`group relative min-h-52 min-w-0 overflow-hidden rounded-3xl border bg-[#121017]/90 p-5 shadow-[0_14px_45px_rgba(0,0,0,0.28)] ${isCurrentHouse ? "border-[#DFB15B]/35" : "border-white/6"}`}
                        >
                            <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${house.tone}`} />
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/24 to-transparent opacity-70" />
                            <div className="relative z-10 flex h-full flex-col">
                                <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border ${house.iconClass}`}>
                                    {house.imageSrc ? (
                                        <Image
                                            src={house.imageSrc}
                                            alt={house.imageAlt}
                                            width={40}
                                            height={40}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Shield className="h-5 w-5" />
                                    )}
                                </div>
                                <h3 className="mt-5 break-words font-serif text-xl font-semibold tracking-wide text-white [overflow-wrap:anywhere]">{house.name}</h3>
                                <p className="mt-2 break-words text-xs font-semibold uppercase tracking-[0.16em] text-[#DFB15B] sm:tracking-[0.18em]">{house.mode}</p>
                                <p className="mt-2 break-words text-sm font-medium text-[#9D96B3]">{house.location}</p>
                                <div className="mt-auto pt-4">
                                    <div className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-white/6 bg-[#0F0D15]/70 px-3 py-2">
                                        <span className="inline-flex min-w-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#8E8A9F] sm:tracking-wider">
                                            <Trophy className="h-3.5 w-3.5 shrink-0 text-[#DFB15B]" />
                                            Points
                                        </span>
                                        <span className="shrink-0 text-sm font-black text-white">{formatPoints(standing?.totalPoints)}</span>
                                    </div>
                                    {isCurrentHouse ? (
                                        <span className="mt-2 inline-flex max-w-full rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#DFB15B] sm:tracking-wider">
                                            <span className="min-w-0 truncate">Your House</span>
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}
