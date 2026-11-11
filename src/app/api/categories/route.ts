import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error("Categories GET error:", err);
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
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
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }

    const category = await createCategory(body);
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("Categories POST error:", err);
    return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
  }
}
