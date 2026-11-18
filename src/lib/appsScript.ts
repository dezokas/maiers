import fs from "fs";
import path from "path";
import os from "os";

export interface AppsScriptPayload {
  action: "list" | "get" | "create" | "update" | "delete";
  table: "Roles" | "Users" | "Catalog" | "Orders";
  data?: Record<string, unknown>;
  id?: string;
  filter?: Record<string, unknown>;
}

export interface AppsScriptResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  timestamp: string;
}

// Helper direktori data yang aman untuk Vercel (read-only filesystem) maupun lokal
function getDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "myers-data");
  }
  return path.join(process.cwd(), ".data");
}

function getDbPath(): string {
  return path.join(getDataDir(), "database.json");
}

interface LocalDatabase {
  Roles: Array<Record<string, unknown>>;
  Users: Array<Record<string, unknown>>;
  Catalog: Array<Record<string, unknown>>;
  Orders: Array<Record<string, unknown>>;
}

let memoryDb: LocalDatabase | null = null;

function getInitialLocalDb(): LocalDatabase {
  const now = new Date().toISOString();
  return {
    Roles: [
      {
        id: "role-admin",
        name: "admin",
        description: "Administrator Utama Myers",
        permissions: "all",
        is_system: true,
        created_at: now,
      },
      {
        id: "role-user",
        name: "user",
        description: "Pengguna Terdaftar",
        permissions: "view",
        is_system: true,
        created_at: now,
      },
    ],
    Users: [
      {
        id: "user-admin-1",
        name: "Administrator Myers",
        email: "admin@gmail.com",
        // Bcrypt hash dari '123456'
        password_hash: "$2b$10$oKIiBCEVDnqb9INxt6q58.oPp2W73WlAkTsbaqVJt2U0nXw8oAa9i",
        role_id: "role-admin",
        status: "active",
        created_at: now,
        updated_at: now,
      },
    ],
    Catalog: [
      {
        id: "prod-1",
        title: "Myers Aero Pulse Runner",
        slug: "myers-aero-pulse-runner",
        category: "Running & Sport",
        price: 899000,
        original_price: 1199000,
        sizes: "39,40,41,42,43,44",
        excerpt: "Sepatu lari dan aktivitas harian dengan bantalan busa ganda responsif dan sirkulasi udara maksimal.",
        content: "Sepatu lari flagship dari Myers dengan material Engineered Breathable Mesh dan insole busa memori CloudStride™.",
        thumbnail_path: "/images/shoe-1.jpg",
        status: "published",
        author_id: "user-admin-1",
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-2",
        title: "Myers Urban Oxford Leather",
        slug: "myers-urban-oxford-leather",
        category: "Formal & Leather",
        price: 1299000,
        original_price: 1599000,
        sizes: "40,41,42,43,44",
        excerpt: "Sepatu formal pria berbahan kulit sapi asli dengan aksen brogue halus dan insole empuk tanpa bikin pegal.",
        content: "Dibuat dari 100% full-grain leather pilihan dengan sol berdaya cengkeram anti-slip.",
        thumbnail_path: "/images/shoe-2.jpg",
        status: "published",
        author_id: "user-admin-1",
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-3",
        title: "Myers High Street Court",
        slug: "myers-high-street-court",
        category: "Casual & Streetwear",
        price: 799000,
        original_price: 999000,
        sizes: "38,39,40,41,42,43,44",
        excerpt: "Siluet retro court sneaker klasik dengan kombinasi panel putih bersih dan aksen hijau botol yang trendy.",
        content: "Sneaker gaya kasual jalanan dengan cupsole kokoh dan bantalan leher kaki empuk.",
        thumbnail_path: "/images/shoe-3.jpg",
        status: "published",
        author_id: "user-admin-1",
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-4",
        title: "Myers Glide Slip-On",
        slug: "myers-glide-slip-on",
        category: "Daily Comfort",
        price: 649000,
        original_price: 799000,
        sizes: "37,38,39,40,41,42,43",
        excerpt: "Sepatu slip-on rajut fleksibel tanpa tali. Praktis digunakan dalam 2 detik, sangat ringan serasa tanpa alas kaki.",
        content: "Upper rajut elastis bernapas dengan sol ultra-ringan EVA untuk jalan santai harian.",
        thumbnail_path: "/images/shoe-4.jpg",
        status: "published",
        author_id: "user-admin-1",
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-5",
        title: "Myers Trail Explorer Max",
        slug: "myers-trail-explorer-max",
        category: "Outdoor & Trail",
        price: 1099000,
        original_price: 1399000,
        sizes: "40,41,42,43,44,45",
        excerpt: "Sepatu outdoor tangguh dengan sol bergigi tajam untuk medan basah, bebatuan, maupun pendakian ringan.",
        content: "Dilapisi pelindung water-resistant dan lug rubber sole untuk cengkeraman maksimal.",
        thumbnail_path: "/images/shoe-5.jpg",
        status: "published",
        author_id: "user-admin-1",
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-6",
        title: "Myers Minimalist Suede Loafer",
        slug: "myers-minimalist-suede-loafer",
        category: "Formal & Leather",
        price: 1149000,
        original_price: 1450000,
        sizes: "39,40,41,42,43",
        excerpt: "Loafer kasual elegan dengan bahan suede premium warna deep navy.",
        content: "Dibuat dengan teknik jahitan tangan tradisional moccasin stitch dan suede Italia bermutu tinggi.",
        thumbnail_path: "/images/shoe-6.jpg",
        status: "published",
        author_id: "user-admin-1",
        created_at: now,
        updated_at: now,
      },
    ],
    Orders: [],
  };
}

