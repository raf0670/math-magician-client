import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import HouseStatusPanel from "@/components/dashboard/HouseStatusPanel";

export default function DashboardOverview() {
    return (
        <div className="relative flex min-w-0 w-full max-w-full flex-col gap-7 overflow-hidden pb-4">
            <div className="pointer-events-none absolute inset-x-[-12%] -top-20 h-72 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.12),transparent_68%)]" />
            <div className="pointer-events-none absolute right-[-12%] top-40 h-80 w-80 rounded-full bg-[#3156D4]/8 blur-3xl" />

            <div className="relative z-10 min-w-0 max-w-full">
                <WelcomeBanner />
            </div>

            <div className="relative z-10 min-w-0 max-w-full">
                <HouseStatusPanel />
            </div>

            <div className="relative z-10 min-w-0 max-w-full">
                <PerformanceMetrics />
            </div>
        </div>
    );
}
