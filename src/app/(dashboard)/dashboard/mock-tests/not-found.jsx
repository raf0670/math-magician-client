"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ClipboardList, FileQuestion, Home, Library, Search } from "lucide-react";

const MOCK_CATEGORIES = [
  { label: "Full mocks", note: "Timed papers" },
  { label: "Practice sets", note: "Topic drills" },
  { label: "Reports", note: "Score review" },
];

export default function MockTestsNotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#DFB15B]/18 bg-[#121017] px-5 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(223,177,91,0.13),transparent_30%),radial-gradient(circle_at_86%_20%,rgba(56,189,248,0.1),transparent_28%)]" />
        <div className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7C3AED]/12 blur-[90px]" />
      </div>

      <motion.div
        className="relative z-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="flex min-h-72 flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
            <FileQuestion className="h-3.5 w-3.5" />
            Mock route missing
          </div>

          <h1 className="mt-5 max-w-xl font-serif text-3xl font-medium leading-tight tracking-wide text-white sm:text-5xl">
            This mock test aisle is empty.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#A9A3BA] sm:text-base">
            The exam page you requested is not available from this route. Head back to the mock test library and choose a listed paper.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/mock-tests"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:brightness-110 active:scale-[0.98]"
            >
              <Library className="h-4 w-4" />
              Mock Test Library
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/8 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
            >
              Back to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/20 p-5 backdrop-blur">
          <div className="flex items-center justify-between rounded-xl border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-4 py-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">Suggested path</p>
              <p className="mt-1 text-sm text-[#A9A3BA]">Use the official library list.</p>
            </div>
            <Search className="h-7 w-7 text-[#DFB15B]" />
          </div>

          <div className="mt-4 grid gap-3">
            {MOCK_CATEGORIES.map((item, index) => (
              <motion.div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.035] px-4 py-3"
                animate={shouldReduceMotion ? { opacity: 0.9 } : { opacity: [0.62, 1, 0.78] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.2, ease: "easeInOut" }}
              >
                <span className="flex items-center gap-2 text-xs font-semibold text-[#A9A3BA]">
                  <ClipboardList className="h-4 w-4 text-[#DFB15B]" />
                  {item.label}
                </span>
                <span className="text-xs font-bold text-white">{item.note}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
