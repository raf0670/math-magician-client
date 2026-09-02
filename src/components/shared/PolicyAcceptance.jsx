"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export default function PolicyAcceptance({ checked, onChange, error = false }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 transition ${
      checked
        ? "border-[#74D99F]/45 bg-[#102019]/55"
        : error
          ? "border-[#F2A7A7]/45 bg-[#2A171B]/45"
          : "border-white/8 bg-[#0F0D15]/70 hover:border-[#DFB15B]/25"
    }`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
        checked ? "border-[#74D99F] bg-[#74D99F] text-black" : error ? "border-[#F2A7A7] text-[#F2A7A7]" : "border-[#8E8A9F] text-transparent"
      }`}>
        <Check className="h-3.5 w-3.5" />
      </span>
      <span className="text-sm font-medium leading-6 text-[#A9A3BA]">
        I have read and agree to the{" "}
        <Link href="/terms-and-conditions" target="_blank" className="font-semibold text-[#DFB15B] underline-offset-4 hover:underline">
          Terms & Conditions
        </Link>
        ,{" "}
        <Link href="/return-refund-policy" target="_blank" className="font-semibold text-[#DFB15B] underline-offset-4 hover:underline">
          Return & Refund Policy
        </Link>
        , and{" "}
        <Link href="/privacy-policy" target="_blank" className="font-semibold text-[#DFB15B] underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  );
}
