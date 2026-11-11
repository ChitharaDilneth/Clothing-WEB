import { describe, it, expect } from "vitest";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  validateCoupon,
  createOrder,
  updateOrderStatus,
} from "../src/lib/store";
import { hashPassword, comparePassword, signToken, verifyToken } from "../src/lib/auth";

describe("TBH E-Commerce Business Logic & Store Tests", () => {
  it("should retrieve seeded products with accurate count and fields", async () => {
    const { products, total } = await getProducts();
    expect(total).toBeGreaterThan(0);
    expect(products.length).toBeGreaterThan(0);

    const wavesPoncho = products.find((p) => p.slug === "waves-poncho-ash-flower");
    expect(wavesPoncho).toBeDefined();
    expect(wavesPoncho?.price).toBe(2950);
    expect(wavesPoncho?.brand).toBe("WAVES");
    expect(wavesPoncho?.sku).toBe("H070002051");
  });

  it("should filter products by category correctly", async () => {
    const { products } = await getProducts({ category: "women" });
    expect(products.length).toBeGreaterThan(0);
    for (const p of products) {
      const match =
        p.category.toLowerCase() === "women" ||
        p.subcategory?.toLowerCase() === "women" ||
        p.tags?.some((t) => t.toLowerCase() === "women");
      expect(match).toBe(true);
    }
  });

  it("should calculate correct coupon discount for valid coupon", async () => {
    const res = await validateCoupon("TBH15", 6000);
    expect(res.valid).toBe(true);
    expect(res.discount).toBe(900); // 15% of 6000
  });

  it("should reject coupon when order subtotal is below minimum threshold", async () => {
    const res = await validateCoupon("TBH15", 2000); // Min order is 5000
    expect(res.valid).toBe(false);
  });

  it("should create and update a new product cleanly", async () => {
    const newProd = await createProduct({
      name: "Test Ansel Loafer NB9999",
      sku: "TEST-NB9999",
      price: 3500,
      stock: 5,
      brand: "ANSEL",
      category: "Women",
      description: "Test description",
    });

    expect(newProd.sku).toBe("TEST-NB9999");
    expect(newProd.price).toBe(3500);

    const updated = await updateProduct(newProd._id || newProd.slug, {
      price: 3800,
      stock: 8,
    });

    expect(updated?.price).toBe(3800);
    expect(updated?.stock).toBe(8);

    const deleted = await deleteProduct(newProd._id || newProd.slug);
    expect(deleted).toBe(true);
  });

  it("should create an order with unique reference and calculate total", async () => {
    const order = await createOrder({
      customer: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "+94770001122",
      },
      shippingAddress: {
        street: "123 Galle Road",
        city: "Colombo 03",
        district: "Colombo",
      },
      items: [
        {
          productId: "prod_1",
          name: "Waves Poncho Ash – Flower",
          sku: "H070002051",
          price: 2950,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
        },
      ],
      subtotal: 2950,
      shippingFee: 450,
      total: 3400,
      paymentMethod: "cod",
    });

    expect(order.orderNumber).toMatch(/^TBH-\d+/);
    expect(order.total).toBe(3400);

    const updatedOrder = await updateOrderStatus(order.orderNumber, "shipped", "PRONET-123456");
    expect(updatedOrder?.orderStatus).toBe("shipped");
    expect(updatedOrder?.trackingNumber).toBe("PRONET-123456");
  });

  it("should hash passwords securely and verify JWT tokens", () => {
    const password = "mySecretPassword123";
    const hashed = hashPassword(password);
    expect(hashed).not.toBe(password);
    expect(comparePassword(password, hashed)).toBe(true);
    expect(comparePassword("wrongPassword", hashed)).toBe(false);

    const token = signToken({
      userId: "u123",
      email: "user@thebrandhub.lk",
      name: "Test User",
      role: "customer",
    });

    const verified = verifyToken(token);
    expect(verified?.email).toBe("user@thebrandhub.lk");
    expect(verified?.role).toBe("customer");
  });
});
