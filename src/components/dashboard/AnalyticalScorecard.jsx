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

export default function AnalyticalScorecard({ answers, examData, submissionResult }) {
    const normalizedAnswers = Array.isArray(answers) ? answers : [];
    const questions = examData?.questions || [];
    const penalty = Number(examData?.negativeMarksPerQuestion ?? 0);
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

    const calculatedScore = (correctCount * marksPerQuestion) - (incorrectCount * penalty);
    const shownScore = Number(submissionResult?.score ?? calculatedScore);
    const maxPossibleScore = Number(examData?.totalMarks || questions.length);

    return (
        <div className="flex w-full select-none flex-col gap-8 text-left">
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#121017] p-6 shadow-lg sm:p-8">
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-4">
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#1A1722] p-6 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">Calculated Score</span>
                        <span className="mt-2 bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text font-serif text-4xl font-bold text-transparent">
                            {shownScore.toFixed(2)}
                        </span>
                        <span className="mt-1 text-[10px] font-semibold text-[#8E8A9F]">out of {maxPossibleScore.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-3">
                        <div className="flex flex-col items-start rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                                <CheckCircle className="h-3.5 w-3.5" /> Correct
                            </div>
                            <span className="mt-1.5 text-xl font-bold text-white">{correctCount}</span>
                        </div>
                        <div className="flex flex-col items-start rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-red-400">
                                <XCircle className="h-3.5 w-3.5" /> Incorrect
                            </div>
                            <span className="mt-1.5 text-xl font-bold text-white">{incorrectCount}</span>
                            <span className="mt-0.5 text-[9px] font-semibold text-red-400/70">Penalty: -{(incorrectCount * penalty).toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col items-start rounded-xl border border-white/5 bg-white/2 p-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#8E8A9F]">
                                <AlertTriangle className="h-3.5 w-3.5" /> Skipped
                            </div>
                            <span className="mt-1.5 text-xl font-bold text-white">{skippedCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {submissionResult ? (
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4 text-sm text-emerald-300">
                    Backend submission received. Score: {Number(submissionResult.score).toFixed(2)} / {submissionResult.totalMarks}
                </div>
            ) : null}

            <div className="flex flex-col gap-4">
                <h2 className="flex items-center gap-2 font-serif text-xl font-medium tracking-wide text-white">
                    <BookOpen className="h-5 w-5 text-[#DFB15B]" /> Solution Review Board
                </h2>
                <p className="-mt-2 text-xs font-medium text-[#6B667B]">
                    Review each answer, the correct choice, and the explanation from the question bank.
                </p>

                <div className="mt-2 flex flex-col gap-4">
                    {questions.map((question, idx) => {
                        const userAns = normalizedAnswers[idx];
                        const reviewItem = submissionResult?.review?.[idx];
                        const correctAns = getCorrectOptionIndex(question, reviewItem);
                        const isSkipped = userAns === undefined || userAns === null || userAns === -1;
                        const isCorrect = userAns === correctAns;
                        const selectedLabel = isSkipped ? null : OPTION_LABELS[userAns];
                        const correctLabel = correctAns === undefined || correctAns === null ? null : OPTION_LABELS[correctAns];
                        const optionList = getOptionList(question.options);
                        const explanation = question.explanation || reviewItem?.explanation || "";

                        return (
                            <div
                                key={question._id || question.id || idx}
                                className={`flex flex-col items-start rounded-2xl border bg-[#121017]/60 p-5 ${isSkipped ? "border-white/5" : isCorrect ? "border-emerald-500/20 bg-emerald-500/1" : "border-red-500/20 bg-red-500/1"}`}
                            >
                                <div className="mb-3 flex w-full flex-wrap items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">
                                        Question {idx + 1} - {question.topic || question.chapter || question.subject || "General"}
                                    </span>

                                    {isSkipped ? (
                                        <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase text-[#8E8A9F]">Skipped</span>
                                    ) : isCorrect ? (
                                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-400">Correct (+{marksPerQuestion.toFixed(2)})</span>
                                    ) : (
                                        <span className="rounded bg-red-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-red-400">Incorrect (-{penalty.toFixed(2)})</span>
                                    )}
                                </div>

                                <p className="mb-4 text-xs font-semibold leading-relaxed tracking-wide text-white/90">
                                    {question.questionText || question.question}
                                </p>

                                <div className="flex w-full flex-col gap-2 text-xs font-medium">
                                    <div className="flex flex-col gap-1 rounded-xl border border-white/3 bg-[#1A1722]/50 p-3 sm:flex-row sm:items-center sm:gap-2">
                                        <span className="font-bold uppercase text-[#6B667B]">Your Selection:</span>
                                        <span className={selectedLabel ? (isCorrect ? "font-semibold text-emerald-400" : "font-semibold text-red-400") : "text-[#6B667B]"}>
                                            {selectedLabel ? `${selectedLabel}) ${optionList[userAns] || "Unavailable option"}` : "No answer marked"}
                                        </span>
                                    </div>

                                    {(!isCorrect || isSkipped) && correctLabel ? (
                                        <div className="flex flex-col gap-1 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 sm:flex-row sm:items-center sm:gap-2">
                                            <span className="font-bold uppercase text-emerald-400">Correct Answer:</span>
                                            <span className="font-semibold text-white">{correctLabel}) {optionList[correctAns] || question.correctAnswer || question.correct_answer || reviewItem?.correctAnswer || "Unavailable option"}</span>
                                        </div>
                                    ) : null}

                                    {explanation ? (
                                        <div className="rounded-xl border border-[#DFB15B]/10 bg-[#DFB15B]/5 p-3">
                                            <span className="mb-1 block font-bold uppercase text-[#DFB15B]">Explanation</span>
                                            <span className="block leading-relaxed text-[#D8D3C7]">{explanation}</span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-4">
                <Link
                    href="/dashboard/mock-tests"
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#E6C687] to-[#AA7C11] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-md transition-all duration-150 hover:brightness-110"
                >
                    Return to Exam System
                </Link>
            </div>
        </div>
    );
}
