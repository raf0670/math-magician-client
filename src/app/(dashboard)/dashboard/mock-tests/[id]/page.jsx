"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ExamEngine from "@/components/dashboard/ExamEngine";
import AnalyticalScorecard from "@/components/dashboard/AnalyticalScorecard";
import FlashyLoader from "@/components/shared/FlashyLoader";
import { getExamById, submitExam } from "@/lib/api";

export default function ActiveMockExamArena() {
    const params = useParams();
    const examId = params?.id;
    const [examFinished, setExamFinished] = useState(false);
    const [userSelections, setUserSelections] = useState([]);
    const [examDataPayload, setExamDataPayload] = useState(null);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchExam() {
            setLoading(true);
            setError("");
            setExamDataPayload(null);
            setSubmissionResult(null);
            setExamFinished(false);
            setUserSelections([]);

            if (!examId) {
                setLoading(false);
                setError("The requested exam could not be found.");
                return;
            }

            try {
                const data = await getExamById(examId);
                if (isMounted) {
                    setExamDataPayload(data.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Unable to load this exam");
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
            setUserSelections(finalAnswers);
            setExamDataPayload(examPayload);
            setSubmissionResult(data);
            setExamFinished(true);
        } catch (err) {
            setError(err.message || "Submission failed");
        }
    };

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

    if (error) {
        return <p className="text-sm text-red-400">{error}</p>;
    }

    if (examFinished) {
        return (
            <div className="flex w-full flex-col gap-6">
                <div className="flex flex-col items-start gap-1 text-left">
                    <h1 className="font-serif text-3xl font-medium tracking-wide text-white">Performance Scorecard</h1>
                    <p className="text-xs font-medium text-[#8E8A9F] sm:text-sm">
                        Your submission has been scored against the backend evaluation logic.
                    </p>
                </div>

                <AnalyticalScorecard answers={userSelections} examData={examDataPayload} submissionResult={submissionResult} />
            </div>
        );
    }

    return <ExamEngine key={examDataPayload?._id || examId} examData={examDataPayload} onComplete={handleEvaluationTrigger} />;
}
