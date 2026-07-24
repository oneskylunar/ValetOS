"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import QRScanner from "./QRScanner";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

export default function HomePage() {
  const router = useRouter();
  const [vehicleNumber, setVehicleNumber] = useState("");

  const handleExploreMore = () => {
    router.push("/explore");
  };

  // Callback when QR is scanned
  const handleQRScan = (data: string) => {
    // TODO:
    // If scanned QR is a valet token,
    // automatically populate vehicle number.
    //
    // Example: Parse QR data to extract vehicle number
    // const extractedNumber = parseQRPayload(data);
    // setVehicleNumber(extractedNumber);

    // TODO:
    // For self parking,
    // preserve manually entered vehicle number.
    // (Do nothing - the existing vehicleNumber state remains unchanged)
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
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 py-8 md:py-12">
        {/* QR Scanner */}
        <div className="w-full max-w-sm mb-10 md:mb-12">
          <QRScanner onScan={handleQRScan} />
        </div>

        {/* Vehicle Number Input */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="w-full max-w-sm"
        >
          <label
            htmlFor="vehicle-number"
            className="block text-xs font-bold uppercase tracking-wider text-bg1/70 mb-2"
          >
            Vehicle Number
          </label>
          <input
            id="vehicle-number"
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
            placeholder="DL XX AB XXXX"
            className="w-full px-4 py-3.5 bg-white/50 border border-bg1/15 rounded-xl text-bg1 placeholder-bg1/40 placeholder:text-center placeholder:tracking-widest text-center focus:outline-none focus:border-fg0/40 focus:ring-2 focus:ring-fg0/10 transition-all duration-200 text-base font-medium"
          />
        </motion.div>

        {/* Spacer to push button down and ensure footer is below fold */}
        <div className="flex-1 min-h-[60px]" />

        {/* Explore More Button */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
          className="w-full max-w-sm mb-6"
        >
          <button
            onClick={handleExploreMore}
            className="w-full group relative px-8 py-3.5 text-base font-bold text-bg0 bg-bg1 hover:bg-fg1 transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(31,27,22,0.3)] active:scale-[0.98] active:shadow-sm rounded-full"
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
