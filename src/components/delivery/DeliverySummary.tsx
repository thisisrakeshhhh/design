"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { MetricCard } from "@/components/shared/MetricCard";
import { Truck, Wallet, ShieldCheck } from "lucide-react";

export function DeliverySummary() {
  const { targets } = useRouteFlowStore();

  const delTargets = targets.filter((t) => t.role === "delivery");

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900">
          Delivery Performance & Earnings Summary
        </h3>
        <p className="text-xs text-slate-500">
          Suresh Yadav • Monthly logistics KPIs & incentive metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Successful Deliveries"
          value="184 / 240"
          subtext="77% of monthly quota"
          icon={Truck}
          variant="brand"
        />
        <MetricCard
          label="Delivery Success Rate"
          value="96.0%"
          subtext="Target >=95% (Bonus active)"
          icon={ShieldCheck}
          variant="success"
        />
        <MetricCard
          label="Field Collections"
          value={formatCurrency(235000)}
          subtext={`Target: ${formatCurrency(300000)}`}
          icon={Wallet}
          variant="default"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Performance Quota Details
        </h4>

        <div className="space-y-3">
          {delTargets.map((tar) => {
            const pct = Math.min(100, Math.round((tar.currentValue / tar.targetValue) * 100));

            return (
              <div
                key={tar.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{tar.metricName}</span>
                  <span className="font-extrabold text-blue-900">{pct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-900 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>
                    Current:{" "}
                    <strong>
                      {tar.unit === "₹" ? formatCurrency(tar.currentValue) : `${tar.currentValue} ${tar.unit}`}
                    </strong>
                  </span>
                  <span>
                    Quota:{" "}
                    <strong>
                      {tar.unit === "₹" ? formatCurrency(tar.targetValue) : `${tar.targetValue} ${tar.unit}`}
                    </strong>
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-medium text-slate-700">
                  <span>Incentive Rule: {tar.incentiveRate}</span>
                  <span className="font-bold text-emerald-700">
                    Est: {formatCurrency(tar.estimatedIncentive)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
