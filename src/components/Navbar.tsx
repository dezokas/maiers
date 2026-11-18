"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, X, MessageCircle, ShoppingBag, User, LayoutDashboard, LogOut } from "lucide-react";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

interface UserState {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3"
          : "bg-white/80 backdrop-blur-sm py-4 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/#hero"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg p-1"
            aria-label={`${siteConfig.name} Beranda`}
          >
            <div className="relative w-36 h-9 sm:w-44 sm:h-11">
              <Image
                src={siteConfig.logo.path}
                alt={siteConfig.logo.alt}
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Navigasi Utama"
          >
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors focus:outline-none focus:text-orange-600"
              >
                {item.label}
              </a>
            ))}
            {user && (
              <Link
                href="/pesanan"
                className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-200"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pesanan Anda</span>
              </Link>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              type="button"
              className="relative p-2.5 rounded-full text-slate-700 hover:text-orange-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={`Keranjang Belanja, ada ${cartCount} item`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Dashboard / Login Status */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {user.role === "admin" && (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white text-xs font-bold rounded-full border border-orange-200 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <span className="text-xs font-semibold text-slate-600 max-w-[120px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-slate-700 hover:text-orange-600 text-xs font-bold rounded-full border border-slate-200 hover:border-orange-300 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            )}

            {/* Direct WhatsApp CTA */}
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Konsultasi WA</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="md:hidden p-2 text-slate-700 hover:text-orange-600 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <div className="px-5 pt-3 pb-6 space-y-2">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              {item.label}
            </a>
          ))}

          {user && (
            <Link
              href="/pesanan"
              onClick={closeMenu}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-bold text-orange-600 bg-orange-50/60 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Pesanan Anda</span>
            </Link>
          )}

          {/* Mobile Login / Dashboard */}
          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                {user.role === "admin" && (
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-orange-600 hover:bg-orange-50 rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Buka Admin Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-xs text-slate-500">Masuk sebagai {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-500 font-bold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-800 hover:text-orange-600"
              >
                <User className="w-4 h-4" />
                <span>Masuk ke Akun Admin/User</span>
              </Link>
            )}
          </div>

          <div className="pt-2">
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
