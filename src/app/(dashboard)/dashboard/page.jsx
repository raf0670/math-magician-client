import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import ScheduleTimeline from "@/components/dashboard/ScheduleTimeline";

export default function DashboardOverview() {
    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Phase 2 Step 2.1: Welcome & Call-to-Action Hero Frame */}
            <WelcomeBanner />

            {/* 🪄 Phase 2 Step 2.2: Interactive Performance Tracking Modules Grid */}
            <PerformanceMetrics />

            {/* 🪄 Phase 2 Step 2.3: Live Timed Schedule Agenda Feed Timeline */}
            {/* <ScheduleTimeline /> */}

        </div>
    );
}