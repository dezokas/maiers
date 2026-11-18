import React from "react";
import { siteConfig } from "@/config/site";
import {
  Ruler,
  RefreshCw,
  Truck,
  HeartHandshake,
  ArrowUpRight,
} from "lucide-react";

const serviceIcons: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-7 h-7 text-orange-600" />,
  RefreshCw: <RefreshCw className="w-7 h-7 text-orange-600" />,
  Truck: <Truck className="w-7 h-7 text-orange-600" />,
  HeartHandshake: <HeartHandshake className="w-7 h-7 text-orange-600" />,
};

export default function Services() {
  const { services } = siteConfig;

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              STANDAR LAYANAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pelayanan Terbaik untuk Kenyamanan Belanja Anda
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Kami menghadirkan pengalaman berbelanja sepatu tanpa cemas, mulai
              dari rekomendasi ukuran hingga jaminan purna jual.
            </p>
          </div>

          <a
            href={siteConfig.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 group shrink-0"
          >
            <span>Tanya Personal Assistant Myers</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                  <span className="group-hover:brightness-200 transition-all">
                    {serviceIcons[item.iconName] || (
                      <HeartHandshake className="w-7 h-7 text-orange-600" />
                    )}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tersedia untuk semua pesanan
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
