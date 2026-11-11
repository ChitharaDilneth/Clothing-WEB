import { NextRequest, NextResponse } from "next/server";
import { getBrands, createBrand } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json(brands);
  } catch (err) {
    console.error("Brands GET error:", err);
    return NextResponse.json({ message: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "superadmin" && user.role !== "admin")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ message: "Brand name is required" }, { status: 400 });
    }

    const brand = await createBrand(body);
    return NextResponse.json(brand, { status: 201 });
  } catch (err) {
    console.error("Brands POST error:", err);
    return NextResponse.json({ message: "Failed to create brand" }, { status: 500 });
  }
}
