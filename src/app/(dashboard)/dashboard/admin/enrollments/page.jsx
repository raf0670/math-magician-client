"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, RefreshCw, ShieldAlert, XCircle } from "lucide-react";
import {
  getAdminEnrollmentReviews,
  getProfile,
  saveAuthSession,
  updateAdminEnrollmentStatus,
} from "@/lib/api";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

const STATUS_TABS = [
  { id: "", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const STATUS_STYLES = {
  pending: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  approved: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  rejected: "border-red-400/25 bg-red-400/10 text-red-200",
};

function formatDate(value) {
  if (!value) return "Not reviewed";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getEnrollmentName(item) {
  return item.enrollment?.yourName || item.user?.name || "Unnamed student";
}

function formatInfoValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "";
  return value;
}

export default function AdminEnrollmentReviewsPage() {
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [reviewNotes, setReviewNotes] = useState({});
  const [activeAction, setActiveAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  const loadReviews = useCallback(async (nextStatus = "", options = {}) => {
    const silent = Boolean(options.silent);

    if (!silent) {
      setLoading(true);
    }

    setError("");

    try {
      const payload = await getAdminEnrollmentReviews(nextStatus);
      setItems(payload?.data || []);
    } catch (err) {
      setError(err.message || "Unable to load enrollment reviews.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
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
          await loadReviews("pending");
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
  }, [loadReviews]);

  useEffect(() => {
    if (!isAdmin) return undefined;

    const syncVisibleReviews = () => {
      if (document.visibilityState === "visible") {
        loadReviews(status, { silent: true });
      }
    };

    window.addEventListener("focus", syncVisibleReviews);
    document.addEventListener("visibilitychange", syncVisibleReviews);
    const syncTimer = window.setInterval(syncVisibleReviews, 15000);

    return () => {
      window.removeEventListener("focus", syncVisibleReviews);
      document.removeEventListener("visibilitychange", syncVisibleReviews);
      window.clearInterval(syncTimer);
    };
  }, [isAdmin, loadReviews, status]);

  const handleTabChange = (nextStatus) => {
    setStatus(nextStatus);
    loadReviews(nextStatus);
  };

  const handleReviewNoteChange = (paymentId, value) => {
    setReviewNotes((current) => ({ ...current, [paymentId]: value }));
  };

  const handleStatusUpdate = async (paymentId, nextStatus) => {
    const actionKey = `${paymentId}:${nextStatus}`;
    setActiveAction(actionKey);
    setError("");

    try {
      const payload = await updateAdminEnrollmentStatus(paymentId, nextStatus, reviewNotes[paymentId] || "");
      const updated = payload?.data;

      if (updated) {
        setItems((current) => {
          if (status && updated.status !== status) {
            return current.filter((item) => item.paymentId !== paymentId);
          }

          return current.map((item) => (item.paymentId === paymentId ? updated : item));
        });
      }

      await loadReviews(status, { silent: true });
    } catch (err) {
      setError(err.message || `Unable to mark enrollment as ${nextStatus}.`);
    } finally {
      setActiveAction("");
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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Manual bKash Review</p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-wide text-white">Enrollment Approvals</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8E8A9F]">
            Verify submitted transaction IDs, then approve legitimate payments to unlock class access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadReviews(status)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-[#121017] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id || "all"}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              status === tab.id
                ? "border-[#DFB15B]/40 bg-[#DFB15B]/15 text-[#DFB15B]"
                : "border-white/8 bg-[#121017] text-[#8E8A9F] hover:border-white/15 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.id && counts[tab.id] ? <span className="ml-2 text-xs opacity-75">{counts[tab.id]}</span> : null}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <FlashyLoader
          eyebrow="Enrollments"
          title="Loading reviews"
          message="Pending bKash submissions are being fetched."
          iconName="credit"
          skeleton="cards"
          className="min-h-90"
        />
      ) : null}

      {!loading && !items.length ? (
        <div className="rounded-3xl border border-white/5 bg-[#121017] px-6 py-12 text-center">
          <Clock3 className="mx-auto h-9 w-9 text-[#DFB15B]" />
          <h2 className="mt-4 font-serif text-2xl font-medium text-white">No enrollment reviews found</h2>
          <p className="mt-2 text-sm text-[#8E8A9F]">New manual bKash submissions will appear here.</p>
        </div>
      ) : null}

      {!loading && items.length ? (
        <div className="grid gap-4">
          {items.map((item) => {
            const paymentId = item.paymentId;
            const note = reviewNotes[paymentId] ?? item.reviewNote ?? "";
            const approveKey = `${paymentId}:approved`;
            const rejectKey = `${paymentId}:rejected`;
            const isPending = item.status === "pending";

            return (
              <section key={paymentId} className="rounded-3xl border border-white/6 bg-[#121017] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-2xl font-medium text-white">{getEnrollmentName(item)}</h2>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[item.status] || STATUS_STYLES.pending}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#8E8A9F]">{item.user?.email || item.enrollment?.emailAddress || "No email"}</p>
                  </div>
                  <div className="rounded-2xl border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-4 py-3 text-left lg:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DFB15B]">BkashTrxID</p>
                    <p className="mt-1 font-mono text-base font-semibold text-white">{item.bkashTrxID}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <Info label="Plan" value={`${item.planTitle} - BDT ${item.amount}`} />
                  <Info label="Phone" value={item.enrollment?.phoneNumber} />
                  <Info label="College" value={item.enrollment?.college} />
                  <Info label="Preferred Batch" value={item.enrollment?.preferredBatch || "Not selected"} />
                  <Info label="Group" value={item.enrollment?.group} />
                  <Info label="HSC Batch" value={item.enrollment?.hscBatch} />
                  <Info label="Backup Choice" value={item.enrollment?.backupChoice} />
                  <Info label="Submitted" value={formatDate(item.createdAt)} />
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                  <label className="block">
                    <span className="text-sm font-semibold text-white">Review note</span>
                    <textarea
                      value={note}
                      onChange={(event) => handleReviewNoteChange(paymentId, event.target.value)}
                      readOnly={!isPending}
                      rows={3}
                      className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#6B667B] ${isPending ? "border-white/8 bg-[#0F0D15] focus:border-[#DFB15B]/35" : "border-white/5 bg-[#0F0D15]/60 text-[#8E8A9F]"}`}
                      placeholder="Optional note for this decision"
                    />
                  </label>

                  {isPending ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        disabled={Boolean(activeAction)}
                        onClick={() => handleStatusUpdate(paymentId, "approved")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                      >
                        <LoadingButtonLabel
                          loading={activeAction === approveKey}
                          idleText="Approve"
                          loadingText="Approving..."
                          iconName="check"
                        />
                      </button>
                      <button
                        type="button"
                        disabled={Boolean(activeAction)}
                        onClick={() => handleStatusUpdate(paymentId, "rejected")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm font-bold uppercase tracking-wider text-red-200 transition hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-70"
                      >
                        {activeAction === rejectKey ? (
                          "Rejecting..."
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/6 bg-[#0F0D15] px-4 py-3 text-sm font-semibold text-[#8E8A9F]">
                      Decision recorded
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6B667B]">
                  <CheckCircle2 className="h-4 w-4 text-[#DFB15B]" />
                  <span>Last reviewed: {formatDate(item.reviewedAt)}</span>
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
  const displayValue = formatInfoValue(value);

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0F0D15] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">{label}</p>
      <p className="mt-1 wrap-break-word font-medium text-white">{displayValue || "Not provided"}</p>
    </div>
  );
}
