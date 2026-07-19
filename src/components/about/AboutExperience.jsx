"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenCheck, ClipboardCheck, GraduationCap, MessageCircle, Sparkles, Target, Users } from "lucide-react";
import Footer from "@/components/shared/Footer";

const instructor = {
  name: "Mehrabur Rahaman",
  portrait: "https://i.ibb.co.com/tM2pbsr2/f39e5b4b-432e-4c5c-8626-46ca7d6d6cc7.jpg",
  message:
    "Hello good soul. This is your instructor Mehrab. To be honest, I can never make sure you get into IBA but surely enough I can make your path easier and smooth. I have already guided many aspirants in the same path who now go to the same campus as me. Join me in this journey, we'll share campus soon too.",
  credentials: [
    { text: "IBA DU 8th", icon: GraduationCap },
    { text: "BUP FBS 11th", icon: Target },
    { text: "2+ Years Teaching", icon: BookOpenCheck },
    { text: "1,200+ Students Mentored", icon: Users },
  ],
};

const approachItems = [
  {
    title: "Strategy before volume",
    text: "Students learn how to recognize patterns, choose the right method quickly, and avoid wasting time on brute force solving.",
    icon: Target,
    tone: "text-[#DFB15B] bg-[#DFB15B]/10 border-[#DFB15B]/20",
  },
  {
    title: "Practice with feedback",
    text: "Mock performance, weak-area tracking, and review sessions help students understand why they missed a question, not only what the answer was.",
    icon: ClipboardCheck,
    tone: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    title: "Calm exam mindset",
    text: "The preparation system is built to reduce fear, keep momentum steady, and make the IBA path feel structured instead of overwhelming.",
    icon: MessageCircle,
    tone: "text-sky-300 bg-sky-400/10 border-sky-400/20",
  },
];

const guidanceSteps = [
  "Build a clear foundation in Math, English, Analytical Ability, and Written.",
  "Practice under realistic pressure with targeted mocks and topic tests.",
  "Review mistakes deeply so every weak area becomes a repeatable plan.",
  "Stay accountable with guidance from someone who has walked the same admission path.",
];

const glyphs = [
  { char: "IBA", left: "8%", top: "14%", delay: 0, duration: 13 },
  { char: "GMAT", left: "82%", top: "18%", delay: 1.4, duration: 15 },
  { char: "Σ", left: "12%", top: "68%", delay: 0.6, duration: 16 },
  { char: "√", left: "72%", top: "72%", delay: 2.1, duration: 14 },
  { char: "f(x)", left: "45%", top: "10%", delay: 1.1, duration: 17 },
  { char: "IQ", left: "91%", top: "52%", delay: 0.2, duration: 18 },
];

