"use client";

import React, { useState, useEffect } from "react";
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
  Clock,
  AlertCircle,
  Phone,
  MapPin,
} from "lucide-react";

interface ActiveShopVisitProps {
  onBackToBeat?: () => void;
}

export function ActiveShopVisit({ onBackToBeat }: ActiveShopVisitProps) {
  const { activeVisit, completeActiveVisit, retailers, addToast } = useRouteFlowStore();

  const [activeTab, setActiveTab] = useState<
    "overview" | "stock" | "order" | "payment"
  >("overview");

  // Calculate visit time dynamically
  const [elapsedMinutes, setElapsedMinutes] = useState(14);
  const [elapsedSeconds, setElapsedSeconds] = useState(25);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= 59) {
          setElapsedMinutes((m) => m + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const visitNotes = activeVisit?.notes || "Shopkeeper requested delivery by 4 PM today.";

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
      {/* Active Visit Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            onClick={onBackToBeat}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Today&apos;s Beat</span>
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
              Active Visit • Mansarovar West
            </span>
            <h2 className="text-xl font-extrabold text-slate-950 mt-1">
              {activeVisit.retailerName}
            </h2>
            <p className="text-xs text-slate-500">
              Proprietor: {retailer?.ownerName || "Mohan Sharma"} • {retailer?.address || "Sector 9, Mansarovar"}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1">
                <Clock className="w-3 h-3" /> Visit Time
              </span>
              <span className="font-mono font-bold text-slate-900">
                {String(elapsedMinutes).padStart(2, "0")}m {String(elapsedSeconds).padStart(2, "0")}s
              </span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Payment Due
              </span>
              <span className="font-extrabold text-amber-700">
                {formatCurrency(retailer?.pendingAmount || 3250)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="pt-4 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-slate-100 mt-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] ${
              activeTab === "overview"
                ? "bg-blue-900 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <span>Visit Overview</span>
          </button>

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

      {/* 1. Active Visit Overview */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Check shop stock, book new order, and collect payment if due.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Shop Details
              </span>
              <p className="font-extrabold text-sm text-slate-900 mt-1">
                {retailer?.name || activeVisit.retailerName}
              </p>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{retailer?.address}</span>
              </p>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{retailer?.phone}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Payment Due
              </span>
              <p className="font-extrabold text-lg text-amber-700 mt-1">
                {formatCurrency(retailer?.pendingAmount || 3250)}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Credit Limit: {formatCurrency(retailer?.creditLimit || 20000)}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Visit Timer
              </span>
              <p className="font-mono font-extrabold text-lg text-blue-900 mt-1">
                {String(elapsedMinutes).padStart(2, "0")}m {String(elapsedSeconds).padStart(2, "0")}s
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Status: In Progress
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab("stock")}
              className="w-full py-3.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all min-h-[48px]"
            >
              <Package className="w-4 h-4" />
              <span>Check Shop Stock</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Stock Check: Shown after pressing Check Stock */}
      {activeTab === "stock" && <ShopStockCheck />}

      {/* 3. Order Booking */}
      {activeTab === "order" && (
        <OrderBooking
          defaultRetailerId={activeVisit.retailerId}
          onOrderSuccess={() => setActiveTab("stock")}
        />
      )}

      {/* 4. Payment Collection */}
      {activeTab === "payment" && <PaymentCollect />}

      {/* Record Return Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Record Goods Return"
        subtitle={`Shop: ${activeVisit.retailerName}`}
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
