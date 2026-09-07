"use client";

import { CalendarClock, Video } from "lucide-react";
import LiveArena from "@/components/dashboard/LiveArena";
import { MathHero, MathPageShell } from "@/components/math/MathDashboardUI";

export default function MathClassesPage() {
  return (
    <MathPageShell>
      <MathHero
        eyebrow="Math Live Classroom"
        title="Math Live Classes"
        description="Join scheduled special classes and sharpen the way you approach difficult math problems."
        icon={Video}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/7 bg-white/5 px-4 py-3 backdrop-blur">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8A9F]">Class Type</span>
            <span className="mt-1 block text-sm font-bold text-white">Live special classes</span>
          </div>
          <div className="rounded-2xl border border-white/7 bg-white/5 px-4 py-3 backdrop-blur">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8A9F]">
              <CalendarClock className="h-3.5 w-3.5 text-[#DFB15B]" />
              Schedule
            </span>
            <span className="mt-1 block text-sm font-bold text-emerald-200">Updates automatically</span>
          </div>
        </div>
      </MathHero>
      <LiveArena />
    </MathPageShell>
  );
}
