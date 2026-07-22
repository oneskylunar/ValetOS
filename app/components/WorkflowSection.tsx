"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/app/hooks/useScrollReveal";
import {
  fadeUp,
  fadeUpScale,
  staggerContainer,
  dividerReveal,
} from "@/app/lib/motion";

export const workflowSteps = [
  { step: "01", title: "Customer Arrives", icon: "🚗" },
  { step: "02", title: "Vehicle Registered", icon: "📋" },
  { step: "03", title: "QR Scan", icon: "📲" },
  { step: "04", title: "Vehicle Parked", icon: "🅿️" },
  { step: "05", title: "Customer Tracking", icon: "📍" },
  { step: "06", title: "Secure Pickup", icon: "🔑" },
];

export const futureFeatures = [
  { icon: "🤖", title: "AI Plate Recognition" },
  { icon: "🗺️", title: "Indoor Navigation" },
  { icon: "📡", title: "Smart Sensors" },
  { icon: "⚡", title: "EV Charging" },
  { icon: "📅", title: "Reservations" },
  { icon: "📹", title: "CCTV Integration" },
];

export default function WorkflowSection() {
  const { ref: sectionRef, isInView: sectionInView } = useScrollReveal<HTMLElement>({ once: true });
  const { ref: futureRef, isInView: futureInView } = useScrollReveal<HTMLDivElement>({ once: true });

  return (
    <section id="workflow" ref={sectionRef} className="relative bg-bg1 text-bg0 py-24 px-6 z-30 border-t border-bg0/10">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={sectionInView ? "visible" : "hidden"}
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Section Divider Line */}
        <motion.div variants={dividerReveal} className="w-full h-[1px] bg-bg0/20 mb-8" />

        {/* Top Half: How It Works */}
        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold text-bg0 text-center leading-tight tracking-tight max-w-2xl mx-auto py-2">
          How It Works
        </motion.h2>

        {/* Section Divider Line */}
        <motion.div variants={dividerReveal} className="w-full h-[1px] bg-bg0/20 mt-8 mb-16" />

        {/* Beautiful Responsive Timeline */}
        <div className="w-full relative max-w-3xl mx-auto">
          {/* Connecting Animated Gradient Line (Vertical for Mobile, Grid connected for Tablet) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-bg0/20 -translate-y-1/2 z-0">
            <motion.div variants={dividerReveal} className="h-full bg-gradient-to-r from-bg0 via-emerald-400 to-bg0 w-full opacity-80" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            {workflowSteps.map((item, idx) => (
              <motion.div
                variants={fadeUpScale}
                key={idx}
                className="group bg-bg0/10 hover:bg-bg0/20 border border-bg0/20 p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-bg0/40 backdrop-blur-md relative overflow-hidden"
              >
                {/* Step Badge */}
                <span className="text-xs font-mono font-bold text-bg0/70 bg-bg0/20 px-2.5 py-1 mb-4 border border-bg0/20">
                  STEP {item.step}
                </span>

                {/* Icon */}
                <div className="text-3xl mb-3 transform transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-bg0 tracking-tight">
                  {item.title}
                </h3>

                {/* Animated Arrow Connector for Mobile view */}
                {idx < workflowSteps.length - 1 && (
                  <div className="md:hidden mt-4 text-bg0 opacity-60">
                    ↓
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Half: Built For The Future */}
        <motion.div
          ref={futureRef}
          variants={staggerContainer}
          initial="hidden"
          animate={futureInView ? "visible" : "hidden"}
          className="w-full mt-28 pt-16 border-t border-bg0/20 flex flex-col items-center"
        >
          <motion.h3 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-bg0 text-center tracking-tight mb-3">
            Built For The Future.
          </motion.h3>
          <motion.p variants={fadeUp} className="text-base md:text-lg text-bg0/80 font-medium text-center mb-12 max-w-lg">
            Designed to grow with your parking operations.
          </motion.p>

          {/* Six Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {futureFeatures.map((item, idx) => (
              <motion.div
                variants={fadeUpScale}
                key={idx}
                className="group bg-bg0/10 hover:bg-bg0/15 border border-bg0/20 backdrop-blur-md p-6 flex items-center justify-between shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-bg0/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-base font-bold text-bg0 tracking-tight">
                    {item.title}
                  </span>
                </div>
                <span className="px-3 py-1 text-xs font-mono font-bold tracking-widest text-bg0/90 bg-dark-valet/60 border border-bg0/30 uppercase">
                  Coming Soon
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
