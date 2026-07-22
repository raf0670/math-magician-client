"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  FileQuestion,
  PlusCircle,
  RefreshCw,
  Save,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import {
  createAdminLiveExam,
  getAdminLiveExams,
  getProfile,
  saveAuthSession,
  updateAdminLiveExam,
} from "@/lib/api";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

const SUBJECTS = ["Maths", "English", "Analytical"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const OPTION_LABELS = ["A", "B", "C", "D", "E"];

const EMPTY_SCHEDULE = {
  title: "",
  startTime: "",
  endTime: "",
};

const STATUS_STYLES = {
  upcoming: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  open: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  ended: "border-white/8 bg-white/5 text-[#8E8A9F]",
  scheduled: "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]",
};

function makeQuestion() {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    subject: "Maths",
    topic: "",
    subTopic: "",
    difficulty: "Medium",
    question: "",
    options: ["", "", "", "", ""],
    correctOptionIndex: 0,
    explanation: "",
  };
}

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

function formatDateTime(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function stripOptionLabel(value) {
  return value?.toString().trim().replace(/^[A-E]\s*[\).:-]\s*/i, "").trim() || "";
}

function getQuestionFromApi(question) {
  const options = Array.isArray(question.options) ? question.options.map(stripOptionLabel) : ["", "", "", "", ""];
  const paddedOptions = [...options, "", "", "", "", ""].slice(0, 5);
  const correctAnswer = stripOptionLabel(question.correctAnswer || question.correct_answer || "");
  const correctOptionIndex = Math.max(0, paddedOptions.findIndex((option) => option.trim().toLowerCase() === correctAnswer.toLowerCase()));

  return {
    id: question._id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    subject: question.subject || "Maths",
    topic: question.topic || question.chapter || "",
    subTopic: question.subTopic || "",
    difficulty: question.difficulty || "Medium",
    question: question.questionText || question.question || "",
    options: paddedOptions,
    correctOptionIndex,
    explanation: question.explanation || "",
  };
}

function getLiveStatus(exam) {
  if (exam?.status) return exam.status;
  const now = Date.now();
  const startsAt = new Date(exam?.startTime).getTime();
  const endsAt = new Date(exam?.endTime).getTime();

  if (Number.isNaN(startsAt) || Number.isNaN(endsAt)) return "scheduled";
  if (now < startsAt) return "upcoming";
  if (now <= endsAt) return "open";
  return "ended";
}

