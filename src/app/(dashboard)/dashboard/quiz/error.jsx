"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Brain, Clock3, RefreshCw, ShieldAlert, Sparkles } from "lucide-react";

const RECOVERY_POINTS = [
  "Quiz settings were not submitted",
  "No answer sheet was started",
  "You can safely retry the builder",
];

export default function QuizError({ error, reset }) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative min-h-130 overflow-hidden rounded-3xl border border-red-400/15 bg-[#121017] px-5 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.045)_1px,transparent_1px)] bg-size-[38px_38px]" />
        <div className="absolute -top-24 right-10 h-80 w-80 rounded-full bg-red-500/12 blur-[95px]" />
        <div className="absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-[#DFB15B]/12 blur-[110px]" />
        <motion.div
          className="absolute left-[12%] top-[18%] rounded-full border border-white/8 bg-white/[0.035] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E8DDBF]/25"
          animate={shouldReduceMotion ? { opacity: 0.3 } : { y: [0, -12, 0], opacity: [0.18, 0.42, 0.18] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        >
          Timer
        </motion.div>
        <motion.div
          className="absolute right-[10%] top-[68%] rounded-full border border-white/8 bg-white/[0.035] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E8DDBF]/25"
          animate={shouldReduceMotion ? { opacity: 0.3 } : { y: [0, 10, 0], opacity: [0.16, 0.38, 0.16] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        >
          Difficulty
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 grid min-h-110 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            Quiz builder paused
          </div>

          <h1 className="mt-5 max-w-2xl font-serif text-3xl font-medium leading-tight tracking-wide text-white sm:text-5xl">
            The quiz setup screen needs a clean retry.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#A9A3BA] sm:text-base">
            Something interrupted the quiz route while it was rendering. No quiz attempt has been started, and no score has been recorded.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:brightness-110 active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Quiz
            </button>
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
          <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">Quiz recovery</p>
              <p className="mt-1 text-sm text-[#8E8A9F]">The exam arena has not opened.</p>
            </div>
            <Brain className="h-6 w-6 text-[#DFB15B]" />
          </div>

          <div className="mt-5 grid gap-3">
            {RECOVERY_POINTS.map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.035] px-4 py-3">
                <Sparkles className="h-4 w-4 shrink-0 text-[#DFB15B]" />
                <span className="text-xs font-semibold text-[#A9A3BA]">{point}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-4 py-3">
            <Clock3 className="h-5 w-5 shrink-0 text-[#DFB15B]" />
            <p className="text-xs leading-5 text-[#A9A3BA]">
              Retry the route, then choose your question count, time, and difficulty again.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
