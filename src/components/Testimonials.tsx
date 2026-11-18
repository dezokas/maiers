import React from "react";
import { siteConfig } from "@/config/site";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const { testimonials } = siteConfig;

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            TESTIMONIAL PELANGGAN
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Apa Kata Mereka yang Sudah Melangkah Bersama Myers
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Kepercayaan lebih dari 25.000 pelanggan aktif di seluruh Indonesia.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6 relative group"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: testi.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-orange-200 group-hover:text-orange-400 transition-colors" />

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;{testi.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="font-bold text-slate-900 text-base">
                  {testi.name}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {testi.role}
                </div>
                <div className="text-[11px] font-semibold text-orange-600 mt-1">
                  Membeli: {testi.shoePurchased}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
