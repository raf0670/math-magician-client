import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
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
                        Attend scheduled broadcasts and join the current Zoom class when it goes live.
                    </p>
                </div>

                <LiveArena />

                <div className="h-4" />
            </div>
        </ClassAccessGate>
    );
}
