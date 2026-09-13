"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { Wallet, CheckCircle2 } from "lucide-react";

export function DeliveryCollections() {
  const { payments, addToast } = useRouteFlowStore();
  const [isHandedOver, setIsHandedOver] = useState(false);

  const deliveryPayments = payments.filter((p) => p.collectedBy === "Suresh Yadav");
  const totalCollected = deliveryPayments.reduce((acc, p) => acc + p.amount, 0);

  const handleHandover = () => {
    setIsHandedOver(true);
    addToast({
      type: "success",
      title: "Cash Handover Verified",
      message: "Cash settled with Jaipur Main Warehouse Cashier (Deepak Verma).",
    });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Field Payment Collections & Cash Handover
          </h3>
          <p className="text-xs text-slate-500">
            Suresh Yadav • Daily delivery payments settlement
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Total Collected Today
          </span>
          <span className="text-xl font-extrabold text-emerald-700">
            {formatCurrency(totalCollected || 2740)}
          </span>
        </div>
      </div>

      {/* Handover Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 max-w-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                End-of-Trip Cash Settlement
              </h4>
              <p className="text-xs text-slate-500">
                Handover collected cash & verified UPI receipts to warehouse cashier
              </p>
            </div>
          </div>
          {isHandedOver && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Settled ✓
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
          <div className="p-3 bg-slate-50 flex justify-between font-bold text-slate-700">
            <span>Transaction Receipt</span>
            <span>Method</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="p-3 bg-white flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-900 block">Gupta Provision Store</span>
              <span className="text-[10px] text-slate-400">Order RF-2026-00481</span>
            </div>
            <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">UPI</span>
            <span className="font-extrabold text-slate-900 text-sm">₹2,740</span>
          </div>
        </div>

        {!isHandedOver ? (
          <button
            onClick={handleHandover}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors min-h-[44px]"
          >
            Submit Cash & UPI Receipts to Cashier
          </button>
        ) : (
          <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Shift cash handover verified and recorded in ERP ledger.</span>
          </div>
        )}
      </div>
    </div>
  );
}
