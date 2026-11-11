import { NextRequest, NextResponse } from "next/server";
import { deleteCategory, updateCategory } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "superadmin" && user.role !== "admin")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const updated = await updateCategory(id, body);
    if (!updated) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Category PUT error:", err);
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
      return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
    }

    const { id } = await context.params;
    const deleted = await deleteCategory(id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error("Category DELETE error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
