import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Role,
  Product,
  Retailer,
  Order,
  Delivery,
  Payment,
  Employee,
  Target,
  ShopVisit,
  ActivityItem,
  ToastNotification,
} from "@/types";
import {
  INITIAL_PRODUCTS,
  INITIAL_RETAILERS,
  INITIAL_ORDERS,
  INITIAL_DELIVERIES,
  INITIAL_PAYMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_TARGETS,
  INITIAL_ACTIVITY,
  INITIAL_ACTIVE_VISIT,
  SEED_DATA_VERSION,
} from "@/lib/seed-data";

interface RouteFlowState {
  currentRole: Role | null;
  activeTab: string;
  isDemoGuideOpen: boolean;
  demoGuideStep: number;
  seedVersion: string;

  products: Product[];
  retailers: Retailer[];
  orders: Order[];
  deliveries: Delivery[];
  payments: Payment[];
  employees: Employee[];
  targets: Target[];
  activeVisit: ShopVisit | null;
  activityLog: ActivityItem[];
  toasts: ToastNotification[];

  // Actions
  setRole: (role: Role | null) => void;
  setActiveTab: (tab: string) => void;
  setDemoGuideOpen: (open: boolean) => void;
  setDemoGuideStep: (step: number) => void;
  nextDemoGuideStep: () => void;
  prevDemoGuideStep: () => void;
  addToast: (toast: Omit<ToastNotification, "id" | "timestamp">) => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;

  // Visit & Shop Stock
  updateActiveVisitStock: (productId: string, shopStock: number, orderQty: number) => void;
  completeActiveVisit: (notes?: string) => void;

