"use client";

import React, { useState, useMemo } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { Modal } from "@/components/shared/Modal";
import {
  Search,
  Plus,
  Minus,
  FileCheck,
  Send,
  ArrowRight,
} from "lucide-react";

interface OrderBookingProps {
  defaultRetailerId?: string;
  onOrderSuccess?: (orderId: string) => void;
}

export function OrderBooking({ defaultRetailerId, onOrderSuccess }: OrderBookingProps) {
  const { products, retailers, submitOrder, setActiveTab, setRole } = useRouteFlowStore();

  const [selectedRetailerId, setSelectedRetailerId] = useState<string>(
    defaultRetailerId || retailers[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentType, setPaymentType] = useState<"Credit" | "Cash" | "UPI">("Credit");
  const [orderItems, setOrderItems] = useState<Record<string, number>>({
    "prod-1": 10, // Default 10 units of Tea to demonstrate Buy 10 get 1 free scheme!
    "prod-2": 8,
    "prod-3": 4,
  });

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);

  const selectedRetailer = retailers.find((r) => r.id === selectedRetailerId);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleQtyChange = (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const currentQty = orderItems[productId] || 0;
    const newQty = Math.max(0, currentQty + delta);

    // Prevent quantity above warehouse available stock!
    if (newQty > prod.warehouseStock) {
      alert(
        `Cannot add more than ${prod.warehouseStock} units. Warehouse stock limit reached for ${prod.name}.`
      );
      return;
    }

    setOrderItems((prev) => {
      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  // Calculations: Subtotal, scheme free items
  const { summaryItems, totalAmount, totalFreeUnits } = useMemo(() => {
    let sum = 0;
    let free = 0;
    const list: {
      product: (typeof products)[0];
      quantity: number;
      freeQuantity: number;
      total: number;
    }[] = [];

    for (const [prodId, qty] of Object.entries(orderItems)) {
      if (qty <= 0) continue;
      const prod = products.find((p) => p.id === prodId);
      if (!prod) continue;

      let freeQuantity = 0;
      if (prod.sku === "TEA-250") {
        freeQuantity = Math.floor(qty / 10);
      }

      const itemTotal = qty * prod.retailerPrice;
      sum += itemTotal;
      free += freeQuantity;

      list.push({
        product: prod,
        quantity: qty,
        freeQuantity,
        total: itemTotal,
      });
    }

    return {
      summaryItems: list,
      totalAmount: sum,
      totalFreeUnits: free,
    };
  }, [orderItems, products]);

  const handleSubmitOrder = () => {
    if (summaryItems.length === 0 || !selectedRetailer) return;

    const items = summaryItems.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    }));

    const orderId = submitOrder({
      retailerId: selectedRetailer.id,
      items,
      paymentType,
      salespersonName: "Rakesh Kumar",
    });

    setSubmittedOrderId(orderId);
    setIsReviewOpen(false);
    if (onOrderSuccess) onOrderSuccess(orderId);
  };

  if (submittedOrderId) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center space-y-4 max-w-lg mx-auto animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <FileCheck className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Order Submitted
          </span>
          <h3 className="text-xl font-extrabold text-slate-950 mt-2">
            Wholesale Order Booked!
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Order for <strong>{selectedRetailer?.name}</strong> has been saved and is now awaiting Owner approval.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Retailer:</span>
            <span className="font-bold text-slate-900">{selectedRetailer?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Invoiced:</span>
            <span className="font-extrabold text-blue-900">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Terms:</span>
            <span className="font-semibold text-slate-700">{paymentType}</span>
          </div>
          {totalFreeUnits > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
              <span>Scheme Applied:</span>
              <span>+{totalFreeUnits} Free Tea Packets</span>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              setRole("owner");
              setActiveTab("orders");
            }}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Switch to Owner & Approve This Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSubmittedOrderId(null);
              setOrderItems({});
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold min-h-[44px]"
          >
            Book Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Retailer Selector & Payment Type */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Booking For Retailer:
          </label>
          <select
            value={selectedRetailerId}
            onChange={(e) => setSelectedRetailerId(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 min-h-[40px]"
          >
            {retailers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.area}) — Bal: {formatCurrency(r.pendingAmount)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Payment Terms:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["Credit", "Cash", "UPI"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentType(mode)}
                className={`py-2 text-xs font-bold rounded-lg border transition-colors min-h-[40px] ${
                  paymentType === mode
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scheme Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-2 text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <span className="text-base">🎁</span>
          <div>
            <strong className="block leading-tight">Wholesale Promo: Premium Tea 250g</strong>
            <span className="text-[11px] text-emerald-800">
              Buy 10 packets, get 1 packet free automatically applied.
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 uppercase">
          Active
        </span>
      </div>

      {/* Product Search & Category Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search wholesale catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[40px]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap min-h-[36px] ${
                selectedCategory === cat
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-2.5">
        {filteredProducts.map((prod) => {
          const qty = orderItems[prod.id] || 0;
          const isSelected = qty > 0;
          const isLow = prod.warehouseStock <= prod.lowStockThreshold;

          let freeUnits = 0;
          if (prod.sku === "TEA-250" && qty >= 10) {
            freeUnits = Math.floor(qty / 10);
          }

          return (
            <div
              key={prod.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? "bg-blue-50/50 border-blue-300 shadow-xs"
                  : "bg-white border-slate-200 shadow-2xs"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{prod.name}</h4>
                    {prod.scheme && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                        {prod.scheme}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    SKU: {prod.sku} • Stock:{" "}
                    <span className={isLow ? "text-rose-600 font-bold" : "font-semibold"}>
                      {prod.warehouseStock} {prod.unit}
                    </span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 block">
                    {formatCurrency(prod.retailerPrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through block">
                    MRP {formatCurrency(prod.mrp)}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Bonus Badges */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {freeUnits > 0 ? (
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      +{freeUnits} Free Bonus Applied!
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Line Total:{" "}
                      <strong className="text-slate-900">
                        {formatCurrency(qty * prod.retailerPrice)}
                      </strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleQtyChange(prod.id, -1)}
                    disabled={qty === 0}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center font-bold text-base min-h-[44px] min-w-[44px] active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-extrabold text-sm text-slate-900">
                    {qty}
                  </span>
                  <button
                    onClick={() => handleQtyChange(prod.id, 1)}
                    disabled={qty >= prod.warehouseStock}
                    className="w-10 h-10 rounded-lg bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center font-bold text-base min-h-[44px] min-w-[44px] active:scale-95 shadow-xs"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Order Review Bar (Touch-Friendly) */}
      <div className="sticky bottom-16 md:bottom-4 z-20 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {summaryItems.length} Products Ordered
          </span>
          <span className="text-lg font-extrabold text-white">
            {formatCurrency(totalAmount)}
          </span>
          {totalFreeUnits > 0 && (
            <span className="text-[10px] text-emerald-400 block font-semibold">
              (+{totalFreeUnits} Free units included)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReviewOpen(true)}
            disabled={summaryItems.length === 0}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            <span>Review & Submit Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Review Order Modal */}
      <Modal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title="Review Wholesale Order"
        subtitle={`Retailer: ${selectedRetailer?.name} • Mansarovar West`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {summaryItems.map((item) => (
              <div key={item.product.id} className="p-3 bg-white flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-slate-900">{item.product.name}</h5>
                  <p className="text-[11px] text-slate-500">
                    {item.quantity} units @ {formatCurrency(item.product.retailerPrice)}
                    {item.freeQuantity > 0 && (
                      <span className="ml-2 font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        +{item.freeQuantity} Free
                      </span>
                    )}
                  </p>
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Terms:</span>
              <span className="font-bold text-slate-900">{paymentType}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-extrabold text-slate-950">
              <span>Final Invoiced Total:</span>
              <span className="text-blue-900">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsReviewOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px]"
            >
              Back to Catalog
            </button>
            <button
              onClick={handleSubmitOrder}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg min-h-[44px] flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Submit Order</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
