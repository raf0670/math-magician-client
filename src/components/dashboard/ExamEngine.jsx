"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, Clock3, Eraser, Infinity, Send, Sparkles } from "lucide-react";
import FormattedText from "@/components/shared/FormattedText";
import { formatSubjectLabel } from "@/lib/rank";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];
const SUBMISSION_REASONS = {
    MANUAL: "manual",
    TIMER_EXPIRED: "timer_expired",
    TAB_SWITCH: "tab_switch",
};
const SUBJECT_NAV_ORDER = ["Maths", "English", "Analytical"];

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
    const liveExamEndTimestamp = getLiveExamEndTimestamp(examData);
    if (liveExamEndTimestamp !== null) {
        return getRemainingSecondsUntil(liveExamEndTimestamp);
    }

    const duration = Number(examData?.duration);
    return Number.isFinite(duration) && duration > 0 ? Math.floor(duration * 60) : null;
}

function getLiveExamEndTimestamp(examData) {
    if (!examData?.isLiveExam || !examData?.endTime) return null;

    const endTime = new Date(examData.endTime).getTime();
    return Number.isNaN(endTime) ? null : endTime;
}

function getRemainingSecondsUntil(timestamp) {
    return Math.max(0, Math.ceil((timestamp - Date.now()) / 1000));
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
    const submissionStartedRef = useRef(false);
    const tabSwitchSubmittedRef = useRef(false);
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
                instruction: question.instruction || "",
                options: getOptionMap(question.options),
                subject: question.subject || "General",
                topic: question.topic || question.chapter || "",
                subjectLabel: formatSubjectLabel(question.subject),
            };
        });
    }, [examData]);
    const questionGroups = useMemo(() => {
        const groupBySubject = new Map();

        normalizedQuestions.forEach((question, index) => {
            const subjectLabel = question.subjectLabel || "General";
            const group = groupBySubject.get(subjectLabel) || {
                subjectLabel,
                questions: [],
            };

            group.questions.push({ question, index });
            groupBySubject.set(subjectLabel, group);
        });

        const orderedGroups = SUBJECT_NAV_ORDER
            .map((subjectLabel) => groupBySubject.get(subjectLabel))
            .filter(Boolean);
        const remainingGroups = [...groupBySubject.values()].filter((group) => (
            !SUBJECT_NAV_ORDER.includes(group.subjectLabel)
        ));

        return [...orderedGroups, ...remainingGroups];
    }, [normalizedQuestions]);

    const currentQuestion = normalizedQuestions[currentIndex];
    const answeredCount = normalizedQuestions.filter((question) => answers[question.id] !== undefined).length;
    const skippedCount = normalizedQuestions.length - answeredCount;
    const examTitle = getStudentFacingExamTitle(examData?.title);
    const hasTimedExam = remainingSeconds !== null;
    const liveExamEndTimestamp = useMemo(() => getLiveExamEndTimestamp(examData), [examData]);
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

    const handleSubmit = useCallback(async (submissionReason = SUBMISSION_REASONS.MANUAL) => {
        if (!normalizedQuestions.length || isSubmitting || submissionStartedRef.current) return;
        submissionStartedRef.current = true;
        setIsSubmitting(true);
        const submissionAnswers = normalizedQuestions.map((question) => answers[question.id] ?? -1);
        try {
            if (onComplete) await onComplete(submissionAnswers, examData, { submissionReason });
            if (answerStorageKey) window.localStorage.removeItem(answerStorageKey);
        } catch {
            submissionStartedRef.current = false;
            setIsSubmitting(false);
        }
    }, [answerStorageKey, answers, examData, isSubmitting, normalizedQuestions, onComplete]);

    useEffect(() => {
        if (!hasTimedExam) return undefined;

        const timerId = window.setInterval(() => {
            if (liveExamEndTimestamp !== null) {
                setRemainingSeconds(getRemainingSecondsUntil(liveExamEndTimestamp));
                return;
            }

            setRemainingSeconds((currentSeconds) => {
                if (currentSeconds === null || currentSeconds <= 0) return currentSeconds;
                return currentSeconds - 1;
            });
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [hasTimedExam, liveExamEndTimestamp]);

    useEffect(() => {
        if (!hasTimedExam || autoSubmitAttemptedRef.current) return undefined;

        if (liveExamEndTimestamp !== null) {
            const delay = Math.max(0, liveExamEndTimestamp - Date.now());
            const deadlineTimer = window.setTimeout(() => {
                if (autoSubmitAttemptedRef.current) return;
                autoSubmitAttemptedRef.current = true;
                setRemainingSeconds(0);
                handleSubmit(SUBMISSION_REASONS.TIMER_EXPIRED);
            }, delay);

            return () => window.clearTimeout(deadlineTimer);
        }

        if (remainingSeconds !== 0) return undefined;

        autoSubmitAttemptedRef.current = true;
        const submitTimer = window.setTimeout(() => {
            handleSubmit(SUBMISSION_REASONS.TIMER_EXPIRED);
        }, 0);

        return () => window.clearTimeout(submitTimer);
    }, [handleSubmit, hasTimedExam, liveExamEndTimestamp, remainingSeconds]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (
                document.visibilityState !== "hidden"
                || tabSwitchSubmittedRef.current
                || submissionStartedRef.current
                || !normalizedQuestions.length
            ) {
                return;
            }

            tabSwitchSubmittedRef.current = true;
            handleSubmit(SUBMISSION_REASONS.TAB_SWITCH);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [handleSubmit, normalizedQuestions.length]);

    if (!currentQuestion) {
        return <p className="text-sm text-[#8E8A9F]">Preparing the exam...</p>;
    }

    return (
        <div className="flex w-full flex-col gap-6 text-left [font-family:var(--font-open-sans),sans-serif]">
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
                    <button
                        disabled={isSubmitting}
                        onClick={() => handleSubmit(SUBMISSION_REASONS.MANUAL)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                    >
                        <Send className="h-4 w-4" /> {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-[#121017] p-4 shadow-lg shadow-black/10 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">Question numbers</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
                        {answeredCount} answered / {skippedCount} skipped
                    </span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {questionGroups.map((group) => (
                        <div key={group.subjectLabel} className="flex min-w-42 flex-1 flex-col gap-2">
                            <div className="flex h-9 items-center justify-center rounded-xl border border-white/5 bg-[#1A1722]/70 px-4 text-sm font-black text-white">
                                {group.subjectLabel}
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                                {group.questions.map(({ question, index }) => {
                                    const isAnswered = answers[question.id] !== undefined;
                                    const isCurrent = index === currentIndex;
                                    return (
                                        <button
                                            key={question.id}
                                            disabled={isSubmitting}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`flex h-8 min-w-0 items-center justify-center rounded-lg border px-2 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${isCurrent ? "border-[#DFB15B] bg-[#DFB15B] text-black shadow-md shadow-[#DFB15B]/10" : isAnswered ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-white/5 bg-[#1A1722] text-[#8E8A9F] hover:border-white/15 hover:text-white"}`}
                                        >
                                            {question.displayQuestionNo}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-5 rounded-3xl border border-white/5 bg-[#121017] p-4 shadow-lg shadow-black/10 sm:p-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
                    <div className="rounded-2xl border border-white/5 bg-[#17141F] p-5 sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                                {currentQuestion.topic ? `${currentQuestion.subjectLabel} / ${currentQuestion.topic}` : currentQuestion.subjectLabel}
                            </span>
                            <span className="rounded-lg border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DFB15B]">
                                Question #{currentQuestion.displayQuestionNo}
                            </span>
                        </div>

                        <FormattedText
                            as="p"
                            value={currentQuestion.instruction}
                            className={currentQuestion.instruction ? "mt-5 text-xs font-semibold leading-relaxed text-[#A9A3BA]" : "hidden"}
                        />

                        <FormattedText
                            as="p"
                            value={currentQuestion.questionText}
                            className={`${currentQuestion.instruction ? "mt-3" : "mt-5"} text-base font-semibold leading-relaxed tracking-wide text-white sm:text-lg`}
                        />
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-[#17141F] p-5 sm:p-7">
                        <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">Answer options</span>
                            {answers[currentQuestion.id] !== undefined && (
                                <button disabled={isSubmitting} onClick={handleClearSelection} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:underline disabled:cursor-not-allowed disabled:opacity-50">
                                    <Eraser className="h-3.5 w-3.5" /> Clear
                                </button>
                            )}
                        </div>

                        <div className="mt-5 flex flex-col gap-3">
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
                                        <FormattedText
                                            value={value}
                                            className={`text-sm font-semibold leading-relaxed ${isSelected ? "text-white" : "text-[#C9C2D8]"}`}
                                        />
                                        {isSelected ? <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-[#DFB15B]" /> : null}
                                    </button>
                                );
                            })}
                        </div>
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
        </div>
    );
}
