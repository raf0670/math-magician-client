import Link from "next/link";
import { ArrowLeft, BadgeCheck, Building2, Mail, Phone } from "lucide-react";
import Footer from "@/components/shared/Footer";
import { businessInfo } from "@/components/legal/policyContent";

export default function PolicyPage({ policy }) {
  return (
    <main className="min-h-screen bg-[#0D0B14] text-white">
      <section className="relative overflow-hidden border-b border-white/5 px-6 py-16 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,177,91,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(223,177,91,0.14),transparent_68%)]" />
        <div className="relative mx-auto max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-sm font-semibold text-[#D8D4E5] transition hover:border-[#DFB15B]/35 hover:text-[#DFB15B]">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mt-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#DFB15B]">{policy.eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl font-medium leading-tight text-white sm:text-5xl">{policy.title}</h1>
            <p className="mt-5 text-sm font-medium leading-7 text-[#A9A3BA] sm:text-base">{policy.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#6B667B]">
              Last updated: {businessInfo.lastUpdated}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
          <div className="space-y-5">
            {policy.sections.map((section) => (
              <article key={section.heading} className="rounded-xl border border-white/7 bg-[#121017] p-5 sm:p-6">
                <h2 className="font-serif text-2xl font-medium text-white">{section.heading}</h2>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm font-medium leading-7 text-[#A9A3BA]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-xl border border-[#DFB15B]/18 bg-[#15121D] p-5">
            <div className="flex items-center gap-3 text-[#DFB15B]">
              <BadgeCheck className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.2em]">Business Details</p>
            </div>
            <div className="mt-5 space-y-4 text-sm font-medium text-[#A9A3BA]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B667B]">Business Name</p>
                <p className="mt-1 text-white">{businessInfo.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B667B]">Brand</p>
                <p className="mt-1 text-white">{businessInfo.brandName}</p>
              </div>
              <div className="flex gap-2">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#DFB15B]" />
                <p>{businessInfo.address}</p>
              </div>
              <div className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#DFB15B]" />
                <a href={`tel:+88${businessInfo.phone}`} className="transition hover:text-white">{businessInfo.phone}</a>
              </div>
              <div className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#DFB15B]" />
                <a href={`mailto:${businessInfo.email}`} className="break-all transition hover:text-white">{businessInfo.email}</a>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B667B]">Trade License Number</p>
                <p className="mt-1 text-white">{businessInfo.tradeLicenseNumber}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
