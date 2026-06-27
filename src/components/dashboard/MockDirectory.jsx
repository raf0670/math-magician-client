"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Award, BookOpen, Brain, Calculator, Check, ClipboardCheck, Layers, Play, SlidersHorizontal } from "lucide-react";
import { getExams, getPracticeMeta, startPracticeExam } from "@/lib/api";

const SUBJECTS = [
    { name: "Math", label: "Maths", icon: Calculator },
    { name: "English", label: "English", icon: BookOpen },
    { name: "Analytical", label: "Analytical", icon: Brain },
];

export default function MockDirectory() {
    const router = useRouter();
    const [subjects, setSubjects] = useState(SUBJECTS.map((subject) => ({ ...subject, topics: [] })));
    const [activeSubject, setActiveSubject] = useState("Math");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [questionCount, setQuestionCount] = useState(10);
    const [mockExams, setMockExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchExamSystem() {
            try {
                const [metaPayload, examsPayload] = await Promise.all([getPracticeMeta(), getExams()]);
                if (!isMounted) return;

                const apiSubjects = Array.isArray(metaPayload?.data) ? metaPayload.data : [];
                const mergedSubjects = SUBJECTS.map((subject) => ({
                    ...subject,
                    topics: apiSubjects.find((item) => item.name === subject.name)?.topics || [],
                }));

                setSubjects(mergedSubjects);
                setMockExams(examsPayload?.data || []);

                const firstSubjectWithTopic = mergedSubjects.find((subject) => subject.topics.length);
                if (firstSubjectWithTopic) {
                    setActiveSubject(firstSubjectWithTopic.name);
                    setSelectedTopic(firstSubjectWithTopic.topics[0].name);
                    setQuestionCount(Math.min(10, firstSubjectWithTopic.topics[0].questionCount));
                }
            } catch (err) {
                if (isMounted) setError(err.message || "Unable to load the exam system");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchExamSystem();
        return () => {
            isMounted = false;
        };
    }, []);

    const currentSubject = useMemo(() => {
        return subjects.find((subject) => subject.name === activeSubject) || subjects[0];
    }, [subjects, activeSubject]);

    const currentTopic = useMemo(() => {
        return currentSubject?.topics?.find((topic) => topic.name === selectedTopic) || null;
    }, [currentSubject, selectedTopic]);

    const maxQuestionCount = currentTopic?.questionCount || 0;
    const safeQuestionCount = Math.max(1, Math.min(questionCount, maxQuestionCount || 1));

    const availableExams = mockExams
        .filter((exam) => !exam.isLiveExam || !exam.startTime || new Date(exam.startTime) <= new Date())
        .slice(0, 4);

    const handleSubjectChange = (subjectName) => {
        const nextSubject = subjects.find((subject) => subject.name === subjectName);
        const nextTopic = nextSubject?.topics?.[0];

        setActiveSubject(subjectName);
        setSelectedTopic(nextTopic?.name || "");
        setQuestionCount(nextTopic ? Math.min(10, nextTopic.questionCount) : 1);
    };

    const handleTopicChange = (topic) => {
        setSelectedTopic(topic.name);
        setQuestionCount(Math.min(safeQuestionCount, topic.questionCount));
    };

    const handleStartPractice = async () => {
        if (!currentTopic || starting) return;

        setStarting(true);
        setError("");

        try {
            const payload = await startPracticeExam({
                subject: activeSubject,
                topic: currentTopic.name,
                questionCount: safeQuestionCount,
            });
            router.push(`/dashboard/mock-tests/${payload.data._id}`);
        } catch (err) {
            setError(err.message || "Unable to start this exam");
            setStarting(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-8 text-left">
            <section className="w-full rounded-2xl border border-white/5 bg-[#121017] p-5 shadow-md sm:p-6">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
                            <SlidersHorizontal className="h-3.5 w-3.5" /> Exam Setup
                        </span>
                        <h2 className="text-xl font-semibold tracking-wide text-white">Choose your practice paper</h2>
                        <p className="text-sm font-medium text-[#8E8A9F]">Pick a subject, a sub-topic, and the number of questions. Every generated exam is untimed.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                        <div className="flex flex-col gap-2">
                            {SUBJECTS.map((subject) => {
                                const subjectPayload = subjects.find((item) => item.name === subject.name);
                                const isActive = activeSubject === subject.name;
                                return (
                                    <button
                                        key={subject.name}
                                        onClick={() => handleSubjectChange(subject.name)}
                                        className={`flex min-h-14 w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${isActive ? "border-[#DFB15B]/40 bg-[#DFB15B]/10 text-white" : "border-white/5 bg-[#1A1722]/60 text-[#8E8A9F] hover:border-white/10 hover:text-white"}`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <subject.icon className={`h-4 w-4 ${isActive ? "text-[#DFB15B]" : "text-[#6B667B]"}`} />
                                            <span className="text-sm font-bold">{subject.label}</span>
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B667B]">
                                            {subjectPayload?.topics?.length || 0} topics
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex min-h-72 flex-col gap-5 rounded-xl border border-white/5 bg-[#1A1722]/35 p-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">Sub-topic</span>
                                {loading ? (
                                    <p className="mt-3 text-sm text-[#8E8A9F]">Loading topics...</p>
                                ) : currentSubject?.topics?.length ? (
                                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {currentSubject.topics.map((topic) => {
                                            const isSelected = selectedTopic === topic.name;
                                            return (
                                                <button
                                                    key={topic.name}
                                                    onClick={() => handleTopicChange(topic)}
                                                    className={`flex min-h-16 items-center justify-between rounded-xl border p-3 text-left transition-colors ${isSelected ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/5 bg-[#121017] hover:border-white/10"}`}
                                                >
                                                    <span>
                                                        <span className="block text-sm font-semibold text-white">{topic.name}</span>
                                                        <span className="mt-0.5 block text-[11px] font-medium text-[#8E8A9F]">{topic.questionCount} questions available</span>
                                                    </span>
                                                    {isSelected ? <Check className="h-4 w-4 text-emerald-400" /> : <Layers className="h-4 w-4 text-[#6B667B]" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-[#8E8A9F]">No sub-topics are available for this subject yet.</p>
                                )}
                            </div>

                            <div className="mt-auto grid grid-cols-1 gap-4 border-t border-white/5 pt-4 md:grid-cols-[1fr_auto] md:items-end">
                                <label className="flex flex-col gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B667B]">Number of questions</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={maxQuestionCount || 1}
                                        value={safeQuestionCount}
                                        disabled={!currentTopic}
                                        onChange={(event) => setQuestionCount(Number(event.target.value))}
                                        className="h-12 rounded-xl border border-white/5 bg-[#121017] px-4 text-sm font-bold text-white outline-none transition-colors focus:border-[#DFB15B]/40 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <span className="text-[11px] font-medium text-[#6B667B]">
                                        Maximum available: {maxQuestionCount || 0}
                                    </span>
                                </label>

                                <button
                                    onClick={handleStartPractice}
                                    disabled={!currentTopic || starting}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#E6C687] to-[#AA7C11] px-5 text-xs font-bold uppercase tracking-wider text-black shadow-md transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Play className="h-3.5 w-3.5 fill-current stroke-none" />
                                    {starting ? "Starting..." : "Start Exam"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {error ? <p className="text-sm font-medium text-red-400">{error}</p> : null}
                </div>
            </section>

            <section className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-semibold tracking-wide text-white">Existing mock papers</h2>
                        <p className="mt-0.5 text-[11px] font-medium text-[#6B667B]">Admin-created papers remain available here.</p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-sm text-[#8E8A9F]">Loading available mock tests...</p>
                ) : availableExams.length === 0 ? (
                    <p className="text-sm text-[#8E8A9F]">No saved mock papers are available right now.</p>
                ) : (
                    <motion.div layout className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                        <AnimatePresence mode="popLayout">
                            {availableExams.map((exam) => (
                                <motion.div
                                    key={exam._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#121017] p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <span className="rounded-lg border border-white/5 bg-white/2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#8E8A9F]">
                                                {exam.isLiveExam ? "Live Paper" : "Practice Paper"}
                                            </span>
                                            <h3 className="mt-3 text-sm font-semibold leading-snug tracking-wide text-white">{exam.title}</h3>
                                        </div>
                                        <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-[#DFB15B]">
                                            <Award className="h-3.5 w-3.5" /> {exam.totalMarks || 0} pts
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8E8A9F]">
                                            <ClipboardCheck className="h-3.5 w-3.5 text-[#6B667B]" /> {exam.questionCount || 0} questions
                                        </span>
                                        <Link
                                            href={`/dashboard/mock-tests/${exam._id}`}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#DFB15B] transition-all hover:bg-[#DFB15B] hover:text-black"
                                        >
                                            Open Paper
                                            <Play className="h-2.5 w-2.5 fill-current stroke-none" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </section>
        </div>
    );
}
