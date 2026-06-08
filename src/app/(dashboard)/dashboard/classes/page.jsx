import LiveArena from "@/components/dashboard/LiveArena";
// 🪄 Import your fresh filtered class archive vault component
import ClassVault from "@/components/dashboard/ClassVault";

export default function DashboardClassesWorkspace() {
    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Page Headers Descriptor Context */}
            <div className="flex flex-col items-start text-left gap-1">
                <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                    Live Classroom Arena
                </h1>
                <p className="text-[#8E8A9F] text-xs sm:text-sm font-medium">
                    Attend scheduled broadcasts, secure tracking stats, and synchronize Drive curriculum slides.
                </p>
            </div>

            {/* Phase 3 Step 3.1: Live Launch Splitting Grid Core */}
            <LiveArena />

            {/* 🪄 Phase 3 Step 3.2: Filtered Google Drive Archive Vault Directory */}
            <div className="flex flex-col items-start text-left gap-1 mt-6">
                <h2 className="font-serif text-xl font-medium text-white tracking-wide">
                    Archived Video Class Vault
                </h2>
                <p className="text-[#6B667B] text-xs font-medium">
                    Select a segment to instantly pull recorded video playback sequences and companion folders from Google Drive.
                </p>
            </div>
            <ClassVault />

            {/* Extra padding clearance space at baseline */}
            <div className="h-4" />

        </div>
    );
}