  // Orders Lifecycle
  submitOrder: (data: {
    retailerId: string;
    items: { productId: string; quantity: number }[];
    paymentType: Order["paymentType"];
    salespersonName?: string;
  }) => string; // returns new order id
  approveOrder: (orderId: string) => void;
  rejectOrder: (orderId: string, reason: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  startPickingOrder: (orderId: string) => void;
  completePackingOrder: (
    orderId: string,
    pickedItems: { productId: string; requestedQty: number; pickedQty: number }[],
    packageCount: number,
    notes?: string
  ) => void;
  dispatchOrder: (orderId: string, deliveryExecutive: string) => void;

  // Delivery Lifecycle
  markOutForDelivery: (deliveryId: string) => void;
  completeDelivery: (data: {
    deliveryId: string;
    proofType: "OTP" | "Signature" | "Photograph";
    otpUsed: string;
    paymentMode: "Credit" | "Cash" | "UPI";
    collectedAmount?: number;
    deliveryNotes?: string;
    isPartial?: boolean;
  }) => void;
  failDelivery: (deliveryId: string, reason: string) => void;

  // Payments & Inventory
  recordPayment: (data: {
    retailerId: string;
    amount: number;
    paymentMethod: Payment["paymentMethod"];
    referenceNumber?: string;
  }) => void;
  adjustStock: (productId: string, deltaQty: number, reason: string) => void;
  addNewRetailer: (retailer: Omit<Retailer, "id" | "visitSequence">) => void;
  addNewTarget: (target: Omit<Target, "id" | "currentValue" | "estimatedIncentive" | "approvedIncentive">) => void;
}

export const useRouteFlowStore = create<RouteFlowState>()(
  persist(
    (set, get) => ({
      currentRole: null, // Starts on Role Selection screen
      activeTab: "dashboard",
      isDemoGuideOpen: false,
      demoGuideStep: 1,
      seedVersion: SEED_DATA_VERSION,

      products: INITIAL_PRODUCTS,
      retailers: INITIAL_RETAILERS,
      orders: INITIAL_ORDERS,
      deliveries: INITIAL_DELIVERIES,
      payments: INITIAL_PAYMENTS,
      employees: INITIAL_EMPLOYEES,
      targets: INITIAL_TARGETS,
      activeVisit: INITIAL_ACTIVE_VISIT,
      activityLog: INITIAL_ACTIVITY,
      toasts: [],

      setRole: (role) => {
        set({
          currentRole: role,
          activeTab: role === "salesperson" ? "home" : "dashboard",
        });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      setDemoGuideOpen: (open) => set({ isDemoGuideOpen: open }),

      setDemoGuideStep: (step) => set({ demoGuideStep: step }),

      nextDemoGuideStep: () => {
        const cur = get().demoGuideStep;
        if (cur < 8) set({ demoGuideStep: cur + 1 });
      },

      prevDemoGuideStep: () => {
        const cur = get().demoGuideStep;
        if (cur > 1) set({ demoGuideStep: cur - 1 });
      },

      addToast: (toast) => {
        const newToast: ToastNotification = {
          id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toISOString(),
          ...toast,
        };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      resetDemoData: () => {
        set({
          currentRole: null,
          activeTab: "dashboard",
          isDemoGuideOpen: false,
          demoGuideStep: 1,
          products: INITIAL_PRODUCTS,
          retailers: INITIAL_RETAILERS,
          orders: INITIAL_ORDERS,
          deliveries: INITIAL_DELIVERIES,
          payments: INITIAL_PAYMENTS,
          employees: INITIAL_EMPLOYEES,
          targets: INITIAL_TARGETS,
          activeVisit: INITIAL_ACTIVE_VISIT,
          activityLog: INITIAL_ACTIVITY,
          seedVersion: SEED_DATA_VERSION,
        });
        get().addToast({
          type: "info",
          title: "Demo Reset",
          message: "All demo data has been restored to factory seed state.",
        });
      },

      updateActiveVisitStock: (productId, shopStock, orderQty) => {
        const visit = get().activeVisit;
        if (!visit) return;
        const updatedAudits = visit.stockAudits.map((item) =>
          item.productId === productId
            ? { ...item, shopStock, orderQty }
            : item
        );
        set({
          activeVisit: {
            ...visit,
            stockAudits: updatedAudits,
          },
        });
      },

      completeActiveVisit: (notes) => {
        const visit = get().activeVisit;
        if (!visit) return;
        const now = new Date().toISOString();

        // Mark retailer as Visited
        const updatedRetailers = get().retailers.map((r) =>
          r.id === visit.retailerId ? { ...r, visitStatus: "Visited" as const } : r
        );

        // Update salesperson shops giving business target
        const updatedTargets = get().targets.map((t) =>
          (t.metricName === "Shops Giving Business" || t.metricName === "Productive Visits") && t.role === "salesperson"
            ? { ...t, currentValue: t.currentValue + 1 }
            : t
        );

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "salesperson",
          userName: "Rakesh Kumar",
          action: "Shop Visit Completed",
          details: `Completed physical visit at ${visit.retailerName}. Audit saved.`,
          entityId: visit.id,
        };

        set({
          activeVisit: {
            ...visit,
            endTime: now,
            completed: true,
            notes: notes || visit.notes,
          },
          retailers: updatedRetailers,
          targets: updatedTargets,
          activityLog: [newActivity, ...get().activityLog],
        });

        get().addToast({
          type: "success",
          title: "Visit Completed",
          message: `Checked out from ${visit.retailerName} successfully.`,
        });
      },

      submitOrder: ({ retailerId, items, paymentType, salespersonName = "Rakesh Kumar" }) => {
        const state = get();
        const retailer = state.retailers.find((r) => r.id === retailerId);
        if (!retailer) return "";

        const now = new Date().toISOString();
        const randomNum = Math.floor(100 + Math.random() * 900);
        const orderNumber = `RF-2026-00${randomNum}`;
        const orderId = `ord-${Date.now()}`;

        // Map items and apply Buy 10 Get 1 Free on Tea
        let totalAmount = 0;
        const orderItems = items.map((item) => {
          const prod = state.products.find((p) => p.id === item.productId)!;
          let freeQuantity = 0;
          if (prod.sku === "TEA-250") {
            freeQuantity = Math.floor(item.quantity / 10);
          }
          const itemTotal = item.quantity * prod.retailerPrice;
          totalAmount += itemTotal;

          return {
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku,
            quantity: item.quantity,
            freeQuantity,
            unitPrice: prod.retailerPrice,
            totalPrice: itemTotal,
          };
        });

        // Submitted orders reserve ZERO inventory.
        const newOrder: Order = {
          id: orderId,
          orderNumber,
          retailerId: retailer.id,
          retailerName: retailer.name,
          salespersonId: "emp-sales-1",
          salespersonName,
          beatCode: retailer.beatCode,
          beatName: "Mansarovar West",
          items: orderItems,
          totalAmount,
          paymentType,
          status: "Submitted",
          statusTimeline: [
            {
              status: "Submitted",
              timestamp: now,
              updatedBy: `${salespersonName} (Salesperson)`,
              notes: `Order booked with ${orderItems.length} products. Total ₹${totalAmount}.`,
            },
          ],
          createdAt: now,
          updatedAt: now,
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "salesperson",
          userName: salespersonName,
          action: "New Order Booked",
          details: `Order ${orderNumber} placed for ${retailer.name} (₹${totalAmount.toLocaleString("en-IN")}). Zero stock reserved until Owner approval.`,
          entityId: orderId,
        };

        set({
          orders: [newOrder, ...state.orders],
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "success",
          title: "Order Submitted",
          message: `Order ${orderNumber} is now submitted and waiting for Owner approval.`,
        });

        return orderId;
      },

      approveOrder: (orderId) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return;

        // Idempotency: Approving an order reserves its approved quantities exactly once.
        // Repeating action or refreshing must never duplicate reservations.
        if (order.status !== "Submitted") {
          return;
        }

        const now = new Date().toISOString();

        // Reserve stock for approved quantities exactly once
        const updatedProducts = state.products.map((prod) => {
          const item = order.items.find((i) => i.productId === prod.id);
          if (!item) return prod;
          const totalUnitsToReserve = item.quantity + (item.freeQuantity || 0);
          return {
            ...prod,
            reservedStock: prod.reservedStock + totalUnitsToReserve,
          };
        });

        const updatedOrder: Order = {
          ...order,
          status: "Approved",
          updatedAt: now,
          statusTimeline: [
            ...order.statusTimeline,
            {
              status: "Approved",
              timestamp: now,
              updatedBy: "Amit Agarwal (Owner)",
              notes: "Credit limit verified. Order approved for warehouse picking.",
            },
          ],
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "owner",
          userName: "Amit Agarwal",
          action: "Order Approved",
          details: `Order ${order.orderNumber} approved. Inventory reserved and queued for warehouse.`,
          entityId: orderId,
        };

        set({
          orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
          products: updatedProducts,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "success",
          title: "Order Approved",
          message: `Order ${order.orderNumber} approved and stock reserved.`,
        });
      },

      rejectOrder: (orderId, reason) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return;

        // Idempotency: Guard against duplicate actions
        if (order.status === "Rejected" || order.status === "Cancelled" || order.status === "Delivered") {
          return;
        }

        const now = new Date().toISOString();

        // Release reservations only if order was previously in an approved/reserved status
        const wasReserved = [
          "Approved",
          "Under Picking",
          "Packed",
          "Ready for Dispatch",
          "Out for Delivery",
        ].includes(order.status);

        const updatedProducts = wasReserved
          ? state.products.map((prod) => {
              const item = order.items.find((i) => i.productId === prod.id);
              if (!item) return prod;
              const totalUnits = item.quantity + (item.freeQuantity || 0);
              return {
                ...prod,
                reservedStock: Math.max(0, prod.reservedStock - totalUnits),
              };
            })
          : state.products;

        const updatedOrder: Order = {
          ...order,
          status: "Rejected",
          rejectionReason: reason,
          updatedAt: now,
          statusTimeline: [
            ...order.statusTimeline,
            {
              status: "Rejected",
              timestamp: now,
              updatedBy: "Amit Agarwal (Owner)",
              notes: `Rejected: ${reason}`,
            },
          ],
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "owner",
          userName: "Amit Agarwal",
          action: "Order Rejected",
          details: `Order ${order.orderNumber} rejected: ${reason}.${wasReserved ? " Reserved stock released." : ""}`,
          entityId: orderId,
        };

        set({
          orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
          products: updatedProducts,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "warning",
          title: "Order Rejected",
          message: `Order ${order.orderNumber} has been rejected.`,
        });
      },

      cancelOrder: (orderId, reason = "Cancelled by store") => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return;

        if (order.status === "Cancelled" || order.status === "Rejected" || order.status === "Delivered") {
          return;
        }

        const now = new Date().toISOString();

        // Release reservations only if order was previously in an approved/reserved status
        const wasReserved = [
          "Approved",
          "Under Picking",
          "Packed",
          "Ready for Dispatch",
          "Out for Delivery",
        ].includes(order.status);

        const updatedProducts = wasReserved
          ? state.products.map((prod) => {
              const item = order.items.find((i) => i.productId === prod.id);
              if (!item) return prod;
              const totalUnits = item.quantity + (item.freeQuantity || 0);
              return {
                ...prod,
                reservedStock: Math.max(0, prod.reservedStock - totalUnits),
              };
            })
          : state.products;

        const updatedOrder: Order = {
          ...order,
          status: "Cancelled",
          rejectionReason: reason,
          updatedAt: now,
          statusTimeline: [
            ...order.statusTimeline,
            {
              status: "Cancelled",
              timestamp: now,
              updatedBy: "Amit Agarwal (Owner)",
              notes: `Cancelled: ${reason}`,
            },
          ],
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "owner",
          userName: "Amit Agarwal",
          action: "Order Cancelled",
          details: `Order ${order.orderNumber} cancelled.${wasReserved ? " Reserved stock released." : ""}`,
          entityId: orderId,
        };

        set({
          orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
          products: updatedProducts,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "info",
          title: "Order Cancelled",
          message: `Order ${order.orderNumber} has been cancelled.`,
        });
      },

      startPickingOrder: (orderId) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return;

        const now = new Date().toISOString();
        const updatedOrder: Order = {
          ...order,
          status: "Picking",
          updatedAt: now,
          statusTimeline: [
            ...order.statusTimeline,
            {
              status: "Picking",
              timestamp: now,
              updatedBy: "Manoj Sharma (Warehouse)",
              notes: "Picking list generated and bin scan in progress.",
            },
          ],
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "warehouse",
          userName: "Manoj Sharma",
          action: "Picking Started",
          details: `Started picking items for order ${order.orderNumber}.`,
          entityId: orderId,
        };

        set({
          orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "info",
          title: "Picking Started",
          message: `Order ${order.orderNumber} is being picked.`,
        });
      },

      completePackingOrder: (orderId, pickedItems, packageCount, notes) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return;

        const now = new Date().toISOString();

        // Update warehouse packed targets
        const updatedTargets = state.targets.map((t) =>
          t.metricName === "Orders Packed Target" && t.role === "warehouse"
            ? { ...t, currentValue: t.currentValue + 1 }
            : t
        );

        const updatedOrder: Order = {
          ...order,
          status: "Packed",
          packageCount,
          packingNotes: notes,
          pickedItems,
          updatedAt: now,
          statusTimeline: [
            ...order.statusTimeline,
            {
              status: "Packed",
              timestamp: now,
              updatedBy: "Manoj Sharma (Warehouse)",
              notes: `Packed into ${packageCount} carton(s). ${notes || ""}`,
            },
          ],
        };

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "warehouse",
          userName: "Manoj Sharma",
          action: "Order Packed",
          details: `Order ${order.orderNumber} packed (${packageCount} packages).`,
          entityId: orderId,
        };

