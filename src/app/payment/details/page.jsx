"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, LockKeyhole, QrCode, WandSparkles } from "lucide-react";
import { getStoredToken, getStoredUser, savePendingPaymentPlan, submitManualEnrollment } from "@/lib/api";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

const PLANS = {
  offline: { title: "IBA Offline Batch - Farmgate", amount: "BDT 18,000" },
  premium: { title: "IBA Online Batch", amount: "BDT 17,500" },
  online: { title: "IBA Offline Batch - Bailey Road", amount: "BDT 18,000" },
};

const BATCH_PLAN_IDS = {
  Farmgate: "offline",
  "Bailey Road": "online",
  Online: "premium",
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
  bkashTrxID: "",
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
  "bkashTrxID",
];

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const SPARKS = [
  { left: "8%", top: "16%", delay: 0, size: "text-[10px]" },
  { left: "18%", top: "62%", delay: 1.2, size: "text-xs" },
  { left: "78%", top: "14%", delay: 0.4, size: "text-sm" },
  { left: "90%", top: "46%", delay: 1.8, size: "text-[11px]" },
  { left: "66%", top: "78%", delay: 0.9, size: "text-xs" },
  { left: "38%", top: "24%", delay: 2.2, size: "text-[10px]" },
];

const DRIFTING_LIGHTS = [
  { className: "left-[4%] top-[12%] h-56 w-56 bg-[#DFB15B]/12", x: [0, 80, 28, 0], y: [0, 44, 130, 0], duration: 18 },
  { className: "right-[7%] top-[26%] h-72 w-72 bg-[#7C3AED]/15", x: [0, -90, -44, 0], y: [0, 86, 18, 0], duration: 22 },
  { className: "left-[30%] bottom-[7%] h-64 w-64 bg-[#2563EB]/10", x: [0, 70, -42, 0], y: [0, -58, -118, 0], duration: 24 },
];

const MAGIC_TRAILS = [
  { left: "12%", delay: 0, duration: 14 },
  { left: "28%", delay: 4, duration: 16 },
  { left: "52%", delay: 2, duration: 13 },
  { left: "74%", delay: 6, duration: 18 },
  { left: "88%", delay: 1, duration: 15 },
];

const AURORA_BANDS = [
  { top: "9%", rotate: "-14deg", colors: "from-transparent via-[#DFB15B]/22 to-transparent", delay: 0, duration: 16 },
  { top: "34%", rotate: "11deg", colors: "from-transparent via-[#7C3AED]/24 to-transparent", delay: 3, duration: 18 },
  { top: "61%", rotate: "-8deg", colors: "from-transparent via-[#38BDF8]/16 to-transparent", delay: 6, duration: 20 },
];

const COMETS = [
  { top: "13%", delay: 0.5, duration: 7 },
  { top: "31%", delay: 3.2, duration: 8 },
  { top: "55%", delay: 1.8, duration: 6.5 },
  { top: "76%", delay: 5.1, duration: 9 },
];

