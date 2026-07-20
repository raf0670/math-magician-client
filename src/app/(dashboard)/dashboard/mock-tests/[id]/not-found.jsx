"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Brain, FileQuestion, Home, Library, ShieldCheck } from "lucide-react";

const SAFE_NOTES = [
  "No answers were submitted",
  "No timer was started",
  "Choose another paper safely",
];

export default function ExamNotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A090F] px-4 py-8 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.18),transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.13),transparent_72%)]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#DFB15B]/12"
          animate={shouldReduceMotion ? { opacity: 0.45 } : { rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#38BDF8]/12"
          animate={shouldReduceMotion ? { opacity: 0.35 } : { rotate: -360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.section
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#DFB15B]/18 bg-[#121017]/92 shadow-[0_32px_100px_rgba(0,0,0,0.55)] backdrop-blur lg:grid-cols-[0.9fr_1.1fr]"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="relative flex min-h-80 items-center justify-center overflow-hidden border-b border-white/6 bg-black/20 p-8 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(223,177,91,0.18),transparent_38%)]" />
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 shadow-[0_0_70px_rgba(223,177,91,0.18)]">
            <motion.span
              className="absolute inset-5 rounded-full border border-[#38BDF8]/20"
              animate={shouldReduceMotion ? { opacity: 0.7 } : { scale: [0.95, 1.06, 0.95], opacity: [0.45, 0.9, 0.45] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <FileQuestion className="h-20 w-20 text-[#DFB15B]" />
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
            <Brain className="h-3.5 w-3.5" />
            Exam paper not found
          </div>

          <h1 className="mt-5 font-serif text-3xl font-medium leading-tight tracking-wide text-white sm:text-5xl">
            This mock test is not in the arena.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#A9A3BA] sm:text-base">
            The paper may have moved, expired, or the link may be incorrect. Return to the mock test library to open an available exam.
          </p>

          <div className="mt-6 grid gap-3">
            {SAFE_NOTES.map((note) => (
              <div key={note} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.035] px-4 py-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#DFB15B]" />
                <span className="text-xs font-semibold text-[#A9A3BA]">{note}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/mock-tests"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:brightness-110 active:scale-[0.98]"
            >
              <Library className="h-4 w-4" />
              Browse Mock Tests
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/8 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/classes"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Classes
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
