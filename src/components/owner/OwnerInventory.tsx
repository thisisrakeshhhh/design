"use client";

import React, { useState, useMemo } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Modal } from "@/components/shared/Modal";
import {
  Search,
  Plus,
  Minus,
} from "lucide-react";

export function OwnerInventory() {
  const { products, adjustStock } = useRouteFlowStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [adjustingProductId, setAdjustingProductId] = useState<string | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState<number>(10);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [adjustmentReason, setAdjustmentReason] = useState("Stock Inward from Factory Depot");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === "all" || p.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.warehouseStock * p.retailerPrice, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.warehouseStock <= p.lowStockThreshold).length;
  }, [products]);

  const handleApplyAdjustment = () => {
    if (!adjustingProductId) return;
    const delta = adjustmentType === "add" ? Math.abs(adjustmentQty) : -Math.abs(adjustmentQty);
    adjustStock(adjustingProductId, delta, adjustmentReason);
    setAdjustingProductId(null);
  };

  const adjustingProduct = products.find((p) => p.id === adjustingProductId);

  return (
    <div className="space-y-4">
      {/* Top Value Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Products
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{products.length} SKUs</p>
          <span className="text-[10px] text-slate-400">In Jaipur Main Warehouse</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Stock Valuation
          </span>
          <p className="text-xl font-extrabold text-blue-900 mt-1">
            {formatCurrency(totalInventoryValue)}
          </p>
          <span className="text-[10px] text-slate-400">At wholesale retailer rate</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Low Stock Alerts
          </span>
          <p className="text-xl font-extrabold text-rose-600 mt-1">{lowStockCount} Items</p>
          <span className="text-[10px] text-rose-600 font-medium">Needs reorder dispatch</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Warehouse Depot
          </span>
          <p className="text-sm font-extrabold text-slate-900 mt-1 truncate">
            Jaipur Central Hub
          </p>
          <span className="text-[10px] text-emerald-700 font-bold">Operational</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product, SKU or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[40px]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap min-h-[36px] ${
                selectedCategory === cat
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-4">Product Name / SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Available Stock</th>
              <th className="py-3 px-4 text-center">Reserved</th>
              <th className="py-3 px-4 text-center">Min Threshold</th>
              <th className="py-3 px-4 text-right">Wholesale Rate</th>
              <th className="py-3 px-4 text-right">Total Value</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((prod) => {
              const isLow = prod.warehouseStock <= prod.lowStockThreshold;
              const val = prod.warehouseStock * prod.retailerPrice;

              return (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{prod.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>SKU: {prod.sku}</span>
                      {prod.scheme && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {prod.scheme}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{prod.category}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-slate-900 text-sm">
                    {prod.warehouseStock}{" "}
                    <span className="text-[10px] font-normal text-slate-500">{prod.unit}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-amber-700">
                    {prod.reservedStock > 0 ? `${prod.reservedStock} ${prod.unit}` : "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">
                    {prod.lowStockThreshold}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700">
                    {formatCurrency(prod.retailerPrice)}
                    <span className="text-[10px] text-slate-400 block">MRP {formatCurrency(prod.mrp)}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(val)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={isLow ? "Low Stock" : "Healthy"} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setAdjustingProductId(prod.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition-colors"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card-Based List */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((prod) => {
          const isLow = prod.warehouseStock <= prod.lowStockThreshold;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{prod.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    SKU: {prod.sku} • {prod.category}
                  </p>
                </div>
                <StatusBadge status={isLow ? "Low Stock" : "Healthy"} size="sm" />
              </div>

              {prod.scheme && (
                <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  🎁 {prod.scheme}
                </span>
              )}

              <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-slate-100 text-center">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Available
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {prod.warehouseStock}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Reserved
                  </span>
                  <span className="font-bold text-sm text-amber-700">
                    {prod.reservedStock}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Rate
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    {formatCurrency(prod.retailerPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setAdjustingProductId(prod.id)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg min-h-[44px] transition-colors"
              >
                Adjust Stock Quantity
              </button>
            </div>
          );
        })}
      </div>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={!!adjustingProductId}
        onClose={() => setAdjustingProductId(null)}
        title={adjustingProduct ? `Adjust Stock: ${adjustingProduct.name}` : ""}
        subtitle={adjustingProduct ? `Current Available: ${adjustingProduct.warehouseStock} ${adjustingProduct.unit}` : ""}
        maxWidth="sm"
      >
        {adjustingProduct && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Adjustment Type:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentType("add")}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 min-h-[40px] ${
                    adjustmentType === "add"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Plus className="w-4 h-4" /> Stock Inward (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType("remove")}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 min-h-[40px] ${
                    adjustmentType === "remove"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Minus className="w-4 h-4" /> Stock Outward (-)
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Quantity Units:</label>
              <input
                type="number"
                min="1"
                value={adjustmentQty}
                onChange={(e) => setAdjustmentQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Reason / Note:</label>
              <select
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              >
                <option value="Stock Inward from Factory Depot">Stock Inward from Factory Depot</option>
                <option value="Supplier Replacement">Supplier Replacement</option>
                <option value="Physical Audit Count Discrepancy">Physical Audit Count Discrepancy</option>
                <option value="Damaged / Leaked Goods Written Off">Damaged / Leaked Goods Written Off</option>
                <option value="Sample Dispensation for Marketing">Sample Dispensation</option>
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600">
              <span className="font-bold block text-slate-900">Projected New Quantity:</span>
              <span className="text-sm font-extrabold text-blue-900">
                {adjustmentType === "add"
                  ? adjustingProduct.warehouseStock + adjustmentQty
                  : Math.max(0, adjustingProduct.warehouseStock - adjustmentQty)}{" "}
                {adjustingProduct.unit}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAdjustingProductId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyAdjustment}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg min-h-[44px]"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
