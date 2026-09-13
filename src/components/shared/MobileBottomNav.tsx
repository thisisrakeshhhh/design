"use client";

import React from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Store,
  MapPin,
  Target,
  FileText,
  Home,
  CreditCard,
  MoreHorizontal,
  Clock,
  RotateCcw,
  Truck,
  Wallet,
} from "lucide-react";

export function MobileBottomNav() {
  const { currentRole, activeTab, setActiveTab } = useRouteFlowStore();

  if (!currentRole) return null;

  // Role-specific mobile nav tabs
  const getNavTabs = () => {
    switch (currentRole) {
      case "owner":
        return [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "orders", label: "Orders", icon: ShoppingCart },
          { id: "inventory", label: "Stock", icon: Package },
          { id: "retailers", label: "Retailers", icon: Store },
          { id: "more", label: "More", icon: MoreHorizontal },
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
          { id: "pending-orders", label: "Orders", icon: ShoppingCart },
          { id: "inventory", label: "Stock", icon: Package },
          { id: "returns", label: "Returns", icon: RotateCcw },
          { id: "summary", label: "Summary", icon: Clock },
        ];
      case "delivery":
        return [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "deliveries", label: "Deliveries", icon: Truck },
          { id: "collections", label: "Collections", icon: Wallet },
          { id: "returns", label: "Returns", icon: RotateCcw },
          { id: "summary", label: "Summary", icon: FileText },
        ];
      default:
        return [];
    }
  };

  const tabs = getNavTabs();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-around shadow-lg"
    >
      {tabs.map((tab) => {
        const isActive =
          activeTab === tab.id ||
          (tab.id === "more" &&
            ["employees", "routes", "targets", "reports"].includes(activeTab));
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[48px] rounded-lg transition-colors ${
              isActive
                ? "text-blue-900 font-extrabold bg-blue-50/60"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <IconComponent
              className={`w-5 h-5 ${
                isActive ? "text-blue-900 stroke-[2.4]" : "text-slate-500"
              }`}
            />
            <span className="text-[10px] mt-1 tracking-tight leading-none truncate max-w-[64px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
