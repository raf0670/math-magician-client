export default function MockTestsLoading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-white/5 bg-[#121017] px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#DFB15B]/30 border-t-[#DFB15B]" />
        <p className="text-sm font-medium text-[#8E8A9F]">Loading mock tests...</p>
      </div>
    </div>
  );
}
