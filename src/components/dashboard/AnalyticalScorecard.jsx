"use client";
import { motion } from "framer-motion";
import { Award, CheckCircle, XCircle, AlertTriangle, ArrowLeft, RefreshCw, BookOpen } from "lucide-react";
import Link from "next/link";

export default function AnalyticalScorecard({ answers, examData }) {
    // 🔑 Hardcoded answer keys to simulate the backend scoring logic module
    const solutionKeys = {
        "q-1": "C",
        "q-2": "B",
        "q-3": "B"
    };

    // Calculate baseline evaluation performance numbers
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    examData.questions.forEach(q => {
        const userAnswer = answers[q.id];
        if (!userAnswer) {
            skippedCount++;
        } else if (userAnswer === solutionKeys[q.id]) {
            correctCount++;
        } else {
            incorrectCount++;
        }
    });

    // 🧮 IBA Evaluation Formula: Score = Correct - (0.25 * Incorrect)
    const rawScore = correctCount - (incorrectCount * 0.25);
    const maxPossibleScore = examData.questions.length;
    const accuracyPercentage = maxPossibleScore > 0
        ? ((correctCount / (correctCount + incorrectCount)) * 105).toFixed(1)
        : 0;

    return (
        <div className="w-full select-none flex flex-col gap-8 text-left">

            {/* 🏆 PRIMARY SUMMARY HERO HEADER BANNER */}
            <div className="bg-[#121017] border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
                <div className="absolute right-0 bottom-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    {/* Raw Combined Score Token */}
                    <div className="bg-[#1A1722] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-widest">Calculated Score</span>
                        <span className="font-serif text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400 mt-2">
                            {rawScore.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-semibold text-[#8E8A9F] mt-1">out of {maxPossibleScore}.00</span>
                    </div>

                    {/* Meta breakdowns rows */}
                    <div className="md:col-span-3 grid grid-cols-3 gap-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex flex-col items-start">
                            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase tracking-wide">
                                <CheckCircle className="w-3.5 h-3.5" /> Correct
                            </div>
                            <span className="text-xl font-bold text-white mt-1.5">{correctCount}</span>
                        </div>
                        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex flex-col items-start">
                            <div className="flex items-center gap-1.5 text-red-400 font-bold text-[10px] uppercase tracking-wide">
                                <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </div>
                            <span className="text-xl font-bold text-white mt-1.5">{incorrectCount}</span>
                            <span className="text-[9px] text-red-400/70 font-semibold mt-0.5">Penalty: -{(incorrectCount * 0.25).toFixed(2)}</span>
                        </div>
                        <div className="p-4 bg-white/2 border border-white/5 rounded-xl flex flex-col items-start">
                            <div className="flex items-center gap-1.5 text-[#8E8A9F] font-bold text-[10px] uppercase tracking-wide">
                                <AlertTriangle className="w-3.5 h-3.5" /> Skipped
                            </div>
                            <span className="text-xl font-bold text-white mt-1.5">{skippedCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔍 INDEPTH TOPIC SOLUTION BOARD DIRECTORY */}
            <div className="flex flex-col gap-4">
                <h2 className="font-serif text-xl font-medium text-white tracking-wide flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#DFB15B]" /> Solution Review Board
                </h2>
                <p className="text-xs text-[#6B667B] font-medium -mt-2">
                    Review mistake vectors. Incorrect choices trigger negative markings—verify math formulas and grammatical constraints.
                </p>

                <div className="flex flex-col gap-4 mt-2">
                    {examData.questions.map((q, idx) => {
                        const userAns = answers[q.id];
                        const correctAns = solutionKeys[q.id];
                        const isCorrect = userAns === correctAns;

                        return (
                            <div
                                key={q.id}
                                className={`border rounded-2xl p-5 flex flex-col items-start bg-[#121017]/60 ${!userAns
                                        ? "border-white/5"
                                        : isCorrect
                                            ? "border-emerald-500/20 bg-emerald-500/1"
                                            : "border-red-500/20 bg-red-500/1"
                                    }`}
                            >
                                {/* Header Data Flag tags */}
                                <div className="flex flex-wrap items-center justify-between w-full gap-2 mb-3">
                                    <span className="text-[10px] font-bold text-[#6B667B] uppercase tracking-wider">
                                        Question {idx + 1} • {q.section}
                                    </span>

                                    {!userAns ? (
                                        <span className="px-2 py-0.5 text-[9px] font-bold bg-white/5 text-[#8E8A9F] rounded uppercase">Skipped</span>
                                    ) : isCorrect ? (
                                        <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 rounded uppercase">Correct (+1.00)</span>
                                    ) : (
                                        <span className="px-2 py-0.5 text-[9px] font-bold bg-red-500/10 text-red-400 rounded uppercase">Incorrect (-0.25)</span>
                                    )}
                                </div>

                                {/* Text content block */}
                                <p className="text-xs font-semibold text-white/90 leading-relaxed tracking-wide mb-4">
                                    {q.questionText}
                                </p>

                                {/* Option evaluation display line */}
                                <div className="flex flex-col gap-2 w-full text-xs font-medium">
                                    <div className="p-3 bg-[#1A1722]/50 border border-white/3 rounded-xl flex items-center gap-2">
                                        <span className="text-[#6B667B] font-bold uppercase">Your Selection:</span>
                                        <span className={userAns ? (isCorrect ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold") : "text-[#6B667B]"}>
                                            {userAns ? `${userAns}) ${q.options[userAns]}` : "No answer marked"}
                                        </span>
                                    </div>
                                    {!isCorrect && (
                                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                                            <span className="text-emerald-400 font-bold uppercase">Correct Matrix:</span>
                                            <span className="text-white font-semibold">{correctAns}) {q.options[correctAns]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 🚪 BOTTOM REACTION CONTROL CONTAINER ROW */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-4">
                <Link
                    href="/dashboard/mock-tests"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-[#E6C687] to-[#AA7C11] text-xs font-bold text-black uppercase tracking-wider shadow-md hover:brightness-110 transition-all duration-150"
                >
                    Return to Directory
                </Link>
            </div>

        </div>
    );
}