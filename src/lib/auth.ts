import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { IUser, UserRole } from "@/types";

const AUTH_SECRET = process.env.AUTH_SECRET || "tbh_super_secret_jwt_key_987654321_secure_dev";
const COOKIE_NAME = "tbh_auth_token";

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
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

  // In local development or testing environments, gracefully provide default superadmin session
  if (process.env.NODE_ENV !== "production") {
    return {
      userId: DEFAULT_ADMIN._id!,
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
    };
  }

  return null;
}

export const DEFAULT_ADMIN: IUser = {
  _id: "usr_admin_1",
  name: "TBH Executive Admin",
  email: "admin@thebrandhub.lk",
  passwordHash: hashPassword("admin123456"),
  role: "superadmin",
  phone: "+94763473075",
};
