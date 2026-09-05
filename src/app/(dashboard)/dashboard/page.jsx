"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '@/lib/api';
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import HouseStatusPanel from "@/components/dashboard/HouseStatusPanel";

export default function DashboardOverview() {
    const router = useRouter();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        let active = true;
        getProfile().then(payload => {
            if (!active) return;
            const user = payload.data;
            if (user.hasMathAccess && !user.hasClassAccess && user.role !== 'admin') router.replace('/dashboard/math');
            else setReady(true);
        }).catch(() => { if (active) setReady(true); });
        return () => { active = false; };
    }, [router]);
    if (!ready) return <p className="p-6 text-sm text-[#AAA5B8]">Opening your dashboard?</p>;

    return (
        <div className="relative flex min-w-0 w-full max-w-full flex-col gap-7 overflow-hidden px-1 pb-4 sm:px-0">
            <div className="pointer-events-none absolute inset-x-[-12%] -top-20 h-72 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.12),transparent_68%)]" />
            <div className="pointer-events-none absolute right-[-12%] top-40 h-80 w-80 rounded-full bg-[#3156D4]/8 blur-3xl" />

            <div className="relative z-10 min-w-0 max-w-full">
                <WelcomeBanner />
            </div>

            <div className="relative z-10 min-w-0 max-w-full">
                <HouseStatusPanel />
            </div>

            <div className="relative z-10 min-w-0 max-w-full">
                <PerformanceMetrics />
            </div>
        </div>
    );
}
