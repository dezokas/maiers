import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { queryAppsScript } from "@/lib/appsScript";

async function ensureAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const result = await queryAppsScript<Array<Record<string, unknown>>>({
    action: "list",
    table: "Roles",
  });

  return NextResponse.json({ success: true, data: result.data || [] });
}

export async function POST(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, permissions } = body;

  if (!name) {
    return NextResponse.json({ error: "Nama role wajib diisi." }, { status: 400 });
  }

  const cleanName = String(name).trim().toLowerCase();

  const newRole = {
    id: `role-${cleanName}-${Date.now().toString(36)}`,
    name: cleanName,
    description: description || "",
    permissions: permissions || "view",
    is_system: false,
  };

  const result = await queryAppsScript({
    action: "create",
    table: "Roles",
    data: newRole,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Role berhasil ditambahkan.", data: result.data }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const body = await req.json();
  const { id, description, permissions } = body;

  if (!id) {
    return NextResponse.json({ error: "Role ID diperlukan." }, { status: 400 });
  }

  const roleRes = await queryAppsScript<Record<string, unknown>>({
    action: "get",
    table: "Roles",
    id,
  });

  if (!roleRes.success || !roleRes.data) {
    return NextResponse.json({ error: "Role tidak ditemukan." }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (description !== undefined) updateData.description = description;
  if (permissions !== undefined) updateData.permissions = permissions;

  const result = await queryAppsScript({
    action: "update",
    table: "Roles",
    id,
    data: updateData,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Role berhasil diperbarui." });
}

export async function DELETE(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Role ID diperlukan." }, { status: 400 });
  }

  const roleRes = await queryAppsScript<Record<string, unknown>>({
    action: "get",
    table: "Roles",
    id,
  });

  if (roleRes.success && roleRes.data) {
    if (roleRes.data.is_system === true || roleRes.data.is_system === "true") {
      return NextResponse.json(
        { error: "Role sistem bawaan (admin & user) tidak boleh dihapus." },
        { status: 403 }
      );
    }
  }

  const result = await queryAppsScript({
    action: "delete",
    table: "Roles",
    id,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Role berhasil dihapus." });
}
