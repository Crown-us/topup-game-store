"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, QrCode, Copy, Check, Zap, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function InvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const sp = useSearchParams();

  const game  = sp.get("game")  ?? "Mobile Legends";
  const item  = sp.get("item")  ?? "Weekly Diamond Pass";
  const price = Number(sp.get("price") ?? 28500);
  const wa    = sp.get("wa")    ?? "—";

  type Status = "pending" | "processing" | "success";
  const [status, setStatus]     = useState<Status>("pending");
  const [copied, setCopied]     = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 min

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const copyId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePay = () => {
    setStatus("processing");
    setTimeout(() => setStatus("success"), 2500);
  };

  /* Label style */
  const labelStyle = { color: "var(--txt-muted)", fontFamily: "var(--font-body)" };
  const valueStyle = { color: "var(--txt-primary)", fontFamily: "var(--font-body)" };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "var(--txt-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        {/* ── Main Invoice Card ───────────────────────────── */}
        <div className="surface p-6 sm:p-8 space-y-7" style={{ borderRadius: 16 }}>

          {/* Header: ID + Status */}
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--txt-muted)" }}>
                Nomor Invoice
              </p>
              <div className="flex items-center gap-2 mt-1">
                <h1 className="font-extrabold text-xl" style={{ fontFamily: "var(--font-display)", color: "var(--txt-primary)" }}>
                  {orderId}
                </h1>
                <button
                  onClick={copyId}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                >
                  {copied
                    ? <Check className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />
                    : <Copy className="w-3.5 h-3.5" style={{ color: "var(--txt-muted)" }} />}
                </button>
              </div>
            </div>

            {/* Status chip */}
            {status === "pending" && (
              <div
                className="px-3.5 py-2 rounded-full flex items-center gap-2 text-xs font-bold"
                style={{ background: "#FFF7ED", color: "#B45309", border: "1px solid #FDE68A" }}
              >
                <Clock className="w-4 h-4 animate-spin" />
                Menunggu Pembayaran · {fmt(timeLeft)}
              </div>
            )}
            {status === "processing" && (
              <div
                className="px-3.5 py-2 rounded-full flex items-center gap-2 text-xs font-bold"
                style={{ background: "var(--blue-light)", color: "var(--blue)", border: "1px solid rgba(41,82,227,0.2)" }}
              >
                <Zap className="w-4 h-4 animate-bounce" />
                Memproses Diamond…
              </div>
            )}
            {status === "success" && (
              <div
                className="px-3.5 py-2 rounded-full flex items-center gap-2 text-xs font-bold"
                style={{ background: "var(--green-light)", color: "var(--green)", border: "1px solid rgba(0,196,140,0.25)" }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Pembayaran Berhasil!
              </div>
            )}
          </div>

          {/* QRIS Box — only when pending */}
          {status === "pending" && (
            <div
              className="p-6 rounded-xl flex flex-col items-center gap-5 text-center"
              style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--blue)" }}>
                  Scan QRIS untuk Membayar
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--txt-muted)" }}>
                  DANA · OVO · GoPay · ShopeePay · LinkAja · Mobile Banking
                </p>
              </div>

              {/* QR placeholder */}
              <div
                className="p-4 rounded-xl bg-white"
                style={{ border: "3px solid var(--blue)", boxShadow: "0 6px 24px rgba(41,82,227,0.15)" }}
              >
                <QrCode className="w-44 h-44" style={{ color: "var(--txt-primary)" }} />
              </div>

              <div>
                <p className="text-xs" style={{ color: "var(--txt-muted)" }}>Total Tagihan</p>
                <p className="price-num font-black text-2xl" style={{ color: "var(--blue)", fontFamily: "var(--font-display)" }}>
                  Rp {price.toLocaleString("id-ID")}
                </p>
              </div>

              <button
                onClick={simulatePay}
                className="btn-primary w-full max-w-sm py-3.5 text-sm"
              >
                [Simulasi] Saya Sudah Bayar
              </button>
            </div>
          )}

          {/* Success Banner */}
          {status === "success" && (
            <div
              className="p-6 rounded-xl text-center space-y-2"
              style={{ background: "var(--green-light)", border: "1px solid rgba(0,196,140,0.25)" }}
            >
              <CheckCircle2 className="w-10 h-10 mx-auto" style={{ color: "var(--green)" }} />
              <h2 className="font-extrabold text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--txt-primary)" }}>
                Transaksi Berhasil!
              </h2>
              <p className="text-sm" style={{ color: "var(--txt-muted)" }}>
                <span className="font-bold" style={{ color: "var(--txt-primary)" }}>{item}</span> telah dikirim ke
                akunmu. Struk dikirim ke WhatsApp{" "}
                <span className="font-bold" style={{ color: "var(--txt-primary)" }}>{wa}</span>.
              </p>
            </div>
          )}

          {/* Detail rows */}
          <div
            className="rounded-xl p-4 space-y-3 text-sm"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          >
            {[
              ["Game",          game],
              ["Item",          item],
              ["Nomor WA",      wa],
              ["Total Bayar",   `Rp ${price.toLocaleString("id-ID")}`],
            ].map(([k, v], i, arr) => (
              <div
                key={k}
                className={`flex justify-between gap-4 ${i < arr.length - 1 ? "pb-3" : ""}`}
                style={i < arr.length - 1 ? { borderBottom: "1px solid var(--border-soft)" } : undefined}
              >
                <span style={labelStyle}>{k}</span>
                <span
                  className={i === arr.length - 1 ? "price-num font-extrabold" : "font-semibold"}
                  style={{ ...valueStyle, color: i === arr.length - 1 ? "var(--blue)" : "var(--txt-primary)" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* CS Button */}
          <div
            className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <p className="text-xs" style={{ color: "var(--txt-muted)" }}>Ada kendala dengan transaksi ini?</p>
            <a
              href={`https://wa.me/6285117394878?text=Halo%20Admin%2C%20saya%20ingin%20tanya%20invoice%20${orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: "var(--bg)", border: "1.5px solid var(--border)", color: "var(--txt-primary)" }}
            >
              <MessageSquare className="w-4 h-4" style={{ color: "var(--green)" }} />
              Hubungi CS via WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
