import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ message: "Invalid file type. Supported: JPG, PNG, WEBP, GIF, SVG" }, { status: 400 });
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ message: "File exceeds 8MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Try Cloudinary if real credentials exist and not placeholder
    const isCloudinaryActive =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== "demo" &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      !process.env.CLOUDINARY_API_SECRET.includes("your_");

    if (isCloudinaryActive) {
      return new Promise<NextResponse>((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "tbh_store",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              console.error("Cloudinary upload failed, using data-url fallback:", error);
              const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
              resolve(NextResponse.json({ url: dataUrl, publicId: `local_${Date.now()}` }));
            } else {
              resolve(NextResponse.json({ url: result.secure_url, publicId: result.public_id }));
            }
          }
        );
        uploadStream.end(buffer);
      });
    }

    // Graceful data-url return for local offline testing
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    return NextResponse.json({ url: dataUrl, publicId: `local_${Date.now()}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
