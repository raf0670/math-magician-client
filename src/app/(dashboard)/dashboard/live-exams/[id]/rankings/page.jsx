"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, CalendarClock, Medal, ShieldAlert, Trophy, Users } from "lucide-react";
import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
import FlashyLoader from "@/components/shared/FlashyLoader";
import { getExamLeaderboard, getStoredUser } from "@/lib/api";

const MONGO_OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function formatDateTime(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatNumber(value) {
  return Number(value || 0).toFixed(2);
}

function getStudentId(value) {
  return value?._id?.toString?.() || value?.id?.toString?.() || value?.studentId?.toString?.() || value?.toString?.() || "";
}

function RankBadge({ rank }) {
  const isPodium = rank <= 3;

  return (
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-xs font-black ${isPodium ? "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]" : "border-white/6 bg-[#121017] text-[#8E8A9F]"}`}>
      {isPodium ? <Trophy className="h-4 w-4" /> : `#${rank}`}
    </div>
  );
}

export default function LiveExamRankingsPage() {
  return (
    <ClassAccessGate section="liveExams">
      <LiveExamRankingsContent />
    </ClassAccessGate>
  );
}

function LiveExamRankingsContent() {
  const params = useParams();
  const examId = params?.id;
  const [currentUser] = useState(() => getStoredUser());
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fatalError, setFatalError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRankings() {
      setLoading(true);
      setNotFound(false);
      setFatalError(null);
      setPayload(null);

      if (!examId || !MONGO_OBJECT_ID_PATTERN.test(examId)) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const data = await getExamLeaderboard(examId);
        if (isMounted) setPayload(data || null);
      } catch (err) {
        if (!isMounted) return;
        if (err.status === 404) {
          setNotFound(true);
        } else {
          setFatalError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRankings();
    return () => {
      isMounted = false;
    };
  }, [examId]);

  const leaderboard = useMemo(() => payload?.data || [], [payload?.data]);
  const currentUserId = getStudentId(currentUser);
  const currentUserEntry = useMemo(() => {
    return payload?.currentUserEntry || leaderboard.find((entry) => getStudentId(entry) === currentUserId) || null;
  }, [currentUserId, leaderboard, payload?.currentUserEntry]);
  const exam = payload?.exam || {};

  if (fatalError) {
    throw fatalError;
  }

  if (loading) {
    return (
      <RankingsPageShell>
        <FlashyLoader
          eyebrow="Exam Rankings"
          title="Loading leaderboard"
          message="Scores and ranks for this live exam are being fetched."
          iconName="analytics"
          skeleton="cards"
          className="min-h-105"
        />
      </RankingsPageShell>
    );
  }

  if (notFound) {
    return (
      <RankingsMessage
        icon={<AlertTriangle className="h-10 w-10 text-red-300" />}
        eyebrow="Not Found"
        title="This live exam leaderboard could not be found"
        message="The exam may have been removed, or this page may not belong to an official live exam."
      />
    );
  }

  if (payload?.resultsAvailable === false) {
    return (
      <RankingsMessage
        icon={<CalendarClock className="h-10 w-10 text-[#DFB15B]" />}
        eyebrow="Rankings Locked"
        title={exam.title || "Rankings unlock after the deadline"}
        message={`Scores and rankings will become available after ${formatDateTime(payload.resultsAvailableAt || exam.endTime)}.`}
      />
    );
  }

  return (
    <RankingsPageShell>
    <div className="flex w-full flex-col gap-6 text-left">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">
            <Medal className="h-4 w-4" /> Exam Rankings
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-wide text-white">{exam.title || "Live Exam"}</h1>
          <p className="mt-2 text-sm leading-6 text-[#8E8A9F]">
            Ended {formatDateTime(exam.endTime)}. Rankings are based on this exam&apos;s marks only.
          </p>
        </div>

        <Link
          href="/dashboard/live-exams"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#121017] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
        >
          <ArrowLeft className="h-4 w-4" />
          Live Exams
        </Link>
      </div>

      <section className="rounded-3xl border border-[#DFB15B]/15 bg-[#121017] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3)] sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryTile label="Your Rank" value={currentUserEntry ? `#${currentUserEntry.rank}` : "Not ranked"} icon={Trophy} />
          <SummaryTile label="Submissions" value={payload?.count || 0} icon={Users} />
          <SummaryTile label="Total Marks" value={formatNumber(exam.totalMarks)} icon={Medal} />
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 bg-[#121017] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-wide text-white">Ranked Students</h2>
            <p className="mt-1 text-xs font-medium text-[#6B667B]">
              Showing {leaderboard.length} submitted student{leaderboard.length === 1 ? "" : "s"}.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9D96B3]">
            <Trophy className="h-3.5 w-3.5 text-[#DFB15B]" />
            Exam Marks
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#1A1722]/40 px-4 py-8 text-center text-sm font-medium text-[#8E8A9F]">
            No submissions are available for this exam yet.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry) => {
              const isCurrentUser = currentUserId && getStudentId(entry) === currentUserId;

              return (
                <div
                  key={`${entry.studentId || entry.studentName}-${entry.submittedAt}`}
                  className={`grid grid-cols-[auto_1fr] gap-3 rounded-2xl border px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center ${isCurrentUser ? "border-[#DFB15B]/30 bg-[#DFB15B]/10 shadow-[0_0_28px_rgba(223,177,91,0.08)]" : "border-white/5 bg-[#1A1722]/40"}`}
                >
                  <RankBadge rank={entry.rank} />
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-white">{entry.studentName || "Student"}</span>
                      {isCurrentUser ? (
                        <span className="rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#DFB15B]">
                          You
                        </span>
                      ) : null}
                      {entry.isDisqualified ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-red-400/20 bg-red-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-200">
                          <ShieldAlert className="h-3 w-3" />
                          Disqualified
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium text-[#8E8A9F]">
                      {entry.house || "No house"} - Submitted {formatDateTime(entry.submittedAt)}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-white/5 bg-[#121017]/70 px-3 py-2 sm:col-span-1 sm:block sm:border-0 sm:bg-transparent sm:p-0 sm:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B667B] sm:block">score</span>
                    <span className="text-sm font-bold text-[#DFB15B] sm:block">
                      {formatNumber(entry.score)}
                      {entry.isDisqualified ? (
                        <span className="ml-2 text-[10px] font-semibold text-red-200 line-through">{formatNumber(entry.originalScore)}</span>
                      ) : null}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
    </RankingsPageShell>
  );
}

function RankingsPageShell({ children }) {
  return (
    <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {children}
      </div>
    </div>
  );
}

function SummaryTile({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/7 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#6B667B]">
        <Icon className="h-3.5 w-3.5 text-[#DFB15B]" />
        {label}
      </div>
      <div className="mt-2 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function RankingsMessage({ icon, eyebrow, title, message }) {
  return (
    <RankingsPageShell>
      <div className="flex min-h-105 items-center justify-center rounded-3xl border border-white/5 bg-[#121017] px-6 py-12 text-center">
        <div className="max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/8 bg-[#0F0D15]">
            {icon}
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-3xl font-medium text-white">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">{message}</p>
          <Link
            href="/dashboard/live-exams"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
          >
            <ArrowLeft className="h-4 w-4" />
            Live Exams
          </Link>
        </div>
      </div>
    </RankingsPageShell>
  );
}
