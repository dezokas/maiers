"use client";

import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Star, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onQuickOrder?: () => void;
}

export default function Hero({ onQuickOrder }: HeroProps) {
  const { hero } = siteConfig;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(hero.price);

  const formattedOriginalPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(hero.originalPrice);

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#FAFAFA]"
    >
      {/* Decorative Background Lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-400/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badges */}
            <div className="inline-flex flex-wrap items-center gap-2.5 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-orange-100 text-orange-700 border border-orange-200">
                <Zap className="w-3.5 h-3.5 fill-orange-600 text-orange-600" />
                {hero.badge}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                4.9 / 5.0 (1.2k+ Ulasan)
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {hero.title.split("Myers Aero Pulse")[0]}
              <span className="text-orange-600">Myers Aero Pulse</span>
            </h1>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 justify-center lg:justify-start">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {formattedPrice}
              </span>
              <span className="text-lg sm:text-xl font-medium text-slate-400 line-through">
                {formattedOriginalPrice}
              </span>
              <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-emerald-100 text-emerald-800">
                Hemat 25%
              </span>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {hero.subtitle}
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Teknologi Insole CloudStride™ Anti-Pegal</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Material Engineered Breathable Mesh</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Sol Rubber Grip Tahan Abrasi & Anti-Slip</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Garansi 7 Hari Bebas Tukar Ukuran</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <button
                type="button"
                onClick={onQuickOrder}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>{hero.ctaOrder}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-2xl border border-slate-200 shadow-sm transition-all duration-200"
              >
                <span>{hero.ctaExplore}</span>
              </a>
            </div>

            {/* Stats row */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              {hero.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Column (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Main Visual Box */}
            <div className="relative w-full max-w-lg aspect-4/3 rounded-3xl p-4 bg-white/70 shadow-xl border border-slate-100 backdrop-blur-sm flex items-center justify-center group">
              <div className="relative w-full h-full">
                <Image
                  src={hero.featuredShoeImage}
                  alt="Myers Aero Pulse Sneaker"
                  fill
                  priority
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Floating Badge 1 - Weight */}
              <div className="absolute top-4 left-4 bg-white/95 shadow-md border border-slate-100 rounded-xl px-3 py-2 flex items-center gap-2 animate-bounce duration-1000">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                  ⚡
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">Ultralight</div>
                  <div className="text-[10px] text-slate-500">Hanya 240 gram</div>
                </div>
              </div>

              {/* Floating Badge 2 - Tech */}
              <div className="absolute bottom-4 right-4 bg-white/95 shadow-md border border-slate-100 rounded-xl px-3 py-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">CloudStride™</div>
                  <div className="text-[10px] text-slate-500">Anti-Pegal Seharian</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
