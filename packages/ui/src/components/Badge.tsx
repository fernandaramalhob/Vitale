import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "ai";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-white/70 border border-white/10",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  danger:  "bg-red-500/15 text-red-400 border border-red-500/20",
  info:    "bg-sky-500/15 text-sky-400 border border-sky-500/20",
  ai:      "bg-violet-500/15 text-violet-300 border border-violet-500/20",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
