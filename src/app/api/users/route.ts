import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { queryAppsScript } from "@/lib/appsScript";

// Helper proteksi role admin di server
async function ensureAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

export async function GET() {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  const usersRes = await queryAppsScript<Array<Record<string, unknown>>>({
    action: "list",
    table: "Users",
  });

  const rolesRes = await queryAppsScript<Array<Record<string, unknown>>>({
    action: "list",
    table: "Roles",
  });

  const rolesMap = new Map<string, string>();
  if (rolesRes.success && Array.isArray(rolesRes.data)) {
    rolesRes.data.forEach((r) => {
      rolesMap.set(String(r.id), String(r.name));
    });
  }

  // Bersihkan password_hash sebelum dikirim ke browser
  const sanitizedUsers = (usersRes.data || []).map((u) => {
    const roleId = String(u.role_id || "");
    const roleName = rolesMap.get(roleId) || (roleId.includes("admin") ? "admin" : "user");
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role_id: u.role_id,
      role: roleName,
      status: u.status,
      created_at: u.created_at,
      updated_at: u.updated_at,
    };
  });

  return NextResponse.json({ success: true, data: sanitizedUsers });
}

export async function PUT(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const body = await req.json();
  const { id, role_id, status, name } = body;

  if (!id) {
    return NextResponse.json({ error: "User ID diperlukan." }, { status: 400 });
  }

  // Guard: Admin tidak boleh menonaktifkan dirinya sendiri
  if (String(id) === String(admin.id)) {
    if (status && status !== "active") {
      return NextResponse.json(
        { error: "Anda tidak dapat menonaktifkan akun admin Anda sendiri." },
        { status: 400 }
      );
    }
    if (role_id && role_id !== "role-admin" && role_id !== "admin") {
      return NextResponse.json(
        { error: "Anda tidak dapat menurunkan role admin Anda sendiri." },
        { status: 400 }
      );
    }
  }

  const updateData: Record<string, unknown> = {};
  if (role_id !== undefined) updateData.role_id = role_id;
  if (status !== undefined) updateData.status = status;
  if (name !== undefined) updateData.name = name;

  const result = await queryAppsScript({
    action: "update",
    table: "Users",
    id,
    data: updateData,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "User berhasil diperbarui." });
}

export async function DELETE(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "User ID diperlukan." }, { status: 400 });
  }

  // Guard: Admin tidak boleh menghapus dirinya sendiri
  if (String(id) === String(admin.id)) {
    return NextResponse.json(
      { error: "Anda tidak dapat menghapus akun admin Anda sendiri." },
      { status: 400 }
    );
  }

  const result = await queryAppsScript({
    action: "delete",
    table: "Users",
    id,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "User berhasil dihapus." });
}
