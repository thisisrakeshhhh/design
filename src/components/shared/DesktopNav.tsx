"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Store,
  Users,
  MapPin,
  Target,
  FileText,
  Home,
  CreditCard,
  Clock,
  RotateCcw,
  Truck,
  Wallet,
} from "lucide-react";

export function DesktopNav() {
  const { currentRole, activeTab, setActiveTab, orders } = useRouteFlowStore();

  if (!currentRole) return null;

  const pendingOrderCount = orders.filter((o) => o.status === "Submitted").length;
  const approvedOrderCount = orders.filter(
    (o) => o.status === "Approved" || o.status === "Picking"
  ).length;

  const getRoleTabs = () => {
    switch (currentRole) {
      case "owner":
        return [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          {
            id: "orders",
            label: "Orders",
            icon: ShoppingCart,
            badge: pendingOrderCount > 0 ? `${pendingOrderCount} pending` : undefined,
          },
          { id: "inventory", label: "Inventory", icon: Package },
          { id: "retailers", label: "Retailers", icon: Store },
          { id: "employees", label: "Employees", icon: Users },
          { id: "routes", label: "Routes & Beats", icon: MapPin },
          { id: "targets", label: "Targets & Incentives", icon: Target },
          { id: "reports", label: "Reports", icon: FileText },
        ];
      case "salesperson":
        return [
          { id: "home", label: "Home", icon: Home },
          { id: "beat", label: "Today's Beat", icon: MapPin },
          { id: "orders", label: "Orders", icon: ShoppingCart },
          { id: "payments", label: "Payments", icon: CreditCard },
          { id: "targets", label: "Targets", icon: Target },
        ];
      case "warehouse":
        return [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          {
            id: "pending-orders",
            label: "Pending Orders",
            icon: ShoppingCart,
            badge: approvedOrderCount > 0 ? `${approvedOrderCount}` : undefined,
          },
          { id: "inventory", label: "Inventory", icon: Package },
          { id: "returns", label: "Returns", icon: RotateCcw },
          { id: "summary", label: "Daily Summary", icon: Clock },
        ];
      case "delivery":
        return [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "deliveries", label: "Deliveries", icon: Truck },
          { id: "collections", label: "Collections", icon: Wallet },
          { id: "returns", label: "Returns", icon: RotateCcw },
          { id: "summary", label: "Daily Summary", icon: FileText },
        ];
      default:
        return [];
    }
  };

  const tabs = getRoleTabs();

  return (
    <div className="hidden md:block bg-white border-b border-slate-200 sticky top-16 z-20 shadow-2xs">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-2" aria-label="Desktop Subnavigation">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[40px] ${
                  isActive
                    ? "bg-blue-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-200" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive
                        ? "bg-amber-400 text-slate-950"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
