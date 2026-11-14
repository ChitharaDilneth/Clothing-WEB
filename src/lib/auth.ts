import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { IUser, UserRole } from "@/types";

const AUTH_SECRET = process.env.AUTH_SECRET || "tbh_super_secret_jwt_key_987654321_secure_dev";
const COOKIE_NAME = "tbh_auth_token";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@thebrandhub.lk";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123456";

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  username?: string;
  brandSlug?: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      const verified = verifyToken(token);
      if (verified) return verified;
    }
  } catch {
    // cookies() unavailable in non-request contexts
  }

  return null;
}

export const DEFAULT_ADMIN: IUser & { username: string } = {
  _id: "usr_admin_1",
  name: "TBH Executive Admin",
  email: ADMIN_EMAIL,
  username: ADMIN_USERNAME,
  passwordHash: hashPassword(ADMIN_PASSWORD),
  role: "superadmin",
  phone: "+94763473075",
};

export const DEFAULT_BRAND_MANAGERS: Record<
  string,
  { username: string; password: string; name: string; brandSlug: string; email: string }
> = {
  waves: {
    username: "waves",
    password: process.env.BRAND_WAVES_PASSWORD || "waves123456",
    name: "WAVES Official Store Manager",
    brandSlug: "waves",
    email: "waves@thebrandhub.lk",
  },
  ansel: {
    username: "ansel",
    password: process.env.BRAND_ANSEL_PASSWORD || "ansel123456",
    name: "ANSEL Footwear Manager",
    brandSlug: "ansel",
    email: "ansel@thebrandhub.lk",
  },
  breakwater: {
    username: "breakwater",
    password: process.env.BRAND_BREAKWATER_PASSWORD || "breakwater123456",
    name: "BREAKWATER Brand Manager",
    brandSlug: "breakwater",
    email: "breakwater@thebrandhub.lk",
  },
};
