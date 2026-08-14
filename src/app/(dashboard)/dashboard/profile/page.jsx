import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default function UserProfileDashboard() {
    return (
        <div className="relative flex w-full flex-col gap-8 overflow-hidden px-1 pb-4 sm:px-0">
            <div className="pointer-events-none absolute inset-x-[-12%] -top-24 h-72 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.14),transparent_68%)]" />
            <div className="pointer-events-none absolute right-[-12%] top-36 h-80 w-80 rounded-full bg-[#3156D4]/8 blur-3xl" />

            <div className="relative z-10 flex flex-col items-start gap-2 text-left">
                <div className="inline-flex items-center rounded-full border border-[#DFB15B]/20 bg-[#DFB15B]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#DFB15B]">
                    Student Profile
                </div>
                <h1 className="font-serif text-3xl font-semibold tracking-wide text-white sm:text-4xl">
                    Profile Configurations
                </h1>
                <p className="max-w-2xl text-xs font-medium leading-6 text-[#A9A3BA] sm:text-sm">
                    Manage secure account credentials, review university standing parameters, and track platform tier ranks.
                </p>
            </div>

            {/* 🪄 Phase 6 Complete Profile View */}
            <div className="relative z-10">
                <ProfileSettings />
            </div>

        </div>
    );
}
