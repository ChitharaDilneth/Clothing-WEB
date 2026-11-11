import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug, updateProduct, deleteProduct } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const product = await getProductBySlug(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error("Product GET error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "superadmin" && user.role !== "admin" && user.role !== "product_manager")) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const updated = await updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Product PUT error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "superadmin" && user.role !== "admin")) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await context.params;
    const deleted = await deleteProduct(id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error("Product DELETE error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
