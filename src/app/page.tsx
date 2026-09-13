"use client";

import React, { useSyncExternalStore } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { RoleLoginCards } from "@/components/auth/RoleLoginCards";
import { AppHeader } from "@/components/shared/AppHeader";
import { DesktopNav } from "@/components/shared/DesktopNav";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import { ToastContainer } from "@/components/shared/Toast";
import { DemoGuideDrawer } from "@/components/shared/DemoGuideDrawer";

// Owner components
import { OwnerDashboard } from "@/components/owner/OwnerDashboard";
import { OwnerOrders } from "@/components/owner/OwnerOrders";
import { OwnerInventory } from "@/components/owner/OwnerInventory";
import { OwnerRetailers } from "@/components/owner/OwnerRetailers";
import { OwnerEmployees } from "@/components/owner/OwnerEmployees";
import { OwnerRoutes } from "@/components/owner/OwnerRoutes";
import { OwnerTargets } from "@/components/owner/OwnerTargets";
import { OwnerReports } from "@/components/owner/OwnerReports";

// Salesperson components
import { SalesHome } from "@/components/sales/SalesHome";
import { TodayBeat } from "@/components/sales/TodayBeat";
import { OrderBooking } from "@/components/sales/OrderBooking";
import { PaymentCollect } from "@/components/sales/PaymentCollect";
import { SalesTargets } from "@/components/sales/SalesTargets";

// Warehouse components
import { WarehouseDash } from "@/components/warehouse/WarehouseDash";
import { PendingOrders } from "@/components/warehouse/PendingOrders";
import { WarehouseStock } from "@/components/warehouse/WarehouseStock";
import { ReturnsInspection } from "@/components/warehouse/ReturnsInspection";
import { WarehouseSummary } from "@/components/warehouse/WarehouseSummary";

// Delivery components
import { DeliveryDash } from "@/components/delivery/DeliveryDash";
import { DeliveryList } from "@/components/delivery/DeliveryList";
import { DeliveryCollections } from "@/components/delivery/DeliveryCollections";
import { DeliverySummary } from "@/components/delivery/DeliverySummary";

import {
  Users,
  MapPin,
  Target,
  FileText,
  Boxes,
} from "lucide-react";

function subscribe(callback: () => void) {
  const timer = setTimeout(callback, 0);
  return () => clearTimeout(timer);
}

function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export default function HomePage() {
  const { currentRole, activeTab, setActiveTab } = useRouteFlowStore();
  const mounted = useIsMounted();

  // Safe SSR placeholder avoiding hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center animate-spin">
            <Boxes className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900 block">
              RouteFlow Distribution
            </span>
            <span className="text-xs text-slate-400">Loading Jaipur wholesale data...</span>
          </div>
        </div>
      </div>
    );
  }

  // 1. If no role selected, render Demo Login with 4 large role cards
  if (!currentRole) {
    return (
      <>
        <RoleLoginCards />
        <DemoGuideDrawer />
        <ToastContainer />
      </>
    );
  }

  // 2. Render Active Role Workspace
  const renderRoleContent = () => {
    if (currentRole === "owner") {
      switch (activeTab) {
        case "dashboard":
          return <OwnerDashboard />;
        case "orders":
          return <OwnerOrders />;
        case "inventory":
          return <OwnerInventory />;
        case "retailers":
          return <OwnerRetailers />;
        case "employees":
          return <OwnerEmployees />;
        case "routes":
          return <OwnerRoutes />;
        case "targets":
          return <OwnerTargets />;
        case "reports":
          return <OwnerReports />;
        case "more":
          return (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Owner Management Hub</h3>
                <p className="text-xs text-slate-500">Access operational administration tabs</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab("employees")}
                  className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center gap-3 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Wholesale Employees</h4>
                    <p className="text-[11px] text-slate-500">Staff attendance and routes</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("routes")}
                  className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center gap-3 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Routes & Beats</h4>
                    <p className="text-[11px] text-slate-500">Mansarovar West route planning</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("targets")}
                  className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center gap-3 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Targets & Incentives</h4>
                    <p className="text-[11px] text-slate-500">Quotas and commission rules</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("reports")}
                  className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center gap-3 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Business Reports</h4>
                    <p className="text-[11px] text-slate-500">Category sales & analytics</p>
                  </div>
                </button>
              </div>
            </div>
          );
        default:
          return <OwnerDashboard />;
      }
    }

    if (currentRole === "salesperson") {
      switch (activeTab) {
        case "home":
          return <SalesHome />;
        case "beat":
          return <TodayBeat />;
        case "orders":
          return <OrderBooking />;
        case "payments":
          return <PaymentCollect />;
        case "targets":
          return <SalesTargets />;
        default:
          return <SalesHome />;
      }
    }

    if (currentRole === "warehouse") {
      switch (activeTab) {
        case "dashboard":
          return <WarehouseDash />;
        case "pending-orders":
          return <PendingOrders />;
        case "inventory":
          return <WarehouseStock />;
        case "returns":
          return <ReturnsInspection />;
        case "summary":
          return <WarehouseSummary />;
        default:
          return <WarehouseDash />;
      }
    }

    if (currentRole === "delivery") {
      switch (activeTab) {
        case "dashboard":
          return <DeliveryDash />;
        case "deliveries":
          return <DeliveryList />;
        case "collections":
          return <DeliveryCollections />;
        case "returns":
          return <ReturnsInspection />;
        case "summary":
          return <DeliverySummary />;
        default:
          return <DeliveryDash />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between pb-20 md:pb-6">
      <div>
        <AppHeader />
        <DesktopNav />
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          {renderRoleContent()}
        </main>
      </div>

      <MobileBottomNav />
      <DemoGuideDrawer />
      <ToastContainer />
    </div>
  );
}