const rays = [
  { top: "16%", rotate: "-10deg", delay: 0 },
  { top: "42%", rotate: "7deg", delay: 1.6 },
  { top: "70%", rotate: "-5deg", delay: 3.1 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AboutExperience() {
  return (
    <main className="min-h-screen bg-[#0D0B14] text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.14),transparent_68%)]" />

        {rays.map((ray) => (
          <motion.div
            key={ray.top}
            className="pointer-events-none absolute -left-1/3 h-24 w-[150vw] bg-linear-to-r from-transparent via-[#DFB15B]/16 to-transparent blur-xl"
            style={{ top: ray.top, rotate: ray.rotate }}
            animate={{ x: ["-12%", "12%", "-12%"], opacity: [0.18, 0.62, 0.18] }}
            transition={{ duration: 12, repeat: Infinity, delay: ray.delay, ease: "easeInOut" }}
          />
        ))}

        {glyphs.map((glyph) => (
          <motion.span
            key={glyph.char}
            className="pointer-events-none absolute font-serif text-2xl font-semibold text-[#DFB15B]/30"
            style={{ left: glyph.left, top: glyph.top }}
            animate={{ y: [0, -18, 10, 0], opacity: [0.16, 0.52, 0.2, 0.16], rotate: [0, 8, -5, 0] }}
            transition={{ duration: glyph.duration, repeat: Infinity, delay: glyph.delay, ease: "easeInOut" }}
          >
            {glyph.char}
          </motion.span>
        ))}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-14 sm:px-8 lg:grid-cols-12 lg:px-10 lg:py-16"
        >
          <div className="order-2 lg:order-1 lg:col-span-7">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
              <Sparkles className="h-3.5 w-3.5" />
              Your Instructor
            </motion.div>

            <motion.h1 variants={itemVariants} className="mt-5 max-w-3xl font-serif text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">
              Learn IBA prep with <span className="text-[#DFB15B]">{instructor.name}</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-5 max-w-2xl text-sm font-medium leading-7 text-[#A9A3BA] sm:text-base">
              {instructor.message}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
              {instructor.credentials.map((item, index) => (
                <motion.div
                  key={item.text}
                  whileHover={{ y: -3, borderColor: "rgba(223,177,91,0.4)" }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/6 bg-[#121017] px-4 py-2 text-xs font-semibold text-[#D8D4E5]"
                  transition={{ delay: index * 0.04 }}
                >
                  <item.icon className="h-4 w-4 text-[#DFB15B]" />
                  {item.text}
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#programs-section"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
              >
                Explore Programs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#DFB15B]/35 hover:text-[#DFB15B]"
              >
                Create Account
              </Link>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="order-1 flex justify-center lg:order-2 lg:col-span-5">
            <motion.div
              className="relative w-full max-w-[360px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute -inset-3 rounded-[1.4rem] border border-[#DFB15B]/20"
                animate={{ rotate: [0, 1.5, -1.5, 0], opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-[#DFB15B]/24 bg-[#121017] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
                <div className="relative h-full overflow-hidden rounded-xl bg-[#16131C]">
                  <Image
                    src={instructor.portrait}
                    alt={`${instructor.name} portrait`}
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 1024px) 360px, 86vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
              <motion.div
                className="absolute -bottom-5 left-5 right-5 rounded-xl border border-white/8 bg-[#121017]/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur"
                animate={{ boxShadow: ["0 16px 40px rgba(0,0,0,0.35)", "0 18px 48px rgba(223,177,91,0.12)", "0 16px 40px rgba(0,0,0,0.35)"] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">Guided Path</p>
                <p className="mt-1 text-sm font-semibold text-white">From preparation chaos to focused practice.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-[#100E16] px-6 py-18 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={containerVariants} className="max-w-2xl">
            <motion.p variants={itemVariants} className="text-xs font-bold uppercase tracking-[0.24em] text-[#DFB15B]">Teaching Approach</motion.p>
            <motion.h2 variants={itemVariants} className="mt-3 font-serif text-3xl font-medium text-white sm:text-4xl">The method is practical, honest, and exam-facing.</motion.h2>
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {approachItems.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, borderColor: "rgba(223,177,91,0.22)" }}
                className="rounded-xl border border-white/6 bg-[#15121D] p-5"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[#8E8A9F]">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0D0B14] px-6 py-18 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#DFB15B]">Student Guidance</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-white sm:text-4xl">A smoother path does not mean an easier exam.</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-[#8E8A9F]">
              The goal is to make every student more deliberate: sharper with timing, calmer under pressure, and clearer about what to practice next.
            </p>
          </motion.div>

          <div className="grid gap-3">
            {guidanceSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex gap-4 rounded-xl border border-white/6 bg-[#121017] p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#DFB15B]/20 bg-[#DFB15B]/10 font-serif text-sm font-bold text-[#DFB15B]">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-semibold leading-6 text-[#D8D4E5]">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#15121D] px-6 py-16 sm:px-8 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#DFB15B]">Ready When You Are</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-white">Start with the program that matches your life.</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-[#8E8A9F]">
              Choose online or offline batches, then use mocks and guided practice to build the pace IBA demands.
            </p>
          </div>
          <Link
            href="/#programs-section"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
          >
            View Programs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
