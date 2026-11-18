import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="#hero" className="inline-block">
              <div className="bg-white px-3 py-1.5 rounded-xl inline-block">
                <div className="relative w-36 h-9">
                  <Image
                    src={siteConfig.logo.path}
                    alt={siteConfig.logo.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Garansi 100% Produk Original & Bebas Retur</span>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Kategori Sepatu
            </h4>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.categories.slice(1).map((cat) => (
                <li key={cat}>
                  <a
                    href="#katalog"
                    className="text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Store (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Hubungi Kami
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{siteConfig.contact.phoneDisplay}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>

            {/* Socials */}
            <div className="pt-2 flex items-center gap-3">
              {/* Instagram */}
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-orange-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram Myers"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp Myers"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              {/* YouTube */}
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube Myers"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 {siteConfig.legalName}. Hak cipta
            dilindungi undang-undang.
          </div>

          <a
            href="#hero"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-orange-400 font-semibold transition-colors"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
