"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, Home, RefreshCw, Sparkles } from "lucide-react";

const GLYPHS = [
  { text: "404?", left: "10%", top: "22%", delay: 0 },
  { text: "x != y", left: "78%", top: "20%", delay: 0.5 },
  { text: "retry()", left: "13%", top: "72%", delay: 1 },
  { text: "IBA", left: "82%", top: "68%", delay: 1.4 },
  { text: "sqrt", left: "45%", top: "12%", delay: 0.8 },
  { text: "log", left: "55%", top: "82%", delay: 1.8 },
];

export default function Error({ error, reset }) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-[#0D0B14] px-4 py-12 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.045)_1px,transparent_1px)] bg-[size:38px_38px]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.16),transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(ellipse_at_bottom,rgba(223,177,91,0.16),transparent_72%)]" />
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED]/10 blur-[130px]" />

        {GLYPHS.map((glyph) => (
          <motion.span
            key={glyph.text}
            className="absolute font-serif text-lg text-[#E8DDBF]/18 sm:text-2xl"
            style={{ left: glyph.left, top: glyph.top }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.22 }
                : {
                    y: [0, -14, 0, 10, 0],
                    rotate: [0, 5, 0, -5, 0],
                    opacity: [0.14, 0.34, 0.2, 0.3, 0.14],
                  }
            }
            transition={{ duration: 7, repeat: Infinity, delay: glyph.delay, ease: "easeInOut" }}
          >
            {glyph.text}
          </motion.span>
        ))}
      </div>

      <motion.section
        className="relative z-10 w-full max-w-3xl rounded-lg border border-red-400/15 bg-[#121017]/88 p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur sm:p-8 lg:p-10"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 text-red-300 shadow-[0_0_45px_rgba(239,68,68,0.18)]">
          <AlertTriangle className="h-9 w-9" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
          <Sparkles className="h-3.5 w-3.5" />
          Spell interrupted
        </div>

        <h1 className="mt-5 font-serif text-3xl font-medium leading-tight tracking-wide text-white sm:text-5xl">
          Something broke in the calculation.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#A9A3BA] sm:text-base">
          The page hit an unexpected error, but your journey is still intact. Try loading it again, or return to a safe path.
        </p>

        {error?.message ? (
          <p className="mx-auto mt-5 max-w-xl rounded-lg border border-white/8 bg-black/20 px-4 py-3 text-left text-xs leading-6 text-[#8E8A9F]">
            {error.message}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:brightness-110 active:scale-[0.98] sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/8 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B] sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Back Home
          </Link>
          <Link
            href="/#programs-section"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black sm:w-auto"
          >
            View Programs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
