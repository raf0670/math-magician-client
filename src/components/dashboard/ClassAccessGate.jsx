"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";
import { getPaymentAccess, getProfile, saveAuthSession } from "@/lib/api";
import FlashyLoader from "@/components/shared/FlashyLoader";

export default function ClassAccessGate({ children }) {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        let isMounted = true;

        getPaymentAccess()
            .then(async (payload) => {
                const allowed = Boolean(payload?.data?.hasClassAccess);
                if (!isMounted) return;

                setHasAccess(allowed);

                if (allowed) {
                    const profile = await getProfile().catch(() => null);
                    const token = window.localStorage.getItem("exam_archive_token");
                    if (token && profile?.data) {
                        saveAuthSession(token, profile.data);
                    }
                }
            })
            .catch(() => {
                if (isMounted) setHasAccess(false);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <FlashyLoader
                eyebrow="Class Vault"
                title="Checking class access"
                message="Your payment access and student profile are being verified."
                iconName="lock"
                skeleton="cards"
                className="min-h-[360px]"
            />
        );
    }

    if (!hasAccess) {
        return (
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-[#DFB15B]/15 bg-[#121017] px-6 py-12 text-center">
                <div className="max-w-lg">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B]">
                        <LockKeyhole className="h-5 w-5" />
                    </div>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Approval Required</p>
                    <h2 className="mt-3 font-serif text-3xl font-medium text-white">Classes unlock after admin approval</h2>
                    <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">
                        Submit the enrollment form with your bKash transaction ID. Once an admin approves it, live classes and archived materials will open here.
                    </p>
                    <Link
                        href="/#programs-section"
                        className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#DFB15B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
                    >
                        <Sparkles className="h-4 w-4" />
                        Choose a Program
                    </Link>
                </div>
            </div>
        );
    }

    return children;
}
