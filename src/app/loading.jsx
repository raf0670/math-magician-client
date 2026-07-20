"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpenCheck, Sparkles, WandSparkles } from "lucide-react";

const GLYPHS = [
  { text: "pi", left: "9%", top: "18%", delay: 0, size: "text-xl sm:text-2xl" },
  { text: "SUM", left: "18%", top: "72%", delay: 0.9, size: "text-sm sm:text-lg" },
  { text: "f(x)", left: "78%", top: "17%", delay: 1.3, size: "text-lg sm:text-2xl" },
  { text: "A2", left: "86%", top: "66%", delay: 0.45, size: "text-sm sm:text-xl" },
  { text: "sqrt", left: "35%", top: "11%", delay: 1.8, size: "text-sm sm:text-lg" },
  { text: "IBA", left: "63%", top: "83%", delay: 0.7, size: "text-base sm:text-xl" },
  { text: "log", left: "12%", top: "47%", delay: 1.1, size: "text-sm sm:text-lg" },
  { text: "IQ", left: "90%", top: "39%", delay: 1.55, size: "text-sm sm:text-lg" },
];

const SPARKS = [
  { left: "17%", top: "28%", delay: 0, axis: 12 },
  { left: "26%", top: "61%", delay: 0.65, axis: -10 },
  { left: "43%", top: "22%", delay: 1.15, axis: 14 },
  { left: "58%", top: "74%", delay: 0.35, axis: -12 },
  { left: "73%", top: "31%", delay: 1.5, axis: 10 },
  { left: "82%", top: "57%", delay: 0.9, axis: -14 },
];

const RUNE_MARKS = Array.from({ length: 18 }, (_, index) => ({
  rotate: index * 20,
  height: index % 3 === 0 ? "h-5" : "h-3",
}));

const SKELETON_ROWS = ["w-11/12", "w-8/12", "w-10/12"];

