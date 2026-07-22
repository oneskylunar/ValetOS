"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, EASE_PREMIUM } from "@/app/lib/motion";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Why ValetOS?", href: "#why-valetos" },
  { name: "What we Offer?", href: "#what-we-offer" },
  { name: "Workflow", href: "#workflow" },
  { name: "Contact us", href: "#contact-us" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Scroll handler for hide/reveal and glass morphism
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Glass morphism threshold
      setIsScrolled(currentScrollY > 50);

      // Hide/reveal threshold
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <motion.header
      className="fixed top-0 w-full z-50"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : "-100%" }}
      transition={{ duration: 0.55, ease: EASE_PREMIUM }}
    >
      {/* Header Bar */}
      <div className={`relative z-50 flex items-center justify-between px-6 py-4 transition-all duration-500 ${
        isOpen || isScrolled
          ? "bg-bg1/60 backdrop-blur-xl border-b border-bg0/10 shadow-sm"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-50 relative" onClick={() => setIsOpen(false)}>
          <Image
            src="/logo.png"
            alt="ValetOS Logo"
            width={28}
            height={28}
            style={{ width: "auto", height: "28px" }}
            className="object-contain"
          />
          <span className="font-bold text-lg text-bg0 tracking-wide">ValetOS</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4 z-50 relative">
          {/* Tablet+ Sign In Button (hidden on mobile, and hidden when menu is open) */}
          <button
            onClick={goToLogin}
            className={`hidden md:inline-flex items-center justify-center px-4 py-1.5 text-sm font-semibold text-bg1 bg-bg0 border-2 border-bg0 hover:bg-transparent hover:text-bg0 transition-all duration-300 ${
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            Sign In
          </button>

          {/* Menu Toggle (Hamburger) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-bg0 hover:text-bg0/80 focus:outline-none flex flex-col gap-[6px] justify-center w-10 h-10 relative"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[2px] bg-current transition-all duration-300 ease-out ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-current transition-all duration-300 ease-out ${isOpen ? 'opacity-0 translate-x-2' : ''}`} />
            <span className={`block w-6 h-[2px] bg-current transition-all duration-300 ease-out ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Full-screen Dropdown Menu */}
      <div
        className={`fixed inset-0 min-h-[100dvh] w-full bg-bg1/40 backdrop-blur-lg flex flex-col pt-24 px-6 pb-8 overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-40 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
          {/* Nav Links */}
          <motion.nav
            className="flex flex-col flex-1 mt-4"
            variants={staggerContainer}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
          >
            {navLinks.map((link, idx) => (
              <motion.div key={link.name} variants={fadeUp} className="flex flex-col">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-medium text-bg0 py-4 hover:text-bg0/80 transition-colors inline-block text-center"
                >
                  {link.name}
                </Link>
                {/* Separator after each link except last */}
                {idx < navLinks.length - 1 && <GeometricSeparator />}
              </motion.div>
            ))}
          </motion.nav>

          {/* Bottom Actions */}
          <div className="mt-8 pt-6 flex flex-col gap-3 border-t border-bg0/20">
            <button
              onClick={goToLogin}
              className="w-full py-3 text-center text-base font-semibold text-bg0 bg-transparent border-2 border-bg0 hover:bg-bg0 hover:text-bg1 transition-colors shadow-sm"
            >
              Sign In
            </button>
            <button
              onClick={goToLogin}
              className="w-full py-3 text-center text-base font-bold text-bg1 bg-bg0 hover:bg-bg0/90 transition-all duration-300 shadow-lg hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function GeometricSeparator() {
  return (
    <div className="w-full h-[1px] bg-bg0/20 my-2 relative flex items-center justify-center">
      <div className="w-2.5 h-2.5 rotate-45 border border-bg0/40 bg-bg1"></div>
      <div className="absolute w-[15%] h-[1px] bg-bg0/40 left-1/2 -translate-x-1/2"></div>
    </div>
  );
}
