"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Banknote, CheckCircle2, Clock3, RefreshCw, ShieldAlert, XCircle } from "lucide-react";
import {
  getAdminEnrollmentReviews,
  getAdminPreBookings,
  getProfile,
  markAdminEnrollmentFullyPaid,
  saveAuthSession,
  updateAdminEnrollmentStatus,
} from "@/lib/api";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

const PRE_BOOKING_STATUS = "pre-booking";

const STATUS_TABS = [
  { id: PRE_BOOKING_STATUS, label: "Pre-Booking" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const STATUS_STYLES = {
  [PRE_BOOKING_STATUS]: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  pending: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  approved: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  rejected: "border-red-400/25 bg-red-400/10 text-red-200",
};

const PAYMENT_CHOICE_STYLES = {
  full: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  partial: "border-sky-400/25 bg-sky-400/10 text-sky-200",
};

const PAYMENT_METHOD_STYLES = {
  bkash: "border-pink-400/25 bg-pink-400/10 text-pink-100",
  bank: "border-violet-400/25 bg-violet-400/10 text-violet-100",
};

const PLAN_DISPLAY_NAMES = {
  offline: "Gryffindor",
  premium: "Ravenclaw",
  online: "Hufflepuff",
  "IBA Offline Batch - Farmgate": "Gryffindor",
  "IBA Online Batch": "Ravenclaw",
  "IBA Offline Batch - Bailey Road": "Hufflepuff",
  "Farmgate - Gryffindor": "Gryffindor",
  "Online - Ravenclaw": "Ravenclaw",
  "Bailey Road - Hufflepuff": "Hufflepuff",
  Gryffindor: "Gryffindor",
  Ravenclaw: "Ravenclaw",
  Hufflepuff: "Hufflepuff",
};

const BATCH_DISPLAY_NAMES = {
  Farmgate: "Gryffindor",
  "Bailey Road": "Hufflepuff",
  Online: "Ravenclaw",
  "Farmgate - Gryffindor": "Gryffindor",
  "Bailey Road - Hufflepuff": "Hufflepuff",
  "Online - Ravenclaw": "Ravenclaw",
  Gryffindor: "Gryffindor",
  Hufflepuff: "Hufflepuff",
  Ravenclaw: "Ravenclaw",
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

function formatBDT(value) {
  if (typeof value !== "number") return "";
  return `BDT ${value.toLocaleString("en-US")}`;
}

function formatPaymentChoice(value) {
  return value === "partial" ? "Partial" : "Full";
}

function formatPaymentMethod(value) {
  return value === "bank" ? "Bank" : "bKash";
}

function formatDeliveryMode(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getPlanDisplayName(item) {
  return PLAN_DISPLAY_NAMES[item.planId] || PLAN_DISPLAY_NAMES[item.planTitle] || item.planTitle;
}

function formatPlanValue(item) {
  const planName = getPlanDisplayName(item) || "Not selected";
  return item.amount ? `${planName} - BDT ${item.amount}` : planName;
}

function formatPreferredBatch(value) {
  return BATCH_DISPLAY_NAMES[value] || value;
}

function getStatusLabel(value) {
  if (value === PRE_BOOKING_STATUS) return "Pre-Booking";
  return value || "All";
}

function getLoadingCopy(status) {
  if (status === PRE_BOOKING_STATUS) {
    return {
      eyebrow: "Pre-Bookings",
      title: "Loading booked seats",
      message: "Saved seat bookings without submitted payment are being fetched.",
    };
  }

  return {
    eyebrow: "Enrollments",
    title: "Loading reviews",
    message: "Pending bKash submissions are being fetched.",
  };
}

function getEmptyCopy(status) {
  if (status === PRE_BOOKING_STATUS) {
    return {
      title: "No pre-bookings found",
      message: "Students who book a seat before checkout will appear here.",
    };
  }

  return {
    title: "No enrollment reviews found",
    message: "New manual bKash submissions will appear here.",
  };
}

export default function AdminEnrollmentReviewsPage() {
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [reviewNotes, setReviewNotes] = useState({});
  const [finalTrxIDs, setFinalTrxIDs] = useState({});
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
      const payload = nextStatus === PRE_BOOKING_STATUS
        ? await getAdminPreBookings()
        : await getAdminEnrollmentReviews(nextStatus);
      setItems(payload?.data || []);
    } catch (err) {
      setError(err.message || (nextStatus === PRE_BOOKING_STATUS ? "Unable to load pre-bookings." : "Unable to load enrollment reviews."));
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

  const handleFinalTrxIDChange = (paymentId, value) => {
    setFinalTrxIDs((current) => ({ ...current, [paymentId]: value }));
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

  const handleFullyPaidUpdate = async (paymentId) => {
    const finalTrxID = finalTrxIDs[paymentId]?.trim() || "";
    if (!finalTrxID) {
      setError("Final bKash transaction ID is required.");
      return;
    }

    const actionKey = `${paymentId}:fully-paid`;
    setActiveAction(actionKey);
    setError("");

    try {
      const payload = await markAdminEnrollmentFullyPaid(paymentId, finalTrxID);
      const updated = payload?.data;

      if (updated) {
        setItems((current) => current.map((item) => (item.paymentId === paymentId ? updated : item)));
        setFinalTrxIDs((current) => ({ ...current, [paymentId]: "" }));
      }

      await loadReviews(status, { silent: true });
    } catch (err) {
      setError(err.message || "Unable to mark enrollment fully paid.");
    } finally {
      setActiveAction("");
    }
  };

  const loadingCopy = getLoadingCopy(status);
  const emptyCopy = getEmptyCopy(status);

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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Admin Enrollment Desk</p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-wide text-white">Enrollment Approvals</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8E8A9F]">
            Review booked seats and verify submitted transaction IDs before class access is unlocked.
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
          eyebrow={loadingCopy.eyebrow}
          title={loadingCopy.title}
          message={loadingCopy.message}
          iconName="credit"
          skeleton="cards"
          className="min-h-90"
        />
      ) : null}

      {!loading && !items.length ? (
        <div className="rounded-3xl border border-white/5 bg-[#121017] px-6 py-12 text-center">
          <Clock3 className="mx-auto h-9 w-9 text-[#DFB15B]" />
          <h2 className="mt-4 font-serif text-2xl font-medium text-white">{emptyCopy.title}</h2>
          <p className="mt-2 text-sm text-[#8E8A9F]">{emptyCopy.message}</p>
        </div>
      ) : null}

      {!loading && items.length ? (
        <div className="grid gap-4">
          {items.map((item) => {
            const paymentId = item.paymentId;
            const isPreBooking = item.status === PRE_BOOKING_STATUS;
            const itemKey = paymentId || item.bookingId;
            const note = isPreBooking ? "" : reviewNotes[paymentId] ?? item.reviewNote ?? "";
            const approveKey = `${paymentId}:approved`;
            const rejectKey = `${paymentId}:rejected`;
            const fullyPaidKey = `${paymentId}:fully-paid`;
            const isPending = item.status === "pending";
            const isPartial = item.paymentChoice === "partial";
            const hasRemainingDue = Number(item.remainingAmount || 0) > 0;
            const canMarkFullyPaid = !isPreBooking && item.status === "approved" && isPartial && hasRemainingDue && !item.finalTrxID;
            const finalTrxID = finalTrxIDs[paymentId] || "";

            return (
              <section key={itemKey} className="rounded-3xl border border-white/6 bg-[#121017] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-2xl font-medium text-white">{getEnrollmentName(item)}</h2>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[item.status] || STATUS_STYLES.pending}`}>
                        {getStatusLabel(item.status)}
                      </span>
                      {!isPreBooking ? (
                        <>
                          <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${PAYMENT_CHOICE_STYLES[item.paymentChoice] || PAYMENT_CHOICE_STYLES.full}`}>
                            {formatPaymentChoice(item.paymentChoice)}
                          </span>
                          <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${PAYMENT_METHOD_STYLES[item.paymentMethod] || PAYMENT_METHOD_STYLES.bkash}`}>
                            {formatPaymentMethod(item.paymentMethod)}
                          </span>
                        </>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-[#8E8A9F]">{item.user?.email || item.enrollment?.emailAddress || "No email"}</p>
                  </div>
                  <div className="rounded-2xl border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-4 py-3 text-left lg:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DFB15B]">
                      {isPreBooking ? "Booked Seat" : item.paymentMethod === "bank" ? "Bank Reference" : "BkashTrxID"}
                    </p>
                    <p className="mt-1 font-mono text-base font-semibold text-white">
                      {isPreBooking ? formatDate(item.createdAt) : item.bkashTrxID}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <Info label="Plan" value={formatPlanValue(item)} />
                  {!isPreBooking ? <Info label="Payment Type" value={formatPaymentChoice(item.paymentChoice)} /> : null}
                  {!isPreBooking ? <Info label="Payment Method" value={formatPaymentMethod(item.paymentMethod)} /> : null}
                  <Info label="Delivery Mode" value={formatDeliveryMode(item.deliveryMode)} />
                  {!isPreBooking ? <Info label="Paid Now" value={formatBDT(item.paidAmount)} /> : null}
                  {!isPreBooking ? <Info label="Remaining Due" value={formatBDT(item.remainingAmount)} /> : null}
                  {!isPreBooking ? <Info label="Final TrxID" value={item.finalTrxID} /> : null}
                  <Info label="Phone" value={item.enrollment?.phoneNumber} />
                  {isPreBooking ? <Info label="Facebook Profile" value={item.enrollment?.facebookProfile} /> : null}
                  <Info label="College" value={item.enrollment?.college} />
                  <Info label="Preferred Batch" value={formatPreferredBatch(item.enrollment?.preferredBatch) || "Not selected"} />
                  <Info label="Group" value={item.enrollment?.group} />
                  <Info label="HSC Batch" value={item.enrollment?.hscBatch} />
                  <Info label="Backup Choice" value={item.enrollment?.backupChoice} />
                  <Info label={isPreBooking ? "Booked" : "Submitted"} value={formatDate(item.createdAt)} />
                  {isPreBooking ? <Info label="Last Updated" value={formatDate(item.updatedAt)} /> : null}
                </div>

                {isPreBooking ? (
                  <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/8 px-4 py-3 text-sm font-semibold text-cyan-100">
                    This student has booked a seat but has not submitted a payment reference yet.
                  </div>
                ) : (
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
                )}

                {canMarkFullyPaid ? (
                  <div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-400/8 px-4 py-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-sky-100">
                          <Banknote className="h-4 w-4 text-sky-200" />
                          Final installment due: {formatBDT(item.remainingAmount)}
                        </div>
                        <input
                          type="text"
                          value={finalTrxID}
                          onChange={(event) => handleFinalTrxIDChange(paymentId, event.target.value)}
                          placeholder="Final bKash transaction ID"
                          className="mt-3 w-full rounded-2xl border border-white/8 bg-[#0F0D15] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#6B667B] focus:border-sky-300/45"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={Boolean(activeAction)}
                        onClick={() => handleFullyPaidUpdate(paymentId)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-300 px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                      >
                        <LoadingButtonLabel
                          loading={activeAction === fullyPaidKey}
                          idleText="Mark Fully Paid"
                          loadingText="Saving..."
                          iconName="check"
                        />
                      </button>
                    </div>
                  </div>
                ) : null}

                {!isPreBooking ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6B667B]">
                    <CheckCircle2 className="h-4 w-4 text-[#DFB15B]" />
                    <span>Last reviewed: {formatDate(item.reviewedAt)}</span>
                  </div>
                ) : null}
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
