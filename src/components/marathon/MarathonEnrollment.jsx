"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpenCheck, Check, CreditCard, Languages, LockKeyhole, Percent, Tag, X } from "lucide-react";
import {
  getMarathonEnrollmentContext,
  getPaymentQuote,
  getStoredToken,
  getStoredUser,
  savePendingPaymentPlan,
  savePendingProgramAction,
  submitManualEnrollment,
} from "@/lib/api";
import PolicyAcceptance from "@/components/shared/PolicyAcceptance";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

const REQUIRED_FIELDS = ["yourName", "college", "phoneNumber", "address", "facebookProfile"];
const PLAN_LABELS = {
  marathonEnglish: "English",
  marathonMaths: "Maths",
  marathonBoth: "English + Maths",
  marathonAddEnglish: "Add English",
  marathonAddMaths: "Add Maths",
};

function formatBDT(value) {
  return `BDT ${Number(value || 0).toLocaleString("en-US")}`;
}

function isComplete(value) {
  return Boolean(value?.toString().trim());
}

function isFacebookProfileLink(value) {
  try {
    const url = new URL(value?.trim());
    const hostname = url.hostname.toLowerCase();
    return ["http:", "https:"].includes(url.protocol)
      && (hostname === "facebook.com" || hostname.endsWith(".facebook.com"));
  } catch {
    return false;
  }
}

