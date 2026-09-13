"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouteFlowStore } from "@/store/useRouteFlowStore";
import { Role } from "@/types";
import {
  ChevronDown,
  Check,
  RotateCcw,
  LogOut,
  Shield,
  Briefcase,
  Package,
  Truck,
} from "lucide-react";
import { Modal } from "./Modal";

const ROLES: {
  role: Role;
  name: string;
  title: string;
  icon: React.ElementType;
}[] = [
  {
    role: "owner",
    name: "Amit Agarwal",
    title: "Owner",
    icon: Shield,
  },
  {
    role: "salesperson",
    name: "Rakesh Kumar",
    title: "Salesperson",
    icon: Briefcase,
  },
  {
    role: "warehouse",
    name: "Manoj Sharma",
    title: "Warehouse",
    icon: Package,
  },
  {
    role: "delivery",
    name: "Suresh Yadav",
    title: "Delivery",
    icon: Truck,
  },
];

export function DemoSwitcher() {
  const { currentRole, setRole, resetDemoData } = useRouteFlowStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeRoleConfig = ROLES.find((r) => r.role === currentRole) || ROLES[0];
  const ActiveIcon = activeRoleConfig.icon;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold transition-colors min-h-[40px]"
          aria-label="Demo role switcher menu"
          aria-expanded={isOpen}
        >
          <div className="w-5 h-5 rounded-md bg-blue-900 text-white flex items-center justify-center shrink-0">
            <ActiveIcon className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] uppercase font-bold text-slate-500 leading-none">
              Demo Role
            </span>
            <span className="font-bold text-slate-900 leading-tight">
              {activeRoleConfig.name}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3 bg-slate-50 border-b border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Switch Demo Perspective
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Experience the business through all 4 roles
              </p>
            </div>

            <div className="p-1.5 space-y-1">
              {ROLES.map((r) => {
                const isSelected = currentRole === r.role;
                const IconComponent = r.icon;

                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      setRole(r.role);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors min-h-[44px] ${
                      isSelected
                        ? "bg-blue-50 text-blue-900 font-bold border border-blue-200"
                        : "hover:bg-slate-50 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center ${
                          isSelected
                            ? "bg-blue-900 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs">{r.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          {r.title}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-800" />}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsResetConfirmOpen(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Data
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setRole(null);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Exit Demo
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Reset Demo Data?"
        subtitle="Restore all mock data to the initial factory seed state."
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            This will reset all orders, stock levels, visits, and payments back to the
            beginning of the demonstration.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setIsResetConfirmOpen(false);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg min-h-[44px]"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
