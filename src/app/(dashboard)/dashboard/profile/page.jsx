import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default function UserProfileDashboard() {
    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Context Descriptors Title Segment Header */}
            <div className="flex flex-col items-start text-left gap-1">
                <h1 className="font-serif text-3xl font-medium tracking-wide text-white">
                    Profile Configurations
                </h1>
                <p className="text-[#8E8A9F] text-xs sm:text-sm font-medium">
                    Manage secure account credentials, review university standing parameters, and track platform tier ranks.
                </p>
            </div>

            {/* 🪄 Phase 6 Complete Profile View */}
            <ProfileSettings />

        </div>
    );
}