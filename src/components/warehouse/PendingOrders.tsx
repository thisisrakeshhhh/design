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
  PackageCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";

export function PendingOrders() {
  const { orders } = useRouteFlowStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeQueue, setActiveQueue] = useState<"pick" | "pack" | "ready">("pick");

  // Keep selected order synced with store state updates
  const activeSelectedOrder = useMemo(() => {
    if (!selectedOrder) return null;
    return orders.find((o) => o.id === selectedOrder.id) || selectedOrder;
  }, [orders, selectedOrder]);

  // Three Obvious Queues:
  // 1. Orders to Pick: Approved orders
  const ordersToPick = useMemo(
    () => orders.filter((o) => o.status === "Approved"),
    [orders]
  );

  // 2. Orders to Pack: In Picking
  const ordersToPack = useMemo(
    () => orders.filter((o) => o.status === "Picking"),
    [orders]
  );

  // 3. Ready for Delivery: Packed or Ready for Dispatch
  const readyForDelivery = useMemo(
    () => orders.filter((o) => o.status === "Packed" || o.status === "Ready for Dispatch"),
    [orders]
  );

  const displayedOrders = useMemo(() => {
    switch (activeQueue) {
      case "pick":
        return ordersToPick;
      case "pack":
        return ordersToPack;
      case "ready":
        return readyForDelivery;
    }
  }, [activeQueue, ordersToPick, ordersToPack, readyForDelivery]);

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
      {/* 3 Obvious Queues Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Warehouse Order Queues
          </h3>
          <p className="text-xs text-slate-500">
            Pick products, pack cartons, and hand over orders to delivery drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => setActiveQueue("pick")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all min-h-[52px] ${
              activeQueue === "pick"
                ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Boxes className="w-5 h-5" />
              <div>
                <span className="font-extrabold text-xs block">1. Orders to Pick</span>
                <span className={`text-[10px] ${activeQueue === "pick" ? "text-blue-200" : "text-slate-400"}`}>
                  Approved by Owner
                </span>
              </div>
            </div>
            <span
              className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded-full ${
                activeQueue === "pick"
                  ? "bg-white text-blue-900"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {ordersToPick.length}
            </span>
          </button>

          <button
            onClick={() => setActiveQueue("pack")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all min-h-[52px] ${
              activeQueue === "pack"
                ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <PackageCheck className="w-5 h-5" />
              <div>
                <span className="font-extrabold text-xs block">2. Orders to Pack</span>
                <span className={`text-[10px] ${activeQueue === "pack" ? "text-blue-200" : "text-slate-400"}`}>
                  Pack into cartons
                </span>
              </div>
            </div>
            <span
              className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded-full ${
                activeQueue === "pack"
                  ? "bg-white text-blue-900"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {ordersToPack.length}
            </span>
          </button>

          <button
            onClick={() => setActiveQueue("ready")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all min-h-[52px] ${
              activeQueue === "ready"
                ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5" />
              <div>
                <span className="font-extrabold text-xs block">3. Ready for Delivery</span>
                <span className={`text-[10px] ${activeQueue === "ready" ? "text-blue-200" : "text-slate-400"}`}>
                  Assign driver
                </span>
              </div>
            </div>
            <span
              className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded-full ${
                activeQueue === "ready"
                  ? "bg-white text-blue-900"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {readyForDelivery.length}
            </span>
          </button>
        </div>
      </div>

      {/* Orders List for Active Queue */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            No Orders in &quot;{activeQueue === "pick" ? "Orders to Pick" : activeQueue === "pack" ? "Orders to Pack" : "Ready for Delivery"}&quot;
          </h4>
          <p className="text-slate-500 max-w-sm mx-auto">
            All orders in this stage have been completed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedOrders.map((ord) => {
            const isApproved = ord.status === "Approved";
            const isPicking = ord.status === "Picking";

            return (
              <div
                key={ord.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-700">
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
                        Products to Pick
                      </span>
                      <span className="font-bold text-slate-900">
                        {ord.items.length} Products
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
                        Salesperson
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {ord.salespersonName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Beat Route
                      </span>
                      <span className="font-medium text-slate-700">
                        {ord.beatName}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">
                    {isApproved && "Order approved by Owner. Ready to pick from shelves."}
                    {isPicking && "Items being picked. Pack into cartons and record box count."}
                    {!isApproved && !isPicking && "Cartons packed. Hand over to delivery driver."}
                  </p>
                </div>

                {/* One Clear Next Action per order */}
                <button
                  onClick={() => setSelectedOrder(ord)}
                  className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors min-h-[44px] shadow-xs"
                >
                  <span>
                    {isApproved
                      ? "Start Picking"
                      : isPicking
                      ? "Pack in Cartons"
                      : "Assign Delivery"}
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
