"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, BookOpen, CheckCircle, LockKeyhole, XCircle } from "lucide-react";
import AnalyticalScorecard from "@/components/dashboard/AnalyticalScorecard";
import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
import ExamEngine from "@/components/dashboard/ExamEngine";
import FlashyLoader from "@/components/shared/FlashyLoader";
import FormattedText from "@/components/shared/FormattedText";
import { getAssessmentTestExam, getStoredToken, getStoredUser, saveAuthSession, submitAssessmentTest } from "@/lib/api";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

function getStatus(exam) {
  if (exam?.status) return exam.status;
  const now = Date.now();
  const startsAt = new Date(exam?.startTime).getTime();
  const endsAt = new Date(exam?.endTime).getTime();

  if (Number.isNaN(startsAt) || Number.isNaN(endsAt)) return "upcoming";
  if (now < startsAt) return "upcoming";
  if (now <= endsAt) return "open";
  return "ended";
}

function formatDateTime(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getOptionList(options) {
  if (Array.isArray(options)) return options;
  return OPTION_LABELS.map((label) => options?.[label]).filter(Boolean);
}

function getCorrectOptionIndex(question) {
  if (Number.isInteger(question?.correctOptionIndex)) return question.correctOptionIndex;
  const optionList = getOptionList(question?.options);
  const correctAnswer = question?.correctAnswer || question?.correct_answer || "";
  return optionList.findIndex((option) => option?.toString().trim().toLowerCase() === correctAnswer.toString().trim().toLowerCase());
}

export default function AssessmentExamPage() {
  return (
    <ClassAccessGate section="assessmentTest" presentation="screen">
      <AssessmentExamContent />
    </ClassAccessGate>
  );
}

function AssessmentExamContent() {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockedMessage, setBlockedMessage] = useState("");
  const [fatalError, setFatalError] = useState(null);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [userSelections, setUserSelections] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchExam() {
      setLoading(true);
      setBlockedMessage("");
      setFatalError(null);
      setSubmissionError("");
      setSubmissionResult(null);
      setUserSelections([]);
      setExamData(null);

      try {
        const payload = await getAssessmentTestExam();
        if (isMounted) setExamData(payload?.data || null);
      } catch (err) {
        if (!isMounted) return;
        if (err.status === 403) {
          setBlockedMessage(err.message || "This assessment test is not available yet.");
        } else {
          setFatalError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchExam();
    return () => {
      isMounted = false;
    };
  }, []);

  const status = useMemo(() => getStatus(examData), [examData]);
  const isPreview = examData?.assessmentMode === "preview";

  const handleEvaluationTrigger = async (finalAnswers, examPayload, metadata = {}) => {
    try {
      const payload = await submitAssessmentTest(finalAnswers, metadata);
      const token = getStoredToken();
      const storedUser = getStoredUser();
      if (token && storedUser && payload?.rankInfo) {
        saveAuthSession(token, { ...storedUser, rankInfo: payload.rankInfo });
      }
      setUserSelections(Array.isArray(payload?.answers) ? payload.answers : finalAnswers);
      setExamData(examPayload);
      setSubmissionResult(payload);
      setSubmissionError("");
      return payload;
    } catch (err) {
      setSubmissionError(err.message || "We could not submit your answers right now. Please check your connection and try again.");
      throw err;
    }
  };

  if (fatalError) {
    throw fatalError;
  }

  if (loading) {
    return (
      <FlashyLoader
        eyebrow="Assessment"
        title="Loading assessment room"
        message="Schedule, questions, and access rules are being prepared."
        iconName="brain"
        skeleton="exam"
        surface="screen"
      />
    );
  }

  if (blockedMessage) {
    return (
      <AssessmentMessage
        icon={<LockKeyhole className="h-10 w-10 text-[#DFB15B]" />}
        eyebrow="Locked"
        title="This assessment is not open yet"
        message={blockedMessage}
      />
    );
  }

  if (submissionResult) {
    return (
      <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div className="flex flex-col items-start gap-1 text-left">
            <h1 className="font-serif text-3xl font-medium tracking-wide text-white">Assessment Scorecard</h1>
            <p className="text-xs font-medium text-[#8E8A9F] sm:text-sm">
              Your answer sheet has been submitted and scored by the backend.
            </p>
          </div>

          {submissionResult?.submissionReason === "tab_switch" ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
              This assessment auto-submitted because the exam tab was hidden.
            </div>
          ) : null}

          <AnalyticalScorecard
            answers={userSelections}
            examData={examData}
            submissionResult={submissionResult}
            returnHref="/dashboard/assessment-test"
            returnLabel="Return to Assessment"
          />
        </div>
      </div>
    );
  }

  if (isPreview || (status === "ended" && examData?.hasSubmitted)) {
    return <ReadOnlyAssessmentReview examData={examData} isPreview={isPreview} />;
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        {submissionError ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            {submissionError}
          </div>
        ) : null}
        <ExamEngine key={examData?._id || "assessment-test"} examData={examData} onComplete={handleEvaluationTrigger} />
      </div>
    </div>
  );
}

