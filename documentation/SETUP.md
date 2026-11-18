# Panduan Setup & Manajemen Proyek - Myers

## 1. Persiapan Awal & Menjalankan Lokal

### Prasyarat:
- Node.js versi 18+ (direkomendasikan versi LTS/terbaru).
- npm / yarn / pnpm.

### Menjalankan Server Pengembangan:
```bash
npm run dev
```
Akses di browser:
- Halaman Utama: `http://localhost:3000`
- Halaman Login: `http://localhost:3000/login`
- Halaman Register: `http://localhost:3000/register`
- Admin Dashboard: `http://localhost:3000/dashboard`

---

## 2. Kredensial Administrator Awal (PENTING)

Sesuai inisiasi awal, akun admin default telah dibuat:
- **Email:** `admin@gmail.com`
- **Password:** `123456`

> [!WARNING]
> **Peringatan Keamanan Kritis:**
> Kredensial di atas bersifat publik dan lemah. Password **telah di-hash dengan Bcrypt** di database (bukan teks polos). Namun, **wajib mengganti password admin** melalui menu **"Ganti Password Admin"** di Dashboard sebelum website dipublikasikan ke publik.

---

## 3. Integrasi Database Google Spreadsheet via Google Apps Script

Aplikasi menggunakan arsitektur aman:
```
Browser -> Next.js Server (API Route) -> Google Apps Script (Web App) -> Google Spreadsheet
```
*Mengapa arsitektur ini digunakan?*
Supaya spreadsheet Anda tidak bisa diakses sembarang orang dari browser publik, melainkan hanya dapat diakses melalui server Next.js dengan secret token bersama.

### Langkah Setup Google Apps Script:

1. **Buat Google Spreadsheet Baru:**
   - Buka [Google Sheets](https://sheets.new) dan beri judul spreadsheet Anda, misalnya `Myers Footwear Database`.

2. **Buka Editor Apps Script:**
   - Di spreadsheet, klik menu **Extensions (Ekstensi)** > **Apps Script**.

3. **Salin Kode Script:**
   - Hapus kode default di file `Code.gs`, lalu salin seluruh isi dari file lokal [code.gs](file:///C:/Users/Asus/Documents/Personal%20Projects/test2/code.gs) ke editor Apps Script.
   - Buat file script baru di editor dengan klik tanda **+** > **Script**, beri nama `setup.gs`, lalu salin seluruh isi dari file lokal [setup.gs](file:///C:/Users/Asus/Documents/Personal%20Projects/test2/setup.gs).

4. **Konfigurasi Script Properties (Token Rahasia):**
   - Di menu sebelah kiri editor Apps Script, klik **Project Settings (ikon roda gigi)**.
   - Gulir ke bawah ke bagian **Script Properties**.
   - Klik **Add script property**:
     - Property: `APPS_SCRIPT_SECRET`
     - Value: `myers-secret-token-change-in-production` (atau buat kode rahasia unik Anda sendiri).
   - Klik **Save script properties**.

5. **Jalankan Inisiasi Tabel Otomatis:**
   - Kembali ke tab editor kode (`setup.gs`).
   - Pada dropdown fungsi di toolbar atas, pilih fungsi `initTables`.
   - Klik tombol **Run (Jalankan)**.
   - Berikan izin akses Google (Review Permissions > Izinkan akun Anda).
   - Fungsi ini **idempoten** (aman dijalankan berulang kali): sheet `Roles`, `Users`, `Catalog`, dan `Orders` beserta kolom header dan seed data default akan dibuat/diselaraskan otomatis pada spreadsheet Anda!

6. **Deploy Sebagai Web App:**
   - Klik tombol biru **Deploy** di pojok kanan atas > **New deployment** (atau **Manage deployments** > **Edit** > **New version** jika sudah pernah deploy).
   - Pilih jenis deployment (ikon roda gigi) > **Web app**.
   - Isi form:
     - **Description:** `Myers Backend API v2 (Orders & QRIS)`
     - **Execute as:** `Me (email Anda)`
     - **Who has access:** `Anyone` (PENTING: Pilih "Anyone" / Siapa saja agar server dapat memanggil endpoint).
   - Klik **Deploy**.
   - Salin **Web app URL** yang dihasilkan ke `.env.local`.

7. **Simpan di Environment Variables Next.js (`.env.local`):**
   - Buat atau sunting file `.env.local` pada project:
     ```env
     APPS_SCRIPT_URL="https://script.google.com/macros/s/DEPLOYMENT_ID_ANDA/exec"
     APPS_SCRIPT_SECRET="myers-secret-token-change-in-production"
     AUTH_SECRET="kunci-rahasia-jwt-acak-minimal-32-karakter"
     ```

8. **Cara Memperbarui Jika Kode Berubah Nanti:**
   - Jika Anda mengubah `code.gs` atau `setup.gs`, klik **Deploy** > **Manage deployments** > Klik ikon pensil (Edit) > ubah Version menjadi **New version** > klik **Deploy**.

---

## 4. Catatan Penting Mengenai Media Upload (Vercel Compatibility)

- Semua media yang diunggah melalui Dashboard admin disimpan di folder lokal `public/uploads/` dan path-nya dicatat ke database.
- Modul penyimpanan telah diabstraksikan di [src/lib/storage.ts](file:///C:/Users/Asus/Documents/Personal%20Projects/test2/src/lib/storage.ts) dengan fungsi `saveFile` dan `deleteFile`.
- **Catatan Penting Vercel:** Disk serverless Vercel bersifat sementara (ephemeral / read-only) saat aplikasi berjalan di cloud production. Upload lokal berfungsi sempurna saat pengembangan lokal, namun untuk cloud production permanen di Step 4, penyimpanan media dapat dimigrasikan ke penyedia cloud (seperti Vercel Blob, Cloudinary, atau Google Drive) cukup dengan memperbarui fungsi di `lib/storage.ts`.

---

## 5. Ringkasan Aset Gambar Nyata

Aset foto asli telah diperbarui dari foto riil beresolusi tinggi (format JPG):

| Nama File | Lokasi | Ukuran Ideal | Keterangan |
|---|---|---|---|
| `logo.svg` | `public/images/` | Scalable Vector | Logo resmi Myers |
| `hero-shoe.jpg` | `public/images/` | 1200 x 900 px | Foto produk Hero Section |
| `about-craft.jpg` | `public/images/` | 1000 x 1000 px | Foto proses craftmanship |
| `shoe-1.jpg` s.d `shoe-6.jpg` | `public/images/` | 1000 x 800 px | Foto produk katalog sepatu asli |
