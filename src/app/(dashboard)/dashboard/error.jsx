"use client";

export default function DashboardError({ error, reset }) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-6 py-8 text-left">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">Dashboard update failed</p>
      <h2 className="mt-2 text-lg font-semibold text-white">We could not load this section right now.</h2>
      <p className="mt-2 text-sm text-[#8E8A9F]">{error?.message || "Please refresh and try again."}</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-xl border border-white/5 bg-[#121017] px-4 py-2 text-sm font-semibold text-white transition hover:border-[#DFB15B]/30 hover:text-[#DFB15B]"
      >
        Try again
      </button>
    </div>
  );
}
