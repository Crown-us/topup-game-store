"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const INVOICE_RE = /^INV\d{8}$/;

export default function LacakPage() {
  const router = useRouter();
  const [invoiceId, setInvoiceId] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = invoiceId.trim().toUpperCase();
    if (!id) return setError("Isi nomor invoice dulu.");
    if (!INVOICE_RE.test(id)) return setError("Format nomor invoice: INV diikuti 8 angka, contoh INV12345678.");
    setError("");
    router.push(`/invoice/${id}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="wrap flex-1 py-10 md:py-16">
        <div className="panel mx-auto max-w-lg p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold">Cek transaksi</h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            Masukkan nomor invoice yang muncul setelah kamu checkout.
          </p>

          <form onSubmit={handleSearch} noValidate className="mt-6 space-y-3">
            <div>
              <label htmlFor="invoice" className="field-label">Nomor invoice</label>
              <input
                id="invoice"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                placeholder="INV12345678"
                autoComplete="off"
                className="field"
                aria-invalid={!!error}
                aria-describedby={error ? "invoice-err" : undefined}
              />
              {error && (
                <p id="invoice-err" className="mt-1.5 text-sm font-medium" style={{ color: "var(--danger)" }}>
                  {error}
                </p>
              )}
            </div>
            <button type="submit" className="btn-primary min-h-12 w-full">
              <Search className="size-4" /> Cek status
            </button>
          </form>

          <div className="demo-note mt-6" role="note">
            <p>
              <strong>Mode demo.</strong> Pesanan belum disimpan di server, jadi hasil pencarian di sini belum bisa menampilkan pesanan lama.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
