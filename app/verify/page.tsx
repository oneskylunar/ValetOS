"use client";

import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import Footer from "../components/Footer";
import InfoCard from "../components/InfoCard";
import StatusTimeline from "../components/StatusTimeline";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

// Mock data
const MOCK_DATA = {
  phone: "9876543210",
  vehicleNumber: "KA 01 AB 1234",
  customerName: "Arya",
  valetName: "Rahul Sharma",
  valetId: "EMP-004",
  status: "Vehicle Parked",
  location: "Phoenix Mall",
  floor: "Basement 1",
  slot: "B12",
  lastUpdated: "2 minutes ago",
};

// Demo OTP
const DEMO_OTP = "123456";

// Timeline steps
interface TimelineStep {
  id: string;
  label: string;
  timestamp?: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { id: "requested", label: "Retrieval requested" },
  { id: "assigned", label: "Request assigned to Rahul Sharma" },
  { id: "walking", label: "Valet walking to vehicle" },
  { id: "picked", label: "Vehicle picked up" },
  { id: "driving", label: "Driving toward valet gate" },
  { id: "arrived", label: "Vehicle arrived at valet gate" },
];

// ============================================
// REUSABLE COMPONENTS
// ============================================

// OTP Input Component
function OTPInput({
  length = 6,
  onComplete,
  error,
  disabled,
}: {
  length?: number;
  onComplete: (otp: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const joinedOtp = newOtp.join("");
    if (joinedOtp.length === length) {
      onComplete(joinedOtp);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const lastFilledIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();

    if (pastedData.length === length) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
              ${
                error
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-bg1/20 bg-white text-bg1 focus:border-fg0 focus:ring-2 focus:ring-fg0/20"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            placeholder="•"
          />
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status, accent = false }: { status: string; accent?: boolean }) {
  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-medium ${
        accent
          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
          : "bg-fg0/10 text-fg0 border border-fg0/20"
      }`}
    >
      {status}
    </span>
  );
}

// ============================================
// MAIN VERIFY PAGE
// ============================================

type VerifyStep = "phone" | "otp";

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState<VerifyStep>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

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

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length !== 10) {
      setPhoneError("Please enter a 10-digit mobile number");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      setPhoneError("Please enter only numbers");
      return;
    }

    // TODO: Send OTP via backend (Twilio/Firebase)
    setPhoneError("");
    setStep("otp");
    setCountdown(30);
    setCanResend(false);
  };

  const handleOTPComplete = (otp: string) => {
    setOtpError("");
    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      if (otp === DEMO_OTP) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/parking-status");
        }, 800);
      } else {
        setIsVerifying(false);
        setOtpError("Invalid OTP. Please try again.");
      }
    }, 1000);
  };

  const handleResend = () => {
    if (!canResend) return;
    // TODO: Resend OTP via backend
    setCountdown(30);
    setCanResend(false);
    setOtpError("");
  };

  const formatPhone = (p: string) => {
    if (p.length <= 5) return `+91 ${p}`;
    return `+91 ${p.slice(0, 5)} ${p.slice(5)}`;
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
              <ShieldCheck className="w-10 h-10 text-fg0" />
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
                      Verify Your Identity
                    </h1>
                    <p className="text-sm text-bg1/60">
                      Enter the mobile number associated with your vehicle to securely access your parking session.
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
                      <OTPInput
                        onComplete={handleOTPComplete}
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

// ============================================
// PARKING STATUS PAGE
// ============================================

export function ParkingStatusContent() {
  const router = useRouter();

  const handleRetrieveCar = () => {
    router.push("/retrieve-verify");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-bg1 mb-2">
          Parking Status
        </h1>
        <p className="text-sm text-bg1/60">
          Your vehicle is safely parked
        </p>
      </div>

      {/* Vehicle Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/50 border border-bg1/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-fg0/10 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-fg0" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-bg1 text-center tracking-wider">
          {MOCK_DATA.vehicleNumber}
        </h2>
      </motion.div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <StatusBadge status={MOCK_DATA.status} accent />
      </div>

      {/* Info Cards */}
      <div className="flex flex-col gap-3">
        <InfoCard
          icon={ShieldCheck}
          label="Valet Driver"
          value={MOCK_DATA.valetName}
        />
        <InfoCard
          icon={ShieldCheck}
          label="Employee ID"
          value={MOCK_DATA.valetId}
        />
        <InfoCard
          icon={ShieldCheck}
          label="Parking Location"
          value={
            <div>
              <div>{MOCK_DATA.location}</div>
              <div className="text-sm text-bg1/60">{MOCK_DATA.floor} - Slot {MOCK_DATA.slot}</div>
            </div>
          }
        />
        <InfoCard
          icon={ShieldCheck}
          label="Last Updated"
          value={MOCK_DATA.lastUpdated}
          accent
        />
      </div>

      {/* Retrieve Button */}
      <motion.button
        onClick={handleRetrieveCar}
        variants={fadeUp}
        className="w-full group relative px-8 py-3.5 text-base font-bold text-bg0 bg-bg1 hover:bg-fg1 transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(31,27,22,0.3)] active:scale-[0.98] active:shadow-sm rounded-full flex items-center justify-center gap-2"
      >
        <span>Retrieve Car</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ============================================
// RETRIEVAL PROGRESS PAGE
// ============================================

export function RetrievalProgressContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate timeline progression
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep >= TIMELINE_STEPS.length) {
          setIsComplete(true);
          clearInterval(interval);
          return prev;
        }
        return nextStep;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isComplete]);

  const handleDone = () => {
    router.push("/home");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-bg1 mb-2">
          Retrieval Progress
        </h1>
        <p className="text-sm text-bg1/60">
          Your vehicle is on its way
        </p>
      </div>

      {/* Vehicle & Valet Info */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/50 border border-bg1/10 rounded-2xl p-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-fg0/10 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-fg0" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-bg1/60 uppercase tracking-wider">Vehicle</p>
            <p className="text-lg font-bold text-bg1">{MOCK_DATA.vehicleNumber}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3">
        <InfoCard
          icon={ShieldCheck}
          label="Valet"
          value={MOCK_DATA.valetName}
        />
        <InfoCard
          icon={ShieldCheck}
          label="ETA"
          value={isComplete ? "Ready" : "2 minutes"}
          accent={isComplete}
        />
      </div>

      {/* Timeline */}
      <div className="bg-white/30 border border-bg1/10 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-bg1/70 mb-4 uppercase tracking-wider">
          Status
        </h3>
        <StatusTimeline steps={TIMELINE_STEPS} currentStep={currentStep} />
      </div>

      {/* Completion */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-xl font-bold text-emerald-600 mb-2">
              Your vehicle is ready for pickup!
            </h2>
            <p className="text-sm text-bg1/60 mb-6">
              Please proceed to the valet gate
            </p>

            <button
              onClick={handleDone}
              className="w-full group relative px-8 py-3.5 text-base font-bold text-bg0 bg-bg1 hover:bg-fg1 transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(31,27,22,0.3)] rounded-full"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
