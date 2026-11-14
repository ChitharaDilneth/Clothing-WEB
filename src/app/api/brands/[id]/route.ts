import { NextRequest, NextResponse } from "next/server";
import { deleteBrand, updateBrand, getBrands } from "@/lib/store";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const brands = await getBrands();
    const brand = brands.find(
      (b) =>
        b._id === id ||
        b.slug.toLowerCase() === id.toLowerCase() ||
        b.name.toLowerCase() === id.toLowerCase()
    );
    if (!brand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }
    return NextResponse.json(brand);
  } catch (err) {
    console.error("Brand GET error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { id } = await context.params;
    const brands = await getBrands();
    const existing = brands.find(
      (b) =>
        b._id === id ||
        b.slug.toLowerCase() === id.toLowerCase() ||
        b.name.toLowerCase() === id.toLowerCase()
    );

    if (!existing) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Role check: Superadmin has full access, Brand Manager only has access to their own brand
    const isSuperAdmin = user.role === "superadmin" || user.role === "admin";
    const isOwner =
      (user.role === "brand_manager" || user.role === "vendor") &&
      user.brandSlug?.toLowerCase() === existing.slug.toLowerCase();

    if (!isSuperAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden. You can only customize your own brand store." }, { status: 403 });
    }

    const body = await req.json();

    // Brand manager cannot change slug or core status
    if (!isSuperAdmin) {
      delete body.slug;
      delete body.isActive;
      delete body.sortOrder;
      delete body.managerUsername;
      delete body.managerPassword;
    }

    const updated = await updateBrand(existing._id || existing.slug, body);

    // If superadmin updated credentials, update the User account
    if (isSuperAdmin && body.managerUsername && body.managerPassword) {
      await connectDB();
      const cleanUsername = body.managerUsername.trim().toLowerCase();
      const email = body.email || `${cleanUsername}@thebrandhub.lk`;

      await UserModel.findOneAndUpdate(
        { $or: [{ username: cleanUsername }, { email }] },
        {
          name: `${existing.name} Official Manager`,
          username: cleanUsername,
          email,
          passwordHash: hashPassword(body.managerPassword),
          role: "brand_manager",
          brandSlug: existing.slug.toLowerCase(),
          phone: body.phone || "+94 76 347 3075",
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Brand PUT error:", err);
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
      return NextResponse.json({ message: "Unauthorized. Superadmin access required." }, { status: 403 });
    }

    const { id } = await context.params;
    const deleted = await deleteBrand(id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error("Brand DELETE error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
