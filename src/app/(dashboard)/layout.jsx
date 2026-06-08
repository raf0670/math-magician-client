"use client";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    // 🔍 Detect if the student is actively inside the testing engine screen
    // This matches paths like /dashboard/mock-tests/mock-14 but keeps the main directory visible
    const isInsideActiveExam = pathname.includes("/dashboard/mock-tests/") && pathname !== "/dashboard/mock-tests";

    return (
        <div className="min-h-screen bg-[#0A090F] text-white flex overflow-hidden">

            {/* 1. Only render the sidebar if we are NOT inside an active exam */}
            {!isInsideActiveExam && <DashboardSidebar />}

            {/* 2. Dynamically clear the left padding (md:pl-64) when the exam goes full screen */}
            <div className={`flex-1 flex flex-col h-screen overflow-y-auto relative z-10 pb-24 md:pb-0 transition-all duration-200 ${isInsideActiveExam ? "md:pl-0" : "md:pl-64"
                }`}>

                {/* 3. Only render the dashboard header panel if we are NOT inside an active exam */}
                {!isInsideActiveExam && <DashboardTopbar />}

                {/* Inner panel workspace content container */}
                <main className={`flex-1 w-full mx-auto ${isInsideActiveExam ? "max-w-full px-0 py-0" : "max-w-7xl px-4 sm:px-8 py-8"
                    }`}>
                    {children}
                </main>
            </div>

        </div>
    );
}