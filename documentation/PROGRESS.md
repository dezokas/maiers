# Progres Proyek - Myers

Terakhir diperbarui: 18 November 2026  
Posisi saat ini: **Step 4 - Deploy & Maintenance (Siap Deploy)**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Hero (Headline kuat, price tag diskon, rating, stats, CTA & foto produk nyata)
  - [x] About (Kisah brand, foto proses craftmanship, 4 pilar keunggulan)
  - [x] Services (4 standar layanan: konsultasi ukuran, garansi tukar, pengiriman cepat, panduan perawatan)
  - [x] Katalog (Filter kategori, pencarian produk, kartu foto sepatu asli, modal pilihan ukuran EU, & cart drawer)
  - [x] Testimonials & FAQ (Ulasan terpercaya & accordion tanya-jawab lengkap)
  - [x] Contact + Google Maps (Form kontak interaktif, info store lengkap, & Google Maps embed)
  - [x] Responsif & aksesibilitas dicek
  - [x] Dikonfirmasi pengguna (Foto produk asli menggantikan SVG)
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script ([code.gs](file:///C:/Users/Asus/Documents/Personal%20Projects/test2/code.gs), [setup.gs](file:///C:/Users/Asus/Documents/Personal%20Projects/test2/setup.gs)) + fungsi inisiasi tabel `initTables()` idempoten
  - [x] Login & register lengkap dengan validasi dan penanganan error
  - [x] Role admin & user dengan cookie HttpOnly JWT dan proteksi middleware di server
  - [x] Dashboard: manajemen user, manajemen role, manajemen produk (katalog), dan ganti password admin
  - [x] Upload media lokal di `public/uploads/` via modul terpusat `src/lib/storage.ts`
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan & QRIS
  - [x] Form pemesanan lengkap: produk, ukuran EU, jumlah, nama penerima, nomor WhatsApp, alamat pengiriman, dan catatan
  - [x] Halaman pembayaran (`/pembayaran/[id]`) dengan ringkasan pesanan, total tagihan, gambar barcode QRIS, dan instruksi bayar
  - [x] Tiket pesanan tercatat dengan status awal `menunggu_konfirmasi` (skema tabel `Orders` ditambahkan di `setup.gs`)
  - [x] Menu navigasi **"Pesanan Anda"** di navbar & mobile drawer (diproteksi di sisi server, hanya dapat diakses saat login)
  - [x] Dashboard admin: menu **"Pesanan Masuk"** untuk melihat daftar tiket, tombol **Konfirmasi Pembayaran**, tombol **Tolak/Batalkan** (dengan alasan), serta tombol pintas **Hubungi via WhatsApp** (`wa.me`)
  - [x] Pesan konfirmasi saat admin mengonfirmasi: *"Selamat, pembayaran Anda telah dikonfirmasi! Silakan tunggu informasi selanjutnya dari admin melalui email/WhatsApp."*
  - [x] Catatan keamanan teruji: isolasi data antar pengguna di server, validasi form di server, dan hanya admin yang berhak mengubah status
  - [x] Dikonfirmasi pengguna
- [x] STEP 4 - Deploy & maintenance
  - [x] Verifikasi build produksi (`npm run build`) bersih tanpa error
  - [x] Audit keamanan `.gitignore` (file rahasia `.env*`, `.data/`, `code.gs`, `setup.gs`, `/public/uploads/*` terlindungi)
  - [x] Pembuatan panduan maintenance & roadmap backlog ([documentation/MAINTENANCE.md](file:///C:/Users/Asus/Documents/Personal%20Projects/test2/documentation/MAINTENANCE.md))
  - [x] Penyusunan panduan deployment Vercel langkah-demi-langkah ramah awam
  - [ ] Dikonfirmasi pengguna (Gerbang Konfirmasi Akhir)

## Catatan & Keputusan
- Gambar QRIS sementara menggunakan aset online di `public/images/qris-dummy.png`.
- Skema tabel `Orders` telah ditambahkan ke fungsi `initTables()` di [setup.gs](file:///C:/Users/Asus/Documents/Personal%20Projects/test2/setup.gs):
  `id`, `user_id`, `user_name`, `product_id`, `product_title`, `product_thumbnail`, `size`, `quantity`, `unit_price`, `total_price`, `recipient_name`, `recipient_phone`, `shipping_address`, `notes`, `status`, `rejection_reason`, `created_at`, `updated_at`.
- Seluruh alur end-to-end teruji sukses: pembuatan tiket pesanan, isolasi data pembeli di server, verifikasi pembayaran oleh admin, serta update status real-time di halaman pembeli.

## Cara Menjalankan
1. Pastikan server dev berjalan:
   ```bash
   npm run dev
   ```
2. Buka di peramban:
   - Beranda: `http://localhost:3000`
   - Pilih sepatu dan klik **Pesan Sekarang (QRIS)**
   - Isi form alamat pengiriman
   - Halaman Pembayaran QRIS: `http://localhost:3000/pembayaran/[id]`
   - Halaman Pesanan Anda: `http://localhost:3000/pesanan`
   - Dashboard Admin: `http://localhost:3000/dashboard` (Tab Pesanan Masuk)
