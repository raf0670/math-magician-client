"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, LockKeyhole } from "lucide-react";
import { getMyBooking, getStoredToken, submitBookedCheckout } from "@/lib/api";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";
import PolicyAcceptance from "@/components/shared/PolicyAcceptance";

const PLANS = {
  offline: { title: "Gryffindor", amount: 18000, deliveryMode: "offline" },
  gryffindor2: { title: "Gryffindor 2.0", amount: 18000, deliveryMode: "offline" },
  premium: { title: "Ravenclaw", amount: 17500, deliveryMode: "online" },
  online: { title: "Hufflepuff", amount: 18000, deliveryMode: "offline" },
};

const PARTIAL_PAYMENT_AMOUNT = 10000;

function formatBDT(amount) {
  return `BDT ${Number(amount || 0).toLocaleString("en-US")}`;
}

export default function BookedCheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <BookedCheckoutContent />
    </Suspense>
  );
}

function BookedCheckoutContent() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [paymentChoice, setPaymentChoice] = useState("");
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getStoredToken()) {
      router.replace("/login");
      return;
    }

    let isMounted = true;
    getMyBooking()
      .then((payload) => {
        if (isMounted) setBooking(payload?.data?.booking || null);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Unable to load your booking.");
      })
      .finally(() => {
        if (isMounted) setLoadingBooking(false);
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const selectedPlan = useMemo(() => {
    return PLANS[booking?.planId] || { title: booking?.planTitle || "Booked program", amount: 0 };
  }, [booking]);

  const amountDueNow = paymentChoice === "partial" ? PARTIAL_PAYMENT_AMOUNT : paymentChoice === "full" ? selectedPlan.amount || 0 : 0;
  const remainingAmount = Math.max((selectedPlan.amount || 0) - amountDueNow, 0);
  const hasPaymentChoice = Boolean(paymentChoice);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!paymentChoice) {
      setError("Please choose full or partial payment before continuing.");
      return;
    }

    if (!policiesAccepted) {
      setError("Please accept the Terms & Conditions, Return & Refund Policy, and Privacy Policy before continuing.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = await submitBookedCheckout({
        paymentChoice,
      });
      const paymentUrl = payload?.data?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Unable to open PayStation checkout.");
      }

      window.location.assign(paymentUrl);
    } catch (err) {
      setError(err.message || "Unable to open PayStation checkout.");
      setSubmitting(false);
    }
  };

  if (loadingBooking) return <CheckoutLoading />;

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A090F] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-[#DFB15B]/20 bg-[#121017] p-8 text-center shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">No Booking Found</p>
          <h1 className="mt-3 font-serif text-3xl font-medium">Book a seat first</h1>
          <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">
            Checkout opens after your seat booking information has been saved.
          </p>
          <Link href="/#programs-section" className="mt-6 inline-flex rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110">
            Choose a Program
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A090F] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.045)_1px,transparent_1px)] bg-size-[46px_46px]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.16),transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.13),transparent_70%)]" />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-4xl"
      >
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/3 px-4 py-2 text-sm font-semibold text-[#8E8A9F] backdrop-blur transition hover:border-[#DFB15B]/25 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-3xl border border-[#DFB15B]/15 bg-[#100E16]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="relative overflow-hidden border-b border-white/5 px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(223,177,91,0.12),transparent_38%,rgba(56,189,248,0.1))]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
                <CreditCard className="h-3.5 w-3.5" />
                Booked Seat Checkout
              </div>
              <h1 className="mt-4 font-serif text-4xl font-medium leading-tight text-white sm:text-5xl">
                Proceed to Payment
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#A9A3BA]">
                Your seat is already booked for {selectedPlan.title}. Continue to PayStation to complete the payment securely.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 px-4 py-6 sm:px-6 sm:py-8">
            <FormSection title="Payment Option" description="Choose how much you are paying before continuing to PayStation." index={1}>
              <PaymentChoiceField selectedPlan={selectedPlan} value={paymentChoice} onChange={setPaymentChoice} />
            </FormSection>

            <FormSection title="Secure Checkout" description="You will be redirected to PayStation to complete payment by card, MFS, wallet, or bank channel." index={2}>
              <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                <div className="rounded-2xl border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-4 py-4">
                  <div className="flex items-center gap-3 text-[#DFB15B]">
                    <CreditCard className="h-5 w-5" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">PayStation Hosted Checkout</p>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-6 text-[#EBD39B]">
                    Complete the payment on PayStation&apos;s secure page. Your class access unlocks automatically after the payment is verified.
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0F0D15]/70 px-4 py-4 text-sm text-[#EBD39B]">
                  <CreditCard className="h-5 w-5 shrink-0 text-[#DFB15B]" />
                  <span className="font-medium">
                    {hasPaymentChoice
                      ? `${selectedPlan.title} - pay ${formatBDT(amountDueNow)} now${remainingAmount ? `, ${formatBDT(remainingAmount)} later` : ""}`
                      : "Choose a payment option to see the amount due now."}
                  </span>
                </div>
              </div>
            </FormSection>

            <PolicyAcceptance
              checked={policiesAccepted}
              onChange={setPoliciesAccepted}
              error={error.includes("Please accept the Terms")}
            />

            {error ? <p className="rounded-2xl border border-[#F2A7A7]/30 bg-[#F2A7A7]/10 px-4 py-3 text-sm font-medium text-[#F8C7C0]">{error}</p> : null}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-3xl border border-[#DFB15B]/15 bg-[#121017]/95 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-[#8E8A9F]">
                <LockKeyhole className="h-4 w-4 text-[#DFB15B]" />
                You will complete payment on PayStation. Access unlocks after verification.
              </div>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#DFB15B] px-6 py-3 text-sm font-bold uppercase tracking-wider text-black shadow-[0_0_30px_rgba(223,177,91,0.22)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
              >
                <span className="absolute inset-y-0 -left-10 w-8 rotate-12 bg-white/40 blur-sm transition group-hover:left-full" />
                <LoadingButtonLabel loading={submitting} idleText="Continue to PayStation" loadingText="Opening PayStation..." iconName="credit" />
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.main>
    </div>
  );
}

