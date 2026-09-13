"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { ShopStockCheck } from "./ShopStockCheck";
import { OrderBooking } from "./OrderBooking";
import { PaymentCollect } from "./PaymentCollect";
import { Modal } from "@/components/shared/Modal";
import {
  CheckCircle2,
  Package,
  ShoppingCart,
  CreditCard,
  RotateCcw,
  CheckSquare,
  ArrowLeft,
} from "lucide-react";

interface ActiveShopVisitProps {
  onBackToBeat?: () => void;
}

export function ActiveShopVisit({ onBackToBeat }: ActiveShopVisitProps) {
  const { activeVisit, completeActiveVisit, retailers, addToast } = useRouteFlowStore();

  const [activeTab, setActiveTab] = useState<
    "stock" | "order" | "payment" | "return" | "note"
  >("stock");

  const visitNotes = activeVisit?.notes || "Shopkeeper requested prompt delivery by 4 PM today.";

  const [returnItem, setReturnItem] = useState("Mustard Oil 1L (1 damaged bottle)");
  const [returnReason, setReturnReason] = useState("Leaked seal during transit");
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  if (!activeVisit) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs space-y-3">
        <p className="text-slate-500">No active shop visit right now.</p>
        <button
          onClick={onBackToBeat}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg font-bold text-xs"
        >
          Return to Today&apos;s Beat
        </button>
      </div>
    );
  }

  const retailer = retailers.find((r) => r.id === activeVisit.retailerId);

  const handleRecordReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReturnModalOpen(false);
    addToast({
      type: "warning",
      title: "Return Recorded",
      message: `Return recorded for ${returnItem}. Tagged for warehouse inspection.`,
    });
  };

  const handleFinishVisit = () => {
    completeActiveVisit(visitNotes);
    if (onBackToBeat) onBackToBeat();
  };

  return (
    <div className="space-y-4">
      {/* Active Visit Top Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            onClick={onBackToBeat}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beat List</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>GPS Location Verified</span>
            </span>
          </div>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
              Active Beat Visit • BEAT-04
            </span>
            <h2 className="text-xl font-extrabold text-slate-950 mt-1">
              {activeVisit.retailerName}
            </h2>
            <p className="text-xs text-slate-500">
              Sector 9, Mansarovar • Prop: Mohan Sharma
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Visit Started
              </span>
              <span className="font-bold text-slate-800">09:30 AM (28m)</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Pending Balance
              </span>
              <span className="font-extrabold text-amber-700">
                {formatCurrency(retailer?.pendingAmount || 3250)}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Visit Action Sub-Tabs */}
        <div className="pt-4 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-slate-100 mt-4">
          <button
            onClick={() => setActiveTab("stock")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] ${
              activeTab === "stock"
                ? "bg-blue-900 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Check Shop Stock</span>
          </button>

          <button
            onClick={() => setActiveTab("order")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] ${
              activeTab === "order"
                ? "bg-blue-900 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Book Order</span>
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] ${
              activeTab === "payment"
                ? "bg-blue-900 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Collect Payment</span>
          </button>

          <button
            onClick={() => setIsReturnModalOpen(true)}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Record Return</span>
          </button>

          <button
            onClick={handleFinishVisit}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] ml-auto shrink-0 shadow-xs"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Complete Visit</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "stock" && <ShopStockCheck />}
      {activeTab === "order" && (
        <OrderBooking
          defaultRetailerId={activeVisit.retailerId}
          onOrderSuccess={() => setActiveTab("stock")}
        />
      )}
      {activeTab === "payment" && <PaymentCollect />}

      {/* Record Return Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Record Shop Goods Return"
        subtitle={`Retailer: ${activeVisit.retailerName}`}
        maxWidth="sm"
      >
        <form onSubmit={handleRecordReturn} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product to Return:</label>
            <input
              type="text"
              required
              value={returnItem}
              onChange={(e) => setReturnItem(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Return Reason:</label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 min-h-[40px]"
            >
              <option value="Leaked seal during transit">Leaked seal during transit</option>
              <option value="Packaging crushed/damaged">Packaging crushed/damaged</option>
              <option value="Near expiry dated batch">Near expiry dated batch</option>
              <option value="Slow moving item exchange">Slow moving item exchange</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg min-h-[44px]"
            >
              Confirm Return Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
