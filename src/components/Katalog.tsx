"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { siteConfig, Product } from "@/config/site";
import {
  Star,
  ShoppingBag,
  Check,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

import CheckoutModal from "@/components/CheckoutModal";

interface KatalogProps {
  onAddToCart?: (product: Product, selectedSize: number) => void;
}

export default function Katalog({ onAddToCart }: KatalogProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [catalogItems, setCatalogItems] = useState<Product[]>(siteConfig.catalog);
  const [checkoutProduct, setCheckoutProduct] = useState<{ product: Product; size: number } | null>(null);

  // Ambil data produk real-time dari database API
  useEffect(() => {
    fetch("/api/catalog?status=published")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: Product[] = data.data.map((item: Record<string, unknown>, index: number) => {
            const rawSizes = String(item.sizes || "39,40,41,42,43,44");
            const parsedSizes = rawSizes
              .split(",")
              .map((s) => parseInt(s.trim()))
              .filter((n) => !isNaN(n));

            return {
              id: String(item.id || `prod-${index}`),
              name: String(item.title || "Myers Footwear"),
              slug: String(item.slug || `shoe-${index}`),
              category: String(item.category || "Casual & Streetwear"),
              price: Number(item.price) || 899000,
              originalPrice: item.original_price ? Number(item.original_price) : undefined,
              discountBadge: item.original_price ? "Promo Khusus" : undefined,
              rating: 4.9,
              reviewCount: 800 + index * 150,
              image: String(item.thumbnail_path || "/images/hero-shoe.jpg"),
              description: String(item.excerpt || item.content || "Sepatu premium berkualitas tinggi dari Myers."),
              features: ["Bantalan CloudStride™", "Material Tahan Abrasi", "Ergonomic Sole"],
              sizes: parsedSizes.length > 0 ? parsedSizes : [39, 40, 41, 42, 43],
              inStock: true,
            };
          });
          setCatalogItems(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredProducts = useMemo(() => {
    return catalogItems.filter((prod) => {
      const matchCategory =
        activeCategory === "Semua" || prod.category === activeCategory;
      const matchSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery, catalogItems]);

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || null);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedSize(null);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="katalog" className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            KATALOG RESMI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Koleksi Sepatu Pilihan Myers
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Temukan paduan siluet favorit Anda dari lini lari, kasual, formal
            kulit asli, hingga petualangan outdoor.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {siteConfig.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  type="button"
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari model sepatu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
            <Filter className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              Tidak ada produk yang cocok
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Coba gunakan kata kunci lain atau pilih kategori Semua.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Box */}
                <div
                  className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden flex items-center justify-center cursor-pointer"
                  onClick={() => handleOpenQuickView(product)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Discount Badge */}
                  {product.discountBadge && (
                    <span className="absolute top-4 left-4 bg-orange-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {product.discountBadge}
                    </span>
                  )}
                  {/* Category Pill */}
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm border border-slate-100">
                    {product.category}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Rating & Review */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">
                        {product.rating}
                      </span>
                      <span>({product.reviewCount} ulasan)</span>
                    </div>

                    <h3
                      className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors cursor-pointer"
                      onClick={() => handleOpenQuickView(product)}
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Size Chips Preview */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Ukuran Tersedia (EU):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((sz) => (
                        <span
                          key={sz}
                          className="w-7 h-7 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold flex items-center justify-center"
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">
                        {formatRupiah(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-slate-400 line-through">
                          {formatRupiah(product.originalPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenQuickView(product)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white font-bold text-xs transition-colors duration-200"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Pilih Ukuran</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">
              Butuh Model Custom atau Pembelian Jumlah Besar?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Kami melayani pengadaan sepatu perusahaan, seragam instansi, hingga
              pembuatan model kustom dengan minimal order bersahabat.
            </p>
          </div>
          <a
            href={siteConfig.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors shrink-0 flex items-center gap-2"
          >
            <span>Hubungi Tim B2B Myers</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Quick View & Size Selection Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-shoe-title"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 space-y-6 p-6 sm:p-8 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                <h3
                  id="modal-shoe-title"
                  className="text-2xl font-extrabold text-slate-900 mt-1"
                >
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Tutup Pratinjau"
              >
                ✕
              </button>
            </div>

            {/* Product Image */}
            <div className="relative aspect-4/3 w-full bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Features & Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span>Pilih Ukuran Sepatu (EU):</span>
                <span className="text-orange-600">
                  {selectedSize ? `Ukuran ${selectedSize} Dipilih` : "Belum Dipilih"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                      selectedSize === sz
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:border-orange-500 hover:bg-orange-50/50"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Action buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Total Harga:</div>
                <div className="text-2xl font-black text-slate-900">
                  {formatRupiah(selectedProduct.price)}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedSize && onAddToCart) {
                      onAddToCart(selectedProduct, selectedSize);
                      handleCloseModal();
                    }
                  }}
                  disabled={!selectedSize}
                  className="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>+ Keranjang</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedSize) {
                      setCheckoutProduct({ product: selectedProduct, size: selectedSize });
                      handleCloseModal();
                    }
                  }}
                  disabled={!selectedSize}
                  className="flex-1 sm:flex-initial px-5 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Pesan Sekarang (QRIS)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutProduct && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setCheckoutProduct(null)}
          product={checkoutProduct.product}
          size={checkoutProduct.size}
        />
      )}
    </section>
  );
}
