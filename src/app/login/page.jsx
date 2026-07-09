"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearPendingPaymentPlan, getPendingPaymentPlan, loginUser, saveAuthSession } from "@/lib/api";
import { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(form);
      saveAuthSession(data.token, data.user);

      const pendingPlan = getPendingPaymentPlan();
      if (pendingPlan) {
        clearPendingPaymentPlan();
        router.push(`/payment/details?plan=${encodeURIComponent(pendingPlan)}`);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A090F] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121017] p-8 shadow-2xl">
        <div className="mb-8 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Exam Archive</p>
          <h1 className="mt-2 font-serif text-3xl font-medium">Welcome back</h1>
          <p className="mt-2 text-sm text-[#8E8A9F]">Sign in to continue your practice journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8E8A9F]">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#1A1722] px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8E8A9F]">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#1A1722] px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="••••••••"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#DFB15B] px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LoadingButtonLabel
              loading={loading}
              idleText="Sign in"
              loadingText="Signing in..."
              iconName="login"
            />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8E8A9F]">
          New here? <Link href="/signup" className="font-semibold text-[#DFB15B]">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
