"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Search } from "lucide-react";

export function WarehouseStock() {
  const { products } = useRouteFlowStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search warehouse bin SKU or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[40px]"
          />
        </div>
        <div className="text-xs text-slate-500">
          Warehouse: <strong className="text-slate-900">Jaipur Main Warehouse</strong> (Bay A & B)
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-4">SKU / Product</th>
              <th className="py-3 px-4 text-center">Bin Location</th>
              <th className="py-3 px-4 text-center">Available Stock</th>
              <th className="py-3 px-4 text-center">Reserved for Orders</th>
              <th className="py-3 px-4 text-center">Damaged / Hold</th>
              <th className="py-3 px-4 text-center">Threshold</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => {
              const isLow = p.warehouseStock <= p.lowStockThreshold;

              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[10px] text-slate-500">SKU: {p.sku}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-600">
                    Aisle A-{p.id.replace("prod-", "0")}
                  </td>
                  <td className="py-3 px-4 text-center font-extrabold text-sm text-slate-900">
                    {p.warehouseStock} {p.unit}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-amber-700">
                    {p.reservedStock > 0 ? `${p.reservedStock} ${p.unit}` : "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400">0</td>
                  <td className="py-3 px-4 text-center text-slate-500">
                    {p.lowStockThreshold}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={isLow ? "Low Stock" : "Healthy"} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
