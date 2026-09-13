"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ActiveShopVisit } from "./ActiveShopVisit";
import {
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export function TodayBeat() {
  const { retailers } = useRouteFlowStore();
  const [activeVisitOpen, setActiveVisitOpen] = useState(false);

  if (activeVisitOpen) {
    return <ActiveShopVisit onBackToBeat={() => setActiveVisitOpen(false)} />;
  }

  return (
    <div className="space-y-4">
      {/* Route Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-extrabold text-slate-900">
              Today&apos;s Beat: Mansarovar West (BEAT-04)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow planned visit sequence for maximum efficiency
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            {retailers.filter((r) => r.visitStatus === "Visited").length} of {retailers.length}{" "}
            Shops Visited
          </span>
        </div>
      </div>

      {/* Sequenced Retailer Cards */}
      <div className="space-y-3">
        {retailers.map((r, idx) => {
          const isVisited = r.visitStatus === "Visited";
          const isNext = !isVisited && idx === 0;

          return (
            <div
              key={r.id}
              className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                isNext
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : isVisited
                  ? "border-slate-200 opacity-80"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5 ${
                      isVisited
                        ? "bg-emerald-600 text-white"
                        : isNext
                        ? "bg-blue-900 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isVisited ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-950">{r.name}</h4>
                      {isNext && (
                        <span className="text-[10px] font-extrabold bg-blue-100 text-blue-900 px-2 py-0.2 rounded uppercase">
                          Next Stop
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Proprietor: {r.ownerName}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{r.address}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <StatusBadge status={isVisited ? "Visited" : "Pending"} size="sm" />
                  <div className="mt-2 text-xs">
                    <span className="text-[10px] text-slate-400 block">Pending</span>
                    <span
                      className={`font-bold ${
                        r.pendingAmount > 0 ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {formatCurrency(r.pendingAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons with 44px+ touch targets */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${r.phone}`}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[44px] px-3"
                    aria-label={`Call ${r.name}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-800" />
                    <span className="hidden xs:inline">Call</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${r.name}, ${r.address}, Jaipur`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[44px] px-3"
                    aria-label={`Directions to ${r.name}`}
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-800" />
                    <span className="hidden xs:inline">Directions</span>
                  </a>
                </div>

                <button
                  onClick={() => setActiveVisitOpen(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px] ${
                    isVisited
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      : "bg-blue-900 hover:bg-blue-800 text-white shadow-xs"
                  }`}
                >
                  <span>{isVisited ? "Revisit Store" : "Start Visit"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
