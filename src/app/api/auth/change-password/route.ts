import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPassword, verifyPassword } from "@/lib/auth";
import { queryAppsScript } from "@/lib/appsScript";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak valid. Harap login kembali." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    // Ambil data user dari database
    const userRes = await queryAppsScript<Record<string, unknown>>({
      action: "get",
      table: "Users",
      id: user.id,
    });

    if (!userRes.success || !userRes.data) {
      return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });
    }

    // Verifikasi password saat ini
    const currentHash = String(userRes.data.password_hash || "");
    const isCurrentValid = await verifyPassword(currentPassword, currentHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Password saat ini tidak sesuai." },
        { status: 400 }
      );
    }

    // Hash password baru & simpan
    const newHash = await hashPassword(newPassword);
    const updateRes = await queryAppsScript({
      action: "update",
      table: "Users",
      id: user.id,
      data: { password_hash: newHash },
    });

    if (!updateRes.success) {
      return NextResponse.json({ error: "Gagal memperbarui password." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Password berhasil diganti. Silakan gunakan password baru ini untuk login berikutnya.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
