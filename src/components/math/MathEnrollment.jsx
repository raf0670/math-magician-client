"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenCheck,
  Brain,
  Check,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import {
  getMathEnrollmentContext,
  getPaymentQuote,
  getStoredToken,
  getStoredUser,
  savePendingPaymentPlan,
  savePendingProgramAction,
  submitManualEnrollment,
} from "@/lib/api";
import PolicyAcceptance from "@/components/shared/PolicyAcceptance";
import FlashyLoader, { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

const METHODS = ["By myself", "Offline coaching ( Mentors / Blueprint )", "Online coaching ( ACS / Michil )", "Personal batch"];
const WEAKNESSES = ["Weak mental calculation", "Lack of question understanding", "Wrong approach", "Others"];
const BACKUPS = ["IBA JU", "BUP BBA Gen", "BUP FBS", "DU B/C unit", "Engineering", "Medical", "DU A unit", "Private Uni", "Abroad"];

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const SPARKS = [
  { left: "8%", top: "18%", delay: 0 },
  { left: "18%", top: "68%", delay: 1.2 },
  { left: "78%", top: "14%", delay: 0.4 },
  { left: "91%", top: "50%", delay: 1.8 },
  { left: "42%", top: "26%", delay: 2.2 },
];

const amount = (value) => `BDT ${Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const inputBaseClass = "mt-3 w-full border-0 border-b bg-transparent px-0 py-2 text-sm text-white outline-none transition placeholder:text-[#6B667B]";

function getPlanLabel(planId, upgrade) {
  if (planId === "math") return "Math Course";
  if (upgrade) return "Slytherin Upgrade";
  return "Math + Slytherin";
}

function isComplete(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value?.toString().trim());
}

export default function MathEnrollment({ initialPlan }) {
  const router = useRouter();
  const upgrade = initialPlan === "slytherinUpgrade";
  const [context, setContext] = useState(null);
  const [form, setForm] = useState({ backupChoice: [], preparationMethods: [], mathWeaknesses: [] });
  const [joinSlytherin, setJoinSlytherin] = useState(initialPlan === "mathSlytherin");
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedPlan = upgrade ? "slytherinUpgrade" : context?.existingHouseEligible ? "math" : joinSlytherin ? "mathSlytherin" : "math";
  const readyQuote = quote?.planId === selectedPlan && quote.requestedCoupon === couponCode ? quote : null;
  const planLabel = getPlanLabel(selectedPlan, upgrade);

  const fieldProgress = useMemo(() => {
    const fields = upgrade
      ? ["yourName", "emailAddress"]
      : ["yourName", "emailAddress", "phoneNumber", "address", "facebookProfile", "college", "group", "hscBatch", "backupChoice", "admissionSystemIdea", "preparationMethods", "mathFear", "mathWeaknesses"];
    const completed = fields.filter((field) => isComplete(form[field])).length;
    return { completed, total: fields.length };
  }, [form, upgrade]);

  useEffect(() => {
    if (!getStoredToken()) {
      savePendingPaymentPlan(initialPlan);
      savePendingProgramAction("enroll");
      router.replace("/signup");
      return;
    }

    let active = true;
    getMathEnrollmentContext()
      .then((payload) => {
        if (!active) return;
        const user = getStoredUser();
        setContext(payload.data);
        setForm((current) => ({
          ...current,
          ...payload.data.student,
          yourName: payload.data.student?.yourName || user?.name || "",
          emailAddress: payload.data.student?.emailAddress || user?.email || "",
        }));
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [initialPlan, router]);

  useEffect(() => {
    if (!context) return;

    let active = true;
    getPaymentQuote(selectedPlan, couponCode)
      .then((payload) => {
        if (active) {
          setQuote({ ...payload.data, requestedCoupon: couponCode });
          setQuoteError("");
        }
      })
      .catch((err) => {
        if (active) {
          setQuote(null);
          setQuoteError(err.message);
        }
      });

    return () => {
      active = false;
    };
  }, [context, selectedPlan, couponCode]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const toggle = (field, value) => {
    update(field, (form[field] || []).includes(value) ? form[field].filter((item) => item !== value) : [...(form[field] || []), value]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!accepted || !readyQuote) {
      setError("Accept the policies and confirm your price before continuing.");
      return;
    }

    if (!upgrade && ["backupChoice", "preparationMethods", "mathWeaknesses"].some((field) => !form[field]?.length)) {
      setError("Select at least one answer in each multiple-choice section.");
      return;
    }

    setSaving(true);

    try {
      const payload = await submitManualEnrollment(selectedPlan, { ...form, email: form.emailAddress }, "full", couponCode, readyQuote.amount);
      if (!payload.data?.paymentUrl) throw new Error("Checkout could not be opened. Please try again.");
      window.location.assign(payload.data.paymentUrl);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (!context) {
    return (
      <main className="min-h-screen bg-[#0A090F] px-4 py-10 text-white">
        {error ? (
          <div className="mx-auto mt-24 max-w-xl rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-center text-red-100">
            {error}
          </div>
        ) : (
          <FlashyLoader
            eyebrow="Enrollment Portal"
            title="Preparing your enrollment form"
            message="Your profile and Math Course payment options are being aligned."
            iconName="wand"
            skeleton="cards"
            surface="screen"
          />
        )}
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A090F] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.035)_1px,transparent_1px)] bg-size-[46px_46px]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.18),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(ellipse_at_bottom,rgba(223,177,91,0.14),transparent_70%)]" />
        <motion.div
          className="absolute left-1/2 top-28 h-140 w-140 -translate-x-1/2 rounded-full border border-emerald-300/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -left-32 top-1/3 h-24 w-[150vw] rotate-[-12deg] bg-linear-to-r from-transparent via-emerald-300/18 to-transparent blur-xl"
          animate={{ x: ["-16%", "16%", "-16%"], opacity: [0.15, 0.68, 0.15] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {SPARKS.map((spark, index) => (
          <motion.span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#DFB15B] shadow-[0_0_18px_rgba(223,177,91,0.85)]"
            style={{ left: spark.left, top: spark.top }}
            animate={{ opacity: [0.18, 0.86, 0.18], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 3.6, repeat: Infinity, delay: spark.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-6xl"
      >
        <Link href="/math-course" className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/4 px-4 py-2 text-sm font-semibold text-[#A9A3BA] backdrop-blur transition hover:border-emerald-300/25 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Math Course details
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-3xl border border-emerald-300/18 bg-[#100E16]/95 p-6 shadow-[0_26px_90px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(52,211,153,0.14),transparent_42%,rgba(223,177,91,0.13))]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/75 to-[#DFB15B]/70" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-100">
                <WandSparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{upgrade ? "Slytherin Upgrade" : "Math Enrollment"}</span>
              </div>
              <h1 className="mt-5 max-w-4xl font-serif text-3xl font-semibold leading-tight tracking-wide text-white sm:text-5xl">
                {upgrade ? "Join Slytherin" : "Your math journey starts here"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[#A9A3BA]">
                {upgrade
                  ? "Add full website access to your Math Course. Your math progress stays with you."
                  : "Tell us about yourself and your preparation, then continue to PayStation's secure checkout."}
              </p>
            </div>

            <div className="grid min-w-0 gap-3 rounded-3xl border border-white/7 bg-white/5 p-4 lg:min-w-72">
              <SummaryMetric label="Selected plan" value={planLabel} />
              <SummaryMetric label="Progress" value={`${fieldProgress.completed}/${fieldProgress.total} fields`} />
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {upgrade ? (
              <FormSection title="Your Enrollment" description="We will reuse the details from your Math Course enrollment." index={1} icon={ShieldCheck}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ReadOnlyInfo label="Name" value={form.yourName || "Not saved"} />
                  <ReadOnlyInfo label="Email" value={form.emailAddress || "Not saved"} />
                </div>
                <div className="mt-4 rounded-2xl border border-emerald-300/16 bg-emerald-300/8 px-4 py-4 text-sm font-medium leading-6 text-emerald-100">
                  Your Math Course progress, results, and access remain active. This upgrade adds the full website and Slytherin membership.
                </div>
              </FormSection>
            ) : (
              <>
                <FormSection title="Contact Information" description="Use the details you want attached to this enrollment." index={1} icon={BookOpenCheck}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["yourName", "Your name", "text"],
                      ["emailAddress", "Email address", "email"],
                      ["phoneNumber", "Phone number", "tel"],
                      ["address", "Address", "text"],
                      ["facebookProfile", "Facebook profile link", "url"],
                      ["college", "College", "text"],
                    ].map(([field, label, type]) => (
                      <Field key={field} label={label} type={type} value={form[field]} onChange={(value) => update(field, value)} />
                    ))}
                  </div>
                </FormSection>

                <FormSection title="Academic Information" description="A few details help us place you in the right learning context." index={2} icon={Brain}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select label="Group" value={form.group} options={["Science", "Arts", "Commerce", "Others"]} onChange={(value) => update("group", value)} />
                    <Select label="HSC batch" value={form.hscBatch} options={["2025 or equivalent", "2026 or equivalent", "2027 or equivalent", "Others"]} onChange={(value) => update("hscBatch", value)} />
                  </div>
                  <Choices label="What is/are your back-up(s)?" options={BACKUPS} values={form.backupChoice} onChange={(value) => toggle("backupChoice", value)} />
                  <Select label="Do you have a clear idea about the admission system?" value={form.admissionSystemIdea} options={["Yes", "No", "Maybe"]} onChange={(value) => update("admissionSystemIdea", value)} />
                </FormSection>

                <FormSection title="Your Math Preparation" description="This helps us understand where the Math Course can help most." index={3} icon={Sparkles}>
                  <Choices label="1. How are you taking preparation right now?" options={METHODS} values={form.preparationMethods} onChange={(value) => toggle("preparationMethods", value)} />
                  <Field
                    label="2. What is your biggest fear in math?"
                    value={form.mathFear}
                    onChange={(value) => update("mathFear", value)}
                    textarea
                    maxLength={5000}
                  />
                  <Choices label="3. What do you think is wrong with your math?" options={WEAKNESSES} values={form.mathWeaknesses} onChange={(value) => toggle("mathWeaknesses", value)} />
                  {form.mathWeaknesses?.includes("Others") ? (
                    <Field label="Tell us more" value={form.mathWeaknessOther} maxLength={2000} onChange={(value) => update("mathWeaknessOther", value)} />
                  ) : null}
                </FormSection>

                <FormSection title="Want To Join Slytherin Too?" description="Choose whether this checkout should include full website access." index={4} icon={ShieldCheck}>
                  {context.existingHouseEligible ? (
                    <div className="rounded-2xl border border-emerald-300/18 bg-emerald-300/10 px-4 py-4 text-sm font-medium leading-7 text-emerald-100">
                      Your existing house already includes full website access. You will keep your house and receive the best available math discount.
                    </div>
                  ) : (
                    <SlytherinChoice checked={joinSlytherin} onChange={setJoinSlytherin} />
                  )}
                </FormSection>
              </>
            )}
          </div>

          <CheckoutSummary
            upgrade={upgrade}
            planLabel={planLabel}
            selectedPlan={selectedPlan}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            applyCoupon={() => setCouponCode(couponInput.trim())}
            readyQuote={readyQuote}
            quoteError={quoteError}
            accepted={accepted}
            setAccepted={setAccepted}
            error={error}
            saving={saving}
            context={context}
          />
        </form>
      </motion.div>
    </main>
  );
}

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/7 bg-[#0F0D15]/70 px-4 py-3">
      <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8A9F]">{label}</span>
      <span className="mt-1 block truncate text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function FormSection({ title, description, children, index, icon: Icon }) {
  return (
    <motion.section
      variants={SECTION_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#15121D]/88 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.26)] sm:p-6"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/38 to-[#DFB15B]/32" />
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#DFB15B]">Step {index}</p>
          <h2 className="mt-1 font-serif text-2xl font-medium text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#8E8A9F]">{description}</p>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </motion.section>
  );
}

function Field({ label, value, onChange, type = "text", maxLength = 500, textarea = false }) {
  const complete = isComplete(value);
  const inputBorder = complete ? "border-emerald-300 focus:border-emerald-200" : "border-white/20 focus:border-[#DFB15B]";

  return (
    <motion.label
      whileFocusWithin={{ y: -2 }}
      className={`block rounded-2xl border px-4 py-4 transition focus-within:bg-[#15111C] ${
        complete ? "border-emerald-300/28 bg-emerald-300/7" : "border-white/5 bg-[#0F0D15]/70 focus-within:border-[#DFB15B]/35"
      }`}
    >
      <span className={`text-sm font-semibold ${complete ? "text-emerald-100" : "text-white"}`}>
        {label} <span className="text-[#DFB15B]">*</span>
      </span>
      {textarea ? (
        <textarea
          required
          maxLength={maxLength}
          rows={4}
          className={`${inputBaseClass} min-h-32 resize-y ${inputBorder}`}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          required
          type={type}
          maxLength={maxLength}
          className={`${inputBaseClass} ${inputBorder}`}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </motion.label>
  );
}

function Select({ label, value, options, onChange }) {
  const complete = isComplete(value);

  return (
    <motion.label
      whileFocusWithin={{ y: -2 }}
      className={`block rounded-2xl border px-4 py-4 transition ${
        complete ? "border-emerald-300/28 bg-emerald-300/7" : "border-white/5 bg-[#0F0D15]/70 focus-within:border-[#DFB15B]/35"
      }`}
    >
      <span className={`text-sm font-semibold ${complete ? "text-emerald-100" : "text-white"}`}>
        {label} <span className="text-[#DFB15B]">*</span>
      </span>
      <select
        required
        className={`mt-3 h-12 w-full rounded-xl border bg-[#0A090F] px-3 text-sm font-semibold text-white outline-none transition ${
          complete ? "border-emerald-300/45" : "border-white/15 focus:border-[#DFB15B]/45"
        }`}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select an answer</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#121017] text-white">
            {option}
          </option>
        ))}
      </select>
    </motion.label>
  );
}

function Choices({ label, options, values = [], onChange }) {
  const complete = values.length > 0;

  return (
    <fieldset>
      <legend className={`text-sm font-semibold ${complete ? "text-emerald-100" : "text-white"}`}>
        {label} <span className="text-[#DFB15B]">*</span>
      </legend>
      <p className="mt-1 text-xs text-[#8E8A9F]">Select all that apply.</p>
      <div className={`mt-4 grid gap-3 rounded-2xl border p-3 sm:grid-cols-2 ${complete ? "border-emerald-300/24 bg-emerald-300/7" : "border-white/5 bg-[#0F0D15]/70"}`}>
        {options.map((option) => {
          const checked = values.includes(option);

          return (
            <motion.label
              key={option}
              whileHover={{ y: -2 }}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                checked
                  ? "border-emerald-300/50 bg-emerald-300/14 text-white shadow-[0_0_24px_rgba(52,211,153,0.08)]"
                  : "border-white/5 bg-[#17131F]/70 text-[#D8D4E5] hover:border-white/12 hover:bg-[#1E1928]"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${checked ? "border-emerald-300 bg-emerald-300 text-black" : "border-[#8E8A9F] text-transparent"}`}>
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>{option}</span>
            </motion.label>
          );
        })}
      </div>
    </fieldset>
  );
}

