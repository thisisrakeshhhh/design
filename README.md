# RouteFlow — Warehouse-to-Retailer Wholesale Distribution System

**RouteFlow** is a polished, interactive B2B client-demonstration web application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand with localStorage persistence**.

It is custom-tailored for an Indian wholesale distributor operating in **Jaipur, Rajasthan** (*Jaipur Wholesale Distributors*), managing the complete end-to-end business lifecycle:

> **Owner configures business**  
> → **Salesperson visits retailer on Mansarovar West beat (BEAT-04)**  
> → **Salesperson audits shop stock & books wholesale order with promotional schemes**  
> → **Owner reviews credit limit & approves order**  
> → **Warehouse manager picks items, packs cartons & assigns delivery executive**  
> → **Delivery executive transports consignment, navigates via Google Maps & collects OTP delivery proof**  
> → **Payment collection updates live retailer balance, targets, and business ledger**

---

## Key Features & Highlights

- **4 Specialized Role Perspectives**:
  1. **Owner (`Amit Agarwal`)**: Executive control, live sales dashboard, credit approval, stock value, beat route overview, quotas, and business analytics.
  2. **Salesperson (`Rakesh Kumar`)**: Mobile-first field sales app, sequenced Mansarovar West beat visits, shop stock audits, wholesale order booking with auto *Buy 10 get 1 free* promo on Premium Tea, and on-field payment collection with digital receipts.
  3. **Warehouse (`Manoj Sharma`)**: Orders to Pick, Orders to Pack, carton packing, damage return inspection, and staging for delivery.
  4. **Delivery (`Suresh Yadav`)**: Today's deliveries, turn-by-turn navigation link, customer OTP delivery proof (sample `4829`), failure reasons handling, and cashier cash settlement.
- **Zero Dead Buttons**: Every single tab, button, modal, and filter performs a live action or opens a responsive sheet.
- **Cross-Role Live Synchronization**: State changes persist across roles via typed Zustand store backed by browser `localStorage`.
- **Instant Role Switcher**: Presenters can jump between roles at any time from the top header without logging out.
- **Interactive 8-Step Demo Guide**: Built-in drawer with step-by-step presentation cheat-sheet.
- **Factory Reset Function**: Restore all mock data back to the clean seed state in one click.
- **Phone & Touch-First Design**: Minimum 44px touch targets, sticky bottom navigation for mobile viewports, card-based responsive layouts, and zero horizontal scroll.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 (Mobile-first responsive design, B2B color palette)
- **State Management**: Zustand with `persist` middleware (`localStorage`)
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (7-day sales trend & FMCG category volume)
- **Formatting**: Native Indian Currency (`Intl.NumberFormat` with INR ₹ symbol & Lakh/k formatting)

---

## Getting Started Locally

### Prerequisites

- Node.js 20+ (Node.js 22 LTS recommended)
- npm 10+

### Setup Commands

```bash
# Navigate to the routeflow project directory
cd d:\grow\engine\free\routeflow

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Verification & Production Build Commands

```bash
# Run linting, TypeScript type-checking, and Next.js production build together
npm run check