function AnimatedSweep({ shouldReduceMotion }) {
  return (
    <motion.div
      className="absolute -left-1/4 top-1/3 h-16 w-[150%] rotate-[-9deg] bg-linear-to-r from-transparent via-[#DFB15B]/18 to-transparent blur-lg"
      animate={
        shouldReduceMotion
          ? { opacity: 0.28 }
          : { x: ["-14%", "14%", "-14%"], opacity: [0.15, 0.7, 0.15] }
      }
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ShimmerLine({ className, shouldReduceMotion }) {
  return (
    <div className={`relative h-3 overflow-hidden rounded bg-white/[0.055] ${className}`}>
      <motion.span
        className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-[#DFB15B]/30 to-transparent"
        animate={shouldReduceMotion ? { opacity: 0.38 } : { x: ["0%", "320%"] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function MagicalOrbitSpinner({ shouldReduceMotion }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute -inset-3 rounded-full border border-transparent border-r-[#38BDF8]/70 border-t-[#DFB15B] shadow-[0_0_26px_rgba(223,177,91,0.2)]"
      animate={
        shouldReduceMotion
          ? { opacity: 0.7 }
          : { rotate: 360, opacity: [0.72, 1, 0.72] }
      }
      transition={{
        rotate: { duration: 1.25, repeat: Infinity, ease: "linear" },
        opacity: { duration: 1.25, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full bg-[#DFB15B] shadow-[0_0_18px_rgba(223,177,91,0.95)]" />
      <span className="absolute bottom-2 left-4 h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_14px_rgba(56,189,248,0.85)]" />
    </motion.span>
  );
}

export default function Loading() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading MathMagician's School"
      className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-[#0D0B14] px-4 py-10 text-white sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.045)_1px,transparent_1px)] bg-[size:38px_38px]" />
        <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.2),transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.14),transparent_72%)]" />
        <AnimatedSweep shouldReduceMotion={shouldReduceMotion} />

        {GLYPHS.map((glyph) => (
          <motion.span
            key={glyph.text}
            className={`absolute font-serif text-[#E8DDBF]/18 ${glyph.size}`}
            style={{ left: glyph.left, top: glyph.top }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.22 }
                : {
                    y: [0, -16, 0, 12, 0],
                    rotate: [0, 5, 0, -5, 0],
                    opacity: [0.16, 0.34, 0.2, 0.3, 0.16],
                  }
            }
            transition={{
              duration: 7,
              repeat: Infinity,
              delay: glyph.delay,
              ease: "easeInOut",
            }}
          >
            {glyph.text}
          </motion.span>
        ))}

        {SPARKS.map((spark, index) => (
          <motion.span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#DFB15B] shadow-[0_0_16px_rgba(223,177,91,0.85)]"
            style={{ left: spark.left, top: spark.top }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.45 }
                : {
                    x: [0, spark.axis, 0],
                    y: [0, -12, 7, 0],
                    scale: [0.75, 1.35, 0.9, 0.75],
                    opacity: [0.2, 0.95, 0.35, 0.2],
                  }
            }
            transition={{
              duration: 3.4,
              repeat: Infinity,
              delay: spark.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.section
        className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
          <motion.div
            className="absolute inset-0 rounded-full border border-[#DFB15B]/20 shadow-[0_0_60px_rgba(223,177,91,0.1)]"
            animate={shouldReduceMotion ? { opacity: 0.55 } : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-dashed border-[#38BDF8]/25"
            animate={shouldReduceMotion ? { opacity: 0.45 } : { rotate: -360 }}
            transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-9 rounded-full border border-[#7C3AED]/30 bg-[#121017]/80 shadow-[0_0_70px_rgba(124,58,237,0.22)]"
            animate={shouldReduceMotion ? { scale: 1 } : { scale: [0.98, 1.04, 0.98] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {RUNE_MARKS.map((mark, index) => (
            <span
              key={index}
              className={`absolute top-2 w-px origin-[50%_96px] rounded bg-[#DFB15B]/40 ${mark.height} sm:origin-[50%_112px]`}
              style={{ transform: `rotate(${mark.rotate}deg)` }}
            />
          ))}

          <motion.div
            className="absolute right-7 top-9 flex h-10 w-10 items-center justify-center rounded-full border border-[#DFB15B]/25 bg-[#DFB15B]/10 text-[#DFB15B] shadow-[0_0_28px_rgba(223,177,91,0.22)] sm:right-9 sm:top-10"
            animate={shouldReduceMotion ? { opacity: 0.8 } : { y: [0, -7, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <WandSparkles className="h-5 w-5" />
          </motion.div>

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#4C1D95] via-[#6947cc] to-[#D4AF37] p-px shadow-[0_0_46px_rgba(223,177,91,0.28)]">
            <MagicalOrbitSpinner shouldReduceMotion={shouldReduceMotion} />
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#111015]">
              <span className="font-serif text-5xl font-bold text-[#DFB15B]">M</span>
            </div>
          </div>

          <motion.div
            className="absolute bottom-9 left-8 flex h-8 w-8 items-center justify-center rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-sky-300 sm:left-10"
            animate={shouldReduceMotion ? { opacity: 0.7 } : { y: [0, 6, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
        </div>

        <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1.5 text-[10px] font-bold uppercase text-[#DFB15B]">
          <BookOpenCheck className="h-3.5 w-3.5" />
          Loading
        </div>

        <h1 className="mt-4 max-w-2xl font-serif text-3xl font-medium leading-tight text-white sm:text-5xl">
          MathMagician&apos;s School
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#A9A3BA] sm:text-base">
          Preparing your learning portal with a little calculation and a lot of magic.
        </p>

        <div className="mt-8 w-full max-w-lg rounded-lg border border-white/8 bg-[#121017]/80 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="mb-4 flex items-center justify-between gap-3 text-xs text-[#8E8A9F]">
            <span>Calibrating lessons</span>
            <span className="text-[#DFB15B]">Almost ready</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.055]">
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#38BDF8]"
              animate={shouldReduceMotion ? { width: "72%" } : { width: ["18%", "72%", "42%", "88%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {SKELETON_ROWS.map((width, index) => (
              <div key={width} className="rounded-lg border border-white/6 bg-white/[0.025] p-3">
                <ShimmerLine className="h-7 w-7" shouldReduceMotion={shouldReduceMotion} />
                <ShimmerLine className={`mt-4 ${width}`} shouldReduceMotion={shouldReduceMotion} />
                <ShimmerLine className="mt-2 w-7/12" shouldReduceMotion={shouldReduceMotion} />
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
