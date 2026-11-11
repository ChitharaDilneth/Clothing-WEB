import { NextRequest, NextResponse } from "next/server";
import { getCustomOrders, createCustomOrder } from "@/lib/store";

export async function GET() {
  try {
    const orders = await getCustomOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Custom orders GET error:", err);
    return NextResponse.json({ message: "Failed to fetch custom orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.customerPhone) {
      return NextResponse.json({ message: "Customer details are required" }, { status: 400 });
    }
    const order = await createCustomOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Custom orders POST error:", err);
    return NextResponse.json({ message: "Failed to submit custom order" }, { status: 500 });
  }
}
