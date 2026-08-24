"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, CheckCircle2, Clock3, Eye, LockKeyhole, Play, RefreshCw, Radio } from "lucide-react";
import { getLiveExams } from "@/lib/api";
import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
import FlashyLoader from "@/components/shared/FlashyLoader";

const STATUS_STYLES = {
  upcoming: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  open: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  ended: "border-white/8 bg-white/5 text-[#8E8A9F]",
  scheduled: "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]",
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

function getStatus(exam) {
  if (exam?.status) return exam.status;
  const now = Date.now();
  const startsAt = new Date(exam?.startTime).getTime();
  const endsAt = new Date(exam?.endTime).getTime();

  if (Number.isNaN(startsAt) || Number.isNaN(endsAt)) return "scheduled";
  if (now < startsAt) return "upcoming";
  if (now < endsAt) return "open";
  return "ended";
}

export default function LiveExamsPage() {
  return (
    <ClassAccessGate section="liveExams">
      <LiveExamsContent />
    </ClassAccessGate>
  );
}

function LiveExamsContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState(null);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.startTime || 0) - new Date(a.startTime || 0));
  }, [items]);

  const loadLiveExams = useCallback(async () => {
    setLoading(true);
    setFatalError(null);

    try {
      const payload = await getLiveExams();
      setItems(payload?.data || []);
    } catch (err) {
      setFatalError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialLiveExams() {
      try {
        const payload = await getLiveExams();
        if (isMounted) setItems(payload?.data || []);
      } catch (err) {
        if (isMounted) setFatalError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchInitialLiveExams();
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
            <Radio className="h-4 w-4" /> Live Exams
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-wide text-white">Scheduled Exam Room</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8E8A9F]">
            Join active live exams during their official time window, or review solutions after the deadline.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLiveExams}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#121017] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <FlashyLoader
          eyebrow="Live Exams"
          title="Loading scheduled exams"
          message="Exam windows and availability are being fetched."
          iconName="clipboard"
          skeleton="cards"
          className="min-h-90"
        />
      ) : null}

      {!loading && !sortedItems.length ? (
        <div className="rounded-3xl border border-white/5 bg-[#121017] px-6 py-12 text-center">
          <CalendarClock className="mx-auto h-10 w-10 text-[#DFB15B]" />
          <h2 className="mt-4 font-serif text-2xl font-medium text-white">No live exams posted yet</h2>
          <p className="mt-2 text-sm text-[#8E8A9F]">New scheduled exams will appear here once an admin publishes them.</p>
        </div>
      ) : null}

      {!loading && sortedItems.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedItems.map((exam) => {
            const status = getStatus(exam);
            const isOpen = status === "open";
            const isEnded = status === "ended";

            return (
              <section key={exam._id} className="flex min-h-64 flex-col rounded-3xl border border-white/6 bg-[#121017] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || STATUS_STYLES.scheduled}`}>
                      {status}
                    </span>
                    <h2 className="mt-4 text-xl font-semibold leading-snug tracking-wide text-white">{exam.title}</h2>
                  </div>
                  {exam.hasSubmitted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-200">
                      <CheckCircle2 className="h-4 w-4" />
                      Submitted
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-3 text-sm text-[#A9A3BA]">
                  <span className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-[#DFB15B]" />
                    {formatDateTime(exam.startTime)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#DFB15B]" />
                    Ends {formatDateTime(exam.endTime)}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-white/5 py-4">
                  <Info label="Questions" value={exam.questionCount || 0} />
                  <Info label="Marks" value={exam.totalMarks || 0} />
                </div>

                <div className="mt-auto pt-5">
                  {exam.hasSubmitted && !isEnded ? (
                    <div className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                      <CheckCircle2 className="h-4 w-4" />
                      Submitted - review after deadline
                    </div>
                  ) : isOpen || isEnded ? (
                    <Link
                      href={`/dashboard/live-exams/${exam._id}`}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition ${isOpen ? "bg-linear-to-r from-[#E6C687] to-[#AA7C11] text-black hover:brightness-110" : "border border-white/8 bg-[#0F0D15] text-white hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"}`}
                    >
                      {isOpen ? <Play className="h-4 w-4 fill-current stroke-none" /> : <Eye className="h-4 w-4" />}
                      {isOpen ? "Start Exam" : exam.hasSubmitted ? "View Results" : "Review Solutions"}
                    </Link>
                  ) : (
                    <div className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0F0D15] px-4 py-3 text-sm font-semibold text-[#8E8A9F]">
                      <LockKeyhole className="h-4 w-4" />
                      Opens at scheduled time
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0F0D15] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
