"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { Delivery } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Modal } from "@/components/shared/Modal";
import {
  Phone,
  Navigation,
  CheckCircle2,
  Camera,
  PenTool,
  KeyRound,
  ArrowLeft,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface DeliveryExecutionProps {
  delivery: Delivery;
  onBack: () => void;
}

export function DeliveryExecution({ delivery, onBack }: DeliveryExecutionProps) {
  const {
    orders,
    markOutForDelivery,
    completeDelivery,
    failDelivery,
    setRole,
    setActiveTab,
  } = useRouteFlowStore();

  const order = orders.find((o) => o.id === delivery.orderId);

  // Delivery Execution Form States
  const [proofType, setProofType] = useState<"OTP" | "Signature" | "Photograph">("OTP");
  const [enteredOtp, setEnteredOtp] = useState<string>("4829"); // Preset sample OTP for demo ease
  const [isPartialDelivery, setIsPartialDelivery] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<"Credit" | "Cash" | "UPI">(
    delivery.paymentType || "Credit"
  );
  const [collectedAmt, setCollectedAmt] = useState<number>(delivery.amountToCollect || 0);
  const [deliveryNotes, setDeliveryNotes] = useState<string>(
    "Handed over 2 cartons to store manager Mohan Sharma."
  );

  // Failure Modal
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [failReason, setFailReason] = useState("Shop closed");

  const isAssigned = delivery.status === "Assigned";
  const isOut = delivery.status === "Out for Delivery";
  const isDelivered = delivery.status === "Delivered";
  const isFailed = delivery.status === "Failed";

  const handleStartRun = () => {
    markOutForDelivery(delivery.id);
  };

  const handleFinishDelivery = () => {
    completeDelivery({
      deliveryId: delivery.id,
      proofType,
      otpUsed: enteredOtp,
      paymentMode,
      collectedAmount: paymentMode === "Credit" ? 0 : collectedAmt,
      deliveryNotes,
      isPartial: isPartialDelivery,
    });
  };

  const handleConfirmFailed = () => {
    failDelivery(delivery.id, failReason);
    setIsFailModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Today&apos;s Deliveries</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Status:</span>
          <StatusBadge status={delivery.status} size="sm" />
        </div>
      </div>

      {/* Main Delivery Execution Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
              Stop #{delivery.sequenceNumber} • Order Delivery
            </span>
            <h2 className="text-xl font-extrabold text-slate-950 mt-1">
              {delivery.retailerName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Order: <strong>{delivery.orderNumber}</strong> • Packages: {delivery.packageCount} Carton(s)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${delivery.phone}`}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 min-h-[44px]"
            >
              <Phone className="w-3.5 h-3.5 text-blue-900" />
              <span>Call Shop</span>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${delivery.retailerName}, ${delivery.address}, Jaipur`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 min-h-[44px] shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>
          </div>
        </div>

        {/* Step 1: If Assigned, Confirm Loaded & Mark Out for Delivery */}
        {isAssigned && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-blue-950">
                Packages Staged in Dispatch Bay 2
              </h4>
              <p className="text-[11px] text-blue-800 mt-0.5">
                Verify {delivery.packageCount} carton(s) loaded into delivery vehicle #RJ-14-EA-4821.
              </p>
            </div>
            <button
              onClick={handleStartRun}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors min-h-[44px] shrink-0"
            >
              Confirm Loaded & Mark Out for Delivery
            </button>
          </div>
        )}

        {/* Step 2: If Out for Delivery, Complete Verification and Proof */}
        {isOut && (
          <div className="space-y-4 pt-2">
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-950 flex items-center justify-between">
              <div>
                <strong className="block font-bold">Arrived at Destination</strong>
                <span className="text-[11px] text-amber-800">
                  Inspect {delivery.packageCount} carton(s) with storekeeper and verify customer OTP.
                </span>
              </div>
              <button
                onClick={() => setIsFailModalOpen(true)}
                className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-lg transition-colors min-h-[36px]"
              >
                Mark Failed Delivery
              </button>
            </div>

            {/* Delivery Items Checklist */}
            {order && (
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 uppercase text-[11px]">
                  Products to Deliver ({order.items.length} Products)
                </h4>
                <div className="divide-y divide-slate-200">
                  {order.items.map((it) => (
                    <div key={it.productId} className="py-2 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900">{it.productName}</span>
                        <span className="text-[10px] text-slate-500 block">SKU: {it.sku}</span>
                      </div>
                      <div className="text-right font-bold text-slate-900">
                        {it.quantity} units{" "}
                        {it.freeQuantity > 0 && (
                          <span className="text-emerald-700 text-[10px]">
                            (+{it.freeQuantity} Free)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Parameters: Full vs Partial */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPartialDelivery(false)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border min-h-[40px] ${
                      !isPartialDelivery
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Full Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPartialDelivery(true)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border min-h-[40px] ${
                      isPartialDelivery
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Partial Delivery
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Method:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Credit", "Cash", "UPI"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 text-xs font-bold rounded-lg border min-h-[40px] ${
                        paymentMode === mode
                          ? "bg-blue-900 text-white border-blue-900"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                {paymentMode !== "Credit" && (
                  <div className="mt-2">
                    <label className="font-bold text-slate-700 block mb-1">Amount Collected (₹):</label>
                    <input
                      type="number"
                      value={collectedAmt}
                      onChange={(e) => setCollectedAmt(Number(e.target.value) || 0)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Payment Display Breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Payment Breakdown
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Invoice Amount:</span>
                <span className="font-extrabold text-slate-900 font-mono">
                  {formatCurrency(order?.totalAmount || delivery.amountToCollect || 0)}
                </span>
              </div>

              {paymentMode === "Credit" ? (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Payment:</span>
                    <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Credit
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-700">Collect Now:</span>
                    <span className="font-extrabold text-emerald-700 font-mono text-sm">
                      ₹0
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Payment Method:</span>
                    <span className="font-bold text-slate-900">{paymentMode}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-700">Amount to Collect:</span>
                    <span className="font-extrabold text-blue-900 font-mono text-sm">
                      {formatCurrency(collectedAmt)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Proof of Delivery (OTP / Signature / Photo) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <label className="font-bold text-slate-800 block">Proof of Delivery Type:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProofType("OTP")}
                  className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 min-h-[40px] ${
                    proofType === "OTP"
                      ? "bg-blue-900 text-white"
                      : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  <KeyRound className="w-4 h-4" /> OTP Verification
                </button>
                <button
                  type="button"
                  onClick={() => setProofType("Signature")}
                  className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 min-h-[40px] ${
                    proofType === "Signature"
                      ? "bg-blue-900 text-white"
                      : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  <PenTool className="w-4 h-4" /> Store Signature
                </button>
                <button
                  type="button"
                  onClick={() => setProofType("Photograph")}
                  className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 min-h-[40px] ${
                    proofType === "Photograph"
                      ? "bg-blue-900 text-white"
                      : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  <Camera className="w-4 h-4" /> Carton Photo
                </button>
              </div>

              {/* OTP Field with Demo Convenient Helper */}
              {proofType === "OTP" && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Enter Retailer OTP:</span>
                    <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Sample Demo OTP: 4829
                    </span>
                  </div>
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    maxLength={6}
                    className="w-full p-2.5 text-center font-mono font-extrabold text-base tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                  />
                </div>
              )}

              {proofType === "Signature" && (
                <div className="p-4 bg-white rounded-lg border border-slate-200 text-center text-slate-400 font-mono text-xs">
                  [ Digital Signature Pad Captured: Mohan Sharma ✓ ]
                </div>
              )}

              {proofType === "Photograph" && (
                <div className="p-4 bg-white rounded-lg border border-slate-200 text-center text-slate-500 text-xs">
                  📷 [ Photo Attached: 2 cartons stacked at Sharma General Store entrance ]
                </div>
              )}

              {/* Delivery Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Remarks:</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleFinishDelivery}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Mark Order Delivered & Update Ledger</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: If Delivered, Show Success State and Instant Jump to Owner */}
        {isDelivered && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-950">
                Delivery Successfully Verified!
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                Order {delivery.orderNumber} delivered to {delivery.retailerName}. Inventory and retailer ledger updated.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setRole("owner");
                  setActiveTab("dashboard");
                }}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs inline-flex items-center gap-2 min-h-[44px]"
              >
                <span>Switch to Owner to View Updated Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* If Failed */}
        {isFailed && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-950">
            <h4 className="font-bold flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-700" /> Delivery Failed: {delivery.failureReason}
            </h4>
            <p className="text-[11px] text-rose-800 mt-1">
              Order flagged for return to Jaipur Main Warehouse.
            </p>
          </div>
        )}
      </div>

      {/* Failed Delivery Modal */}
      <Modal
        isOpen={isFailModalOpen}
        onClose={() => setIsFailModalOpen(false)}
        title="Record Failed Delivery"
        subtitle={`Retailer: ${delivery.retailerName}`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Failure Reason:</label>
            <select
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 min-h-[40px]"
            >
              <option value="Shop closed">Shop closed</option>
              <option value="Retailer unavailable">Retailer unavailable</option>
              <option value="Retailer refused order">Retailer refused order</option>
              <option value="Payment issue">Payment issue</option>
              <option value="Address not found">Address not found</option>
              <option value="Other">Other reason</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsFailModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmFailed}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg min-h-[44px]"
            >
              Confirm Failed Attempt
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
