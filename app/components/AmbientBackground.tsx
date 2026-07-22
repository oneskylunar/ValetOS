"use client";

import { useEffect, useState } from "react";

/**
 * Ambient background blobs that create a subtle, organic depth.
 * Three large, extremely blurred gradient blobs with slow CSS animation.
 * Disabled on reduced-motion and small screens for performance.
 */
export default function AmbientBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Enable only on larger viewports where it won't impact performance
    const isLargeEnough = window.innerWidth >= 640;
    setEnabled(!prefersReduced && isLargeEnough);
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Warm amber blob */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle, rgba(219,159,117,0.6) 0%, transparent 70%)",
          filter: "blur(100px)",
          top: "10%",
          left: "-5%",
          animation: "ambientFloat1 28s ease-in-out infinite",
        }}
      />

      {/* Muted teal blob */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full opacity-[0.10]"
        style={{
          background:
            "radial-gradient(circle, rgba(18,35,36,0.5) 0%, transparent 70%)",
          filter: "blur(100px)",
          top: "40%",
          right: "-8%",
          animation: "ambientFloat2 32s ease-in-out infinite",
        }}
      />

      {/* Neutral cream blob */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,248,241,0.6) 0%, transparent 70%)",
          filter: "blur(100px)",
          bottom: "15%",
          left: "20%",
          animation: "ambientFloat3 35s ease-in-out infinite",
        }}
      />
    </div>
  );
}
