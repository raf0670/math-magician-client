"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { Cinzel_Decorative } from "next/font/google";

const SESSION_KEY = "mathmagician_home_intro_seen";

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const programs = [
  {
    id: "farmgate",
    badge: "Offline - Farmgate",
    title: "Gryffindor",
    detail: "Offline at RH Home Center, Farmgate",
    schedule: "Sunday, Tuesday, Thursday - 1:30 - 3:30 pm",
    price: "BDT 18,000",
    imageSrc: "/gryffindor.jpeg",
    imageAlt: "Gryffindor house crest",
  },
  {
    id: "gryffindor2",
    badge: "Offline - Farmgate",
    title: "Gryffindor 2.0",
    detail: "Offline at RH Home Center, Farmgate",
    schedule: "Saturday, Monday, Wednesday - 2:00 - 4:00 pm",
    price: "BDT 18,000",
    imageSrc: "/gryffindor.jpeg",
    imageAlt: "Gryffindor house crest",
  },
  {
    id: "online",
    badge: "Online Batch",
    title: "Ravenclaw",
    detail: "Online live class from your study room",
    schedule: "Sunday, Tuesday, Thursday - 7:30 - 9:30 pm",
    price: "BDT 17,500",
    imageSrc: "/ravenclaw.jpeg",
    imageAlt: "Ravenclaw house crest",
    featured: true,
  },
  {
    id: "bailey-road",
    badge: "Offline - Bailey Road",
    title: "Hufflepuff",
    detail: "Offline at Siddheswari Road, Bailey Road",
    schedule: "Sunday, Tuesday, Thursday - 4:00 - 6:00 pm",
    price: "BDT 18,000",
    imageSrc: "/hufflepuff.jpeg",
    imageAlt: "Hufflepuff house crest",
  },
];

