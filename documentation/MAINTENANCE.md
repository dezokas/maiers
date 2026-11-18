# Panduan Maintenance & Roadmap - Myers

Dokumen ini mencatat riwayat pemeliharaan, daftar bug yang diketahui, serta roadmap/backlog pengembangan fitur website **Myers**.

---

## 1. Riwayat Perubahan (Changelog)

### v1.0.0 (18 November 2026) - Rilis Awal Kesiapan Produksi
- **Landing Page**:
  - Hero Section dengan CTA dinamis, badge promo diskon 30%, rating ulasan, dan foto produk sepatu nyata.
  - About Section mengulas visi craftsmanship Myers dan 4 pilar keunggulan (Bahan Kulit & Knit Pilihan, Desain Ergonomis, Jahitan Handcrafted, Garansi Kepuasan).
  - Services Section menghadirkan 4 standar layanan pelanggan.
  - Katalog Produk interaktif lengkap dengan filter kategori, fitur pencarian instan, pemilihan ukuran EU, serta drawer keranjang belanja.
  - Testimoni pelanggan terverifikasi dan FAQ accordion interaktif.
  - Bagian Kontak terintegrasi dengan Google Maps resmi Myers Flagship Store Jakarta dan formulir pesan langsung.
- **Backend & Database**:
  - Integrasi Google Spreadsheet melalui Google Apps Script Web App (`code.gs`, `setup.gs`).
  - Skema tabel idempoten: `Roles`, `Users`, `Catalog`, dan `Orders`.
  - Fallback sinkronisasi lokal terisolasi untuk stabilitas pengujian offline.
- **Autentikasi & Otorisasi**:
  - Sistem autentikasi berbasis JSON Web Token (JWT) yang disimpan dalam cookie HttpOnly.
  - Hashing kata sandi menggunakan Bcrypt.
  - Proteksi rute berbasis peran (Role-Based Access Control) via Next.js Middleware.
- **Sistem Pemesanan & Pembayaran QRIS**:
  - Modal checkout ringkas dari katalog dan drawer keranjang.
  - Halaman detail pembayaran dinamis (`/pembayaran/[id]`) dengan display QRIS dan petunjuk pembayaran.
  - Halaman pelacakan pesanan pembeli (`/pesanan`) dengan status pesanan real-time.
  - Dashboard Admin: Tab "Pesanan Masuk" dengan aksi verifikasi konfirmasi, penolakan (dengan alasan), serta tombol cepat hubungi pembeli via WhatsApp (`wa.me`).

---

## 2. Bug & Batasan yang Diketahui (Known Issues / Limitations)

| ID | Deskripsi Masalah | Dampak | Rekomendasi Solusi |
|---|---|---|---|
| BUG-01 | File upload media admin saat ini disimpan di disk lokal server (`public/uploads/`). Pada serverless Vercel, filesystem bersifat *read-only* atau *ephemeral* (reset saat cold start/deploy baru). | Upload produk baru melalui admin dashboard di production Vercel tidak persisten jangka panjang. | Migrasikan `src/lib/storage.ts` ke cloud object storage (misal: Vercel Blob, Cloudinary, atau Supabase Storage). |
| BUG-02 | Verifikasi pembayaran QRIS masih bersifat manual (admin memeriksa mutasi rekening lalu klik tombol "Konfirmasi"). | Admin harus manual mengecek transfer masuk sebelum mengubah status pesanan. | Integrasikan Payment Gateway otomatis (Midtrans / Xendit / Tripay) dengan webhook notifikasi real-time jika volume transaksi sudah tinggi. |
| BUG-03 | Google Apps Script gratis memiliki kuota harian eksekusi (kuota Google Workspace/Consumer). | Jika pengunjung website mencapai puluhan ribu request per hari, Apps Script dapat mengalami rate limit. | Upgrade ke Google Workspace berbayar atau migrasi ke database serverless seperti Supabase (PostgreSQL) / Neon jika skala usaha membesar. |

---

## 3. Backlog Fitur & Roadmap Pengembangan

### Prioritas Tinggi (Tahap 1 Post-Launch)
- [ ] **Cloud Storage untuk Upload Gambar**:
  - Mengganti penyimpanan disk lokal dengan Vercel Blob atau Cloudinary.
  - Menjaga modul `src/lib/storage.ts` tetap seragam sehingga frontend tidak perlu diubah.
- [ ] **Ganti Kredensial Default Admin**:
  - Mengubah email `admin@gmail.com` dan password default `123456` sebelum rilis ke publik.

### Prioritas Menengah (Tahap 2)
- [ ] **Notifikasi Otomatis WhatsApp / Email**:
  - Kirim pesan konfirmasi otomatis ke WhatsApp pembeli saat pesanan dibuat (via WhatsApp Business API / Fonnte / Wablas).
  - Kirim email resi pengiriman otomatis menggunakan Resend atau Nodemailer.
- [ ] **Input Nomor Resi Ekspedisi**:
  - Menambahkan kolom `tracking_number` dan `courier_name` pada tabel `Orders`.
  - Memberikan tautan cek resi otomatis untuk pembeli.

### Prioritas Lanjutan (Tahap 3)
- [ ] **Payment Gateway Otomatis (Midtrans / Xendit)**:
  - Generate QRIS dinamis dengan verifikasi otomatis detik itu juga tanpa perlu upload bukti/konfirmasi manual admin.
  - Dukungan pembayaran Virtual Account Bank (BCA, Mandiri, BRI, BNI) dan E-Wallet (GoPay, OVO, ShopeePay).
- [ ] **Fitur Ulasan & Rating oleh Pembeli**:
  - Pembeli yang telah menyelesaikan pesanan dapat memberikan ulasan bintang dan foto pemakaian sepatu.

---

## 4. Panduan Pemeliharaan Rutin

1. **Pemeriksaan Dependensi Rutin**:
   ```bash
   npm outdated
   npm audit
   ```
2. **Backup Data**:
   - Google Spreadsheet secara otomatis memiliki fitur version history bawaan Google Drive (**File > Version History**).
   - Dianjurkan untuk mendownload salinan berkala (.xlsx atau .csv) dari spreadsheet utama setiap akhir bulan.
3. **Pembaruan Apps Script**:
   - Setiap kali melakukan perubahan logika di `code.gs` atau `setup.gs`, pastikan untuk membuat **New Version** pada menu **Deploy > Manage Deployments** di Google Apps Script.
