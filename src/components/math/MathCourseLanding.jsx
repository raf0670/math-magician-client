"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Brain,
  CheckCircle2,
  Flame,
  Layers,
  LineChart,
  Radio,
  Sigma,
  Sparkles,
  Trophy,
  WandSparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    count: "12",
    title: "Basic Recorded Classes",
    icon: BookOpen,
    description: "Learn math from the very basic and build your foundation properly. Know how math works.",
  },
  {
    count: "12",
    title: "Archive Classes",
    icon: Layers,
    description: "Build a layer on top of the foundation. After doing the basic class, do the archive class.",
  },
  {
    count: "12",
    title: "Live Special Classes",
    icon: Radio,
    description: "Ready for a new challenge? Join the live classes and learn how to approach difficult math smartly and efficiently.",
  },
  {
    count: "12",
    title: "Daily Math Mocks",
    icon: Sigma,
    description: "Put your learning into practice with exams exclusively for the math course.",
  },
  {
    count: "03",
    title: "Online Full-Length Math Exams",
    icon: Trophy,
    description: "Bring everything together in three full-length math papers.",
  },
];

const pathSteps = [
  {
    label: "Foundation",
    title: "Build the base",
    description: "Start from the basic recordings and understand the logic before speed becomes the target.",
    icon: Brain,
  },
  {
    label: "Layer",
    title: "Add archived depth",
    description: "Use archive classes to stack methods, patterns, and exam-style thinking over the base.",
    icon: Layers,
  },
  {
    label: "Challenge",
    title: "Solve live",
    description: "Live special classes push harder questions with smarter approaches and sharper pacing.",
    icon: Radio,
  },
  {
    label: "Compete",
    title: "Test the batch",
    description: "Daily mocks and full-length math exams turn practice into visible progress.",
    icon: Trophy,
  },
];

const benefits = [
  { value: "39", label: "Class touchpoints", detail: "Recorded, archive, and live special classes", icon: Flame },
  { value: "15", label: "Math exams", detail: "12 daily mocks plus 3 online full-length papers", icon: LineChart },
  { value: "25%", label: "House discount", detail: "For approved Gryffindor, Hufflepuff, and Ravenclaw students", icon: BadgeCheck },
];

const slytherinPerks = [
  "Regular live classes, recordings, and resources",
  "Practice, quizzes, assignments, and exams",
  "Full leaderboard with Slytherin house positions",
  "Separate math leaderboard for math-course exams",
];

const glyphs = [
  { text: "sum", className: "left-[7%] top-[18%]", size: "text-5xl", delay: 0 },
  { text: "pi", className: "left-[17%] top-[62%]", size: "text-4xl", delay: -2.2 },
  { text: "sqrt", className: "left-[82%] top-[20%]", size: "text-5xl", delay: -4.5 },
  { text: "f(x)", className: "left-[73%] top-[68%]", size: "text-3xl", delay: -1.4 },
  { text: "x+y", className: "left-[44%] top-[13%]", size: "text-3xl", delay: -3.1 },
  { text: "log", className: "left-[88%] top-[45%]", size: "text-4xl", delay: -5.7 },
  { text: "A^2", className: "left-[9%] top-[42%]", size: "text-3xl", delay: -6.3 },
  { text: "delta", className: "left-[55%] top-[82%]", size: "text-4xl", delay: -1.9 },
];

