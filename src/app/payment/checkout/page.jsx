"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, LockKeyhole } from "lucide-react";
import { getMyBooking, getStoredToken, submitBookedCheckout } from "@/lib/api";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

const PLANS = {
  offline: { title: "Gryffindor", amount: 18000, deliveryMode: "offline" },
  gryffindor2: { title: "Gryffindor 2.0", amount: 18000, deliveryMode: "offline" },
  premium: { title: "Ravenclaw", amount: 17500, deliveryMode: "online" },
  online: { title: "Hufflepuff", amount: 18000, deliveryMode: "offline" },
};

const PARTIAL_PAYMENT_AMOUNT = 10000;

const BANK_ACCOUNTS = [
  {
    bank: "Prime Bank",
    accountNumber: "3108211033174",
    branch: "Dilkusha Branch",
    accountName: "Mehrabur Rahaman",
    routingNumber: "170272892",
  },
  {
    bank: "City Bank",
    accountNumber: "1781920008224",
    branch: "Karwan Bazar Branch",
    accountName: "Md. Mehrabur Rahaman",
    routingNumber: "225272868",
  },
];

function formatBDT(amount) {
  return `BDT ${Number(amount || 0).toLocaleString("en-US")}`;
}

function isBasicEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim() || "");
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
  const [paymentChoice, setPaymentChoice] = useState("full");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [referenceName, setReferenceName] = useState("");
  const [referenceEmail, setReferenceEmail] = useState("");
  const [trxID, setTrxID] = useState("");
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

  const amountDueNow = paymentChoice === "partial" ? PARTIAL_PAYMENT_AMOUNT : selectedPlan.amount || 0;
  const remainingAmount = Math.max((selectedPlan.amount || 0) - amountDueNow, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (referenceEmail.trim() && !isBasicEmail(referenceEmail)) {
      setError("Please enter a valid reference email address.");
      return;
    }

    if (!trxID.trim()) {
      setError("Please enter the transaction ID or bank reference.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = await submitBookedCheckout({
        paymentChoice,
        paymentMethod,
        referenceName,
        referenceEmail,
        trxID,
      });
      const paymentId = payload?.data?.paymentId;

      if (!paymentId) {
        throw new Error("Unable to submit payment for review.");
      }

      const successParams = new URLSearchParams({
        paymentId,
        status: "pending",
        paymentChoice,
        remainingAmount: String(remainingAmount),
      });
      router.push(`/payment/success?${successParams.toString()}`);
    } catch (err) {
      setError(err.message || "Unable to submit payment for review.");
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
                Your seat is already booked for {selectedPlan.title}. Submit only the payment reference for admin review.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 px-4 py-6 sm:px-6 sm:py-8">
            <FormSection title="Payment Option" description="Choose how much you are paying before submitting for review." index={1}>
              <PaymentChoiceField selectedPlan={selectedPlan} value={paymentChoice} onChange={setPaymentChoice} />
            </FormSection>

            <FormSection title="Payment Details" description="Choose bKash or bank transfer, then enter the transaction ID or reference." index={2}>
              <div className="space-y-5">
                <div className="grid grid-cols-2 rounded-2xl border border-white/8 bg-[#0A090F]/70 p-1">
                  {[
                    { value: "bkash", label: "Bkash" },
                    { value: "bank", label: "Bank" },
                  ].map((method) => {
                    const selected = paymentMethod === method.value;
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setPaymentMethod(method.value)}
                        className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                          selected ? "bg-[#DFB15B] text-black shadow-[0_10px_28px_rgba(223,177,91,0.2)]" : "text-[#A9A3BA] hover:bg-white/5 hover:text-white"
                        }`}
                        aria-pressed={selected}
                      >
                        {method.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(320px,1.05fr)_minmax(0,1fr)] lg:items-start">
                  <PaymentInstructions paymentMethod={paymentMethod} />
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-4 py-4 text-sm text-[#EBD39B]">
                      <CreditCard className="h-5 w-5 shrink-0 text-[#DFB15B]" />
                      <span className="font-medium">
                        {selectedPlan.title} - pay {formatBDT(amountDueNow)} now
                        {remainingAmount ? `, ${formatBDT(remainingAmount)} later` : ""}
                      </span>
                    </div>
                    <ReferenceField
                      label="Reference Name"
                      value={referenceName}
                      onChange={setReferenceName}
                      placeholder="Who told you about this website?"
                    />
                    <ReferenceField
                      label="Reference Email"
                      type="email"
                      value={referenceEmail}
                      onChange={setReferenceEmail}
                      placeholder="reference@example.com"
                      error={referenceEmail.trim() && !isBasicEmail(referenceEmail)}
                    />
                    <label className={`block rounded-2xl border px-4 py-4 transition ${trxID.trim() ? "border-[#74D99F]/30 bg-[#102019]/55" : "border-white/5 bg-[#0F0D15]/70"}`}>
                      <span className="text-sm font-semibold text-white">
                        {paymentMethod === "bank" ? "Transaction ID / Reference" : "BkashTrxID"} <span className="text-[#DFB15B]">*</span>
                      </span>
                      <input
                        type="text"
                        value={trxID}
                        onChange={(event) => setTrxID(event.target.value)}
                        placeholder={paymentMethod === "bank" ? "Bank transaction ID or reference" : "Example: A1B2C3D4E5"}
                        className="mt-3 w-full border-0 border-b border-white/20 bg-transparent px-0 py-2 text-sm text-white outline-none transition placeholder:text-[#6B667B] focus:border-[#DFB15B]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </FormSection>

            {error ? <p className="rounded-2xl border border-[#F2A7A7]/30 bg-[#F2A7A7]/10 px-4 py-3 text-sm font-medium text-[#F8C7C0]">{error}</p> : null}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-3xl border border-[#DFB15B]/15 bg-[#121017]/95 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-[#8E8A9F]">
                <LockKeyhole className="h-4 w-4 text-[#DFB15B]" />
                Your payment will stay pending until an admin approves the transaction ID.
              </div>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#DFB15B] px-6 py-3 text-sm font-bold uppercase tracking-wider text-black shadow-[0_0_30px_rgba(223,177,91,0.22)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
              >
                <span className="absolute inset-y-0 -left-10 w-8 rotate-12 bg-white/40 blur-sm transition group-hover:left-full" />
                <LoadingButtonLabel loading={submitting} idleText="Submit Payment" loadingText="Submitting..." iconName="credit" />
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

function ReferenceField({ label, value, onChange, type = "text", placeholder = "", error = false }) {
  const complete = Boolean(value.trim());
  const labelTone = error ? "text-[#F8C7C0]" : complete ? "text-[#B7F3D0]" : "text-white";
  const inputBorder = error
    ? "border-[#F2A7A7]"
    : complete
      ? "border-[#74D99F] focus:border-[#8EE6B2]"
      : "border-white/20 focus:border-[#DFB15B]";

  return (
    <label className={`block rounded-2xl border px-4 py-4 transition ${error ? "border-[#F2A7A7]/35 bg-[#2A171B]/50" : complete ? "border-[#74D99F]/30 bg-[#102019]/55" : "border-white/5 bg-[#0F0D15]/70"}`}>
      <span className={`text-sm font-semibold ${labelTone}`}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`mt-3 w-full border-0 border-b bg-transparent px-0 py-2 text-sm text-white outline-none transition placeholder:text-[#6B667B] ${inputBorder}`}
      />
      {error ? <p className="mt-2 text-xs font-semibold text-[#F8C7C0]">Please enter a valid reference email address.</p> : null}
    </label>
  );
}

function PaymentChoiceField({ selectedPlan, value, onChange }) {
  const options = [
    {
      id: "full",
      title: "Pay full amount now",
      amount: selectedPlan?.amount || 0,
      note: "No remaining balance after admin approval.",
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

function PaymentInstructions({ paymentMethod }) {
  if (paymentMethod === "bank") {
    return (
      <div className="space-y-3 rounded-3xl border border-[#DFB15B]/20 bg-[#DFB15B]/8 p-5">
        <div className="flex items-center gap-3 text-[#DFB15B]">
          <CreditCard className="h-5 w-5" />
          <p className="text-xs font-bold uppercase tracking-[0.2em]">Bank Accounts</p>
        </div>
        <div className="space-y-3">
          {BANK_ACCOUNTS.map((account) => (
            <div key={account.accountNumber} className="rounded-2xl border border-white/8 bg-[#100E16]/70 px-4 py-3">
              <p className="text-sm font-bold text-white">{account.bank}</p>
              <p className="mt-2 font-mono text-lg font-bold text-white">{account.accountNumber}</p>
              <div className="mt-3 space-y-1 text-xs font-semibold text-[#A9A3BA]">
                <p>{account.branch}</p>
                <p>{account.accountName}</p>
                <p>Routing Number: {account.routingNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-3xl border border-[#DFB15B]/20 bg-[#DFB15B]/8 p-5">
      <div className="flex items-center gap-3 text-[#DFB15B]">
        <CreditCard className="h-5 w-5" />
        <p className="text-xs font-bold uppercase tracking-[0.2em]">bKash Number</p>
      </div>
      <div className="rounded-2xl border border-white/8 bg-[#100E16]/70 px-4 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#DFB15B]">Send Money Option</p>
        <p className="mt-2 font-mono text-2xl font-bold text-white">01894688018</p>
        <p className="mt-4 rounded-xl border border-[#DFB15B]/30 bg-[#DFB15B]/12 px-3 py-3 text-sm font-black uppercase leading-5 tracking-wide text-[#FFE7A3]">
          DO NOT INCLUDE CASH OUT CHARGE ONLY PAY THE REQUIRED AMOUNT
        </p>
      </div>
    </div>
  );
}
