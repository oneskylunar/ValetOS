"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Smartphone, ShieldCheck, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";
import InfoCard from "../components/InfoCard";
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

// Status Badge Component
function StatusBadge({ accent = false }: { accent?: boolean }) {
  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-medium ${
        accent
          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
          : "bg-fg0/10 text-fg0 border border-fg0/20"
      }`}
    >
      {MOCK_DATA.status}
    </span>
  );
}

export default function ParkingStatusPage() {
  const router = useRouter();

  const handleRetrieveCar = () => {
    router.push("/retrieve-verify");
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
        <Link href="/verify" className="flex items-center gap-2 text-bg1/70 hover:text-bg1 transition-colors">
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
            className="flex flex-col gap-6"
          >
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
              <StatusBadge accent />
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
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
