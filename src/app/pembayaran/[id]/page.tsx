"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  QrCode,
  CheckCircle2,
  Clock,
  ArrowLeft,
  MessageCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

interface OrderDetail {
  id: string;
  product_title: string;
  product_thumbnail: string;
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  notes?: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
}

function PembayaranContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (res.status === 401) {
          router.push(`/login?redirect=/pembayaran/${orderId}`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success && data.data) {
          setOrder(data.data as OrderDetail);
        } else {
          setError(data.error || "Pesanan tidak ditemukan.");
        }
      })
      .catch(() => setError("Gagal memuat detail pesanan."))
      .finally(() => setIsLoading(false));
  }, [orderId, router]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            Menyiapkan instruksi pembayaran QRIS...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Pesanan Tidak Ditemukan</h2>
          <p className="text-sm text-slate-600">{error || "Data tiket pesanan tidak tersedia."}</p>
          <Link
            href="/pesanan"
            className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Buka Halaman Pesanan Anda
          </Link>
        </div>
      </div>
    );
  }

  const waConfirmUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
    `Halo Myers, saya sudah melakukan pembayaran via QRIS untuk Tiket Pesanan *${order.id}* sebesar *${formatRupiah(
      order.total_price
    )}*. Mohon bantuannya untuk dicek dan dikonfirmasi. Terima kasih!`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/pesanan"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ke Halaman Pesanan Anda</span>
          </Link>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Status:{" "}
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] ${
                order.status === "dikonfirmasi"
                  ? "bg-emerald-100 text-emerald-800"
                  : order.status === "dibatalkan"
                  ? "bg-red-100 text-red-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.status === "menunggu_konfirmasi"
                ? "Menunggu Konfirmasi"
                : order.status}
            </span>
          </div>
        </div>

        {/* Confirmation Banner if Already Confirmed */}
        {order.status === "dikonfirmasi" && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-emerald-950">
                Pembayaran Anda Telah Dikonfirmasi!
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Selamat, pembayaran Anda telah dikonfirmasi! Silakan tunggu
                informasi selanjutnya dari admin melalui email/WhatsApp. Sepatu
                Anda sedang disiapkan untuk pengiriman.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* QRIS Card (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                <QrCode className="w-3.5 h-3.5" />
                <span>QRIS Standard Nasional</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Scan QRIS untuk Membayar
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Merchant: <span className="font-bold text-slate-800">MYERS FOOTWEAR CO.</span>
              </p>
            </div>

            {/* QRIS Visual Container */}
            <div className="p-5 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-3">
              <div className="relative w-64 h-64 mx-auto bg-slate-50 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                <Image
                  src="/images/qris-dummy.png"
                  alt="QRIS Barcode Pembayaran Myers"
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="pt-2 text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mendukung Semua Bank & Dompet Digital</span>
              </div>
              <p className="text-[11px] text-slate-400">
                BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, DANA, LinkAja
              </p>
            </div>

            {/* Amount to pay */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                  Total Tagihan:
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {formatRupiah(order.total_price)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(String(order.total_price))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Tersalin!" : "Salin Nominal"}</span>
              </button>
            </div>

            {/* WhatsApp confirmation action */}
            <div className="space-y-2">
              <a
                href={waConfirmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi Bukti Transfer via WhatsApp</span>
              </a>
              <p className="text-[11px] text-center text-slate-400">
                Kirim screenshot bukti pembayaran agar admin dapat memverifikasi lebih cepat.
              </p>
            </div>
          </div>

          {/* Order Summary & Instructions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Order Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Ringkasan Tiket Pesanan
                </h3>
                <span className="font-mono text-xs font-bold text-orange-600">
                  {order.id}
                </span>
              </div>

              {/* Shoe item */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                  <Image
                    src={order.product_thumbnail || "/images/hero-shoe.jpg"}
                    alt={order.product_title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {order.product_title}
                  </h4>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Ukuran: <span className="font-bold text-slate-800">EU {order.size}</span> | Jumlah:{" "}
                    <span className="font-bold text-slate-800">{order.quantity} pasang</span>
                  </div>
                  <div className="text-xs font-bold text-orange-600 mt-1">
                    {formatRupiah(order.unit_price)} / pasang
                  </div>
                </div>
              </div>

              {/* Delivery recipient details */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Penerima:</span>
                  <span className="font-semibold text-slate-800">{order.recipient_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor WhatsApp:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {order.recipient_phone}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500">Alamat Pengiriman:</span>
                  <span className="font-semibold text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 mt-1">
                    {order.shipping_address}
                  </span>
                </div>
                {order.notes && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-500">Catatan Khusus:</span>
                    <span className="font-medium text-slate-700 italic">
                      &ldquo;{order.notes}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-step instructions */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Petunjuk Cara Pembayaran</span>
              </h3>

              <ol className="space-y-3 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
                <li>
                  Buka aplikasi mobile banking (BCA, Mandiri Livin, BRImo, dll) atau dompet digital (GoPay, OVO, ShopeePay, DANA).
                </li>
                <li>Pilih menu **QRIS** atau **Pindai / Scan QR**.</li>
                <li>Arahkan kamera ponsel Anda ke kode QRIS di samping.</li>
                <li>
                  Pastikan nama penerima tertulis **MYERS FOOTWEAR** dan nominal tagihan tepat{" "}
                  <strong className="text-slate-900">{formatRupiah(order.total_price)}</strong>.
                </li>
                <li>Konfirmasi transaksi dan masukkan PIN Anda.</li>
                <li>
                  Setelah berhasil, klik tombol hijau **Konfirmasi Bukti Transfer** atau simpan tiket ini di menu **Pesanan Anda**.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PembayaranPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PembayaranContent />
    </Suspense>
  );
}
