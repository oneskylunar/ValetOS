"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import QRScanner from "./QRScanner";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

export default function HomePage() {
  const router = useRouter();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [showVehicleRequiredDialog, setShowVehicleRequiredDialog] = useState(false);

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

  // Handle when vehicle number is required but not entered
  const handleVehicleNumberRequired = () => {
    setShowVehicleRequiredDialog(true);
  };

  const dismissVehicleRequiredDialog = () => {
    setShowVehicleRequiredDialog(false);
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
          <QRScanner
            onScan={handleQRScan}
            vehicleNumber={vehicleNumber}
            onVehicleNumberRequired={handleVehicleNumberRequired}
          />
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

      {/* Vehicle Number Required Dialog */}
      <AnimatePresence>
        {showVehicleRequiredDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={dismissVehicleRequiredDialog}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-bg1 mb-2">
                Vehicle Number Required
              </h2>

              {/* Message */}
              <p className="text-sm text-bg1/70 mb-6">
                Please enter your vehicle number before scanning the self-parking QR.
              </p>

              {/* Dismiss Button */}
              <button
                onClick={dismissVehicleRequiredDialog}
                className="w-full px-6 py-3 bg-bg1 text-white font-bold rounded-full hover:bg-fg1 transition-all"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
