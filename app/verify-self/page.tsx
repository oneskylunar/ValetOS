"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import Footer from "../components/Footer";
import { useOTPInput, OTPInputDisplay } from "../components/useOTPInput";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

// Demo OTP
const DEMO_OTP = "123456";

type VerifyStep = "phone" | "otp";

export default function VerifySelfPage() {
  const router = useRouter();
  const [step, setStep] = useState<VerifyStep>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const {
    otp,
    inputRefs,
    handleChange: handleOTPChange,
    handleKeyDown: handleOTPKeyDown,
    handlePaste: handleOTPPaste,
    reset: resetOTP,
  } = useOTPInput({
    onComplete: handleOTPComplete,
  });

  // Countdown timer
  useEffect(() => {
    if (step !== "otp") return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, step]);

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (phone.length !== 10) {
      setPhoneError("Please enter a 10-digit mobile number");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      setPhoneError("Please enter only numbers");
      return;
    }

    setPhoneError("");
    setStep("otp");
    setCountdown(30);
    setCanResend(false);
  }

  function handleOTPComplete(otpValue: string) {
    setOtpError("");
    setIsVerifying(true);

    setTimeout(() => {
      if (otpValue === DEMO_OTP) {
        setIsSuccess(true);
        // Store phone in sessionStorage for the next page
        sessionStorage.setItem("valetos.self-parking.phone", phone);
        setTimeout(() => {
          router.push("/self-parking-status");
        }, 800);
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
    if (p.length <= 5) return `+91 ${p}`;
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
              <MapPin className="w-10 h-10 text-fg0" />
            </motion.div>

            {/* Animate between steps */}
            <AnimatePresence mode="wait">
              {step === "phone" ? (
                <motion.div
                  key="phone-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-6"
                >
                  {/* Heading */}
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-bg1 mb-2">
                      Self-Parking Verification
                    </h1>
                    <p className="text-sm text-bg1/60">
                      Enter the mobile number associated with your parking session to verify your identity.
                    </p>
                  </div>

                  {/* Phone Form */}
                  <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
                    <div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setPhone(val);
                          setPhoneError("");
                        }}
                        placeholder="Enter mobile number"
                        className={`w-full px-4 py-3.5 bg-white/50 border rounded-xl text-bg1 placeholder-bg1/40 text-center font-mono text-lg tracking-widest focus:outline-none transition-all duration-200 ${
                          phoneError
                            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-bg1/15 focus:border-fg0/40 focus:ring-2 focus:ring-fg0/10"
                        }`}
                        inputMode="tel"
                      />
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-2 text-center">{phoneError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={phone.length !== 10}
                      className={`w-full group relative px-8 py-3.5 text-base font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                        phone.length === 10
                          ? "text-bg0 bg-bg1 hover:bg-fg1 shadow-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(31,27,22,0.3)]"
                          : "text-bg1/40 bg-bg1/10 cursor-not-allowed"
                      }`}
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  {/* OTP Step */}
                  {!isSuccess ? (
                    <>
                      {/* Heading */}
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-bg1 mb-2">
                          Enter Verification Code
                        </h1>
                        <p className="text-sm text-bg1/60">
                          We&apos;ve sent a 6-digit OTP to {formatPhone(phone)}
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
                    </>
                  ) : (
                    /* Success */
                    <motion.div
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
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </motion.div>
                      <p className="text-lg font-bold text-emerald-600">Verification Successful!</p>
                    </motion.div>
                  )}
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