export default function MarathonEnrollment({ initialPlan }) {
  const router = useRouter();
  const [context, setContext] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [form, setForm] = useState({});
  const [quote, setQuote] = useState(null);
  const [discountPreference, setDiscountPreference] = useState("none");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponValidated, setCouponValidated] = useState(false);
  const [couponAttempt, setCouponAttempt] = useState(0);
  const [quoteError, setQuoteError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isUpgrade = selectedPlan === "marathonAddEnglish" || selectedPlan === "marathonAddMaths";
  const quoteRequestKey = `${selectedPlan}:${discountPreference}:${appliedCoupon}:${couponAttempt}`;
  const readyQuote = quote?._requestKey === quoteRequestKey ? quote : null;
  const completedFields = useMemo(() => REQUIRED_FIELDS.filter((field) => isComplete(form[field])).length, [form]);

  useEffect(() => {
    if (!getStoredToken()) {
      savePendingPaymentPlan(initialPlan);
      savePendingProgramAction("enroll");
      router.replace("/signup");
      return;
    }

    let active = true;
    getMarathonEnrollmentContext()
      .then((payload) => {
        if (!active) return;
        const data = payload.data;
        const available = data.availablePlanIds || [];
        const nextPlan = available.includes(initialPlan) ? initialPlan : available[0];
        if (!nextPlan) {
          router.replace("/dashboard/marathon");
          return;
        }
        const user = getStoredUser();
        setContext(data);
        setSelectedPlan(nextPlan);
        setDiscountPreference(data.returningStudentEligible ? "returning" : "none");
        setForm({
          ...(data.student || {}),
          yourName: data.student?.yourName || user?.name || "",
        });
      })
      .catch((err) => setError(err.message || "Unable to prepare Marathon enrollment."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [initialPlan, router]);

  useEffect(() => {
    if (!context || !selectedPlan) return;
    let active = true;
    getPaymentQuote(selectedPlan, {
      discountPreference,
      couponCode: discountPreference === "coupon" ? appliedCoupon : "",
    })
      .then((payload) => {
        if (!active) return;
        setQuote({ ...payload.data, _requestKey: quoteRequestKey });
        setQuoteError("");
        if (discountPreference === "coupon") setCouponValidated(true);
      })
      .catch((err) => {
        if (!active) return;
        setQuoteError(err.message || "Unable to confirm the price.");
        if (discountPreference === "coupon") setCouponValidated(false);
      });
    return () => { active = false; };
  }, [appliedCoupon, context, couponAttempt, discountPreference, quoteRequestKey, selectedPlan]);

  const applyCoupon = () => {
    const normalized = couponInput.trim().toUpperCase();
    setError("");
    setQuoteError("");
    setCouponValidated(false);
    if (!normalized) {
      setQuoteError("Enter a coupon code first.");
      return;
    }
    setAppliedCoupon(normalized);
    setDiscountPreference("coupon");
    setCouponAttempt((current) => current + 1);
  };

  const removeCoupon = () => {
    setCouponInput("");
    setAppliedCoupon("");
    setCouponValidated(false);
    setQuoteError("");
    setDiscountPreference(context?.returningStudentEligible ? "returning" : "none");
    setCouponAttempt((current) => current + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!accepted || !readyQuote) {
      setError("Accept the policies and wait for your confirmed price before continuing.");
      return;
    }
    if (!isUpgrade && REQUIRED_FIELDS.some((field) => !isComplete(form[field]))) {
      setError("Complete all five enrollment fields before continuing.");
      return;
    }
    if (!isUpgrade && !isFacebookProfileLink(form.facebookProfile)) {
      setError("Enter a valid Facebook profile link.");
      return;
    }

    setSaving(true);
    try {
      const enrollmentForm = isUpgrade
        ? undefined
        : Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, form[field]]));
      const payload = await submitManualEnrollment(selectedPlan, enrollmentForm, "full", readyQuote.amount, {
        discountPreference,
        couponCode: discountPreference === "coupon" ? appliedCoupon : "",
      });
      if (payload.data?.alreadyPaid) window.location.assign("/dashboard/marathon");
      else if (payload.data?.paymentUrl) window.location.assign(payload.data.paymentUrl);
      else throw new Error("Checkout could not be opened. Please try again.");
    } catch (err) {
      setError(err.message || "Unable to start checkout.");
      setSaving(false);
    }
  };

  if (loading || !context) {
    return error ? (
      <main className="flex min-h-screen items-center justify-center bg-[#080B12] px-4 text-white">
        <div className="max-w-lg rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-center text-red-100">{error}</div>
      </main>
    ) : (
      <FlashyLoader eyebrow="Marathon Enrollment" title="Preparing your enrollment" message="Your access and returning-student price are being verified." iconName="wand" skeleton="cards" surface="screen" />
    );
  }

  return (
    <main className="min-h-screen bg-[#080B12] px-4 pb-20 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/marathon" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#AAB3C5] transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Marathon details
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#101620] p-6 shadow-2xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_40%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Marathon Enrollment</p>
              <h1 className="mt-3 font-sans text-3xl font-semibold sm:text-5xl">Choose your final sprint</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#AAB3C5]">Focused live classes for English, Maths, or both—available from one dedicated dashboard.</p>
            </div>
            {context.returningStudentEligible ? (
              <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-200">
                <Percent className="h-5 w-5" /> 25% returning-student discount applied
              </div>
            ) : null}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/8 bg-[#101620] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Languages className="h-5 w-5" /></div>
                <div><p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Your access</p><h2 className="mt-1 text-2xl font-semibold">Select a section</h2></div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {context.availablePlanIds.map((planId) => (
                  <button key={planId} type="button" onClick={() => { setSelectedPlan(planId); setError(""); }} className={`rounded-2xl border p-4 text-left transition ${selectedPlan === planId ? "border-cyan-300/45 bg-cyan-300/12" : "border-white/8 bg-[#0B1018] hover:border-white/20"}`}>
                    <span className="flex items-center justify-between gap-3 text-sm font-bold"><span>{PLAN_LABELS[planId]}</span>{selectedPlan === planId ? <Check className="h-4 w-4 text-cyan-300" /> : null}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/8 bg-[#101620] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-300/20 bg-orange-300/10 text-orange-200"><BookOpenCheck className="h-5 w-5" /></div>
                <div><p className="text-xs font-bold uppercase tracking-widest text-orange-300">Student details</p><h2 className="mt-1 text-2xl font-semibold">{isUpgrade ? "Saved enrollment" : `${completedFields}/5 completed`}</h2></div>
              </div>
              {isUpgrade ? (
                <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/8 p-4 text-sm leading-6 text-emerald-100">We will reuse the details from your first Marathon enrollment.</div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[
                    ["yourName", "Your name", "text"], ["college", "College", "text"], ["phoneNumber", "Contact number", "tel"],
                    ["address", "Address", "text"], ["facebookProfile", "Facebook profile link", "url"],
                  ].map(([field, label, type]) => (
                    <label key={field} className="rounded-2xl border border-white/8 bg-[#0B1018] p-4">
                      <span className="text-sm font-semibold">{label} <span className="text-orange-300">*</span></span>
                      <input required type={type} value={form[field] || ""} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className="mt-3 w-full border-0 border-b border-white/15 bg-transparent py-2 text-sm outline-none focus:border-cyan-300" />
                    </label>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="rounded-3xl border border-cyan-300/18 bg-[#101620] p-5 shadow-xl lg:sticky lg:top-24">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300"><CreditCard className="h-4 w-4" /> Secure checkout</p>
            <h2 className="mt-3 text-2xl font-semibold">{PLAN_LABELS[selectedPlan]}</h2>
            <div className="mt-5 rounded-2xl border border-white/8 bg-[#0B1018] p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-white"><Tag className="h-4 w-4 text-orange-300" /> Coupon</p>
              {context.couponAvailable ? (
                <div className="mt-3 flex gap-2">
                  <input value={couponInput} onChange={(event) => setCouponInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applyCoupon(); } }} placeholder="Enter coupon code" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#121925] px-3 py-2.5 text-sm uppercase text-white outline-none focus:border-cyan-300/40" />
                  <button type="button" onClick={applyCoupon} className="rounded-xl bg-orange-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black">Apply</button>
                </div>
              ) : (
                <p className="mt-3 text-xs leading-5 text-[#8E8A9F]">MAGNUSBEST200 has already been used by this account.</p>
              )}
              {couponValidated ? <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200"><span>MAGNUSBEST200 is available</span><button type="button" onClick={removeCoupon} aria-label="Remove coupon"><X className="h-4 w-4" /></button></div> : null}
              {appliedCoupon && !couponValidated ? <button type="button" onClick={removeCoupon} className="mt-3 text-xs font-bold text-orange-200 underline underline-offset-4">Clear coupon and restore {context.returningStudentEligible ? "returning-student" : "regular"} pricing</button> : null}
            </div>

            {context.returningStudentEligible && couponValidated ? (
              <div className="mt-4 grid gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8E8A9F]">Choose one discount</p>
                <button type="button" onClick={() => { setDiscountPreference("returning"); setQuoteError(""); }} className={`rounded-xl border px-3 py-3 text-left text-sm font-bold ${discountPreference === "returning" ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-200" : "border-white/8 bg-white/4 text-[#AAB3C5]"}`}>Returning student — 25%</button>
                <button type="button" onClick={() => { setDiscountPreference("coupon"); setQuoteError(""); }} className={`rounded-xl border px-3 py-3 text-left text-sm font-bold ${discountPreference === "coupon" ? "border-orange-300/35 bg-orange-300/10 text-orange-200" : "border-white/8 bg-white/4 text-[#AAB3C5]"}`}>MAGNUSBEST200 — BDT 200</button>
              </div>
            ) : null}
            {readyQuote ? (
              <div className="mt-5 space-y-3 rounded-2xl border border-white/8 bg-[#0B1018] p-4 text-sm">
                <div className="flex justify-between text-[#AAB3C5]"><span>Regular price</span><span>{formatBDT(readyQuote.originalAmount)}</span></div>
                {readyQuote.discountAmount ? <div className="flex justify-between text-emerald-300"><span>{readyQuote.discountType === "coupon" ? "MAGNUSBEST200" : "Returning discount"}</span><span>- {formatBDT(readyQuote.discountAmount)}</span></div> : null}
                <div className="flex justify-between border-t border-white/8 pt-3 text-lg font-bold"><span>Total</span><span>{formatBDT(readyQuote.amount)}</span></div>
              </div>
            ) : <div className="mt-5 h-28 animate-pulse rounded-2xl bg-white/5" />}
            <div className="mt-5"><PolicyAcceptance checked={accepted} onChange={setAccepted} error={Boolean(error && !accepted)} /></div>
            {quoteError || error ? <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{quoteError || error}</div> : null}
            <button type="submit" disabled={saving || !readyQuote} className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-cyan-300 to-orange-300 px-5 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
              <LoadingButtonLabel loading={saving} idleText={`Pay ${formatBDT(readyQuote?.amount)}`} loadingText="Opening checkout..." iconName="credit" />
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#778196]"><LockKeyhole className="h-3.5 w-3.5" /> Full payment through PayStation</p>
          </aside>
        </form>
      </div>
    </main>
  );
}
