"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Receipt, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LacakPage() {
  const [invoiceId, setInvoiceId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId.trim()) return;
    router.push(`/invoice/${invoiceId.trim()}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="max-w-[640px] mx-auto px-4 sm:px-6 py-16 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "var(--txt-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <div className="surface p-8 sm:p-10 space-y-7 text-center" style={{ borderRadius: 18 }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "var(--blue-light)" }}
          >
            <Receipt className="w-7 h-7" style={{ color: "var(--blue)" }} />
          </div>

          <div>
            <h1
              className="font-black text-2xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--txt-primary)" }}
            >
              Lacak Status Pesanan
            </h1>
            <p className="text-sm mt-2 leading-relaxed max-w-xs mx-auto" style={{ color: "var(--txt-muted)" }}>
              Masukkan nomor Invoice yang diterima setelah melakukan pembelian (contoh: INV12345678).
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-3 text-left">
            <label
              className="block text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--txt-muted)" }}
            >
              Nomor Invoice
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--txt-subtle)" }}
              />
              <input
                type="text"
                required
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                placeholder="INV12345678"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  fontFamily: "var(--font-body)",
                  background: "var(--bg)",
                  border: "1.5px solid var(--border)",
                  color: "var(--txt-primary)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> Cari Invoice
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-xs pt-2" style={{ color: "var(--txt-muted)" }}>
            <ShieldCheck className="w-4 h-4" style={{ color: "var(--green)" }} />
            Sistem terverifikasi otomatis 24 jam
          </div>
        </div>
      </main>
    </div>
  );
}
