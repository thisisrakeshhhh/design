"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";

export function SalesTargets() {
  const { targets } = useRouteFlowStore();

  const salesTargets = targets.filter((t) => t.role === "salesperson");

  const totalEstimatedIncentive = salesTargets.reduce(
    (sum, t) => sum + t.estimatedIncentive,
    0
  );

  return (
    <div className="space-y-5">
      {/* Top Incentive Banner */}
      <div className="bg-blue-900 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-bold text-blue-300 tracking-wider">
            September 2026 Earnings
          </span>
          <h2 className="text-2xl font-extrabold mt-1">
            {formatCurrency(totalEstimatedIncentive)}
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Total Estimated Field Incentive (Subject to owner month-end clearance)
          </p>
        </div>

        <div className="bg-blue-800/80 border border-blue-700 p-3 rounded-xl text-xs space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-blue-200">Approved Payout:</span>
            <span className="font-bold text-white">{formatCurrency(11200)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-blue-200">Pending Validation:</span>
            <span className="font-bold text-emerald-300">
              {formatCurrency(totalEstimatedIncentive - 11200)}
            </span>
          </div>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {salesTargets.map((tar) => {
          const pct = Math.min(100, Math.round((tar.currentValue / tar.targetValue) * 100));
          const remaining = Math.max(0, tar.targetValue - tar.currentValue);

          return (
            <div
              key={tar.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{tar.metricName}</h4>
                    <span className="text-[11px] text-slate-500">{tar.month}</span>
                  </div>
                  <span className="text-sm font-extrabold text-blue-900">{pct}%</span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-600" : "bg-amber-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-0.5">
                    <span>
                      Delivered:{" "}
                      <strong className="text-slate-900">
                        {tar.unit === "₹" ? formatCurrency(tar.currentValue) : `${tar.currentValue} ${tar.unit}`}
                      </strong>
                    </span>
                    <span>
                      Quota:{" "}
                      <strong className="text-slate-900">
                        {tar.unit === "₹" ? formatCurrency(tar.targetValue) : `${tar.targetValue} ${tar.unit}`}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining to Hit Target:</span>
                    <span className="font-semibold text-slate-700">
                      {tar.unit === "₹" ? formatCurrency(remaining) : `${remaining} ${tar.unit}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Incentive Formula:</span>
                    <span className="font-medium text-slate-700 text-right text-[11px]">
                      {tar.incentiveRate}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Estimated Incentive:</span>
                    <span className="font-extrabold text-emerald-700">
                      {formatCurrency(tar.estimatedIncentive)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
