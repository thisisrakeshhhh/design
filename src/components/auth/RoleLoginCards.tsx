"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { Role } from "@/types";
import {
  Shield,
  Briefcase,
  Package,
  Truck,
  ArrowRight,
  Boxes,
  MapPin,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface RoleCardData {
  role: Role;
  roleName: string;
  employeeName: string;
  badge: string;
  description: string;
  responsibilities: string[];
  icon: React.ElementType;
  color: string;
}

const ROLES_LIST: RoleCardData[] = [
  {
    role: "owner",
    roleName: "Owner",
    employeeName: "Amit Agarwal",
    badge: "Business Governance",
    description:
      "Full oversight of distribution operations, financial ledger, order approvals, inventory valuation, beat routes, and sales performance.",
    responsibilities: [
      "Approve or reject credit orders",
      "Monitor cash flow & retailer balances",
      "Review inventory & low-stock alerts",
      "Configure salesperson quotas & incentives",
    ],
    icon: Shield,
    color: "blue",
  },
  {
    role: "salesperson",
    roleName: "Salesperson",
    employeeName: "Rakesh Kumar",
    badge: "Field Sales Officer",
    description:
      "Executes daily Mansarovar West beat (BEAT-04), audits shop stocks, books wholesale orders with promo schemes, and collects payments.",
    responsibilities: [
      "Follow sequenced retailer beat route",
      "Perform physical shop stock audits",
      "Book orders with 'Buy 10 Get 1 Free' tea promo",
      "Collect Cash & UPI payments on field",
    ],
    icon: Briefcase,
    color: "emerald",
  },
  {
    role: "warehouse",
    roleName: "Warehouse Manager",
    employeeName: "Manoj Sharma",
    badge: "Fulfilment & Packing",
    description:
      "Handles warehouse picking lists, verifies inventory counts, packs wholesale cartons, and assigns orders to logistics executives.",
    responsibilities: [
      "Receive approved retail orders",
      "Pick quantities against bin availability",
      "Pack cartons and record box count",
      "Stage & dispatch to delivery executives",
    ],
    icon: Package,
    color: "amber",
  },
  {
    role: "delivery",
    roleName: "Delivery Executive",
    employeeName: "Suresh Yadav",
    badge: "Last-Mile Distribution",
    description:
      "Loads assigned wholesale consignments, navigates Jaipur retailer routes, collects payments, and captures customer OTP proof of delivery.",
    responsibilities: [
      "Check loaded packages into vehicle",
      "Navigate to retailers with Google Maps",
      "Collect cash/UPI payments or record credit",
      "Complete delivery using customer OTP / signature",
    ],
    icon: Truck,
    color: "indigo",
  },
];

export function RoleLoginCards() {
  const { setRole, resetDemoData, setDemoGuideOpen } = useRouteFlowStore();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Banner */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <Boxes className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-950 tracking-tight">
                  RouteFlow
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wide">
                  Jaipur Wholesale Demo
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Warehouse-to-Retailer Distribution Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDemoGuideOpen(true)}
              className="text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 min-h-[40px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo Walkthrough</span>
            </button>
            <button
              onClick={resetDemoData}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 min-h-[40px]"
              title="Reset state to initial seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Jaipur Wholesale Distributors • Mansarovar Beat</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Select Employee Role to Begin Demo
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Experience the complete wholesale workflow from order booking to warehouse packing,
            dispatch, and last-mile delivery across four specialized employee views.
          </p>
        </div>

        {/* 4 Large Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ROLES_LIST.map((r) => {
            const Icon = r.icon;

            return (
              <div
                key={r.role}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-950 text-white flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-300" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {r.badge}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900">{r.roleName}</h2>
                  <p className="text-xs font-bold text-blue-800 mb-2">{r.employeeName}</p>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {r.description}
                  </p>

                  <div className="border-t border-slate-100 pt-3 mb-4">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                      Key Capabilities:
                    </p>
                    <ul className="space-y-1.5">
                      {r.responsibilities.map((resp, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] text-slate-600 flex items-start gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setRole(r.role)}
                  className="w-full mt-2 py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] min-h-[44px]"
                >
                  <span>Enter Demo as {r.roleName}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Presentation Tip */}
        <div className="mt-8 sm:mt-12 bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              💡
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Presenter Pro-Tip: Cross-Role State Synchronization
              </p>
              <p className="text-[11px] text-slate-600">
                You can switch between roles at any time using the header menu without losing your changes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDemoGuideOpen(true)}
            className="text-xs font-bold text-blue-900 hover:underline shrink-0"
          >
            Open 8-Step Walkthrough Guide →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <p>
          RouteFlow Wholesale Distribution Platform • Interactive Client Demo • Jaipur, Rajasthan
        </p>
      </footer>
    </div>
  );
}
