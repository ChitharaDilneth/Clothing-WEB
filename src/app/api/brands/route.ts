import { NextRequest, NextResponse } from "next/server";
import { getBrands, createBrand } from "@/lib/store";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";

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
      return NextResponse.json({ message: "Unauthorized. Superadmin access required." }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ message: "Brand name is required" }, { status: 400 });
    }

    const brand = await createBrand(body);

    // If Brand Manager credentials provided, create/update the login user in MongoDB
    if (body.managerUsername && body.managerPassword) {
      await connectDB();
      const cleanUsername = body.managerUsername.trim().toLowerCase();
      const email = body.email || `${cleanUsername}@thebrandhub.lk`;

      await UserModel.findOneAndUpdate(
        { $or: [{ username: cleanUsername }, { email }] },
        {
          name: `${brand.name} Official Manager`,
          username: cleanUsername,
          email,
          passwordHash: hashPassword(body.managerPassword),
          role: "brand_manager",
          brandSlug: brand.slug.toLowerCase(),
          phone: body.phone || "+94 76 347 3075",
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json(brand, { status: 201 });
  } catch (err) {
    console.error("Brands POST error:", err);
    return NextResponse.json({ message: "Failed to create brand" }, { status: 500 });
  }
}
