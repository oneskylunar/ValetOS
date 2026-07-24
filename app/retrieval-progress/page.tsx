"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Footer from "../components/Footer";
import InfoCard from "../components/InfoCard";
import StatusTimeline from "../components/StatusTimeline";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

// Mock data
const MOCK_DATA = {
  vehicleNumber: "KA 01 AB 1234",
  valetName: "Rahul Sharma",
  valetId: "EMP-004",
};

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

export default function RetrievalProgressPage() {
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
    <main className="min-h-screen bg-bg0 flex flex-col">
      {/* Header */}
      <motion.header
        className="px-6 py-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_PREMIUM }}
      >
        <Link href="/retrieve-verify" className="flex items-center gap-2 text-bg1/70 hover:text-bg1 transition-colors">
          <span className="text-sm font-medium">Cancel</span>
        </Link>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-sm mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
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
                icon={Clock}
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
          </motion.div>
        </div>
      </div>

      {/* Footer - only show when not complete */}
      {!isComplete && <Footer />}
    </main>
  );
}
