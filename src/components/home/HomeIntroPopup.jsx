"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, Laptop, School, Sparkles, X } from "lucide-react";

const SESSION_KEY = "mathmagician_home_intro_seen";

const programs = [
  {
    id: "farmgate",
    badge: "Offline - Farmgate",
    title: "IBA Offline Batch",
    detail: "RH Home Center",
    schedule: "1:30 - 3:30 pm",
    price: "BDT 18,000",
    icon: School,
  },
  {
    id: "online",
    badge: "Online Batch",
    title: "IBA Online Batch",
    detail: "Live from your study room",
    schedule: "7:30 - 9:30 pm",
    price: "BDT 17,500",
    icon: Laptop,
    featured: true,
  },
  {
    id: "bailey-road",
    badge: "Offline - Bailey Road",
    title: "IBA Offline Batch",
    detail: "Siddheswari Road",
    schedule: "4:00 - 6:00 pm",
    price: "BDT 18,000",
    icon: Building2,
  },
];

export default function HomeIntroPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let hasSeenIntro = false;

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

      setIsOpen(true);
    }, 500);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
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

            <div className="relative z-10 mt-8 grid grid-cols-1 gap-3 sm:mt-9 lg:grid-cols-3">
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
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B]">
                      <program.icon className="h-4 w-4" />
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
