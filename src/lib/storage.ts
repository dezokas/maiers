import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Pastikan folder public/uploads selalu ada (abaikan jika di lingkungan serverless read-only)
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  // Abaikan di lingkungan Vercel Lambda / read-only filesystem
}

export interface SaveFileResult {
  success: boolean;
  filePath?: string;
  urlPath?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Menyimpan buffer file ke folder lokal public/uploads/
 * Catatan: Untuk produksi Vercel, fungsi ini siap diganti dengan Vercel Blob / Cloudinary / S3.
 */
export async function saveFile(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<SaveFileResult> {
  try {
    // 1. Validasi tipe file
    if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      return {
        success: false,
        error: "Format file tidak didukung. Harap gunakan JPG, PNG, atau WEBP.",
      };
    }

    // 2. Validasi ukuran file
    if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Batas maksimal adalah 5MB.",
      };
    }

    // 3. Sanitasi ekstensi & buat nama file unik
    const ext = path.extname(originalFilename).toLowerCase() || ".jpg";
    const cleanExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext)
      ? ext
      : ".jpg";
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 9);
    const uniqueFilename = `myers-${timestamp}-${randomHex}${cleanExt}`;

    const destinationPath = path.join(UPLOADS_DIR, uniqueFilename);
    await fs.promises.writeFile(destinationPath, fileBuffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return {
      success: true,
      filePath: destinationPath,
      urlPath: publicUrl,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Gagal menyimpan file: ${message}`,
    };
  }
}

/**
 * Menghapus file lokal di public/uploads/
 */
export async function deleteFile(urlPath: string): Promise<boolean> {
  try {
    if (!urlPath || !urlPath.startsWith("/uploads/")) {
      return false;
    }
    const filename = path.basename(urlPath);
    const targetFile = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(targetFile)) {
      await fs.promises.unlink(targetFile);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error deleting local file:", err);
    return false;
  }
}
