"use client";
import { useState, useEffect } from "react";
import { Timer, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

export default function ExamEngine({ onComplete }) {
    const mockExamData = {
        id: "mock-14",
        title: "IBA Diagnostic Full Sprint #14",
        durationSeconds: 3000,
        questions: [
            {
                id: "q-1",
                section: "Quantitative",
                questionText: "If the width of a rectangle is increased by 25% and the length is decreased by 20%, what is the net percentage change in the total surface area?",
                options: { A: "Increases by 5%", B: "Decreases by 5%", C: "Remains completely unchanged", D: "Increases by 4%", E: "None of these" }
            },
            {
                id: "q-2",
                section: "Quantitative",
                questionText: "A cistern can be filled by an inlet pipe in 4 hours, while a drain valve empties it completely in 6 hours. If both valves are twisted open simultaneously, how long takes to fill an empty tank?",
                options: { A: "10 hours", B: "12 hours", C: "8 hours", D: "24 hours", E: "14 hours" }
            },
            {
                id: "q-3",
                section: "English (Verbal)",
                questionText: "Select the grammatically accurate option that rectifies the underlined error: Hanging mid-air by a silver strand, Asif watched the venomous spider drop onto his desk.",
                options: {
                    A: "Hanging mid-air by a silver strand, Asif watched the venomous spider",
                    B: "Asif watched the venomous spider hanging mid-air by a silver strand as it dropped",
                    C: "Watching the venomous spider drop, it hung mid-air by a silver strand on Asif's desk",
                    D: "Hanging mid-air by a silver strand, a venomous spider was watched by Asif dropping",
                    E: "None of these variations are structurally clean"
                }
            }
        ]
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(mockExamData.durationSeconds);

    const currentQuestion = mockExamData.questions[currentIndex];

    useEffect(() => {
        if (timeLeft <= 0) {
            // eslint-disable-next-line react-hooks/immutability
            handleSubmit();
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSelectOption = (optionKey) => {
        setAnswers({ ...answers, [currentQuestion.id]: optionKey });
    };

    const handleClearSelection = () => {
        const updatedAnswers = { ...answers };
        delete updatedAnswers[currentQuestion.id];
        setAnswers(updatedAnswers);
    };

    const handleSubmit = () => {
        if (onComplete) onComplete(answers, mockExamData);
    };

    const isTimeUrgent = timeLeft < 300;

    return (
        <div className="w-full flex flex-col gap-6 text-left">

            {/* ⏱️ TOP TIMING STATUS BAR (Flows naturally on top) */}
            <div className="w-full bg-[#121017] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-bold text-[#DFB15B] uppercase tracking-widest block">Active Examination Sheet</span>
                    <h2 className="text-sm font-semibold text-white mt-0.5">{mockExamData.title}</h2>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm self-start sm:self-auto ${isTimeUrgent ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" : "bg-[#1A1722] border-white/5 text-[#E6C687]"
                    }`}>
                    <Timer className="w-4 h-4" />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* 🏗️ MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* 📝 QUESTION BLOCK */}
                <div className="lg:col-span-7 bg-[#121017] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
                    <div>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                            {currentQuestion.section}
                        </span>
                        <div className="text-[11px] font-bold text-[#6B667B] uppercase tracking-wide mt-3">
                            Question {currentIndex + 1} of {mockExamData.questions.length}
                        </div>
                        <p className="text-base font-medium text-white leading-relaxed tracking-wide mt-2">
                            {currentQuestion.questionText}
                        </p>
                    </div>

                    {/* ACTION DOCK (Directly underneath the question text) */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/3">
                        <button
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex(prev => prev - 1)}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-white/5 bg-[#1A1722] text-xs font-bold uppercase tracking-wide text-[#8E8A9F] hover:text-white disabled:opacity-20 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </button>
                        <button
                            disabled={currentIndex === mockExamData.questions.length - 1}
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-white/5 bg-[#1A1722] text-xs font-bold uppercase tracking-wide text-[#8E8A9F] hover:text-white disabled:opacity-20 transition-colors"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 🎯 OMR BUBBLES BLOCK */}
                <div className="lg:col-span-5 bg-[#121017] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between pb-3 border-b border-white/3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">OMR Options</span>
                        {answers[currentQuestion.id] && (
                            <button onClick={handleClearSelection} className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:underline">
                                Clear Select
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => {
                            const isSelected = answers[currentQuestion.id] === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleSelectOption(key)}
                                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-colors ${isSelected ? "bg-[#DFB15B]/10 border-[#DFB15B]" : "bg-[#1A1722]/50 border-white/5 hover:border-white/10"
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 ${isSelected ? "bg-[#DFB15B] text-black border-[#DFB15B]" : "bg-[#121017] border-white/5 text-[#6B667B]"
                                        }`}>
                                        {key}
                                    </div>
                                    <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-[#8E8A9F]"}`}>
                                        {value}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* INDEX NAVIGATION MATRIX */}
                    <div className="pt-4 border-t border-white/3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B667B] block mb-2">Jump to Question</span>
                        <div className="flex flex-wrap gap-1.5">
                            {mockExamData.questions.map((q, idx) => {
                                const isAnswered = !!answers[q.id];
                                const isCurrent = idx === currentIndex;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors ${isCurrent ? "border-[#DFB15B] text-[#DFB15B] bg-[#DFB15B]/5" : isAnswered ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-[#1A1722] border-white/5 text-[#6B667B]"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SUBMIT TRIGGER AT THE BOTTOM OF THE OMR FORM */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3.5 mt-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-xs font-bold text-white uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                    >
                        Submit Final Answer Sheet
                    </button>
                </div>

            </div>
        </div>
    );
}