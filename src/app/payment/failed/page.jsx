import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A090F] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#121017] p-8 text-center shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">Payment Not Completed</p>
        <h1 className="mt-3 font-serif text-3xl font-medium">Access was not unlocked</h1>
        <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">
          The payment was cancelled, failed, or could not be verified. Please try again from the pricing section.
        </p>
        <Link
          href="/#programs-section"
          className="mt-6 inline-flex rounded-2xl border border-[#DFB15B]/30 bg-[#DFB15B]/10 px-5 py-3 text-sm font-bold uppercase tracking-wider text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black"
        >
          Return to Pricing
        </Link>
      </div>
    </div>
  );
}
