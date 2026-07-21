"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BarChart3, BookOpenCheck, Compass, Home, Search } from "lucide-react";

const ROUTE_MARKS = [
  { text: "Profile", left: "8%", top: "19%", delay: 0 },
  { text: "Classes", left: "80%", top: "18%", delay: 0.35 },
  { text: "Mocks", left: "11%", top: "74%", delay: 0.8 },
  { text: "Analytics", left: "74%", top: "72%", delay: 1.2 },
];

export default function DashboardNotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-130 overflow-hidden rounded-3xl border border-[#DFB15B]/18 bg-[#121017] px-5 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.035)_1px,transparent_1px)] bg-size-[36px_36px]" />
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#DFB15B]/14 blur-[95px]" />
        <div className="absolute -bottom-28 right-8 h-96 w-96 rounded-full bg-[#7C3AED]/12 blur-[110px]" />

        {ROUTE_MARKS.map((mark) => (
          <motion.span
            key={mark.text}
            className="absolute rounded-full border border-white/8 bg-white/[0.035] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E8DDBF]/25"
            style={{ left: mark.left, top: mark.top }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.3 }
                : { y: [0, -12, 0, 9, 0], opacity: [0.18, 0.42, 0.22, 0.34, 0.18] }
            }
            transition={{ duration: 6.2, repeat: Infinity, delay: mark.delay, ease: "easeInOut" }}
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
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]">
              <Compass className="h-3.5 w-3.5" />
              Dashboard route not found
            </div>

            <h1 className="mt-5 max-w-2xl font-serif text-3xl font-medium leading-tight tracking-wide text-white sm:text-5xl">
              This dashboard path is off the map.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#A9A3BA] sm:text-base">
              The section you tried to open does not exist or has moved. Choose a known dashboard area and keep your preparation moving.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:brightness-110 active:scale-[0.98]"
              >
                <Home className="h-4 w-4" />
                Dashboard Home
              </Link>
              <Link
                href="/dashboard/mock-tests"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black"
              >
                Browse Practice
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { href: "/dashboard/archived-classes", label: "Archived Classes", text: "Open class materials", icon: BookOpenCheck },
              { href: "/dashboard/analytics", label: "Analytics", text: "Review performance", icon: BarChart3 },
              { href: "/dashboard/profile", label: "Profile", text: "Check your account", icon: Search },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-white/8 bg-black/20 p-5 text-left backdrop-blur transition hover:-translate-y-1 hover:border-[#DFB15B]/30"
              >
                <item.icon className="h-5 w-5 text-[#DFB15B]" />
                <span className="mt-4 block text-sm font-bold uppercase tracking-wider text-white">{item.label}</span>
                <span className="mt-2 block text-xs leading-5 text-[#8E8A9F]">{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