        set({
          orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
          targets: updatedTargets,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "success",
          title: "Order Packed",
          message: `${order.orderNumber} is packed in ${packageCount} carton(s).`,
        });
      },

      dispatchOrder: (orderId, deliveryExecutive) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return;

        const retailer = state.retailers.find((r) => r.id === order.retailerId);
        const now = new Date().toISOString();

        const updatedOrder: Order = {
          ...order,
          status: "Ready for Dispatch",
          assignedDeliveryExecutive: deliveryExecutive,
          updatedAt: now,
          statusTimeline: [
            ...order.statusTimeline,
            {
              status: "Ready for Dispatch",
              timestamp: now,
              updatedBy: "Manoj Sharma (Warehouse)",
              notes: `Assigned to delivery executive: ${deliveryExecutive}. Staged in Bay 2.`,
            },
          ],
        };

        // Create or update Delivery entry
        const existingDelivery = state.deliveries.find((d) => d.orderId === orderId);
        let updatedDeliveries = state.deliveries;

        if (existingDelivery) {
          updatedDeliveries = state.deliveries.map((d) =>
            d.orderId === orderId
              ? {
                  ...d,
                  status: "Assigned",
                  assignedTo: deliveryExecutive,
                  packageCount: order.packageCount || 1,
                  amountToCollect: order.paymentType === "Credit" ? 0 : order.totalAmount,
                }
              : d
          );
        } else {
          const newDelivery: Delivery = {
            id: `del-${Date.now()}`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            retailerId: order.retailerId,
            retailerName: order.retailerName,
            address: retailer?.address || "Jaipur Market",
            area: retailer?.area || "Mansarovar West",
            phone: retailer?.phone || "+91 98000 00000",
            packageCount: order.packageCount || 1,
            amountToCollect: order.paymentType === "Credit" ? 0 : order.totalAmount,
            paymentType: order.paymentType === "Cheque" ? "Credit" : (order.paymentType as "Credit" | "Cash" | "UPI"),
            status: "Assigned",
            assignedTo: deliveryExecutive,
            sequenceNumber: state.deliveries.length + 1,
          };
          updatedDeliveries = [...state.deliveries, newDelivery];
        }

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "warehouse",
          userName: "Manoj Sharma",
          action: "Order Dispatched",
          details: `Order ${order.orderNumber} assigned to ${deliveryExecutive}.`,
          entityId: orderId,
        };

        set({
          orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
          deliveries: updatedDeliveries,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "success",
          title: "Dispatched",
          message: `Order assigned to ${deliveryExecutive}.`,
        });
      },

      markOutForDelivery: (deliveryId) => {
        const state = get();
        const delivery = state.deliveries.find((d) => d.id === deliveryId);
        if (!delivery) return;

        const now = new Date().toISOString();
        const updatedDeliveries = state.deliveries.map((d) =>
          d.id === deliveryId ? { ...d, status: "Out for Delivery" as const } : d
        );

        const updatedOrders = state.orders.map((o) =>
          o.id === delivery.orderId
            ? {
                ...o,
                status: "Out for Delivery" as const,
                updatedAt: now,
                statusTimeline: [
                  ...o.statusTimeline,
                  {
                    status: "Out for Delivery" as const,
                    timestamp: now,
                    updatedBy: `${delivery.assignedTo} (Delivery)`,
                    notes: "Loaded on van and en-route to retail shop.",
                  },
                ],
              }
            : o
        );

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "delivery",
          userName: delivery.assignedTo,
          action: "Out for Delivery",
          details: `Order ${delivery.orderNumber} loaded on vehicle and en route to ${delivery.retailerName}.`,
          entityId: deliveryId,
        };

        set({
          deliveries: updatedDeliveries,
          orders: updatedOrders,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "info",
          title: "Out for Delivery",
          message: `${delivery.orderNumber} is now en route to ${delivery.retailerName}.`,
        });
      },

      completeDelivery: ({
        deliveryId,
        proofType,
        otpUsed,
        paymentMode,
        collectedAmount = 0,
        deliveryNotes,
        isPartial = false,
      }) => {
        const state = get();
        const delivery = state.deliveries.find((d) => d.id === deliveryId);
        if (!delivery || delivery.status === "Delivered") return;

        const order = state.orders.find((o) => o.id === delivery.orderId);
        const now = new Date().toISOString();

        // 1. Update delivery record
        const updatedDeliveries = state.deliveries.map((d) =>
          d.id === deliveryId
            ? {
                ...d,
                status: "Delivered" as const,
                deliveredAt: now,
                proofType,
                otpUsed,
                deliveryNotes,
                isPartialDelivery: isPartial,
              }
            : d
        );

        // 2. Update order record
        const updatedOrders = state.orders.map((o) =>
          o.id === delivery.orderId
            ? {
                ...o,
                status: (isPartial ? "Partially Delivered" : "Delivered") as Order["status"],
                updatedAt: now,
                statusTimeline: [
                  ...o.statusTimeline,
                  {
                    status: (isPartial ? "Partially Delivered" : "Delivered") as Order["status"],
                    timestamp: now,
                    updatedBy: `${delivery.assignedTo} (Delivery)`,
                    notes: `Proof: ${proofType}${otpUsed ? ` (OTP: ${otpUsed})` : ""}. Payment: ${paymentMode}.`,
                  },
                ],
              }
            : o
        );

        // 3. Deduct warehouseStock and release reservedStock
        const updatedProducts = state.products.map((prod) => {
          if (!order) return prod;
          const orderItem = order.items.find((i) => i.productId === prod.id);
          if (!orderItem) return prod;
          const totalUnits = orderItem.quantity + (orderItem.freeQuantity || 0);
          return {
            ...prod,
            warehouseStock: Math.max(0, prod.warehouseStock - totalUnits),
            reservedStock: Math.max(0, prod.reservedStock - totalUnits),
          };
        });

        // 4. Update retailer pending balance
        // If order was Credit, retailer balance increases by order total.
        // If paid (Cash / UPI) right then, pending balance doesn't increase, or increases and is immediately paid.
        let newPayments = state.payments;
        let pendingChange = 0;

        if (paymentMode === "Credit") {
          pendingChange = order ? order.totalAmount : 0;
        } else if (collectedAmount > 0) {
          // Record payment
          const newPayment: Payment = {
            id: `pay-${Date.now()}`,
            receiptNumber: `RCP-2026-0${Math.floor(100 + Math.random() * 900)}`,
            retailerId: delivery.retailerId,
            retailerName: delivery.retailerName,
            amount: collectedAmount,
            paymentMethod: paymentMode as Payment["paymentMethod"],
            referenceNumber: `${paymentMode.toUpperCase()}-ON-DELIVERY`,
            collectedBy: delivery.assignedTo,
            collectedAt: now,
            orderId: delivery.orderId,
          };
          newPayments = [newPayment, ...state.payments];
        }

        const updatedRetailers = state.retailers.map((r) =>
          r.id === delivery.retailerId
            ? {
                ...r,
                pendingAmount: Math.max(0, r.pendingAmount + pendingChange),
                lastOrderDate: now.split("T")[0],
              }
            : r
        );

        // 5. Update Targets
        const orderTotal = order ? order.totalAmount : 0;
        const updatedTargets = state.targets.map((t) => {
          // Salesperson delivered sales
          if (t.role === "salesperson" && t.metricName === "Monthly Sales Target") {
            return { ...t, currentValue: t.currentValue + orderTotal };
          }
          // Salesperson payment collection if collected
          if (t.role === "salesperson" && t.metricName === "Payment Collections" && collectedAmount > 0) {
            return { ...t, currentValue: t.currentValue + collectedAmount };
          }
          // Delivery completed deliveries
          if (t.role === "delivery" && t.metricName === "Delivery Target") {
            return { ...t, currentValue: t.currentValue + 1 };
          }
          // Delivery collections
          if (t.role === "delivery" && t.metricName === "On-Field Collection Target" && collectedAmount > 0) {
            return { ...t, currentValue: t.currentValue + collectedAmount };
          }
          return t;
        });

        // 6. Activity log
        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "delivery",
          userName: delivery.assignedTo,
          action: "Order Delivered",
          details: `Order ${delivery.orderNumber} delivered to ${delivery.retailerName} (${proofType} proof).`,
          entityId: delivery.id,
        };

        set({
          deliveries: updatedDeliveries,
          orders: updatedOrders,
          products: updatedProducts,
          retailers: updatedRetailers,
          payments: newPayments,
          targets: updatedTargets,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "success",
          title: "Delivery Completed",
          message: `Order ${delivery.orderNumber} successfully delivered to ${delivery.retailerName}.`,
        });
      },

      failDelivery: (deliveryId, reason) => {
        const state = get();
        const delivery = state.deliveries.find((d) => d.id === deliveryId);
        if (!delivery) return;

        const now = new Date().toISOString();
        const updatedDeliveries = state.deliveries.map((d) =>
          d.id === deliveryId
            ? {
                ...d,
                status: "Failed" as const,
                failureReason: reason,
              }
            : d
        );

        const updatedOrders = state.orders.map((o) =>
          o.id === delivery.orderId
            ? {
                ...o,
                status: "Returned" as const,
                updatedAt: now,
                statusTimeline: [
                  ...o.statusTimeline,
                  {
                    status: "Returned" as const,
                    timestamp: now,
                    updatedBy: `${delivery.assignedTo} (Delivery)`,
                    notes: `Delivery failed: ${reason}. Order marked returned to warehouse.`,
                  },
                ],
              }
            : o
        );

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "delivery",
          userName: delivery.assignedTo,
          action: "Delivery Failed",
          details: `Failed delivery for ${delivery.retailerName}: ${reason}.`,
          entityId: deliveryId,
        };

        set({
          deliveries: updatedDeliveries,
          orders: updatedOrders,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "error",
          title: "Delivery Failed",
          message: `Delivery marked failed: ${reason}`,
        });
      },

      recordPayment: ({ retailerId, amount, paymentMethod, referenceNumber }) => {
        const state = get();
        const retailer = state.retailers.find((r) => r.id === retailerId);
        if (!retailer) return;

        const now = new Date().toISOString();
        const receiptNumber = `RCP-2026-0${Math.floor(100 + Math.random() * 900)}`;

        const newPayment: Payment = {
          id: `pay-${Date.now()}`,
          receiptNumber,
          retailerId,
          retailerName: retailer.name,
          amount,
          paymentMethod,
          referenceNumber: referenceNumber || `${paymentMethod.toUpperCase()}-REF`,
          collectedBy: "Rakesh Kumar",
          collectedAt: now,
        };

        // Update retailer balance
        const updatedRetailers = state.retailers.map((r) =>
          r.id === retailerId
            ? {
                ...r,
                pendingAmount: Math.max(0, r.pendingAmount - amount),
                overdueAmount: Math.max(0, r.overdueAmount - amount),
                accountStatus:
                  r.accountStatus === "Credit Blocked" && r.pendingAmount - amount <= 0
                    ? ("Active" as const)
                    : r.accountStatus,
              }
            : r
        );

        // Update target
        const updatedTargets = state.targets.map((t) =>
          t.metricName === "Payment Collections" && t.role === "salesperson"
            ? { ...t, currentValue: t.currentValue + amount }
            : t
        );

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "salesperson",
          userName: "Rakesh Kumar",
          action: "Payment Collected",
          details: `Collected ₹${amount.toLocaleString("en-IN")} from ${retailer.name} via ${paymentMethod}.`,
          entityId: newPayment.id,
        };

        set({
          payments: [newPayment, ...state.payments],
          retailers: updatedRetailers,
          targets: updatedTargets,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "success",
          title: "Payment Recorded",
          message: `Receipt ${receiptNumber} generated for ₹${amount.toLocaleString("en-IN")}.`,
        });
      },

      adjustStock: (productId, deltaQty, reason) => {
        const state = get();
        const prod = state.products.find((p) => p.id === productId);
        if (!prod) return;

        const now = new Date().toISOString();
        const updatedProducts = state.products.map((p) =>
          p.id === productId
            ? {
                ...p,
                warehouseStock: Math.max(0, p.warehouseStock + deltaQty),
              }
            : p
        );

        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "owner",
          userName: "Amit Agarwal",
          action: "Stock Adjusted",
          details: `${prod.name}: ${deltaQty >= 0 ? `+${deltaQty}` : deltaQty} units (${reason}).`,
          entityId: productId,
        };

        set({
          products: updatedProducts,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "info",
          title: "Stock Adjusted",
          message: `${prod.name} updated by ${deltaQty >= 0 ? `+${deltaQty}` : deltaQty} units.`,
        });
      },

      addNewRetailer: (retailerData) => {
        const state = get();
        const newRetailer: Retailer = {
          id: `ret-${Date.now()}`,
          ...retailerData,
          visitSequence: state.retailers.length + 1,
        };

        // Update target
        const updatedTargets = state.targets.map((t) =>
          t.metricName === "New Retailer Onboarding" && t.role === "salesperson"
            ? { ...t, currentValue: t.currentValue + 1 }
            : t
        );

        const now = new Date().toISOString();
        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: now,
          role: "salesperson",
          userName: "Rakesh Kumar",
          action: "Retailer Onboarded",
          details: `Registered ${retailerData.name} on beat ${retailerData.beatCode}.`,
          entityId: newRetailer.id,
        };

        set({
          retailers: [...state.retailers, newRetailer],
          targets: updatedTargets,
          activityLog: [newActivity, ...state.activityLog],
        });

        get().addToast({
          type: "success",
          title: "Retailer Added",
          message: `${retailerData.name} has been enrolled into Beat ${retailerData.beatCode}.`,
        });
      },

      addNewTarget: (targetData) => {
        const state = get();
        const newTarget: Target = {
          id: `tar-${Date.now()}`,
          ...targetData,
          currentValue: 0,
          estimatedIncentive: 0,
          approvedIncentive: 0,
        };

        set({
          targets: [...state.targets, newTarget],
        });

        get().addToast({
          type: "success",
          title: "Target Created",
          message: `Assigned new target ${targetData.metricName} to ${targetData.employeeName}.`,
        });
      },
    }),
    {
      name: "routeflow_storage",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<RouteFlowState> | undefined;
        // Safe migration if version mismatch
        if (version < 2 || !state || state.seedVersion !== SEED_DATA_VERSION) {
          return {
            currentRole: null,
            activeTab: "dashboard",
            isDemoGuideOpen: false,
            demoGuideStep: 1,
            seedVersion: SEED_DATA_VERSION,
            products: INITIAL_PRODUCTS,
            retailers: INITIAL_RETAILERS,
            orders: INITIAL_ORDERS,
            deliveries: INITIAL_DELIVERIES,
            payments: INITIAL_PAYMENTS,
            employees: INITIAL_EMPLOYEES,
            targets: INITIAL_TARGETS,
            activeVisit: INITIAL_ACTIVE_VISIT,
            activityLog: INITIAL_ACTIVITY,
            toasts: [],
          };
        }
        return state as RouteFlowState;
      },
    }
  )
);
