import { NextRequest, NextResponse } from "next/server";
import { getCoupons, createCoupon } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const coupons = await getCoupons();
    return NextResponse.json(coupons);
  } catch (err) {
    console.error("Coupons GET error:", err);
    return NextResponse.json({ message: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "superadmin" && user.role !== "admin")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json({ message: "Coupon code and discount value required" }, { status: 400 });
    }

    const created = await createCoupon(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Coupon POST error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
