"use client";

import React, { useMemo } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const CATEGORY_SALES = [
  { name: "Beverages", sales: 48500 },
  { name: "Biscuits", sales: 36200 },
  { name: "Edible Oils", sales: 29400 },
  { name: "Home Care", sales: 18600 },
  { name: "Personal Care", sales: 22100 },
  { name: "Staples", sales: 14800 },
];

export function OwnerReports() {
  const { orders, payments, addToast } = useRouteFlowStore();

  const totalDelivered = useMemo(() => {
    return orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const totalCollections = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const handleExportReport = () => {
    addToast({
      type: "success",
      title: "Report Exported",
      message: "Generated Jaipur Wholesale Monthly Performance Summary (PDF / CSV).",
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Wholesale Distribution Analytics</h3>
          <p className="text-xs text-slate-500">
            Jaipur Wholesale Distributors • Financial & Beat Performance
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 min-h-[40px] shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Invoiced
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(totalDelivered + 3469)}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">September 2026 MTD</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Verified Collections
          </span>
          <p className="text-xl font-extrabold text-blue-900 mt-1">
            {formatCurrency(totalCollections)}
          </p>
          <span className="text-[10px] text-slate-400">Cash & Verified UPI</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Fulfilment Rate
          </span>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">97.8%</p>
          <span className="text-[10px] text-slate-400">Order to dispatch accuracy</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Beat Efficiency
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">₹14,250</p>
          <span className="text-[10px] text-slate-400">Avg order drop size</span>
        </div>
      </div>

      {/* Sales by Category Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Sales Volume by FMCG Category</h4>
            <p className="text-xs text-slate-500">Distribution volume in INR</p>
          </div>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full">
            Mansarovar West Zone
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CATEGORY_SALES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickFormatter={(val) => `₹${val / 1000}k`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(val) => [formatCurrency(Number(val || 0)), "Volume"]}
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
    </div>
  );
}
