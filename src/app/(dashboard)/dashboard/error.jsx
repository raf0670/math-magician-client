"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, ArrowRight, BarChart3, RefreshCw, ShieldAlert, Sparkles } from "lucide-react";

const FLOATING_MARKS = [
  { text: "Stats", left: "8%", top: "18%", delay: 0 },
  { text: "Rank", left: "82%", top: "20%", delay: 0.45 },
  { text: "Plan", left: "11%", top: "74%", delay: 0.9 },
  { text: "IBA", left: "78%", top: "70%", delay: 1.25 },
];

export default function DashboardError({ error, reset }) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative min-h-130 overflow-hidden rounded-3xl border border-red-400/15 bg-[#121017] px-5 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.045)_1px,transparent_1px)] bg-size-[34px_34px]" />
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-red-500/12 blur-[95px]" />
        <div className="absolute -bottom-28 right-8 h-96 w-96 rounded-full bg-[#DFB15B]/12 blur-[110px]" />
        <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-[#DFB15B]/10" />

        {FLOATING_MARKS.map((mark) => (
          <motion.span
            key={mark.text}
            className="absolute rounded-full border border-white/8 bg-white/[0.035] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E8DDBF]/25"
            style={{ left: mark.left, top: mark.top }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.28 }
                : { y: [0, -12, 0, 9, 0], opacity: [0.16, 0.38, 0.22, 0.32, 0.16] }
            }
            transition={{ duration: 6, repeat: Infinity, delay: mark.delay, ease: "easeInOut" }}
          >
            {mark.text}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="relative z-10 flex min-h-110 flex-col justify-center"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-300">
              <ShieldAlert className="h-3.5 w-3.5" />
              Dashboard recalibration needed
            </div>

            <h1 className="mt-5 max-w-2xl font-serif text-3xl font-medium leading-tight tracking-wide text-white sm:text-5xl">
              Your command center paused mid-update.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#A9A3BA] sm:text-base">
              We could not refresh the dashboard panels right now. Your progress is still safe; try again to reload the latest student data.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:brightness-110 active:scale-[0.98]"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/dashboard/mock-tests"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black"
              >
                Open Mock Tests
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/20 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">Recovery panel</p>
                <p className="mt-1 text-sm text-[#8E8A9F]">No student data was changed.</p>
              </div>
              <Activity className="h-6 w-6 text-[#DFB15B]" />
            </div>

            <div className="mt-5 grid gap-3">
              {[
                ["Profile", "Stored safely"],
                ["Classes", "Access preserved"],
                ["Analytics", "Ready to retry"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.035] px-4 py-3">
                  <span className="text-xs font-semibold text-[#A9A3BA]">{label}</span>
                  <span className="text-xs font-bold text-white">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#DFB15B]/15 bg-[#DFB15B]/8 px-4 py-3">
              <BarChart3 className="h-5 w-5 shrink-0 text-[#DFB15B]" />
              <p className="text-xs leading-5 text-[#A9A3BA]">
                A quick retry usually restores the dashboard if the server or network briefly blinked.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