export default function HomeIntroPopup() {
  const prefersReducedMotion = useReducedMotion();
  const [introPhase, setIntroPhase] = useState("idle");

  const isPrelude = introPhase === "prelude";
  const isOpen = introPhase === "popup";

  useEffect(() => {
    let hasSeenIntro = false;
    let preludeTimerId;

    try {
      hasSeenIntro = window.sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      hasSeenIntro = false;
    }

    if (hasSeenIntro) return undefined;

    const timerId = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // The pop-up should still work if browser storage is unavailable.
      }

      setIntroPhase("prelude");
      preludeTimerId = window.setTimeout(
        () => setIntroPhase("popup"),
        prefersReducedMotion ? 1200 : 5200
      );
    }, prefersReducedMotion ? 150 : 350);

    return () => {
      window.clearTimeout(timerId);
      window.clearTimeout(preludeTimerId);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (introPhase === "idle") return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIntroPhase("idle");
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [introPhase, isOpen]);

  const closePopup = () => {
    setIntroPhase("idle");
  };

  const scrollToPrograms = () => {
    closePopup();

    window.setTimeout(() => {
      const programAnchor = document.getElementById("programs-section");

      if (programAnchor) {
        programAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      window.location.hash = "programs-section";
    }, 120);
  };

  return (
    <AnimatePresence>
      {isPrelude ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#030207] px-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.22 }}
        >
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(244,205,126,0.2),transparent_27%),radial-gradient(circle_at_50%_72%,rgba(85,43,168,0.22),transparent_31%),linear-gradient(180deg,rgba(3,2,7,0),rgba(3,2,7,0.86))]"
            initial={{ scale: 1.12, opacity: 0.25 }}
            animate={{ scale: prefersReducedMotion ? 1 : 0.98, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.4 : 4.2, ease: "easeOut" }}
          />

          <motion.div
            className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          />

          <motion.div
            className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          />

          <motion.div
            className="absolute h-[44rem] w-[44rem] max-w-[120vw] rounded-full border border-[#DFB15B]/10 shadow-[0_0_90px_rgba(223,177,91,0.16),inset_0_0_80px_rgba(223,177,91,0.08)]"
            initial={{ opacity: 0, scale: 0.58, rotate: -14 }}
            animate={{
              opacity: prefersReducedMotion ? 0.35 : [0, 0.5, 0.34],
              scale: prefersReducedMotion ? 0.82 : [0.58, 0.9, 0.82],
              rotate: prefersReducedMotion ? 0 : 0,
            }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0.45 : 2.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute h-[1px] w-[92vw] max-w-5xl bg-linear-to-r from-transparent via-[#E8C56F] to-transparent shadow-[0_0_46px_rgba(232,197,111,0.9)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: prefersReducedMotion ? 0.82 : [0, 1, 0.72], opacity: prefersReducedMotion ? 0.45 : [0, 1, 0.48] }}
            exit={{ opacity: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.75, duration: prefersReducedMotion ? 0.35 : 2.65, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
            <motion.div
              className="relative mb-7 flex h-28 w-28 items-center justify-center rounded-full border border-[#DFB15B]/25 bg-[#100B17]/80 shadow-[0_0_50px_rgba(223,177,91,0.3)] sm:h-36 sm:w-36"
              initial={{ opacity: 0, scale: prefersReducedMotion ? 0.88 : 2.15, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.84, filter: "blur(8px)" }}
              transition={{ duration: prefersReducedMotion ? 0.35 : 1.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                className="absolute inset-[-12px] rounded-full border border-[#DFB15B]/15"
                initial={{ opacity: 0, scale: 0.76 }}
                animate={{ opacity: prefersReducedMotion ? 0.35 : [0, 0.7, 0.18], scale: prefersReducedMotion ? 1 : [0.76, 1.35, 1.62] }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: prefersReducedMotion ? 0.3 : 2.2, ease: "easeOut" }}
              />
              <Image
                src="/favicon.ico"
                alt="Magician's School logo"
                width={96}
                height={96}
                unoptimized
                className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
              />
            </motion.div>

            <motion.h2
              className={`${cinzelDecorative.className} text-3xl font-bold leading-tight tracking-wide text-white drop-shadow-[0_0_20px_rgba(232,197,111,0.22)] sm:text-5xl`}
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{ delay: prefersReducedMotion ? 0.1 : 1.7, duration: prefersReducedMotion ? 0.35 : 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              Magician&apos;s School
            </motion.h2>

            <motion.p
              className="mt-4 max-w-3xl font-serif text-xl font-medium leading-tight tracking-wide text-[#F4DFA6] drop-shadow-[0_0_24px_rgba(223,177,91,0.22)] sm:text-3xl"
              initial={{ opacity: 0, y: 18, scale: 0.96, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ delay: prefersReducedMotion ? 0.25 : 2.75, duration: prefersReducedMotion ? 0.35 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              Crack IBA like a Magician
            </motion.p>

            <motion.div
              className="mt-8 h-px w-44 bg-linear-to-r from-transparent via-[#DFB15B]/70 to-transparent sm:w-64"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0.45, opacity: 0 }}
              transition={{ delay: prefersReducedMotion ? 0.35 : 3.45, duration: prefersReducedMotion ? 0.25 : 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ) : null}

      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#06050A]/82 px-4 py-6 backdrop-blur-xl sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closePopup}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-intro-title"
            aria-describedby="home-intro-description"
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-[#DFB15B]/20 bg-[#0D0B14]/95 p-5 pt-16 shadow-[0_28px_90px_rgba(0,0,0,0.6)] sm:p-7 lg:p-9"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#DFB15B]/65 to-transparent" />
              <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_18%_18%,rgba(223,177,91,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(124,58,237,0.12),transparent_28%)]" />
            </div>

            <button
              type="button"
              aria-label="Close intro pop-up"
              onClick={closePopup}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/70 transition hover:border-[#DFB15B]/30 hover:text-white sm:right-4 sm:top-4"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
              <motion.div
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#DFB15B]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Your IBA journey starts here
              </motion.div>

              <h2 id="home-intro-title" className="font-serif text-3xl font-medium leading-tight tracking-wide text-white sm:text-4xl lg:text-5xl">
                Every serious result begins with one clear decision.
              </h2>

              <p id="home-intro-description" className="mt-5 max-w-2xl text-sm font-medium leading-7 text-[#A9A3BA] sm:text-base">
                Step into a focused preparation system built for discipline, confidence, and exam-day sharpness. Choose your path, then start moving with purpose.
              </p>

              <button
                type="button"
                onClick={scrollToPrograms}
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#E6C687] via-[#D4AF37] to-[#AA7C11] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_10px_35px_rgba(212,175,55,0.22)] transition hover:brightness-110 active:scale-[0.98]"
              >
                Get Started Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-1 gap-3 sm:mt-9 md:grid-cols-2 xl:grid-cols-4">
              {programs.map((program, index) => (
                <motion.button
                  type="button"
                  key={program.id}
                  onClick={scrollToPrograms}
                  className={`group flex min-h-40 flex-col rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.35)] ${
                    program.featured
                      ? "border-[#DFB15B]/30 bg-[#DFB15B]/10"
                      : "border-white/8 bg-white/4 hover:border-[#DFB15B]/20"
                  }`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.08, duration: 0.35 }}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="rounded-md border border-white/10 bg-black/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#DFB15B]">
                      {program.badge}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B]">
                      <Image
                        src={program.imageSrc}
                        alt={program.imageAlt}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  </span>

                  <span className="mt-5 font-serif text-xl font-semibold tracking-wide text-white">
                    {program.title}
                  </span>
                  <span className="mt-2 text-xs font-semibold leading-5 text-[#8E8A9F]">
                    {program.detail} - {program.schedule}
                  </span>

                  <span className="mt-auto flex items-end justify-between gap-4 pt-5">
                    <span className="font-serif text-2xl font-bold text-white">
                      {program.price}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#DFB15B]">
                      View Program
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
