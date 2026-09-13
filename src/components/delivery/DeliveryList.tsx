"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { Delivery } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DeliveryExecution } from "./DeliveryExecution";
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function DeliveryList() {
  const { deliveries } = useRouteFlowStore();
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  // Keep selected delivery in sync with store
  const activeDelivery = selectedDelivery
    ? deliveries.find((d) => d.id === selectedDelivery.id) || selectedDelivery
    : null;

  if (activeDelivery) {
    return (
      <DeliveryExecution
        delivery={activeDelivery}
        onBack={() => setSelectedDelivery(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Route Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-extrabold text-slate-900">
              Assigned Deliveries & Trip Manifest
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Logistics Executive: Suresh Yadav • Route Van #RJ-14-EA-4821
          </p>
        </div>

        <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full w-fit">
          {deliveries.filter((d) => d.status === "Delivered").length} of {deliveries.length}{" "}
          Deliveries Completed
        </span>
      </div>

      {/* Deliveries Sequence Cards */}
      <div className="space-y-3">
        {deliveries.map((del) => {
          const isDelivered = del.status === "Delivered";
          const isOut = del.status === "Out for Delivery";
          const isFailed = del.status === "Failed";

          return (
            <div
              key={del.id}
              className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                isOut
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : isDelivered
                  ? "border-emerald-200 bg-emerald-50/20"
                  : isFailed
                  ? "border-rose-200"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5 ${
                      isDelivered
                        ? "bg-emerald-600 text-white"
                        : isOut
                        ? "bg-blue-900 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isDelivered ? <CheckCircle2 className="w-4 h-4" /> : del.sequenceNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-950">
                        {del.retailerName}
                      </h4>
                      {isOut && (
                        <span className="text-[10px] font-extrabold bg-blue-100 text-blue-900 px-2 py-0.2 rounded uppercase">
                          En Route
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Order: <strong>{del.orderNumber}</strong> • Packages: {del.packageCount} Carton(s)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{del.address}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <StatusBadge status={del.status} size="sm" />
                  <div className="mt-2 text-xs">
                    <span className="text-[10px] text-slate-400 block">Collect</span>
                    <span className="font-extrabold text-slate-900">
                      {del.amountToCollect > 0 ? formatCurrency(del.amountToCollect) : "Credit"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 font-medium">
                  Payment: <strong className="text-slate-800">{del.paymentType}</strong>
                </div>

                <button
                  onClick={() => setSelectedDelivery(del)}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px] shadow-xs"
                >
                  <span>{isDelivered ? "View Delivery Receipt" : "Open Delivery"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
