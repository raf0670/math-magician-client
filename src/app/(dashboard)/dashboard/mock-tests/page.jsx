import MockDirectory from "@/components/dashboard/MockDirectory";

export default function MockTestDashboardLanding() {
    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Context Heading Title Segment */}
            <div className="flex flex-col items-start text-left gap-1">
                <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                    Exam System
                </h1>
                <p className="text-[#8E8A9F] text-xs sm:text-sm font-medium">
                    Build an untimed practice exam from Maths, English, or Analytical topics.
                </p>
            </div>

            {/* 🪄 Phase 4 Step 4.1: The Filtered Mock Directory */}
            <MockDirectory></MockDirectory>

        </div>
    );
}
