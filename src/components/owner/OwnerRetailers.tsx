"use client";

import React, { useState, useMemo } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { Retailer } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Modal } from "@/components/shared/Modal";
import {
  Search,
  Store,
  MapPin,
  Eye,
} from "lucide-react";

export function OwnerRetailers() {
  const { retailers, orders, payments } = useRouteFlowStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);

  const filteredRetailers = useMemo(() => {
    return retailers.filter((r) => {
      return (
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery)
      );
    });
  }, [retailers, searchQuery]);

  // Specific ledger entries for selected retailer
  const retailerOrders = useMemo(() => {
    if (!selectedRetailer) return [];
    return orders.filter((o) => o.retailerId === selectedRetailer.id);
  }, [orders, selectedRetailer]);

  const retailerPayments = useMemo(() => {
    if (!selectedRetailer) return [];
    return payments.filter((p) => p.retailerId === selectedRetailer.id);
  }, [payments, selectedRetailer]);

  return (
    <div className="space-y-4">
      {/* Top Search & Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search retailer, owner name or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[40px]"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredRetailers.length}</span>{" "}
          registered retail partners in Beat BEAT-04
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-4">Retailer / Shop</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Area / Beat</th>
              <th className="py-3 px-4 text-right">Payment Due</th>
              <th className="py-3 px-4 text-right">Credit Limit</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRetailers.map((r) => {
              const hasOverdue = r.overdueAmount > 0;

              return (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-blue-900 shrink-0" />
                      <span>{r.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal pl-6">
                      {r.address}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{r.ownerName}</div>
                    <div className="text-[10px] text-slate-400">{r.phone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-700">{r.area}</span>
                    <span className="text-[10px] text-slate-400 block">{r.beatCode}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-bold text-sm ${
                        hasOverdue
                          ? "text-rose-600"
                          : r.pendingAmount > 0
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {formatCurrency(r.pendingAmount)}
                    </span>
                    {hasOverdue && (
                      <span className="text-[10px] text-rose-600 block font-semibold">
                        Overdue: {formatCurrency(r.overdueAmount)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                    {formatCurrency(r.creditLimit)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={r.accountStatus} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedRetailer(r)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ledger & Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredRetailers.map((r) => {
          const hasOverdue = r.overdueAmount > 0;

          return (
            <div
              key={r.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{r.name}</h4>
                  <p className="text-xs text-slate-600">Owner: {r.ownerName}</p>
                </div>
                <StatusBadge status={r.accountStatus} size="sm" />
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {r.address}, {r.area}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Payment Due
                  </span>
                  <span
                    className={`font-extrabold text-sm ${
                      hasOverdue
                        ? "text-rose-600"
                        : r.pendingAmount > 0
                        ? "text-amber-700"
                        : "text-emerald-700"
                    }`}
                  >
                    {formatCurrency(r.pendingAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Credit Limit
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(r.creditLimit)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRetailer(r)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> View Ledger History
              </button>
            </div>
          );
        })}
      </div>

      {/* Retailer Detail & Ledger Modal */}
      <Modal
        isOpen={!!selectedRetailer}
        onClose={() => setSelectedRetailer(null)}
        title={selectedRetailer ? selectedRetailer.name : ""}
        subtitle={selectedRetailer ? `Prop: ${selectedRetailer.ownerName} • ${selectedRetailer.phone}` : ""}
        maxWidth="lg"
      >
        {selectedRetailer && (
          <div className="space-y-4 text-xs">
            {/* Balance Overview */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Pending Balance
                </span>
                <span className="font-extrabold text-base text-slate-900 mt-0.5 block">
                  {formatCurrency(selectedRetailer.pendingAmount)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Credit Limit
                </span>
                <span className="font-bold text-base text-slate-700 mt-0.5 block">
                  {formatCurrency(selectedRetailer.creditLimit)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Account Status
                </span>
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={selectedRetailer.accountStatus} size="sm" />
                </div>
              </div>
            </div>

            {/* Simple Ledger History */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider">
                Wholesale Account Ledger
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Transaction / Ref</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3 text-right">Debit (+)</th>
                      <th className="py-2 px-3 text-right">Credit (-)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Orders as Debits */}
                    {retailerOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500">
                          {ord.createdAt.split("T")[0]}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          Order {ord.orderNumber}
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800">
                            Invoice
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          {formatCurrency(ord.totalAmount)}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-400">-</td>
                      </tr>
                    ))}

                    {/* Payments as Credits */}
                    {retailerPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500">
                          {pay.collectedAt.split("T")[0]}
                        </td>
                        <td className="py-2 px-3 font-semibold text-emerald-800">
                          Payment {pay.receiptNumber}
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                            {pay.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-slate-400">-</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-700">
                          {formatCurrency(pay.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRetailer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg min-h-[44px]"
              >
                Close Ledger
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
