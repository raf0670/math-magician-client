"use client";
import { useEffect, useState } from "react";
import { User, BookOpen, GraduationCap, ShieldCheck, Mail, Lock, Save } from "lucide-react";
import { changePassword, getMyStats, getStoredUser, saveAuthSession, updateProfile } from "@/lib/api";

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
        currentTier: "Starter",
        level: 1,
        currentXp: 0,
        nextLevelXp: 1000,
    });
    const [form, setForm] = useState({ name: "", email: "", bio: "" });
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
                }));
                setForm({
                    name: currentUser.name || "",
                    email: currentUser.email || "",
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
                const level = Math.max(1, Math.floor(completed / 3) + 1);
                const currentXp = Math.max(0, completed * 250 + Math.round(averageScore * 10));
                const nextLevelXp = level * 1000;

                setProfile((prev) => ({
                    ...prev,
                    mocksCompleted: completed,
                    currentTier: completed >= 3 ? "Vanguard Tracker" : completed >= 1 ? "Rising Student" : "Starter",
                    level,
                    currentXp,
                    nextLevelXp,
                    institution: completed > 0 ? "Self-paced progress" : "Practice dashboard",
                    department: completed > 0 ? `${completed} exam${completed === 1 ? "" : "s"} tracked` : "Exam history will appear here",
                    targetGoal: completed > 0 ? `Average score ${averageScore.toFixed(2)}` : "Complete your first mock exam",
                    focusArea: completed > 0 ? `${history.length} submission${history.length === 1 ? "" : "s"} recorded` : "No submissions yet",
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
            const payload = await updateProfile({ name: form.name, email: form.email, bio: form.bio });
            const updatedUser = payload?.data || {};
            const currentUser = getStoredUser();
            const nextUser = { ...(currentUser || {}), ...updatedUser };
            saveAuthSession(localStorage.getItem("exam_archive_token"), nextUser);
            setProfile((prev) => ({
                ...prev,
                fullName: updatedUser.name || prev.fullName,
                email: updatedUser.email || prev.email,
                bio: updatedUser.bio || prev.bio,
            }));
            setForm({ name: updatedUser.name || "", email: updatedUser.email || "", bio: updatedUser.bio || "" });
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

    const xpPercentage = ((profile.currentXp / profile.nextLevelXp) * 100).toFixed(0);

    return (
        <div className="w-full flex flex-col gap-8 text-left select-none">
            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#E6C687] to-[#AA7C11] p-0.5 shrink-0">
                    <div className="w-full h-full bg-[#121017] rounded-[14px] flex items-center justify-center">
                        <User className="w-6 h-6 text-[#DFB15B]" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-wide truncate">{profile.fullName}</h2>
                        <span className="px-2 py-0.5 rounded bg-[#DFB15B]/10 border border-[#DFB15B]/20 text-[9px] font-bold uppercase text-[#DFB15B] tracking-wider shrink-0">{profile.currentTier}</span>
                    </div>
                    <p className="text-xs text-[#8E8A9F] mt-1 flex items-center gap-1.5 font-medium truncate">
                        <Mail className="w-3.5 h-3.5 text-[#6B667B]" /> {profile.email}
                    </p>
                </div>
            </div>

            {message ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    {message}
                </div>
            ) : null}
            {error ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            ) : null}

            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
                <div className="pb-3 border-b border-white/3">
                    <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400" /> Study Snapshot
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl">
                        <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider block">Current Profile State</span>
                        <span className="text-xs font-semibold text-white/90 block mt-1 leading-relaxed">{profile.institution}</span>
                    </div>
                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl">
                        <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider block">Tracked Activity</span>
                        <span className="text-xs font-semibold text-white/90 block mt-1">{profile.department}</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2 text-white">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Progression</span>
                    </div>
                    <span className="text-[#8E8A9F] font-mono text-[11px]">Level {profile.level} • {profile.currentXp} / {profile.nextLevelXp} XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/3 overflow-hidden">
                    <div className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-300" style={{ width: `${xpPercentage}%` }} />
                </div>
            </div>

            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
                <div className="pb-3 border-b border-white/3">
                    <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#DFB15B]" /> Current Focus
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl flex flex-col items-start gap-1.5">
                        <span className="text-[9px] font-bold text-[#6B667B] uppercase tracking-wider">Target Goal</span>
                        <span className="text-xs font-semibold text-white leading-tight">{profile.targetGoal}</span>
                    </div>

                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl flex flex-col items-start gap-1.5">
                        <span className="text-[9px] font-bold text-[#6B667B] uppercase tracking-wider">Focus Area</span>
                        <span className="text-xs font-semibold text-indigo-300 leading-tight">{profile.focusArea}</span>
                    </div>

                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl flex flex-col items-start gap-1.5">
                        <span className="text-[9px] font-bold text-[#6B667B] uppercase tracking-wider">Completed Exams</span>
                        <span className="text-xs font-bold text-emerald-400">{profile.mocksCompleted} tracked</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <form onSubmit={handleProfileSave} className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <User className="w-4 h-4 text-[#DFB15B]" /> Edit account details
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Display name</span>
                            <input
                                value={form.name}
                                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                className="w-full rounded-xl border border-white/5 bg-[#1A1722] px-3 py-2.5 text-sm text-white outline-none ring-0"
                            />
                        </label>
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Email address</span>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                                className="w-full rounded-xl border border-white/5 bg-[#1A1722] px-3 py-2.5 text-sm text-white outline-none ring-0"
                            />
                        </label>
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Short bio</span>
                            <textarea
                                rows="3"
                                value={form.bio}
                                onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                                className="w-full rounded-xl border border-white/5 bg-[#1A1722] px-3 py-2.5 text-sm text-white outline-none ring-0"
                                placeholder="Tell your future self what matters most"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-4 py-2.5 text-sm font-semibold text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save profile"}
                    </button>
                </form>

                <form onSubmit={handlePasswordUpdate} className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Lock className="w-4 h-4 text-emerald-400" /> Update password
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Current password</span>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                                className="w-full rounded-xl border border-white/5 bg-[#1A1722] px-3 py-2.5 text-sm text-white outline-none ring-0"
                            />
                        </label>
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">New password</span>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                                className="w-full rounded-xl border border-white/5 bg-[#1A1722] px-3 py-2.5 text-sm text-white outline-none ring-0"
                            />
                        </label>
                        <label className="text-sm text-[#8E8A9F]">
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em]">Confirm password</span>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                                className="w-full rounded-xl border border-white/5 bg-[#1A1722] px-3 py-2.5 text-sm text-white outline-none ring-0"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500 hover:text-black"
                    >
                        <Lock className="h-4 w-4" /> Change password
                    </button>
                </form>
            </div>
        </div>
    );
}