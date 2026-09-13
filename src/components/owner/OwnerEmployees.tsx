"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Users,
  Shield,
  Briefcase,
  Package,
  Truck,
  Phone,
  MapPin,
} from "lucide-react";

export function OwnerEmployees() {
  const { employees, targets, setRole } = useRouteFlowStore();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return Shield;
      case "salesperson":
        return Briefcase;
      case "warehouse":
        return Package;
      case "delivery":
        return Truck;
      default:
        return Users;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Wholesale Staff & Field Team</h3>
          <p className="text-xs text-slate-500">
            4 configured active roles across sales, operations, and logistics
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          All 4 Staff Present Today
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map((emp) => {
          const Icon = getRoleIcon(emp.role);
          const empTargets = targets.filter((t) => t.role === emp.role);

          return (
            <div
              key={emp.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                      <p className="text-xs font-semibold text-blue-800">{emp.title}</p>
                    </div>
                  </div>
                  <StatusBadge status={emp.attendanceStatus} size="sm" />
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{emp.assignedRoute}</span>
                  </div>
                </div>

                {/* Target Progress & Incentive */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="border border-slate-200 rounded-lg p-2.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Target Progress
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {emp.targetProgress}%
                    </span>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-2.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Estimated Incentive
                    </span>
                    <span className="font-extrabold text-sm text-emerald-700">
                      {emp.estimatedIncentive > 0 ? formatCurrency(emp.estimatedIncentive) : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Specific KPI */}
                {empTargets.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Primary Monthly Metric:
                    </span>
                    <div className="flex justify-between text-xs text-slate-700">
                      <span>{empTargets[0].metricName}</span>
                      <span className="font-bold">
                        {empTargets[0].unit === "₹"
                          ? `${formatCurrency(empTargets[0].currentValue)} / ${formatCurrency(empTargets[0].targetValue)}`
                          : `${empTargets[0].currentValue} / ${empTargets[0].targetValue} ${empTargets[0].unit}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setRole(emp.role)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg min-h-[44px] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Switch View to {emp.name}</span>
                <span className="text-slate-400 text-[10px]">({emp.role})</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
