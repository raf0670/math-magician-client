import AnalyticsPortal from "@/components/dashboard/AnalyticsPortal";

export default function PerformanceAnalyticsDashboard() {
    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Title segment headings info */}
            <div className="flex flex-col items-start text-left gap-1">
                <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                    Performance Telemetry
                </h1>
                <p className="text-[#8E8A9F] text-xs sm:text-sm font-medium">
                    Analyze exam metrics, diagnostic section metrics, and track historical progress markers.
                </p>
            </div>

            {/* 🪄 Phase 5 Complete Layout Entry */}
            <AnalyticsPortal />

        </div>
    );
}