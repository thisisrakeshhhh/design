"use client";

import React, { useMemo } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/formatters";
import {
  Package,
  Boxes,
  Truck,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

export function WarehouseDash() {
  const { orders, products, setActiveTab } = useRouteFlowStore();

  const waitingForPicking = useMemo(() => {
    return orders.filter((o) => o.status === "Approved");
  }, [orders]);

  const currentlyBeingPacked = useMemo(() => {
    return orders.filter((o) => o.status === "Picking" || o.status === "Packed");
  }, [orders]);

  const readyForDispatch = useMemo(() => {
    return orders.filter((o) => o.status === "Ready for Dispatch");
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.warehouseStock <= p.lowStockThreshold).length;
  }, [products]);

  const completedToday = useMemo(() => {
    return orders.filter(
      (o) => o.status === "Delivered" || o.status === "Out for Delivery"
    ).length;
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Approved Orders Need Picking */}
      {waitingForPicking.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
              <Boxes className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-950">
                {waitingForPicking.length} Approved Wholesale Order(s) Awaiting Picking
              </p>
              <p className="text-[11px] text-blue-700">
                Approved by Owner Amit Agarwal. Start picking to prepare cartons.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("pending-orders")}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[40px] shrink-0"
          >
            <span>Open Picking Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6 Warehouse KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Waiting Pick"
          value={waitingForPicking.length}
          subtext="Approved orders"
          icon={Clock}
          variant={waitingForPicking.length > 0 ? "warning" : "default"}
          onClick={() => setActiveTab("pending-orders")}
        />
        <MetricCard
          label="In Packing"
          value={currentlyBeingPacked.length}
          subtext="Picking & carton packing"
          icon={Package}
          variant="brand"
          onClick={() => setActiveTab("pending-orders")}
        />
        <MetricCard
          label="Ready Dispatch"
          value={readyForDispatch.length}
          subtext="Staged in Bay 2"
          icon={Truck}
          variant="success"
        />
        <MetricCard
          label="Low Stock"
          value={lowStockCount}
          subtext="Needs reorder inward"
          icon={AlertCircle}
          variant={lowStockCount > 0 ? "danger" : "default"}
          onClick={() => setActiveTab("inventory")}
        />
        <MetricCard
          label="Pending Returns"
          value="1"
          subtext="Shop inspection queue"
          icon={RotateCcw}
          variant="default"
          onClick={() => setActiveTab("returns")}
        />
        <MetricCard
          label="Completed Today"
          value={completedToday}
          subtext="Dispatched & delivered"
          icon={CheckCircle2}
          variant="default"
        />
      </div>

      {/* Operational Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders Waiting for Fulfilment */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Fulfilment Queue</h3>
              <p className="text-xs text-slate-500">Orders ready for picking & packing</p>
            </div>
            <button
              onClick={() => setActiveTab("pending-orders")}
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              View All ({waitingForPicking.length + currentlyBeingPacked.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {[...waitingForPicking, ...currentlyBeingPacked].slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                onClick={() => setActiveTab("pending-orders")}
                className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ord.orderNumber}</span>
                    <StatusBadge status={ord.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {ord.retailerName} • {ord.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {formatCurrency(ord.totalAmount)}
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold">Start Process →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Inventory Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Critical Stock Bins</h3>
              <p className="text-xs text-slate-500">Fast-moving SKUs requiring replenishment</p>
            </div>
            <button
              onClick={() => setActiveTab("inventory")}
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Warehouse Inventory →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {products.slice(0, 4).map((p) => {
              const isLow = p.warehouseStock <= p.lowStockThreshold;

              return (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.name}</p>
                    <p className="text-[10px] text-slate-500">
                      SKU: {p.sku} • Bin A-0{p.id.replace("prod-", "")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isLow
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {p.warehouseStock} {p.unit}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Reserved: {p.reservedStock}
                    </span>
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
