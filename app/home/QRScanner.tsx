"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/app/lib/motion";

interface QRScannerProps {
  onScan?: (data: string) => void;
}

type ScannerState = "idle" | "scanning" | "error";

export default function QRScanner({ onScan }: QRScannerProps) {
  const [state, setState] = useState<ScannerState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMessage(null);

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      setState("scanning");

      // Small delay to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(console.error);
        }
      }, 50);

      // TODO:
      // Detect whether scanned QR is a valet token or self-parking QR
      // Route accordingly

    } catch (err) {
      console.error("Camera error:", err);
      setState("error");

      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setErrorMessage("Camera access was denied. Please enable camera permissions in your browser or device settings to scan QR codes.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setErrorMessage("No camera found on this device. Please use a device with a camera to scan QR codes.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setErrorMessage("Camera is already in use by another app. Please close other apps using the camera and try again.");
        } else {
          setErrorMessage(`Unable to access camera: ${err.message}`);
        }
      } else {
        setErrorMessage("An unexpected error occurred while trying to access the camera.");
      }
    }
  }, []);

  const retryCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setState("idle");
    setErrorMessage(null);
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setState("idle");
  }, []);

  return (
    <motion.div
      className="w-full max-w-sm mx-auto"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <div
        className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer bg-dark shadow-2xl"
        onClick={state === "idle" || state === "error" ? startCamera : undefined}
        role="button"
        tabIndex={0}
        aria-label={state === "idle" ? "Tap to scan QR code" : state === "scanning" ? "QR scanner active" : "Retry camera"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (state === "idle" || state === "error") {
              startCamera();
            }
          }
        }}
      >
        {/* Video element - always in DOM, controlled by state */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            state === "scanning" ? "opacity-100" : "opacity-0"
          }`}
          playsInline
          muted
          autoPlay
        />

        {/* Idle State - Decorative Cover */}
        {state === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-dark-valet via-dark to-dark p-8">
            {/* Animated Glow Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-fg0/20 via-transparent to-fg0/10 animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-fg0/5 blur-3xl animate-ping" />
            </div>

            {/* Scanner Frame Decoration */}
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 border-2 border-dashed border-fg0/40 rounded-2xl animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-2 border-2 border-fg0/30 rounded-xl" />

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-fg0/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-fg0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tap to Scan Text */}
            <motion.p
              className="relative text-lg font-bold text-fg0 text-center"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Tap to Scan
            </motion.p>

            <p className="relative text-xs text-fg0/60 mt-2 text-center">
              Scan valet token or parking space QR
            </p>
          </div>
        )}

        {/* Scanner Overlay (visible when scanning) */}
        {state === "scanning" && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner Markers */}
            <div className="absolute inset-8">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-fg0 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-fg0 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-fg0 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-fg0 rounded-br-lg" />
            </div>

            {/* Scan Line Animation */}
            <motion.div
              className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-fg0 to-transparent"
              animate={{ top: ["20%", "80%", "20%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopCamera();
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark/80 flex items-center justify-center pointer-events-auto"
              aria-label="Close scanner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-fg0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Instructions */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-fg0 text-sm font-medium bg-dark/60 py-2 px-4 rounded-full inline-block">
                Align QR code within the frame
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {state === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark p-6">
            {/* Error Icon */}
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <p className="text-fg0 text-center text-sm font-medium mb-2">
              {errorMessage || "Unable to access camera"}
            </p>

            {/* Retry Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                retryCamera();
              }}
              className="mt-4 px-6 py-2.5 text-sm font-bold text-dark bg-fg0 hover:bg-fg0/90 transition-all rounded-full"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
