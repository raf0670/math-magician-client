"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useProgram } from "@/lib/program";
import Link from "next/link";
import { CalendarClock, CheckCircle2, Clock3, Eye, LockKeyhole, Play, RefreshCw, Radio, RotateCcw, Trophy } from "lucide-react";
import { getLiveExams } from "@/lib/api";
import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
import FlashyLoader from "@/components/shared/FlashyLoader";
import { MathHero, MathPageShell } from "@/components/math/MathDashboardUI";

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
  const { program, examBasePath } = useProgram();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState(null);
  const isMath = program === "math";

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.startTime || 0) - new Date(a.startTime || 0));
  }, [items]);

  const openCount = useMemo(() => sortedItems.filter((exam) => getStatus(exam) === "open").length, [sortedItems]);
  const upcomingCount = useMemo(() => sortedItems.filter((exam) => getStatus(exam) === "upcoming").length, [sortedItems]);

  const loadLiveExams = useCallback(async () => {
    setLoading(true);
    setFatalError(null);

    try {
      const payload = await getLiveExams(program);
      setItems(payload?.data || []);
    } catch (err) {
      setFatalError(err);
    } finally {
      setLoading(false);
    }
  }, [program]);

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialLiveExams() {
      try {
        const payload = await getLiveExams(program);
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
  }, [program]);

  if (fatalError) {
    throw fatalError;
  }

  const refreshButton = (
    <button
      type="button"
      onClick={loadLiveExams}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        isMath
          ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:border-[#DFB15B]/45 hover:text-[#DFB15B]"
          : "border-white/8 bg-[#121017] text-white hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
      }`}
    >
      <RefreshCw className="h-4 w-4" />
      Refresh
    </button>
  );

  const examContent = (
    <>
      {loading ? (
        <FlashyLoader
          eyebrow={isMath ? "Math Exams" : "Live Exams"}
          title={isMath ? "Loading math exam windows" : "Loading scheduled exams"}
          message={isMath ? "Daily mocks and full-length math papers are being fetched." : "Exam windows and availability are being fetched."}
          iconName="clipboard"
          skeleton="cards"
          className="min-h-90"
        />
      ) : null}

      {!loading && !sortedItems.length ? (
        <div className={`rounded-3xl border px-6 py-12 text-center ${isMath ? "border-emerald-300/12 bg-[#121017] shadow-[0_18px_55px_rgba(0,0,0,0.28)]" : "border-white/5 bg-[#121017]"}`}>
          <CalendarClock className={`mx-auto h-10 w-10 ${isMath ? "text-emerald-200" : "text-[#DFB15B]"}`} />
          <h2 className="mt-4 font-serif text-2xl font-medium text-white">{isMath ? "No math exams posted yet" : "No live exams posted yet"}</h2>
          <p className="mt-2 text-sm text-[#8E8A9F]">{isMath ? "Daily mocks and full-length math exams will appear here once an admin publishes them." : "New scheduled exams will appear here once an admin publishes them."}</p>
        </div>
      ) : null}

      {!loading && sortedItems.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedItems.map((exam) => {
            const status = getStatus(exam);
            const isOpen = status === "open";
            const isEnded = status === "ended";

            return (
              <section key={exam._id} className={`flex min-h-64 flex-col rounded-3xl border p-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)] ${isMath ? "border-emerald-300/10 bg-[#121017]" : "border-white/6 bg-[#121017]"}`}>
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
                    <CalendarClock className={`h-4 w-4 ${isMath ? "text-emerald-200" : "text-[#DFB15B]"}`} />
                    {formatDateTime(exam.startTime)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 className={`h-4 w-4 ${isMath ? "text-emerald-200" : "text-[#DFB15B]"}`} />
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
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`${examBasePath}/${exam._id}`}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition ${isOpen ? (isMath ? "bg-linear-to-r from-emerald-300 via-[#DFB15B] to-[#AA7C11] text-black hover:brightness-110" : "bg-linear-to-r from-[#E6C687] to-[#AA7C11] text-black hover:brightness-110") : "border border-white/8 bg-[#0F0D15] text-white hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"}`}
                      >
                        {isOpen ? <Play className="h-4 w-4 fill-current stroke-none" /> : <Eye className="h-4 w-4" />}
                        {isOpen ? "Start Exam" : exam.hasSubmitted ? "View Results" : "Review Solutions"}
                      </Link>
                      {isEnded && exam.canRetake ? (
                        <Link
                          href={`${examBasePath}/${exam._id}?mode=retake`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold uppercase tracking-wider text-emerald-200 transition hover:border-emerald-300/40 hover:bg-emerald-400/15"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Retake
                        </Link>
                      ) : null}
                      {isEnded ? (
                        <Link
                          href={`${examBasePath}/${exam._id}/rankings`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#DFB15B] transition hover:border-[#DFB15B]/40 hover:bg-[#DFB15B]/15"
                        >
                          <Trophy className="h-4 w-4" />
                          Exam Rankings
                        </Link>
                      ) : null}
                    </div>
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
    </>
  );

  if (isMath) {
    return (
      <MathPageShell>
        <MathHero
          eyebrow="Math Exam Room"
          title="Scheduled Math Exams"
          description="Join daily math mocks during their official window, then review scores, solutions, and rankings after the deadline."
          icon={Radio}
          action={refreshButton}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Info label="Published" value={sortedItems.length} />
            <Info label="Open Now" value={openCount} />
            <Info label="Upcoming" value={upcomingCount} />
          </div>
        </MathHero>
        {examContent}
      </MathPageShell>
    );
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

        {refreshButton}
      </div>

      {examContent}
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
