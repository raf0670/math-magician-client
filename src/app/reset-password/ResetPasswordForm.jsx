"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { resetPassword } from "@/lib/api";
import { LoadingButtonLabel } from "@/components/shared/FlashyLoader";

export default function ResetPasswordForm({ token }) {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return undefined;

    const redirectTimer = window.setTimeout(() => {
      router.push("/login");
    }, 1800);

    return () => window.clearTimeout(redirectTimer);
  }, [message, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Password reset link is missing its token.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword(token, form.password);
      setMessage(data.message || "Password reset successfully. Please sign in with your new password.");
      setForm({ password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A090F] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121017] p-8 shadow-2xl">
        <div className="mb-8 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Exam Archive</p>
          <h1 className="mt-2 font-serif text-3xl font-medium">Choose a new password</h1>
          <p className="mt-2 text-sm text-[#8E8A9F]">Use a password you have not used here before.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8E8A9F]">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#1A1722] px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="Enter at least 6 characters"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8E8A9F]">Confirm password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#1A1722] px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="Re-enter your new password"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {message ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{message}</p> : null}

          <button
            type="submit"
            disabled={loading || Boolean(message)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#DFB15B] px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LoadingButtonLabel
              loading={loading}
              idleText="Reset password"
              loadingText="Resetting..."
              iconName="lock"
            />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8E8A9F]">
          Back to <Link href="/login" className="font-semibold text-[#DFB15B]">sign in</Link>
        </p>
      </div>
    </div>
  );
}
