"use client";

import React from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 animate-slide-up"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-sm font-medium pr-2">{message}</span>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