function CheckoutLoading() {
  return (
    <FlashyLoader
      eyebrow="Booked Checkout"
      title="Loading your booking"
      message="Your saved student information is being checked before payment."
      iconName="credit"
      skeleton="cards"
      surface="screen"
    />
  );
}

function FormSection({ title, description, children, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#15121D]/85 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.24)] sm:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 font-serif text-lg font-bold text-[#DFB15B]">
          {index}
        </div>
        <div>
          <h2 className="font-serif text-2xl font-medium text-white">{title}</h2>
          <p className="mt-2 text-sm text-[#8E8A9F]">{description}</p>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </motion.section>
  );
}

function PaymentChoiceField({ selectedPlan, value, onChange }) {
  const options = [
    {
      id: "full",
      title: "Pay full amount now",
      amount: selectedPlan?.amount || 0,
      note: "No remaining balance after successful payment verification.",
    },
    {
      id: "partial",
      title: "Pay BDT 10,000 now",
      amount: PARTIAL_PAYMENT_AMOUNT,
      note: `${formatBDT(Math.max((selectedPlan?.amount || 0) - PARTIAL_PAYMENT_AMOUNT, 0))} remains for the final installment.`,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const checked = value === option.id;

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            whileHover={{ y: -2 }}
            className={`flex min-h-36 flex-col items-start rounded-2xl border px-4 py-4 text-left transition ${
              checked ? "border-[#74D99F]/55 bg-[#102019]/70 shadow-[0_0_28px_rgba(116,217,159,0.08)]" : "border-white/8 bg-[#0F0D15]/75 hover:border-[#DFB15B]/25"
            }`}
          >
            <span className="flex w-full items-center justify-between gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${checked ? "border-[#74D99F] bg-[#74D99F] text-black" : "border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B]"}`}>
                {checked ? <Check className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
              </span>
            </span>
            <span className="mt-4 text-sm font-bold text-white">{option.title}</span>
            <span className="mt-2 font-serif text-2xl font-semibold text-white">{formatBDT(option.amount)}</span>
            <span className="mt-2 text-xs font-medium leading-5 text-[#8E8A9F]">{option.note}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
