"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/config/site";
import { X, ArrowRight, ShieldCheck, MapPin, Phone, User, FileText } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  size: number;
  quantity?: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  product,
  size,
  quantity = 1,
}: CheckoutModalProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setCurrentUser(data.user);
          setRecipientName(data.user.name || "");
        } else {
          // Jika belum login saat mencoba memesan, arahkan ke login
          router.push(`/login?redirect=/#katalog`);
        }
      })
      .catch(() => {});
  }, [isOpen, router]);

  if (!isOpen) return null;

  const totalPrice = product.price * quantity;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        product_id: product.id,
        product_title: product.name,
        product_thumbnail: product.image,
        size: String(size),
        quantity,
        unit_price: product.price,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        shipping_address: shippingAddress,
        notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal membuat tiket pesanan.");
        setIsSubmitting(false);
        return;
      }

      onClose();
      // Langsung arahkan ke halaman pembayaran QRIS dengan ringkasan pesanan!
      router.push(`/pembayaran/${data.orderId}`);
    } catch {
      setErrorMessage("Koneksi gagal. Silakan coba kembali.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 my-8 animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              Form Pemesanan Tiket Sepatu
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              Informasi Pengiriman
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Quick Recap */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {product.name}
            </h4>
            <div className="text-xs text-slate-600 mt-0.5">
              Ukuran: <strong className="text-slate-900">EU {size}</strong> | Jumlah:{" "}
              <strong className="text-slate-900">{quantity} pasang</strong>
            </div>
            <div className="text-xs font-black text-orange-600 mt-1">
              Total: {formatRupiah(totalPrice)}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap Penerima <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nomor WhatsApp Penerima <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="08123456789"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Lengkap Pengiriman <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={3}
                required
                placeholder="Nama jalan, nomor rumah/kantor, RT/RW, Kelurahan, Kecamatan, Kota & Kode Pos..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Khusus (Opsional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={2}
                placeholder="Contoh: Titipkan di pos satpam jika tidak ada orang di rumah..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Garansi resmi 7 hari penukaran ukuran jika sepatu kurang pas.</span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>{isSubmitting ? "Memproses..." : "Lanjut ke Pembayaran QRIS"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
