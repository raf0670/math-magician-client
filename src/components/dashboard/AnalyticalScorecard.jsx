"use client";
import { AlertTriangle, BookOpen, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

function getOptionList(options) {
    if (Array.isArray(options)) return options;
    return OPTION_LABELS.map((label) => options?.[label]).filter(Boolean);
}

function normalizeOptionText(value) {
    return value?.toString().trim().toLowerCase() || "";
}

function stripOptionLabel(value) {
    return normalizeOptionText(value).replace(/^[a-e]\s*[\).:-]\s*/, "").trim();
}

function getCorrectOptionIndex(question, reviewItem) {
    if (Number.isInteger(question?.correctOptionIndex)) return question.correctOptionIndex;
    if (Number.isInteger(reviewItem?.correctOptionIndex)) return reviewItem.correctOptionIndex;

    const optionList = getOptionList(question?.options);
    const correctAnswer = question?.correctAnswer || question?.correct_answer || reviewItem?.correctAnswer;
    const normalizedCorrectAnswer = normalizeOptionText(correctAnswer);
    if (!normalizedCorrectAnswer) return null;

    const exactIndex = optionList.findIndex((option) => normalizeOptionText(option) === normalizedCorrectAnswer);
    if (exactIndex >= 0) return exactIndex;

    const strippedCorrectAnswer = stripOptionLabel(correctAnswer);
    const strippedIndex = optionList.findIndex((option) => stripOptionLabel(option) === strippedCorrectAnswer);
    if (strippedIndex >= 0) return strippedIndex;

    const labelMatch = normalizedCorrectAnswer.match(/^([a-e])(?:\s*[\).:-])?$/);
    return labelMatch ? OPTION_LABELS.indexOf(labelMatch[1].toUpperCase()) : null;
}

function getEffectivePenalty(value) {
    const penalty = Number(value);
    return Number.isFinite(penalty) && penalty > 0 ? penalty : 0.25;
}

