import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { queryAppsScript } from "@/lib/appsScript";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Sesi tidak valid. Harap masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const filter: Record<string, unknown> = {};

    // KEAMANAN KETAT: Pengguna biasa HANYA boleh melihat pesanan miliknya sendiri
    if (user.role !== "admin") {
      filter.user_id = user.id;
    }

    if (statusFilter && statusFilter !== "all") {
      filter.status = statusFilter;
    }

    const ordersRes = await queryAppsScript<Array<Record<string, unknown>>>({
      action: "list",
      table: "Orders",
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });

    // Urutkan dari yang terbaru
    const sorted = (ordersRes.data || []).sort((a, b) => {
      const timeA = new Date(String(a.created_at || 0)).getTime();
      const timeB = new Date(String(b.created_at || 0)).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({ success: true, data: sorted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Silakan masuk ke akun Anda untuk melakukan pemesanan." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      product_id,
      product_title,
      product_thumbnail,
      size,
      quantity,
      unit_price,
      recipient_name,
      recipient_phone,
      shipping_address,
      notes,
    } = body;

    // 1. Validasi Input di Server
    if (!product_id || !product_title) {
      return NextResponse.json(
        { error: "Produk sepatu yang dipesan tidak valid." },
        { status: 400 }
      );
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { error: "Jumlah pesanan harus lebih besar dari 0." },
        { status: 400 }
      );
    }

    if (!size) {
      return NextResponse.json(
        { error: "Ukuran sepatu (EU) wajib dipilih." },
        { status: 400 }
      );
    }

    const cleanName = String(recipient_name || "").trim();
    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { error: "Nama penerima harus diisi dengan benar (minimal 2 karakter)." },
        { status: 400 }
      );
    }

    const cleanPhone = String(recipient_phone || "").replace(/[^\d+]/g, "").trim();
    if (!cleanPhone || cleanPhone.length < 9) {
      return NextResponse.json(
        { error: "Nomor WhatsApp penerima tidak valid (minimal 9 digit angka)." },
        { status: 400 }
      );
    }

    const cleanAddress = String(shipping_address || "").trim();
    if (!cleanAddress || cleanAddress.length < 5) {
      return NextResponse.json(
        { error: "Alamat pengiriman lengkap wajib diisi (minimal 5 karakter)." },
        { status: 400 }
      );
    }

    const uPrice = Number(unit_price) || 0;
    const totalPrice = uPrice * qty;

    const orderTicketId = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 2. Buat record Order baru dengan status awal 'menunggu_konfirmasi'
    const newOrder = {
      id: orderTicketId,
      user_id: user.id,
      user_name: user.name,
      product_id,
      product_title: String(product_title),
      product_thumbnail: product_thumbnail || "/images/hero-shoe.jpg",
      size: String(size),
      quantity: qty,
      unit_price: uPrice,
      total_price: totalPrice,
      recipient_name: cleanName,
      recipient_phone: cleanPhone,
      shipping_address: cleanAddress,
      notes: String(notes || "").trim(),
      status: "menunggu_konfirmasi",
      rejection_reason: "",
    };

    const result = await queryAppsScript({
      action: "create",
      table: "Orders",
      data: newOrder,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Gagal menyimpan tiket pesanan ke database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pesanan berhasil dibuat!",
        orderId: orderTicketId,
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak: Hanya administrator yang dapat mengubah status pesanan." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, status, rejection_reason } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Order ID dan status baru wajib disertakan." },
        { status: 400 }
      );
    }

    const validStatuses = ["menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status tidak valid. Pilihan: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status };
    if (rejection_reason !== undefined) {
      updateData.rejection_reason = String(rejection_reason);
    }

    const result = await queryAppsScript({
      action: "update",
      table: "Orders",
      id,
      data: updateData,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Status pesanan ${id} berhasil diperbarui menjadi ${status}.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
