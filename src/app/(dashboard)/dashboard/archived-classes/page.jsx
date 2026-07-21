import ClassAccessGate from "@/components/dashboard/ClassAccessGate";
import ClassVault from "@/components/dashboard/ClassVault";

export default function DashboardArchivedClassesPage() {
    return (
        <ClassAccessGate>
            <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col items-start gap-1 text-left">
                    <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                        Archived Classes
                    </h1>
                    <p className="text-xs font-medium text-[#8E8A9F] sm:text-sm">
                        Browse subject-wise Google Drive folders for class recordings, slides, worksheets, and companion files.
                    </p>
                </div>

                <ClassVault />

                <div className="h-4" />
            </div>
        </ClassAccessGate>
    );
}
