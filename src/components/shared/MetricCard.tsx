import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger" | "brand";
  onClick?: () => void;
}

export function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "default",
  onClick,
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-white border-slate-200 text-slate-900",
    brand: "bg-blue-50/50 border-blue-200 text-blue-950",
    success: "bg-emerald-50/40 border-emerald-200 text-emerald-950",
    warning: "bg-amber-50/40 border-amber-200 text-amber-950",
    danger: "bg-rose-50/40 border-rose-200 text-rose-950",
  }[variant];

  const iconStyles = {
    default: "bg-slate-100 text-slate-700",
    brand: "bg-blue-600 text-white",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-white",
    danger: "bg-rose-600 text-white",
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 shadow-xs flex items-center justify-between gap-3 ${variantStyles} ${
        onClick ? "cursor-pointer hover:border-slate-300 transition-colors" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-slate-900">{value}</p>
        {subtext && <p className="text-[11px] text-slate-500 mt-0.5">{subtext}</p>}
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconStyles}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
