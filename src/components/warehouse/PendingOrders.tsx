"use client";

import React, { useState, useMemo } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { Order } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OrderPickPack } from "./OrderPickPack";
import {
  Boxes,
  ArrowRight,
} from "lucide-react";

export function PendingOrders() {
  const { orders } = useRouteFlowStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Keep selected order synced with store state updates
  const activeSelectedOrder = useMemo(() => {
    if (!selectedOrder) return null;
    return orders.find((o) => o.id === selectedOrder.id) || selectedOrder;
  }, [orders, selectedOrder]);

  const pendingOrders = useMemo(() => {
    return orders.filter((o) => {
      // Warehouse manager primarily processes Approved, Picking, Packed, and Ready for Dispatch
      const isFulfilmentStatus = [
        "Approved",
        "Picking",
        "Packed",
        "Ready for Dispatch",
      ].includes(o.status);

      if (!isFulfilmentStatus) return false;
      if (statusFilter !== "all" && o.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [orders, statusFilter]);

  if (activeSelectedOrder) {
    return (
      <OrderPickPack
        order={activeSelectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Warehouse Pending Fulfilment Queue
          </h3>
          <p className="text-xs text-slate-500">
            Showing wholesale orders approved for warehouse picking and packing
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {["all", "approved", "picking", "packed", "ready for dispatch"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap min-h-[36px] transition-colors ${
                statusFilter === st
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {st === "all" ? "All Pending" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {pendingOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Boxes className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">No Orders in this Queue</h4>
          <p className="text-slate-500 max-w-sm mx-auto">
            Orders submitted by salesperson and approved by Owner will appear here for physical picking and packing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingOrders.map((ord) => {
            const isApproved = ord.status === "Approved";
            const isPicking = ord.status === "Picking";
            const isPacked = ord.status === "Packed";

            return (
              <div
                key={ord.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        {ord.orderNumber}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-950 mt-0.5">
                        {ord.retailerName}
                      </h4>
                    </div>
                    <StatusBadge status={ord.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 my-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Items to Pick
                      </span>
                      <span className="font-bold text-slate-900">
                        {ord.items.length} Product SKUs
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Order Value
                      </span>
                      <span className="font-extrabold text-blue-900">
                        {formatCurrency(ord.totalAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Sales Officer
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {ord.salespersonName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Route Beat
                      </span>
                      <span className="font-medium text-slate-700">
                        {ord.beatName}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    {isApproved && "⚡ Action Required: Start picking items from warehouse."}
                    {isPicking && "📦 In Progress: Confirm picked quantities and cartons."}
                    {isPacked && "🚚 Ready: Assign driver and stage for delivery."}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(ord)}
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors min-h-[44px] shadow-xs"
                >
                  <span>
                    {isApproved
                      ? "Open Order & Pick Products"
                      : isPicking
                      ? "Continue Carton Packing"
                      : "Stage & Assign Dispatch"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
