"use client";

import Link from "next/link";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/api";
import { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await requestPasswordReset(email);
      setMessage(data.message || "If an account exists for that email, a password reset link has been sent.");
    } catch (err) {
      setError(err.message || "Unable to send a reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A090F] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121017] p-8 shadow-2xl">
        <div className="mb-8 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Magician&apos;s School</p>
          <h1 className="mt-2 font-serif text-3xl font-medium">Reset your password</h1>
          <p className="mt-2 text-sm text-[#8E8A9F]">Enter your account email and we will send a secure reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8E8A9F]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#1A1722] px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="you@example.com"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {message ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#DFB15B] px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LoadingButtonLabel
              loading={loading}
              idleText="Send reset link"
              loadingText="Sending link..."
              iconName="lock"
            />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8E8A9F]">
          Remembered it? <Link href="/login" className="font-semibold text-[#DFB15B]">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
