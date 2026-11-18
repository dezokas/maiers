import { NextRequest, NextResponse } from "next/server";
import { queryAppsScript } from "@/lib/appsScript";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Ambil data user berdasarkan email
    const userRes = await queryAppsScript<Record<string, unknown>>({
      action: "get",
      table: "Users",
      filter: { email: cleanEmail },
    });

    if (!userRes.success || !userRes.data) {
      return NextResponse.json(
        { error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    const user = userRes.data;

    // 2. Cek status aktif
    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Akun Anda sedang dinonaktifkan oleh Administrator." },
        { status: 403 }
      );
    }

    // 3. Verifikasi hash password
    const passwordHash = String(user.password_hash || "");
    const isMatch = await verifyPassword(password, passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // 4. Resolusi nama role
    let roleName = "user";
    if (user.role_id === "role-admin" || user.role_id === "admin") {
      roleName = "admin";
    } else if (user.role_id) {
      const roleRes = await queryAppsScript<Record<string, unknown>>({
        action: "get",
        table: "Roles",
        id: String(user.role_id),
      });
      if (roleRes.success && roleRes.data && roleRes.data.name) {
        roleName = String(roleRes.data.name);
      }
    }

    // 5. Buat JWT & set cookie
    const session = {
      id: String(user.id),
      name: String(user.name || "User"),
      email: cleanEmail,
      role: roleName,
    };

    const token = await createSessionToken(session);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Login berhasil!",
      user: session,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Terjadi kesalahan server: ${msg}` },
      { status: 500 }
    );
  }
}