const FLOATING_GLYPHS = [
  { char: "✧", left: "7%", top: "38%", delay: 0, duration: 9 },
  { char: "✦", left: "15%", top: "72%", delay: 1.5, duration: 11 },
  { char: "✺", left: "84%", top: "18%", delay: 0.8, duration: 10 },
  { char: "✵", left: "91%", top: "64%", delay: 2.5, duration: 12 },
  { char: "✶", left: "47%", top: "12%", delay: 3.2, duration: 10.5 },
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
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedPlanId = BATCH_PLAN_IDS[form.preferredBatch] || planId;
  const selectedPlan = PLANS[selectedPlanId] || plan;

  useEffect(() => {
    if (!plan) return;

    if (!getStoredToken()) {
      savePendingPaymentPlan(planId);
      router.replace("/signup");
      return;
    }

    const prefillTimer = window.setTimeout(() => {
      const user = getStoredUser();
      setForm((current) => ({
        ...current,
        email: current.email || user?.email || "",
        emailAddress: current.emailAddress || user?.email || "",
        yourName: current.yourName || user?.name || "",
      }));
    }, 0);

    return () => window.clearTimeout(prefillTimer);
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
      const payload = await submitManualEnrollment(selectedPlanId, form);
      const paymentId = payload?.data?.paymentId;

      if (!paymentId) {
        throw new Error("Unable to submit enrollment for review.");
      }

      router.push(`/payment/success?paymentId=${encodeURIComponent(paymentId)}&status=pending`);
    } catch (err) {
      setError(err.message || "Unable to submit enrollment for review.");
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#0A090F] px-4 py-12 text-white">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex min-h-120 max-w-xl flex-col items-center justify-center text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Plan Required</p>
          <h1 className="mt-3 font-serif text-3xl font-medium">Choose a program first</h1>
          <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">Select any program from the pricing section before filling out the enrollment form.</p>
          <Link href="/#programs-section" className="mt-6 rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110">
            Back to Pricing
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A090F] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.045)_1px,transparent_1px)] bg-size-[46px_46px]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.16),transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.15),transparent_70%)]" />
        {DRIFTING_LIGHTS.map((light, index) => (
          <motion.div
            key={`light-${index}`}
            className={`absolute rounded-full blur-3xl ${light.className}`}
            animate={{ x: light.x, y: light.y, scale: [1, 1.18, 0.92, 1] }}
            transition={{ duration: light.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {AURORA_BANDS.map((band, index) => (
          <motion.div
            key={`aurora-${index}`}
            className={`absolute -left-1/3 h-28 w-[150vw] bg-linear-to-r ${band.colors} blur-xl mix-blend-screen`}
            style={{ top: band.top, rotate: band.rotate }}
            animate={{ x: ["-18%", "18%", "-18%"], opacity: [0.18, 0.72, 0.18] }}
            transition={{ duration: band.duration, repeat: Infinity, delay: band.delay, ease: "easeInOut" }}
          />
        ))}
        {COMETS.map((comet, index) => (
          <motion.div
            key={`comet-${index}`}
            className="absolute -left-56 h-1 w-56 rounded-full bg-linear-to-r from-transparent via-[#DFB15B]/85 to-white/90 shadow-[0_0_28px_rgba(223,177,91,0.55)]"
            style={{ top: comet.top, rotate: "-18deg" }}
            animate={{ x: ["0vw", "125vw"], opacity: [0, 1, 0] }}
            transition={{ duration: comet.duration, repeat: Infinity, delay: comet.delay, ease: "easeInOut" }}
          />
        ))}
        <motion.div
          className="absolute left-1/2 top-24 h-130 w-130 -translate-x-1/2 rounded-full border border-[#DFB15B]/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-40 h-95 w-95 -translate-x-1/2 rounded-full border border-[#7C3AED]/12"
          animate={{ rotate: -360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-20 h-155 w-155 -translate-x-1/2 rounded-full border border-dashed border-[#DFB15B]/18"
          animate={{ rotate: [0, 360], scale: [0.96, 1.04, 0.96], opacity: [0.18, 0.42, 0.18] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        />
        {MAGIC_TRAILS.map((trail, index) => (
          <motion.span
            key={`trail-${index}`}
            className="absolute top-full h-24 w-px rounded-full bg-linear-to-b from-transparent via-[#DFB15B]/45 to-transparent"
            style={{ left: trail.left }}
            animate={{ y: ["0vh", "-130vh"], opacity: [0, 0.7, 0] }}
            transition={{ duration: trail.duration, repeat: Infinity, delay: trail.delay, ease: "linear" }}
          />
        ))}
        {SPARKS.map((spark, index) => (
          <motion.span
            key={index}
            className={`absolute text-[#DFB15B]/45 ${spark.size}`}
            style={{ left: spark.left, top: spark.top }}
            animate={{ opacity: [0.18, 0.75, 0.18], scale: [0.82, 1.2, 0.82], rotate: [0, 18, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, delay: spark.delay, ease: "easeInOut" }}
          >
            ✦
          </motion.span>
        ))}
        {FLOATING_GLYPHS.map((glyph, index) => (
          <motion.span
            key={`glyph-${index}`}
            className="absolute font-serif text-4xl text-[#DFB15B]/35 drop-shadow-[0_0_18px_rgba(223,177,91,0.45)]"
            style={{ left: glyph.left, top: glyph.top }}
            animate={{
              y: [0, -38, 20, 0],
              x: [0, 18, -12, 0],
              rotate: [0, 24, -18, 0],
              opacity: [0.18, 0.82, 0.28, 0.18],
            }}
            transition={{ duration: glyph.duration, repeat: Infinity, delay: glyph.delay, ease: "easeInOut" }}
          >
            {glyph.char}
          </motion.span>
        ))}
      </div>

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-5xl"
      >
        <Link href="/#programs-section" className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/3 px-4 py-2 text-sm font-semibold text-[#8E8A9F] backdrop-blur transition hover:border-[#DFB15B]/25 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to pricing
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-3xl border border-[#DFB15B]/15 bg-[#100E16]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur">
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B] to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative overflow-hidden border-b border-white/5 px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(223,177,91,0.12),transparent_38%,rgba(124,58,237,0.12))]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
                  <WandSparkles className="h-3.5 w-3.5" />
                  Enrollment Form
                </div>
                <h1 className="mt-4 font-serif text-4xl font-medium leading-tight text-white sm:text-5xl">
                  Open the Portal
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#A9A3BA]">
                  Complete your student profile, scan the bKash QR code, and submit your transaction ID for admin approval.
                </p>
              </div>
              {/* <motion.div
                whileHover={{ y: -4 }}
                className="relative rounded-3xl border border-[#DFB15B]/25 bg-[#DFB15B]/10 px-5 py-5 shadow-[0_0_45px_rgba(223,177,91,0.08)]"
              >
                <div className="absolute right-3 top-3 text-[#DFB15B]/35">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">Selected Program</p>
                <p className="mt-2 text-base font-semibold text-white">{plan.title}</p>
                <p className="mt-2 font-serif text-3xl font-bold text-white">{plan.amount}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#EBD39B]">
                  <Check className="h-4 w-4" />
                  Any successful payment unlocks classes
                </div>
              </motion.div> */}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 px-4 py-6 sm:px-6 sm:py-8">
            <FormSection title="Personal Information" description="Form description" index={1}>
              <TextField label="Email" field="email" type="email" required value={form.email} error={fieldErrors.email} onChange={updateField} placeholder="Valid email" />
              <TextField label="Your Name:" field="yourName" required value={form.yourName} error={fieldErrors.yourName} onChange={updateField} />
              <TextField label="Address:" field="address" required value={form.address} error={fieldErrors.address} onChange={updateField} />
              <TextField label="Phone Number:" field="phoneNumber" type="tel" required value={form.phoneNumber} error={fieldErrors.phoneNumber} onChange={updateField} />
              <TextField label="Facebook Profile:" field="facebookProfile" required value={form.facebookProfile} error={fieldErrors.facebookProfile} onChange={updateField} />
              <TextField label="Email Address:" field="emailAddress" type="email" required value={form.emailAddress} error={fieldErrors.emailAddress} onChange={updateField} />
            </FormSection>

            <FormSection title="Academic Information" description="Description (optional)" index={2}>
              <TextField label="Your College" field="college" required value={form.college} error={fieldErrors.college} onChange={updateField} />
              <RadioField label="Group:" field="group" required value={form.group} error={fieldErrors.group} options={["Science", "Arts", "Commerce", "Others"]} onChange={updateField} />
              <RadioField label="HSC Batch" field="hscBatch" required value={form.hscBatch} error={fieldErrors.hscBatch} options={["2025 or equivalent", "2026 or equivalent", "2027 or equivalent", "Others"]} onChange={updateField} />
              <RadioField label="What is/are your back-up(s)" field="backupChoice" required value={form.backupChoice} error={fieldErrors.backupChoice} options={["IBA JU", "BUP BBA Gen", "BUP FBS", "DU B/C unit", "Engineering", "Medical", "DU A unit", "Private Uni", "Abroad"]} onChange={updateField} />
            </FormSection>

            <FormSection title="IBA Preparation" description="Description (optional)" index={3}>
              <RadioField label="Do you have clear idea about the admission system?" field="admissionSystemIdea" required value={form.admissionSystemIdea} error={fieldErrors.admissionSystemIdea} options={["Yes", "No", "Maybe"]} onChange={updateField} />
              <RadioField label="Have you taken any preparation for IBA already?" field="previousIbaPreparation" value={form.previousIbaPreparation} options={["Yes", "No"]} onChange={updateField} />
              <TextField label="If yes, then how you have studied earlier?" field="previousStudyDetails" value={form.previousStudyDetails} onChange={updateField} />
              <RadioField label="What section of IBA exam you think is your strongest side?" field="strongestSection" value={form.strongestSection} options={["English", "Math", "Analytical", "Writing"]} onChange={updateField} />
              <RadioField label="What section of IBA exam you think is your weakest side?" field="weakestSection" value={form.weakestSection} options={["English", "Math", "Analytical", "Writing"]} onChange={updateField} />
            </FormSection>

            <FormSection title="Batch Information" description="Description (optional)" index={4}>
              <RadioField label="Which batch do you want to be enrolled?" field="preferredBatch" value={form.preferredBatch} options={["Farmgate", "Bailey Road", "Online"]} onChange={updateField} />
            </FormSection>

            <FormSection title="bKash Payment" description="Scan the QR code, complete payment, then enter the transaction ID from bKash." index={5}>
              <div className="grid gap-5 lg:grid-cols-[280px_1fr] lg:items-center">
                <div className="rounded-3xl border border-[#DFB15B]/20 bg-white p-4">
                  <Image
                    src="/bkash-qr.jpg"
                    alt="bKash payment QR code"
                    width={520}
                    height={520}
                    className="aspect-square w-full rounded-2xl object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-4 py-4 text-sm text-[#EBD39B]">
                    <QrCode className="h-5 w-5 shrink-0 text-[#DFB15B]" />
                    <span className="font-medium">Selected plan: {selectedPlan.title} - {selectedPlan.amount}</span>
                  </div>
                  <TextField
                    label="BkashTrxID"
                    field="bkashTrxID"
                    required
                    value={form.bkashTrxID}
                    error={fieldErrors.bkashTrxID}
                    onChange={updateField}
                    placeholder="Example: A1B2C3D4E5"
                  />
                </div>
              </div>
            </FormSection>

            {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">{error}</p> : null}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-3xl border border-[#DFB15B]/15 bg-[#121017]/95 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-[#8E8A9F]">
                <LockKeyhole className="h-4 w-4 text-[#DFB15B]" />
                Your enrollment will stay pending until an admin approves the transaction ID.
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#DFB15B] px-6 py-3 text-sm font-bold uppercase tracking-wider text-black shadow-[0_0_30px_rgba(223,177,91,0.22)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
              >
                <span className="absolute inset-y-0 -left-10 w-8 rotate-12 bg-white/40 blur-sm transition group-hover:left-full" />
                <LoadingButtonLabel
                  loading={loading}
                  idleText="Submit for Review"
                  loadingText="Submitting..."
                  iconName="credit"
                />
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.main>
    </div>
  );
}

function PaymentDetailsLoading() {
  return (
    <FlashyLoader
      eyebrow="Enrollment Portal"
      title="Preparing enrollment form"
      message="Your selected plan and student profile fields are being aligned."
      iconName="wand"
      skeleton="cards"
      surface="screen"
    />
  );
}

function FormSection({ title, description, children, index }) {
  return (
    <motion.section
      variants={SECTION_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
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

function TextField({ label, field, value, onChange, required = false, type = "text", placeholder = "Short answer text", error = false }) {
  return (
    <motion.label whileFocusWithin={{ y: -2 }} className="block rounded-2xl border border-white/5 bg-[#0F0D15]/70 px-4 py-4 transition focus-within:border-[#DFB15B]/35 focus-within:bg-[#15111C]">
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
    </motion.label>
  );
}

function RadioField({ label, field, value, options, onChange, required = false, error = false }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-white">
        {label}
        {required ? <span className="text-red-400"> *</span> : null}
      </legend>
      <div className={`mt-4 grid gap-3 rounded-2xl border p-3 sm:grid-cols-2 ${error ? "border-red-400/60 bg-red-500/5" : "border-white/5 bg-[#0F0D15]/70"}`}>
        {options.map((option) => (
          <motion.label
            key={option}
            whileHover={{ y: -2 }}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${value === option ? "border-[#DFB15B]/45 bg-[#DFB15B]/12 text-white shadow-[0_0_24px_rgba(223,177,91,0.08)]" : "border-white/5 bg-[#17131F]/70 text-[#D8D4E5] hover:border-white/12 hover:bg-[#1E1928]"}`}
          >
            <input
              type="radio"
              name={field}
              value={option}
              checked={value === option}
              onChange={(event) => onChange(field, event.target.value)}
              className="sr-only"
            />
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${value === option ? "border-[#DFB15B] bg-[#DFB15B]" : "border-[#8E8A9F]"}`}>
              {value === option ? <Check className="h-3 w-3 text-black" /> : null}
            </span>
            <span>{option}</span>
          </motion.label>
        ))}
      </div>
    </fieldset>
  );
}
