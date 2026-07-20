"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Compass, Home, Sparkles } from "lucide-react";

const PATH_MARKS = [
  { text: "Home", left: "11%", top: "28%", delay: 0 },
  { text: "Programs", left: "74%", top: "24%", delay: 0.35 },
  { text: "Mock Tests", left: "12%", top: "70%", delay: 0.75 },
  { text: "Classes", left: "79%", top: "66%", delay: 1.15 },
  { text: "IBA", left: "47%", top: "14%", delay: 1.55 },
  { text: "404", left: "48%", top: "82%", delay: 0.95 },
];

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-[#0D0B14] px-4 py-12 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.18),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.14),transparent_72%)]" />
        <div className="absolute left-1/2 top-1/2 h-136 w-136 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED]/10 blur-[130px]" />

        {PATH_MARKS.map((mark) => (
          <motion.span
            key={mark.text}
            className="absolute rounded-full border border-white/8 bg-white/[0.035] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E8DDBF]/25"
            style={{ left: mark.left, top: mark.top }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.32 }
                : {
                    y: [0, -12, 0, 10, 0],
                    opacity: [0.18, 0.42, 0.2, 0.34, 0.18],
                  }
            }
            transition={{ duration: 6.5, repeat: Infinity, delay: mark.delay, ease: "easeInOut" }}
          >
            {mark.text}
          </motion.span>
        ))}
      </div>

      <motion.section
        className="relative z-10 w-full max-w-4xl rounded-lg border border-[#DFB15B]/18 bg-[#121017]/88 p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur sm:p-8 lg:p-10"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B] shadow-[0_0_55px_rgba(223,177,91,0.2)]">
          <Compass className="h-11 w-11" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
          <Sparkles className="h-3.5 w-3.5" />
          Page not found
        </div>

        <h1 className="mt-5 font-serif text-5xl font-medium leading-none tracking-wide text-white sm:text-7xl">
          404
        </h1>
        <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-wide text-white sm:text-5xl">
          This path slipped out of the lesson plan.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#A9A3BA] sm:text-base">
          The page you are looking for does not exist, moved, or was typed incorrectly. Choose a known route and keep your preparation moving.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link
            href="/"
            className="group rounded-lg border border-[#DFB15B]/20 bg-[#DFB15B]/10 p-5 text-left transition hover:-translate-y-1 hover:bg-[#DFB15B] hover:text-black"
          >
            <Home className="h-5 w-5 text-[#DFB15B] transition group-hover:text-black" />
            <span className="mt-4 block text-sm font-bold uppercase tracking-wider">Home</span>
            <span className="mt-2 block text-xs leading-5 text-[#8E8A9F] transition group-hover:text-black/70">
              Return to the main landing page.
            </span>
          </Link>

          <Link
            href="/#programs-section"
            className="group rounded-lg border border-white/8 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-[#DFB15B]/30"
          >
            <ArrowRight className="h-5 w-5 text-[#DFB15B]" />
            <span className="mt-4 block text-sm font-bold uppercase tracking-wider text-white">Programs</span>
            <span className="mt-2 block text-xs leading-5 text-[#8E8A9F]">
              Compare the available batches.
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="group rounded-lg border border-white/8 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-[#DFB15B]/30"
          >
            <Compass className="h-5 w-5 text-[#DFB15B]" />
            <span className="mt-4 block text-sm font-bold uppercase tracking-wider text-white">Dashboard</span>
            <span className="mt-2 block text-xs leading-5 text-[#8E8A9F]">
              Continue from your student portal.
            </span>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
