"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  FileJson,
  FileQuestion,
  Gavel,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import {
  createAdminLiveExam,
  getAdminLiveExams,
  getAdminLiveExamSubmissions,
  getProfile,
  saveAuthSession,
  updateSubmissionModeration,
  updateAdminLiveExam,
} from "@/lib/api";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";
import { getRankInfo, getRankTone } from "@/lib/rank";

const EMPTY_SCHEDULE = {
  title: "",
  competitionCategory: "daily",
  examDate: "",
  startTime: "",
  endTime: "",
  passingMarks: "",
};

const SAMPLE_JSON = JSON.stringify([
  {
    subject: "Maths",
    question_no: 1,
    instruction: "Solve the math and choose which option is the perfect answer. If there answer is not given in the option then choose E.",
    question: "Mr. Safwan from Chattogram invested in a life insurance policy. He paid the insurance company an annual premium of Tk. 25 for insurance of every thousand taka. His insurance coverage was Tk. 5,000. Mr. Safwan died after making 30 annual installments. The total sum paid by the insurance company was Tk. 9,200. By how much did the sum paid by the insurance company exceed the total amount of premium that Mr. Safwan had paid to the insurance company?",
    options: [
      "A) Tk. 5,450",
      "B) Tk. 5,200",
      "C) Tk. 5,750",
      "D) Tk. 4,950",
      "E) None of these"
    ],
    correct_answer: "A) Tk. 5,450",
    explanation: "Annual premium = 25 x 5 = Tk. 125. Total premium = 125 x 30 = Tk. 3,750. Excess = 9,200 - 3,750 = Tk. 5,450."
  }
], null, 2);

function formatSubmissionReason(value) {
  if (value === "tab_switch") return "Tab switch auto-submit";
  if (value === "timer_expired") return "Timer auto-submit";
  return "Manual submit";
}

const COMPETITION_CATEGORIES = [
  { value: "daily", label: "Daily Exam" },
  { value: "weekly", label: "Weekly Exam" },
];

const STATUS_STYLES = {
  upcoming: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  open: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  ended: "border-white/8 bg-white/5 text-[#8E8A9F]",
  scheduled: "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]",
};

function toDateTimeInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function toApiDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function toBangladeshDateInputValue(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${partMap.year}-${partMap.month}-${partMap.day}`;
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

function getQuestionJsonFromApi(questions = []) {
  return JSON.stringify(
    questions.map((question, index) => ({
      subject: question.subject || "Maths",
      question_no: question.question_no || question.questionNo || index + 1,
      instruction: question.instruction || "",
      question: question.questionText || question.question || "",
      options: Array.isArray(question.options) ? question.options : [],
      correct_answer: question.correct_answer || question.correctAnswer || "",
      explanation: question.explanation || "",
      ...(question.topic ? { topic: question.topic } : {}),
      ...(question.chapter ? { chapter: question.chapter } : {}),
      ...(question.subTopic ? { subTopic: question.subTopic } : {}),
      ...(question.difficulty ? { difficulty: question.difficulty } : {}),
    })),
    null,
    2
  );
}

function parseQuestionJson(value) {
  if (!value.trim()) return { questions: [], error: "" };

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return { questions: [], error: "Question JSON must be an array." };
    }

    return { questions: parsed, error: "" };
  } catch (error) {
    return { questions: [], error: error.message || "Question JSON is invalid." };
  }
}

function getLiveStatus(exam) {
  if (exam?.status) return exam.status;
  const now = Date.now();
  const startsAt = new Date(exam?.startTime).getTime();
  const endsAt = new Date(exam?.endTime).getTime();

  if (Number.isNaN(startsAt) || Number.isNaN(endsAt)) return "scheduled";
  if (now < startsAt) return "upcoming";
  if (now < endsAt) return "open";
  return "ended";
}

export default function AdminLiveExamsPage() {
  const [items, setItems] = useState([]);
  const [schedule, setSchedule] = useState(EMPTY_SCHEDULE);
  const [questionJson, setQuestionJson] = useState(SAMPLE_JSON);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const parsed = useMemo(() => parseQuestionJson(questionJson), [questionJson]);
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.startTime || 0) - new Date(a.startTime || 0));
  }, [items]);

  const loadExams = useCallback(async (options = {}) => {
    const silent = Boolean(options.silent);
    if (!silent) setLoading(true);
    setError("");

    try {
      const payload = await getAdminLiveExams();
      setItems(payload?.data || []);
    } catch (err) {
      setError(err.message || "Unable to load live exams.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const verifyAdmin = async () => {
      try {
        const payload = await getProfile();
        const token = window.localStorage.getItem("exam_archive_token");

        if (token && payload?.data) {
          saveAuthSession(token, payload.data);
        }

        if (!isMounted) return;
        const allowed = payload?.data?.role === "admin";
        setIsAdmin(allowed);

        if (allowed) {
          await loadExams();
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Unable to verify admin access.");
      } finally {
        if (isMounted) {
          setProfileLoading(false);
          setLoading(false);
        }
      }
    };

    verifyAdmin();

    return () => {
      isMounted = false;
    };
  }, [loadExams]);

  const resetForm = (clearMessages = true) => {
    setSchedule(EMPTY_SCHEDULE);
    setQuestionJson(SAMPLE_JSON);
    setEditingId("");
    if (clearMessages) {
      setError("");
      setSuccess("");
    }
  };

  const updateSchedule = (field, value) => {
    setSchedule((current) => ({ ...current, [field]: value }));
  };

  const startEditing = (exam) => {
    setEditingId(exam._id);
    setSchedule({
      title: exam.title || "",
      competitionCategory: exam.competitionCategory || "daily",
      examDate: toBangladeshDateInputValue(exam.examDate || exam.startTime),
      startTime: toDateTimeInputValue(exam.startTime),
      endTime: toDateTimeInputValue(exam.endTime),
      passingMarks: Number.isFinite(Number(exam.passingMarks)) ? Number(exam.passingMarks).toString() : "",
    });
    setQuestionJson(getQuestionJsonFromApi(exam.questions || []));
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPayload = () => {
    const isDailyExam = schedule.competitionCategory === "daily";

    return {
      title: schedule.title,
      competitionCategory: schedule.competitionCategory,
      ...(isDailyExam
        ? { examDate: schedule.examDate }
        : {
            startTime: toApiDate(schedule.startTime),
            endTime: toApiDate(schedule.endTime),
          }),
      passingMarks: schedule.passingMarks,
      questions: parsed.questions,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    if (!parsed.questions.length) {
      setError("Please paste at least one question object.");
      return;
    }

    setSaving(true);

    try {
      const payload = buildPayload();
      const response = editingId
        ? await updateAdminLiveExam(editingId, payload)
        : await createAdminLiveExam(payload);

      const saved = response?.data;
      if (saved) {
        setItems((current) => {
          if (!editingId) return [saved, ...current];
          return current.map((item) => (item._id === saved._id ? saved : item));
        });
      }

      setSuccess(editingId ? "Live exam updated." : "Live exam published.");
      resetForm(false);
      await loadExams({ silent: true });
    } catch (err) {
      setError(err.message || "Unable to save this live exam.");
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <FlashyLoader
        eyebrow="Admin"
        title="Checking admin access"
        message="Your current role is being verified."
        iconName="lock"
        skeleton="dashboard"
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-105 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 px-6 py-12 text-center">
        <div className="max-w-md">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-300" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-red-300">Admins Only</p>
          <h1 className="mt-3 font-serif text-3xl font-medium text-white">You do not have admin access</h1>
          <p className="mt-3 text-sm leading-6 text-red-100/75">
            Change this account role to admin in MongoDB Atlas, then refresh or sign in again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 text-left">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Live Exam Admin</p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-wide text-white">Live Exam Publisher</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8E8A9F]">
            Paste a strict JSON array of live exam questions and publish it for the scheduled exam window.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadExams()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#121017] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <section className="rounded-3xl border border-white/6 bg-[#121017] p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium text-white">{editingId ? "Edit Live Exam" : "Publish Live Exam"}</h2>
            <p className="mt-1 text-sm text-[#8E8A9F]">Use browser-local time. The backend stores schedule times in UTC.</p>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0F0D15] px-4 py-3 text-sm font-semibold text-[#8E8A9F] transition hover:border-white/15 hover:text-white"
            >
              <X className="h-4 w-4" />
              Cancel Edit
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-4 lg:grid-cols-5">
            <TextField label="Exam title" required value={schedule.title} onChange={(value) => updateSchedule("title", value)} placeholder="Example: Live Exam 01" icon={<FileQuestion className="h-4 w-4" />} />
            <SelectField label="Competition type" value={schedule.competitionCategory} onChange={(value) => updateSchedule("competitionCategory", value)} options={COMPETITION_CATEGORIES} />
            {schedule.competitionCategory === "daily" ? (
              <>
                <TextField label="Exam date" required type="date" value={schedule.examDate} onChange={(value) => updateSchedule("examDate", value)} icon={<CalendarClock className="h-4 w-4" />} />
                <div className="rounded-2xl border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-4 py-3 lg:col-span-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Clock3 className="h-4 w-4 text-[#DFB15B]" />
                    Fixed daily window
                  </span>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#DFB15B]">10:40 PM to 11:20 PM Bangladesh time</p>
                  <p className="mt-1 text-xs font-medium leading-5 text-[#8E8A9F]">Each attempt lasts 15 minutes and closes at 11:20 PM.</p>
                </div>
              </>
            ) : (
              <>
                <TextField label="Start time" required type="datetime-local" value={schedule.startTime} onChange={(value) => updateSchedule("startTime", value)} icon={<CalendarClock className="h-4 w-4" />} />
                <TextField label="End time" required type="datetime-local" value={schedule.endTime} onChange={(value) => updateSchedule("endTime", value)} icon={<Clock3 className="h-4 w-4" />} />
              </>
            )}
            <TextField
              label="Passing marks"
              type="number"
              value={schedule.passingMarks}
              onChange={(value) => updateSchedule("passingMarks", value)}
              placeholder={`Default ${Math.floor(parsed.questions.length * 0.4)}`}
              inputProps={{ min: 0, max: parsed.questions.length, step: 1 }}
            />
          </div>

          <label className="block rounded-2xl border border-white/5 bg-[#0F0D15] px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              <FileJson className="h-4 w-4 text-[#DFB15B]" />
              Question JSON array
            </span>
            <textarea
              required
              value={questionJson}
              onChange={(event) => setQuestionJson(event.target.value)}
              rows={18}
              spellCheck={false}
              className="mt-3 w-full resize-y rounded-2xl border border-white/8 bg-[#0A090F] p-4 font-mono text-xs leading-6 text-white outline-none transition placeholder:text-[#6B667B] focus:border-[#DFB15B]/45"
            />
          </label>

          <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${parsed.error ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"}`}>
            {parsed.error ? parsed.error : `${parsed.questions.length} question${parsed.questions.length === 1 ? "" : "s"} parsed from strict JSON.`}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={saving || Boolean(parsed.error)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
            >
              <LoadingButtonLabel
                loading={saving}
                idleText={editingId ? "Save Live Exam" : "Publish Live Exam"}
                loadingText="Saving..."
                iconName="check"
              />
            </button>
          </div>
        </form>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-200">
          {success}
        </div>
      ) : null}

      {loading ? (
        <FlashyLoader
          eyebrow="Live Exams"
          title="Loading saved live exams"
          message="Published exam schedules are being fetched."
          iconName="clipboard"
          skeleton="cards"
          className="min-h-90"
        />
      ) : null}

      {!loading && !sortedItems.length ? (
        <div className="rounded-3xl border border-white/5 bg-[#121017] px-6 py-12 text-center">
          <FileQuestion className="mx-auto h-9 w-9 text-[#DFB15B]" />
          <h2 className="mt-4 font-serif text-2xl font-medium text-white">No live exams yet</h2>
          <p className="mt-2 text-sm text-[#8E8A9F]">Publish the first live exam from the builder above.</p>
        </div>
      ) : null}

      {!loading && sortedItems.length ? (
        <div className="grid gap-4">
          {sortedItems.map((exam) => {
            const status = getLiveStatus(exam);

            return (
              <section key={exam._id} className="rounded-3xl border border-white/6 bg-[#121017] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-2xl font-medium text-white">{exam.title}</h2>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[status] || STATUS_STYLES.scheduled}`}>
                        {status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#8E8A9F]">
                      {formatDateTime(exam.startTime)} to {formatDateTime(exam.endTime)}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#DFB15B]">
                      {(exam.competitionCategory || "daily").toUpperCase()} - {exam.questionCount || exam.questions?.length || 0} question{(exam.questionCount || exam.questions?.length || 0) === 1 ? "" : "s"} / {exam.totalMarks || 0} marks
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#8E8A9F]">
                      Passing marks: {Number.isFinite(Number(exam.passingMarks)) ? Number(exam.passingMarks) : Math.floor(Number(exam.totalMarks || 0) * 0.4)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/dashboard/live-exams/${exam._id}?preview=admin`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DFB15B]/25 bg-[#DFB15B]/10 px-4 py-3 text-sm font-semibold text-[#DFB15B] transition hover:border-[#DFB15B]/45 hover:bg-[#DFB15B]/15"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEditing(exam)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0F0D15] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6B667B]">
                  <CheckCircle2 className="h-4 w-4 text-[#DFB15B]" />
                  <span>Created by {exam.createdBy?.name || "admin"}</span>
                </div>
                <SubmissionModerationPanel examId={exam._id} />
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function SubmissionModerationPanel({ examId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [reasonBySubmissionId, setReasonBySubmissionId] = useState({});
  const [savingId, setSavingId] = useState("");

  const loadSubmissions = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    setError("");

    try {
      const payload = await getAdminLiveExamSubmissions(examId);
      setSubmissions(payload?.data?.submissions || []);
    } catch (err) {
      setError(err.message || "Unable to load submissions.");
    } finally {
      setLoading(false);
    }
  }, [examId]);

  const updateModeration = async (submission, isDisqualified) => {
    const submissionId = submission._id;
    const reason = reasonBySubmissionId[submissionId] || "Manual admin review";
    setSavingId(submissionId);
    setError("");

    try {
      const payload = await updateSubmissionModeration(submissionId, { isDisqualified, reason });
      const updated = payload?.data;
      if (updated) {
        setSubmissions((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      }
    } catch (err) {
      setError(err.message || "Unable to update submission.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="mt-5 rounded-3xl border border-white/5 bg-[#0F0D15] p-4">
      <button
        type="button"
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);
          if (nextOpen) loadSubmissions();
        }}
        className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-[#DFB15B]"
      >
        <Users className="h-4 w-4 text-[#DFB15B]" />
        {open ? "Hide Results Moderation" : "Manage Results Moderation"}
      </button>

      {open ? (
        <div className="mt-4 space-y-3">
          {loading ? <p className="text-sm text-[#8E8A9F]">Loading submissions...</p> : null}
          {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">{error}</p> : null}
          {!loading && !submissions.length ? (
            <p className="rounded-2xl border border-white/5 bg-[#121017] px-4 py-5 text-sm text-[#8E8A9F]">No submissions yet.</p>
          ) : null}

          {submissions.map((submission) => {
            const isDisqualified = Boolean(submission.isDisqualified);
            const rankInfo = getRankInfo(submission.rankInfo);
            const rankTone = getRankTone(rankInfo);
            return (
              <div key={submission._id} className="grid gap-3 rounded-2xl border border-white/5 bg-[#121017] p-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.55fr)_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className={`truncate text-sm font-bold ${rankTone.name}`}>{submission.student?.name || "Student"}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${rankTone.badge}`}>
                      {rankInfo.rankName}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-[#8E8A9F]">{submission.student?.house || "No house"} - Score {Number(submission.score || 0).toFixed(2)} - Effective {Number(submission.effectiveScore || 0).toFixed(2)}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#DFB15B]">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {formatSubmissionReason(submission.submissionReason)}
                  </p>
                  {isDisqualified ? (
                    <p className="mt-1 text-xs font-semibold text-red-300">Disqualified: {submission.disqualificationReason || "No reason saved"}</p>
                  ) : null}
                </div>

                <input
                  value={reasonBySubmissionId[submission._id] || ""}
                  onChange={(event) => setReasonBySubmissionId((current) => ({ ...current, [submission._id]: event.target.value }))}
                  placeholder="Reason for disqualification"
                  className="h-11 rounded-2xl border border-white/8 bg-[#0A090F] px-3 text-sm text-white outline-none transition placeholder:text-[#6B667B] focus:border-[#DFB15B]/45"
                />

                {isDisqualified ? (
                  <button
                    type="button"
                    disabled={savingId === submission._id}
                    onClick={() => updateModeration(submission, false)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-200 transition hover:bg-emerald-400/15 disabled:cursor-wait disabled:opacity-60"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reinstate
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={savingId === submission._id}
                    onClick={() => updateModeration(submission, true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-200 transition hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-60"
                  >
                    <Gavel className="h-4 w-4" />
                    Disqualify
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder = "", required = false, icon = <Save className="h-4 w-4" />, inputProps = {} }) {
  return (
    <label className="block rounded-2xl border border-white/5 bg-[#0F0D15] px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-[#DFB15B]">{icon}</span>
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        {...inputProps}
        className="mt-3 w-full border-0 border-b border-white/15 bg-transparent px-0 py-2 text-sm text-white outline-none transition placeholder:text-[#6B667B] focus:border-[#DFB15B]/50"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block rounded-2xl border border-white/5 bg-[#121017] px-4 py-3">
      <span className="text-sm font-semibold text-white">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-10 w-full rounded-xl border border-white/8 bg-[#0F0D15] px-3 text-sm font-semibold text-white outline-none transition focus:border-[#DFB15B]/50"
      >
        {options.map((option) => {
          const item = typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={item.value} value={item.value} className="bg-[#121017] text-white">
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}
