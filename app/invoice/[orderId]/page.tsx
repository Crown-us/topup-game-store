"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, CheckCircle2, Clock, Copy, Loader2, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WA_CS = "6285117394878";
const PAY_WINDOW_S = 15 * 60;

type Status = "pending" | "processing" | "paid" | "expired";

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="wrap flex-1 py-8 md:py-10">
        <div className="mx-auto max-w-2xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * Orders are not stored on a server yet, so an invoice only exists right after
 * checkout (its details travel in the URL). Anything else is "not found".
 */
function InvoiceNotFound({ orderId }: { orderId: string }) {
  return (
    <Shell>
      <div className="panel p-8 text-center">
        <h1 className="text-2xl font-extrabold">Invoice {orderId} nggak ketemu</h1>
        <p className="mx-auto mt-2 max-w-[46ch]" style={{ color: "var(--text-2)" }}>
          Toko ini masih mode demo dan belum menyimpan pesanan di server, jadi invoice cuma bisa dibuka langsung setelah checkout.
          Kalau kamu yakin pernah bayar, kirim nomor invoice ke CS.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`https://wa.me/${WA_CS}?text=${encodeURIComponent(`Halo admin, saya mau tanya invoice ${orderId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="buy-btn inline-flex min-h-12 items-center justify-center px-5"
          >
            Tanya CS di WhatsApp
          </a>
          <Link href="/#games" className="inline-flex min-h-12 items-center justify-center rounded-xl px-5 font-semibold hover:bg-[var(--panel-2)]" style={{ border: "1.5px solid var(--line)" }}>
            Belanja lagi
          </Link>
        </div>
      </div>
    </Shell>
  );
}

export default function InvoicePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const sp = useSearchParams();

  const game = sp.get("game");
  const item = sp.get("item");
  const price = Number(sp.get("price"));
  const pay = sp.get("pay");
  const wa = sp.get("wa");

  const [status, setStatus] = useState<Status>("pending");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PAY_WINDOW_S);

  useEffect(() => {
    if (status !== "pending") return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          setStatus("expired");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [status]);

  if (!game || !item || !Number.isFinite(price) || price <= 0) return <InvoiceNotFound orderId={orderId} />;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
    }
  };

  const simulatePay = () => {
    setStatus("processing");
    setTimeout(() => setStatus("paid"), 1500);
  };

  const rows: [string, string][] = [
    ["Game", game],
    ["Item", item],
    ["Pembayaran", pay ?? "QRIS"],
    ["WhatsApp", wa || "Tidak diisi"],
  ];

  return (
    <Shell>
      <div className="demo-note mb-5" role="note">
        <p>
          <strong>Mode demo.</strong> Payment gateway belum tersambung. Nggak ada uang yang ditagih dan nggak ada item yang dikirim ke akunmu.
        </p>
      </div>

      <div className="panel space-y-6 p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center" style={{ borderColor: "var(--line)" }}>
          <div>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Nomor invoice</p>
            <div className="mt-0.5 flex items-center gap-1">
              <h1 className="text-xl font-extrabold">{orderId}</h1>
              <button type="button" onClick={copyId} className="icon-btn !border-transparent !bg-transparent" aria-label={copied ? "Nomor invoice tersalin" : "Salin nomor invoice"}>
                {copied ? <Check className="size-4" style={{ color: "var(--ok)" }} /> : <Copy className="size-4" style={{ color: "var(--text-2)" }} />}
              </button>
            </div>
            <p aria-live="polite" className="text-xs" style={{ color: copyFailed ? "var(--danger)" : "var(--ok)" }}>
              {copied ? "Tersalin." : copyFailed ? "Browser menolak salin otomatis. Salin nomornya manual ya." : ""}
            </p>
          </div>

          <p role="status" aria-live="polite">
            {status === "pending" && (
              <span className="status" style={{ background: "rgba(255,210,63,.12)", color: "var(--coin)" }}>
                <Clock className="size-4" /> Menunggu pembayaran, sisa {mmss(timeLeft)}
              </span>
            )}
            {status === "processing" && (
              <span className="status" style={{ background: "var(--cobalt-tint)", color: "var(--link)" }}>
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" /> Mengecek pembayaran
              </span>
            )}
            {status === "paid" && (
              <span className="status" style={{ background: "var(--ok-tint)", color: "var(--ok)" }}>
                <CheckCircle2 className="size-4" /> Pembayaran simulasi berhasil
              </span>
            )}
            {status === "expired" && (
              <span className="status" style={{ background: "rgba(255,92,108,.12)", color: "var(--danger)" }}>
                Waktu bayar habis
              </span>
            )}
          </p>
        </div>

        {status === "pending" && (
          <div className="flex flex-col items-center gap-4 rounded-xl p-5 text-center" style={{ background: "var(--bg-2)", border: "1px solid var(--line)" }}>
            <h2 className="font-bold">Bayar pakai QRIS</h2>
            <div
              className="grid size-48 place-items-center rounded-xl p-4 text-sm"
              style={{ border: "2px dashed var(--line)", color: "var(--text-2)" }}
              role="img"
              aria-label="Tempat kode QRIS, belum aktif"
            >
              Kode QRIS asli muncul di sini setelah payment gateway tersambung.
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--text-2)" }}>Total tagihan</p>
              <p className="choice-price text-2xl">{rp(price)}</p>
            </div>
            <button type="button" onClick={simulatePay} className="btn-primary min-h-12 w-full max-w-sm">
              Simulasikan pembayaran (demo)
            </button>
          </div>
        )}

        {status === "paid" && (
          <div className="space-y-2 rounded-xl p-5 text-center" style={{ background: "var(--ok-tint)", border: "1px solid rgba(47,213,127,.3)" }}>
            <CheckCircle2 className="mx-auto size-9" style={{ color: "var(--ok)" }} />
            <h2 className="text-lg font-extrabold">Simulasi selesai</h2>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              Di versi live, langkah berikutnya adalah mengirim <strong style={{ color: "var(--text)" }}>{item}</strong> ke akunmu dan struk ke WhatsApp.
              Di mode demo ini nggak ada yang dikirim.
            </p>
          </div>
        )}

        {status === "expired" && (
          <div className="space-y-3 rounded-xl p-5 text-center" style={{ background: "var(--bg-2)", border: "1px solid var(--line)" }}>
            <h2 className="font-bold">Waktu pembayaran 15 menit sudah habis</h2>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Buat pesanan baru untuk dapat kode bayar yang baru.</p>
            <Link href="/#games" className="btn-primary inline-flex min-h-12 px-6">Pesan ulang</Link>
          </div>
        )}

        <dl className="space-y-3 rounded-xl p-4 text-sm" style={{ background: "var(--bg-2)", border: "1px solid var(--line)" }}>
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt style={{ color: "var(--text-2)" }}>{k}</dt>
              <dd className="text-right font-semibold">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t pt-3" style={{ borderColor: "var(--line)" }}>
            <dt style={{ color: "var(--text-2)" }}>Total bayar</dt>
            <dd className="choice-price">{rp(price)}</dd>
          </div>
        </dl>

        <div className="flex flex-col items-center justify-between gap-3 border-t pt-5 sm:flex-row" style={{ borderColor: "var(--line)" }}>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>Ada kendala dengan pesanan ini?</p>
          <a
            href={`https://wa.me/${WA_CS}?text=${encodeURIComponent(`Halo admin, saya mau tanya invoice ${orderId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold hover:bg-[var(--panel-2)]"
            style={{ border: "1.5px solid var(--line)" }}
          >
            <MessageCircle className="size-4" style={{ color: "var(--ok)" }} />
            Chat CS di WhatsApp
          </a>
        </div>
      </div>
    </Shell>
  );
}
