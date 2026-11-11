import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "superadmin" && user.role !== "admin")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();
    const updated = await updateSiteSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Settings PUT error:", err);
    return NextResponse.json({ message: "Failed to update settings" }, { status: 500 });
  }
}
