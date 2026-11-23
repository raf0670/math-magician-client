"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Languages, LockKeyhole, MessageCircle, RefreshCw, Sigma, Video, VideoOff } from "lucide-react";
import { getMarathonDashboard, getProfile, saveAuthSession } from "@/lib/api";
import FlashyLoader from "@/components/shared/FlashyLoader";

const SECTION_META = {
  english: { icon: Languages, description: "Join the currently published English Marathon class." },
  maths: { icon: Sigma, description: "Join the currently published Maths Marathon class." },
};

export default function MarathonDashboardPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboard, profile] = await Promise.all([getMarathonDashboard(), getProfile().catch(() => null)]);
      setSections(dashboard?.data?.sections || []);
      const token = window.localStorage.getItem("exam_archive_token");
      if (token && profile?.data) saveAuthSession(token, profile.data);
    } catch (err) {
      setError(err.message || "Unable to load Marathon classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([getMarathonDashboard(), getProfile().catch(() => null)])
      .then(([dashboard, profile]) => {
        if (!active) return;
        setSections(dashboard?.data?.sections || []);
        const token = window.localStorage.getItem("exam_archive_token");
        if (token && profile?.data) saveAuthSession(token, profile.data);
      })
      .catch((err) => active && setError(err.message || "Unable to load Marathon classes."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);
  const entitledIds = useMemo(() => sections.filter((section) => section.entitled).map((section) => section.id), [sections]);

  if (loading) return <FlashyLoader eyebrow="Marathon" title="Preparing your class links" message="Your English and Maths access is being verified." iconName="video" skeleton="cards" className="min-h-130" />;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-300/18 bg-[#101620] p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_42%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Live Class Portal</p><h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Marathon</h1><p className="mt-3 max-w-xl text-sm leading-7 text-[#AAB3C5]">Your class button appears as soon as the live link is published.</p></div>
          <button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:border-cyan-300/30"><RefreshCw className="h-4 w-4" /> Refresh links</button>
        </div>
      </section>

      {error ? <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div> : null}
      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => <SectionCard key={section.id} section={section} entitledIds={entitledIds} />)}
      </div>
      {!sections.some((section) => section.entitled) ? (
        <div className="rounded-3xl border border-white/8 bg-[#101620] p-8 text-center"><LockKeyhole className="mx-auto h-7 w-7 text-[#778196]" /><h2 className="mt-4 text-2xl font-semibold">Marathon access is locked</h2><p className="mt-2 text-sm text-[#AAB3C5]">Choose English, Maths, or both to unlock your class portal.</p><Link href="/marathon" className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-black uppercase tracking-wider text-black">View enrollment</Link></div>
      ) : null}
    </div>
  );
}

function SectionCard({ section, entitledIds }) {
  const meta = SECTION_META[section.id];
  const Icon = meta?.icon || Video;
  const upgradePlan = section.id === "english" ? "marathonAddEnglish" : "marathonAddMaths";
  const initialPlan = section.id === "english" ? "marathonEnglish" : "marathonMaths";
  const purchasePlan = entitledIds.length ? upgradePlan : initialPlan;

  return (
    <article className={`relative flex min-h-88 flex-col overflow-hidden rounded-3xl border p-6 ${section.entitled ? "border-cyan-300/22 bg-[#101620]" : "border-white/7 bg-[#0E1118]"}`}>
      <div className="flex items-start justify-between gap-4"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${section.entitled ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200" : "border-white/8 bg-white/4 text-[#778196]"}`}><Icon className="h-5 w-5" /></div><span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${section.entitled ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : "border-white/8 bg-white/4 text-[#778196]"}`}>{section.entitled ? "Unlocked" : "Locked"}</span></div>
      <h2 className="mt-7 text-3xl font-semibold">{section.title}</h2><p className="mt-3 text-sm leading-7 text-[#AAB3C5]">{meta?.description}</p>
      <div className="mt-auto space-y-3 pt-7">
        {section.entitled && section.messengerGroupUrl ? (
          <a href={section.messengerGroupUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-300/25 bg-blue-300/10 px-5 py-4 text-sm font-black uppercase tracking-wider text-blue-200 transition hover:border-blue-300/45 hover:bg-blue-300/15"><MessageCircle className="h-4 w-4" /> Join Messenger group <ExternalLink className="h-4 w-4" /></a>
        ) : null}
        {section.entitled && section.published && section.joinUrl ? (
          <a href={section.joinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-300 to-emerald-300 px-5 py-4 text-sm font-black uppercase tracking-wider text-black"><Video className="h-4 w-4" /> Join live class <ExternalLink className="h-4 w-4" /></a>
        ) : section.entitled ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/4 px-5 py-4 text-sm font-semibold text-[#AAB3C5]"><VideoOff className="h-4 w-4" /> Link will be available when class starts</div>
        ) : (
          <Link href={`/payment/details?plan=${purchasePlan}`} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-300/25 bg-orange-300/10 px-5 py-4 text-sm font-black uppercase tracking-wider text-orange-200"><LockKeyhole className="h-4 w-4" /> {entitledIds.length ? `Add ${section.title}` : `Enroll in ${section.title}`}</Link>
        )}
      </div>
    </article>
  );
}
