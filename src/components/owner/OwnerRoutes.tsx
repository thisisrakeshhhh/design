"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Navigation } from "lucide-react";

export function OwnerRoutes() {
  const { retailers, employees, setRole, setActiveTab } = useRouteFlowStore();

  const salesperson = employees.find((e) => e.role === "salesperson");
  const visitedCount = retailers.filter((r) => r.visitStatus === "Visited").length;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Active Distribution Beats & Routes</h3>
          <p className="text-xs text-slate-500">
            Jaipur Wholesale Distributors • Mansarovar Zone
          </p>
        </div>
        <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full w-fit">
          Beat Code: BEAT-04 Active Today
        </span>
      </div>

      {/* Main Beat Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-base font-extrabold text-slate-900">
                Mansarovar West Beat (BEAT-04)
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Covers Sector 9, Madhyam Marg, New Sanganer Road, Shipra Path & VT Circle
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRole("salesperson");
                setActiveTab("beat");
              }}
              className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 min-h-[40px]"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Simulate On Field</span>
            </button>
          </div>
        </div>

        {/* Route Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Assigned Sales Officer
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {salesperson?.name || "Rakesh Kumar"}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Beat Schedule
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              Daily (Mon - Sat)
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Registered Shops
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {retailers.length} Retailers
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Today&apos;s Visit Progress
            </span>
            <span className="font-bold text-emerald-700 mt-0.5 block">
              {visitedCount} of {retailers.length} Completed
            </span>
          </div>
        </div>

        {/* Retailers in Sequence */}
        <div>
          <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5">
            Retailers in Visit Sequence
          </h5>

          <div className="space-y-2">
            {retailers.map((r, idx) => {
              const isVisited = r.visitStatus === "Visited";

              return (
                <div
                  key={r.id}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    isVisited
                      ? "bg-emerald-50/40 border-emerald-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isVisited
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h6 className="font-bold text-slate-900">{r.name}</h6>
                      <p className="text-[11px] text-slate-500">
                        {r.ownerName} • {r.area}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Payment Due</span>
                      <span className="font-bold text-slate-800">
                        {formatCurrency(r.pendingAmount)}
                      </span>
                    </div>
                    <StatusBadge status={isVisited ? "Visited" : "Pending"} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