function AssessmentMessage({ icon, eyebrow, title, message }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121017] px-6 py-12 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/8 bg-[#0F0D15]">
          {icon}
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-3xl font-medium text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">{message}</p>
        <Link
          href="/dashboard/assessment-test"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
        >
          Return to Assessment
        </Link>
      </div>
    </div>
  );
}

function ReadOnlyAssessmentReview({ examData, isPreview = false }) {
  const questions = examData?.questions || [];

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 text-left sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">
            <BookOpen className="h-4 w-4" /> {isPreview ? "Admin Preview" : "Solution Review"}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-wide text-white">{examData?.title || "Assessment Test"}</h1>
          <p className="text-sm text-[#8E8A9F]">
            {isPreview ? `Official window: ${formatDateTime(examData?.startTime)} to ${formatDateTime(examData?.endTime)}` : `Ended ${formatDateTime(examData?.endTime)}. Submissions are closed, but solutions are available for review.`}
          </p>
        </div>

        {questions.length ? (
          <div className="grid gap-4">
            {questions.map((question, index) => {
              const optionList = getOptionList(question.options);
              const correctOptionIndex = getCorrectOptionIndex(question);

              return (
                <section key={question._id || index} className="rounded-3xl border border-white/5 bg-[#121017] p-5 sm:p-6">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">Question #{index + 1}</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#6B667B]">
                        {[question.subject, question.topic, question.subTopic].filter(Boolean).join(" / ") || "General"}
                      </p>
                    </div>
                    <span className="rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase text-[#8E8A9F]">
                      {question.difficulty || "Assessment"}
                    </span>
                  </div>

                  {question.instruction ? (
                    <FormattedText
                      as="p"
                      value={question.instruction}
                      className="mb-4 text-xs font-semibold leading-relaxed text-[#A9A3BA]"
                    />
                  ) : null}

                  <FormattedText
                    as="p"
                    value={question.questionText || question.question}
                    className="text-sm font-semibold leading-relaxed tracking-wide text-white sm:text-base"
                  />

                  <div className="mt-5 grid gap-2">
                    {optionList.map((option, optionIndex) => {
                      const isCorrect = optionIndex === correctOptionIndex;
                      return (
                        <div
                          key={`${question._id || index}-${optionIndex}`}
                          className={`flex min-h-14 items-start gap-3 rounded-2xl border p-3 ${isCorrect ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100" : "border-white/5 bg-[#1A1722]/55 text-[#C9C2D8]"}`}
                        >
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${isCorrect ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/5 bg-[#121017] text-[#8E8A9F]"}`}>
                            {OPTION_LABELS[optionIndex]}
                          </span>
                          <FormattedText
                            value={option}
                            className="min-w-0 flex-1 text-sm font-semibold leading-relaxed"
                          />
                          {isCorrect ? <CheckCircle className="h-4 w-4 shrink-0 text-emerald-300" /> : <XCircle className="h-4 w-4 shrink-0 text-[#6B667B]" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#DFB15B]/10 bg-[#DFB15B]/5 p-4">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">Explanation</span>
                    <FormattedText
                      value={question.explanation || "No explanation has been added for this question yet."}
                      className="block text-sm font-medium leading-relaxed text-[#D8D3C7]"
                    />
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 px-6 py-10 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-300" />
            <h2 className="mt-4 font-serif text-2xl font-medium text-white">Assessment data is missing</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-red-100/75">
              No valid questions are available from the AssessmentTest collection.
            </p>
          </div>
        )}

        <Link
          href="/dashboard/assessment-test"
          className="w-fit rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
        >
          Return to Assessment
        </Link>
      </div>
    </div>
  );
}
