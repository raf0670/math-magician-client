"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Ban, CheckCircle, Clock3, Eraser, Infinity, Send, Sparkles } from "lucide-react";
import FormattedText from "@/components/shared/FormattedText";
import { formatSubjectLabel } from "@/lib/rank";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];
const SUBMISSION_REASONS = {
    MANUAL: "manual",
    TIMER_EXPIRED: "timer_expired",
    TAB_SWITCH: "tab_switch",
};
const SUBJECT_NAV_ORDER = ["Maths", "English", "Analytical"];
const ATTEMPT_DEADLINE_STORAGE_PREFIX = "exam_archive_attempt_deadline";

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
    const attemptDeadlineTimestamp = getExamAttemptDeadlineTimestamp(examData);
    if (attemptDeadlineTimestamp !== null) {
        return getRemainingSecondsUntil(attemptDeadlineTimestamp);
    }

    const duration = Number(examData?.duration);
    return Number.isFinite(duration) && duration > 0 ? Math.floor(duration * 60) : null;
}

function getLiveExamHardEndTimestamp(examData) {
    if (examData?.isRetakeMode) return null;
    if (!examData?.isLiveExam || !examData?.endTime) return null;

    const endTime = new Date(examData.endTime).getTime();
    return Number.isNaN(endTime) ? null : endTime;
}

function getExamEndTimeMetadataTimestamp(examData) {
    if (!examData?.endTime) return null;

    const endTime = new Date(examData.endTime).getTime();
    return Number.isNaN(endTime) ? null : endTime;
}

function getDurationMs(examData) {
    const duration = Number(examData?.duration);
    return Number.isFinite(duration) && duration > 0 ? Math.floor(duration * 60 * 1000) : null;
}

function getExamId(examData) {
    const rawId = examData?._id?.$oid || examData?._id || examData?.id;
    return typeof rawId === "string" || typeof rawId === "number" ? rawId.toString() : "";
}

function getAttemptDeadlineStorageKey(examData) {
    const examId = getExamId(examData);
    if (!examId) return "";

    const attemptMode = examData?.isRetakeMode ? "retake" : "primary";
    return `${ATTEMPT_DEADLINE_STORAGE_PREFIX}_${examId}_${attemptMode}`;
}

function getAttemptDeadlineMetadata(examData) {
    return {
        duration: Number(examData?.duration) || 0,
        endTime: getExamEndTimeMetadataTimestamp(examData),
        isRetakeMode: Boolean(examData?.isRetakeMode),
    };
}

function hasMatchingAttemptDeadlineMetadata(storedDeadline, metadata) {
    return (
        storedDeadline?.duration === metadata.duration
        && storedDeadline?.endTime === metadata.endTime
        && storedDeadline?.isRetakeMode === metadata.isRetakeMode
    );
}

function getStoredAttemptDeadlineTimestamp(storageKey, metadata) {
    if (!storageKey || typeof window === "undefined") return null;

    try {
        const storedDeadline = JSON.parse(window.localStorage.getItem(storageKey) || "null");
        const deadlineTimestamp = Number(storedDeadline?.deadlineTimestamp);

        if (
            Number.isFinite(deadlineTimestamp)
            && deadlineTimestamp > 0
            && hasMatchingAttemptDeadlineMetadata(storedDeadline, metadata)
        ) {
            return deadlineTimestamp;
        }

        window.localStorage.removeItem(storageKey);
    } catch {
        window.localStorage.removeItem(storageKey);
    }

    return null;
}

function persistAttemptDeadlineTimestamp(storageKey, metadata, deadlineTimestamp) {
    if (!storageKey || typeof window === "undefined" || !Number.isFinite(deadlineTimestamp)) return;

    try {
        window.localStorage.setItem(storageKey, JSON.stringify({
            ...metadata,
            deadlineTimestamp,
        }));
    } catch {
        // A blocked localStorage should not interrupt the exam timer.
    }
}

