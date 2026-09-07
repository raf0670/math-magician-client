"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function MathPageShell({ children, className = "" }) {
  return (
    <div className={`relative min-w-0 overflow-hidden px-1 pb-4 sm:px-0 ${className}`}>
      <div className="pointer-events-none absolute inset-x-[-12%] -top-24 h-72 bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.16),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-x-[-10%] top-56 h-px bg-linear-to-r from-transparent via-[#DFB15B]/24 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.03)_1px,transparent_1px)] bg-size-[44px_44px] opacity-80" />
      <div className="relative z-10 flex flex-col gap-7">
        {children}
      </div>
    </div>
  );
}

export function MathHero({ eyebrow, title, description, icon: Icon = Sparkles, children, action }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-emerald-300/18 bg-[#100E16] p-5 shadow-[0_26px_90px_rgba(0,0,0,0.42)] sm:p-7 lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(52,211,153,0.12),transparent_38%),linear-gradient(320deg,rgba(223,177,91,0.13),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/80 to-[#DFB15B]/70" />
      <div className="pointer-events-none absolute right-6 top-6 hidden h-28 w-56 border-t border-r border-emerald-200/10 lg:block" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-100">
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{eyebrow}</span>
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-3xl font-semibold leading-tight tracking-wide text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[#A9A3BA]">
            {description}
          </p>
          {children ? <div className="mt-7">{children}</div> : null}
        </div>
        {action ? <div className="min-w-0 lg:min-w-72">{action}</div> : null}
      </div>
    </motion.section>
  );
}

export function MathStatCard({ label, value, icon: Icon = Sparkles, tone = "emerald" }) {
  const toneClass = tone === "gold" ? "text-[#DFB15B] border-[#DFB15B]/18 bg-[#DFB15B]/8" : "text-emerald-200 border-emerald-300/16 bg-emerald-300/8";

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`min-w-0 rounded-3xl border p-5 shadow-[0_16px_45px_rgba(0,0,0,0.22)] ${toneClass}`}
    >
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8A9F]">
        <Icon className="h-4 w-4 shrink-0 text-current" />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-3 truncate font-serif text-2xl font-bold tracking-wide text-white">{value}</p>
    </motion.article>
  );
}

export function MathActionCard({ href, title, description, icon: Icon = ArrowUpRight }) {
  return (
    <Link
      href={href}
      className="group relative min-h-44 overflow-hidden rounded-3xl border border-white/7 bg-[#121017] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:border-emerald-300/35 hover:shadow-[0_22px_60px_rgba(0,0,0,0.34)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/55 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-5 flex items-center gap-2 font-serif text-2xl font-medium tracking-wide text-white">
        <span>{title}</span>
        <ArrowUpRight className="h-4 w-4 text-[#DFB15B] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </h2>
      <p className="mt-3 text-sm font-medium leading-6 text-[#8E8A9F]">{description}</p>
    </Link>
  );
}

export function MathPanel({ eyebrow, title, description, icon: Icon = Sparkles, children, action, className = "" }) {
  return (
    <section className={`relative overflow-hidden rounded-3xl border border-white/6 bg-[#121017] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.26)] sm:p-6 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/45 to-transparent" />
      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
                <Icon className="h-3.5 w-3.5" />
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 font-serif text-2xl font-medium tracking-wide text-white sm:text-3xl">{title}</h2>
            {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8E8A9F]">{description}</p> : null}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

export function MathEmptyState({ icon: Icon = Sparkles, title, message, action }) {
  return (
    <div className="rounded-3xl border border-white/6 bg-[#0F0D15] px-5 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/16 bg-emerald-300/8 text-emerald-200">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-serif text-2xl font-medium text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#8E8A9F]">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
