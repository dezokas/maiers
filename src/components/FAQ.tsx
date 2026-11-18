"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            PERTANYAAN UMUM
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kerap Ditanyakan (FAQ)
          </h2>
          <p className="text-slate-600 text-base">
            Jawaban lengkap seputar garansi penukaran, pemesanan, dan perawatan sepatu.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {siteConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-orange-600 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-orange-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-200/50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
