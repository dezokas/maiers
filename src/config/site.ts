export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  features: string[];
  sizes: number[];
  inStock: boolean;
  isFeatured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface BrandValue {
  title: string;
  description: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  shoePurchased: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const siteConfig = {
  name: "Myers",
  legalName: "PT Myers Kreasi Indonesia",
  tagline: "Langkah Pasti, Gaya Sejati",
  subTagline: "Sepatu Kontemporer Berkualitas Tinggi dengan Kenyamanan Ergonomis Tanpa Kompromi",
  field: "Footwear Retail & Lifestyle Brand",
  description:
    "Myers menghadirkan koleksi sepatu pria dan wanita dengan perpaduan material premium, bantalan ergonomis mutakhir, dan desain minimalis elegan untuk mendukung setiap dinamika aktivitas harian Anda.",
  
  logo: {
    path: "/images/logo.svg",
    iconPath: "/images/logo-icon.svg",
    alt: "Myers Footwear Logo",
  },

  contact: {
    phone: "+62 812-3456-7890",
    phoneDisplay: "+62 812 3456 7890",
    whatsappUrl: "https://wa.me/6281234567890?text=Halo%20Myers%2C%20saya%20ingin%20bertanya%20tentang%20koleksi%20sepatu",
    email: "hello@myersfootwear.com",
    address: "Grand Indonesia Mall, East Mall Lt. 2, Jl. M.H. Thamrin No. 1, Jakarta Pusat, DKI Jakarta 10310",
    openingHours: "Setiap Hari: 10.00 - 22.00 WIB",
    mapsUrl: "https://maps.google.com/?q=Grand+Indonesia+Jakarta",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1947413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f421f2d65691%3A0x6b77241ff8e9b674!2sGrand%20Indonesia!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  },

  socials: {
    instagram: "https://instagram.com/myersfootwear",
    tiktok: "https://tiktok.com/@myersfootwear",
    youtube: "https://youtube.com/@myersfootwear",
  },

  navigation: [
    { label: "Home", href: "#hero" },
    { label: "Tentang Kami", href: "#about" },
    { label: "Layanan & Nilai", href: "#services" },
    { label: "Koleksi Sepatu", href: "#katalog" },
    { label: "Ulasan", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Kontak & Lokasi", href: "#contact" },
  ],

  hero: {
    badge: "KOLEKSI TERBARU 2026",
    title: "Melangkah Bebas dengan Myers Aero Pulse",
    subtitle:
      "Didesain dengan bantalan CloudStride™ anti-pegal dan bahan breathable mesh premium. Ringan untuk olahraga pagi, berkarakter untuk gaya urban sore hari.",
    price: 899000,
    originalPrice: 1199000,
    ctaOrder: "Pesan Sekarang",
    ctaExplore: "Lihat Seluruh Koleksi",
    featuredShoeImage: "/images/hero-shoe.jpg",
    stats: [
      { label: "Pasang Terjual", value: "25.000+" },
      { label: "Rating Kepuasan", value: "4.9 / 5.0" },
      { label: "Garansi Tukar Ukuran", value: "7 Hari" },
    ],
  },

  about: {
    title: "Mengapa Memilih Myers?",
    subtitle: "Dibuat dengan dedikasi tinggi antara estetika kontemporer dan kenyamanan ergonomis.",
    story:
      "Myers lahir dari kegelisahan terhadap sepatu yang seringkali harus memilih antara tampak stylish atau nyaman dipakai seharian. Di Myers Footwear, kami menolak kompromi tersebut. Setiap siluet dirancang melalui riset telapak kaki aktif, mengombinasikan material kulit terkurasi, sol berdaya cengkeram optimal, serta insole memory-foam yang meredam tekanan di setiap langkah.",
    craftImage: "/images/about-craft.jpg",
    values: [
      {
        title: "Material Kulit & Mesh Terpilih",
        description: "Hanya menggunakan material bersertifikasi yang tahan abrasi, fleksibel, dan memiliki sirkulasi udara optimal.",
        iconName: "ShieldCheck",
      },
      {
        title: "Bantalan CloudStride™ Ergonomis",
        description: "Insole busa memori dengan arch-support anatomis yang meredam tekanan sendi hingga 45%.",
        iconName: "Sparkles",
      },
      {
        title: "Desain Serbaguna & Timeless",
        description: "Gaya minimalis modern yang pantas untuk ruang rapat formal maupun hangout santai akhir pekan.",
        iconName: "Compass",
      },
      {
        title: "Jaminan Kualitas 100%",
        description: "Setiap pasang sepatu melewati uji inspeksi jahitan dan pengeleman standar industri ketat.",
        iconName: "Award",
      },
    ] as BrandValue[],
  },

  services: [
    {
      id: "sizing",
      title: "Konsultasi Ukuran Gratis",
      description: "Bingung memilih ukuran? Tim personal assistant Myers siap memandu pengukuran kaki Anda secara akurat melalui chat.",
      iconName: "Ruler",
    },
    {
      id: "exchange",
      title: "7 Hari Bebas Tukar Ukuran",
      description: "Jika ukuran yang sampai kurang pas atau sempit, Anda berhak menukar ukuran secara mudah tanpa biaya repot.",
      iconName: "RefreshCw",
    },
    {
      id: "shipping",
      title: "Pengiriman Cepat & Berasuransi",
      description: "Didukung ekspedisi terpercaya ke seluruh Indonesia dengan proteksi asuransi pengiriman penuh sampai ke pintu rumah Anda.",
      iconName: "Truck",
    },
    {
      id: "care",
      title: "Garansi & Panduan Perawatan",
      description: "Setiap paket disertai kartu garansi keaslian serta panduan perawatan material agar sepatu Anda awet bertahun-tahun.",
      iconName: "HeartHandshake",
    },
  ] as ServiceItem[],

  categories: ["Semua", "Running & Sport", "Casual & Streetwear", "Formal & Leather", "Daily Comfort", "Outdoor & Trail"],

  catalog: [
    {
      id: "prod-1",
      name: "Myers Aero Pulse Runner",
      slug: "myers-aero-pulse-runner",
      category: "Running & Sport",
      price: 899000,
      originalPrice: 1199000,
      discountBadge: "Hemat 25%",
      rating: 4.9,
      reviewCount: 1240,
      image: "/images/shoe-1.jpg",
      description: "Sepatu lari dan aktivitas harian dengan bantalan busa ganda responsif dan sirkulasi udara maksimal.",
      features: ["Breathable Tech Mesh", "CloudStride Cushioning", "High-Abrasion Rubber Outsole"],
      sizes: [39, 40, 41, 42, 43, 44],
      inStock: true,
      isFeatured: true,
    },
    {
      id: "prod-2",
      name: "Myers Urban Oxford Leather",
      slug: "myers-urban-oxford-leather",
      category: "Formal & Leather",
      price: 1299000,
      originalPrice: 1599000,
      discountBadge: "Hemat 19%",
      rating: 5.0,
      reviewCount: 852,
      image: "/images/shoe-2.jpg",
      description: "Sepatu formal pria berbahan kulit sapi asli dengan aksen brogue halus dan insole empuk tanpa bikin pegal.",
      features: ["Genuine Full-Grain Leather", "Cushioned Ortho Insole", "Anti-Slip Rubber Heel"],
      sizes: [40, 41, 42, 43, 44],
      inStock: true,
      isFeatured: true,
    },
    {
      id: "prod-3",
      name: "Myers High Street Court",
      slug: "myers-high-street-court",
      category: "Casual & Streetwear",
      price: 799000,
      originalPrice: 999000,
      discountBadge: "Hemat 20%",
      rating: 4.8,
      reviewCount: 2410,
      image: "/images/shoe-3.jpg",
      description: "Siluet retro court sneaker klasik dengan kombinasi panel putih bersih dan aksen hijau botol yang trendy.",
      features: ["Clean Synthetic Leather", "Reinforced Cupsole", "Vintage Padded Collar"],
      sizes: [38, 39, 40, 41, 42, 43, 44],
      inStock: true,
      isFeatured: true,
    },
    {
      id: "prod-4",
      name: "Myers Glide Slip-On",
      slug: "myers-glide-slip-on",
      category: "Daily Comfort",
      price: 649000,
      originalPrice: 799000,
      discountBadge: "Hemat 18%",
      rating: 4.9,
      reviewCount: 3120,
      image: "/images/shoe-4.jpg",
      description: "Sepatu slip-on rajut fleksibel tanpa tali. Praktis digunakan dalam 2 detik, sangat ringan serasa tanpa alas kaki.",
      features: ["Seamless Stretch Knit", "Ultra-Lightweight EVA", "Easy-On Heel Tab"],
      sizes: [37, 38, 39, 40, 41, 42, 43],
      inStock: true,
      isFeatured: false,
    },
    {
      id: "prod-5",
      name: "Myers Trail Explorer Max",
      slug: "myers-trail-explorer-max",
      category: "Outdoor & Trail",
      price: 1099000,
      originalPrice: 1399000,
      discountBadge: "Hemat 21%",
      rating: 4.9,
      reviewCount: 624,
      image: "/images/shoe-5.jpg",
      description: "Sepatu outdoor tangguh dengan sol bergigi tajam untuk medan basah, bebatuan, maupun pendakian ringan.",
      features: ["Water-Resistant Coating", "Deep-Lug Grip System", "Reinforced Toe Guard"],
      sizes: [40, 41, 42, 43, 44, 45],
      inStock: true,
      isFeatured: false,
    },
    {
      id: "prod-6",
      name: "Myers Minimalist Suede Loafer",
      slug: "myers-minimalist-suede-loafer",
      category: "Formal & Leather",
      price: 1149000,
      originalPrice: 1450000,
      discountBadge: "Hemat 20%",
      rating: 4.8,
      reviewCount: 940,
      image: "/images/shoe-6.jpg",
      description: "Loafer kasual elegan dengan bahan suede premium warna deep navy. Sempurna untuk paduan celana chinos maupun linen.",
      features: ["Italian Treated Suede", "Handcrafted Moccasin Stitch", "Flexible Driving Sole"],
      sizes: [39, 40, 41, 42, 43],
      inStock: true,
      isFeatured: false,
    },
  ] as Product[],

  testimonials: [
    {
      id: "test-1",
      name: "Bagas Pratama",
      role: "Software Engineer & Runner",
      content:
        "Sebagai orang yang banyak jalan dan sering lari pagi, Myers Aero Pulse luar biasa nyaman. Insole-nya empuk dan gak bikin tumit sakit meskipun dipakai seharian di kantor lalu lanjut jalan santai.",
      shoePurchased: "Myers Aero Pulse Runner",
      rating: 5,
    },
    {
      id: "test-2",
      name: "Dian Sastrowardoyo",
      role: "Creative Director",
      content:
        "Finishing kulit Myers Oxford rapi banget, detail jahitan presisi, dan yang paling penting gak bikin lecet di pemakaian pertama. Brand lokal tapi standarnya sudah seperti brand boutique luar.",
      shoePurchased: "Myers Urban Oxford Leather",
      rating: 5,
    },
    {
      id: "test-3",
      name: "Reza Rahardian",
      role: "Architect & Urban Walker",
      content:
        "Saya beli Myers High Street Court. Pas dipadukan dengan celana ankle atau jeans. Ukuran pas sesuai panduan size chart di website, pengiriman cuma 1 hari ke Jaksel.",
      shoePurchased: "Myers High Street Court",
      rating: 5,
    },
  ] as Testimonial[],

  faqs: [
    {
      question: "Bagaimana cara menentukan ukuran sepatu yang tepat?",
      answer:
        "Kami menggunakan standar ukuran EU (37 - 45). Anda dapat mengukur panjang telapak kaki dari ujung tumit hingga jempol terpanjang dalam satuan centimeter (cm), lalu cocokkan dengan panduan ukuran kami atau hubungi tim konsultan ukuran kami via WhatsApp.",
    },
    {
      question: "Apakah bisa menukar sepatu jika ukuran yang datang tidak pas?",
      answer:
        "Tentu saja! Kami memberikan jaminan 7 hari garansi tukar ukuran bebas ribet sejak barang diterima, dengan catatan kondisi sepatu masih bersih, belum digunakan di luar ruangan, dan tag serta kotak asli masih lengkap.",
    },
    {
      question: "Apakah material kulit yang digunakan asli?",
      answer:
        "Ya, untuk lini formal dan leather (seperti Myers Urban Oxford), kami menggunakan 100% full-grain leather asli pilihan yang awet dan semakin berkarakter seiring waktu.",
    },
    {
      question: "Berapa lama estimasi pengiriman pesanan?",
      answer:
        "Untuk area Jabodetabek berkisar 1 - 2 hari kerja. Untuk kota-kota lain di pulau Jawa sekitar 2 - 3 hari, dan luar Jawa sekitar 3 - 5 hari kerja dengan layanan kurir berasuransi.",
    },
  ] as FAQItem[],
};
