import { NextRequest, NextResponse } from "next/server";
import { comparePassword, signToken, DEFAULT_ADMIN } from "@/lib/auth";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check pre-seeded default super-admin
    if (cleanEmail === DEFAULT_ADMIN.email && comparePassword(password, DEFAULT_ADMIN.passwordHash!)) {
      const token = signToken({
        userId: DEFAULT_ADMIN._id!,
        email: DEFAULT_ADMIN.email,
        name: DEFAULT_ADMIN.name,
        role: "superadmin",
      });

      const response = NextResponse.json({
        user: {
          userId: DEFAULT_ADMIN._id,
          email: DEFAULT_ADMIN.email,
          name: DEFAULT_ADMIN.name,
          role: "superadmin",
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

    // Check MongoDB users
    await connectDB();
    const user = await UserModel.findOne({ email: cleanEmail });
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

    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
