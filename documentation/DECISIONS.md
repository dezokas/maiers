# Technical & Design Decisions - Myers

## 1. Arsitektur & Framework
- **Next.js 16 (App Router)**: Dipilih karena kompatibilitas penuh dan optimasi native untuk deployment di platform Vercel (Edge/Serverless functions, zero cold-start routing).
- **Tailwind CSS v4**: Utility-first CSS untuk fidelitas visual tinggi, konsistensi token desain (spacing, colors, typography), serta bobot bundle minimal.
- **Lucide React**: Library ikon berbasis SVG yang ringan, konsisten, dan mudah diakses (aria-friendly).
- **Jose & Bcryptjs**: Standard industri autentikasi token JWT bertanda tangan dan enkripsi satu arah kata sandi.

## 2. Arah Visual & Branding
- **Nama Brand**: Myers (Sepatu Pria & Wanita, Sneakers, Formal, Lifestyle).
- **Karakter**: Modern, Premium, Sleek, Energetic yet Sophisticated.
- **Warna Utama**:
  - Primary / Charcoal: Slate 900 (`#0F172A`) & Slate 800 (`#1E293B`)
  - Accent / Energizing Orange: `#F97316` (Hex 500) & `#EA580C` (Hex 600)
  - Neutral Background: `#FAFAFA` & `#FFFFFF`
  - Subtle Border: Slate 200 (`#E2E8F0`)
- **Foto Produk Asli**: Mengganti SVG awal dengan foto produk sepatu nyata beresolusi tinggi di `public/images/`.

## 3. Desain Database & Google Apps Script
- Google Spreadsheet difungsikan sebagai database relasional melalui Web App Google Apps Script.
- Seluruh panggilan API dienkapsulasi pada server Next.js (Server Action & API routes) sehingga browser tidak pernah berinteraksi langsung dengan Apps Script.
- Terdapat mekanisme local sync fallback di `src/lib/appsScript.ts` untuk memastikan dashboard dan operasi CRUD dapat diuji secara langsung di komputer lokal sebelum spreadsheet live di-deploy.
- Seluruh file Apps Script ([code.gs](file:///C:/Users/Asus/Documents/Personal%20Projects/test2/code.gs) dan [setup.gs](file:///C:/Users/Asus/Documents/Personal%20Projects/test2/setup.gs)) telah dimasukkan ke `.gitignore` untuk melindungi kode backend dan integritas repositori.

## 4. Keamanan & Kesiapan Produksi
- Variabel rahasia (`.env*`) dilindungi oleh `.gitignore`.
- Password akun admin awal tidak pernah disimpan dalam format teks polos, melainkan berupa hash Bcrypt.
- Sesi autentikasi tersimpan dalam cookie HttpOnly bertanda tangan JWT sehingga tahan terhadap serangan XSS.
- Middleware rute `/dashboard` memverifikasi peran (*role*) langsung di server Next.js sebelum merender halaman.
