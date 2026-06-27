"use client";
import { useMemo, useState } from "react";
import { Infinity, ChevronLeft, ChevronRight } from "lucide-react";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

function getQuestionId(question, index) {
    const rawId = question?._id?.$oid || question?._id || question?.id;
    return typeof rawId === "string" || typeof rawId === "number" ? rawId.toString() : `question-${index}`;
}

function getOptionMap(options) {
    if (Array.isArray(options)) {
        return options.reduce((acc, option, optionIndex) => {
            acc[OPTION_LABELS[optionIndex]] = option;
            return acc;
        }, {});
    }

    return options && typeof options === "object" ? options : {};
}

export default function ExamEngine({ examData, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const normalizedQuestions = useMemo(() => {
        if (!examData?.questions?.length) return [];

        return examData.questions.filter(Boolean).map((question, index) => {
            return {
                ...question,
                id: getQuestionId(question, index),
                questionText: question.questionText || question.question || "",
                options: getOptionMap(question.options),
                subject: question.subject || "General",
                topic: question.topic || question.chapter || "",
            };
        });
    }, [examData]);

    const currentQuestion = normalizedQuestions[currentIndex];

    const handleSelectOption = (optionIndex) => {
        if (!currentQuestion) return;
        setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
    };

    const handleClearSelection = () => {
        if (!currentQuestion) return;
        const updatedAnswers = { ...answers };
        delete updatedAnswers[currentQuestion.id];
        setAnswers(updatedAnswers);
    };

    const handleSubmit = () => {
        if (!normalizedQuestions.length) return;
        const submissionAnswers = normalizedQuestions.map((question) => answers[question.id] ?? -1);
        if (onComplete) onComplete(submissionAnswers, examData);
    };

    if (!currentQuestion) {
        return <p className="text-sm text-[#8E8A9F]">Preparing the exam...</p>;
    }

    return (
        <div className="flex w-full flex-col gap-6 text-left">
            <div className="flex w-full flex-col gap-4 rounded-2xl border border-white/5 bg-[#121017] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Active Examination Sheet</span>
                    <h2 className="mt-0.5 text-sm font-semibold text-white">{examData?.title || "Live Mock Test"}</h2>
                </div>
                <div className="flex items-center gap-2 self-start rounded-xl border border-emerald-500/15 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300 sm:self-auto">
                    <Infinity className="h-4 w-4" />
                    <span>Untimed practice</span>
                </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-[#121017] p-6 sm:p-8 lg:col-span-7">
                    <div>
                        <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                            {currentQuestion.topic ? `${currentQuestion.subject} / ${currentQuestion.topic}` : currentQuestion.subject}
                        </span>
                        <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#6B667B]">
                            Question {currentIndex + 1} of {normalizedQuestions.length}
                        </div>
                        <p className="mt-2 text-base font-medium leading-relaxed tracking-wide text-white">
                            {currentQuestion.questionText}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/3 pt-4">
                        <button
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex((prev) => prev - 1)}
                            className="flex items-center gap-1 rounded-xl border border-white/5 bg-[#1A1722] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#8E8A9F] transition-colors hover:text-white disabled:opacity-20"
                        >
                            <ChevronLeft className="h-4 w-4" /> Prev
                        </button>
                        <button
                            disabled={currentIndex === normalizedQuestions.length - 1}
                            onClick={() => setCurrentIndex((prev) => prev + 1)}
                            className="flex items-center gap-1 rounded-xl border border-white/5 bg-[#1A1722] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#8E8A9F] transition-colors hover:text-white disabled:opacity-20"
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-[#121017] p-6 sm:p-8 lg:col-span-5">
                    <div className="flex items-center justify-between border-b border-white/3 pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">OMR Options</span>
                        {answers[currentQuestion.id] !== undefined && (
                            <button onClick={handleClearSelection} className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:underline">
                                Clear Select
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => {
                            const optionIndex = OPTION_LABELS.indexOf(key);
                            const isSelected = answers[currentQuestion.id] === optionIndex;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleSelectOption(optionIndex)}
                                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${isSelected ? "border-[#DFB15B] bg-[#DFB15B]/10" : "border-white/5 bg-[#1A1722]/50 hover:border-white/10"}`}
                                >
                                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${isSelected ? "border-[#DFB15B] bg-[#DFB15B] text-black" : "border-white/5 bg-[#121017] text-[#6B667B]"}`}>
                                        {key}
                                    </div>
                                    <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-[#8E8A9F]"}`}>
                                        {value}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="border-t border-white/3 pt-4">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">Jump to Question</span>
                        <div className="flex flex-wrap gap-1.5">
                            {normalizedQuestions.map((question, idx) => {
                                const isAnswered = answers[question.id] !== undefined;
                                const isCurrent = idx === currentIndex;
                                return (
                                    <button
                                        key={question.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${isCurrent ? "border-[#DFB15B] bg-[#DFB15B]/5 text-[#DFB15B]" : isAnswered ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400" : "border-white/5 bg-[#1A1722] text-[#6B667B]"}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="mt-2 w-full rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:brightness-110"
                    >
                        Submit Final Answer Sheet
                    </button>
                </div>
            </div>
        </div>
    );
}
