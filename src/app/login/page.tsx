"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal melakukan login.");
        setIsLoading(false);
        return;
      }

      // Jika role adalah admin, arahkan ke dashboard
      if (data.user?.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch {
      setErrorMessage("Koneksi gagal. Silakan coba beberapa saat lagi.");
      setIsLoading(false);
    }
  };

  const handleFillAdminDemo = () => {
    setEmail("admin@gmail.com");
    setPassword("123456");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-xl">
            <div className="relative w-40 h-10">
              <Image
                src={siteConfig.logo.path}
                alt={siteConfig.logo.alt}
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Atau{" "}
          <Link
            href="/register"
            className="font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            daftar akun baru di sini
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100">
          {/* Quick Demo Helper Box */}
          <div className="mb-6 p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-orange-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Akun Demo Admin Bawaan (Step 2):</span>
            </div>
            <p className="text-slate-600">
              Email: <code className="font-mono bg-white px-1.5 py-0.5 rounded border">admin@gmail.com</code> | Pass: <code className="font-mono bg-white px-1.5 py-0.5 rounded border">123456</code>
            </p>
            <button
              type="button"
              onClick={handleFillAdminDemo}
              className="mt-1 w-full py-1.5 px-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
            >
              Isi Otomatis Kredensial Admin
            </button>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