export default function AnalyticalScorecard({ answers, examData, submissionResult, returnHref = "/dashboard/mock-tests", returnLabel = "Return to Practice" }) {
    const normalizedAnswers = Array.isArray(answers) ? answers : [];
    const questions = examData?.questions || [];
    const penalty = getEffectivePenalty(submissionResult?.negativeMarksPerQuestion ?? examData?.negativeMarksPerQuestion);
    const marksPerQuestion = questions.length ? Number(examData?.totalMarks || questions.length) / questions.length : 1;

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    questions.forEach((question, index) => {
        const userAnswer = normalizedAnswers[index];
        const correctAnswer = getCorrectOptionIndex(question, submissionResult?.review?.[index]);
        if (userAnswer === undefined || userAnswer === null || userAnswer === -1) {
            skippedCount += 1;
        } else if (userAnswer === correctAnswer) {
            correctCount += 1;
        } else {
            incorrectCount += 1;
        }
    });

    const totalPenalty = incorrectCount * penalty;
    const calculatedScore = (correctCount * marksPerQuestion) - totalPenalty;
    const shownScore = Number(submissionResult?.score ?? calculatedScore);
    const maxPossibleScore = Number(examData?.totalMarks || questions.length);

    return (
        <div className="flex w-full select-none flex-col gap-8 px-3 text-left sm:px-4 lg:px-6">
            <div className="rounded-3xl border border-white/5 bg-[#121017] p-5 shadow-lg shadow-black/10 sm:p-7">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <div className="flex flex-col justify-center rounded-2xl border border-[#DFB15B]/15 bg-[#DFB15B]/5 p-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">Final Score</span>
                        <span className="mt-2 bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text font-serif text-5xl font-bold text-transparent">
                            {shownScore.toFixed(2)}
                        </span>
                        <span className="mt-1 text-xs font-semibold text-[#8E8A9F]">out of {maxPossibleScore.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                                <CheckCircle className="h-3.5 w-3.5" /> Correct
                            </div>
                            <span className="mt-2 block text-2xl font-bold text-white">{correctCount}</span>
                            <span className="text-[10px] font-semibold text-emerald-300/70">+{(correctCount * marksPerQuestion).toFixed(2)} marks</span>
                        </div>
                        <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-red-300">
                                <XCircle className="h-3.5 w-3.5" /> Wrong
                            </div>
                            <span className="mt-2 block text-2xl font-bold text-white">{incorrectCount}</span>
                            <span className="text-[10px] font-semibold text-red-300/70">-{totalPenalty.toFixed(2)} penalty</span>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-[#1A1722]/70 p-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#8E8A9F]">
                                <AlertTriangle className="h-3.5 w-3.5" /> Skipped
                            </div>
                            <span className="mt-2 block text-2xl font-bold text-white">{skippedCount}</span>
                            <span className="text-[10px] font-semibold text-[#8E8A9F]">No penalty</span>
                        </div>
                    </div>
                </div>
            </div>

            {submissionResult ? (
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3 text-sm font-semibold text-emerald-300">
                    Backend submission received. Score: {Number(submissionResult.score).toFixed(2)} / {submissionResult.totalMarks}
                </div>
            ) : null}

            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="flex items-center gap-2 font-serif text-2xl font-medium tracking-wide text-white">
                        <BookOpen className="h-5 w-5 text-[#DFB15B]" /> Solution Review
                    </h2>
                    <p className="mt-1 text-xs font-medium text-[#8E8A9F]">
                        Review every question, selected option, correct answer, and explanation.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {questions.map((question, idx) => {
                        const userAns = normalizedAnswers[idx];
                        const reviewItem = submissionResult?.review?.[idx];
                        const correctAns = getCorrectOptionIndex(question, reviewItem);
                        const isSkipped = userAns === undefined || userAns === null || userAns === -1;
                        const isCorrect = userAns === correctAns;
                        const optionList = getOptionList(question.options);
                        const explanation = question.explanation || reviewItem?.explanation || "";

                        return (
                            <div
                                key={question._id || question.id || idx}
                                className={`rounded-3xl border bg-[#121017] p-4 shadow-lg shadow-black/10 sm:p-6 ${isSkipped ? "border-white/5" : isCorrect ? "border-emerald-500/20" : "border-red-500/20"}`}
                            >
                                <div className="mb-5 flex w-full flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
                                            Question #{idx + 1}
                                        </span>
                                        <span className="mt-1 block text-[11px] font-semibold text-[#6B667B]">
                                            {question.topic || question.chapter || question.subject || "General"}
                                        </span>
                                    </div>

                                    {isSkipped ? (
                                        <span className="rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase text-[#8E8A9F]">Skipped (0)</span>
                                    ) : isCorrect ? (
                                        <span className="rounded-xl border border-emerald-500/10 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase text-emerald-300">Correct (+{marksPerQuestion.toFixed(2)})</span>
                                    ) : (
                                        <span className="rounded-xl border border-red-500/10 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold uppercase text-red-300">Wrong (-{penalty.toFixed(2)})</span>
                                    )}
                                </div>

                                <p className="text-sm font-semibold leading-relaxed tracking-wide text-white sm:text-base">
                                    {question.questionText || question.question}
                                </p>

                                <div className="mt-5 grid grid-cols-1 gap-2">
                                    {optionList.map((option, optionIndex) => {
                                        const isUserSelected = userAns === optionIndex;
                                        const isCorrectOption = correctAns === optionIndex;
                                        const optionStateClass = isCorrectOption
                                            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100"
                                            : isUserSelected
                                                ? "border-red-500/25 bg-red-500/10 text-red-100"
                                                : "border-white/5 bg-[#1A1722]/55 text-[#C9C2D8]";

                                        return (
                                            <div key={`${question._id || idx}-${optionIndex}`} className={`flex min-h-14 items-start gap-3 rounded-2xl border p-3 ${optionStateClass}`}>
                                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${isCorrectOption ? "border-emerald-400 bg-emerald-400 text-black" : isUserSelected ? "border-red-400 bg-red-400 text-black" : "border-white/5 bg-[#121017] text-[#8E8A9F]"}`}>
                                                    {OPTION_LABELS[optionIndex]}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <span className="block text-sm font-semibold leading-relaxed">{option}</span>
                                                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider opacity-80">
                                                        {isCorrectOption && isUserSelected ? "Your answer and correct answer" : isCorrectOption ? "Correct answer" : isUserSelected ? "Your answer" : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-5 rounded-2xl border border-[#DFB15B]/10 bg-[#DFB15B]/5 p-4">
                                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">Explanation</span>
                                    <span className="block text-sm font-medium leading-relaxed text-[#D8D3C7]">
                                        {explanation || "No explanation has been added for this question yet."}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-2 flex items-center gap-4 border-t border-white/5 pt-5">
                <Link
                    href={returnHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#E6C687] to-[#AA7C11] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-md transition-all duration-150 hover:brightness-110"
                >
                    {returnLabel}
                </Link>
            </div>
        </div>
    );
}