const formulas = [
  "Speed = accuracy / panic",
  "Foundation -> pattern -> timing",
  "12 mocks + 3 papers",
  "Rank up with every exam",
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

function PrimaryCta({ className = "" }) {
  return (
    <Link
      href="/payment/details?plan=math"
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#DFB15B] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_22px_55px_rgba(223,177,91,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_24px_70px_rgba(52,211,153,0.26)] ${className}`}
    >
      <span className="absolute inset-y-0 -left-1/2 w-1/3 rotate-12 bg-white/45 blur-md transition duration-700 group-hover:left-[120%]" />
      <span className="relative">Enroll in Math</span>
      <ArrowUpRight className="relative h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export default function MathCourseLanding() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ["start start", "end end"] });
  const heroLift = useTransform(scrollYProgress, [0, 0.35], [0, -120]);
  const glyphLift = useTransform(scrollYProgress, [0, 0.45], [0, 170]);
  const glowDrift = useTransform(scrollYProgress, [0, 1], [0, 280]);

  const orbitDots = useMemo(
    () => Array.from({ length: 16 }).map((_, index) => ({ id: index, angle: index * 22.5, delay: index * 0.08 })),
    []
  );

  function handleMouseMove(event) {
    if (shouldReduceMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMouse({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 30,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 30,
    });
  }

  return (
    <main ref={pageRef} className="relative overflow-hidden bg-[#08070C] pb-28 pt-24 text-white sm:pb-24 sm:pt-28">
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : glowDrift }}
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-emerald-400/12 blur-[140px]"
      />
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : heroLift }}
        className="pointer-events-none absolute right-[-12rem] top-40 h-[34rem] w-[34rem] rounded-full bg-[#DFB15B]/10 blur-[130px]"
      />
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : glyphLift }}
        className="pointer-events-none absolute bottom-32 left-[-14rem] h-[34rem] w-[34rem] rounded-full bg-emerald-600/12 blur-[120px]"
      />

      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-center px-5 py-12 sm:px-8 lg:px-10"
      >
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:54px_54px]" />
        {!shouldReduceMotion && (
          <motion.div style={{ y: glyphLift }} className="pointer-events-none absolute inset-0 overflow-hidden">
            {glyphs.map((glyph) => (
              <motion.span
                key={glyph.text}
                className={`absolute ${glyph.className} ${glyph.size} font-serif font-bold text-emerald-100/10`}
                animate={{ y: [0, -22, 0, 18, 0], x: [0, 10, -8, 0], rotate: [0, 5, -4, 0] }}
                transition={{ duration: 10, delay: glyph.delay, repeat: Infinity, ease: "easeInOut" }}
              >
                {glyph.text}
              </motion.span>
            ))}
          </motion.div>
        )}

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-7 inline-flex flex-wrap items-center gap-3">
              <motion.span
                animate={shouldReduceMotion ? undefined : { boxShadow: ["0 0 0 rgba(52,211,153,0)", "0 0 34px rgba(52,211,153,0.34)", "0 0 0 rgba(52,211,153,0)"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/12 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-100"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
                New Batch
              </motion.span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/25 bg-[#DFB15B]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F3D89A]">
                <Sparkles className="h-3.5 w-3.5" />
                The Math Course
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-[0.98] text-white sm:text-6xl lg:text-8xl">
              Understand the basics.
              <span className="mt-2 block bg-linear-to-r from-emerald-200 via-[#DFB15B] to-emerald-300 bg-clip-text text-transparent">
                Take on the difficult.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#B9B3C8] sm:text-lg">
              A dedicated math course that takes you from a strong foundation to smarter problem solving. Learn, practice, and compete with your math batch.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <PrimaryCta className="w-full sm:w-auto" />
              <a
                href="#slytherin"
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-300/25 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-200/60 hover:bg-emerald-300/10 sm:w-auto"
              >
                Explore Slytherin <ArrowDown className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {benefits.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.045] p-4 backdrop-blur">
                  <item.icon className="h-4 w-4 text-[#DFB15B]" />
                  <p className="mt-3 font-serif text-3xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100">{item.label}</p>
                  <p className="mt-2 text-xs leading-5 text-[#9B95AA]">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: shouldReduceMotion ? 0 : mouse.x, y: shouldReduceMotion ? 0 : mouse.y }}
            className="relative mx-auto w-full max-w-[33rem]"
          >
            <div className="absolute inset-8 rounded-full border border-emerald-300/15" />
            <div className="absolute inset-16 rounded-full border border-[#DFB15B]/15" />
            {!shouldReduceMotion &&
              orbitDots.map((dot) => (
                <motion.span
                  key={dot.id}
                  className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.9)]"
                  style={{ transformOrigin: "0 0", rotate: dot.angle }}
                  animate={{ x: [0, 190, 0], opacity: [0.15, 0.9, 0.15] }}
                  transition={{ duration: 5.5, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            <div className="relative overflow-hidden rounded-[2rem] border border-emerald-300/25 bg-[#111018]/85 p-5 shadow-[0_30px_110px_rgba(16,185,129,0.18)] backdrop-blur-xl">
              <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/80 to-transparent" />
              <div className="rounded-[1.5rem] border border-white/8 bg-[#07070C] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">Batch Console</p>
                    <p className="mt-2 font-serif text-3xl text-white">Math Course</p>
                  </div>
                  <div className="rounded-2xl border border-[#DFB15B]/25 bg-[#DFB15B]/10 px-4 py-3 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F3D89A]">Payable</p>
                    <p className="text-xl font-black text-[#DFB15B]">BDT 5,999</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {formulas.map((formula, index) => (
                    <motion.div
                      key={formula}
                      animate={shouldReduceMotion ? undefined : { opacity: [0.72, 1, 0.72] }}
                      transition={{ duration: 2.5, delay: index * 0.22, repeat: Infinity, ease: "easeInOut" }}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.045] px-4 py-3"
                    >
                      <span className="text-sm font-semibold text-[#D8D4E2]">{formula}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/8 p-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
                    <span>Foundation</span>
                    <span>Difficult</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full rounded-full bg-linear-to-r from-emerald-300 via-[#DFB15B] to-emerald-200"
                      initial={{ width: "18%" }}
                      animate={{ width: shouldReduceMotion ? "88%" : ["18%", "88%", "62%", "88%"] }}
                      transition={{ duration: 4.5, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10" aria-label="What the math course includes">
        <motion.div {...fadeUp()} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-200">Everything inside</p>
          <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl">A complete math track, not a loose collection of classes.</h2>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ count, title, description, icon: Icon }, index) => (
            <motion.article
              key={title}
              {...fadeUp(index * 0.05)}
              className="group relative overflow-hidden rounded-3xl border border-white/8 bg-[#121017]/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:border-emerald-300/35 hover:bg-[#16141E]"
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-300/10 blur-2xl transition group-hover:bg-[#DFB15B]/15" />
              <div className="relative flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-serif text-4xl font-bold text-[#DFB15B]">{count}</span>
              </div>
              <h3 className="relative mt-6 text-lg font-bold text-white">{title}</h3>
              <p className="relative mt-3 text-sm leading-7 text-[#AAA5B8]">{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div {...fadeUp()} className="rounded-3xl border border-[#DFB15B]/25 bg-[#DFB15B]/8 p-7 shadow-[0_24px_80px_rgba(223,177,91,0.09)] sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F3D89A]">Existing house student</p>
            <h2 className="mt-4 font-serif text-4xl text-white">Already in a house?</h2>
            <p className="mt-4 text-sm leading-7 text-[#BDB7CA]">
              Approved Gryffindor, Hufflepuff, and Ravenclaw students receive 25% off Math. Keep your existing house and website access.
            </p>
            <div className="mt-6 flex flex-wrap items-end gap-3">
              <p className="font-serif text-4xl font-black text-[#DFB15B]">BDT 4,499.25</p>
              <p className="pb-1 text-sm font-semibold text-[#9E98AA]">with eligible discount</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.08)} className="rounded-3xl border border-emerald-300/18 bg-[#0E1613]/80 p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-100">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">Learning path</p>
                <h2 className="font-serif text-3xl text-white">From foundation to fight-ready.</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {pathSteps.map((step, index) => (
                <div key={step.title} className="relative rounded-2xl border border-white/8 bg-white/[0.045] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <step.icon className="h-5 w-5 text-emerald-200" />
                    <span className="text-xs font-black text-[#DFB15B]">0{index + 1}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">{step.label}</p>
                  <h3 className="mt-2 text-base font-bold text-white">{step.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-[#AFA9BC]">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="slytherin" className="relative mx-auto max-w-7xl scroll-mt-28 px-5 py-14 sm:px-8 lg:px-10">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-[2rem] border border-emerald-300/25 bg-[#07120F] p-6 shadow-[0_35px_120px_rgba(16,185,129,0.14)] sm:p-9 lg:p-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(223,177,91,0.15),transparent_30%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-5 rounded-[2rem] bg-emerald-300/10 blur-2xl" />
              <Image
                src="/slytherin.jpg"
                alt="Slytherin house crest"
                width={520}
                height={620}
                className="relative aspect-[4/5] w-full rounded-[1.75rem] border border-emerald-300/20 object-cover shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
                priority={false}
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-100">
                <WandSparkles className="h-3.5 w-3.5" />
                Optional next step
              </div>
              <h2 className="mt-5 font-serif text-4xl text-white sm:text-6xl">Math + Slytherin</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#BBBFC0]">
                Everything in the Math Course, plus full access to the website enjoyed by approved students in the other three houses: regular live classes, recordings, resources, practice, quizzes, assignments, exams, and the full leaderboard with house positions.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#BBBFC0]">
                Your regular exams contribute to Slytherin. Math-course exams have their own leaderboard and never contribute to house points.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {slytherinPerks.map((perk) => (
                  <div key={perk} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.045] p-4">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span className="text-sm leading-6 text-[#D8D4E2]">{perk}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-[#DFB15B]/20 bg-[#DFB15B]/8 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3D89A]">Bundle price</p>
                  <p className="mt-2 font-serif text-4xl font-black text-emerald-100">BDT 11,998</p>
                  <p className="mt-1 text-sm text-[#BBBFC0]">BDT 5,999 for Math + BDT 5,999 for Slytherin</p>
                </div>
                <Link
                  href="/payment/details?plan=mathSlytherin"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-300 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:-translate-y-0.5 hover:bg-[#DFB15B]"
                >
                  Enroll in Math + Slytherin <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-4 text-xs leading-6 text-[#BBBFC0]">You can also start with Math and add Slytherin later for BDT 5,999.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
        <PrimaryCta className="w-full shadow-[0_14px_45px_rgba(0,0,0,0.45)]" />
      </div>
    </main>
  );
}
