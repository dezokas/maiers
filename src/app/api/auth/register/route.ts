import { NextRequest, NextResponse } from "next/server";
import { queryAppsScript } from "@/lib/appsScript";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 2. Cek apakah email sudah terdaftar
    const checkRes = await queryAppsScript<Record<string, unknown>>({
      action: "get",
      table: "Users",
      filter: { email: cleanEmail },
    });

    if (checkRes.success && checkRes.data) {
      return NextResponse.json(
        { error: "Alamat email ini sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    // 3. Hash password di server
    const hashedPassword = await hashPassword(password);

    // 4. Buat record user baru dengan role 'user'
    const newUserData = {
      name: String(name).trim(),
      email: cleanEmail,
      password_hash: hashedPassword,
      role_id: "role-user",
      status: "active",
    };

    const createRes = await queryAppsScript<{ id: string; name: string; email: string }>({
      action: "create",
      table: "Users",
      data: newUserData,
    });

    if (!createRes.success || !createRes.data) {
      return NextResponse.json(
        { error: "Gagal mendaftarkan akun ke sistem database." },
        { status: 500 }
      );
    }

    // 5. Buat session token & set httpOnly cookie
    const session = {
      id: createRes.data.id,
      name: String(name).trim(),
      email: cleanEmail,
      role: "user",
    };

    const token = await createSessionToken(session);
    await setSessionCookie(token);

    return NextResponse.json(
      { success: true, message: "Pendaftaran akun berhasil!", user: session },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Terjadi kesalahan server: ${msg}` },
      { status: 500 }
    );
  }
}
