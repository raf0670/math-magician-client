"use client";
import { useState } from "react";
import { User, BookOpen, Target, GraduationCap, ShieldCheck, Mail } from "lucide-react";

export default function ProfileSettings() {
    // Streamlined data schema tailored specifically for an IBA admission candidate
    const [profile, setProfile] = useState({
        fullName: "Rafid",
        email: "raf0670@buet.ac.bd",
        institution: "Bangladesh University of Engineering and Technology (BUET)",
        department: "Computer Science and Engineering",
        targetGoal: "IBA BBA (34th Batch) / MBA Admission",
        focusArea: "Quantitative Speed & Analytical Reasoning",
        mocksCompleted: 14,
        currentTier: "Vanguard Tracker",
        level: 12,
        currentXp: 2450,
        nextLevelXp: 3000
    });

    const xpPercentage = ((profile.currentXp / profile.nextLevelXp) * 100).toFixed(0);

    return (
        <div className="w-full flex flex-col gap-8 text-left select-none">

            {/* 🛡️ 1. ACCOUNT OVERVIEW IDENTITY CARD */}
            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#E6C687] to-[#AA7C11] p-0.5 shrink-0">
                    <div className="w-full h-full bg-[#121017] rounded-[14px] flex items-center justify-center">
                        <User className="w-6 h-6 text-[#DFB15B]" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white tracking-wide truncate">{profile.fullName}</h2>
                        <span className="px-2 py-0.5 rounded bg-[#DFB15B]/10 border border-[#DFB15B]/20 text-[9px] font-bold uppercase text-[#DFB15B] tracking-wider shrink-0">
                            {profile.currentTier}
                        </span>
                    </div>
                    <p className="text-xs text-[#8E8A9F] mt-1 flex items-center gap-1.5 font-medium truncate">
                        <Mail className="w-3.5 h-3.5 text-[#6B667B]" /> {profile.email}
                    </p>
                </div>
            </div>

            {/* 🏫 2. ACADEMIC CREDENTIALS SECTION */}
            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
                <div className="pb-3 border-b border-white/3">
                    <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400" /> Academic Background
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl">
                        <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider block">Current Institution</span>
                        <span className="text-xs font-semibold text-white/90 block mt-1 leading-relaxed">{profile.institution}</span>
                    </div>
                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl">
                        <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider block">Department / Major</span>
                        <span className="text-xs font-semibold text-white/90 block mt-1">{profile.department}</span>
                    </div>
                </div>
            </div>

            {/* ⚡ 3. LEVEL & PLATFORM PROGRESSION */}
            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2 text-white">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Study Streak Progression</span>
                    </div>
                    <span className="text-[#8E8A9F] font-mono text-[11px]">Level {profile.level} • {profile.currentXp} / {profile.nextLevelXp} XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/3 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                        style={{ width: `${xpPercentage}%` }}
                    />
                </div>
            </div>

            {/* 🎯 4. IBA TARGET PARAMETERS */}
            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
                <div className="pb-3 border-b border-white/3">
                    <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#DFB15B]" /> Admission Target Matrix
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    {/* Target Objective Block */}
                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl flex flex-col items-start gap-1.5">
                        <span className="text-[9px] font-bold text-[#6B667B] uppercase tracking-wider">Target Goal</span>
                        <span className="text-xs font-semibold text-white leading-tight">{profile.targetGoal}</span>
                    </div>

                    {/* Primary Weakness/Focus Area Block */}
                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl flex flex-col items-start gap-1.5">
                        <span className="text-[9px] font-bold text-[#6B667B] uppercase tracking-wider">Focus Concentration</span>
                        <span className="text-xs font-semibold text-indigo-300 leading-tight">{profile.focusArea}</span>
                    </div>

                    {/* Total Mocks Tallied Block */}
                    <div className="p-4 bg-[#1A1722]/50 border border-white/5 rounded-xl flex flex-col items-start gap-1.5">
                        <span className="text-[9px] font-bold text-[#6B667B] uppercase tracking-wider">Diagnostic Endurance</span>
                        <span className="text-xs font-bold text-emerald-400">{profile.mocksCompleted} Full Mocks Evaluated</span>
                    </div>
                </div>
            </div>

        </div>
    );
}