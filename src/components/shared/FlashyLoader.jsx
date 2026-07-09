"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Gauge,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

const PARTICLES = [
  { left: "12%", top: "18%", delay: 0, size: "h-1.5 w-1.5" },
  { left: "22%", top: "72%", delay: 0.7, size: "h-1 w-1" },
  { left: "76%", top: "20%", delay: 1.1, size: "h-1.5 w-1.5" },
  { left: "88%", top: "58%", delay: 0.35, size: "h-1 w-1" },
  { left: "52%", top: "12%", delay: 1.45, size: "h-1 w-1" },
  { left: "64%", top: "82%", delay: 0.9, size: "h-1.5 w-1.5" },
];

const SKELETONS = {
  analytics: [64, 92, 76, 88],
  cards: [90, 72, 84, 66],
  dashboard: [82, 96, 70],
  exam: [94, 88, 78, 86],
  topics: [74, 92, 64],
};

function LoaderIcon({ iconName, className = "" }) {
  switch (iconName) {
    case "analytics":
      return <BarChart3 className={className} />;
    case "book":
      return <BookOpen className={className} />;
    case "brain":
      return <Brain className={className} />;
    case "check":
      return <CheckCircle2 className={className} />;
    case "clipboard":
      return <ClipboardCheck className={className} />;
    case "credit":
      return <CreditCard className={className} />;
    case "dashboard":
      return <Gauge className={className} />;
    case "lock":
      return <LockKeyhole className={className} />;
    case "login":
      return <LogIn className={className} />;
    case "wand":
      return <WandSparkles className={className} />;
    case "zap":
      return <Zap className={className} />;
    case "sparkles":
    default:
      return <Sparkles className={className} />;
  }
}

function ShimmerBlock({ width = "100%", className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.035] ${className}`}
      style={{ width }}
    >
      <motion.span
        className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-[#DFB15B]/18 to-transparent"
        animate={shouldReduceMotion ? { opacity: 0.4 } : { x: ["0%", "320%"] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function SkeletonPreview({ type = "cards" }) {
  const widths = SKELETONS[type] || SKELETONS.cards;

  if (type === "analytics") {
    return (
      <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {widths.map((width, index) => (
          <div key={index} className="rounded-2xl border border-white/5 bg-[#17131F]/65 p-3">
            <ShimmerBlock className="h-8 w-8" />
            <ShimmerBlock width={`${width}%`} className="mt-4 h-3" />
            <ShimmerBlock width="48%" className="mt-2 h-5" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "exam") {
    return (
      <div className="mt-6 w-full rounded-2xl border border-white/5 bg-[#17131F]/65 p-4">
        <ShimmerBlock className="h-4" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {widths.map((width, index) => (
            <ShimmerBlock key={index} width={`${width}%`} className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
      {widths.map((width, index) => (
        <div key={index} className="rounded-2xl border border-white/5 bg-[#17131F]/65 p-4">
          <ShimmerBlock width={`${width}%`} className="h-4" />
          <ShimmerBlock width="54%" className="mt-3 h-3" />
        </div>
      ))}
    </div>
  );
}

export default function FlashyLoader({
  eyebrow = "Loading",
  title = "Preparing your workspace",
  message = "A few details are being tuned behind the curtain.",
  iconName = "sparkles",
  skeleton = "cards",
  surface = "panel",
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();
  const isScreen = surface === "screen";
  const wrapperClass = isScreen
    ? "min-h-screen rounded-none border-0"
    : "min-h-[280px] rounded-3xl border border-[#DFB15B]/15";

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-[#0F0D15] px-4 py-10 text-white shadow-[0_24px_90px_rgba(0,0,0,0.38)] ${wrapperClass} ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.2),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.13),transparent_70%)]" />
        <motion.div
          className="absolute -left-32 top-1/4 h-20 w-[150%] rotate-[-10deg] bg-linear-to-r from-transparent via-[#DFB15B]/22 to-transparent blur-xl"
          animate={shouldReduceMotion ? { opacity: 0.3 } : { x: ["-18%", "18%", "-18%"], opacity: [0.2, 0.75, 0.2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {PARTICLES.map((particle, index) => (
          <motion.span
            key={index}
            className={`absolute rounded-full bg-[#DFB15B] shadow-[0_0_18px_rgba(223,177,91,0.85)] ${particle.size}`}
            style={{ left: particle.left, top: particle.top }}
            animate={shouldReduceMotion ? { opacity: 0.45 } : { y: [0, -14, 8, 0], opacity: [0.18, 0.9, 0.3, 0.18], scale: [0.8, 1.3, 0.95, 0.8] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border border-[#DFB15B]/20"
            animate={shouldReduceMotion ? { opacity: 0.45 } : { rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border border-dashed border-[#38BDF8]/25"
            animate={shouldReduceMotion ? { opacity: 0.4 } : { rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-5 rounded-full bg-[#DFB15B]/12 shadow-[0_0_38px_rgba(223,177,91,0.28)]"
            animate={shouldReduceMotion ? { scale: 1 } : { scale: [0.94, 1.08, 0.94] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <LoaderIcon iconName={iconName} className="relative h-8 w-8 text-[#DFB15B] drop-shadow-[0_0_16px_rgba(223,177,91,0.7)]" />
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#DFB15B]">{eyebrow}</p>
        <h2 className="mt-2 max-w-xl font-serif text-2xl font-medium leading-tight text-white sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#A9A3BA]">{message}</p>
        {skeleton ? <SkeletonPreview type={skeleton} /> : null}
      </div>
    </div>
  );
}

export function InlineFlashyLoader({
  text = "Loading...",
  iconName = "sparkles",
  rows = 2,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#121017] p-4 ${className}`}>
      <motion.span
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B] to-transparent"
        animate={shouldReduceMotion ? { opacity: 0.5 } : { x: ["-100%", "100%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
      <div className="flex items-center gap-3">
        <motion.span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B]"
          animate={shouldReduceMotion ? { scale: 1 } : { scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <LoaderIcon iconName={iconName} className="h-4 w-4" />
        </motion.span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{text}</p>
          <div className="mt-3 space-y-2">
            {Array.from({ length: rows }).map((_, index) => (
              <ShimmerBlock key={index} width={index % 2 ? "58%" : "86%"} className="h-2.5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingButtonLabel({
  loading = false,
  idleText,
  loadingText,
  iconName = "sparkles",
}) {
  if (!loading) {
    return (
      <>
        <LoaderIcon iconName={iconName} className="h-4 w-4" />
        {idleText}
      </>
    );
  }

  return (
    <>
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        className="flex h-4 w-4 items-center justify-center"
      >
        <LoaderCircle className="h-4 w-4" />
      </motion.span>
      {loadingText}
    </>
  );
}
