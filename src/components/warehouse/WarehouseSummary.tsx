"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { MetricCard } from "@/components/shared/MetricCard";
import { Package, Clock, ShieldCheck } from "lucide-react";

export function WarehouseSummary() {
  const { targets } = useRouteFlowStore();

  const whTargets = targets.filter((t) => t.role === "warehouse");

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900">
          Warehouse Daily Operations Summary
        </h3>
        <p className="text-xs text-slate-500">
          Jaipur Main Warehouse • Shift performance and picking metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Picking Accuracy"
          value="98.5%"
          subtext="Target: >=98% (Met)"
          icon={ShieldCheck}
          variant="success"
        />
        <MetricCard
          label="On-Time Dispatch"
          value="94.0%"
          subtext="Target: 95% (Near target)"
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          label="Cartons Packed"
          value="238 / 300"
          subtext="79% of monthly target"
          icon={Package}
          variant="brand"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Warehouse Operations Targets
        </h4>

        <div className="space-y-4">
          {whTargets.map((tar) => {
            const pct = Math.min(100, Math.round((tar.currentValue / tar.targetValue) * 100));

            return (
              <div key={tar.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
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
                    Current: <strong>{tar.currentValue} {tar.unit}</strong>
                  </span>
                  <span>
                    Target: <strong>{tar.targetValue} {tar.unit}</strong>
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
