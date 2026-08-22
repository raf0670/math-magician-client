"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";
import { getPaymentAccess, getProfile, saveAuthSession } from "@/lib/api";
import FlashyLoader from "@/components/shared/FlashyLoader";

const ACCESS_COPY = {
    classes: {
        loadingEyebrow: "Class Vault",
        loadingTitle: "Checking class access",
        loadingMessage: "Your payment access and student profile are being verified.",
        lockedTitle: "Classes unlock after admin approval",
        lockedMessage: "Submit the enrollment form with your full or partial bKash transaction ID. Once an admin approves it, live classes and archived materials will open here.",
    },
    liveExams: {
        loadingEyebrow: "Live Exams",
        loadingTitle: "Checking exam access",
        loadingMessage: "Your payment access and student profile are being verified before the exam room opens.",
        lockedTitle: "Live exams unlock after admin approval",
        lockedMessage: "Submit the enrollment form with your full or partial bKash transaction ID. Once an admin approves it, scheduled live exams will open here.",
    },
    assignments: {
        loadingEyebrow: "Assignments",
        loadingTitle: "Checking assignment access",
        loadingMessage: "Your payment access and student profile are being verified before assignments open.",
        lockedTitle: "Assignments unlock after admin approval",
        lockedMessage: "Submit the enrollment form with your full or partial bKash transaction ID. Once an admin approves it, assignments will open here.",
    },
    assessmentTest: {
        loadingEyebrow: "Assessment",
        loadingTitle: "Checking assessment access",
        loadingMessage: "Your payment access and student profile are being verified before the assessment room opens.",
        lockedTitle: "Assessment test unlocks after admin approval",
        lockedMessage: "Submit the enrollment form with your full or partial bKash transaction ID. Once an admin approves it, the official assessment test will open here.",
    },
    mockTests: {
        loadingEyebrow: "Mock Tests",
        loadingTitle: "Checking practice access",
        loadingMessage: "Your payment access and student profile are being verified before the practice arena opens.",
        lockedTitle: "Mock tests unlock after admin approval",
        lockedMessage: "Submit the enrollment form with your full or partial bKash transaction ID. Once an admin approves it, mock tests and generated practice papers will open here.",
    },
};

export default function ClassAccessGate({ children, section = "classes", presentation = "panel" }) {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const copy = ACCESS_COPY[section] || ACCESS_COPY.classes;
    const isScreenPresentation = presentation === "screen";

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
                eyebrow={copy.loadingEyebrow}
                title={copy.loadingTitle}
                message={copy.loadingMessage}
                iconName="lock"
                skeleton="cards"
                surface={isScreenPresentation ? "screen" : "panel"}
                className={isScreenPresentation ? "" : "min-h-90"}
            />
        );
    }

    if (!hasAccess) {
        return (
            <div className={`flex items-center justify-center bg-[#121017] px-6 py-12 text-center ${isScreenPresentation ? "min-h-screen rounded-none border-0" : "min-h-105 rounded-3xl border border-[#DFB15B]/15"}`}>
                <div className="max-w-lg">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DFB15B]/20 bg-[#DFB15B]/10 text-[#DFB15B]">
                        <LockKeyhole className="h-5 w-5" />
                    </div>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-[#DFB15B]">Approval Required</p>
                    <h2 className="mt-3 font-serif text-3xl font-medium text-white">{copy.lockedTitle}</h2>
                    <p className="mt-3 text-sm leading-6 text-[#8E8A9F]">
                        {copy.lockedMessage}
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
