"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const frameCount = 180;

export const timelineSteps = [
  {
    range: [0, 0.20],
    heading: "Every parking space has its own identity.",
    subtext: "Every parking spot is assigned a unique QR code.",
  },
  {
    range: [0.20, 0.45],
    heading: "One Scan. Instant Tracking.",
    subtext: "Scan the QR, capture the vehicle details, and assign its exact parking location in seconds.",
  },
  {
    range: [0.45, 0.75],
    heading: "Every Vehicle Has A Digital Record.",
    subtext: "License plate, valet, parking location, timestamp, and condition are securely logged.",
  },
  {
    range: [0.75, 1.00],
    heading: "Parking, Reimagined.",
    subtext: "Complete visibility for managers. Complete confidence for customers.",
  },
];

export default function ScrollVideoSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Load all 180 video frames into memory once
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/hero-video/ezgif-frame-${paddedIndex}.jpg`;

      img.onload = () => {
        // When first image loads, trigger initial render
        if (i === 1 && canvasRef.current) {
          lastDrawnFrameRef.current = -1;
        }
      };

      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, []);

  // Handle canvas sizing cleanly — ONLY on window resize or initial mount
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      // Force redraw current frame after resize
      lastDrawnFrameRef.current = -1;
    }
  }, []);

  // Draw frame to canvas — uses cover scaling and fallback if target image isn't loaded yet
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure canvas dimensions are initialized
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const clampedIndex = Math.max(0, Math.min(frameCount - 1, index));
    let img = imagesRef.current[clampedIndex];

    // Fallback if target frame isn't fully loaded yet
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < frameCount; offset++) {
        const prev = clampedIndex - offset;
        const next = clampedIndex + offset;
        if (prev >= 0 && imagesRef.current[prev]?.complete && imagesRef.current[prev].naturalWidth > 0) {
          img = imagesRef.current[prev];
          break;
        }
        if (next < frameCount && imagesRef.current[next]?.complete && imagesRef.current[next].naturalWidth > 0) {
          img = imagesRef.current[next];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Crop out baked-in side black bars from ezgif frames (1920x1080 -> 1600x1080)
    const sx = 160;
    const sy = 0;
    const sWidth = 1600;
    const sHeight = 1080;

    // Fit cover scaling for perfect full-bleed view across screen sizes
    const scale = Math.max(canvas.width / sWidth, canvas.height / sHeight);
    const dWidth = sWidth * scale;
    const dHeight = sHeight * scale;
    const dx = (canvas.width - dWidth) / 2;
    const dy = (canvas.height - dHeight) / 2;

    // Draw directly over canvas — no clearRect needed (prevents white/blank flash)
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    lastDrawnFrameRef.current = clampedIndex;
  }, []);

  // Smooth lerp RAF loop for silky smooth video scrubbing and robust frame retention
  useEffect(() => {
    let rafId: number;
    let running = true;

    const tick = () => {
      if (!running) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      // Smooth linear interpolation for video scrubbing (0.35 factor)
      const diff = target - current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.35;
      } else {
        currentFrameRef.current = target;
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      if (frameToDraw !== lastDrawnFrameRef.current) {
        drawFrame(frameToDraw);
      }

      rafId = requestAnimationFrame(tick);
    };

    syncCanvasSize();
    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
    };
  }, [drawFrame, syncCanvasSize]);

  // Scroll and Resize event listeners
  useEffect(() => {
    const handleResize = () => {
      syncCanvasSize();
      lastDrawnFrameRef.current = -1; // force redraw on resize
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const maxScroll = containerRef.current.scrollHeight - window.innerHeight;

      let scrollFraction = 0;
      if (rect.top <= 0) {
        scrollFraction = maxScroll > 0 ? -rect.top / maxScroll : 0;
      }

      // Clamp between 0.0 and 1.0 (stays on last frame when scroll completes)
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));

      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(scrollFraction * (frameCount - 1)))
      );

      targetFrameRef.current = frameIndex;
      setScrollProgress(scrollFraction);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [syncCanvasSize]);

  // Helper to compute smooth opacity and vertical translation per step
  const getStepOpacityAndTransform = (index: number) => {
    const ranges = [
      [0.00, 0.20],
      [0.20, 0.45],
      [0.45, 0.75],
      [0.75, 1.00],
    ];

    const [start, end] = ranges[index];
    const fade = 0.04;

    let opacity = 0;
    let translateY = 16;

    if (index === 0) {
      if (scrollProgress < end - fade) {
        opacity = 1;
        translateY = 0;
      } else if (scrollProgress <= end) {
        const p = (scrollProgress - (end - fade)) / fade;
        opacity = 1 - p;
        translateY = -16 * p;
      } else {
        opacity = 0;
        translateY = -16;
      }
    } else if (index === ranges.length - 1) {
      if (scrollProgress < start) {
        opacity = 0;
        translateY = 16;
      } else if (scrollProgress <= start + fade) {
        const p = (scrollProgress - start) / fade;
        opacity = p;
        translateY = 16 * (1 - p);
      } else {
        opacity = 1;
        translateY = 0;
      }
    } else {
      if (scrollProgress < start - fade) {
        opacity = 0;
        translateY = 16;
      } else if (scrollProgress <= start + fade) {
        const p = (scrollProgress - (start - fade)) / (2 * fade);
        opacity = Math.min(1, Math.max(0, p));
        translateY = 16 * (1 - opacity);
      } else if (scrollProgress < end - fade) {
        opacity = 1;
        translateY = 0;
      } else if (scrollProgress <= end + fade) {
        const p = (scrollProgress - (end - fade)) / (2 * fade);
        opacity = Math.min(1, Math.max(0, 1 - p));
        translateY = -16 * (1 - opacity);
      } else {
        opacity = 0;
        translateY = -16;
      }
    }

    const blurPx = 4 * (1 - opacity);
    const scale = 0.97 + (0.03 * opacity);

    return {
      opacity,
      transform: `translateY(${translateY}px) scale(${scale})`,
      filter: `blur(${blurPx}px)`,
      pointerEvents: opacity > 0.1 ? ("auto" as const) : ("none" as const),
    };
  };

  return (
    <div ref={containerRef} className="h-[400vh] bg-bg0 -mt-1 relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center z-41">
        {/* Floating Text Overlay Positioned ABOVE the animation */}
        <div className="absolute top-24 md:top-28 left-4 right-4 z-20 flex flex-col items-center justify-center text-center pointer-events-none min-h-[100px]">
          {timelineSteps.map((step, idx) => {
            const animStyle = getStepOpacityAndTransform(idx);
            return (
              <div
                key={idx}
                style={animStyle}
                className="absolute max-w-xl mx-auto flex flex-col items-center transition-all duration-300 ease-out"
              >
                <h2 className="text-2xl md:text-4xl font-extrabold text-dark leading-snug tracking-tight drop-shadow-sm">
                  {step.heading}
                </h2>
                <p className="text-sm md:text-lg font-semibold text-fg0 mt-2 max-w-md leading-relaxed drop-shadow-sm">
                  {step.subtext}
                </p>
              </div>
            );
          })}
        </div>

        {/* Canvas Background */}
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    </div>
  );
}
