import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "superadmin" && user.role !== "admin" && user.role !== "product_manager" && user.role !== "order_manager")) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ message: "Failed to fetch dashboard statistics" }, { status: 500 });
  }
}
