"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = window.localStorage.getItem("exam_archive_token");
        if (!token && pathname !== "/login" && pathname !== "/register" && pathname !== "/signup" && pathname !== "/enroll") {
            router.replace("/login");
            return;
        }

        setReady(true);
    }, [pathname, router]);

    // 🔍 Detect if the student is actively inside the testing engine screen
    // This matches paths like /dashboard/mock-tests/mock-14 but keeps the main directory visible
    const isInsideActiveExam = pathname.includes("/dashboard/mock-tests/") && pathname !== "/dashboard/mock-tests";

    if (!ready && pathname !== "/login" && pathname !== "/register" && pathname !== "/signup" && pathname !== "/enroll") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0A090F] text-white">
                <p className="text-sm text-[#8E8A9F]">Checking your session...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A090F] text-white flex overflow-hidden">
            {!isInsideActiveExam && <DashboardSidebar />}

            <div className={`flex-1 flex flex-col h-screen overflow-y-auto relative z-10 pb-24 md:pb-0 transition-all duration-200 ${isInsideActiveExam ? "md:pl-0" : "md:pl-64"}`}>
                {!isInsideActiveExam && <DashboardTopbar />}

                <main className={`flex-1 w-full mx-auto ${isInsideActiveExam ? "max-w-full px-0 py-0" : "max-w-7xl px-4 sm:px-8 py-8"}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}