"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { Modal } from "@/components/shared/Modal";
import {
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { PaymentMethod } from "@/types";

function getDeterministicReceiptNumber(retailerId: string, amount: number) {
  const code = ((retailerId.charCodeAt(retailerId.length - 1) * 31 + amount) % 900) + 100;
  return `RCP-2026-${code}`;
}

export function PaymentCollect() {
  const { retailers, recordPayment } = useRouteFlowStore();

  const [selectedRetailerId, setSelectedRetailerId] = useState<string>(
    retailers[0]?.id || ""
  );
  const [amount, setAmount] = useState<number>(3000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [referenceNumber, setReferenceNumber] = useState<string>("UPI/9842109");

  // Receipt Modal
  const [receiptData, setReceiptData] = useState<{
    receiptNumber: string;
    retailerName: string;
    amount: number;
    method: string;
    refNo: string;
    timestamp: string;
  } | null>(null);

  const selectedRetailer = retailers.find((r) => r.id === selectedRetailerId);

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRetailer || amount <= 0) return;

    recordPayment({
      retailerId: selectedRetailer.id,
      amount,
      paymentMethod,
      referenceNumber,
    });

    setReceiptData({
      receiptNumber: getDeterministicReceiptNumber(selectedRetailer.id, amount),
      retailerName: selectedRetailer.name,
      amount,
      method: paymentMethod,
      refNo: referenceNumber,
      timestamp: "2026-09-13T10:45:00.000Z",
    });
  };

  return (
    <div className="space-y-5">
      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs max-w-xl mx-auto">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Collect Wholesale Payment
            </h3>
            <p className="text-xs text-slate-500">
              Record field collection & generate instant retailer receipt
            </p>
          </div>
        </div>

        <form onSubmit={handleCollect} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Select Retail Store:
            </label>
            <select
              value={selectedRetailerId}
              onChange={(e) => setSelectedRetailerId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 min-h-[44px]"
            >
              {retailers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — Outstanding: {formatCurrency(r.pendingAmount)}
                </option>
              ))}
            </select>
          </div>

          {selectedRetailer && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Current Pending Balance
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCurrency(selectedRetailer.pendingAmount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Credit Limit
                </span>
                <span className="font-semibold text-slate-700">
                  {formatCurrency(selectedRetailer.creditLimit)}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Collected Amount (₹):
            </label>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-base font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-600 min-h-[44px]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Payment Method:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["Cash", "UPI", "Bank Transfer", "Cheque"] as PaymentMethod[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMethod(mode)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition-colors min-h-[44px] ${
                    paymentMethod === mode
                      ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Reference / UTR / Cheque Number:
            </label>
            <input
              type="text"
              required
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. UPI/102948123 or Chq #48201"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[48px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Payment Collection</span>
          </button>
        </form>
      </div>

      {/* Digital Receipt Modal */}
      <Modal
        isOpen={!!receiptData}
        onClose={() => setReceiptData(null)}
        title="Official Collection Receipt"
        subtitle="Jaipur Wholesale Distributors • Registered Dealer"
        maxWidth="sm"
      >
        {receiptData && (
          <div className="space-y-4 text-xs">
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/70 space-y-3">
              <div className="text-center pb-2 border-b border-slate-200">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">
                  Payment Receipt
                </span>
                <h4 className="text-sm font-bold text-slate-900">{receiptData.receiptNumber}</h4>
                <p className="text-[10px] text-slate-500">
                  {formatDateTime(receiptData.timestamp)}
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Received From:</span>
                  <span className="font-bold text-slate-900">{receiptData.retailerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold text-slate-900">{receiptData.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ref / UTR:</span>
                  <span className="font-medium text-slate-700">{receiptData.refNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Collected By:</span>
                  <span className="font-medium text-slate-700">Rakesh Kumar (Sales)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold">
                  <span>Amount Settled:</span>
                  <span className="text-emerald-700">{formatCurrency(receiptData.amount)}</span>
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-400 italic">
                Thank you for your business. Digital acknowledgment issued on field.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setReceiptData(null)}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold text-xs min-h-[44px]"
              >
                Done & Close Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
