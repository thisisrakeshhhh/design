export type Role = "owner" | "salesperson" | "warehouse" | "delivery";

export type OrderStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Picking"
  | "Packed"
  | "Ready for Dispatch"
  | "Out for Delivery"
  | "Partially Delivered"
  | "Delivered"
  | "Rejected"
  | "Cancelled"
  | "Returned";

export type DeliveryProofType = "OTP" | "Signature" | "Photograph";

export type PaymentMethod = "Cash" | "UPI" | "Bank Transfer" | "Cheque";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  mrp: number;
  retailerPrice: number;
  warehouseStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  scheme?: string; // e.g., "Buy 10, get 1 free"
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  freeQuantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  retailerId: string;
  retailerName: string;
  salespersonId: string;
  salespersonName: string;
  beatCode: string;
  beatName: string;
  items: OrderItem[];
  totalAmount: number;
  paymentType: "Credit" | "Cash" | "UPI" | "Cheque";
  status: OrderStatus;
  statusTimeline: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  packageCount?: number;
  packingNotes?: string;
  assignedDeliveryExecutive?: string;
  pickedItems?: { productId: string; requestedQty: number; pickedQty: number }[];
}

export interface Retailer {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  address: string;
  area: string;
  beatCode: string;
  pendingAmount: number;
  overdueAmount: number;
  creditLimit: number;
  lastOrderDate?: string;
  accountStatus: "Active" | "Under Review" | "Credit Blocked";
  visitStatus: "Pending" | "Visited" | "Skipped";
  visitSequence: number;
  locationCoords?: { lat: number; lng: number };
}

export interface StockAuditItem {
  productId: string;
  productName: string;
  packSize: string;
  shopStock: number;
  suggestedQty: number;
  orderQty: number;
}

export interface ShopVisit {
  id: string;
  retailerId: string;
  retailerName: string;
  salespersonId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  isLocationVerified: boolean;
  stockAudits: StockAuditItem[];
  notes?: string;
  completed: boolean;
}

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  retailerId: string;
  retailerName: string;
  address: string;
  area: string;
  phone: string;
  packageCount: number;
  amountToCollect: number;
  paymentType: "Credit" | "Cash" | "UPI";
  status: "Assigned" | "Out for Delivery" | "Delivered" | "Failed";
  assignedTo: string;
  deliveredAt?: string;
  proofType?: DeliveryProofType;
  otpUsed?: string;
  isPartialDelivery?: boolean;
  deliveryNotes?: string;
  failureReason?: string;
  sequenceNumber: number;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  retailerId: string;
  retailerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  collectedBy: string;
  collectedAt: string;
  orderId?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: Role;
  title: string;
  phone: string;
  assignedRoute: string;
  attendanceStatus: "Present" | "On Field" | "Warehouse" | "On Leave";
  targetProgress: number; // percentage e.g. 78%
  estimatedIncentive: number;
  approvedIncentive: number;
  isActive: boolean;
}

export interface Target {
  id: string;
  employeeId: string;
  employeeName: string;
  role: Role;
  metricName: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  month: string;
  incentiveRate: string;
  estimatedIncentive: number;
  approvedIncentive: number;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  role: Role;
  userName: string;
  action: string;
  details: string;
  entityId?: string;
}

export interface ToastNotification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp: string;
}
