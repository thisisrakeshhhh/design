"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { Modal } from "@/components/shared/Modal";
import {
  Plus,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function OwnerTargets() {
  const { targets, employees, addNewTarget, addToast } = useRouteFlowStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[1]?.id || "");
  const [metricName, setMetricName] = useState("Weekly FMCG Growth Target");
  const [targetVal, setTargetVal] = useState(100000);
  const [metricUnit, setMetricUnit] = useState("₹");
  const [incentiveRule, setIncentiveRule] = useState("1.5% bonus on delivery target");

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === selectedEmployeeId);
    if (!emp) return;

    addNewTarget({
      employeeId: emp.id,
      employeeName: emp.name,
      role: emp.role,
      metricName,
      targetValue: targetVal,
      unit: metricUnit,
      month: "September 2026",
      incentiveRate: incentiveRule,
    });

    setIsCreateModalOpen(false);
  };

  const handleApproveIncentive = (targetId: string, amount: number) => {
    addToast({
      type: "success",
      title: "Incentive Approved",
      message: `Approved payout of ${formatCurrency(amount)} for this target.`,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header and Create Button */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Employee Performance Targets & Incentives
          </h3>
          <p className="text-xs text-slate-500">
            Transparent distributor incentive calculation engine
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 min-h-[40px] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Target</span>
        </button>
      </div>

      {/* Rules Explanation Box */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs space-y-2">
        <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-700" /> Distributor Incentive Governance Rules
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-700 mt-2">
          <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-lg border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Only delivered & verified wholesale sales count toward quotas.</span>
          </div>
          <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-lg border border-blue-100">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Cancelled or rejected orders do not generate incentive credit.</span>
          </div>
          <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-lg border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Incentives remain estimated until final end-of-month owner approval.</span>
          </div>
        </div>
      </div>

      {/* Targets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {targets.map((tar) => {
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {tar.employeeName} ({tar.role})
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1.5">
                      {tar.metricName}
                    </h4>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{pct}%</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-600" : "bg-amber-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      Done:{" "}
                      <strong className="text-slate-900">
                        {tar.unit === "₹" ? formatCurrency(tar.currentValue) : `${tar.currentValue} ${tar.unit}`}
                      </strong>
                    </span>
                    <span>
                      Target:{" "}
                      <strong className="text-slate-900">
                        {tar.unit === "₹" ? formatCurrency(tar.targetValue) : `${tar.targetValue} ${tar.unit}`}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining to Achieve:</span>
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

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">
                  Approved:{" "}
                  <strong className="text-slate-800">
                    {formatCurrency(tar.approvedIncentive)}
                  </strong>
                </span>
                <button
                  onClick={() => handleApproveIncentive(tar.id, tar.estimatedIncentive)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors min-h-[36px]"
                >
                  Approve Incentive Payout
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Monthly Performance Target"
        subtitle="Set realistic wholesale KPIs with transparent incentive formulas."
        maxWidth="md"
      >
        <form onSubmit={handleCreateTarget} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Assign to Employee:</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 min-h-[40px]"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} — {emp.title} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Metric Name:</label>
            <input
              type="text"
              required
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              placeholder="e.g., Edible Oils Beat Volume"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Value:</label>
              <input
                type="number"
                required
                min="1"
                value={targetVal}
                onChange={(e) => setTargetVal(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit of Measurement:</label>
              <select
                value={metricUnit}
                onChange={(e) => setMetricUnit(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              >
                <option value="₹">Rupees (₹ Sales)</option>
                <option value="Orders">Orders</option>
                <option value="Shops">Shops / Visits</option>
                <option value="Deliveries">Deliveries</option>
                <option value="%">% Percentage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Incentive Formula / Rule:</label>
            <input
              type="text"
              required
              value={incentiveRule}
              onChange={(e) => setIncentiveRule(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              placeholder="e.g., 2% on achievement over 90%"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg min-h-[44px]"
            >
              Save & Assign Target
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
