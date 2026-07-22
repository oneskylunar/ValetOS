"use client";

import { useEffect, useRef, useState } from "react";

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
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];

    const loadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new window.Image();
        const paddedIndex = i.toString().padStart(3, "0");
        img.src = `/hero-video/ezgif-frame-${paddedIndex}.jpg`;

        img.onload = () => {
          if (i === 1) {
            window.dispatchEvent(new Event("scroll"));
          }
        };

        loadedImages.push(img);
      }
      imagesRef.current = loadedImages;
    };

    loadImages();
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const drawFrame = (index: number) => {
      const images = imagesRef.current;
      if (!canvasRef.current || !images[index] || !images[index].complete) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const img = images[index];
      const canvas = canvasRef.current;

      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      // Crop out baked-in black bars from ezgif frames (1920x1080)
      const sx = 160;
      const sy = 0;
      const sWidth = 1600;
      const sHeight = 1080;

      // Fit to screen width for mobile/tablet
      const scale = canvas.width / sWidth;

      const dWidth = sWidth * scale;
      const dHeight = sHeight * scale;
      const dx = 0;
      const dy = (canvas.height / 2) - (dHeight / 2);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const maxScroll = containerRef.current.scrollHeight - window.innerHeight;

      let scrollFraction = 0;
      if (rect.top <= 0) {
        scrollFraction = maxScroll > 0 ? -rect.top / maxScroll : 0;
      }

      if (scrollFraction < 0) scrollFraction = 0;
      if (scrollFraction > 1) scrollFraction = 1;

      setScrollProgress(scrollFraction);

      let frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      if (frameIndex < 0) frameIndex = 0;
      if (frameIndex >= frameCount) frameIndex = frameCount - 1;

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => drawFrame(frameIndex));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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

    return {
      opacity,
      transform: `translateY(${translateY}px)`,
      pointerEvents: opacity > 0.1 ? ("auto" as const) : ("none" as const),
    };
  };

  return (
    <div ref={containerRef} className="h-[400vh] bg-bg0 -mt-1 relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
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
