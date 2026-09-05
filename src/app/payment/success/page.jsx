"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BookmarkCheck, Clock3 } from "lucide-react";
import FlashyLoader from "@/components/shared/FlashyLoader";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentReviewLoading />}>
      <PaymentReviewSubmitted />
    </Suspense>
  );
}

function PaymentReviewSubmitted() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") || "";
  const invoice = searchParams.get("invoice") || "";
  const plan = searchParams.get("plan") || "";
  const isMathPurchase = ["math", "mathSlytherin", "slytherinUpgrade"].includes(plan);
  const status = searchParams.get("status") || "";
  const isBooking = searchParams.get("booking") === "1";
  const paymentChoice = searchParams.get("paymentChoice") || "full";
  const remainingAmount = Number(searchParams.get("remainingAmount") || 0);
  const isPartial = paymentChoice === "partial" && remainingAmount > 0;
  const isPaid = status === "paid";
  const StatusIcon = isBooking ? BookmarkCheck : Clock3;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A090F] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-[#DFB15B]/20 bg-[#121017] p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B]">
          <StatusIcon className="h-5 w-5" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">{isBooking ? "Seat Booked" : isPaid ? "Payment Confirmed" : "Payment Submitted"}</p>
        <h1 className="mt-3 font-serif text-3xl font-medium">{isBooking ? "Your seat is reserved" : isPaid ? "Access is unlocked" : "Enrollment submitted"}</h1>
        <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">
          {isBooking
            ? "Your student information has been saved. Class access is still locked until you proceed to checkout and complete payment."
            : isPartial
              ? `Your BDT 10,000 partial payment was verified. Class access is unlocked, with BDT ${remainingAmount.toLocaleString("en-US")} due later.`
              : "Your PayStation payment was verified successfully. You can now access your classes."}
        </p>
        {paymentId || invoice ? (
          <div className="mt-5 rounded-2xl border border-white/5 bg-[#1A1722] px-4 py-3 text-xs text-[#8E8A9F]">
            {invoice ? <>Invoice: <span className="font-semibold text-white">{invoice}</span></> : <>Payment ID: <span className="font-semibold text-white">{paymentId}</span></>}
          </div>
        ) : null}
        <Link
          href={isMathPurchase ? "/dashboard/math" : isBooking ? "/dashboard" : "/dashboard/classes"}
          className="mt-6 inline-flex rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
        >
          {isMathPurchase ? "Open Math Course" : isBooking ? "Go to Dashboard" : "Go to Classes"}
        </Link>
      </div>
    </div>
  );
}

function PaymentReviewLoading() {
  return (
    <FlashyLoader
      eyebrow="Enrollment Portal"
      title="Preparing confirmation"
      message="Your payment confirmation is being loaded."
      iconName="credit"
      skeleton="cards"
      surface="screen"
    />
  );
}
