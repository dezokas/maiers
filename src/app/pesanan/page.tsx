"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

interface OrderTicket {
  id: string;
  product_title: string;
  product_thumbnail: string;
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  recipient_name: string;
  shipping_address: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
}

export default function PesananPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login?redirect=/pesanan");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          setOrders(data.data || []);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [router]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-orange-600" />
              <span>Pesanan Anda</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Pantau status tiket pesanan, instruksi pembayaran QRIS, dan konfirmasi pengiriman sepatu Anda.
            </p>
          </div>

          <Link
            href="/#katalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors self-start sm:self-auto"
          >
            <span>Pesan Sepatu Lainnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Orders List Container */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-9 h-9 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-600">
              Memuat riwayat pesanan Anda...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Belum Ada Tiket Pesanan
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Anda belum memiliki pesanan aktif. Pilih sepatu impian Anda dari katalog dan lakukan pemesanan secara mudah!
            </p>
            <Link
              href="/#katalog"
              className="inline-block px-6 py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Lihat Koleksi Sepatu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => {
              const isWaiting = ord.status === "menunggu_konfirmasi";
              const isConfirmed = ord.status === "dikonfirmasi";
              const isCancelled = ord.status === "dibatalkan";

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8 hover:shadow-md transition-shadow"
                >
                  {/* Top Ticket Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        Nomor Tiket Pesanan:
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        {ord.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                        {formatDate(ord.created_at)}
                      </span>

                      {/* Status Badges */}
                      {isWaiting && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Konfirmasi</span>
                        </span>
                      )}

                      {isConfirmed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Dikonfirmasi</span>
                        </span>
                      )}

                      {isCancelled && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Dibatalkan</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Confirmed Greeting Banner (Section 3.3 Rule 6) */}
                  {isConfirmed && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-emerald-900 font-medium leading-relaxed">
                        <strong>Selamat, pembayaran Anda telah dikonfirmasi!</strong> Silakan
                        tunggu informasi selanjutnya dari admin melalui email/WhatsApp.
                      </div>
                    </div>
                  )}

                  {/* Cancellation Reason */}
                  {isCancelled && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-red-900 leading-relaxed">
                        <strong>Pesanan ini dibatalkan oleh admin.</strong>
                        {ord.rejection_reason && (
                          <div className="mt-1 text-slate-700 italic">
                            Alasan: &ldquo;{ord.rejection_reason}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Product & Pricing Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-8 flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <Image
                          src={ord.product_thumbnail || "/images/hero-shoe.jpg"}
                          alt={ord.product_title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-base">
                          {ord.product_title}
                        </h3>
                        <div className="text-xs text-slate-600 font-medium">
                          Ukuran: <span className="font-bold text-slate-900">EU {ord.size}</span> | Jumlah:{" "}
                          <span className="font-bold text-slate-900">{ord.quantity} pasang</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Penerima: <span className="font-semibold text-slate-700">{ord.recipient_name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-4 sm:text-right space-y-1">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Total Pembayaran
                      </div>
                      <div className="text-xl font-black text-slate-900">
                        {formatRupiah(ord.total_price)}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Tujuan Pengiriman: {ord.shipping_address}
                    </span>

                    <div className="flex items-center gap-2">
                      {isWaiting && (
                        <Link
                          href={`/pembayaran/${ord.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Buka QRIS Pembayaran</span>
                        </Link>
                      )}

                      <a
                        href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                          `Halo Myers, saya ingin menanyakan status pesanan saya dengan nomor tiket ${ord.id}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chat Admin</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
