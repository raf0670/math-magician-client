"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, BookOpen, GraduationCap, ShieldCheck, Mail, Lock, Save, Sparkles, Trophy, Target } from "lucide-react";
import { changePassword, getMyStats, getStoredUser, saveAuthSession, updateProfile } from "@/lib/api";
import { POINTS_PER_LEVEL, formatRankPoints, getDefaultRankInfo, getRankInfo, getRankProgressPercent, getRankTone } from "@/lib/rank";

const RANK_PROGRESS_ACCENTS = {
    Silver: "from-slate-300 via-white to-slate-400 shadow-[0_0_28px_rgba(226,232,240,0.36)]",
    Gold: "from-[#DFB15B] via-[#F6D98B] to-amber-500 shadow-[0_0_30px_rgba(223,177,91,0.42)]",
    Platinum: "from-cyan-200 via-sky-300 to-cyan-500 shadow-[0_0_32px_rgba(125,211,252,0.42)]",
    Master: "from-red-300 via-rose-400 to-red-600 shadow-[0_0_34px_rgba(248,113,113,0.46)]",
    Challenger: "from-sky-300 via-blue-400 to-indigo-500 shadow-[0_0_36px_rgba(56,189,248,0.48)]",
    Legendary: "from-amber-200 via-[#DFB15B] to-orange-500 shadow-[0_0_40px_rgba(251,191,36,0.55)]",
};

