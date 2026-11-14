import { NextRequest, NextResponse } from "next/server";
import {
  comparePassword,
  signToken,
  DEFAULT_ADMIN,
  ADMIN_USERNAME,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from "@/lib/auth";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.username || body.email || body.identifier || "").trim();
    const password = body.password || "";

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Username/Email and password are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.toLowerCase();

    // 1. Check Pre-configured Admin Credentials (Username or Email)
    const isAdminMatch =
      cleanIdentifier === ADMIN_USERNAME.toLowerCase() ||
      cleanIdentifier === ADMIN_EMAIL.toLowerCase() ||
      cleanIdentifier === DEFAULT_ADMIN.username.toLowerCase() ||
      cleanIdentifier === DEFAULT_ADMIN.email.toLowerCase();

    if (
      isAdminMatch &&
      (password === ADMIN_PASSWORD || comparePassword(password, DEFAULT_ADMIN.passwordHash!))
    ) {
      const token = signToken({
        userId: DEFAULT_ADMIN._id!,
        email: DEFAULT_ADMIN.email,
        name: DEFAULT_ADMIN.name,
        role: "superadmin",
        username: ADMIN_USERNAME,
      });

      const response = NextResponse.json({
        user: {
          userId: DEFAULT_ADMIN._id,
          email: DEFAULT_ADMIN.email,
          name: DEFAULT_ADMIN.name,
          role: "superadmin",
          username: ADMIN_USERNAME,
        },
      });

      response.cookies.set("tbh_auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    // 2. Check Database Users in MongoDB (Match email or name)
    const db = await connectDB();
    if (db) {
      const user = await UserModel.findOne({
        $or: [
          { email: cleanIdentifier },
          { name: { $regex: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        ],
      });

      if (user && user.passwordHash && comparePassword(password, user.passwordHash)) {
        const token = signToken({
          userId: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        });

        const response = NextResponse.json({
          user: {
            userId: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
          },
        });

        response.cookies.set("tbh_auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        return response;
      }
    }

    return NextResponse.json(
      { message: "Invalid username/email or password" },
      { status: 401 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
