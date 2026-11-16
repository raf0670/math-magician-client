import Link from "next/link";
import { ArrowRight, Check, Languages, Percent, Timer, Zap } from "lucide-react";

const OPTIONS = [
  { id: "marathonEnglish", title: "English", price: "BDT 1,200", discounted: "BDT 900", accent: "cyan", features: ["Focused English live classes", "Direct class access", "Dedicated Marathon dashboard"] },
  { id: "marathonMaths", title: "Maths", price: "BDT 1,200", discounted: "BDT 900", accent: "orange", features: ["Focused Maths live classes", "Direct class access", "Dedicated Marathon dashboard"] },
  { id: "marathonBoth", title: "English + Maths", price: "BDT 2,000", discounted: "BDT 1,500", accent: "emerald", featured: true, features: ["Access to both sections", "Best-value bundle price", "One dashboard for both classes"] },
];

export default function MarathonLandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080B12] px-4 pb-24 pt-28 text-white sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(249,115,22,0.12),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.1),transparent_35%)]" />
      <div className="relative mx-auto max-w-6xl">
        <section className="py-14 text-center sm:py-20">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
            <Timer className="h-4 w-4" /> New Batch
          </div>
          <h1 className="mx-auto mt-7 max-w-4xl font-sans text-5xl font-semibold leading-tight sm:text-7xl">
            Marathon <span className="bg-linear-to-r from-cyan-300 via-emerald-300 to-orange-300 bg-clip-text text-transparent">Classes</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#AAB3C5] sm:text-lg">A focused final sprint in English, Maths, or both. Enroll once, then join each live class from your dashboard when the link is published.</p>
          <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-3xl border border-emerald-300/20 bg-emerald-300/8 px-5 py-4 text-left text-sm text-emerald-100">
            <Percent className="h-6 w-6 shrink-0 text-emerald-300" /> Students enrolled in any paid 2026 batch receive an automatic 25% discount when using the same account.
          </div>
          <p className="mx-auto mt-3 max-w-xl text-sm font-semibold text-orange-200">Or use MAGNUS200 for BDT 200 off. Discounts cannot be combined.</p>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {OPTIONS.map((option) => (
            <article key={option.id} className={`relative flex min-h-125 flex-col overflow-hidden rounded-3xl border p-6 shadow-2xl sm:p-7 ${option.featured ? "border-emerald-300/35 bg-[#102019] lg:-translate-y-4" : option.accent === "cyan" ? "border-cyan-300/18 bg-[#101620]" : "border-orange-300/18 bg-[#171310]"}`}>
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/6 blur-3xl" />
              {option.featured ? <span className="relative w-fit rounded-full border border-emerald-300/25 bg-emerald-300/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200">Best value</span> : null}
              <div className="relative mt-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6"><Languages className="h-5 w-5" /></div>
              <h2 className="relative mt-6 text-3xl font-semibold">{option.title}</h2>
              <div className="relative mt-5">
                <p className="text-3xl font-black">{option.price}</p>
                <p className="mt-1 text-sm font-semibold text-emerald-300">Returning students: {option.discounted}</p>
              </div>
              <div className="relative mt-7 space-y-3">
                {option.features.map((feature) => <p key={feature} className="flex items-center gap-3 text-sm text-[#C4CBD8]"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/7"><Check className="h-3.5 w-3.5" /></span>{feature}</p>)}
              </div>
              <Link href={`/payment/details?plan=${option.id}`} className="relative mt-auto inline-flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-cyan-200">
                Enroll now <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-white/8 bg-white/4 p-7 text-center sm:p-10">
          <Zap className="mx-auto h-7 w-7 text-orange-300" />
          <h2 className="mt-4 text-3xl font-semibold">Already enrolled in one section?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#AAB3C5]">Add the other later for only the bundle difference: BDT 800 normally or BDT 600 with the returning-student discount.</p>
        </section>
      </div>
    </main>
  );
}
