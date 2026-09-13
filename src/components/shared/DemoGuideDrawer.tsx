"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { Role } from "@/types";
import {
  X,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Modal } from "./Modal";

export const DEMO_STEPS = [
  {
    step: 1,
    role: "Salesperson",
    targetRole: "salesperson",
    title: "Enter as Salesperson (Rakesh Kumar)",
    description:
      "Start the demo as Salesperson Rakesh Kumar. Review the Mansarovar West beat (BEAT-04) overview and daily targets.",
    actionPrompt: "Click 'Today's Beat' in the navigation bar to see the shops in visit sequence.",
  },
  {
    step: 2,
    role: "Salesperson",
    targetRole: "salesperson",
    title: "Visit Sharma General Store",
    description:
      "Sharma General Store is shop #1 on the beat. Open the store card and start the active shop visit.",
    actionPrompt: "Tap 'Start Visit' or open the active visit tab to begin the stock audit.",
  },
  {
    step: 3,
    role: "Salesperson",
    targetRole: "salesperson",
    title: "Check Stock and Submit Order",
    description:
      "Audit physical shelf stock (Tea: 3, Biscuits: 2, Oil: 1). Book a fresh order with at least 10 units of Premium Tea 250g to demonstrate the automatic 'Buy 10 get 1 free' scheme.",
    actionPrompt: "Review items, select 'Credit' or 'Cash', and click 'Submit Order'.",
  },
  {
    step: 4,
    role: "Owner",
    targetRole: "owner",
    title: "Switch to Owner & Approve Order",
    description:
      "Switch to Amit Agarwal (Owner). Check the top notification and Orders list. The newly submitted order is waiting under 'Submitted' status.",
    actionPrompt: "Open order details, verify retailer credit balance, and click 'Approve Order'.",
  },
  {
    step: 5,
    role: "Warehouse Manager",
    targetRole: "warehouse",
    title: "Pick & Pack Products",
    description:
      "Switch to Manoj Sharma (Warehouse). The order appears in 'Pending Orders'. Start picking, verify picked quantities against available inventory, and specify carton count.",
    actionPrompt: "Click 'Start Picking', confirm carton count, and click 'Mark as Packed'.",
  },
  {
    step: 6,
    role: "Warehouse Manager",
    targetRole: "warehouse",
    title: "Assign & Stage for Dispatch",
    description:
      "Assign Suresh Yadav (Senior Logistics Executive) as the delivery executive and mark the order ready for dispatch.",
    actionPrompt: "Select Suresh Yadav and click 'Ready for Dispatch'.",
  },
  {
    step: 7,
    role: "Delivery Executive",
    targetRole: "delivery",
    title: "Deliver to Shop & Verify OTP",
    description:
      "Switch to Suresh Yadav (Delivery). The order is now listed under 'Assigned Deliveries'. Mark it 'Out for Delivery'. Upon reaching Sharma General Store, verify customer OTP (sample: 4829) or collect payment.",
    actionPrompt: "Select proof type 'OTP' (or Signature), enter OTP, and tap 'Mark Delivered'.",
  },
  {
    step: 8,
    role: "Owner",
    targetRole: "owner",
    title: "Review Business Impact & Ledger",
    description:
      "Switch back to Amit Agarwal (Owner). Review the live dashboard: Today's Delivered Sales, Updated Warehouse Inventory, Retailer Ledger, and Salesperson Incentive calculations.",
    actionPrompt: "Notice how all inventory quantities, ledger balances, and target achievements updated in real time!",
  },
];

export function DemoGuideDrawer() {
  const {
    isDemoGuideOpen,
    setDemoGuideOpen,
    demoGuideStep,
    setDemoGuideStep,
    nextDemoGuideStep,
    prevDemoGuideStep,
    resetDemoData,
    setRole,
  } = useRouteFlowStore();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  if (!isDemoGuideOpen) return null;

  const currentStepData = DEMO_STEPS[demoGuideStep - 1] || DEMO_STEPS[0];

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="absolute inset-0"
          onClick={() => setDemoGuideOpen(false)}
          aria-hidden="true"
        />

        <aside className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 border-l border-slate-200">
          {/* Top header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-blue-900 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-800 border border-blue-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-200" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight">Client Demo Walkthrough</h2>
                <p className="text-[11px] text-blue-200">8-Step Order to Delivery Flow</p>
              </div>
            </div>
            <button
              onClick={() => setDemoGuideOpen(false)}
              className="p-2 text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Bar */}
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Step {demoGuideStep} of 8
            </span>
            <div className="flex items-center gap-1">
              {DEMO_STEPS.map((s) => (
                <button
                  key={s.step}
                  onClick={() => setDemoGuideStep(s.step)}
                  className={`w-5 h-2 rounded-full transition-all ${
                    s.step === demoGuideStep
                      ? "bg-blue-600 w-7"
                      : s.step < demoGuideStep
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                  aria-label={`Jump to step ${s.step}`}
                />
              ))}
            </div>
          </div>

          {/* Active Step Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  Recommended Role: {currentStepData.role}
                </span>
                <button
                  onClick={() => setRole(currentStepData.targetRole as Role)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                >
                  Switch Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {currentStepData.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Presenter Action
              </h4>
              <p className="text-xs text-amber-800 mt-1.5 font-medium leading-relaxed">
                {currentStepData.actionPrompt}
              </p>
            </div>

            {/* Quick overview of all steps */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                All Steps Overview
              </h4>
              <div className="space-y-1.5">
                {DEMO_STEPS.map((item) => {
                  const isCurrent = item.step === demoGuideStep;
                  const isPassed = item.step < demoGuideStep;

                  return (
                    <div
                      key={item.step}
                      onClick={() => setDemoGuideStep(item.step)}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isCurrent
                          ? "border-blue-600 bg-blue-50 font-bold text-blue-950"
                          : isPassed
                          ? "border-emerald-200 bg-emerald-50/50 text-slate-700"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0 font-bold ${
                              isCurrent
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {item.step}
                          </span>
                        )}
                        <span className="truncate">{item.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal shrink-0 ml-2">
                        {item.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={prevDemoGuideStep}
                disabled={demoGuideStep <= 1}
                className="flex items-center justify-center gap-1 px-3 py-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={nextDemoGuideStep}
                disabled={demoGuideStep >= 8}
                className="flex items-center justify-center gap-1 px-3 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold disabled:opacity-40 disabled:pointer-events-none min-h-[44px]"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setDemoGuideStep(1)}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
              >
                Restart Walkthrough
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation modal before Reset */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Reset Demo Data?"
        subtitle="This will restore all Jaipur mock data to initial values."
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            All changes made during this demo session (orders booked, statuses updated,
            deliveries made, payments received) will be erased and reset to initial seed values.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setIsResetConfirmOpen(false);
                setDemoGuideOpen(false);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg min-h-[44px]"
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