export default function AdminLiveExamsPage() {
  const [items, setItems] = useState([]);
  const [schedule, setSchedule] = useState(EMPTY_SCHEDULE);
  const [questions, setQuestions] = useState([makeQuestion()]);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setQuestions([makeQuestion()]);
    setEditingId("");
    if (clearMessages) {
      setError("");
      setSuccess("");
    }
  };

  const updateSchedule = (field, value) => {
    setSchedule((current) => ({ ...current, [field]: value }));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestions((current) => current.map((question) => (
      question.id === questionId ? { ...question, [field]: value } : question
    )));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions((current) => current.map((question) => {
      if (question.id !== questionId) return question;
      const nextOptions = [...question.options];
      nextOptions[optionIndex] = value;
      return { ...question, options: nextOptions };
    }));
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, makeQuestion()]);
  };

  const removeQuestion = (questionId) => {
    setQuestions((current) => current.length === 1 ? current : current.filter((question) => question.id !== questionId));
  };

  const startEditing = (exam) => {
    setEditingId(exam._id);
    setSchedule({
      title: exam.title || "",
      startTime: toDateTimeInputValue(exam.startTime),
      endTime: toDateTimeInputValue(exam.endTime),
    });
    setQuestions(exam.questions?.length ? exam.questions.map(getQuestionFromApi) : [makeQuestion()]);
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPayload = () => ({
    title: schedule.title,
    startTime: toApiDate(schedule.startTime),
    endTime: toApiDate(schedule.endTime),
    questions: questions.map((question) => ({
      subject: question.subject,
      topic: question.topic,
      subTopic: question.subTopic,
      difficulty: question.difficulty,
      question: question.question,
      options: question.options,
      correct_answer: question.options[question.correctOptionIndex] || "",
      explanation: question.explanation,
    })),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
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
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-wide text-white">Live Exam Builder</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8E8A9F]">
            Schedule one live exam and publish its complete question set for students.
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
          <div className="grid gap-4 lg:grid-cols-3">
            <TextField label="Exam title" required value={schedule.title} onChange={(value) => updateSchedule("title", value)} placeholder="Example: Live Exam 01" icon={<FileQuestion className="h-4 w-4" />} />
            <TextField label="Start time" required type="datetime-local" value={schedule.startTime} onChange={(value) => updateSchedule("startTime", value)} icon={<CalendarClock className="h-4 w-4" />} />
            <TextField label="End time" required type="datetime-local" value={schedule.endTime} onChange={(value) => updateSchedule("endTime", value)} icon={<Clock3 className="h-4 w-4" />} />
          </div>

          <div className="flex flex-col gap-4">
            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                canRemove={questions.length > 1}
                onChange={updateQuestion}
                onOptionChange={updateOption}
                onRemove={removeQuestion}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0F0D15] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
            >
              <PlusCircle className="h-4 w-4" />
              Add Question
            </button>

            <button
              type="submit"
              disabled={saving}
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
                      {exam.questionCount || exam.questions?.length || 0} question{(exam.questionCount || exam.questions?.length || 0) === 1 ? "" : "s"} / {exam.totalMarks || 0} marks
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => startEditing(exam)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0F0D15] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6B667B]">
                  <CheckCircle2 className="h-4 w-4 text-[#DFB15B]" />
                  <span>Created by {exam.createdBy?.name || "admin"}</span>
                </div>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function QuestionEditor({ question, index, canRemove, onChange, onOptionChange, onRemove }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#0F0D15] p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
          <FileQuestion className="h-4 w-4 text-[#DFB15B]" />
          Question #{index + 1}
        </h3>
        <button
          type="button"
          disabled={!canRemove}
          onClick={() => onRemove(question.id)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <SelectField label="Subject" value={question.subject} onChange={(value) => onChange(question.id, "subject", value)} options={SUBJECTS} />
        <TextField label="Topic" required value={question.topic} onChange={(value) => onChange(question.id, "topic", value)} placeholder="Age" />
        <TextField label="Sub-topic" required value={question.subTopic} onChange={(value) => onChange(question.id, "subTopic", value)} placeholder="Ages at Future Points in Time" />
        <SelectField label="Difficulty" value={question.difficulty} onChange={(value) => onChange(question.id, "difficulty", value)} options={DIFFICULTIES} />
      </div>

      <label className="mt-4 block rounded-2xl border border-white/5 bg-[#121017] px-4 py-3">
        <span className="text-sm font-semibold text-white">Question</span>
        <textarea
          required
          value={question.question}
          onChange={(event) => onChange(question.id, "question", event.target.value)}
          rows={4}
          placeholder="Write the full question stem"
          className="mt-2 w-full resize-none border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6B667B]"
        />
      </label>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        {OPTION_LABELS.map((label, optionIndex) => (
          <label key={label} className="block rounded-2xl border border-white/5 bg-[#121017] px-4 py-3">
            <span className="text-sm font-semibold text-white">Option {label}</span>
            <input
              required
              value={question.options[optionIndex] || ""}
              onChange={(event) => onOptionChange(question.id, optionIndex, event.target.value)}
              placeholder={`${label}) answer text`}
              className="mt-3 w-full border-0 border-b border-white/15 bg-transparent px-0 py-2 text-sm text-white outline-none transition placeholder:text-[#6B667B] focus:border-[#DFB15B]/50"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <SelectField
          label="Correct answer"
          value={question.correctOptionIndex.toString()}
          onChange={(value) => onChange(question.id, "correctOptionIndex", Number(value))}
          options={OPTION_LABELS.map((label, optionIndex) => ({
            value: optionIndex.toString(),
            label: `Option ${label}${question.options[optionIndex] ? ` - ${question.options[optionIndex]}` : ""}`,
          }))}
        />

        <label className="block rounded-2xl border border-white/5 bg-[#121017] px-4 py-3">
          <span className="text-sm font-semibold text-white">Explanation</span>
          <textarea
            required
            value={question.explanation}
            onChange={(event) => onChange(question.id, "explanation", event.target.value)}
            rows={3}
            placeholder="Show the reasoning students should review after the exam."
            className="mt-2 w-full resize-none border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6B667B]"
          />
        </label>
      </div>
    </section>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder = "", required = false, icon = <Save className="h-4 w-4" /> }) {
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
