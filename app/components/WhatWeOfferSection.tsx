"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, fadeUpScale, staggerContainer } from "@/app/lib/motion";
import { useScrollReveal } from "@/app/hooks/useScrollReveal";
import {
  QrCode,
  Camera,
  MapPinned,
  BarChart3,
  Route,
  LocateFixed,
  KeyRound,
  UserCheck,
} from "lucide-react";

const bentoFeatures = [
  {
    icon: QrCode,
    title: "QR Parking",
    desc: "Assign every parking slot its own digital identity.",
  },
  {
    icon: Camera,
    title: "Vehicle Condition",
    desc: "Capture vehicle photos during check-in to prevent disputes.",
  },
  {
    icon: MapPinned,
    title: "Live Parking Map",
    desc: "Monitor occupied and available parking spaces in real time.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Track occupancy trends, peak hours and valet performance.",
  },
  {
    icon: Route,
    title: "Movement History",
    desc: "Every relocation is automatically recorded.",
  },
  {
    icon: LocateFixed,
    title: "Customer Tracking",
    desc: "Customers always know where their vehicle is.",
  },
  {
    icon: KeyRound,
    title: "Secure Pickup",
    desc: "PIN or QR verification before vehicle release.",
  },
  {
    icon: UserCheck,
    title: "Valet Accountability",
    desc: "Every action is linked to an employee.",
  },
];

