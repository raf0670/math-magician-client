import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
import ClassVault from "@/components/dashboard/ClassVault";
import LiveArena from "@/components/dashboard/LiveArena";

export default function DashboardClassesWorkspace() {
    return (
        <ClassAccessGate>
            <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col items-start text-left gap-1">
                    <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                        Live Classroom Arena
                    </h1>
                    <p className="text-[#8E8A9F] text-xs sm:text-sm font-medium">
                        Attend scheduled broadcasts, secure tracking stats, and synchronize Drive curriculum slides.
                    </p>
                </div>

                <LiveArena />

                <div className="flex flex-col items-start text-left gap-1 mt-6">
                    <h2 className="font-serif text-xl font-medium text-white tracking-wide">
                        Class Materials Drive
                    </h2>
                    <p className="text-[#6B667B] text-xs font-medium">
                        Open the shared Google Drive folder for recordings, slides, worksheets, and companion resources.
                    </p>
                </div>
                <ClassVault />

                <div className="h-4" />
            </div>
        </ClassAccessGate>
    );
}
