"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ExamEngine from "@/components/dashboard/ExamEngine";
import AnalyticalScorecard from "@/components/dashboard/AnalyticalScorecard";
import FlashyLoader from "@/components/shared/FlashyLoader";
import { getExamById, submitExam } from "@/lib/api";
import ExamNotFound from "./not-found";

const MONGO_OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

export default function ActiveMockExamArena() {
    const params = useParams();
    const examId = params?.id;
    const [examFinished, setExamFinished] = useState(false);
    const [userSelections, setUserSelections] = useState([]);
    const [examDataPayload, setExamDataPayload] = useState(null);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [fatalError, setFatalError] = useState(null);
    const [submissionError, setSubmissionError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchExam() {
            setLoading(true);
            setNotFound(false);
            setFatalError(null);
            setSubmissionError("");
            setExamDataPayload(null);
            setSubmissionResult(null);
            setExamFinished(false);
            setUserSelections([]);

            if (!examId || !MONGO_OBJECT_ID_PATTERN.test(examId)) {
                setLoading(false);
                setNotFound(true);
                return;
            }

            try {
                const data = await getExamById(examId);
                if (isMounted) {
                    setExamDataPayload(data.data);
                }
            } catch (err) {
                if (isMounted) {
                    if (err.status === 404) {
                        setNotFound(true);
                    } else {
                        setFatalError(err);
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchExam();
        return () => {
            isMounted = false;
        };
    }, [examId]);

    const handleEvaluationTrigger = async (finalAnswers, examPayload) => {
        try {
            const data = await submitExam(examId, finalAnswers);
            setUserSelections(Array.isArray(data?.answers) ? data.answers : finalAnswers);
            setExamDataPayload(examPayload);
            setSubmissionResult(data);
            setExamFinished(true);
            setSubmissionError("");
            return data;
        } catch (err) {
            setSubmissionError("We could not submit your answers right now. Please check your connection and try again.");
            throw err;
        }
    };

    if (fatalError) {
        throw fatalError;
    }

    if (loading) {
        return (
            <FlashyLoader
                eyebrow="Exam Arena"
                title="Loading exam content"
                message="Questions, answer options, and scoring rules are being prepared."
                iconName="brain"
                skeleton="exam"
                surface="screen"
            />
        );
    }

    if (notFound) {
        return <ExamNotFound />;
    }

    if (examFinished) {
        return (
            <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex flex-col items-start gap-1 text-left">
                        <h1 className="font-serif text-3xl font-medium tracking-wide text-white">Performance Scorecard</h1>
                        <p className="text-xs font-medium text-[#8E8A9F] sm:text-sm">
                            Your submission has been scored against the backend evaluation logic.
                        </p>
                    </div>

                    <AnalyticalScorecard answers={userSelections} examData={examDataPayload} submissionResult={submissionResult} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
                {submissionError ? (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                        {submissionError}
                    </div>
                ) : null}
                <ExamEngine key={examDataPayload?._id || examId} examData={examDataPayload} onComplete={handleEvaluationTrigger} />
            </div>
        </div>
    );
}