function SlytherinChoice({ checked, onChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-full overflow-hidden rounded-3xl border p-5 text-left transition ${
        checked
          ? "border-emerald-300/45 bg-linear-to-br from-emerald-300/16 via-[#102019] to-[#DFB15B]/10 shadow-[0_0_34px_rgba(52,211,153,0.12)]"
          : "border-white/8 bg-[#0F0D15]/70 hover:border-emerald-300/24"
      }`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${checked ? "border-emerald-300 bg-emerald-300 text-black" : "border-[#8E8A9F] text-transparent"}`}>
          <Check className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-2xl font-medium text-white">Add Slytherin</span>
          <span className="mt-2 block text-sm font-medium leading-7 text-[#A9A3BA]">
            Add Slytherin for BDT 5,999 and unlock the full website, regular exams, and house competition.
          </span>
          <span className="mt-4 inline-flex rounded-full border border-[#DFB15B]/18 bg-[#DFB15B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DFB15B]">
            {checked ? "Included in checkout" : "Optional add-on"}
          </span>
        </span>
      </div>
    </button>
  );
}

function ReadOnlyInfo({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#0F0D15]/75 px-4 py-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8A9F]">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function CheckoutSummary({
  upgrade,
  planLabel,
  selectedPlan,
  couponInput,
  setCouponInput,
  applyCoupon,
  readyQuote,
  quoteError,
  accepted,
  setAccepted,
  error,
  saving,
  context,
}) {
  return (
    <aside className="relative overflow-hidden rounded-3xl border border-emerald-300/18 bg-[#121017]/95 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.38)] backdrop-blur lg:sticky lg:top-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/70 to-[#DFB15B]/65" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/12 blur-3xl" />

      <div className="relative space-y-5">
        <div>
          <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
            <CreditCard className="h-3.5 w-3.5" />
            Secure Checkout
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white">{planLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-[#8E8A9F]">Full payment through PayStation.</p>
        </div>

        {!upgrade ? (
          <div className="rounded-2xl border border-white/6 bg-[#0F0D15]/75 px-4 py-4">
            <label htmlFor="math-coupon" className="text-sm font-semibold text-white">Discount code</label>
            <div className="mt-3 flex gap-2">
              <input
                id="math-coupon"
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#0A090F] px-3 py-3 text-sm text-white outline-none transition focus:border-emerald-300/45"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-xl border border-emerald-300/30 px-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-300 hover:text-black"
              >
                Apply
              </button>
            </div>
          </div>
        ) : null}

        {readyQuote && !quoteError ? (
          <div aria-live="polite" className="space-y-3 rounded-2xl border border-white/6 bg-[#0F0D15]/75 px-4 py-4 text-sm">
            <div className="flex justify-between gap-3 text-[#D8D4E5]">
              <span>Course price</span>
              <span className="font-semibold text-white">{amount(readyQuote.originalAmount)}</span>
            </div>
            {readyQuote.discountAmount > 0 ? (
              <div className="flex justify-between gap-3 text-emerald-200">
                <span>{readyQuote.discountType === "existingHouse" ? "House student discount" : "Code discount"}</span>
                <span className="font-semibold">-{amount(readyQuote.discountAmount)}</span>
              </div>
            ) : null}
            <div className="border-t border-white/10 pt-4">
              <p className="text-[#8E8A9F]">Payable now</p>
              <p className="mt-1 font-serif text-4xl font-bold text-[#DFB15B]">{amount(readyQuote.amount)}</p>
            </div>
            <p className="text-xs leading-6 text-[#8E8A9F]">Only the best single discount applies.</p>
          </div>
        ) : (
          <p role="status" className="rounded-2xl border border-white/6 bg-[#0F0D15]/75 px-4 py-4 text-sm text-[#A9A3BA]">
            {quoteError || "Calculating your price..."}
          </p>
        )}

        <PolicyAcceptance checked={accepted} onChange={setAccepted} error={error.includes("Accept the policies")} />

        {error ? (
          <p role="alert" className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100">
            {error}
          </p>
        ) : null}

        <div className="flex items-start gap-3 rounded-2xl border border-[#DFB15B]/12 bg-[#DFB15B]/7 px-4 py-3 text-xs font-medium leading-5 text-[#EBD39B]">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#DFB15B]" />
          <span>Access unlocks automatically after successful PayStation verification.</span>
        </div>

        <motion.button
          type="submit"
          disabled={saving || !readyQuote || Boolean(quoteError)}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-300 via-[#DFB15B] to-[#A46F18] px-4 py-4 text-sm font-bold uppercase tracking-wider text-black shadow-[0_16px_42px_rgba(52,211,153,0.18)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-45"
        >
          <span className="absolute inset-y-0 -left-10 w-8 rotate-12 bg-white/40 blur-sm transition group-hover:left-full" />
          <LoadingButtonLabel
            loading={saving}
            idleText="Continue to PayStation"
            loadingText="Opening checkout..."
            iconName="credit"
          />
        </motion.button>

        {context.hasMathAccess && !upgrade ? (
          <Link href="/dashboard/math" className="block text-center text-sm font-semibold text-emerald-200 transition hover:text-emerald-100">
            Open your Math Course
          </Link>
        ) : null}

        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B667B]">
          Plan ID: {selectedPlan}
        </p>
      </div>
    </aside>
  );
}
