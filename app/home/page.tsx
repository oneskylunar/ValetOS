"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import QRScanner from "./QRScanner";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

const TOKEN_KEY = "valetos.token";

type User = {
  name: string;
  email: string;
  role: string;
};

// Custom hook to safely read from localStorage (cached)
function useLocalStorage<T>(key: string, initialValue: T): T {
  // Cache the parsed value to prevent infinite loops
  const cachedRef = React.useRef<T | null>(null);
  const isInitialized = React.useRef(false);

  return useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof window === "undefined") return initialValue;

      // Return cached value if already parsed
      if (cachedRef.current !== null && isInitialized.current) {
        return cachedRef.current;
      }

      const item = window.localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : initialValue;
      cachedRef.current = parsed;
      isInitialized.current = true;
      return parsed;
    },
    () => initialValue
  );
}

export default function HomePage() {
  const router = useRouter();
  const user = useLocalStorage<User | null>("valetos.user", null);

  // Check authentication on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleExploreMore = () => {
    router.push("/explore");
  };

  return (
    <main className="min-h-screen bg-bg0 flex flex-col">
      {/* Page Header */}
      <motion.header
        className="px-6 py-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_PREMIUM }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ValetOS Logo"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <span className="font-bold text-lg text-bg1 tracking-wide">ValetOS</span>
          </Link>

          {/* User Avatar */}
          <UserAvatar user={user} />
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* QR Scanner */}
        <div className="w-full mb-8">
          <QRScanner />
        </div>

        {/* Explore More Button */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={handleExploreMore}
            className="group relative px-8 py-3.5 text-base font-bold text-bg0 bg-bg1 hover:bg-fg1 transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(31,27,22,0.3)] active:scale-[0.98] active:shadow-sm rounded-full"
          >
            <span className="relative z-10">Explore More</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fg0/0 via-fg0/20 to-fg0/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

function UserAvatar({ user }: { user: User | null }) {
  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <button
      className="w-10 h-10 rounded-full bg-bg1 text-bg0 flex items-center justify-center text-sm font-bold hover:bg-fg1 transition-colors"
      aria-label="User menu"
    >
      {initials}
    </button>
  );
}
