import { NextRequest, NextResponse } from "next/server";
import { getReviews, createReview } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || undefined;
    const reviews = await getReviews(productId);
    return NextResponse.json(reviews);
  } catch (err) {
    console.error("Reviews GET error:", err);
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.productId || !body.userName || !body.comment) {
      return NextResponse.json({ message: "Product, name, and comment are required" }, { status: 400 });
    }
    const review = await createReview(body);
    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error("Review POST error:", err);
    return NextResponse.json({ message: "Failed to submit review" }, { status: 500 });
  }
}
