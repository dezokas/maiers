import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { saveFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak: Hanya admin yang dapat mengunggah media." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan dalam request form data." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await saveFile(buffer, file.name, file.type);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Media berhasil diunggah.",
      urlPath: result.urlPath,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Gagal memproses upload: ${msg}` },
      { status: 500 }
    );
  }
}
