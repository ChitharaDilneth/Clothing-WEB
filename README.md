# TBH — THE BRAND HUB
## Complete Full-Stack E-commerce Website with Admin Dashboard & AI Fitting Studio

A production-grade Sri Lankan fashion and lifestyle e-commerce application inspired by **TBH — The Brand Hub**, built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas (Mongoose)**, **Cloudinary**, and **JWT Authentication**.

---

## 📸 Visual Identity & Design Alignment

The storefront reproduces the minimal black-and-white visual identity:
1. **Global Header & Navigation**:
   - Announcement Bar: *"Free Shipping For Orders Above Rs. 8500/="* with quick shipping & join links.
   - Main Header: TBH brand identity, large product search bar with black search button, telephone concierge `+ (94) 76 347 3075`, user account, wishlist with real-time counter, and cart badge.
   - Category Navigation: Black bar featuring `WOMEN`, `MEN`, `KIDS`, `UNISEX`, `HEALTH`, `CLOTHING`, `BAGS`, `SHOP BY BRANDS`, and an eye-catching highlighted link for `MAKE YOUR OWN WAVES`.
2. **Homepage**:
   - **Hero Banner**: *"HIKKADUWA — AUTHENTIC COASTAL FOOTWEAR"* with floating product preview cards and `SHOP NOW ->` button.
   - **New & Now**: 4 category tiles (*Footwear*, *Clothing*, *Accessory*, *Bestseller*).
   - **Make Your Own Waves Section**: Studio workshop promotional feature linking directly to the Custom Product Designer.
   - **Sort & Shop**: 4 large tiles (*Women*, *Men*, *Kids*, *Unisex*).
   - **Shop by Brands**: 9 official brand logos (*BREAKWATER*, *WAVES*, *ANSEL*, *PARAKEET*, *SIL*, *SOULS*, *TIA*, *KNOCKDOWN*, *AURA*).
   - **15% Off Promotional Banner**: Dark promotional card with discount code `TBH15`.
   - **Must Have Product Grid**: Ansel loafers, Waves flip-flops, bags, and health accessories.
   - **Newsletter & Footer**: Black card with email subscription, TBH logo, Colombo 02 physical address, and floating WhatsApp contact button.
3. **Category / Shopping Listing Page**:
   - Category title (e.g., `WOMEN` or `BAGS`).
   - 3 Category hero banner cards (`FORMAL FOOTWEAR`, Beach sandals `SHOP NOW`, `CLOTHING`).
   - Collapsible filter controls (Brand, Category, Price slider, Availability) and dynamic product counter.
   - 4-column responsive grid with consistent card aspect ratios, wishlist button, selling price in LKR, 3x Koko and Mintpay installment breakdown, color swatches, and `SELECT OPTIONS` / quick-add buttons.
4. **Product Details Page (`/product/waves-poncho-ash-flower`)**:
   - Breadcrumbs navigation: `HOME > WOMEN > WOMEN CLOTHING > WAVES PONCHO ASH - FLOWER`.
   - 2x2 multi-angle high-resolution gallery.
   - Waves script branding, green `● 1 in stock` pill badge, title, SKU: `H070002051`.
   - Price in LKR (`Rs 2,950.00`) with 3x KOKO (`Rs 983.33`) and Mintpay installments.
   - Payment provider badges (Visa, Mastercard, Discover, Amex).
   - Big black pill `Add to cart` button.
   - Description and Additional Information tabs.
   - Trust highlights card: *Island Wide Cash On Delivery*, *100% Secure Checkout*, *100% Genuine Brands*.
   - *VIEW SIMILAR PRODUCTS* carousel/grid.
5. **TBH NeuralFit™ AI Fitting Studio (`/virtual-try-on`)**:
   - Modeled after the NeuralFit™ Engine v2.4 interface.
   - Model selection (*Female Model 27°*, *Male Model*, *Curvy Custom*, *+ Upload Selfie*).
   - Interactive viewer with 360° rotate, zoom, anatomical drape points, and live material metrics (*Movement Stretch: 100% Breathable*, *Thermal Rating: Tropical Cool*, *Return Probability: < 8.4%*).
   - Fit measurements form: Height (cm/ft), Weight (kg), Bust/Chest (in), Shoe Size, and Body Shape Profile (*Hourglass*, *Petite*, *Athletic*, *Pear*).
   - TBH Fit Confidence gauge (96% High Match).
   - Direct `ADD RECOMMENDED FIT TO CART` and `ORDER VIA WHATSAPP CONCIERGE`.
   - 3-step *Intelligent Fitting Engine* explanation and *Sri Lanka Community* review stories.
