"use client";

import React from "react";
import Image from "next/image";
import { Product, siteConfig } from "@/config/site";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";

export interface CartItem {
  product: Product;
  size: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: number, newQty: number) => void;
  onRemoveItem: (productId: string, size: number) => void;
  onCheckoutQRIS?: (item: CartItem) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutQRIS,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    let text = `Halo Myers, saya ingin memesan produk berikut:%0A%0A`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.product.name}*%0A   - Ukuran: EU ${item.size}%0A   - Jumlah: ${item.quantity} pasang%0A   - Subtotal: ${formatRupiah(item.product.price * item.quantity)}%0A%0A`;
    });
    text += `*Total Pembayaran: ${formatRupiah(subtotal)}*%0A%0AMohon info ketersediaan dan nomor rekening/QRIS untuk pembayaran. Terima kasih!`;

    window.open(
      `https://wa.me/6281234567890?text=${text}`,
      "_blank"
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang Belanja"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Keranjang Belanja
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                {items.reduce((sum, item) => sum + item.quantity, 0)} item
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  Keranjang Masih Kosong
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Pilih sepatu favorit Anda di bagian katalog dan tentukan ukuran yang pas!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex gap-4 items-center"
                >
                  <div className="relative w-16 h-16 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h5>
                    <div className="text-xs text-orange-600 font-semibold mt-0.5">
                      Ukuran: EU {item.size}
                    </div>
                    <div className="text-xs font-bold text-slate-700 mt-1">
                      {formatRupiah(item.product.price)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.size)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors"
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">
                  Subtotal:
                </span>
                <span className="text-xl font-black text-slate-900">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              <div className="space-y-2">
                {onCheckoutQRIS && (
                  <button
                    type="button"
                    onClick={() => {
                      if (items[0]) {
                        onCheckoutQRIS(items[0]);
                        onClose();
                      }
                    }}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Bayar via QRIS Resmi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <span>Checkout via WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500">
                Pemesanan langsung terhubung ke admin resmi Myers untuk konfirmasi alamat & pembayaran.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