const profileSparks = [
    { left: "8%", top: "4%", delay: 0 },
    { left: "21%", top: "27%", delay: 0.7 },
    { left: "72%", top: "8%", delay: 1.4 },
    { left: "91%", top: "36%", delay: 0.4 },
    { left: "13%", top: "67%", delay: 1.1 },
    { left: "84%", top: "76%", delay: 1.8 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const panelVariants = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const liftHover = {
    y: -4,
    boxShadow: "0 22px 60px rgba(0,0,0,0.38)",
    transition: { duration: 0.25, ease: "easeOut" },
};

export default function ProfileSettings() {
    const [profile, setProfile] = useState({
        fullName: "Student",
        email: "student@example.com",
        bio: "",
        institution: "Practice dashboard",
        department: "Exam history will appear here",
        targetGoal: "Complete your first mock exam",
        focusArea: "No submissions yet",
        mocksCompleted: 0,
        rankInfo: getDefaultRankInfo(),
    });
    const [form, setForm] = useState({ name: "", bio: "" });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const syncProfile = () => {
            const currentUser = getStoredUser();
            if (currentUser?.name || currentUser?.email) {
                setProfile((prev) => ({
                    ...prev,
                    fullName: currentUser.name || prev.fullName,
                    email: currentUser.email || prev.email,
                    bio: currentUser.bio || prev.bio,
                    rankInfo: getRankInfo(currentUser.rankInfo || prev.rankInfo),
                }));
                setForm({
                    name: currentUser.name || "",
                    bio: currentUser.bio || "",
                });
            }
        };

        syncProfile();
        window.addEventListener("auth-state-changed", syncProfile);
        window.addEventListener("storage", syncProfile);

        getMyStats()
            .then((payload) => {
                const stats = payload?.stats || {};
                const history = Array.isArray(payload?.history) ? payload.history : [];
                const averageScore = Number(stats?.averageScore || 0);
                const completed = Number(stats?.totalExams || 0);
                const rankInfo = getRankInfo(payload?.rankInfo || stats?.rankInfo);

                setProfile((prev) => ({
                    ...prev,
                    mocksCompleted: completed,
                    rankInfo,
                    institution: completed > 0 ? "Self-paced progress" : "Practice dashboard",
                    department: completed > 0 ? `${completed} exam${completed === 1 ? "" : "s"} tracked` : "Exam history will appear here",
                    targetGoal: completed > 0 ? `Average score ${averageScore.toFixed(2)}` : "Complete your first mock exam",
                    focusArea: rankInfo.countedExamCount > 0 ? `${rankInfo.countedExamCount} ranked exam${rankInfo.countedExamCount === 1 ? "" : "s"} counted` : history.length > 0 ? "No ranked exams finalized yet" : "No submissions yet",
                }));
            })
            .catch(() => {});

        return () => {
            window.removeEventListener("auth-state-changed", syncProfile);
            window.removeEventListener("storage", syncProfile);
        };
    }, []);

    const handleProfileSave = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setError("");
        setMessage("");

        try {
            const payload = await updateProfile({ name: form.name, bio: form.bio });
            const updatedUser = payload?.data || {};
            const currentUser = getStoredUser();
            const nextUser = { ...(currentUser || {}), ...updatedUser };
            saveAuthSession(localStorage.getItem("exam_archive_token"), nextUser);
            setProfile((prev) => ({
                ...prev,
                fullName: updatedUser.name || prev.fullName,
                email: updatedUser.email || prev.email,
                bio: updatedUser.bio || prev.bio,
                rankInfo: getRankInfo(updatedUser.rankInfo || prev.rankInfo),
            }));
            setForm({ name: updatedUser.name || "", bio: updatedUser.bio || "" });
            setMessage("Profile updated successfully.");
        } catch (err) {
            setError(err.message || "Unable to save your profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordUpdate = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            const payload = await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setMessage(payload?.message || "Password changed successfully.");
        } catch (err) {
            setError(err.message || "Password update failed.");
        }
    };

    const rankInfo = getRankInfo(profile.rankInfo);
    const rankTone = getRankTone(rankInfo);
    const progressPercentage = getRankProgressPercent(rankInfo).toFixed(0);
    const progressAccent = RANK_PROGRESS_ACCENTS[rankInfo.tier] || RANK_PROGRESS_ACCENTS.Silver;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full flex flex-col gap-8 overflow-hidden pb-4 text-left select-none"
        >
            <div className="pointer-events-none absolute inset-x-[-14%] -top-24 h-80 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.18),transparent_64%)]" />
            <motion.div
                className="pointer-events-none absolute right-[-14%] top-28 h-96 w-96 rounded-full bg-[#3156D4]/14 blur-3xl"
                animate={{ scale: [1, 1.16, 1], opacity: [0.28, 0.62, 0.28] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute left-[-10%] top-[44%] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
                animate={{ x: [0, 28, -12, 0], opacity: [0.2, 0.48, 0.2] }}
                transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {profileSparks.map((point, index) => (
                <motion.span
                    key={index}
                    className="pointer-events-none absolute z-0 h-1.5 w-1.5 rounded-full bg-[#DFB15B] shadow-[0_0_18px_rgba(223,177,91,0.72)]"
                    style={{ left: point.left, top: point.top }}
                    animate={{ opacity: [0.18, 0.9, 0.18], scale: [0.65, 1.35, 0.65] }}
                    transition={{ duration: 3.2, delay: point.delay, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}

            <motion.div
                variants={panelVariants}
                whileHover={liftHover}
                className="relative overflow-hidden rounded-3xl border border-[#DFB15B]/18 bg-[#100E16]/95 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.42)] flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[42px_42px]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/50 to-transparent" />
                <motion.div
                    className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#DFB15B]/13 blur-3xl"
                    animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.72, 0.35] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    animate={{ boxShadow: ["0 0 0 rgba(223,177,91,0)", "0 0 28px rgba(223,177,91,0.22)", "0 0 0 rgba(223,177,91,0)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 w-16 h-16 rounded-2xl bg-linear-to-tr from-[#E6C687] via-[#F6D98B] to-[#AA7C11] p-0.5 shrink-0"
                >
                    <div className="w-full h-full bg-[#121017] rounded-[14px] flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <User className="w-6 h-6 text-[#DFB15B]" />
                        </motion.div>
                    </div>
                </motion.div>

                <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className={`text-xl font-bold tracking-wide truncate ${rankTone.name}`}>{profile.fullName}</h2>
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider shrink-0 ${rankTone.badge}`}>{rankInfo.rankName}</span>
                    </div>
                    <p className="text-xs text-[#8E8A9F] mt-1 flex items-center gap-1.5 font-medium truncate">
                        <Mail className="w-3.5 h-3.5 text-[#6B667B]" /> {profile.email}
                    </p>
                </div>
            </motion.div>

            {message ? (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                >
                    {message}
                </motion.div>
            ) : null}
            {error ? (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </motion.div>
            ) : null}

            <motion.div
                variants={panelVariants}
                whileHover={liftHover}
                className="relative overflow-hidden rounded-3xl border border-white/7 bg-[#121017]/92 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.30)] flex flex-col gap-5"
            >
                <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[#7C3AED]/12 blur-3xl" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
                <div className="pb-3 border-b border-white/3">
                    <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400" /> Study Snapshot
                    </h3>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div whileHover={{ y: -3, borderColor: "rgba(223,177,91,0.18)" }} className="relative overflow-hidden rounded-2xl border border-white/7 bg-white/5 p-4 backdrop-blur">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#7C3AED]/12 via-transparent to-transparent" />
                        <div className="relative z-10">
                        <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider block">Current Profile State</span>
                        <span className="text-xs font-semibold text-white/90 block mt-1 leading-relaxed">{profile.institution}</span>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ y: -3, borderColor: "rgba(223,177,91,0.18)" }} className="relative overflow-hidden rounded-2xl border border-white/7 bg-white/5 p-4 backdrop-blur">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#DFB15B]/12 via-transparent to-transparent" />
                        <div className="relative z-10">
                        <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider block">Tracked Activity</span>
                        <span className="text-xs font-semibold text-white/90 block mt-1">{profile.department}</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                variants={panelVariants}
                whileHover={{ y: -5, boxShadow: "0 26px 70px rgba(223,177,91,0.12), 0 20px 60px rgba(0,0,0,0.38)" }}
                className="relative overflow-hidden rounded-3xl border border-[#DFB15B]/22 bg-[#100E16]/95 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.38)]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(223,177,91,0.12),transparent_34%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(49,86,212,0.045)_1px,transparent_1px)] bg-size-[38px_38px]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/70 to-transparent" />
                <motion.div
                    aria-hidden="true"
                    animate={{ opacity: [0.2, 0.55, 0.2], x: ["-20%", "20%", "-20%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent via-white/5 to-transparent"
                />

                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                        <div className="flex items-center gap-2 text-white">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DFB15B]/20 bg-[#DFB15B]/10">
                                <ShieldCheck className="h-4 w-4 text-[#DFB15B]" />
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#DFB15B]">RANK</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.span
                                whileHover={{ scale: 1.04 }}
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${rankTone.badge}`}
                            >
                                {rankInfo.rankName}
                            </motion.span>
                            <motion.span
                                key={progressPercentage}
                                initial={{ scale: 0.9, opacity: 0.7 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white"
                            >
                                {progressPercentage}%
                            </motion.span>
                        </div>
                    </div>

                    <div className="rounded-[1.35rem] border border-white/8 bg-[#08070D] p-1.5 shadow-inner shadow-black/50">
                        <div className="relative h-5 overflow-hidden rounded-full bg-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className={`relative h-full rounded-full bg-linear-to-r ${progressAccent}`}
                            >
                                <div className="absolute inset-0 bg-linear-to-b from-white/45 via-white/10 to-transparent" />
                                <div className="absolute inset-y-0 right-0 w-10 bg-linear-to-r from-transparent to-white/45 blur-sm" />
                                <motion.div
                                    animate={{ x: ["-120%", "120%"] }}
                                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.7, ease: "easeInOut" }}
                                    className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-white/35 to-transparent"
                                />
                            </motion.div>
                            {Number(progressPercentage) > 0 ? (
                                <motion.div
                                    animate={{ scale: [0.9, 1.25, 0.9], opacity: [0.65, 1, 0.65] }}
                                    transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.85)]"
                                    style={{ left: `${progressPercentage}%` }}
                                />
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-[#8E8A9F]">
                        <span className="font-mono text-white/80">{formatRankPoints(rankInfo.pointsIntoLevel)} / {POINTS_PER_LEVEL} RP</span>
                        <span>Total rank points: {formatRankPoints(rankInfo.rankPoints)}</span>
                        <span>{rankInfo.nextRankName ? `${formatRankPoints(rankInfo.pointsToNextLevel)} to ${rankInfo.nextRankName}` : "Top rank reached"}</span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={panelVariants}
                whileHover={liftHover}
                className="relative overflow-hidden rounded-3xl border border-white/7 bg-[#121017]/92 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.30)] flex flex-col gap-5"
            >
                <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 bottom-[-80px] h-56 w-56 rounded-full bg-[#DFB15B]/11 blur-3xl" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
                <div className="pb-3 border-b border-white/3">
                    <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#DFB15B]" /> Current Focus
                    </h3>
                </div>

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <motion.div whileHover={{ y: -4, borderColor: "rgba(223,177,91,0.24)" }} className="relative overflow-hidden rounded-2xl border border-white/7 bg-white/5 p-4 flex flex-col items-start gap-1.5 backdrop-blur">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#DFB15B]/13 via-transparent to-transparent" />
                        <Target className="relative z-10 h-4 w-4 text-[#DFB15B]" />
                        <span className="relative z-10 text-[9px] font-bold text-[#6B667B] uppercase tracking-wider">Target Goal</span>
                        <span className="text-xs font-semibold text-white leading-tight">{profile.targetGoal}</span>
                    </motion.div>

                    <motion.div whileHover={{ y: -4, borderColor: "rgba(167,139,250,0.28)" }} className="relative overflow-hidden rounded-2xl border border-white/7 bg-white/5 p-4 flex flex-col items-start gap-1.5 backdrop-blur">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#7C3AED]/14 via-transparent to-transparent" />
                        <Sparkles className="relative z-10 h-4 w-4 text-[#A78BFA]" />
                        <span className="relative z-10 text-[9px] font-bold text-[#6B667B] uppercase tracking-wider">Focus Area</span>
                        <span className="text-xs font-semibold text-indigo-300 leading-tight">{profile.focusArea}</span>
                    </motion.div>

                    <motion.div whileHover={{ y: -4, borderColor: "rgba(52,211,153,0.28)" }} className="relative overflow-hidden rounded-2xl border border-white/7 bg-white/5 p-4 flex flex-col items-start gap-1.5 backdrop-blur">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-400/13 via-transparent to-transparent" />
                        <Trophy className="relative z-10 h-4 w-4 text-emerald-300" />
                        <span className="relative z-10 text-[9px] font-bold text-[#6B667B] uppercase tracking-wider">Completed Exams</span>
                        <span className="text-xs font-bold text-emerald-400">{profile.mocksCompleted} tracked</span>
                    </motion.div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.form
                    variants={panelVariants}
                    whileHover={liftHover}
                    onSubmit={handleProfileSave}
                    className="relative overflow-hidden rounded-3xl border border-[#DFB15B]/12 bg-[#121017]/92 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.30)] flex flex-col gap-4"
                >
                    <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#DFB15B]/10 blur-3xl" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/45 to-transparent" />
                    <div className="relative z-10 flex items-center gap-2 text-sm font-semibold text-white">
                        <User className="w-4 h-4 text-[#DFB15B]" /> Edit account details
                    </div>
                    <div className="relative z-10 grid grid-cols-1 gap-4">
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Display name</span>
                            <input
                                value={form.name}
                                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                className="w-full rounded-xl border border-white/7 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-[#DFB15B]/35 focus:bg-white/8"
                            />
                        </label>
                        <div className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Email address</span>
                            <div className="flex w-full items-center gap-2 rounded-xl border border-white/7 bg-white/5 px-3 py-2.5 text-sm text-white/70">
                                <Mail className="h-4 w-4 shrink-0 text-[#6B667B]" />
                                <span className="min-w-0 truncate">{profile.email}</span>
                            </div>
                        </div>
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Short bio</span>
                            <textarea
                                rows="3"
                                value={form.bio}
                                onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                                className="w-full rounded-xl border border-white/7 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-[#DFB15B]/35 focus:bg-white/8"
                                placeholder="Tell your future self what matters most"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="relative z-10 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#F6D98B] via-[#DFB15B] to-[#A46F18] px-4 py-2.5 text-sm font-bold text-black shadow-[0_16px_36px_rgba(223,177,91,0.18)] transition hover:brightness-110 disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save profile"}
                    </button>
                </motion.form>

                <motion.form
                    variants={panelVariants}
                    whileHover={liftHover}
                    onSubmit={handlePasswordUpdate}
                    className="relative overflow-hidden rounded-3xl border border-emerald-400/12 bg-[#121017]/92 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.30)] flex flex-col gap-4"
                >
                    <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/45 to-transparent" />
                    <div className="relative z-10 flex items-center gap-2 text-sm font-semibold text-white">
                        <Lock className="w-4 h-4 text-emerald-400" /> Update password
                    </div>
                    <div className="relative z-10 grid grid-cols-1 gap-4">
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Current password</span>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                                className="w-full rounded-xl border border-white/7 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-emerald-300/35 focus:bg-white/8"
                            />
                        </label>
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">New password</span>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                                className="w-full rounded-xl border border-white/7 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-emerald-300/35 focus:bg-white/8"
                            />
                        </label>
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Confirm password</span>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                                className="w-full rounded-xl border border-white/7 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-emerald-300/35 focus:bg-white/8"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="relative z-10 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-300 via-emerald-400 to-teal-500 px-4 py-2.5 text-sm font-bold text-black shadow-[0_16px_36px_rgba(52,211,153,0.16)] transition hover:brightness-110"
                    >
                        <Lock className="h-4 w-4" /> Change password
                    </button>
                </motion.form>
            </div>
        </motion.div>
    );
}
