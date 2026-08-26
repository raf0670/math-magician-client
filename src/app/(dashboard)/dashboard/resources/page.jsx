import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
import ResourcesVault from "@/components/dashboard/ResourcesVault";

export default function DashboardResourcesPage() {
    return (
        <ClassAccessGate section="classes">
            <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col items-start gap-1 text-left">
                    <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                        Resources
                    </h1>
                    <p className="text-xs font-medium text-[#8E8A9F] sm:text-sm">
                        Browse curated PDF resources, question banks, vocabulary books, puzzle files, and exam guides.
                    </p>
                </div>

                <ResourcesVault />

                <div className="h-4" />
            </div>
        </ClassAccessGate>
    );
}
