"use client";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FaDiscord, FaFacebook, FaFacebookMessenger, FaInstagram, FaYoutube } from "react-icons/fa";
import BrandMark from "@/components/shared/BrandMark";

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
    { name: "Ravenclaw", href: "/programs/online" },
    { name: "Gryffindor", href: "/programs/farmgate" },
    { name: "Hufflepuff", href: "/programs/bailey-rd" },
    { name: "Crash Course", href: "/programs/crash-course" },
  ];

  const resourceLinks = [
    { name: "Past Papers", href: "/resources/past-papers" },
    { name: "Free Mock Test", href: "/resources/mock-test" },
    { name: "Blog", href: "/blog" },
    { name: "YouTube", href: "https://youtube.com" },
  ];

  const supportLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
    { name: "Community", href: "/#community-section" },
    { name: "Refund Policy", href: "/refund-policy" },
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
              <span className="text-xl font-bold leading-tight">MathMagician&apos;s</span>
              <span className="text-xl font-bold leading-tight">School</span>
            </div>
          </Link>
          
          <p className="text-[#8E8A9F] text-xs leading-relaxed max-w-xs font-medium">
            Bangladesh’s most trusted IBA admission prep platform. We turn aspirants into IBA students.
          </p>

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

        {/* COLUMN 3: RESOURCES */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h4 className="text-xs font-bold tracking-widest text-[#DFB15B] uppercase">Resources</h4>
          <ul className="flex flex-col gap-3 text-xs font-medium text-[#8E8A9F]">
            {resourceLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white transition-colors duration-200">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4: SUPPORT */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h4 className="text-xs font-bold tracking-widest text-[#DFB15B] uppercase">Support</h4>
          <ul className="flex flex-col gap-3 text-xs font-medium text-[#8E8A9F]">
            {supportLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white transition-colors duration-200">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 5: CONTACT ARCHIVE (Spans 2 columns on large views) */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h4 className="text-xs font-bold tracking-widest text-[#DFB15B] uppercase">Contact</h4>
          <ul className="flex flex-col gap-3 text-xs font-medium text-[#8E8A9F]">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
              <span>Farmgate, Dhaka-1215</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
              <span>Bailey Road, Dhaka-1000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#DFB15B] shrink-0" />
              <span>+880 1700-000000</span>
            </li>
            <li className="flex items-center gap-2.5 break-all">
              <Mail className="w-4 h-4 text-[#DFB15B] shrink-0" />
              <a href="mailto:info@mathmagicianschool.com" className="hover:text-white transition-colors">
                info@mathmagicianschool.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* 📜 BOTTOM DIVIDER & COPYRIGHT FRAME */}
      <div className="w-full border-t border-white/4 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-[#6B667B]">
        <div>
          &copy; {currentYear} MathMagician&apos;s School. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
        </div>
      </div>

    </footer>
  );
}
