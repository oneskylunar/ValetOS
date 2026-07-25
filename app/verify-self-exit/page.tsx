"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import Footer from "../components/Footer";
import { useOTPInput, OTPInputDisplay } from "../components/useOTPInput";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

// Demo OTP
const DEMO_OTP = "123456";

// Mock data
const SELF_PARKING_DATA = {
  spot: "A-12",
  floor: "Ground Floor",
};

export default function VerifySelfExitPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [exitCountdown, setExitCountdown] = useState(5);

  const {
    otp,
    inputRefs,
    handleChange: handleOTPChange,
    handleKeyDown: handleOTPKeyDown,
    handlePaste: handleOTPPaste,
  } = useOTPInput({
    onComplete: handleOTPComplete,
  });

  // Get phone from session on mount and immediately go to OTP step
  useEffect(() => {
    const storedPhone = sessionStorage.getItem("valetos.self-parking.phone");
    if (storedPhone) {
      setPhone(storedPhone);
      // Automatically simulate OTP sent - go directly to OTP step
      setCountdown(30);
      setCanResend(false);
    }
  }, []);

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Exit countdown after success
  useEffect(() => {
    if (isSuccess && exitCountdown > 0) {
      const timer = setTimeout(() => setExitCountdown(exitCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && exitCountdown === 0) {
      sessionStorage.removeItem("valetos.self-parking.phone");
      router.push("/");
    }
  }, [isSuccess, exitCountdown, router]);

  function handleOTPComplete(otpValue: string) {
    setOtpError("");
    setIsVerifying(true);

    setTimeout(() => {
      if (otpValue === DEMO_OTP) {
        setIsSuccess(true);
      } else {
        setIsVerifying(false);
        setOtpError("Invalid OTP. Please try again.");
      }
    }, 1000);
  }

  function handleResend() {
    if (!canResend) return;
    setCountdown(30);
    setCanResend(false);
    setOtpError("");
  }

  function formatPhone(p: string) {
    if (!p || p.length <= 5) return "+91 ----- ----";
    return `+91 ${p.slice(0, 5)} ${p.slice(5)}`;
  }

  return (
    <main className="min-h-screen bg-bg0 flex flex-col">
      {/* Header */}
      <motion.header
        className="px-6 py-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_PREMIUM }}
      >
        <Link href="/self-parking-status" className="flex items-center gap-2 text-bg1/70 hover:text-bg1 transition-colors">
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
            {/* Success Modal Overlay */}
            <AnimatePresence>
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="fixed inset-0 bg-bg0 z-50 flex items-center justify-center p-6"
                >
                  <div className="text-center">
                    {/* Success Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-bg1 mb-2">
                      Parking Session Completed
                    </h2>
                    <p className="text-bg1/70 mb-2">
                      Your vehicle has successfully exited
                    </p>
                    <p className="text-lg font-medium text-fg0 mb-6">
                      {SELF_PARKING_DATA.floor} - Spot {SELF_PARKING_DATA.spot}
                    </p>
                    <p className="text-sm text-bg1/50 mb-2">
                      Thank you for using ValetOS.
                    </p>
                    <p className="text-xs text-bg1/30">
                      Redirecting in {exitCountdown} seconds...
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-20 h-20 rounded-2xl bg-fg0/10 flex items-center justify-center mx-auto"
            >
              <MapPin className="w-10 h-10 text-fg0" />
            </motion.div>

            {/* OTP Step - No phone step, go directly to OTP */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Heading */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-bg1 mb-2">
                  Exit Parking
                </h1>
                <p className="text-sm text-bg1/60">
                  Demo OTP sent to {formatPhone(phone)}
                </p>
              </div>

              {/* OTP Input */}
              <OTPInputDisplay
                otp={otp}
                inputRefs={inputRefs}
                handleChange={handleOTPChange}
                handleKeyDown={handleOTPKeyDown}
                handlePaste={handleOTPPaste}
                error={otpError}
                disabled={isVerifying}
              />

              {/* Loading */}
              {isVerifying && (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-fg0/30 border-t-fg0 rounded-full"
                  />
                  <span className="text-sm text-bg1/60">Verifying...</span>
                </div>
              )}

              {/* Countdown / Resend */}
              <div className="text-center">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-sm text-fg0 font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-bg1/50">
                    Resend OTP in {countdown}s
                  </p>
                )}
              </div>

              {/* Demo hint */}
              <p className="text-xs text-bg1/30 text-center">
                Demo: Enter 123456
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
