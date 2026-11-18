import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.AUTH_SECRET || "myers-super-secure-jwt-secret-key-32chars-minimum";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "myers_session";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string; // "admin" | "user" | etc
}

/**
 * Hash password polos menggunakan Bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Verifikasi password polos terhadap hash tersimpan
 */
export async function verifyPassword(
  plainText: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

/**
 * Buat signed JWT session token
 */
export async function createSessionToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

/**
 * Verifikasi signed JWT session token
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

/**
 * Ambil sesi pengguna saat ini dari cookie httpOnly
 */
export async function getSessionUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Simpan token sesi ke dalam cookie httpOnly
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

/**
 * Hapus cookie sesi saat logout
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
