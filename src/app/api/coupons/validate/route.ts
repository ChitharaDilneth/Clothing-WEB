import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, discount: 0, message: "Coupon code required" }, { status: 400 });
    }
    const result = await validateCoupon(code, subtotal || 0);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Coupon validate error:", err);
    return NextResponse.json({ valid: false, discount: 0, message: "Validation error" }, { status: 500 });
  }
}