function readLocalDb(): LocalDatabase {
  if (memoryDb) {
    return memoryDb;
  }
  const dataDir = getDataDir();
  const dbPath = getDbPath();

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, "utf-8");
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
  } catch (err) {
    console.warn("[LocalDB] Filesystem tidak dapat diakses secara langsung, menggunakan in-memory:", err);
  }

  memoryDb = getInitialLocalDb();
  try {
    fs.writeFileSync(dbPath, JSON.stringify(memoryDb, null, 2));
  } catch {
    // Abaikan jika filesystem read-only (misal Vercel Lambda)
  }
  return memoryDb;
}

function writeLocalDb(db: LocalDatabase) {
  memoryDb = db;
  try {
    const dataDir = getDataDir();
    const dbPath = getDbPath();
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.warn("[LocalDB] Filesystem read-only, pembaruan disimpan di memory runtime:", err);
  }
}

/**
 * Eksekusi panggilan ke Apps Script Web App (atau Local Database Fallback jika URL belum diisi di .env)
 */
export async function queryAppsScript<T = unknown>(
  payload: AppsScriptPayload
): Promise<AppsScriptResponse<T>> {
  const scriptUrl = process.env.APPS_SCRIPT_URL || "";
  const scriptSecret = process.env.APPS_SCRIPT_SECRET || "myers-secret-token-change-in-production";

  // Jika URL Apps Script sudah diatur, panggil Google Apps Script Web App
  if (
    scriptUrl &&
    scriptUrl.startsWith("https://script.google.com/")
  ) {
    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          token: scriptSecret,
        }),
        redirect: "follow",
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const result = await response.json();
          if (result && typeof result === "object") {
            return result as AppsScriptResponse<T>;
          }
        }
      }
      console.warn(
        `[AppsScript] Remote Web App returned HTTP ${response.status}. Menggunakan fallback database sementara.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[AppsScript] Koneksi ke Google gagal (${msg}). Menggunakan fallback database.`
      );
    }
  }

  // Local sync handler (memastikan aplikasi berfungsi mandiri 100% sebelum deploy ke Google Apps Script)
  const db = readLocalDb();
  const tableData = db[payload.table] || [];
  const now = new Date().toISOString();

  switch (payload.action) {
    case "list": {
      let filtered = [...tableData];
      if (payload.filter) {
        filtered = filtered.filter((row) => {
          for (const k of Object.keys(payload.filter!)) {
            if (String(row[k]) !== String(payload.filter![k])) return false;
          }
          return true;
        });
      }
      return {
        success: true,
        statusCode: 200,
        message: "OK",
        data: filtered as unknown as T,
        timestamp: now,
      };
    }

    case "get": {
      let found: Record<string, unknown> | undefined;
      if (payload.id) {
        found = tableData.find((r) => String(r.id) === String(payload.id));
      } else if (payload.filter) {
        found = tableData.find((row) => {
          for (const k of Object.keys(payload.filter!)) {
            if (String(row[k]) !== String(payload.filter![k])) return false;
          }
          return true;
        });
      }
      if (!found) {
        return {
          success: false,
          statusCode: 404,
          message: "Data tidak ditemukan",
          data: null,
          timestamp: now,
        };
      }
      return {
        success: true,
        statusCode: 200,
        message: "OK",
        data: found as unknown as T,
        timestamp: now,
      };
    }

    case "create": {
      const newId = (payload.data?.id as string) || `id-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newRow: Record<string, unknown> = {
        ...payload.data,
        id: newId,
        created_at: payload.data?.created_at || now,
        updated_at: now,
      };
      tableData.push(newRow);
      db[payload.table] = tableData;
      writeLocalDb(db);
      return {
        success: true,
        statusCode: 200,
        message: "Data berhasil disimpan",
        data: newRow as unknown as T,
        timestamp: now,
      };
    }

    case "update": {
      if (!payload.id) {
        return {
          success: false,
          statusCode: 400,
          message: "Parameter ID wajib untuk pembaruan data",
          data: null,
          timestamp: now,
        };
      }
      const index = tableData.findIndex((r) => String(r.id) === String(payload.id));
      if (index === -1) {
        return {
          success: false,
          statusCode: 404,
          message: "Data tidak ditemukan untuk diperbarui",
          data: null,
          timestamp: now,
        };
      }
      const updated = {
        ...tableData[index],
        ...payload.data,
        updated_at: now,
      };
      tableData[index] = updated;
      db[payload.table] = tableData;
      writeLocalDb(db);
      return {
        success: true,
        statusCode: 200,
        message: "Data berhasil diperbarui",
        data: updated as unknown as T,
        timestamp: now,
      };
    }

    case "delete": {
      if (!payload.id) {
        return {
          success: false,
          statusCode: 400,
          message: "Parameter ID wajib untuk penghapusan",
          data: null,
          timestamp: now,
        };
      }
      const target = tableData.find((r) => String(r.id) === String(payload.id));
      if (!target) {
        return {
          success: false,
          statusCode: 404,
          message: "Data tidak ditemukan",
          data: null,
          timestamp: now,
        };
      }
      if (target.is_system === true || target.is_system === "true") {
        return {
          success: false,
          statusCode: 403,
          message: "Data sistem tidak boleh dihapus",
          data: null,
          timestamp: now,
        };
      }
      db[payload.table] = tableData.filter((r) => String(r.id) !== String(payload.id));
      writeLocalDb(db);
      return {
        success: true,
        statusCode: 200,
        message: "Data berhasil dihapus",
        data: { id: payload.id } as unknown as T,
        timestamp: now,
      };
    }

    default:
      return {
        success: false,
        statusCode: 400,
        message: "Aksi tidak dikenal",
        data: null,
        timestamp: now,
      };
  }
}