# Or run individual verification steps:
npm run lint         # Runs ESLint
npm run typecheck    # Runs tsc --noEmit
npm run build        # Compiles production-ready static & SSR assets
npm run start        # Serves the production build locally
```

---

## Vercel Deployment Instructions

RouteFlow is designed to run completely serverless on **Vercel** with zero external database configuration:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the repository and set the **Root Directory** to `routeflow` (or `./` if deployed directly).
4. Build settings will automatically detect Next.js:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
5. Click **"Deploy"**. The application will build cleanly and deploy on your live Vercel URL.

---

## 8-Step Client Presentation Flow

Use the built-in **Demo Guide** (top header button) to guide your presentation:

1. **Enter as Salesperson (`Rakesh Kumar`)**:
   - Review the *Mansarovar West* beat metrics (5 shops on route, order value, collection status).
   - Click **"Today's Beat"** to inspect the sequenced list of retailers.
2. **Visit Sharma General Store**:
   - Stop #1 on the beat. Open the store card and click **"Start Visit"**.
   - Review shop location verification, pending amount (₹3,250), and credit limit (₹20,000).
3. **Audit Shelf Stock & Book Wholesale Order**:
   - Audit shelf inventory (*Shop Stock* vs *Order Quantity*).
   - Book 10 packets of *Premium Tea 250g* to watch the **"Buy 10, get 1 free"** promotion apply automatically.
   - Select payment terms (Credit) and click **"Submit Order"**.
4. **Switch to Owner (`Amit Agarwal`) & Approve Order**:
   - Use the **Demo Role Switcher** in the header to switch to Owner.
   - Notice the top notification bell and the order appearing under **"Submitted"** in Orders.
   - Click **"Approve"** to authorize credit and queue for warehouse fulfillment.
5. **Switch to Warehouse Manager (`Manoj Sharma`) & Pack Cartons**:
   - Switch to Warehouse perspective. The approved order is in **"Pending Orders"**.
   - Click **"Start Picking"**, confirm picked quantities against warehouse stock bins, specify carton count (2 cartons), and click **"Mark as Packed"**.
6. **Assign Delivery Executive & Stage for Dispatch**:
   - Assign **Suresh Yadav** and click **"Mark Ready for Dispatch"**.
7. **Switch to Delivery Executive (`Suresh Yadav`) & Deliver with OTP**:
   - Open **"Deliveries"** to view the trip manifest.
   - Click **"Confirm Loaded & Mark Out for Delivery"**.
   - Test the Google Maps directions link.
   - Select proof type **"OTP"**, enter sample OTP **`4829`**, and click **"Mark Order Delivered"**.
8. **Switch to Owner (`Amit Agarwal`) to Review Updated Business Impact**:
   - Return to Owner Dashboard:
     - Delivered sales metric increased.
     - Warehouse inventory levels decreased.
     - Sharma General Store outstanding ledger updated.
     - Salesperson and delivery quotas updated with calculated commission.

---

## Mock Business Data Architecture

All realistic Jaipur wholesale data is stored in [`src/lib/seed-data.ts`](src/lib/seed-data.ts):

- **Wholesale Company**: *Jaipur Wholesale Distributors*, Jaipur, Rajasthan
- **Warehouse**: *Jaipur Main Warehouse* (Bay A & B)
- **Beat**: *Mansarovar West* (`BEAT-04`)
- **6 Retailers**:
  1. `Sharma General Store` (Sector 9, Mansarovar • Pending ₹3,250 • Credit ₹20,000)
  2. `Gupta Provision Store` (Madhyam Marg, Mansarovar • Pending ₹0 • Credit ₹15,000)
  3. `Balaji Kirana Store` (New Sanganer Road • Overdue ₹7,800 • Credit ₹25,000)
  4. `Pink City Super Mart` (Shipra Path, Mansarovar • Pending ₹12,400)
  5. `Rajasthan General Store` (Patel Marg, Mansarovar • Pending ₹1,800)
  6. `Mahadev Departmental Store` (VT Road, Mansarovar • Pending ₹5,600)
- **10 Core FMCG Products**:
  1. `Premium Tea 250g` (TEA-250 • MRP ₹140 • Wholesale ₹118 • *Buy 10 get 1 free* promo)
  2. `Glucose Biscuit Box` (BIS-BOX-24 • MRP ₹240 • Wholesale ₹205)
  3. `Mustard Oil 1L` (OIL-1L • MRP ₹175 • Wholesale ₹158 • Low stock alert)
  4. `Washing Powder 500g` (DET-500 • MRP ₹65 • Wholesale ₹54)
  5. `Bath Soap 100g 4-Pack` (SOAP-4P • MRP ₹120 • Wholesale ₹98)
  6. `Salt 1kg` (SALT-1K • MRP ₹28 • Wholesale ₹22)
  7. `Turmeric Powder 200g` (SPICE-TUR-200 • MRP ₹62 • Wholesale ₹49)
  8. `Toothpaste 150g` (DENT-150 • MRP ₹95 • Wholesale ₹79)
  9. `Instant Noodles 12-Pack` (NOOD-12P • MRP ₹168 • Wholesale ₹138)
  10. `Dishwash Bar 3-Pack` (DISH-3P • MRP ₹45 • Wholesale ₹36)

---

## How to Reset Demo Data

At any point during the demonstration:
1. Click the **Demo Role Switcher** in the top header.
2. Click **"Reset Data"** (or use the reset option inside the **Demo Guide** drawer).
3. Confirm in the dialog. All changes made in browser `localStorage` will be cleared and re-seeded to the initial state.

---

## Implemented Screens Across Roles

| Perspective | Screens / Tabs Implemented |
| :--- | :--- |
| **Authentication** | Demo Role Login screen with 4 large role cards |
| **Owner** | Dashboard (KPIs, 7-day sales chart, activity), Orders (Approve/Reject with reasons), Inventory (Stock adjustment), Retailers (Ledger & credit limits), Employees (Attendance & quotas), Routes & Beats (Beat-04 sequence), Targets & Incentives (Commission calculator & target creator), Reports (Category sales & exports) |
| **Salesperson** | Home (Greeting & quick actions), Today's Beat (Sequenced stops, call & maps), Active Shop Visit (Shelf audit vs order qty), Order Booking (Catalog, Tea promo, stock limits), Payment Collection (Cash/UPI/Cheque & digital receipt), Targets |
| **Warehouse** | Dashboard (Fulfillment queues), Pending Orders (Approved/Picking/Packed list), Order Pick & Pack (Interactive picking confirmation, carton count, Suresh Yadav dispatch), Warehouse Stock (Bins & aisles), Returns Inspection (Transit defect quarantine), Daily Summary |
| **Delivery** | Dashboard (Cargo metrics), Deliveries (Sequenced manifest), Delivery Execution (Van loading confirmation, Google Maps link, full/partial cargo, OTP verification `4829`, failure reasons), Collections (Cashier handover), Daily Summary |

---

## Test & Build Results

- **ESLint**: 0 errors
- **TypeScript Typecheck (`tsc --noEmit`)**: 0 errors
- **Next.js Production Build (`next build`)**: Succeeded in 3.2s with Turbopack, prerendering all static pages without hydration warnings.

---

## Known Limitations

- This is an interactive frontend client demonstration: external bank payment gateways, real SMS OTP gateways, and backend database servers are intentionally omitted in favor of self-contained browser `localStorage` state.
