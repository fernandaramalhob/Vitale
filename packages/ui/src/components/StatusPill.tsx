import React from "react";

type S = "active" | "inactive" | "pending" | "success" | "warning" | "danger";

const styles: Record<S, string> = {
  active:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  inactive: "bg-white/8 text-white/40 border-white/10",
  pending:  "bg-amber-500/15 text-amber-400 border-amber-500/20",
  success:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  warning:  "bg-amber-500/15 text-amber-400 border-amber-500/20",
  danger:   "bg-red-500/15 text-red-400 border-red-500/20",
};

const dots: Record<S, string> = {
  active:   "bg-emerald-400",
  inactive: "bg-white/30",
  pending:  "bg-amber-400",
  success:  "bg-emerald-400",
  warning:  "bg-amber-400",
  danger:   "bg-red-400",
};

export function StatusPill({ status, label }: { status: S; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {label}
    </span>
  );
}
