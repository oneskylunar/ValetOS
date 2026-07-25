"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  MapPin,
  Clock,
  Phone,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Footer from "../components/Footer";
import InfoCard from "../components/InfoCard";
import { fadeUp, EASE_PREMIUM } from "@/app/lib/motion";

// Default mock data for self-parking
const DEFAULT_SELF_PARKING_DATA = {
  vehicleNumber: "DL 01 AB 1234",
  vehicleType: "Sedan",
  spot: "A-12",
  floor: "Ground Floor",
  location: "Phoenix Mall",
  checkInTime: new Date(Date.now() - 84 * 60 * 1000), // 84 minutes ago
  status: "Occupied",
  session: "Active",
};

// Generate parking slots for visualization
function generateParkingSlots(userSpot: string) {
  const spots = [];
  const letters = ["A", "B", "C", "D"];
  const spotsPerRow = 8;

  for (let row = 0; row < 4; row++) {
    const letter = letters[row];
    for (let i = 1; i <= spotsPerRow; i++) {
      const spotId = `${letter}-${i}`;
      spots.push({
        id: spotId,
        isUserSpot: spotId === userSpot,
      });
    }
  }
  return spots;
}

export default function SelfParkingStatusPage() {
  const router = useRouter();
  const [parkingDuration, setParkingDuration] = useState("00:00:00");

  // Get phone and vehicle number from session storage
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("valetos.self-parking.phone");
    if (storedPhone) {
      setPhone(storedPhone);
    }

    const storedVehicleNumber = sessionStorage.getItem("valetos.self-parking.vehicleNumber");
    if (storedVehicleNumber) {
      setVehicleNumber(storedVehicleNumber);
    }
  }, []);

  // Parking duration timer
  useEffect(() => {
    const startTime = DEFAULT_SELF_PARKING_DATA.checkInTime.getTime();

    const updateDuration = () => {
      const now = Date.now();
      const diff = now - startTime;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setParkingDuration(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format phone number
  const formatPhone = (p: string) => {
    if (!p) return "---";
    return `+91 ${p.slice(0, 5)} ${p.slice(5)}`;
  };

  // Format check-in time
  const formatCheckIn = () => {
    return DEFAULT_SELF_PARKING_DATA.checkInTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle exit parking - navigate to verification
  const handleExitParking = () => {
    router.push("/verify-self-exit");
  };

  // Use entered vehicle number if available, otherwise use default
  const displayVehicleNumber = vehicleNumber || DEFAULT_SELF_PARKING_DATA.vehicleNumber;
  const parkingSlots = generateParkingSlots(DEFAULT_SELF_PARKING_DATA.spot);

  return (
    <main className="min-h-screen bg-bg0 flex flex-col">
      {/* Header */}
      <motion.header
        className="px-6 py-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_PREMIUM }}
      >
        <Link href="/verify-self" className="flex items-center gap-2 text-bg1/70 hover:text-bg1 transition-colors">
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
            className="flex flex-col gap-6"
          >
            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-bg1 mb-2">
                Self-Parking Session
              </h1>
              <p className="text-sm text-bg1/60">
                Your parking information
              </p>
            </div>

            {/* Main Location Card - Most Important */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-fg0/20 to-fg0/5 border-2 border-fg0/30 rounded-2xl p-6 text-center"
            >
              <p className="text-sm text-fg0/70 uppercase tracking-wider mb-2">You parked at</p>
              <h2 className="text-3xl font-bold text-fg0 mb-1">{DEFAULT_SELF_PARKING_DATA.floor}</h2>
              <p className="text-2xl font-bold text-fg0">Parking Spot {DEFAULT_SELF_PARKING_DATA.spot}</p>
            </motion.div>

            {/* Parking Duration Timer */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-white/50 border border-bg1/10 rounded-2xl p-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-bg1/50" />
                <span className="text-sm text-bg1/60 uppercase tracking-wider">Parking Duration</span>
              </div>
              <p className="text-4xl font-bold text-bg1 font-mono tracking-widest">
                {parkingDuration}
              </p>
            </motion.div>

            {/* Parking Lot Visualization */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/30 border border-bg1/10 rounded-2xl p-4"
            >
              <h3 className="text-xs font-bold text-bg1/60 uppercase tracking-wider mb-3 text-center">
                Parking Layout
              </h3>
              <div className="flex flex-col gap-2">
                {["A", "B", "C", "D"].map((letter) => (
                  <div key={letter} className="flex gap-1 justify-center">
                    {Array.from({ length: 8 }).map((_, idx) => {
                      const spotId = `${letter}-${idx + 1}`;
                      const isUserSpot = spotId === DEFAULT_SELF_PARKING_DATA.spot;
                      return (
                        <div
                          key={spotId}
                          className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                            isUserSpot
                              ? "bg-fg0 text-white shadow-lg scale-110"
                              : "bg-white/50 text-bg1/40 border border-bg1/10"
                          }`}
                          title={isUserSpot ? "Your spot" : spotId}
                        >
                          {idx + 1}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              {/* Row labels */}
              <div className="flex justify-center gap-2 mt-2">
                {["A", "B", "C", "D"].map((letter) => (
                  <div key={letter} className="w-8 text-center text-xs text-bg1/40 font-medium">
                    Row {letter}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Info Cards */}
            <div className="flex flex-col gap-3">
              <InfoCard
                icon={Car}
                label="Vehicle Number"
                value={displayVehicleNumber}
              />
              <InfoCard
                icon={Car}
                label="Vehicle Type"
                value={DEFAULT_SELF_PARKING_DATA.vehicleType}
              />
              <InfoCard
                icon={MapPin}
                label="Location"
                value={DEFAULT_SELF_PARKING_DATA.location}
              />
              <InfoCard
                icon={Clock}
                label="Check-in Time"
                value={formatCheckIn()}
              />
              <InfoCard
                icon={Phone}
                label="Phone Number"
                value={formatPhone(phone)}
                accent
              />
            </div>

            {/* Status Badge */}
            <div className="flex justify-center gap-3">
              <span className="px-4 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-sm font-medium">
                {DEFAULT_SELF_PARKING_DATA.status}
              </span>
              <span className="px-4 py-2 bg-fg0/10 text-fg0 border border-fg0/20 rounded-full text-sm font-medium">
                {DEFAULT_SELF_PARKING_DATA.session}
              </span>
            </div>

            {/* Exit Button */}
            <motion.button
              onClick={handleExitParking}
              variants={fadeUp}
              className="w-full group relative px-8 py-3.5 text-base font-bold text-bg0 bg-bg1 hover:bg-fg1 transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(31,27,22,0.3)] active:scale-[0.98] active:shadow-sm rounded-full flex items-center justify-center gap-2"
            >
              <span>Exit Parking</span>
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
