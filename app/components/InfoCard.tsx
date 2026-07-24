"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string | ReactNode;
  accent?: boolean;
}

export default function InfoCard({ icon: Icon, label, value, accent = false }: InfoCardProps) {
  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-3 ${
        accent
          ? "bg-fg0/10 border-fg0/20"
          : "bg-white/50 border-bg1/10"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          accent ? "bg-fg0/20" : "bg-bg1/10"
        }`}
      >
        <Icon className={`w-5 h-5 ${accent ? "text-fg0" : "text-bg1/70"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-bg1/60 uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-base font-bold text-bg1 truncate ${typeof value !== 'string' ? 'whitespace-normal' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
