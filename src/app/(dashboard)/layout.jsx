import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0A090F] text-white flex">
            
            {/* Desktop and Mobile Sidebar Root Component */}
            <DashboardSidebar />

            {/* Main Content Workspace Scope Window */}
            <div className="flex-1 md:pl-64 flex flex-col min-h-screen relative z-10 pb-24 md:pb-0">
                
                {/* 🪄 Topbar Header Context Layer */}
                <DashboardTopbar />

                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
                    {children}
                </main>
            </div>

        </div>
    );
}