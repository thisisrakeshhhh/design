"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { CheckCircle2 } from "lucide-react";

export function ReturnsInspection() {
  const { addToast } = useRouteFlowStore();
  const [returnStatus, setReturnStatus] = useState<"pending" | "approved" | "scrapped">(
    "pending"
  );

  const handleAction = (status: "approved" | "scrapped") => {
    setReturnStatus(status);
    addToast({
      type: status === "approved" ? "success" : "info",
      title: status === "approved" ? "Return Verified" : "Return Scrapped",
      message:
        status === "approved"
          ? "Item accepted back to warehouse quarantine buffer."
          : "Item written off as damaged transit loss.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900">
          Field Returns & Damage Inspection
        </h3>
        <p className="text-xs text-slate-500">
          Inspect returned goods brought back by sales officers or delivery team
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 max-w-2xl">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Return Ticket #RET-2026-081
            </span>
            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              Mustard Oil 1L (1 Leaked Bottle)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Retailer: <strong>Sharma General Store</strong> • Reported by: Rakesh Kumar
            </p>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              returnStatus === "pending"
                ? "bg-amber-100 text-amber-900"
                : returnStatus === "approved"
                ? "bg-emerald-100 text-emerald-900"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {returnStatus === "pending"
              ? "Awaiting Inspection"
              : returnStatus === "approved"
              ? "Accepted & Credited"
              : "Written Off"}
          </span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Defect Reason:</span>
            <span className="font-semibold text-slate-800">
              Leaked seal during transit from factory
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Reported Timestamp:</span>
            <span className="font-medium text-slate-700">13 Sep 2026, 09:40 AM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Credit Note Value:</span>
            <span className="font-bold text-slate-900">₹158 (Retailer Wholesale Rate)</span>
          </div>
        </div>

        {returnStatus === "pending" ? (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => handleAction("scrapped")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg min-h-[44px]"
            >
              Write Off as Transit Scrap
            </button>
            <button
              onClick={() => handleAction("approved")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg min-h-[44px]"
            >
              Verify & Approve Credit Note
            </button>
          </div>
        ) : (
          <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Inspection disposition finalized by Manoj Sharma.</span>
          </div>
        )}
      </div>
    </div>
  );
}
