"use client";
import { BadgeCheck, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FaDiscord, FaFacebook, FaFacebookMessenger, FaInstagram, FaYoutube } from "react-icons/fa";
import BrandMark from "@/components/shared/BrandMark";
import { businessInfo } from "@/components/legal/policyContent";

const socialLinks = [
  {
    name: "FB Community",
    href: "https://m.me/j/AbazInHCd4ZkmBmV/?send_source=gc%3Acopy_invite_link_t",
    icon: <FaFacebook className="w-4 h-4" />,
  },
  {
    name: "Messenger Group",
    href: "https://m.me/j/AbbUmVRClo6YFnc7/?send_source=gc%3Acopy_invite_link_t",
    icon: <FaFacebookMessenger className="w-4 h-4" />,
  },
  {
    name: "Discord Server",
    href: "https://discord.gg/Yt2bxXkqzU",
    icon: <FaDiscord className="w-4 h-4" />,
  },
  {
    name: "FB Page",
    href: "https://www.facebook.com/profile.php?id=61586225977175",
    icon: <FaFacebook className="w-4 h-4" />,
  },
  {
    name: "Instagram Page",
    href: "https://www.instagram.com/math_magician35/",
    icon: <FaInstagram className="w-4 h-4" />,
  },
  {
    name: "YouTube Link",
    href: "https://www.youtube.com/@Mehrab.DU-IBA",
    icon: <FaYoutube className="w-4 h-4" />,
  },
];

export default function Footer() {
  const currentYear = 2026; // Static synchronization point matching deployment cycle

  const programLinks = [
    { name: "Ravenclaw", href: "/#programs-section" },
    { name: "Gryffindor", href: "/#programs-section" },
    { name: "Gryffindor 2.0", href: "/#programs-section" },
    { name: "Hufflepuff", href: "/#programs-section" },
    { name: "Crash Course", href: "/#programs-section" },
  ];
  const legalLinks = [
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Return & Refund Policy", href: "/return-refund-policy" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Delivery Policy", href: "/delivery-policy" },
  ];

  return (
    <footer className="w-full bg-[#0D0B14] border-t border-white/4 pt-16 pb-8 px-6 md:px-12 lg:px-24 text-gray-400 text-sm select-none">
      
      {/* 📊 MAIN FOOTER DEEP LINKS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 pb-12">
        
        {/* COLUMN 1: BRAND LOGO & PLATFORM BIO (Spans 4 columns on large views) */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex w-9 h-9 shrink-0 items-center justify-center">
              <BrandMark className="h-7 w-7" />
            </div>
            <div className="flex flex-col font-serif tracking-wide text-[#DFB15B]">
              <span className="text-xl font-bold leading-tight">Magician&apos;s</span>
              <span className="text-xl font-bold leading-tight">School</span>
            </div>
          </Link>
          
          <p className="text-[#8E8A9F] text-xs leading-relaxed max-w-xs font-medium">
            Bangladesh’s most trusted IBA admission prep platform. We turn aspirants into IBA students.
          </p>

          <div className="space-y-2 text-xs font-medium leading-5 text-[#8E8A9F]">
            <p className="font-semibold text-[#D8D4E5]">{businessInfo.name}</p>
            <p className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#DFB15B]" />
              <span>Trade License Number: {businessInfo.tradeLicenseNumber}</span>
            </p>
          </div>

          {/* SOCIAL MEDIA HOVER PLATFORMS */}
          <div className="flex items-center gap-3">
            {socialLinks.map((soc) => (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={soc.name}
                title={soc.name}
                className="w-8 h-8 rounded-full bg-[#1A1625] flex items-center justify-center text-[#8E8A9F] hover:text-white hover:bg-[#251F35] transition-all duration-200 border border-white/2"
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* COLUMN 2: PROGRAMS */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h4 className="text-xs font-bold tracking-widest text-[#DFB15B] uppercase">Programs</h4>
          <ul className="flex flex-col gap-3 text-xs font-medium text-[#8E8A9F]">
            {programLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white transition-colors duration-200">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3: LEGAL */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <h4 className="text-xs font-bold tracking-widest text-[#DFB15B] uppercase">Legal</h4>
          <ul className="flex flex-col gap-3 text-xs font-medium text-[#8E8A9F]">
            {legalLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white transition-colors duration-200">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4: CONTACT */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <h4 className="text-xs font-bold tracking-widest text-[#DFB15B] uppercase">Contact</h4>
          <ul className="flex flex-col gap-3 text-xs font-medium text-[#8E8A9F]">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 w-4 h-4 text-[#DFB15B] shrink-0" />
              <span>{businessInfo.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#DFB15B] shrink-0" />
              <a href={`tel:+88${businessInfo.phone}`} className="hover:text-white transition-colors">
                {businessInfo.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5 break-all">
              <Mail className="w-4 h-4 text-[#DFB15B] shrink-0" />
              <a href={`mailto:${businessInfo.email}`} className="hover:text-white transition-colors">
                {businessInfo.email}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* 📜 BOTTOM DIVIDER & COPYRIGHT FRAME */}
      <div className="w-full border-t border-white/4 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-[#6B667B]">
        <div>
          &copy; {currentYear} Magician&apos;s School. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors duration-200">Terms & Conditions</Link>
        </div>
      </div>

    </footer>
  );
}
