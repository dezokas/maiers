import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { queryAppsScript } from "@/lib/appsScript";
import { deleteFile } from "@/lib/storage";

async function ensureAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");

  const filter: Record<string, unknown> = {};
  if (statusFilter) {
    filter.status = statusFilter;
  }

  const result = await queryAppsScript<Array<Record<string, unknown>>>({
    action: "list",
    table: "Catalog",
    filter: Object.keys(filter).length > 0 ? filter : undefined,
  });

  return NextResponse.json({
    success: true,
    data: result.data || [],
  });
}

export async function POST(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      title,
      category,
      price,
      original_price,
      sizes,
      excerpt,
      content,
      thumbnail_path,
      status,
    } = body;

    if (!title || !price || !category) {
      return NextResponse.json(
        { error: "Nama produk, kategori, dan harga wajib diisi." },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();

    const newProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: String(title).trim(),
      slug: slug || `shoe-${Date.now()}`,
      category: String(category).trim(),
      price: Number(price) || 0,
      original_price: original_price ? Number(original_price) : "",
      sizes: sizes ? String(sizes).trim() : "39,40,41,42,43,44",
      excerpt: excerpt ? String(excerpt).trim() : "",
      content: content ? String(content).trim() : "",
      thumbnail_path: thumbnail_path || "/images/hero-shoe.jpg",
      status: status || "published",
      author_id: admin.id,
    };

    const result = await queryAppsScript({
      action: "create",
      table: "Catalog",
      data: newProduct,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Produk berhasil ditambahkan ke katalog.", data: result.data },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID diperlukan." }, { status: 400 });
    }

    if (updateFields.title) {
      updateFields.slug = updateFields.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
    }

    if (updateFields.price) {
      updateFields.price = Number(updateFields.price);
    }
    if (updateFields.original_price) {
      updateFields.original_price = Number(updateFields.original_price);
    }

    const result = await queryAppsScript({
      action: "update",
      table: "Catalog",
      id,
      data: updateFields,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product ID diperlukan." }, { status: 400 });
  }

  // Ambil data untuk membersihkan thumbnail lokal jika ada di uploads
  const prodRes = await queryAppsScript<Record<string, unknown>>({
    action: "get",
    table: "Catalog",
    id,
  });

  if (prodRes.success && prodRes.data && prodRes.data.thumbnail_path) {
    const thumb = String(prodRes.data.thumbnail_path);
    if (thumb.startsWith("/uploads/")) {
      await deleteFile(thumb);
    }
  }

  const result = await queryAppsScript({
    action: "delete",
    table: "Catalog",
    id,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Produk berhasil dihapus dari katalog." });
}
