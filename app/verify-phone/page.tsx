"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Smartphone, ArrowLeft, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

export default function VerifyPhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const isValidPhone = phone.length === 10 && /^\d+$/.test(phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length !== 10) {
      setError("Please enter a 10-digit mobile number");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      setError("Please enter only numbers");
      return;
    }

    // TODO: Send OTP via backend (Twilio/Firebase)
    // TODO: Store phone in session/storage
    router.push("/verify-otp");
  };

  return (
    <main className="min-h-screen bg-bg0 flex flex-col">
      {/* Header */}
      <motion.header
        className="px-6 py-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_PREMIUM }}
      >
        <Link href="/home" className="flex items-center gap-2 text-bg1/70 hover:text-bg1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-sm mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-20 h-20 rounded-2xl bg-fg0/10 flex items-center justify-center mx-auto"
            >
              <Smartphone className="w-10 h-10 text-fg0" />
            </motion.div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-bg1 mb-2">
                Verify Your Phone Number
              </h1>
              <p className="text-sm text-bg1/60">
                Enter the mobile number associated with this parking session.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-bg1/70 mb-2">
                  Mobile Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(val);
                    setError("");
                  }}
                  placeholder="Enter 10-digit number"
                  className={`w-full px-4 py-3.5 bg-white/50 border rounded-xl text-bg1 placeholder-bg1/40 text-center font-mono text-lg tracking-widest focus:outline-none transition-all duration-200 ${
                    error
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-bg1/15 focus:border-fg0/40 focus:ring-2 focus:ring-fg0/10"
                  }`}
                  inputMode="tel"
                />
                {error && (
                  <p className="text-red-500 text-xs mt-2">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValidPhone}
                className={`w-full group relative px-8 py-3.5 text-base font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                  isValidPhone
                    ? "text-bg0 bg-bg1 hover:bg-fg1 shadow-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(31,27,22,0.3)]"
                    : "text-bg1/40 bg-bg1/10 cursor-not-allowed"
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Help text */}
            <p className="text-xs text-bg1/40 text-center">
              By continuing, you agree to receive an OTP for verification
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
