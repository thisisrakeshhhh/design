import test from "node:test";
import assert from "node:assert/strict";

// Mock localStorage for Zustand persist in Node.js test environment
if (!globalThis.localStorage) {
  const mockStorage = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      mockStorage.set(key, String(value));
    },
    removeItem: (key: string) => {
      mockStorage.delete(key);
    },
    clear: () => {
      mockStorage.clear();
    },
    key: (index: number) => Array.from(mockStorage.keys())[index] ?? null,
    length: 0,
  } as Storage;
  (globalThis as unknown as { window: unknown }).window = { localStorage: globalThis.localStorage };
}

// Import store after localStorage polyfill
import { useRouteFlowStore } from "../store/useRouteFlowStore";

test("Inventory Reservation Lifecycle", async (t) => {
  // Reset store to clean baseline before tests
  useRouteFlowStore.getState().resetDemoData();

  await t.test("1. Submitted orders reserve zero inventory", () => {
    const store = useRouteFlowStore.getState();
    const initialTea = store.products.find((p) => p.sku === "TEA-250")!;
    const initialReserved = initialTea.reservedStock;

    // Book an order with 20 packets of tea (which also triggers Buy 10 Get 1 Free -> 2 free packets = 22 total)
    const orderId = store.submitOrder({
      retailerId: "ret-1",
      paymentType: "Credit",
      items: [{ productId: initialTea.id, quantity: 20 }],
    });

    assert.ok(orderId, "Order ID should be returned");

    const updatedTea = useRouteFlowStore
      .getState()
      .products.find((p) => p.sku === "TEA-250")!;

    // Mandatory fix: Submitted orders must reserve ZERO inventory
    assert.strictEqual(
      updatedTea.reservedStock,
      initialReserved,
      "Reserved stock must remain unchanged when order is only Submitted"
    );
  });

  await t.test("2. Approving an order reserves its approved quantities exactly once", () => {
    const store = useRouteFlowStore.getState();
    const tea = store.products.find((p) => p.sku === "TEA-250")!;
    const reservedBefore = tea.reservedStock;

    // Submit a new order: 10 tea (10 + 1 free = 11 total units)
    const orderId = store.submitOrder({
      retailerId: "ret-2",
      paymentType: "Cash",
      items: [{ productId: tea.id, quantity: 10 }],
    });

    // Verify still 0 reserved after submission
    assert.strictEqual(
      useRouteFlowStore.getState().products.find((p) => p.sku === "TEA-250")!.reservedStock,
      reservedBefore
    );

    // Approve the order
    useRouteFlowStore.getState().approveOrder(orderId);

    const reservedAfterApproval = useRouteFlowStore
      .getState()
      .products.find((p) => p.sku === "TEA-250")!.reservedStock;

    // 10 ordered + 1 free promo = 11 units reserved
    assert.strictEqual(
      reservedAfterApproval,
      reservedBefore + 11,
      "Approved order must reserve its approved quantities (including promo free units)"
    );
  });

  await t.test("3. Refreshing or repeating approval must NOT duplicate reservations (Idempotent)", () => {
    const store = useRouteFlowStore.getState();
    const tea = store.products.find((p) => p.sku === "TEA-250")!;

    // Submit and approve order
    const orderId = store.submitOrder({
      retailerId: "ret-2",
      paymentType: "Cash",
      items: [{ productId: tea.id, quantity: 10 }],
    });
    store.approveOrder(orderId);

    const reservedFirstPass = useRouteFlowStore
      .getState()
      .products.find((p) => p.sku === "TEA-250")!.reservedStock;

    // Attempt to approve the same order a 2nd and 3rd time (simulating repeated clicks / rerenders)
    useRouteFlowStore.getState().approveOrder(orderId);
    useRouteFlowStore.getState().approveOrder(orderId);

    const reservedSecondPass = useRouteFlowStore
      .getState()
      .products.find((p) => p.sku === "TEA-250")!.reservedStock;

    assert.strictEqual(
      reservedSecondPass,
      reservedFirstPass,
      "Repeating approval action must not duplicate reservations"
    );
  });

  await t.test("4. Rejected and cancelled orders release reservations", () => {
    const store = useRouteFlowStore.getState();
    const tea = store.products.find((p) => p.sku === "TEA-250")!;
    const initialReserved = tea.reservedStock;

    // Case A: Reject an approved order -> releases reservations
    const orderA = store.submitOrder({
      retailerId: "ret-1",
      paymentType: "Credit",
      items: [{ productId: tea.id, quantity: 10 }],
    });
    store.approveOrder(orderA);

    assert.strictEqual(
      useRouteFlowStore.getState().products.find((p) => p.sku === "TEA-250")!.reservedStock,
      initialReserved + 11
    );

    // Reject order A
    useRouteFlowStore.getState().rejectOrder(orderA, "Credit limit exceeded");

    assert.strictEqual(
      useRouteFlowStore.getState().products.find((p) => p.sku === "TEA-250")!.reservedStock,
      initialReserved,
      "Rejecting an approved order must release its reserved stock"
    );

    // Case B: Cancel an approved order -> releases reservations
    const orderB = store.submitOrder({
      retailerId: "ret-1",
      paymentType: "Credit",
      items: [{ productId: tea.id, quantity: 10 }],
    });
    store.approveOrder(orderB);
    store.cancelOrder(orderB, "Customer changed mind");

    assert.strictEqual(
      useRouteFlowStore.getState().products.find((p) => p.sku === "TEA-250")!.reservedStock,
      initialReserved,
      "Cancelling an approved order must release its reserved stock"
    );

    // Case C: Rejecting an unapproved submitted order must NOT decrement stock below zero
    const orderC = store.submitOrder({
      retailerId: "ret-1",
      paymentType: "Credit",
      items: [{ productId: tea.id, quantity: 10 }],
    });
    store.rejectOrder(orderC, "Duplicate order");

    assert.strictEqual(
      useRouteFlowStore.getState().products.find((p) => p.sku === "TEA-250")!.reservedStock,
      initialReserved,
      "Rejecting a submitted order that never held a reservation must not decrement reserved stock"
    );
  });

  await t.test("5. Delivery reduces on-hand stock and releases the corresponding reservation", () => {
    const store = useRouteFlowStore.getState();
    const biscuit = store.products.find((p) => p.sku === "BIS-BOX-24")!;
    const initialWarehouseStock = biscuit.warehouseStock;
    const initialReservedStock = biscuit.reservedStock;

    // Submit order for 5 boxes of biscuits
    const orderId = store.submitOrder({
      retailerId: "ret-2",
      paymentType: "Cash",
      items: [{ productId: biscuit.id, quantity: 5 }],
    });

    // Approve order (reserves 5 boxes)
    store.approveOrder(orderId);

    const postApprovalBiscuit = useRouteFlowStore
      .getState()
      .products.find((p) => p.sku === "BIS-BOX-24")!;
    assert.strictEqual(postApprovalBiscuit.reservedStock, initialReservedStock + 5);
    assert.strictEqual(postApprovalBiscuit.warehouseStock, initialWarehouseStock);

    // Dispatch order
    store.dispatchOrder(orderId, "Suresh Yadav");

    const delivery = useRouteFlowStore
      .getState()
      .deliveries.find((d) => d.orderId === orderId)!;
    assert.ok(delivery, "Delivery record must exist");

    // Complete delivery
    useRouteFlowStore.getState().completeDelivery({
      deliveryId: delivery.id,
      proofType: "OTP",
      otpUsed: "4829",
      paymentMode: "Cash",
      collectedAmount: 5 * biscuit.retailerPrice,
    });

    const postDeliveryBiscuit = useRouteFlowStore
      .getState()
      .products.find((p) => p.sku === "BIS-BOX-24")!;

    // Mandatory fix: warehouseStock reduced by 5, reservedStock released by 5
    assert.strictEqual(
      postDeliveryBiscuit.warehouseStock,
      initialWarehouseStock - 5,
      "On-hand warehouse stock must be reduced upon delivery"
    );
    assert.strictEqual(
      postDeliveryBiscuit.reservedStock,
      initialReservedStock,
      "Reserved stock must be released upon delivery"
    );

    // Guard: Repeated delivery calls must not deduct stock again
    useRouteFlowStore.getState().completeDelivery({
      deliveryId: delivery.id,
      proofType: "OTP",
      otpUsed: "4829",
      paymentMode: "Cash",
      collectedAmount: 5 * biscuit.retailerPrice,
    });

    const repeatedDeliveryBiscuit = useRouteFlowStore
      .getState()
      .products.find((p) => p.sku === "BIS-BOX-24")!;

    assert.strictEqual(
      repeatedDeliveryBiscuit.warehouseStock,
      initialWarehouseStock - 5,
      "Repeated delivery invocation must be idempotent and not reduce stock further"
    );
  });
});
