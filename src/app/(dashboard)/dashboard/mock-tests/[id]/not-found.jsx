import Link from "next/link";

export default function ExamNotFound() {
  return (
    <div className="flex min-h-[280px] flex-col justify-center rounded-3xl border border-white/5 bg-[#121017] px-6 py-10 text-left">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Exam unavailable</p>
      <h2 className="mt-2 text-xl font-semibold text-white">This mock test could not be found.</h2>
      <p className="mt-2 text-sm text-[#8E8A9F]">Choose another exam from the mock test library.</p>
      <Link href="/dashboard/mock-tests" className="mt-4 inline-flex w-fit rounded-xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-4 py-2 text-sm font-semibold text-[#DFB15B] transition hover:bg-[#DFB15B] hover:text-black">
        Browse mock tests
      </Link>
    </div>
  );
}