6. **Custom Product Designer (`/customizer` / Make Your Own Waves)**:
   - Base product selection (*Waves Two-Colour Sandal*, *Waves Black Sandal*, *Waves Poncho*, *Waves Bag*).
   - Color and size selection.
   - Custom monogram text input with font family and color selectors.
   - Upload custom artwork/image with live positioning, scaling, and real-time pricing calculation.
   - Add customized item to cart or submit an artisan inquiry.
7. **Shopping Cart & Checkout**:
   - Slide-over Cart Drawer and full `/cart` page with line items, quantity adjustment, and coupon validation.
   - Free shipping progress meter (Free shipping for orders above Rs. 8500).
   - Checkout with full Sri Lanka district selector (Colombo, Gampaha, Kandy, Galle, etc.).
   - Payment methods: Cash On Delivery (COD), Card payment, Koko split, Mintpay.
   - Order confirmation and parcel tracking via `/order-success/[orderNumber]` and `/track-order`.
8. **Admin Dashboard (`/admin`)**:
   - Dedicated minimal black-and-white executive interface with custom sidebar and header.
   - Performance Overview: Gross Revenue, Total Orders, Active Catalog Items, Low-Stock Warnings, Recharts 7-day Sales Volume graph, and Recent Orders.
   - Complete CRUD operations:
     - `/admin/products`: Create, Read, Update, Delete with Cloudinary image upload, SKU, price, stock, variants, tags, and AI Try-On toggle.
     - `/admin/categories`: Category and Brand management.
     - `/admin/orders`: Order fulfillment status transitions (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled), courier waybill tracking assignment, and internal notes.
     - `/admin/inventory`: Current stock levels, low-stock alerts, and quick replenishment (+5, +10).
     - `/admin/coupons`: Create and manage discount codes (e.g. `TBH15`).
     - `/admin/custom-orders`: Review customer Waves customizations and artwork.
     - `/admin/settings`: Store phone, WhatsApp, address, announcement text, shipping thresholds, and payment gateway toggles.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Database** | MongoDB Atlas with Mongoose (with instant in-memory fallback store) |
| **Authentication** | JWT cookies with `bcryptjs` password hashing |
| **Image Hosting** | Cloudinary SDK with secure server-side upload handling |
| **Analytics Charts** | Recharts |
| **Notifications** | Sonner toast library |
| **Testing** | Vitest |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+ installed.
- npm installed.

### 1. Installation

```bash
git clone <repository-url>
cd "Clothing web"
npm install --legacy-peer-deps
```

### 2. Environment Variables

Create `.env.local` in the project root:

```env
MONGODB_URI=
AUTH_SECRET=tbh_super_secret_jwt_key_987654321_secure_dev
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
CLOUDINARY_UPLOAD_FOLDER=tbh_store
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo

# Payment & Business settings
PAYMENT_PROVIDER=cod
WHATSAPP_CONTACT_NUMBER=+94763473075
```

> **Note**: If `MONGODB_URI` is left blank, the application automatically uses the unified in-memory data store seeded with the full catalog (Waves poncho, Ansel shoes, Parakeet bags, banners, etc.). When a MongoDB Atlas URI is provided, it connects via Mongoose and persists all data directly to your MongoDB cluster.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Dashboard Credentials

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin) or [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
- **Admin Email**: `admin@thebrandhub.lk`
- **Admin Password**: `admin123456`
*(An "Auto-fill" demo button is also provided on the login page for convenience)*

---

## 🧪 Automated Testing

Execute the test suite using Vitest:

```bash
npm run test
```

This verifies:
- Product CRUD operations (create, read, update, delete).
- Category and brand queries.
- Coupon validation and minimum order thresholds.
- Order creation and status transitions (Pending -> Shipped).
- Password hashing with bcrypt and JWT token signing/verification.

---

## 🏗️ Production Build

```bash
npm run build
npm run start
```
