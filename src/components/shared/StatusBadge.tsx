import React from "react";
import { OrderStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";

  const lower = status.toLowerCase();

  if (
    lower === "approved" ||
    lower === "delivered" ||
    lower === "visited" ||
    lower === "healthy" ||
    lower === "active" ||
    lower === "present"
  ) {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (
    lower === "submitted" ||
    lower === "out for delivery" ||
    lower === "assigned"
  ) {
    colorClasses = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (
    lower === "picking" ||
    lower === "packed" ||
    lower === "ready for dispatch" ||
    lower === "pending" ||
    lower === "remaining" ||
    lower === "low stock" ||
    lower === "under review" ||
    lower === "draft"
  ) {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (
    lower === "rejected" ||
    lower === "cancelled" ||
    lower === "returned" ||
    lower === "failed" ||
    lower === "credit blocked" ||
    lower === "overdue"
  ) {
    colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
  }

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5"
      : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeClasses} ${colorClasses} whitespace-nowrap select-none`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {status}
    </span>
  );
}
