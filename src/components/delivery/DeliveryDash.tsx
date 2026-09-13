"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Truck,
  CheckCircle2,
  Clock,
  Wallet,
  ArrowRight,
} from "lucide-react";

export function DeliveryDash() {
  const { deliveries, setActiveTab } = useRouteFlowStore();

  const outForDelivery = deliveries.filter((d) => d.status === "Out for Delivery");
  const completedDeliveries = deliveries.filter((d) => d.status === "Delivered");
  const remainingDeliveries = deliveries.filter((d) => d.status !== "Delivered");

  const totalToCollect = deliveries.reduce((acc, d) => acc + (d.amountToCollect || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Out for Delivery or Pending Load */}
      {outForDelivery.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-950">
                {outForDelivery.length} Order(s) Currently Out for Delivery
              </p>
              <p className="text-[11px] text-blue-700">
                Loaded on van. Proceed to destination and capture OTP delivery proof.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("deliveries")}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[40px] shrink-0"
          >
            <span>Open Delivery List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6 Delivery KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Assigned"
          value={deliveries.length}
          subtext="Today's consignment"
          icon={Truck}
          variant="brand"
          onClick={() => setActiveTab("deliveries")}
        />
        <MetricCard
          label="Completed"
          value={completedDeliveries.length}
          subtext="Delivered & verified"
          icon={CheckCircle2}
          variant="success"
        />
        <MetricCard
          label="Remaining"
          value={remainingDeliveries.length}
          subtext="To deliver today"
          icon={Clock}
          variant={remainingDeliveries.length > 0 ? "warning" : "default"}
          onClick={() => setActiveTab("deliveries")}
        />
        <MetricCard
          label="To Collect"
          value={formatCurrency(totalToCollect)}
          subtext="Cash/UPI pending"
          icon={Wallet}
          variant="default"
        />
        <MetricCard
          label="Collected"
          value={formatCurrency(2740)}
          subtext="Verified on field"
          icon={CheckCircle2}
          variant="success"
          onClick={() => setActiveTab("collections")}
        />
        <MetricCard
          label="Cash in Hand"
          value={formatCurrency(0)}
          subtext="Waiting for cashier"
          icon={Wallet}
          variant="default"
          onClick={() => setActiveTab("collections")}
        />
      </div>

      {/* Assigned Route Consignments */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today&apos;s Assigned Consignments</h3>
            <p className="text-xs text-slate-500">Mansarovar Corridor Logistics Van #RJ-14-EA-4821</p>
          </div>
          <button
            onClick={() => setActiveTab("deliveries")}
            className="text-xs font-bold text-blue-700 hover:underline"
          >
            Full Trip Manifest ({deliveries.length}) →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {deliveries.map((del) => (
            <div
              key={del.id}
              onClick={() => setActiveTab("deliveries")}
              className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs flex items-center justify-center shrink-0">
                  {del.sequenceNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{del.retailerName}</span>
                    <StatusBadge status={del.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Order: {del.orderNumber} • {del.packageCount} Cartons • {del.area}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-900 block">
                  {del.amountToCollect > 0 ? formatCurrency(del.amountToCollect) : "Credit Account"}
                </span>
                <span className="text-[10px] text-blue-700 font-bold">Open Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
