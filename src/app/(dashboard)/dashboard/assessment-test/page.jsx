"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarClock, CheckCircle2, Clock3, Eye, FileCheck2, LockKeyhole, Play, RefreshCw, ShieldCheck } from "lucide-react";
import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
import FlashyLoader from "@/components/shared/FlashyLoader";
import { getAssessmentTest } from "@/lib/api";

const STATUS_STYLES = {
  upcoming: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  open: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  ended: "border-white/8 bg-white/5 text-[#8E8A9F]",
};

function formatDateTime(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatus(data) {
  if (data?.status) return data.status;
  const now = Date.now();
  const startsAt = new Date(data?.startTime).getTime();
  const endsAt = new Date(data?.endTime).getTime();

  if (Number.isNaN(startsAt) || Number.isNaN(endsAt)) return "upcoming";
  if (now < startsAt) return "upcoming";
  if (now <= endsAt) return "open";
  return "ended";
}

export default function AssessmentTestPage() {
  return (
    <ClassAccessGate section="assessmentTest">
      <AssessmentTestContent />
    </ClassAccessGate>
  );
}

function AssessmentTestContent() {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState(null);

  const status = useMemo(() => getStatus(assessment), [assessment]);

  const loadAssessment = useCallback(async () => {
    setLoading(true);
    setFatalError(null);

    try {
      const payload = await getAssessmentTest();
      setAssessment(payload?.data || null);
    } catch (err) {
      setFatalError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getAssessmentTest()
      .then((payload) => {
        if (isMounted) setAssessment(payload?.data || null);
      })
      .catch((err) => {
        if (isMounted) setFatalError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (fatalError) {
    throw fatalError;
  }

  return (
    <div className="flex w-full flex-col gap-6 text-left">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">
            <FileCheck2 className="h-4 w-4" /> Assessment Test
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-wide text-white">Official Assessment Room</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8E8A9F]">
            A timed 90-minute assessment where your final score is added directly to your rank points.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAssessment}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#121017] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <FlashyLoader
          eyebrow="Assessment"
          title="Loading assessment window"
          message="Schedule, marks, and submission status are being fetched."
          iconName="clipboard"
          skeleton="cards"
          className="min-h-90"
        />
      ) : null}

      {!loading && assessment ? (
        <section className="rounded-3xl border border-white/6 bg-[#121017] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || STATUS_STYLES.upcoming}`}>
                {status}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-medium tracking-wide text-white">{assessment.title || "Assessment Test"}</h2>
              <p className="mt-2 text-sm leading-6 text-[#8E8A9F]">
                {formatDateTime(assessment.startTime)} to {formatDateTime(assessment.endTime)}
              </p>
            </div>

            {assessment.hasSubmitted ? (
              <span className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                Submitted
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info icon={<FileCheck2 className="h-4 w-4" />} label="Questions" value={assessment.questionCount || 0} />
            <Info icon={<ShieldCheck className="h-4 w-4" />} label="Marks" value={assessment.totalMarks || 0} />
            <Info icon={<Clock3 className="h-4 w-4" />} label="Duration" value={`${assessment.duration || 90} min`} />
            <Info icon={<CalendarClock className="h-4 w-4" />} label="Wrong" value={`-${Number(assessment.negativeMarksPerQuestion || 0.25).toFixed(2)}`} />
          </div>

          {assessment.invalidQuestionCount ? (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
              <span>{assessment.invalidQuestionCount} assessment question{assessment.invalidQuestionCount === 1 ? "" : "s"} need correction in MongoDB before they can appear in the paper.</span>
            </div>
          ) : null}

          {assessment.submission ? (
            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100">
              Saved score: {Number(assessment.submission.score || 0).toFixed(2)} / {assessment.totalMarks || 0}
            </div>
          ) : null}

          <div className="mt-6">
            {assessment.canEnter ? (
              <Link
                href="/dashboard/assessment-test/exam"
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition ${status === "open" ? "bg-linear-to-r from-[#E6C687] to-[#AA7C11] text-black hover:brightness-110" : "border border-white/8 bg-[#0F0D15] text-white hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"}`}
              >
                {status === "open" ? <Play className="h-4 w-4 fill-current stroke-none" /> : <Eye className="h-4 w-4" />}
                {assessment.canPreview ? "Preview Paper" : status === "ended" ? "Review Solutions" : "Start Assessment"}
              </Link>
            ) : (
              <div className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0F0D15] px-4 py-3 text-sm font-semibold text-[#8E8A9F]">
                <LockKeyhole className="h-4 w-4" />
                Opens at scheduled time
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0F0D15] px-4 py-3">
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">
        <span className="text-[#DFB15B]">{icon}</span>
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
