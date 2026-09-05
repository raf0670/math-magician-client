"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  ExternalLink,
  Link as LinkIcon,
  PlusCircle,
  RefreshCw,
  ShieldAlert,
  Video,
  X,
} from "lucide-react";
import {
  createAdminLiveClass,
  getAdminLiveClasses,
  getProfile,
  saveAuthSession,
  updateAdminLiveClass,
} from "@/lib/api";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

const EMPTY_FORM = {
  program: "general",
  title: "",
  zoomUrl: "",
  startsAt: "",
  endsAt: "",
  note: "",
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

function formatDateTime(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getClassStatus(item) {
  const now = Date.now();
  const startsAt = new Date(item.startsAt).getTime();
  const endsAt = new Date(item.endsAt).getTime();

  if (Number.isNaN(startsAt) || Number.isNaN(endsAt)) return "scheduled";
  if (now < startsAt) return "upcoming";
  if (now <= endsAt) return "live";
  return "ended";
}

const STATUS_STYLES = {
  upcoming: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  live: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  ended: "border-white/8 bg-white/5 text-[#8E8A9F]",
  scheduled: "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]",
};

export default function AdminLiveClassesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(a.startsAt || 0) - new Date(b.startsAt || 0));
  }, [items]);

  const loadClasses = useCallback(async (options = {}) => {
    const silent = Boolean(options.silent);
    if (!silent) setLoading(true);
    setError("");

    try {
      const payload = await getAdminLiveClasses();
      setItems(payload?.data || []);
    } catch (err) {
      setError(err.message || "Unable to load live classes.");
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
          await loadClasses();
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
  }, [loadClasses]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId("");
    setSuccess("");
    setError("");
  };

  const startEditing = (item) => {
    setEditingId(item._id);
    setForm({
      program: item.program || "general",
      title: item.title || "",
      zoomUrl: item.zoomUrl || "",
      startsAt: toDateTimeInputValue(item.startsAt),
      endsAt: toDateTimeInputValue(item.endsAt),
      note: item.note || "",
    });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const startsAt = toApiDate(form.startsAt);
    const endsAt = toApiDate(form.endsAt);
    const payload = {
      program: form.program,
      title: form.title,
      zoomUrl: form.zoomUrl,
      startsAt,
      endsAt,
      note: form.note,
    };

    try {
      setSaving(true);
      const response = editingId
        ? await updateAdminLiveClass(editingId, payload)
        : await createAdminLiveClass(payload);
      const saved = response?.data;

      if (saved) {
        setItems((current) => {
          if (!editingId) return [saved, ...current];
          return current.map((item) => (item._id === saved._id ? saved : item));
        });
      }

      setSuccess(editingId ? "Class schedule updated." : "Class schedule posted.");
      setForm(EMPTY_FORM);
      setEditingId("");
      await loadClasses({ silent: true });
    } catch (err) {
      setError(err.message || "Unable to save this class.");
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
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Live Classes</p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-wide text-white">Zoom Class Manager</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8E8A9F]">
            Post a class link and schedule. Approved students will see it on their Live Classes page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadClasses()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#121017] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <section className="rounded-3xl border border-white/6 bg-[#121017] p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium text-white">
              {editingId ? "Edit Class" : "Post New Class"}
            </h2>
            <p className="mt-1 text-sm text-[#8E8A9F]">Use browser-local time. The backend stores the schedule in UTC.</p>
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

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="text-sm text-white">Program
            <select className="ml-3 rounded-xl bg-[#1A1722] p-3" value={form.program} onChange={event => updateField('program', event.target.value)}>
              <option value="general">General website</option><option value="math">Math Course</option>
            </select>
          </label>
          <div className="grid gap-4 lg:grid-cols-2">
            <TextField label="Class title" required value={form.title} onChange={(value) => updateField("title", value)} placeholder="Example: Math Live Class 04" />
            <TextField label="Zoom link" required value={form.zoomUrl} onChange={(value) => updateField("zoomUrl", value)} placeholder="https://us02web.zoom.us/j/..." icon={<LinkIcon className="h-4 w-4" />} />
            <TextField label="Start time" required type="datetime-local" value={form.startsAt} onChange={(value) => updateField("startsAt", value)} icon={<CalendarClock className="h-4 w-4" />} />
            <TextField label="End time" required type="datetime-local" value={form.endsAt} onChange={(value) => updateField("endsAt", value)} icon={<Clock3 className="h-4 w-4" />} />
          </div>

          <label className="block rounded-2xl border border-white/5 bg-[#0F0D15] px-4 py-3">
            <span className="text-sm font-semibold text-white">Optional note</span>
            <textarea
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Short context for students"
              className="mt-2 w-full resize-none border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6B667B]"
            />
          </label>

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

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 sm:w-fit"
          >
            <LoadingButtonLabel
              loading={saving}
              idleText={editingId ? "Save Changes" : "Post Class"}
              loadingText="Saving..."
              iconName="check"
            />
          </button>
        </form>
      </section>

      {loading ? (
        <FlashyLoader
          eyebrow="Live Classes"
          title="Loading schedules"
          message="Class posts are being fetched."
          iconName="video"
          skeleton="cards"
          className="min-h-90"
        />
      ) : null}

      {!loading && !sortedItems.length ? (
        <div className="rounded-3xl border border-white/5 bg-[#121017] px-6 py-12 text-center">
          <Video className="mx-auto h-9 w-9 text-[#DFB15B]" />
          <h2 className="mt-4 font-serif text-2xl font-medium text-white">No classes posted yet</h2>
          <p className="mt-2 text-sm text-[#8E8A9F]">Create the first class schedule from the form above.</p>
        </div>
      ) : null}

      {!loading && sortedItems.length ? (
        <div className="grid gap-4">
          {sortedItems.map((item) => {
            const status = getClassStatus(item);

            return (
              <section key={item._id} className="rounded-3xl border border-white/6 bg-[#121017] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-2xl font-medium text-white">{item.title}</h2><p className="text-xs text-emerald-200">{item.program === "math" ? "Math Course" : "General website"}</p>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}>
                        {status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#8E8A9F]">
                      {formatDateTime(item.startsAt)} to {formatDateTime(item.endsAt)}
                    </p>
                    {item.note ? <p className="mt-3 max-w-3xl text-sm leading-6 text-[#A9A3BA]">{item.note}</p> : null}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href={item.zoomUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-4 py-3 text-sm font-semibold text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </a>
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#0F0D15] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6B667B]">
                  <CheckCircle2 className="h-4 w-4 text-[#DFB15B]" />
                  <span>Posted by {item.createdBy?.name || "admin"}</span>
                </div>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder = "", required = false, icon = <PlusCircle className="h-4 w-4" /> }) {
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