export default function WhatWeOfferSection() {
  const { ref, isInView } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      id="what-we-offer"
      className="relative bg-bg0 text-dark py-24 px-6 z-30 border-t border-dark/10"
    >
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Section Divider Line */}
        <motion.div
          variants={fadeUp}
          className="w-full h-[1px] bg-dark/20 mb-8"
        />

        {/* Header */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-5xl font-extrabold text-dark text-center leading-tight tracking-tight max-w-2xl mx-auto"
        >
          Everything You Need.
          <br />
          Nothing You Don&apos;t.
        </motion.h2>

        {/* Section Divider Line */}
        <motion.div
          variants={fadeUp}
          className="w-full h-[1px] bg-dark/20 mt-8 mb-14"
        />

        {/* Dashboard Showcase */}
        <motion.div variants={fadeUp} className="w-full flex justify-center mb-16">
          <DashboardShowcase />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
        >
          {bentoFeatures.map((feat, idx) => (
            <FeatureCard key={idx} feat={feat} index={idx} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeatureCard({
  feat,
  index,
}: {
  feat: (typeof bentoFeatures)[0];
  index: number;
}) {
  const { ref, isInView } = useScrollReveal<HTMLDivElement>({
    once: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeUpScale}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="group bg-white/50 border border-dark/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-fg0/30 hover:shadow-lg"
    >
      {/* Icon Container */}
      <div className="mb-4">
        <div className="w-10 h-10 rounded-lg bg-fg0/10 flex items-center justify-center group-hover:bg-fg0/20 transition-colors duration-300">
          <feat.icon className="w-5 h-5 text-dark group-hover:text-fg0 transition-colors duration-300 group-hover:scale-105" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-dark mb-2 group-hover:text-fg0 transition-colors duration-300">
        {feat.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-dark/70 leading-relaxed">
        {feat.desc}
      </p>
    </motion.div>
  );
}

// Component for Premium Interactive Dashboard Showcase
function DashboardShowcase() {
  const [activeTab, setActiveTab] = useState<"map" | "retrieval" | "audit">(
    "map"
  );

  return (
    <div className="w-full max-w-3xl bg-bg1 text-bg0 border border-bg0/20 overflow-hidden relative animate-[dashFloat_6s_ease-in-out_infinite] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(219,159,117,0.1)]">
      {/* Window Controls Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-dark-valet/60 border-b border-bg0/15">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-3 text-xs font-mono text-bg0/70 tracking-wider hidden sm:inline-block">
            VALETOS — LIVE DASHBOARD CONTROL
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("map")}
            className={`px-3 py-1 text-xs font-bold transition-all ${
              activeTab === "map"
                ? "bg-bg0 text-bg1"
                : "bg-bg0/10 text-bg0 hover:bg-bg0/20"
            }`}
          >
            LIVE MAP
          </button>
          <button
            onClick={() => setActiveTab("retrieval")}
            className={`px-3 py-1 text-xs font-bold transition-all ${
              activeTab === "retrieval"
                ? "bg-bg0 text-bg1"
                : "bg-bg0/10 text-bg0 hover:bg-bg0/20"
            }`}
          >
            RETRIEVALS
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1 text-xs font-bold transition-all ${
              activeTab === "audit"
                ? "bg-bg0 text-bg1"
                : "bg-bg0/10 text-bg0 hover:bg-bg0/20"
            }`}
          >
            AUDIT LOG
          </button>
        </div>
      </div>

      {/* Main Dashboard View Body */}
      <div className="p-6 md:p-8">
        {/* Top Metric Strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-bg0/10 border border-bg0/20 p-3 text-center">
            <span className="text-xs text-bg0/60 block uppercase font-mono">
              Total Spots
            </span>
            <span className="text-xl md:text-2xl font-bold text-bg0">150</span>
          </div>
          <div className="bg-bg0/10 border border-bg0/20 p-3 text-center">
            <span className="text-xs text-bg0/60 block uppercase font-mono">
              Occupied
            </span>
            <span className="text-xl md:text-2xl font-bold text-emerald-400">
              128
            </span>
          </div>
          <div className="bg-bg0/10 border border-bg0/20 p-3 text-center">
            <span className="text-xs text-bg0/60 block uppercase font-mono">
              Pending Pickups
            </span>
            <span className="text-xl md:text-2xl font-bold text-amber-400">
              4
            </span>
          </div>
        </div>

        {/* Dynamic Tab Panel Content */}
        <AnimatePresence mode="wait">
          {activeTab === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between text-xs font-mono text-bg0/70 border-b border-bg0/15 pb-2">
                <span>ZONE A — VIP & EXECUTIVE SLOTS</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />{" "}
                  LIVE STREAM
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5 my-2">
                {[
                  { slot: "A-01", car: "BMW X5", status: "occupied" },
                  { slot: "A-02", car: "Audi R8", status: "occupied" },
                  { slot: "A-03", car: "Empty", status: "empty" },
                  { slot: "A-04", car: "Porsche 911", status: "pickup" },
                  { slot: "A-05", car: "Tesla Model S", status: "occupied" },
                  { slot: "A-06", car: "Empty", status: "empty" },
                  { slot: "A-07", car: "Mercedes AMG", status: "occupied" },
                  { slot: "A-08", car: "Ferrari F8", status: "pickup" },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border text-center transition-all ${
                      s.status === "occupied"
                        ? "bg-bg0/15 border-bg0/30 text-bg0"
                        : s.status === "pickup"
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse"
                        : "bg-bg0/5 border-bg0/10 text-bg0/40 border-dashed"
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{s.slot}</div>
                    <div className="text-[11px] font-medium truncate mt-1">
                      {s.car}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "retrieval" && (
            <motion.div
              key="retrieval"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3"
            >
              <div className="text-xs font-mono text-bg0/70 border-b border-bg0/15 pb-2">
                ACTIVE VEHICLE RETRIEVAL QUEUE
              </div>
              {[
                {
                  id: "QR-8842",
                  car: "Porsche 911",
                  spot: "A-04",
                  status: "Valet Dispatched",
                  time: "2 min ago",
                },
                {
                  id: "QR-8840",
                  car: "Ferrari F8",
                  spot: "A-08",
                  status: "Ready at Gate",
                  time: "Just now",
                },
                {
                  id: "QR-8835",
                  car: "Range Rover",
                  spot: "B-12",
                  status: "Key Scanned",
                  time: "5 min ago",
                },
              ].map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-bg0/10 border border-bg0/20 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono bg-bg0/20 px-2 py-0.5 text-bg0 font-bold">
                      {req.id}
                    </span>
                    <div>
                      <span className="font-bold text-bg0 block">{req.car}</span>
                      <span className="text-bg0/60 text-[11px]">
                        Spot {req.spot} • {req.time}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-mono text-[11px] border border-amber-500/30">
                    {req.status}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "audit" && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3"
            >
              <div className="text-xs font-mono text-bg0/70 border-b border-bg0/15 pb-2">
                VALET ACTIVITY & AUDIT LOG
              </div>
              {[
                {
                  action: "Vehicle Parked",
                  valet: "Alex M.",
                  details: "Mercedes AMG assigned to Spot A-07",
                  time: "17:42:10",
                },
                {
                  action: "Photo Inspection",
                  valet: "David K.",
                  details: "4 Condition photos uploaded for Audi R8",
                  time: "17:39:05",
                },
                {
                  action: "QR Scanned",
                  valet: "System",
                  details: "Guest requested retrieval for QR-8840",
                  time: "17:35:50",
                },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 bg-bg0/10 border border-bg0/20 text-xs"
                >
                  <div>
                    <span className="font-bold text-bg0 block">
                      {log.action} •{" "}
                      <span className="text-bg0/70 font-normal">{log.valet}</span>
                    </span>
                    <span className="text-bg0/70 text-[11px]">{log.details}</span>
                  </div>
                  <span className="font-mono text-[11px] text-bg0/50">
                    {log.time}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
