"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, Brain, Clock3, Gauge, Hash, Play, RefreshCw, SlidersHorizontal, Sparkles } from "lucide-react";
import { startQuizExam } from "@/lib/api";
import { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QUESTION_PRESETS = [20, 30, 40, 60];
const DURATION_PRESETS = [20, 30, 45, 60];

export default function QuizDashboardLanding() {
    const router = useRouter();
    const [questionCount, setQuestionCount] = useState("20");
    const [duration, setDuration] = useState("30");
    const [difficulty, setDifficulty] = useState("Easy");
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");

    const parsedQuestionCount = Number(questionCount);
    const parsedDuration = Number(duration);
    const hasValidQuestionCount = Number.isInteger(parsedQuestionCount) && parsedQuestionCount >= 20;
    const hasValidDuration = Number.isInteger(parsedDuration) && parsedDuration > 0;
    const canStartQuiz = hasValidQuestionCount && hasValidDuration && difficulty && !starting;

    const ratioPreview = useMemo(() => {
        if (!hasValidQuestionCount) return { English: 0, Math: 0, Analytical: 0 };

        const rawTargets = [
            { subject: "English", raw: parsedQuestionCount * 0.45, index: 0 },
            { subject: "Math", raw: parsedQuestionCount * 0.35, index: 1 },
            { subject: "Analytical", raw: parsedQuestionCount * 0.2, index: 2 },
        ].map((item) => ({
            ...item,
            count: Math.floor(item.raw),
            remainder: item.raw - Math.floor(item.raw),
        }));

        let remaining = parsedQuestionCount - rawTargets.reduce((sum, item) => sum + item.count, 0);
        [...rawTargets]
            .sort((first, second) => {
                if (second.remainder !== first.remainder) return second.remainder - first.remainder;
                return first.index - second.index;
            })
            .forEach((item) => {
                if (remaining < 1) return;
                item.count += 1;
                remaining -= 1;
            });

        return rawTargets.reduce((acc, item) => {
            acc[item.subject] = item.count;
            return acc;
        }, {});
    }, [hasValidQuestionCount, parsedQuestionCount]);

    const handleStartQuiz = async () => {
        if (!canStartQuiz) return;

        setStarting(true);
        setError("");

        try {
            const payload = await startQuizExam({
                questionCount: parsedQuestionCount,
                duration: parsedDuration,
                difficulty,
            });
            router.push(`/dashboard/mock-tests/${payload.data._id}`);
        } catch (err) {
            setError(err.message || "Unable to start this quiz.");
            setStarting(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-8 text-left">
            <div className="flex flex-col items-start gap-1">
                <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                    Quiz
                </h1>
                <p className="text-xs font-medium text-[#8E8A9F] sm:text-sm">
                    Build a timed exam sheet from the full question bank.
                </p>
            </div>

            <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#121017] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(223,177,91,0.12),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(124,58,237,0.14),transparent_28%)]" />
                    <div className="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#DFB15B]/8 blur-[110px]" />
                </div>

                <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="flex flex-col gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
                                <Sparkles className="h-3.5 w-3.5" /> Real Exam Mode
                            </span>
                            <h2 className="mt-4 text-xl font-semibold tracking-wide text-white">Configure your quiz</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-white/5 bg-[#1A1722]/55 p-4">
                                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">
                                    <Hash className="h-3.5 w-3.5" /> Total questions
                                </span>
                                <input
                                    type="number"
                                    min={20}
                                    value={questionCount}
                                    onChange={(event) => setQuestionCount(event.target.value)}
                                    className="mt-3 h-12 w-full rounded-xl border border-white/5 bg-[#121017] px-4 text-sm font-bold text-white outline-none transition-colors focus:border-[#DFB15B]/40"
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {QUESTION_PRESETS.map((count) => (
                                        <button
                                            key={count}
                                            type="button"
                                            onClick={() => setQuestionCount(count.toString())}
                                            className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-colors ${parsedQuestionCount === count ? "border-[#DFB15B]/40 bg-[#DFB15B]/10 text-[#DFB15B]" : "border-white/6 bg-white/3 text-[#8E8A9F] hover:text-white"}`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/5 bg-[#1A1722]/55 p-4">
                                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">
                                    <Clock3 className="h-3.5 w-3.5" /> Time limit
                                </span>
                                <input
                                    type="number"
                                    min={1}
                                    value={duration}
                                    onChange={(event) => setDuration(event.target.value)}
                                    className="mt-3 h-12 w-full rounded-xl border border-white/5 bg-[#121017] px-4 text-sm font-bold text-white outline-none transition-colors focus:border-[#DFB15B]/40"
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {DURATION_PRESETS.map((minutes) => (
                                        <button
                                            key={minutes}
                                            type="button"
                                            onClick={() => setDuration(minutes.toString())}
                                            className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-colors ${parsedDuration === minutes ? "border-[#DFB15B]/40 bg-[#DFB15B]/10 text-[#DFB15B]" : "border-white/6 bg-white/3 text-[#8E8A9F] hover:text-white"}`}
                                        >
                                            {minutes} min
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-[#1A1722]/55 p-4">
                            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">
                                <Gauge className="h-3.5 w-3.5" /> Difficulty
                            </span>
                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                {DIFFICULTIES.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setDifficulty(item)}
                                        className={`flex min-h-12 items-center justify-center rounded-xl border px-4 text-xs font-bold uppercase tracking-wider transition-colors ${difficulty === item ? "border-[#DFB15B]/40 bg-[#DFB15B]/10 text-[#DFB15B]" : "border-white/6 bg-[#121017] text-[#8E8A9F] hover:border-white/12 hover:text-white"}`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error ? (
                            <div className="relative overflow-hidden rounded-3xl border border-red-400/20 bg-[#160F13] p-4 shadow-[0_18px_60px_rgba(239,68,68,0.08)] sm:p-5">
                                <div className="pointer-events-none absolute inset-0">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(248,113,113,0.16),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(223,177,91,0.13),transparent_30%)]" />
                                    <div className="absolute -bottom-20 right-10 h-44 w-44 rounded-full bg-red-500/10 blur-[70px]" />
                                </div>

                                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-200 shadow-[0_0_28px_rgba(248,113,113,0.14)]">
                                        <AlertTriangle className="h-5 w-5" />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-red-300">
                                            Quiz launch interrupted
                                        </span>
                                        <h3 className="mt-1 text-lg font-semibold tracking-wide text-white">
                                            Quiz could not be prepared
                                        </h3>
                                        <p className="mt-2 text-sm font-medium leading-6 text-red-100/75">
                                            {error || "The quiz generator could not reach the question bank. Your settings are still here, so you can retry in a moment."}
                                        </p>

                                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                            <button
                                                type="button"
                                                onClick={handleStartQuiz}
                                                disabled={!canStartQuiz}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#E6C687] to-[#AA7C11] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <RefreshCw className="h-3.5 w-3.5" />
                                                Try Again
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setError("")}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
                                            >
                                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                                Review Settings
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <aside className="flex flex-col justify-between gap-5 rounded-2xl border border-[#DFB15B]/15 bg-[#0D0B14]/75 p-5">
                        <div>
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DFB15B] text-black shadow-[0_0_28px_rgba(223,177,91,0.22)]">
                                <Brain className="h-5 w-5" />
                            </span>
                            <h3 className="mt-4 text-lg font-semibold text-white">Generated paper</h3>
                            <p className="mt-2 text-xs font-medium leading-6 text-[#8E8A9F]">
                                {hasValidQuestionCount
                                    ? `${ratioPreview.English} English, ${ratioPreview.Math} Maths, and ${ratioPreview.Analytical} Analytical questions before availability fill.`
                                    : "Choose at least 20 questions to preview the exam balance."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-y border-white/5 py-4">
                            <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">Questions</span>
                                <span className="mt-1 block text-xl font-bold text-white">{hasValidQuestionCount ? parsedQuestionCount : "--"}</span>
                            </div>
                            <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">Minutes</span>
                                <span className="mt-1 block text-xl font-bold text-white">{hasValidDuration ? parsedDuration : "--"}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleStartQuiz}
                            disabled={!canStartQuiz}
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#E6C687] to-[#AA7C11] px-5 text-xs font-bold uppercase tracking-wider text-black shadow-md transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LoadingButtonLabel
                                loading={starting}
                                idleText="Start Quiz"
                                loadingText="Building Quiz..."
                                iconName="zap"
                            />
                            {!starting ? <Play className="h-3.5 w-3.5 fill-black stroke-none" /> : null}
                        </button>
                    </aside>
                </div>
            </section>
        </div>
    );
}
