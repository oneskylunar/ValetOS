"use client";

import { useEffect, useRef, useState } from "react";

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
  { value: 12000, suffix: "+", label: "Vehicles Managed", format: (v: number) => v.toLocaleString() },
  { value: 99.9, suffix: "%", label: "Tracking Accuracy", decimals: 1, format: (v: number) => v.toFixed(1) },
  { value: 50, suffix: "%", label: "Faster Retrieval", format: (v: number) => Math.round(v).toString() },
  { value: 100, suffix: "%", label: "Digital Records", format: (v: number) => Math.round(v).toString() },
];

export default function WhyValetOSSection() {
  return (
    <section id="why-valetos" className="relative bg-bg1 text-bg0 py-20 px-6 z-30">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Divider Line */}
        <div className="w-full h-[1px] bg-bg0/20 mb-8" />

        {/* Main Section Header */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-bg0 text-center leading-tight tracking-tight max-w-2xl mx-auto py-2">
          Traditional Parking<br />Creates More Problems Than Solutions.
        </h2>

        {/* Section Divider Line */}
        <div className="w-full h-[1px] bg-bg0/20 mt-8 mb-12" />

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full text-left">
          {/* Left Side: Problems */}
          <div className="flex flex-col gap-4 z-41">
            <div className="text-xs font-mono font-bold tracking-widest text-bg0/80 uppercase px-3 py-1 bg-dark-valet/40 border border-bg0/20 rounded inline-block self-start mb-2">
              PROBLEMS
            </div>
            {problems.map((prob, idx) => (
              <div
                key={idx}
                className="p-6 bg-bg0/10 border border-bg0/20 backdrop-blur-sm transition-all duration-300 hover:bg-bg0/15"
              >
                <h3 className="text-lg font-bold text-bg0 mb-2 flex items-center gap-2">
                  <span className="text-red-300 text-base">❌</span> {prob.title}
                </h3>
                <p className="text-sm text-bg0/80 leading-relaxed font-normal">
                  {prob.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right Side: Solutions */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-mono font-bold tracking-widest text-bg0/80 uppercase px-3 py-1 bg-bg0/20 border border-bg0/30 rounded inline-block self-start mb-2">
              SOLUTIONS
            </div>
            {solutions.map((sol, idx) => (
              <div
                key={idx}
                className="p-6 bg-bg0/15 border border-bg0/30 backdrop-blur-sm transition-all duration-300 hover:bg-bg0/20"
              >
                <h3 className="text-lg font-bold text-bg0 mb-2 flex items-center gap-2">
                  <span className="text-emerald-300 text-base">✓</span> {sol.title}
                </h3>
                <p className="text-sm text-bg0/80 leading-relaxed font-normal">
                  {sol.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Statistics */}
        <div className="w-full mt-20 pt-10 border-t border-bg0/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statsData.map((stat, idx) => (
              <AnimatedStatCard key={idx} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedStatCard({ stat }: { stat: typeof statsData[number] }) {
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
    <div ref={ref} className="flex flex-col items-center p-4 bg-bg0/10 border border-bg0/20 backdrop-blur-sm">
      <div className="text-3xl md:text-4xl font-extrabold text-bg0 tracking-tight mb-1">
        {stat.format(count)}{stat.suffix}
      </div>
      <div className="w-8 h-[2px] bg-bg0/40 my-2" />
      <div className="text-xs md:text-sm font-semibold text-bg0/80 tracking-wide uppercase">
        {stat.label}
      </div>
    </div>
  );
}
