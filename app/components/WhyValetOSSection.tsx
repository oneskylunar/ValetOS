"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/app/hooks/useScrollReveal";
import {
  fadeUp,
  fadeUpScale,
  staggerContainer,
  dividerReveal,
} from "@/app/lib/motion";
import { X, Check } from "lucide-react";

export const problems = [
  {
    title: "Lost vehicle locations",
    desc: "Cars are often tracked manually, leading to delays.",
  },
  {
    title: "No Accountability",
    desc: "Nobody knows who moved a car.",
  },
  {
    title: "Poor Customer Experience",
    desc: "Customers keep waiting with no visibility.",
  },
];

export const solutions = [
  {
    title: "QR-Based Parking",
    desc: "Every parking spot has a permanent identity.",
  },
  {
    title: "Real-Time Tracking",
    desc: "Know where every vehicle is instantly.",
  },
  {
    title: "Complete Audit Trail",
    desc: "Every action is linked to a specific valet.",
  },
];

export const statsData = [
  {
    value: 12000,
    suffix: "+",
    label: "Vehicles Managed",
    format: (v: number) => v.toLocaleString(),
  },
  {
    value: 99.9,
    suffix: "%",
    label: "Tracking Accuracy",
    decimals: 1,
    format: (v: number) => v.toFixed(1),
  },
  {
    value: 50,
    suffix: "%",
    label: "Faster Retrieval",
    format: (v: number) => Math.round(v).toString(),
  },
  {
    value: 100,
    suffix: "%",
    label: "Digital Records",
    format: (v: number) => Math.round(v).toString(),
  },
];

export default function WhyValetOSSection() {
  const { ref, isInView } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="why-valetos"
      className="relative bg-band text-bg1 py-20 px-6 z-30"
    >
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Section Divider Line */}
        <motion.div
          variants={dividerReveal}
          className="w-full h-[1px] bg-bg1/20 mb-8"
        />

        {/* Main Section Header */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-extrabold text-bg1 text-center leading-tight tracking-tight max-w-2xl mx-auto"
        >
          Traditional Parking
          <br />
          Creates More Problems Than Solutions.
        </motion.h2>

        {/* Section Divider Line */}
        <motion.div
          variants={dividerReveal}
          className="w-full h-[1px] bg-bg1/20 mt-8 mb-12"
        />

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full text-left">
          {/* Left Side: Problems */}
          <div className="flex flex-col gap-4">
            <motion.div
              variants={fadeUp}
              className="text-xs font-mono font-bold tracking-widest text-bg1/80 uppercase px-3 py-1 bg-dark-valet/40 border border-bg1/20 rounded inline-block self-start mb-2"
            >
              PROBLEMS
            </motion.div>
            {problems.map((prob, idx) => (
              <ProblemCard key={idx} prob={prob} />
            ))}
          </div>

          {/* Right Side: Solutions */}
          <div className="flex flex-col gap-4">
            <motion.div
              variants={fadeUp}
              className="text-xs font-mono font-bold tracking-widest text-bg1/80 uppercase px-3 py-1 bg-bg1/15 border border-bg1/30 rounded inline-block self-start mb-2"
            >
              SOLUTIONS
            </motion.div>
            {solutions.map((sol, idx) => (
              <SolutionCard key={idx} sol={sol} />
            ))}
          </div>
        </div>

        {/* Animated Statistics */}
        <div className="w-full mt-20 pt-10 border-t border-bg1/20">
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {statsData.map((stat, idx) => (
              <motion.div variants={fadeUpScale} key={idx}>
                <AnimatedStatCard stat={stat} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function ProblemCard({
  prob,
}: {
  prob: (typeof problems)[0];
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
      className="group p-6 bg-bg1/10 border border-bg1/20 backdrop-blur-sm transition-all duration-250 hover:bg-bg1/15 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.15)] hover:border-fg0/30"
    >
      <h3 className="text-lg font-bold text-bg1 mb-2 flex items-start gap-4">
        {/* Icon Container - matches WhatWeOfferSection style */}
        <div className="w-10 h-10 rounded-lg bg-fg0/10 flex items-center justify-center flex-shrink-0 group-hover:bg-fg0/20 transition-colors duration-250">
          <X
            className="w-5 h-5 text-bg1 group-hover:text-fg0 group-hover:scale-105 transition-colors duration-250"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
        <span>{prob.title}</span>
      </h3>
      <p className="text-sm text-bg1/80 leading-relaxed font-normal ml-14">
        {prob.desc}
      </p>
    </motion.div>
  );
}

function SolutionCard({
  sol,
}: {
  sol: (typeof solutions)[0];
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
      className="group p-6 bg-bg1/15 border border-bg1/30 backdrop-blur-sm transition-all duration-250 hover:bg-bg1/20 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.15)] hover:border-fg0/30"
    >
      <h3 className="text-lg font-bold text-bg1 mb-2 flex items-start gap-4">
        {/* Icon Container - matches WhatWeOfferSection style */}
        <div className="w-10 h-10 rounded-lg bg-fg0/10 flex items-center justify-center flex-shrink-0 group-hover:bg-fg0/20 transition-colors duration-250">
          <Check
            className="w-5 h-5 text-bg1 group-hover:text-fg0 group-hover:scale-105 transition-colors duration-250"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
        <span>{sol.title}</span>
      </h3>
      <p className="text-sm text-bg1/80 leading-relaxed font-normal ml-14">
        {sol.desc}
      </p>
    </motion.div>
  );
}

function AnimatedStatCard({ stat }: { stat: (typeof statsData)[number] }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = stat.value;
          const duration = 1500;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + (end - start) * easeProgress;

            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, stat.value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center p-4 bg-bg1/10 border border-bg1/20 backdrop-blur-sm"
    >
      <div className="text-3xl md:text-4xl font-extrabold text-bg1 tracking-tight mb-1">
        {stat.format(count)}
        {stat.suffix}
      </div>
      <div className="w-8 h-[2px] bg-bg1/40 my-2" />
      <div className="text-xs md:text-sm font-semibold text-bg1/80 tracking-wide uppercase">
        {stat.label}
      </div>
    </div>
  );
}
