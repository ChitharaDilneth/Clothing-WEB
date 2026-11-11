import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const subcategory = searchParams.get("subcategory") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;
    const includeInactive = searchParams.get("includeInactive") === "true";

    const data = await getProducts({
      category,
      subcategory,
      brand,
      search,
      sort,
      minPrice,
      maxPrice,
      page,
      limit,
      includeInactive,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "superadmin" && user.role !== "admin" && user.role !== "product_manager")) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ message: "Product name and price are required" }, { status: 400 });
    }

    const created = await createProduct(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Products POST error:", err);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
