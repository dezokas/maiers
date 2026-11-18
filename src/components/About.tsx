import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  Sparkles,
  Compass,
  Award,
  CheckCircle,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-orange-600" />,
  Sparkles: <Sparkles className="w-6 h-6 text-orange-600" />,
  Compass: <Compass className="w-6 h-6 text-orange-600" />,
  Award: <Award className="w-6 h-6 text-orange-600" />,
};

export default function About() {
  const { about } = siteConfig;

  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            TENTANG MYERS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {about.title}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {about.subtitle}
          </p>
        </div>

        {/* Story & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Craft Visual (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 flex items-center justify-center">
              <Image
                src={about.craftImage}
                alt="Myers Footwear Craftsmanship Anatomy"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Stamp / Pill */}
            <div className="absolute -bottom-5 right-4 sm:right-10 bg-white border border-slate-200 shadow-xl rounded-2xl px-5 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Presisi Anatomi Kaki
                </div>
                <div className="text-[11px] text-slate-500">
                  Riset & Uji Ergonomis
                </div>
              </div>
            </div>
          </div>

          {/* Story Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Menyatukan Kenyamanan Tanpa Batas dengan Standar Desain Modern
            </h3>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              {about.story}
            </p>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
              <div className="text-sm font-bold text-slate-900 uppercase tracking-wider text-orange-600">
                Komitmen Kami
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Kami percaya setiap orang berhak melangkah dengan percaya diri
                tanpa rasa khawatir akan kelelahan kaki atau sepatu yang mudah
                rusak. Di Myers, setiap potongan material hingga benang sol
                dipilih dengan penuh tanggung jawab.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Brand Values Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.values.map((val, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-300 space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                {iconMap[val.iconName] || <Award className="w-6 h-6 text-orange-600" />}
              </div>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                {val.title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
