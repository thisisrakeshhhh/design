"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { Plus, Minus, Check, AlertCircle } from "lucide-react";

export function ShopStockCheck() {
  const { activeVisit, updateActiveVisitStock, addToast } = useRouteFlowStore();

  if (!activeVisit) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
        No active shop visit. Open a retailer from Today&apos;s Beat to begin audit.
      </div>
    );
  }

  const handleStockChange = (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    // Auto-calculate suggested quantity: e.g. target shelf par is 12 units
    const suggested = Math.max(0, 12 - newStock);
    const item = activeVisit.stockAudits.find((a) => a.productId === productId);
    const currentOrderQty = item ? item.orderQty : suggested;
    updateActiveVisitStock(productId, newStock, currentOrderQty);
  };

  const handleOrderQtyChange = (productId: string, currentOrderQty: number, delta: number) => {
    const newOrderQty = Math.max(0, currentOrderQty + delta);
    const item = activeVisit.stockAudits.find((a) => a.productId === productId);
    const currentStock = item ? item.shopStock : 0;
    updateActiveVisitStock(productId, currentStock, newOrderQty);
  };

  const handleSaveAudit = () => {
    addToast({
      type: "success",
      title: "Stock Audit Recorded",
      message: `Shelf stock recorded for ${activeVisit.retailerName}. Ready to book order.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
        <p className="font-bold flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-700" /> Physical Shelf Audit Guidelines
        </p>
        <p className="text-[11px] text-amber-800 mt-1">
          Clearly count physical shelf inventory. Notice that <strong>Shop Stock</strong> tracks what the retailer already has, while <strong>Order Quantity</strong> defines the new replenishment units to be invoiced.
        </p>
      </div>

      <div className="space-y-3">
        {activeVisit.stockAudits.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-900">{item.productName}</h4>
              <p className="text-[11px] text-slate-500">{item.packSize}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              {/* Box 1: Current Physical Shop Stock */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Current Shop Stock
                  </span>
                  <span className="text-lg font-extrabold text-slate-900">
                    {item.shopStock} units
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStockChange(item.productId, item.shopStock, -1)}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-base min-h-[44px] min-w-[44px] active:scale-95"
                    aria-label="Decrease shop stock"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStockChange(item.productId, item.shopStock, 1)}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-base min-h-[44px] min-w-[44px] active:scale-95"
                    aria-label="Increase shop stock"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Box 2: Suggested & Final Order Quantity */}
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-blue-900 block">
                      Order Quantity
                    </span>
                    <span className="text-[10px] text-blue-700 font-medium">
                      (Sugg: {item.suggestedQty})
                    </span>
                  </div>
                  <span className="text-lg font-extrabold text-blue-950">
                    {item.orderQty} units
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOrderQtyChange(item.productId, item.orderQty, -1)}
                    className="w-10 h-10 rounded-lg bg-white border border-blue-200 text-blue-900 hover:bg-blue-100 flex items-center justify-center font-bold text-base min-h-[44px] min-w-[44px] active:scale-95"
                    aria-label="Decrease order quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOrderQtyChange(item.productId, item.orderQty, 1)}
                    className="w-10 h-10 rounded-lg bg-blue-900 text-white hover:bg-blue-800 flex items-center justify-center font-bold text-base min-h-[44px] min-w-[44px] active:scale-95 shadow-xs"
                    aria-label="Increase order quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={handleSaveAudit}
          className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 min-h-[48px] shadow-xs"
        >
          <Check className="w-4 h-4" />
          <span>Save Shop Stock Audit</span>
        </button>
      </div>
    </div>
  );
}
