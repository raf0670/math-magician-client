"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { clearPendingEnrollment, getPendingEnrollment, getProfile, saveAuthSession, saveEnrollmentDetails } from "@/lib/api";
import FlashyLoader from "@/components/shared/FlashyLoader";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessShell statusText="Finalizing payment..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") || "";
  const [statusText, setStatusText] = useState("Finalizing enrollment details...");
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const finalizeSuccess = async () => {
      try {
        const payload = await getProfile();
        const token = window.localStorage.getItem("exam_archive_token");
        if (token && payload?.data) {
          saveAuthSession(token, payload.data);
        }

        const pending = getPendingEnrollment();
        const resolvedPaymentId = paymentId || pending?.paymentId;

        if (!pending?.formData || !resolvedPaymentId) {
          if (!isMounted) return;
          setStatusText("Payment verified. Enrollment details were not found on this browser.");
          setDetailsError("If you completed the form on another device, please contact support with your payment confirmation.");
          return;
        }

        if (pending.paymentId && pending.paymentId !== resolvedPaymentId) {
          if (!isMounted) return;
          setStatusText("Payment verified. Enrollment details need manual review.");
          setDetailsError("The saved form details did not match this payment session.");
          return;
        }

        await saveEnrollmentDetails({
          paymentId: resolvedPaymentId,
          formData: pending.formData,
        });

        clearPendingEnrollment();

        if (!isMounted) return;
        setDetailsSaved(true);
        setStatusText("Your enrollment details were saved successfully.");
      } catch (error) {
        if (!isMounted) return;
        setStatusText("Payment verified. Enrollment details could not be saved automatically.");
        setDetailsError(error.message || "Please contact support with your payment confirmation.");
      }
    };

    finalizeSuccess();

    return () => {
      isMounted = false;
    };
  }, [paymentId]);

  return (
    <PaymentSuccessShell statusText={statusText} detailsSaved={detailsSaved} detailsError={detailsError} />
  );
}

function PaymentSuccessShell({ statusText, detailsSaved = false, detailsError = "" }) {
  if (!detailsSaved && !detailsError) {
    return (
      <FlashyLoader
        eyebrow="Payment Portal"
        title="Finalizing payment"
        message={statusText}
        iconName="credit"
        skeleton="cards"
        surface="screen"
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A090F] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-[#DFB15B]/20 bg-[#121017] p-8 text-center shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Payment Complete</p>
        <h1 className="mt-3 font-serif text-3xl font-medium">Class access unlocked</h1>
        <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">
          Your payment was verified successfully. You can now enter the live class area.
        </p>
        <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${detailsError ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-white/5 bg-[#1A1722] text-[#8E8A9F]"}`}>
          {detailsSaved ? "Enrollment details saved." : statusText}
          {detailsError ? <p className="mt-2 text-xs leading-5 text-red-300">{detailsError}</p> : null}
        </div>
        <Link
          href="/dashboard/classes"
          className="mt-6 inline-flex rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
        >
          Go to Classes
        </Link>
      </div>
    </div>
  );
}
