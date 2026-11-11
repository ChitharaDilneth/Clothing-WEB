import { NextRequest, NextResponse } from "next/server";
import { hashPassword, signToken } from "@/lib/auth";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const db = await connectDB();
    if (db) {
      const existing = await UserModel.findOne({ email: cleanEmail });
      if (existing) {
        return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
      }

      const newUser = await UserModel.create({
        name: name.trim(),
        email: cleanEmail,
        passwordHash: hashPassword(password),
        phone: phone || "",
        role: "customer",
      });

      const token = signToken({
        userId: String(newUser._id),
        email: newUser.email,
        name: newUser.name,
        role: "customer",
      });

      const response = NextResponse.json({
        user: {
          userId: String(newUser._id),
          email: newUser.email,
          name: newUser.name,
          role: "customer",
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

    // In-memory fallback
    const token = signToken({
      userId: `user_${Date.now()}`,
      email: cleanEmail,
      name: name.trim(),
      role: "customer",
    });

    const response = NextResponse.json({
      user: {
        userId: `user_${Date.now()}`,
        email: cleanEmail,
        name: name.trim(),
        role: "customer",
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
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
