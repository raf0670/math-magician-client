"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, Clock3, Eraser, Infinity, Send, Sparkles } from "lucide-react";

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

function getEffectivePenalty(value) {
    const penalty = Number(value);
    return Number.isFinite(penalty) && penalty > 0 ? penalty : 0.25;
}

function getStudentFacingExamTitle(title, fallback = "Live Mock Test") {
    const cleanedTitle = title
        ?.toString()
        .replace(/\((\d+)\s+Random Questions\)/gi, "($1 Questions)")
        .replace(/\bRandom Questions\b/gi, "Questions")
        .replace(/\bRandom\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();

    return cleanedTitle || fallback;
}

function getInitialRemainingSeconds(examData) {
    if (examData?.isLiveExam && examData?.endTime) {
        const endTime = new Date(examData.endTime).getTime();
        if (!Number.isNaN(endTime)) {
            return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        }
    }

    const duration = Number(examData?.duration);
    return Number.isFinite(duration) && duration > 0 ? Math.floor(duration * 60) : null;
}

function formatRemainingTime(totalSeconds) {
    const safeSeconds = Math.max(Number(totalSeconds) || 0, 0);
    const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
    const seconds = (safeSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

export default function ExamEngine({ examData, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [remainingSeconds, setRemainingSeconds] = useState(() => getInitialRemainingSeconds(examData));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timerSubmittedRef = useRef(false);
    const autoSubmitAttemptedRef = useRef(false);
    const hasHydratedAnswersRef = useRef(false);

    const normalizedQuestions = useMemo(() => {
        if (!examData?.questions?.length) return [];

        return examData.questions.filter(Boolean).map((question, index) => {
            return {
                ...question,
                id: getQuestionId(question, index),
                questionNo: question.question_no || question.questionNo || index + 1,
                displayQuestionNo: index + 1,
                questionText: question.questionText || question.question || "",
                options: getOptionMap(question.options),
                subject: question.subject || "General",
                topic: question.topic || question.chapter || "",
            };
        });
    }, [examData]);

    const currentQuestion = normalizedQuestions[currentIndex];
    const answeredCount = normalizedQuestions.filter((question) => answers[question.id] !== undefined).length;
    const skippedCount = normalizedQuestions.length - answeredCount;
    const penalty = getEffectivePenalty(examData?.negativeMarksPerQuestion);
    const examTitle = getStudentFacingExamTitle(examData?.title);
    const hasTimedExam = remainingSeconds !== null;
    const answerStorageKey = examData?._id ? `exam_archive_answers_${examData._id}` : "";

    useEffect(() => {
        if (!answerStorageKey || !normalizedQuestions.length || hasHydratedAnswersRef.current) return;

        hasHydratedAnswersRef.current = true;

        try {
            const storedAnswers = window.localStorage.getItem(answerStorageKey);
            if (!storedAnswers) return;

            const parsedAnswers = JSON.parse(storedAnswers);
            if (!parsedAnswers || typeof parsedAnswers !== "object" || Array.isArray(parsedAnswers)) return;

            const validQuestionIds = new Set(normalizedQuestions.map((question) => question.id));
            const hydratedAnswers = Object.fromEntries(
                Object.entries(parsedAnswers).filter(([questionId, answer]) => (
                    validQuestionIds.has(questionId)
                    && Number.isInteger(answer)
                    && answer >= 0
                    && answer < OPTION_LABELS.length
                ))
            );

            if (Object.keys(hydratedAnswers).length) {
                window.queueMicrotask(() => setAnswers(hydratedAnswers));
            }
        } catch {
            window.localStorage.removeItem(answerStorageKey);
        }
    }, [answerStorageKey, normalizedQuestions]);

    useEffect(() => {
        if (!answerStorageKey || !hasHydratedAnswersRef.current) return;

        try {
            if (Object.keys(answers).length) {
                window.localStorage.setItem(answerStorageKey, JSON.stringify(answers));
            } else {
                window.localStorage.removeItem(answerStorageKey);
            }
        } catch {
            // A full or blocked localStorage should not interrupt the exam.
        }
    }, [answerStorageKey, answers]);

    const handleSelectOption = (optionIndex) => {
        if (!currentQuestion || isSubmitting) return;
        setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
    };

    const handleClearSelection = () => {
        if (!currentQuestion || isSubmitting) return;
        const updatedAnswers = { ...answers };
        delete updatedAnswers[currentQuestion.id];
        setAnswers(updatedAnswers);
    };

    const handleSubmit = useCallback(async () => {
        if (!normalizedQuestions.length || isSubmitting || timerSubmittedRef.current) return;
        timerSubmittedRef.current = true;
        setIsSubmitting(true);
        const submissionAnswers = normalizedQuestions.map((question) => answers[question.id] ?? -1);
        try {
            if (onComplete) await onComplete(submissionAnswers, examData);
            if (answerStorageKey) window.localStorage.removeItem(answerStorageKey);
        } catch {
            timerSubmittedRef.current = false;
            setIsSubmitting(false);
        }
    }, [answerStorageKey, answers, examData, isSubmitting, normalizedQuestions, onComplete]);

    useEffect(() => {
        if (!hasTimedExam) return undefined;

        const timerId = window.setInterval(() => {
            setRemainingSeconds((currentSeconds) => {
                if (currentSeconds === null || currentSeconds <= 0) return currentSeconds;
                return currentSeconds - 1;
            });
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [hasTimedExam]);

    useEffect(() => {
        if (!hasTimedExam || remainingSeconds !== 0 || autoSubmitAttemptedRef.current) return undefined;

        autoSubmitAttemptedRef.current = true;
        const submitTimer = window.setTimeout(() => {
            handleSubmit();
        }, 0);

        return () => window.clearTimeout(submitTimer);
    }, [handleSubmit, hasTimedExam, remainingSeconds]);

    if (!currentQuestion) {
        return <p className="text-sm text-[#8E8A9F]">Preparing the exam...</p>;
    }

    return (
        <div className="flex w-full flex-col gap-6 text-left">
            <div className="flex w-full flex-col gap-4 rounded-2xl border border-white/5 bg-[#121017] p-4 shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#DFB15B]">
                        <Sparkles className="h-3.5 w-3.5" /> Active Examination Sheet
                    </span>
                    <h2 className="mt-1 text-base font-semibold text-white">{examTitle}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {hasTimedExam ? (
                        <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${remainingSeconds <= 60 ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-emerald-500/15 bg-emerald-500/10 text-emerald-300"}`}>
                            <Clock3 className="h-4 w-4" />
                            <span>{formatRemainingTime(remainingSeconds)} left</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
                            <Infinity className="h-4 w-4" />
                            <span>Untimed practice</span>
                        </div>
                    )}
                    <div className="rounded-xl border border-red-500/15 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300">
                        Wrong: -{penalty.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                <div className="flex flex-col gap-5 rounded-3xl border border-white/5 bg-[#121017] p-4 shadow-lg shadow-black/10 sm:p-6 lg:col-span-8">
                    <div className="rounded-2xl border border-white/5 bg-[#1A1722]/55 p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">Question numbers</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
                                {answeredCount}/{normalizedQuestions.length} answered
                            </span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {normalizedQuestions.map((question, idx) => {
                                const isAnswered = answers[question.id] !== undefined;
                                const isCurrent = idx === currentIndex;
                                return (
                                    <button
                                        key={question.id}
                                        disabled={isSubmitting}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`flex h-10 min-w-16 items-center justify-center rounded-xl border px-3 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${isCurrent ? "border-[#DFB15B] bg-[#DFB15B] text-black shadow-md shadow-[#DFB15B]/10" : isAnswered ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-white/5 bg-[#121017] text-[#8E8A9F] hover:border-white/15 hover:text-white"}`}
                                    >
                                        #{question.displayQuestionNo}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-[#17141F] p-5 sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                                {currentQuestion.topic ? `${currentQuestion.subject} / ${currentQuestion.topic}` : currentQuestion.subject}
                            </span>
                            <span className="rounded-lg border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DFB15B]">
                                Question #{currentQuestion.displayQuestionNo}
                            </span>
                        </div>

                        <p className="mt-5 text-base font-semibold leading-relaxed tracking-wide text-white sm:text-lg">
                            {currentQuestion.questionText}
                        </p>

                        <div className="mt-6 flex flex-col gap-3">
                            {Object.entries(currentQuestion.options).map(([key, value]) => {
                                const optionIndex = OPTION_LABELS.indexOf(key);
                                const isSelected = answers[currentQuestion.id] === optionIndex;
                                return (
                                    <button
                                        key={key}
                                        disabled={isSubmitting}
                                        onClick={() => handleSelectOption(optionIndex)}
                                        className={`group flex min-h-16 w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-70 ${isSelected ? "border-[#DFB15B] bg-[#DFB15B]/10 shadow-md shadow-[#DFB15B]/5" : "border-white/5 bg-[#121017]/80 hover:border-[#DFB15B]/25 hover:bg-[#1A1722]"}`}
                                    >
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-black ${isSelected ? "border-[#DFB15B] bg-[#DFB15B] text-black" : "border-white/5 bg-[#1A1722] text-[#8E8A9F] group-hover:border-[#DFB15B]/25 group-hover:text-[#DFB15B]"}`}>
                                            {key}
                                        </div>
                                        <span className={`text-sm font-semibold leading-relaxed ${isSelected ? "text-white" : "text-[#C9C2D8]"}`}>
                                            {value}
                                        </span>
                                        {isSelected ? <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-[#DFB15B]" /> : null}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#1A1722]/45 p-3">
                        <button
                            disabled={currentIndex === 0 || isSubmitting}
                            onClick={() => setCurrentIndex((prev) => prev - 1)}
                            className="flex items-center gap-1 rounded-xl border border-white/5 bg-[#121017] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#8E8A9F] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                        >
                            <ChevronLeft className="h-4 w-4" /> Prev
                        </button>
                        <button
                            disabled={currentIndex === normalizedQuestions.length - 1 || isSubmitting}
                            onClick={() => setCurrentIndex((prev) => prev + 1)}
                            className="flex items-center gap-1 rounded-xl border border-white/5 bg-[#121017] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#8E8A9F] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-5 rounded-3xl border border-white/5 bg-[#121017] p-5 shadow-lg shadow-black/10 sm:p-6 lg:col-span-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Answered</span>
                            <span className="mt-1 block text-2xl font-bold text-white">{answeredCount}</span>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-[#1A1722]/60 p-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8E8A9F]">Skipped</span>
                            <span className="mt-1 block text-2xl font-bold text-white">{skippedCount}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">Current answer</span>
                        {answers[currentQuestion.id] !== undefined && (
                            <button disabled={isSubmitting} onClick={handleClearSelection} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:underline disabled:cursor-not-allowed disabled:opacity-50">
                                <Eraser className="h-3.5 w-3.5" /> Clear
                            </button>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[#DFB15B]/10 bg-[#DFB15B]/5 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">Marked option</span>
                        <span className="mt-2 block text-sm font-bold text-white">
                            {answers[currentQuestion.id] === undefined ? "No option selected" : `Option ${OPTION_LABELS[answers[currentQuestion.id]]}`}
                        </span>
                        <p className="mt-2 text-[11px] font-medium leading-relaxed text-[#8E8A9F]">
                            Skip has no penalty. Only an incorrect marked option subtracts marks.
                        </p>
                    </div>

                    <button
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                    >
                        <Send className="h-4 w-4" /> {isSubmitting ? "Submitting Answer Sheet..." : "Submit Final Answer Sheet"}
                    </button>
                </div>
            </div>
        </div>
    );
}
