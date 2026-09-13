"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { DemoSwitcher } from "./DemoSwitcher";
import {
  Boxes,
  BookOpen,
  Bell,
} from "lucide-react";
import { formatTimeOnly } from "@/lib/formatters";

export function AppHeader() {
  const {
    currentRole,
    orders,
    activityLog,
    setDemoGuideOpen,
    setActiveTab,
  } = useRouteFlowStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pendingApprovals = orders.filter((o) => o.status === "Submitted").length;
  const recentActivities = activityLog.slice(0, 6);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Context */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Boxes className="w-5 h-5 text-blue-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                RouteFlow
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
                Demo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate hidden xs:block">
              Jaipur Wholesale Distributors • Mansarovar West
            </p>
          </div>
        </div>

        {/* Right: Actions, Guide, Notifs, Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Online / Synced Status indicator */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-semibold"
            title="Local state synchronized"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Synced</span>
          </div>

          {/* Interactive Demo Guide button */}
          <button
            onClick={() => setDemoGuideOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold transition-colors min-h-[40px]"
            aria-label="Open presentation guide"
          >
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span className="hidden sm:inline">Demo Guide</span>
          </button>

          {/* Activity / Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="View recent activity"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovals > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                  {pendingApprovals}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Live Business Activity
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Synchronized cross-role events
                    </p>
                  </div>
                  {pendingApprovals > 0 && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {pendingApprovals} pending approval
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="p-3 text-left hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <span className="font-bold text-slate-900">{act.action}</span>
                        <span className="text-[10px] text-slate-400">
                          {formatTimeOnly(act.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{act.details}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                        <span className="font-medium text-slate-700">{act.userName}</span>
                        <span>•</span>
                        <span className="capitalize">{act.role}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {currentRole === "owner" && pendingApprovals > 0 && (
                  <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                    <button
                      onClick={() => {
                        setActiveTab("orders");
                        setIsNotifOpen(false);
                      }}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <DemoSwitcher />
        </div>
      </div>
    </header>
  );
}
