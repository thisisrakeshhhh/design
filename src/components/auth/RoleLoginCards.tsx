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
  roleTitle: string;
  employeeName: string;
  shortSentence: string;
  icon: React.ElementType;
}

const ROLES_LIST: RoleCardData[] = [
  {
    role: "owner",
    roleTitle: "Owner",
    employeeName: "Amit Agarwal",
    shortSentence: "Approves wholesale orders, checks payments due, and monitors warehouse stock.",
    icon: Shield,
  },
  {
    role: "salesperson",
    roleTitle: "Salesperson",
    employeeName: "Rakesh Kumar",
    shortSentence: "Visits retail shops, checks shop stock, and books new orders.",
    icon: Briefcase,
  },
  {
    role: "warehouse",
    roleTitle: "Warehouse",
    employeeName: "Manoj Sharma",
    shortSentence: "Picks products from shelves, packs cartons, and hands over to drivers.",
    icon: Package,
  },
  {
    role: "delivery",
    roleTitle: "Delivery",
    employeeName: "Suresh Yadav",
    shortSentence: "Delivers orders to shops, verifies OTP, and collects cash or UPI.",
    icon: Truck,
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
                  Jaipur Demo
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Warehouse-to-Retailer Wholesale Distribution System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDemoGuideOpen(true)}
              className="text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 min-h-[40px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo Guide</span>
            </button>
            <button
              onClick={resetDemoData}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 min-h-[40px]"
              title="Reset demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Jaipur Wholesale Distributors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Choose Your Role
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Select an employee to enter their screen and start the demo.
          </p>
        </div>

        {/* 4 Clean, Simplified Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ROLES_LIST.map((r) => {
            const Icon = r.icon;

            return (
              <div
                key={r.role}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center mb-4 shadow-xs">
                    <Icon className="w-6 h-6 text-blue-200" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {r.roleTitle}
                  </span>

                  <h2 className="text-lg font-extrabold text-slate-950 mt-2">
                    {r.employeeName}
                  </h2>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed min-h-[48px]">
                    {r.shortSentence}
                  </p>
                </div>

                <button
                  onClick={() => setRole(r.role)}
                  className="w-full mt-6 py-3.5 px-4 bg-blue-900 hover:bg-blue-800 text-white text-sm font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] min-h-[48px]"
                >
                  <span>Enter as {r.roleTitle}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <p>
          RouteFlow Wholesale Distribution Platform • Jaipur, Rajasthan
        </p>
      </footer>
    </div>
  );
}
