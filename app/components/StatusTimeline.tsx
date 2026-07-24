"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

interface TimelineStep {
  id: string;
  label: string;
  timestamp?: string;
}

interface StatusTimelineProps {
  steps: TimelineStep[];
  currentStep: number;
}

export default function StatusTimeline({ steps, currentStep }: StatusTimelineProps) {
  return (
    <div className="flex flex-col">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4"
          >
            {/* Icon and line */}
            <div className="flex flex-col items-center">
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </motion.div>
              ) : isCurrent ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-8 h-8 rounded-full bg-fg0 flex items-center justify-center"
                >
                  <Clock className="w-5 h-5 text-white animate-pulse" />
                </motion.div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-bg1/10 flex items-center justify-center">
                  <Circle className="w-5 h-5 text-bg1/30" />
                </div>
              )}

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 h-12 mt-2 ${
                    isCompleted ? "bg-emerald-500" : "bg-bg1/10"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-base font-medium ${
                    isCompleted
                      ? "text-emerald-600"
                      : isCurrent
                      ? "text-bg1"
                      : "text-bg1/40"
                  }`}
                >
                  {step.label}
                </motion.p>
              </AnimatePresence>
              {step.timestamp && isCompleted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs text-bg1/50 mt-1"
                >
                  {step.timestamp}
                </motion.p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