function getExamAttemptDeadlineTimestamp(examData) {
    const hardEndTimestamp = getLiveExamHardEndTimestamp(examData);
    if (examData?.examType === "assignment") return hardEndTimestamp;

    const durationMs = getDurationMs(examData);
    if (durationMs === null) return hardEndTimestamp;

    const metadata = getAttemptDeadlineMetadata(examData);
    const storageKey = getAttemptDeadlineStorageKey(examData);
    const storedDeadlineTimestamp = getStoredAttemptDeadlineTimestamp(storageKey, metadata);
    const durationDeadlineTimestamp = storedDeadlineTimestamp || Date.now() + durationMs;
    const deadlineTimestamp = hardEndTimestamp === null
        ? durationDeadlineTimestamp
        : Math.min(durationDeadlineTimestamp, hardEndTimestamp);

    persistAttemptDeadlineTimestamp(storageKey, metadata, deadlineTimestamp);
    return deadlineTimestamp;
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

function getScrollableParent(node) {
    if (typeof window === "undefined") return null;

    let parent = node?.parentElement;
    while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        if (["auto", "scroll", "overlay"].includes(overflowY)) return parent;
        parent = parent.parentElement;
    }

    return null;
}

function getPreferredScrollBehavior() {
    if (typeof window === "undefined") return "auto";
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export default function ExamEngine({ examData, onComplete }) {
    const [activeQuestionId, setActiveQuestionId] = useState("");
    const [answers, setAnswers] = useState({});
    const [eliminatedOptions, setEliminatedOptions] = useState({});
    const [attemptDeadlineTimestamp] = useState(() => getExamAttemptDeadlineTimestamp(examData));
    const [remainingSeconds, setRemainingSeconds] = useState(() => getInitialRemainingSeconds(examData));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submissionStartedRef = useRef(false);
    const tabSwitchSubmittedRef = useRef(false);
    const autoSubmitAttemptedRef = useRef(false);
    const hasHydratedAnswersRef = useRef(false);
    const hasHydratedEliminationsRef = useRef(false);
    const engineRootRef = useRef(null);
    const stickyChromeRef = useRef(null);
    const questionRefs = useRef(new Map());

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

    const activeQuestion = normalizedQuestions.find((question) => question.id === activeQuestionId) || normalizedQuestions[0];
    const activeSubjectGroup = questionGroups.find((group) => group.subjectLabel === activeQuestion?.subjectLabel) || questionGroups[0];
    const answeredCount = normalizedQuestions.filter((question) => answers[question.id] !== undefined).length;
    const skippedCount = normalizedQuestions.length - answeredCount;
    const examTitle = getStudentFacingExamTitle(examData?.title);
    const hasTimedExam = remainingSeconds !== null;
    const isAssignmentExam = examData?.examType === "assignment";
    const answerStorageKey = examData?._id ? `exam_archive_answers_${examData._id}` : "";
    const eliminationStorageKey = examData?._id ? `exam_archive_eliminations_${examData._id}` : "";
    const attemptDeadlineStorageKey = getAttemptDeadlineStorageKey(examData);

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

    useEffect(() => {
        if (!eliminationStorageKey || !normalizedQuestions.length || hasHydratedEliminationsRef.current) return;

        hasHydratedEliminationsRef.current = true;

        try {
            const storedEliminations = window.localStorage.getItem(eliminationStorageKey);
            if (!storedEliminations) return;

            const parsedEliminations = JSON.parse(storedEliminations);
            if (!parsedEliminations || typeof parsedEliminations !== "object" || Array.isArray(parsedEliminations)) return;

            const validQuestionIds = new Set(normalizedQuestions.map((question) => question.id));
            const hydratedEliminations = Object.fromEntries(
                Object.entries(parsedEliminations)
                    .filter(([questionId, options]) => (
                        validQuestionIds.has(questionId)
                        && Array.isArray(options)
                    ))
                    .map(([questionId, options]) => [
                        questionId,
                        [...new Set(options)].filter((optionIndex) => (
                            Number.isInteger(optionIndex)
                            && optionIndex >= 0
                            && optionIndex < OPTION_LABELS.length
                        )),
                    ])
                    .filter(([, options]) => options.length)
            );

            if (Object.keys(hydratedEliminations).length) {
                window.queueMicrotask(() => setEliminatedOptions(hydratedEliminations));
            }
        } catch {
            window.localStorage.removeItem(eliminationStorageKey);
        }
    }, [eliminationStorageKey, normalizedQuestions]);

    useEffect(() => {
        if (!eliminationStorageKey || !hasHydratedEliminationsRef.current) return;

        try {
            if (Object.keys(eliminatedOptions).length) {
                window.localStorage.setItem(eliminationStorageKey, JSON.stringify(eliminatedOptions));
            } else {
                window.localStorage.removeItem(eliminationStorageKey);
            }
        } catch {
            // A full or blocked localStorage should not interrupt the exam.
        }
    }, [eliminationStorageKey, eliminatedOptions]);

    const setQuestionRef = useCallback((questionId, node) => {
        if (node) {
            questionRefs.current.set(questionId, node);
            return;
        }

        questionRefs.current.delete(questionId);
    }, []);

    const scrollToQuestion = useCallback((questionId) => {
        const questionNode = questionRefs.current.get(questionId);
        if (!questionNode) return;

        setActiveQuestionId(questionId);
        const scrollParent = getScrollableParent(questionNode);
        const stickyHeight = stickyChromeRef.current?.getBoundingClientRect().height || 0;
        const offset = stickyHeight + 16;
        const behavior = getPreferredScrollBehavior();

        if (scrollParent) {
            const parentRect = scrollParent.getBoundingClientRect();
            const questionRect = questionNode.getBoundingClientRect();
            scrollParent.scrollTo({
                top: scrollParent.scrollTop + questionRect.top - parentRect.top - offset,
                behavior,
            });
            return;
        }

        const questionRect = questionNode.getBoundingClientRect();
        window.scrollTo({
            top: window.scrollY + questionRect.top - offset,
            behavior,
        });
    }, []);

    useEffect(() => {
        if (!normalizedQuestions.length || !engineRootRef.current) return undefined;

        const firstQuestionId = normalizedQuestions[0].id;
        setActiveQuestionId((currentId) => (
            normalizedQuestions.some((question) => question.id === currentId) ? currentId : firstQuestionId
        ));

        const scrollParent = getScrollableParent(engineRootRef.current);
        const scrollTarget = scrollParent || window;
        let animationFrame = 0;

        const updateActiveQuestion = () => {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = window.requestAnimationFrame(() => {
                const stickyBottom = stickyChromeRef.current?.getBoundingClientRect().bottom || 0;
                const viewportBottom = scrollParent
                    ? Math.min(window.innerHeight, scrollParent.getBoundingClientRect().bottom)
                    : window.innerHeight;
                const availableHeight = Math.max(viewportBottom - stickyBottom, 1);
                const activationY = stickyBottom + Math.min(160, Math.max(72, availableHeight * 0.24));
                let nearestQuestionId = firstQuestionId;
                let nearestDistance = Number.POSITIVE_INFINITY;

                normalizedQuestions.forEach((question) => {
                    const questionNode = questionRefs.current.get(question.id);
                    if (!questionNode) return;

                    const rect = questionNode.getBoundingClientRect();
                    const distance = activationY < rect.top
                        ? rect.top - activationY
                        : activationY > rect.bottom
                            ? activationY - rect.bottom
                            : 0;

                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestQuestionId = question.id;
                    }
                });

                setActiveQuestionId((currentId) => currentId === nearestQuestionId ? currentId : nearestQuestionId);
            });
        };

        updateActiveQuestion();
        scrollTarget.addEventListener("scroll", updateActiveQuestion, { passive: true });
        window.addEventListener("resize", updateActiveQuestion);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            scrollTarget.removeEventListener("scroll", updateActiveQuestion);
            window.removeEventListener("resize", updateActiveQuestion);
        };
    }, [normalizedQuestions]);

    const handleSelectOption = (questionId, optionIndex) => {
        if (!questionId || isSubmitting) return;
        setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: optionIndex }));
    };

    const handleToggleElimination = (questionId, optionIndex) => {
        if (!questionId || isSubmitting) return;

        setEliminatedOptions((currentEliminations) => {
            const currentQuestionEliminations = currentEliminations[questionId] || [];
            const isAlreadyEliminated = currentQuestionEliminations.includes(optionIndex);
            const nextQuestionEliminations = isAlreadyEliminated
                ? currentQuestionEliminations.filter((currentOptionIndex) => currentOptionIndex !== optionIndex)
                : [...currentQuestionEliminations, optionIndex].sort((a, b) => a - b);
            const nextEliminations = { ...currentEliminations };

            if (nextQuestionEliminations.length) {
                nextEliminations[questionId] = nextQuestionEliminations;
            } else {
                delete nextEliminations[questionId];
            }

            return nextEliminations;
        });
    };

    const handleClearSelection = (questionId) => {
        if (!questionId || isSubmitting) return;
        setAnswers((currentAnswers) => {
            const updatedAnswers = { ...currentAnswers };
            delete updatedAnswers[questionId];
            return updatedAnswers;
        });
    };

    const handleSubmit = useCallback(async (submissionReason = SUBMISSION_REASONS.MANUAL) => {
        if (!normalizedQuestions.length || isSubmitting || submissionStartedRef.current) return;
        submissionStartedRef.current = true;
        setIsSubmitting(true);
        const submissionAnswers = normalizedQuestions.map((question) => answers[question.id] ?? -1);
        try {
            if (onComplete) await onComplete(submissionAnswers, examData, { submissionReason });
            if (answerStorageKey) window.localStorage.removeItem(answerStorageKey);
            if (eliminationStorageKey) window.localStorage.removeItem(eliminationStorageKey);
            if (attemptDeadlineStorageKey) window.localStorage.removeItem(attemptDeadlineStorageKey);
        } catch {
            submissionStartedRef.current = false;
            setIsSubmitting(false);
        }
    }, [answerStorageKey, answers, attemptDeadlineStorageKey, eliminationStorageKey, examData, isSubmitting, normalizedQuestions, onComplete]);

    useEffect(() => {
        if (!hasTimedExam) return undefined;

        const timerId = window.setInterval(() => {
            if (attemptDeadlineTimestamp !== null) {
                setRemainingSeconds(getRemainingSecondsUntil(attemptDeadlineTimestamp));
                return;
            }

            setRemainingSeconds((currentSeconds) => {
                if (currentSeconds === null || currentSeconds <= 0) return currentSeconds;
                return currentSeconds - 1;
            });
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [attemptDeadlineTimestamp, hasTimedExam]);

    useEffect(() => {
        if (!hasTimedExam || autoSubmitAttemptedRef.current) return undefined;

        if (attemptDeadlineTimestamp !== null) {
            const delay = Math.max(0, attemptDeadlineTimestamp - Date.now());
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
    }, [attemptDeadlineTimestamp, handleSubmit, hasTimedExam, remainingSeconds]);

    useEffect(() => {
        if (isAssignmentExam) return undefined;

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
    }, [handleSubmit, isAssignmentExam, normalizedQuestions.length]);

    if (!activeQuestion) {
        return <p className="text-sm text-[#8E8A9F]">Preparing the exam...</p>;
    }

    return (
        <div ref={engineRootRef} className="w-full text-left [font-family:var(--font-google-sans),Arial,sans-serif]">
            <div ref={stickyChromeRef} className="sticky top-0 z-40 bg-[#0A090F]/95 pb-3 backdrop-blur-xl">
                <div className="flex w-full flex-col gap-4 rounded-2xl border border-white/8 bg-[#121017]/95 p-4 shadow-2xl shadow-black/30 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#DFB15B]">
                            <Sparkles className="h-3.5 w-3.5" /> Active Examination Sheet
                        </span>
                        <h2 className="mt-1 truncate text-base font-semibold text-white">{examTitle}</h2>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
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
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleSubmit(SUBMISSION_REASONS.MANUAL)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                        >
                            <Send className="h-4 w-4" /> {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>

                <div className="mt-2 space-y-2 lg:hidden">
                    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/5 bg-[#121017]/95 p-2 shadow-lg shadow-black/20">
                        {questionGroups.map((group) => {
                            const isActiveSubject = group.subjectLabel === activeQuestion.subjectLabel;
                            const subjectAnsweredCount = group.questions.filter(({ question }) => answers[question.id] !== undefined).length;
                            return (
                                <button
                                    type="button"
                                    key={group.subjectLabel}
                                    disabled={isSubmitting}
                                    onClick={() => scrollToQuestion(group.questions[0].question.id)}
                                    aria-current={isActiveSubject ? "true" : undefined}
                                    className={`shrink-0 rounded-xl border px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${isActiveSubject ? "border-[#DFB15B]/60 bg-[#DFB15B]/12 text-white" : "border-white/5 bg-[#1A1722] text-[#8E8A9F]"}`}
                                >
                                    <span className="block text-xs font-black">{group.subjectLabel}</span>
                                    <span className={`mt-0.5 block text-[9px] font-bold uppercase tracking-wider ${isActiveSubject ? "text-[#DFB15B]" : "text-[#6B667B]"}`}>
                                        {subjectAnsweredCount}/{group.questions.length} answered
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-white/5 bg-[#121017]/95 p-2 shadow-lg shadow-black/20">
                        {activeSubjectGroup?.questions.map(({ question }) => {
                            const isCurrent = question.id === activeQuestion.id;
                            const isAnswered = answers[question.id] !== undefined;
                            return (
                                <button
                                    type="button"
                                    key={question.id}
                                    disabled={isSubmitting}
                                    onClick={() => scrollToQuestion(question.id)}
                                    aria-label={`Go to question ${question.displayQuestionNo}`}
                                    aria-current={isCurrent ? "step" : undefined}
                                    className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg border px-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${isCurrent ? "border-[#DFB15B] bg-[#DFB15B] text-black" : isAnswered ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-white/5 bg-[#1A1722] text-[#8E8A9F]"}`}
                                >
                                    {question.displayQuestionNo}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-3 grid items-start gap-5 lg:grid-cols-[12rem_minmax(0,1fr)_14rem] xl:grid-cols-[14rem_minmax(0,1fr)_17rem]">
                <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl border border-white/5 bg-[#121017] p-4 shadow-lg shadow-black/10 lg:block" aria-label="Subject navigation">
                    <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">Subjects</span>
                        <p className="mt-1 text-xs font-semibold text-[#A9A3BA]">{answeredCount} answered / {skippedCount} skipped</p>
                    </div>
                    <div className="space-y-2.5">
                        {questionGroups.map((group) => {
                            const isActiveSubject = group.subjectLabel === activeQuestion.subjectLabel;
                            const subjectAnsweredCount = group.questions.filter(({ question }) => answers[question.id] !== undefined).length;
                            const progress = group.questions.length ? (subjectAnsweredCount / group.questions.length) * 100 : 0;
                            return (
                                <button
                                    type="button"
                                    key={group.subjectLabel}
                                    disabled={isSubmitting}
                                    onClick={() => scrollToQuestion(group.questions[0].question.id)}
                                    aria-current={isActiveSubject ? "true" : undefined}
                                    className={`w-full rounded-2xl border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 ${isActiveSubject ? "border-[#DFB15B]/60 bg-[#DFB15B]/10 shadow-md shadow-[#DFB15B]/5" : "border-white/5 bg-[#1A1722]/75 hover:border-white/15"}`}
                                >
                                    <span className={`block text-sm font-black ${isActiveSubject ? "text-white" : "text-[#C9C2D8]"}`}>{group.subjectLabel}</span>
                                    <span className={`mt-1 block text-[10px] font-bold uppercase tracking-wider ${isActiveSubject ? "text-[#DFB15B]" : "text-[#6B667B]"}`}>
                                        {subjectAnsweredCount}/{group.questions.length} answered
                                    </span>
                                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#0A090F]">
                                        <span className={`block h-full rounded-full ${isActiveSubject ? "bg-[#DFB15B]" : "bg-emerald-500"}`} style={{ width: `${progress}%` }} />
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <section className="min-w-0 space-y-5 pb-[35vh]" aria-label="Exam questions">
                    {normalizedQuestions.map((question) => {
                        const isActive = question.id === activeQuestion.id;
                        const selectedAnswer = answers[question.id];
                        return (
                            <article
                                key={question.id}
                                id={`exam-question-${question.id}`}
                                ref={(node) => setQuestionRef(question.id, node)}
                                aria-current={isActive ? "step" : undefined}
                                aria-labelledby={`exam-question-title-${question.id}`}
                                className={`scroll-mt-64 rounded-3xl border bg-[#121017] p-4 shadow-lg shadow-black/10 transition-colors sm:p-6 ${isActive ? "border-[#DFB15B]/35" : "border-white/5"}`}
                            >
                                <div className="rounded-2xl border border-white/5 bg-[#17141F] p-5 sm:p-7">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                                            {question.topic ? `${question.subjectLabel} / ${question.topic}` : question.subjectLabel}
                                        </span>
                                        <span id={`exam-question-title-${question.id}`} className="rounded-lg border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DFB15B]">
                                            Question #{question.displayQuestionNo}
                                        </span>
                                    </div>

                                    <FormattedText
                                        as="p"
                                        value={question.instruction}
                                        className={question.instruction ? "mt-5 text-xs font-semibold leading-relaxed text-[#A9A3BA]" : "hidden"}
                                    />

                                    <FormattedText
                                        as="p"
                                        value={question.questionText}
                                        className={`${question.instruction ? "mt-3" : "mt-5"} text-base font-semibold leading-relaxed tracking-wide text-white sm:text-lg`}
                                    />
                                </div>

                                <div className="mt-4 rounded-2xl border border-white/5 bg-[#17141F] p-4 sm:p-6">
                                    <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">Answer options</span>
                                        {selectedAnswer !== undefined && (
                                            <button
                                                type="button"
                                                disabled={isSubmitting}
                                                onClick={() => handleClearSelection(question.id)}
                                                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Eraser className="h-3.5 w-3.5" /> Clear
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-col gap-3">
                                        {Object.entries(question.options).map(([key, value]) => {
                                            const optionIndex = OPTION_LABELS.indexOf(key);
                                            const isSelected = selectedAnswer === optionIndex;
                                            const isEliminated = (eliminatedOptions[question.id] || []).includes(optionIndex);
                                            return (
                                                <div
                                                    key={key}
                                                    className={`group flex min-h-16 w-full items-stretch gap-2 rounded-2xl border p-2 text-left transition-all ${isSubmitting ? "opacity-70" : ""} ${isSelected ? "border-[#DFB15B] bg-[#DFB15B]/10 shadow-md shadow-[#DFB15B]/5" : "border-white/5 bg-[#121017]/80 hover:border-[#DFB15B]/25 hover:bg-[#1A1722]"} ${isEliminated ? "opacity-55" : ""}`}
                                                >
                                                    <button
                                                        type="button"
                                                        disabled={isSubmitting}
                                                        onClick={() => handleSelectOption(question.id, optionIndex)}
                                                        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2 text-left transition disabled:cursor-not-allowed"
                                                        aria-label={`Question ${question.displayQuestionNo}, option ${key}`}
                                                        aria-pressed={isSelected}
                                                    >
                                                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-black ${isSelected ? "border-[#DFB15B] bg-[#DFB15B] text-black" : "border-white/5 bg-[#1A1722] text-[#8E8A9F] group-hover:border-[#DFB15B]/25 group-hover:text-[#DFB15B]"}`}>
                                                            {key}
                                                        </span>
                                                        <FormattedText
                                                            value={value}
                                                            className={`min-w-0 flex-1 text-sm font-semibold leading-relaxed ${isSelected ? "text-white" : "text-[#C9C2D8]"} ${isEliminated ? "line-through decoration-2 decoration-red-300/80" : ""}`}
                                                        />
                                                        {isSelected ? <CheckCircle className="h-4 w-4 shrink-0 text-[#DFB15B]" /> : null}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isSubmitting}
                                                        onClick={() => handleToggleElimination(question.id, optionIndex)}
                                                        className={`my-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${isEliminated ? "border-red-300/30 bg-red-500/15 text-red-200" : "border-white/5 bg-[#1A1722] text-[#6B667B] hover:border-red-300/25 hover:text-red-200"}`}
                                                        aria-label={`${isEliminated ? "Restore" : "Eliminate"} option ${key} for question ${question.displayQuestionNo}`}
                                                        aria-pressed={isEliminated}
                                                        title={`${isEliminated ? "Restore" : "Eliminate"} option ${key}`}
                                                    >
                                                        <Ban className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </section>

                <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl border border-white/5 bg-[#121017] p-4 shadow-lg shadow-black/10 lg:block" aria-label="Question navigation">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">Question numbers</span>
                            <h3 className="mt-1 text-base font-black text-white">{activeSubjectGroup?.subjectLabel}</h3>
                        </div>
                        <span className="text-[10px] font-bold text-[#DFB15B]">{activeSubjectGroup?.questions.length || 0}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2 xl:grid-cols-5">
                        {activeSubjectGroup?.questions.map(({ question }) => {
                            const isCurrent = question.id === activeQuestion.id;
                            const isAnswered = answers[question.id] !== undefined;
                            return (
                                <button
                                    type="button"
                                    key={question.id}
                                    disabled={isSubmitting}
                                    onClick={() => scrollToQuestion(question.id)}
                                    aria-label={`Go to question ${question.displayQuestionNo}`}
                                    aria-current={isCurrent ? "step" : undefined}
                                    className={`flex aspect-square min-w-0 items-center justify-center rounded-xl border text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${isCurrent ? "border-[#DFB15B] bg-[#DFB15B] text-black shadow-md shadow-[#DFB15B]/10" : isAnswered ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:border-emerald-300/40" : "border-white/5 bg-[#1A1722] text-[#8E8A9F] hover:border-white/15 hover:text-white"}`}
                                >
                                    {question.displayQuestionNo}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-2 border-t border-white/5 pt-4 text-[10px] font-bold uppercase tracking-wider text-[#8E8A9F] xl:grid-cols-2">
                        <span className="flex items-center gap-2"><i aria-hidden="true" className="h-3 w-3 rounded-sm bg-[#DFB15B]" /> Current</span>
                        <span className="flex items-center gap-2"><i aria-hidden="true" className="h-3 w-3 rounded-sm bg-emerald-500" /> Answered</span>
                        <span className="flex items-center gap-2"><i aria-hidden="true" className="h-3 w-3 rounded-sm border border-white/10 bg-[#1A1722]" /> Unanswered</span>
                    </div>
                </aside>
            </div>
        </div>
    );
}
