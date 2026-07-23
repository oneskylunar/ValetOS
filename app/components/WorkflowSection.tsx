"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/app/hooks/useScrollReveal";
import {
  fadeUp,
  staggerContainer,
  dividerReveal,
} from "@/app/lib/motion";
import {
  Car,
  ClipboardCheck,
  QrCode,
  ParkingSquare,
  MapPinned,
  KeyRound,
} from "lucide-react";

const workflowSteps = [
  {
    step: "01",
    title: "Customer Arrives",
    description: "Customer arrives at the parking location.",
    Icon: Car,
  },
  {
    step: "02",
    title: "Vehicle Registered",
    description: "Valet registers the vehicle and generates a parking session.",
    Icon: ClipboardCheck,
  },
  {
    step: "03",
    title: "QR Code Scan",
    description: "Customer scans the QR code to securely link the parking session.",
    Icon: QrCode,
  },
  {
    step: "04",
    title: "Vehicle Parked",
    description: "The vehicle is parked in its assigned location.",
    Icon: ParkingSquare,
  },
  {
    step: "05",
    title: "Live Vehicle Tracking",
    description: "Customer can monitor the parking location and vehicle status in real time.",
    Icon: MapPinned,
  },
  {
    step: "06",
    title: "Secure Pickup",
    description: "Customer retrieves the vehicle using the verified parking session.",
    Icon: KeyRound,
  },
];

export default function WorkflowSection() {
  const { ref, isInView } = useScrollReveal<HTMLElement>({ once: true });

  return (
    <section
      id="workflow"
      ref={ref}
      className="relative bg-band text-bg1 py-24 px-6 z-30 border-t border-bg1/10"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Section Divider Line */}
        <motion.div
          variants={dividerReveal}
          className="w-full h-[1px] bg-bg1/20 mb-8"
        />

        {/* Section Title */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-5xl font-extrabold text-bg1 text-center leading-tight tracking-tight"
        >
          How It Works
        </motion.h2>

        {/* Section Divider Line */}
        <motion.div
          variants={dividerReveal}
          className="w-full h-[1px] bg-bg1/20 mt-8 mb-16"
        />

        {/* Vertical Timeline */}
        <div className="w-full relative">
          {/* Vertical connector line */}
          <div className="absolute left-7 md:left-1/2 top-8 bottom-8 w-px bg-bg1/20 -translate-x-1/2" />

          <div className="flex flex-col gap-12">
            {workflowSteps.map((item, idx) => (
              <TimelineItem
                key={idx}
                item={item}
                isLast={idx === workflowSteps.length - 1}
                isInView={isInView}
                index={idx}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function TimelineItem({
  item,
  isLast,
  isInView,
  index,
}: {
  item: (typeof workflowSteps)[0];
  isLast: boolean;
  isInView: boolean;
  index: number;
}) {
  const { ref, isInView: itemInView } = useScrollReveal<HTMLDivElement>({
    once: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={itemInView ? "visible" : "hidden"}
      className="relative flex items-start gap-6 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8"
    >
      {/* Left side (icon) - shown on right for desktop to alternate */}
      <div
        className={`flex items-start gap-6 md:contents ${
          index % 2 === 1 ? "md:order-3" : "md:order-1"
        }`}
      >
        {/* Icon Container */}
        <div className="relative flex-shrink-0">
          {/* Icon circle */}
          <motion.div
            className="w-14 h-14 rounded-full bg-bg1/10 border border-bg1/20 flex items-center justify-center group-hover:border-fg0/50 transition-colors duration-300"
            whileHover={{ y: -2 }}
          >
            <item.Icon className="w-6 h-6 text-bg1 stroke-[1.5]" />
          </motion.div>
        </div>

        {/* Content - hidden on desktop, visible on mobile */}
        <div className="flex-1 md:hidden pt-1">
          <span className="text-xs font-mono font-bold text-bg1/60 tracking-widest">
            STEP {item.step}
          </span>
          <h3 className="text-xl font-bold text-bg1 mt-1 group-hover:text-fg0 transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-sm text-bg1/70 mt-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Center dot on desktop */}
      <div className="hidden md:flex md:order-2 relative z-10">
        <div className="w-14 h-14 rounded-full bg-bg1/10 border border-bg1/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-bg1/40" />
        </div>
      </div>

      {/* Right side (content) - shown on desktop */}
      <div
        className={`hidden md:block text-left ${
          index % 2 === 1 ? "md:order-1 md:text-right" : "md:order-3 md:text-left"
        }`}
      >
        <span className="text-xs font-mono font-bold text-bg1/50 tracking-widest">
          STEP {item.step}
        </span>
        <h3 className="text-xl font-bold text-bg1 mt-1 group-hover:text-fg0 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-sm text-bg1/70 mt-2 leading-relaxed max-w-xs">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
