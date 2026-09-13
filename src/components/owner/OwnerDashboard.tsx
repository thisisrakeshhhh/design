"use client";

import React, { useMemo } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  TrendingUp,
  Truck,
  Wallet,
  AlertCircle,
  Package,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const SEVEN_DAY_SALES = [
  { day: "Mon", sales: 18500, orders: 5 },
  { day: "Tue", sales: 24200, orders: 7 },
  { day: "Wed", sales: 19800, orders: 6 },
  { day: "Thu", sales: 31200, orders: 9 },
  { day: "Fri", sales: 27400, orders: 8 },
  { day: "Sat", sales: 34690, orders: 11 },
  { day: "Today", sales: 26800, orders: 8 },
];

export function OwnerDashboard() {
  const { orders, products, retailers, employees, targets, setActiveTab } =
    useRouteFlowStore();

  // Metrics calculations
  const todayBookedSales = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Rejected" && o.status !== "Cancelled")
      .reduce((acc, o) => acc + o.totalAmount, 0);
  }, [orders]);

  const todayDeliveredSales = useMemo(() => {
    return orders
      .filter((o) => o.status === "Delivered")
      .reduce((acc, o) => acc + o.totalAmount, 0);
  }, [orders]);

  const totalOutstanding = useMemo(() => {
    return retailers.reduce((acc, r) => acc + r.pendingAmount, 0);
  }, [retailers]);

  const pendingApprovals = useMemo(() => {
    return orders.filter((o) => o.status === "Submitted");
  }, [orders]);

  const ordersBeingPacked = useMemo(() => {
    return orders.filter((o) => o.status === "Picking" || o.status === "Packed");
  }, [orders]);

  const ordersOutForDelivery = useMemo(() => {
    return orders.filter((o) => o.status === "Out for Delivery");
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.warehouseStock <= p.lowStockThreshold);
  }, [products]);

  const salesperson = employees.find((e) => e.role === "salesperson");

  return (
    <div className="space-y-6">
      {/* Top Banner Alert for Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                {pendingApprovals.length} Wholesale Order(s) Awaiting Approval
              </p>
              <p className="text-[11px] text-amber-800">
                Immediate action required for RF-2026-00482 (Sharma General Store).
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("orders")}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[40px] shrink-0"
          >
            <span>Review Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 8 Key Operational Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          label="Today's Booked Sales"
          value={formatCurrency(todayBookedSales)}
          subtext="Total orders booked"
          icon={TrendingUp}
          variant="brand"
        />
        <MetricCard
          label="Delivered Sales"
          value={formatCurrency(todayDeliveredSales)}
          subtext="Delivered & confirmed"
          icon={Truck}
          variant="success"
        />
        <MetricCard
          label="Payments Collected"
          value={formatCurrency(6000)}
          subtext="Today's collections"
          icon={Wallet}
          variant="default"
        />
        <MetricCard
          label="Retailer Outstanding"
          value={formatCurrency(totalOutstanding)}
          subtext="Across 6 retailers"
          icon={AlertCircle}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          label="Pending Approvals"
          value={pendingApprovals.length}
          subtext="Awaiting credit clearance"
          icon={Clock}
          variant={pendingApprovals.length > 0 ? "warning" : "default"}
          onClick={() => setActiveTab("orders")}
        />
        <MetricCard
          label="Orders In Packing"
          value={ordersBeingPacked.length}
          subtext="In Jaipur Main WH"
          icon={Package}
          variant="default"
        />
        <MetricCard
          label="Out For Delivery"
          value={ordersOutForDelivery.length}
          subtext="With Suresh Yadav"
          icon={Truck}
          variant="default"
        />
        <MetricCard
          label="Low Stock Items"
          value={lowStockProducts.length}
          subtext="Below safety threshold"
          icon={AlertCircle}
          variant={lowStockProducts.length > 0 ? "danger" : "default"}
          onClick={() => setActiveTab("inventory")}
        />
      </div>

      {/* Charts & Operational Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-day Sales Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">7-Day Wholesale Sales Trend</h3>
              <p className="text-xs text-slate-500">Daily booked order values (in ₹)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              +14.2% vs last week
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEVEN_DAY_SALES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value || 0)), "Wholesale Sales"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="sales" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salesperson Target Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Field Sales Performance</h3>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                Beat-04
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
                RK
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{salesperson?.name || "Rakesh Kumar"}</p>
                <p className="text-[11px] text-slate-500">Mansarovar West Route</p>
              </div>
            </div>

            <div className="space-y-3">
              {targets
                .filter((t) => t.role === "salesperson")
                .slice(0, 3)
                .map((tar) => {
                  const pct = Math.min(100, Math.round((tar.currentValue / tar.targetValue) * 100));
                  return (
                    <div key={tar.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">{tar.metricName}</span>
                        <span className="font-bold text-slate-900">{pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-600" : "bg-amber-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>
                          {tar.unit === "₹" ? formatCurrency(tar.currentValue) : `${tar.currentValue} ${tar.unit}`}
                        </span>
                        <span>
                          Target: {tar.unit === "₹" ? formatCurrency(tar.targetValue) : `${tar.targetValue} ${tar.unit}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab("targets")}
            className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors min-h-[40px] flex items-center justify-center gap-1"
          >
            <span>View All Targets & Incentives</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Low Stock Watchlist & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low stock watchlist */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Warehouse Low Stock Watchlist</h3>
              <p className="text-xs text-slate-500">Products near or below reorder threshold</p>
            </div>
            <button
              onClick={() => setActiveTab("inventory")}
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Manage Stock →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {products
              .filter((p) => p.warehouseStock <= p.lowStockThreshold + 5)
              .map((prod) => {
                const isCritical = prod.warehouseStock <= prod.lowStockThreshold;

                return (
                  <div key={prod.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{prod.name}</p>
                      <p className="text-[11px] text-slate-500">
                        SKU: {prod.sku} • {prod.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          isCritical
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {prod.warehouseStock} {prod.unit} left
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Threshold: {prod.lowStockThreshold}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Recent Wholesale Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Wholesale Orders</h3>
              <p className="text-xs text-slate-500">Live order pipeline</p>
            </div>
            <button
              onClick={() => setActiveTab("orders")}
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              All Orders ({orders.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                onClick={() => setActiveTab("orders")}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ord.orderNumber}</span>
                    <StatusBadge status={ord.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {ord.retailerName} • {ord.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">{formatCurrency(ord.totalAmount)}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">{ord.paymentType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
