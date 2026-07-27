import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
import MockDirectory from "@/components/dashboard/MockDirectory";

export default function MockTestDashboardLanding() {
    return (
        <ClassAccessGate section="mockTests">
            <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col items-start text-left gap-1">
                    <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                        Practice
                    </h1>
                    <p className="text-[#8E8A9F] text-xs sm:text-sm font-medium">
                        Build an untimed practice exam from Maths, English, or Analytical topics.
                    </p>
                </div>

                <MockDirectory />
            </div>
        </ClassAccessGate>
    );
}
