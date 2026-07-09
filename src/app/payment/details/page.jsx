"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CreditCard, LockKeyhole } from "lucide-react";
import { createBkashPayment, getStoredToken, getStoredUser, savePendingEnrollment, savePendingPaymentPlan } from "@/lib/api";

const PLANS = {
  offline: { title: "IBA Offline Batch", amount: "৳15,000" },
  premium: { title: "IBA Premium Combo", amount: "৳18,000" },
  online: { title: "IBA Online Live", amount: "৳12,000" },
};

const INITIAL_FORM = {
  email: "",
  yourName: "",
  address: "",
  phoneNumber: "",
  facebookProfile: "",
  emailAddress: "",
  college: "",
  group: "",
  hscBatch: "",
  backupChoice: "",
  admissionSystemIdea: "",
  previousIbaPreparation: "",
  previousStudyDetails: "",
  strongestSection: "",
  weakestSection: "",
  preferredBatch: "",
};

const REQUIRED_FIELDS = [
  "email",
  "yourName",
  "address",
  "phoneNumber",
  "facebookProfile",
  "emailAddress",
  "college",
  "group",
  "hscBatch",
  "backupChoice",
  "admissionSystemIdea",
];

export default function PaymentDetailsPage() {
  return (
    <Suspense fallback={<PaymentDetailsLoading />}>
      <PaymentDetailsContent />
    </Suspense>
  );
}

function PaymentDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "";
  const plan = PLANS[planId];
  const [form, setForm] = useState(() => {
    const user = getStoredUser();
    return {
      ...INITIAL_FORM,
      email: user?.email || "",
      emailAddress: user?.email || "",
      yourName: user?.name || "",
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!plan) return;

    if (!getStoredToken()) {
      savePendingPaymentPlan(planId);
      router.replace("/signup");
      return;
    }
  }, [plan, planId, router]);

  const fieldErrors = useMemo(() => {
    const missing = {};
    REQUIRED_FIELDS.forEach((field) => {
      if (!form[field]?.trim()) missing[field] = true;
    });
    return missing;
  }, [form]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const hasMissingRequired = REQUIRED_FIELDS.some((field) => !form[field]?.trim());
    if (hasMissingRequired) {
      setError("Please complete all required fields before continuing.");
      return;
    }

    try {
      setLoading(true);
      const payload = await createBkashPayment(planId);
      const paymentId = payload?.data?.paymentId;
      const bkashURL = payload?.data?.bkashURL;

      if (!paymentId || !bkashURL) {
        throw new Error("Unable to start bKash checkout.");
      }

      savePendingEnrollment({ paymentId, planId, formData: form });
      window.location.href = bkashURL;
    } catch (err) {
      setError(err.message || "Unable to start bKash checkout.");
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#0A090F] px-4 py-12 text-white">
        <div className="mx-auto flex min-h-[480px] max-w-xl flex-col items-center justify-center text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Plan Required</p>
          <h1 className="mt-3 font-serif text-3xl font-medium">Choose a program first</h1>
          <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">Select any program from the pricing section before filling out the enrollment form.</p>
          <Link href="/#programs-section" className="mt-6 rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110">
            Back to Pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A090F] px-4 py-8 text-white sm:px-6 lg:px-8">
      <main className="mx-auto max-w-4xl">
        <Link href="/#programs-section" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E8A9F] transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to pricing
        </Link>

        <div className="mt-6 rounded-3xl border border-white/10 bg-[#121017] p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-5 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Enrollment Form</p>
              <h1 className="mt-3 font-serif text-3xl font-medium">Personal Information</h1>
              <p className="mt-2 text-sm text-[#8E8A9F]">Complete the form before continuing to bKash checkout.</p>
            </div>
            <div className="rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">Selected Program</p>
              <p className="mt-1 text-sm font-semibold text-white">{plan.title}</p>
              <p className="mt-1 font-serif text-2xl font-bold text-white">{plan.amount}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-10">
            <FormSection title="Personal Information" description="Form description">
              <TextField label="Email" field="email" type="email" required value={form.email} error={fieldErrors.email} onChange={updateField} placeholder="Valid email" />
              <TextField label="Your Name:" field="yourName" required value={form.yourName} error={fieldErrors.yourName} onChange={updateField} />
              <TextField label="Address:" field="address" required value={form.address} error={fieldErrors.address} onChange={updateField} />
              <TextField label="Phone Number:" field="phoneNumber" type="tel" required value={form.phoneNumber} error={fieldErrors.phoneNumber} onChange={updateField} />
              <TextField label="Facebook Profile:" field="facebookProfile" required value={form.facebookProfile} error={fieldErrors.facebookProfile} onChange={updateField} />
              <TextField label="Email Address:" field="emailAddress" type="email" required value={form.emailAddress} error={fieldErrors.emailAddress} onChange={updateField} />
            </FormSection>

            <FormSection title="Academic Information" description="Description (optional)">
              <TextField label="Your College" field="college" required value={form.college} error={fieldErrors.college} onChange={updateField} />
              <RadioField label="Group:" field="group" required value={form.group} error={fieldErrors.group} options={["Science", "Arts", "Commerce", "Others"]} onChange={updateField} />
              <RadioField label="HSC Batch" field="hscBatch" required value={form.hscBatch} error={fieldErrors.hscBatch} options={["2025 or equivalent", "2026 or equivalent", "2027 or equivalent", "Others"]} onChange={updateField} />
              <RadioField label="What is/are your back-up(s)" field="backupChoice" required value={form.backupChoice} error={fieldErrors.backupChoice} options={["IBA JU", "BUP BBA Gen", "BUP FBS", "DU B/C unit", "Engineering", "Medical", "DU A unit", "Private Uni", "Abroad"]} onChange={updateField} />
            </FormSection>

            <FormSection title="IBA Preparation" description="Description (optional)">
              <RadioField label="Do you have clear idea about the admission system?" field="admissionSystemIdea" required value={form.admissionSystemIdea} error={fieldErrors.admissionSystemIdea} options={["Yes", "No", "Maybe"]} onChange={updateField} />
              <RadioField label="Have you taken any preparation for IBA already?" field="previousIbaPreparation" value={form.previousIbaPreparation} options={["Yes", "No"]} onChange={updateField} />
              <TextField label="If yes, then how you have studied earlier?" field="previousStudyDetails" value={form.previousStudyDetails} onChange={updateField} />
              <RadioField label="What section of IBA exam you think is your strongest side?" field="strongestSection" value={form.strongestSection} options={["English", "Math", "Analytical", "Writing"]} onChange={updateField} />
              <RadioField label="What section of IBA exam you think is your weakest side?" field="weakestSection" value={form.weakestSection} options={["English", "Math", "Analytical", "Writing"]} onChange={updateField} />
            </FormSection>

            <FormSection title="Batch Information" description="Description (optional)">
              <RadioField label="Which batch do you want to be enrolled?" field="preferredBatch" value={form.preferredBatch} options={["Farmgate", "Bailey Road", "Online"]} onChange={updateField} />
            </FormSection>

            {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">{error}</p> : null}

            <div className="flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-[#8E8A9F]">
                <LockKeyhole className="h-4 w-4 text-[#DFB15B]" />
                Payment will open through bKash after submission.
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#DFB15B] px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
              >
                <CreditCard className="h-4 w-4" />
                {loading ? "Opening bKash..." : "Submit and Pay"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function PaymentDetailsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A090F] px-4 text-white">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#DFB15B]/30 border-t-[#DFB15B]" />
        <p className="text-sm font-medium text-[#8E8A9F]">Preparing enrollment form...</p>
      </div>
    </div>
  );
}

function FormSection({ title, description, children }) {
  return (
    <section className="border-b border-white/5 pb-8 last:border-b-0 last:pb-0">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-medium text-white">{title}</h2>
        <p className="mt-2 text-sm text-[#8E8A9F]">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function TextField({ label, field, value, onChange, required = false, type = "text", placeholder = "Short answer text", error = false }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white">
        {label}
        {required ? <span className="text-red-400"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        placeholder={placeholder}
        className={`mt-3 w-full border-0 border-b bg-transparent px-0 py-2 text-sm text-white outline-none transition placeholder:text-[#6B667B] ${error ? "border-red-400" : "border-white/20 focus:border-[#DFB15B]"}`}
      />
    </label>
  );
}

function RadioField({ label, field, value, options, onChange, required = false, error = false }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-white">
        {label}
        {required ? <span className="text-red-400"> *</span> : null}
      </legend>
      <div className={`mt-4 grid gap-3 rounded-2xl border px-4 py-4 ${error ? "border-red-400/60" : "border-white/5 bg-[#1A1722]/35"}`}>
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#D8D4E5]">
            <input
              type="radio"
              name={field}
              value={option}
              checked={value === option}
              onChange={(event) => onChange(field, event.target.value)}
              className="h-4 w-4 accent-[#DFB15B]"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
