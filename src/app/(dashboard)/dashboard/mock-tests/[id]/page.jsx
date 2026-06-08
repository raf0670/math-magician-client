"use client";
import { useState } from "react";
import ExamEngine from "@/components/dashboard/ExamEngine";
// 🪄 Import your brand new calculation scorecard component
import AnalyticalScorecard from "@/components/dashboard/AnalyticalScorecard";

export default function ActiveMockExamArena({ params }) {
    const [examFinished, setExamFinished] = useState(false);
    const [userSelections, setUserSelections] = useState(null);
    const [examDataPayload, setExamDataPayload] = useState(null);

    const handleEvaluationTrigger = (finalAnswers, examPayload) => {
        setUserSelections(finalAnswers);
        setExamDataPayload(examPayload);
        setExamFinished(true);
    };

    // 🎯 If the student hits submit or time runs out, swap layouts seamlessly to display the results sheet!
    if (examFinished) {
        return (
            <div className="w-full flex flex-col gap-6">
                <div className="flex flex-col items-start text-left gap-1">
                    <h1 className="font-serif text-3xl font-medium tracking-wide text-white">Performance Scorecard</h1>
                    <p className="text-[#8E8A9F] text-xs sm:text-sm font-medium">
                        Real-time score audit compiled under standard negative marking bounds. Review solutions down below.
                    </p>
                </div>

                {/* Mount the finished analytics scorecard module directly */}
                <AnalyticalScorecard answers={userSelections} examData={examDataPayload} />
            </div>
        );
    }

    return <ExamEngine onComplete={handleEvaluationTrigger} />;
}