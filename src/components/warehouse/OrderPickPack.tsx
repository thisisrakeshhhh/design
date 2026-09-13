"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { Order } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Boxes,
  Truck,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface OrderPickPackProps {
  order: Order;
  onBack: () => void;
}

export function OrderPickPack({ order, onBack }: OrderPickPackProps) {
  const {
    products,
    startPickingOrder,
    completePackingOrder,
    dispatchOrder,
    setRole,
    setActiveTab,
  } = useRouteFlowStore();

  // Picked quantities state: default to all requested items
  const [pickedQuantities, setPickedQuantities] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    order.items.forEach((item) => {
      map[item.productId] = item.quantity + (item.freeQuantity || 0);
    });
    return map;
  });

  const [packageCount, setPackageCount] = useState<number>(order.packageCount || 2);
  const [packingNotes, setPackingNotes] = useState<string>(
    order.packingNotes || "Packed in double-corrugated carton with bubble wrap."
  );
  const [assignedDriver, setAssignedDriver] = useState<string>(
    order.assignedDeliveryExecutive || "Suresh Yadav"
  );

  const isApproved = order.status === "Approved";
  const isPicking = order.status === "Picking";
  const isPacked = order.status === "Packed";
  const isDispatched =
    order.status === "Ready for Dispatch" ||
    order.status === "Out for Delivery" ||
    order.status === "Delivered";

  const handleStartPicking = () => {
    startPickingOrder(order.id);
  };

  const handleConfirmPacking = () => {
    const pickedList = order.items.map((item) => ({
      productId: item.productId,
      requestedQty: item.quantity + (item.freeQuantity || 0),
      pickedQty: pickedQuantities[item.productId] ?? item.quantity,
    }));

    completePackingOrder(order.id, pickedList, packageCount, packingNotes);
  };

  const handleDispatch = () => {
    dispatchOrder(order.id, assignedDriver);
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Status Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pending Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Current Status:</span>
          <StatusBadge status={order.status} size="sm" />
        </div>
      </div>

      {/* Main Order Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
              Wholesale Order Picking Slip
            </span>
            <h2 className="text-xl font-extrabold text-slate-950 mt-1">
              {order.orderNumber}
            </h2>
            <p className="text-xs text-slate-500">
              Retailer: <strong>{order.retailerName}</strong> • Sales: {order.salespersonName}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Invoiced Total
            </span>
            <span className="text-lg font-extrabold text-slate-950">
              {formatCurrency(order.totalAmount)}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 block">
              Payment: {order.paymentType}
            </span>
          </div>
        </div>

        {/* Workflow Progression Stepper */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isApproved || isPicking || isPacked || isDispatched
                ? "bg-blue-100/70 text-blue-900 font-bold"
                : "text-slate-400"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>1. Approved by Owner</span>
          </div>
          <div
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isPicking || isPacked || isDispatched
                ? "bg-blue-100/70 text-blue-900 font-bold"
                : "text-slate-400"
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>2. Pick & Confirm</span>
          </div>
          <div
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isPacked || isDispatched
                ? "bg-emerald-100/70 text-emerald-900 font-bold"
                : "text-slate-400"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>3. Pack & Dispatch</span>
          </div>
        </div>

        {/* Action 1: If Approved, Show "Start Picking" button */}
        {isApproved && (
          <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-blue-950">Ready for Warehouse Picking</h4>
              <p className="text-[11px] text-blue-800 mt-0.5">
                Generate bin pick-list and initiate physical retrieval from warehouse aisles.
              </p>
            </div>
            <button
              onClick={handleStartPicking}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors min-h-[44px] shrink-0"
            >
              Start Picking
            </button>
          </div>
        )}

        {/* Product Pick Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Order Items to Pick ({order.items.length} Products)
          </h4>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Product / SKU</th>
                  <th className="py-2.5 px-3 text-center">Bin Location</th>
                  <th className="py-2.5 px-3 text-center">Requested Qty</th>
                  <th className="py-2.5 px-3 text-center">Warehouse Stock</th>
                  <th className="py-2.5 px-3 text-center">Confirmed Picked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item) => {
                  const prod = products.find((p) => p.id === item.productId);
                  const totalRequested = item.quantity + (item.freeQuantity || 0);
                  const picked = pickedQuantities[item.productId] ?? totalRequested;

                  return (
                    <tr key={item.productId} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{item.productName}</div>
                        <div className="text-[10px] text-slate-500">
                          SKU: {item.sku}
                          {item.freeQuantity > 0 && (
                            <span className="ml-1.5 font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                              +{item.freeQuantity} Free Scheme
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-600">
                        Aisle A-0{item.productId.replace("prod-", "")}
                      </td>
                      <td className="py-3 px-3 text-center font-extrabold text-slate-900">
                        {totalRequested} units
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        {prod ? `${prod.warehouseStock} ${prod.unit}` : "-"}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isPicking ? (
                          <input
                            type="number"
                            min="0"
                            max={totalRequested}
                            value={picked}
                            onChange={(e) =>
                              setPickedQuantities({
                                ...pickedQuantities,
                                [item.productId]: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 p-1.5 text-center font-bold border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600"
                          />
                        ) : (
                          <span className="font-extrabold text-emerald-700 text-sm">
                            {picked} units
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action 2: If Picking, Allow Specifying Carton Count & Mark as Packed */}
        {isPicking && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Packing & Carton Specifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Package / Carton Count:</label>
                <input
                  type="number"
                  min="1"
                  value={packageCount}
                  onChange={(e) => setPackageCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Packing Notes:</label>
                <input
                  type="text"
                  value={packingNotes}
                  onChange={(e) => setPackingNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleConfirmPacking}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors min-h-[44px]"
              >
                Mark as Packed ({packageCount} Cartons)
              </button>
            </div>
          </div>
        )}

        {/* Action 3: If Packed, Assign Driver & Ready for Dispatch */}
        {isPacked && (
          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  Order Successfully Packed ({order.packageCount || packageCount} Cartons)
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Assign to Delivery Executive and stage in Dispatch Bay 2.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-900">
                Ready for Assignment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Assign Delivery Executive:
                </label>
                <select
                  value={assignedDriver}
                  onChange={(e) => setAssignedDriver(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 min-h-[40px]"
                >
                  <option value="Suresh Yadav">Suresh Yadav (Mansarovar Route Van)</option>
                  <option value="Mukesh Meena">Mukesh Meena (Backup Courier)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleDispatch}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Truck className="w-4 h-4" />
                  <span>Mark Ready for Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action 4: If Dispatched, Offer Instant Jump to Delivery Executive */}
        {isDispatched && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-blue-950">
                Dispatched & Assigned to {order.assignedDeliveryExecutive || assignedDriver}
              </h4>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Staged for delivery. You can now switch to Delivery Executive view to simulate last-mile delivery.
              </p>
            </div>
            <button
              onClick={() => {
                setRole("delivery");
                setActiveTab("deliveries");
              }}
              className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px] shrink-0"
            >
              <span>Switch to Delivery Executive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
