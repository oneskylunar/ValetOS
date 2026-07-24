"use client";

import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function OTPInput({ length = 6, onComplete, error, disabled }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    const joinedOtp = newOtp.join("");
    if (joinedOtp.length === length) {
      onComplete(joinedOtp);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);

    if (!/^\d+$/.test(pastedData)) return; // Only digits

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus last filled input or first empty
    const lastFilledIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();

    // Check if complete
    if (pastedData.length === length) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
              ${error
                ? "border-red-400 bg-red-50 text-red-600"
                : "border-bg1/20 bg-white text-bg1 focus:border-fg0 focus:ring-2 focus:ring-fg0/20"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            placeholder="•"
          />
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
