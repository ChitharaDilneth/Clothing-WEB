import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/store";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ message: "Cart cannot be empty" }, { status: 400 });
    }

    if (!body.customer?.name || !body.customer?.phone || !body.shippingAddress?.street) {
      return NextResponse.json({ message: "Customer and shipping details are required" }, { status: 400 });
    }

    const order = await createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Orders POST error:", err);
    return NextResponse.json({ message: "Failed to place order" }, { status: 500 });
  }
}
