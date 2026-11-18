"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface ContactProps {
  onShowToast?: (message: string) => void;
}

export default function Contact({ onShowToast }: ContactProps) {
  const { contact } = siteConfig;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "Pemesanan Sepatu",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onShowToast) {
        onShowToast(
          `Terima kasih ${formData.name}, pesan Anda telah kami terima!`
        );
      }
    }, 600);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#FAFAFA] border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            KONTAK & LOKASI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kunjungi Store Kami atau Hubungi Kami
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Kami siap melayani kebutuhan konsultasi ukuran, pesanan khusus, dan
            informasi ketersediaan stok produk favorit Anda.
          </p>
        </div>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Info Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                Informasi Store & Kantor
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Alamat Toko
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-relaxed">
                    {contact.address}
                  </p>
                  <a
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 mt-1"
                  >
                    <span>Buka Petunjuk Arah di Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone / WA */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Telepon & WhatsApp
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {contact.phoneDisplay}
                  </p>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1"
                  >
                    <span>Chat WhatsApp Cepat</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Email Customer Care
                  </h4>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm font-semibold text-slate-800 hover:text-orange-600 mt-0.5 block"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Jam Operasional
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {contact.openingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Kirim Pesan / Pertanyaan
              </h3>
              <p className="text-sm text-slate-600 mb-8">
                Isi formulir di bawah ini, tim customer relation Myers akan
                merespons dalam waktu maksimal 1x24 jam kerja.
              </p>

              {isSubmitted ? (
                <div className="p-8 text-center bg-orange-50/50 rounded-2xl border border-orange-200 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Pesan Berhasil Terkirim!
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Terima kasih telah menghubungi Myers. Tim kami akan segera
                    menghubungi Anda melalui WhatsApp/Email yang tertera.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        category: "Pemesanan Sepatu",
                        message: "",
                      });
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Kirim Pesan Lainnya
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-name"
                        className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                      >
                        Nama Lengkap <span className="text-orange-600">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Contoh: Budi Pratama"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-phone"
                        className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                      >
                        Nomor WhatsApp <span className="text-orange-600">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        placeholder="Contoh: 08123456789"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                      >
                        Alamat Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-cat"
                        className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                      >
                        Kategori Keperluan
                      </label>
                      <select
                        id="contact-cat"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      >
                        <option value="Pemesanan Sepatu">Pemesanan Sepatu</option>
                        <option value="Konsultasi Ukuran">Konsultasi Ukuran</option>
                        <option value="Klaim Garansi / Retur">Klaim Garansi / Retur</option>
                        <option value="Kerjasama Bisnis & B2B">Kerjasama Bisnis & B2B</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-msg"
                      className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Pesan Anda <span className="text-orange-600">*</span>
                    </label>
                    <textarea
                      id="contact-msg"
                      rows={4}
                      required
                      placeholder="Tuliskan pertanyaan atau detail pesanan yang ingin Anda tanyakan..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin mr-2">⟳</span>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? "Mengirim Pesan..." : "Kirimkan Pesan"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps Embed Container */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span>Peta Lokasi Store Myers</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Grand Indonesia Mall, Menteng, Jakarta Pusat
              </p>
            </div>
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
            >
              <span>Buka di Google Maps Lengkap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
            <iframe
              src={contact.mapsEmbedUrl}
              title="Google Maps Lokasi Toko Myers Grand Indonesia"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
