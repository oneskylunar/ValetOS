"use client";

import Image from "next/image";
import Link from "next/link";

const footerNavLinks = [
  { name: "Home", href: "#home" },
  { name: "Why ValetOS?", href: "#why-valetos" },
  { name: "What we Offer?", href: "#what-we-offer" },
  { name: "Workflow", href: "#workflow" },
  { name: "Contact us", href: "#contact-us" },
];

export default function Footer() {
  return (
    <footer className="bg-bg1 text-bg0 py-16 px-6 relative z-30 border-t border-bg0/10">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ValetOS Logo"
              width={36}
              height={36}
              style={{ width: "auto", height: "36px" }}
              className="object-contain"
            />
            <span className="font-extrabold text-2xl text-bg0 tracking-wide">ValetOS</span>
          </Link>
          <p className="text-xs md:text-sm text-bg0/70 max-w-md leading-relaxed font-medium">
            The Next-Generation Digital Valet Infrastructure.
          </p>
        </div>

        {/* Geometric Line Separator */}
        <div className="w-full h-[1px] bg-bg0/20 my-6 relative flex items-center justify-center">
          <div className="w-2.5 h-2.5 rotate-45 border border-bg0/40 bg-bg1" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 my-6 text-sm font-semibold">
          {footerNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-bg0/80 hover:text-bg0 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Geometric Line Separator */}
        <div className="w-full h-[1px] bg-bg0/20 my-6" />

        {/* Bottom Metadata & Copyright */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-bg0/60 pt-2">
          <span>© 2026 ValetOS Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-bg0 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-bg0 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-bg0 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
