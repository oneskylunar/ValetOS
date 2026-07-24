"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowLeft, RotateCcw } from "lucide-react";
import Footer from "../components/Footer";
import OTPInput from "../components/OTPInput";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

const DEMO_OTP = "123456";

export default function RetrieveVerifyPage() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOTPComplete = (otp: string) => {
    setError("");
    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      if (otp === DEMO_OTP) {
        setIsSuccess(true);
        // Redirect after success animation
        setTimeout(() => {
          router.push("/retrieval-progress");
        }, 800);
      } else {
        setIsVerifying(false);
        setError("Invalid OTP. Please try again.");
      }
    }, 1000);
  };

  const handleResend = () => {
    if (!canResend) return;
    // TODO: Resend OTP via backend
    setCountdown(30);
    setCanResend(false);
    setError("");
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
        <Link href="/parking-status" className="flex items-center gap-2 text-bg1/70 hover:text-bg1 transition-colors">
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
              <ShieldCheck className="w-10 h-10 text-fg0" />
            </motion.div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-bg1 mb-2">
                Confirm Vehicle Retrieval
              </h1>
              <p className="text-sm text-bg1/60">
                For your security, verify your identity before requesting vehicle retrieval.
              </p>
            </div>

            {/* OTP Input */}
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="otp-input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <OTPInput
                    onComplete={handleOTPComplete}
                    error={error}
                    disabled={isVerifying}
                  />

                  {/* Loading state */}
                  {isVerifying && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-fg0/30 border-t-fg0 rounded-full"
                      />
                      <span className="text-sm text-bg1/60">Verifying...</span>
                    </div>
                  )}

                  {/* Countdown / Resend */}
                  <div className="text-center mt-6">
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
                  <p className="text-xs text-bg1/30 text-center mt-4">
                    Demo: Enter 123456
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4"
                  >
                    <ShieldCheck className="w-10 h-10 text-white" />
                  </motion.div>
                  <p className="text-lg font-bold text-emerald-600">Verification Successful!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
