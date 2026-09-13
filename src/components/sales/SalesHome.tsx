"use client";

import React, { useState } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { formatCurrency } from "@/lib/formatters";
import { Modal } from "@/components/shared/Modal";
import {
  MapPin,
  Calendar,
  Navigation,
  ShoppingCart,
  CreditCard,
  UserPlus,
  Clock,
  ChevronRight,
} from "lucide-react";

export function SalesHome() {
  const { retailers, setActiveTab, addNewRetailer } = useRouteFlowStore();

  const [isAddRetailerOpen, setIsAddRetailerOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newPhone, setNewPhone] = useState("+91 ");
  const [newAddress, setNewAddress] = useState("");
  const [newArea, setNewArea] = useState("Sector 9, Mansarovar");
  const [newCreditLimit, setNewCreditLimit] = useState(15000);

  const totalShops = retailers.length;
  const visitedShops = retailers.filter((r) => r.visitStatus === "Visited").length;
  const remainingShops = totalShops - visitedShops;

  // Preset demo values as requested: Order value ₹9,309, payments ₹6,000
  const todayOrderValue = 9309;
  const todayPaymentsCollected = 6000;

  const handleAddRetailerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewRetailer({
      name: newStoreName,
      ownerName: newOwnerName,
      phone: newPhone,
      address: newAddress,
      area: newArea,
      beatCode: "BEAT-04",
      pendingAmount: 0,
      overdueAmount: 0,
      creditLimit: newCreditLimit,
      accountStatus: "Active",
      visitStatus: "Pending",
    });

    setIsAddRetailerOpen(false);
    setNewStoreName("");
    setNewOwnerName("");
    setNewAddress("");
  };

  return (
    <div className="space-y-5">
      {/* Top Greeting & Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Beat Officer: Rakesh Kumar
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 mt-1">
              Good Morning, Rakesh
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Sunday, 13 September 2026</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online & Field Synced</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <MapPin className="w-5 h-5 text-blue-900 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned Route</p>
              <p className="text-xs font-extrabold text-slate-900">Mansarovar West (BEAT-04)</p>
            </div>
          </div>
        </div>

        {/* Beat Progress Summary */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Total Shops on Beat
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
              {totalShops} Shops
            </span>
            <span className="text-[10px] text-slate-500">BEAT-04 list</span>
          </div>

          <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">
              Visited
            </span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">
              {visitedShops} Shops
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Audited & serviced</span>
          </div>

          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
            <span className="text-[10px] text-amber-800 uppercase font-bold block">
              Remaining
            </span>
            <span className="text-xl font-extrabold text-amber-700 mt-0.5 block">
              {remainingShops} Shops
            </span>
            <span className="text-[10px] text-amber-700 font-medium">To visit today</span>
          </div>

          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <span className="text-[10px] text-blue-800 uppercase font-bold block">
              Booked Value
            </span>
            <span className="text-xl font-extrabold text-blue-900 mt-0.5 block">
              {formatCurrency(todayOrderValue)}
            </span>
            <span className="text-[10px] text-blue-700 font-medium">
              Collected: {formatCurrency(todayPaymentsCollected)}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quick Actions (Large Touch Friendly >= 48px) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Field Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab("beat")}
            className="p-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] min-h-[72px]"
          >
            <Navigation className="w-5 h-5 text-blue-300" />
            <span>Continue Beat</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] min-h-[72px]"
          >
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            <span>Book New Order</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] min-h-[72px]"
          >
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Collect Payment</span>
          </button>

          <button
            onClick={() => setIsAddRetailerOpen(true)}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] min-h-[72px]"
          >
            <UserPlus className="w-5 h-5 text-amber-600" />
            <span>Onboard Retailer</span>
          </button>
        </div>
      </div>

      {/* Next Up Shop Alert */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-900" /> Next Store on Mansarovar West Beat
          </span>
          <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
            Stop #1 of 6
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <h4 className="text-sm font-extrabold text-slate-950">
              Sharma General Store
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Owner: Mohan Sharma • Sector 9, Mansarovar
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Payment Due: <strong className="text-slate-900">₹3,250</strong> • Credit Limit: ₹20,000
            </p>
          </div>

          <button
            onClick={() => setActiveTab("beat")}
            className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <span>Start Shop Visit</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Retailer Modal */}
      <Modal
        isOpen={isAddRetailerOpen}
        onClose={() => setIsAddRetailerOpen(false)}
        title="Onboard New Retail Store"
        subtitle="Register a new retail partner on Mansarovar Beat-04."
        maxWidth="md"
      >
        <form onSubmit={handleAddRetailerSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Store / Shop Name:</label>
            <input
              type="text"
              required
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              placeholder="e.g. Khandelwal Provision Mart"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Owner Name:</label>
              <input
                type="text"
                required
                value={newOwnerName}
                onChange={(e) => setNewOwnerName(e.target.value)}
                placeholder="e.g. Anand Khandelwal"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone:</label>
              <input
                type="text"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Street Address:</label>
            <input
              type="text"
              required
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Shop number, market circle"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Area / Locality:</label>
              <select
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              >
                <option value="Sector 9, Mansarovar">Sector 9, Mansarovar</option>
                <option value="Madhyam Marg, Mansarovar">Madhyam Marg, Mansarovar</option>
                <option value="Shipra Path, Mansarovar">Shipra Path, Mansarovar</option>
                <option value="VT Road, Mansarovar">VT Road, Mansarovar</option>
                <option value="New Sanganer Road">New Sanganer Road</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Credit Limit (₹):</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={newCreditLimit}
                onChange={(e) => setNewCreditLimit(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddRetailerOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg min-h-[44px]"
            >
              Onboard Retailer (+₹500 Target)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
