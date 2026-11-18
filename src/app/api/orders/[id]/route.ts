import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { queryAppsScript } from "@/lib/appsScript";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
    }

    const { id } = await params;

    const orderRes = await queryAppsScript<Record<string, unknown>>({
      action: "get",
      table: "Orders",
      id,
    });

    if (!orderRes.success || !orderRes.data) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    const order = orderRes.data;

    // Proteksi Keamanan: User biasa hanya boleh melihat tiket miliknya sendiri
    if (user.role !== "admin" && String(order.user_id) !== String(user.id)) {
      return NextResponse.json(
        { error: "Akses ditolak: Anda tidak memiliki akses ke pesanan ini." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
