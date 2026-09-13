"use client";

import React, { useState, useMemo } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { Order } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Modal } from "@/components/shared/Modal";
import {
  Search,
  Clock,
  Eye,
} from "lucide-react";

export function OwnerOrders() {
  const { orders, approveOrder, rejectOrder } = useRouteFlowStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Reject Modal state
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.retailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.salespersonName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleApprove = (orderId: string) => {
    approveOrder(orderId);
    if (selectedOrder && selectedOrder.id === orderId) {
      // update local selected view
      const updated = orders.find((o) => o.id === orderId);
      if (updated) setSelectedOrder({ ...updated, status: "Approved" });
    }
  };

  const handleOpenReject = (orderId: string) => {
    setRejectingOrderId(orderId);
    setRejectionReason("Credit limit exceeded for retailer");
  };

  const handleConfirmReject = () => {
    if (!rejectingOrderId) return;
    rejectOrder(rejectingOrderId, rejectionReason);
    setRejectingOrderId(null);
    setRejectionReason("");
    if (selectedOrder && selectedOrder.id === rejectingOrderId) {
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, retailer, or salesperson..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[40px]"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {["all", "submitted", "approved", "picking", "packed", "delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap min-h-[36px] ${
                statusFilter === status
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {status === "all" ? "All Orders" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Retailer</th>
              <th className="py-3 px-4">Salesperson</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No orders found matching your search.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isSubmitted = order.status === "Submitted";

                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{order.retailerName}</div>
                      <div className="text-[10px] text-slate-500">{order.beatName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {order.salespersonName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      {order.items.length} products
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {order.paymentType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isSubmitted && (
                          <>
                            <button
                              onClick={() => handleApprove(order.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors"
                              title="Approve order"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleOpenReject(order.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-bold text-[11px] transition-colors"
                              title="Reject order"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card-Based List */}
      <div className="md:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No orders found matching filters.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isSubmitted = order.status === "Submitted";

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      {order.orderNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-950 mt-0.5">
                      {order.retailerName}
                    </h4>
                  </div>
                  <StatusBadge status={order.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Total Value
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Payment Type
                    </span>
                    <span className="font-semibold text-slate-700">
                      {order.paymentType}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Salesperson
                    </span>
                    <span className="font-medium text-slate-600 truncate block">
                      {order.salespersonName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Products
                    </span>
                    <span className="font-medium text-slate-700">
                      {order.items.length} items
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px] flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>

                  {isSubmitted && (
                    <>
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg min-h-[44px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleOpenReject(order.id)}
                        className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg min-h-[44px]"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order Details: ${selectedOrder.orderNumber}` : ""}
        subtitle={selectedOrder ? `${selectedOrder.retailerName} • ${selectedOrder.beatName}` : ""}
        maxWidth="lg"
      >
        {selectedOrder && (
          <div className="space-y-5 text-xs">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.status} size="sm" />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                <span className="font-extrabold text-sm text-slate-900 mt-0.5 block">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Type</span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {selectedOrder.paymentType}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Salesperson</span>
                <span className="font-medium text-slate-700 mt-1 block truncate">
                  {selectedOrder.salespersonName}
                </span>
              </div>
            </div>

            {/* Product Items Table */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider">
                Ordered Products
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Product / SKU</th>
                      <th className="py-2 px-3 text-center">Ordered</th>
                      <th className="py-2 px-3 text-center">Free Scheme</th>
                      <th className="py-2 px-3 text-right">Price</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{item.productName}</div>
                          <div className="text-[10px] text-slate-500">SKU: {item.sku}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {item.freeQuantity > 0 ? (
                            <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded">
                              +{item.freeQuantity} Free
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="py-2.5 px-3 text-right text-slate-700">
                        Order Total:
                      </td>
                      <td className="py-2.5 px-3 text-right text-sm text-slate-900">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Status Timeline History */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider">
                Order Status Timeline
              </h4>
              <div className="border border-slate-200 rounded-lg p-3 space-y-3 bg-slate-50/50">
                {selectedOrder.statusTimeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{item.status}</span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">{item.updatedBy}</p>
                      {item.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons if Submitted */}
            {selectedOrder.status === "Submitted" && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => handleOpenReject(selectedOrder.id)}
                  className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg min-h-[44px]"
                >
                  Reject Order
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg min-h-[44px] shadow-xs"
                >
                  Approve Order for Warehouse
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Reason Dialog */}
      <Modal
        isOpen={!!rejectingOrderId}
        onClose={() => setRejectingOrderId(null)}
        title="Reject Wholesale Order"
        subtitle="Specify the business reason for rejecting this order."
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Select or Enter Reason:
            </label>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-rose-500 min-h-[40px] mb-2"
            >
              <option value="Credit limit exceeded for retailer">Credit limit exceeded</option>
              <option value="Overdue balance pending settlement">Overdue balance pending</option>
              <option value="Retailer requested order cancellation">Retailer requested cancellation</option>
              <option value="Insufficient warehouse stock">Insufficient warehouse stock</option>
              <option value="Pricing / scheme verification discrepancy">Pricing discrepancy</option>
            </select>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Additional notes for salesperson..."
              rows={3}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setRejectingOrderId(null)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg min-h-[44px]"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
