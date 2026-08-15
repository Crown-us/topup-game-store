"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  QrCode,
  Wallet,
  Building2,
  Store,
  ShieldCheck,
  Zap,
  ArrowRight,
  X,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { gamesData, paymentMethodsData, NominalItem, PaymentMethod } from "@/lib/games";

export default function OrderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const game = gamesData.find((g) => g.slug === slug) ?? gamesData[0];

  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [selectedNominal, setSelectedNominal] = useState<NominalItem>(game.nominals[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(paymentMethodsData[0]);
  const [whatsapp, setWhatsapp] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const total = selectedNominal.price + selectedPayment.adminFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert("Harap masukkan User ID game kamu!");
    if (game.hasZoneId && !zoneId) return alert("Harap masukkan Zone ID / Server ID!");
    if (!whatsapp) return alert("Harap masukkan nomor WhatsApp untuk notifikasi!");
    setShowConfirm(true);
  };

  const processOrder = () => {
    const orderId = "INV" + Date.now().toString().slice(-8);
    setShowConfirm(false);
    router.push(
      `/invoice/${orderId}?game=${encodeURIComponent(game.name)}&item=${encodeURIComponent(selectedNominal.name)}&price=${total}&wa=${encodeURIComponent(whatsapp)}`
    );
  };

  /* ─── Shared input style ─── */
  const inputCls =
    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const inputStyle = {
    fontFamily: "var(--font-body)",
    background: "var(--bg)",
    border: "1.5px solid var(--border)",
    color: "var(--txt-primary)",
  };

  /* ─── Step heading ─── */
  const StepLabel = ({ n, title, sub }: { n: number; title: string; sub: string }) => (
    <div className="flex items-start gap-3 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-extrabold shrink-0 mt-0.5"
        style={{ background: "var(--blue)", fontFamily: "var(--font-display)" }}
      >
        {n}
      </span>
      <div>
        <h2 className="font-extrabold text-base" style={{ fontFamily: "var(--font-display)", color: "var(--txt-primary)" }}>
          {title}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--txt-muted)" }}>{sub}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          style={{ color: "var(--txt-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* ── LEFT: Game sidebar ────────────────────────── */}
          <div className="lg:col-span-4">
            <div
              className="sticky top-24 surface p-5 space-y-5"
              style={{ borderRadius: 16 }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span
                  className="absolute top-3 left-3 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md"
                  style={{ background: "var(--blue)", fontFamily: "var(--font-display)" }}
                >
                  {game.publisher}
                </span>
                <div
                  className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-[11px] font-bold px-2 py-0.5 rounded-md"
                  style={{ background: "rgba(0,0,0,0.55)" }}
                >
                  <Star className="w-3 h-3" style={{ color: "#F59E0B" }} /> {game.rating} · {game.soldCount}
                </div>
              </div>

              {/* Title */}
              <div>
                <h1
                  className="font-extrabold text-xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--txt-primary)" }}
                >
                  {game.name}
                </h1>
                <p className="text-xs mt-1" style={{ color: "var(--txt-muted)" }}>
                  Proses otomatis 24 jam · {game.processTime}
                </p>
              </div>

              {/* Guarantees */}
              <div
                className="space-y-3 pt-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                {[
                  { icon: Zap,         text: `Proses ${game.processTime}` },
                  { icon: ShieldCheck, text: "Diamond resmi, akun aman" },
                  { icon: QrCode,      text: "QRIS bebas biaya admin" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "var(--txt-muted)" }}>
                    <Icon className="w-4 h-4 shrink-0" style={{ color: "var(--blue)" }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: 4-Step form ─────────────────────────── */}
          <div className="lg:col-span-8 space-y-5">

            {/* STEP 1 */}
            <div className="surface p-6 space-y-5" style={{ borderRadius: 16 }}>
              <div className="flex items-start justify-between">
                <StepLabel
                  n={1}
                  title="Masukkan Data Akun"
                  sub="Pastikan User ID sudah benar agar diamond tidak salah masuk"
                />
                <button
                  type="button"
                  onClick={() => setShowHelp(true)}
                  className="flex items-center gap-1 text-xs font-semibold shrink-0 mt-1"
                  style={{ color: "var(--blue)" }}
                >
                  <HelpCircle className="w-4 h-4" /> Petunjuk
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-wide mb-2"
                    style={{ color: "var(--txt-muted)" }}
                  >
                    {game.userIdLabel} *
                  </label>
                  <input
                    required
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Contoh: 12345678"
                    className={inputCls}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>
                {game.hasZoneId && (
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wide mb-2"
                      style={{ color: "var(--txt-muted)" }}
                    >
                      {game.zoneIdLabel} *
                    </label>
                    <input
                      required
                      type="text"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder="Contoh: 1234"
                      className={inputCls}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2 */}
            <div className="surface p-6 space-y-5" style={{ borderRadius: 16 }}>
              <StepLabel n={2} title="Pilih Nominal" sub="Pilih jumlah diamond atau item yang kamu inginkan" />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {game.nominals.map((item) => {
                  const active = selectedNominal.id === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedNominal(item)}
                      className="relative p-4 rounded-xl text-left flex flex-col gap-2 transition-all"
                      style={{
                        background: active ? "var(--blue-light)" : "var(--bg)",
                        border: `1.5px solid ${active ? "var(--blue)" : "var(--border)"}`,
                        boxShadow: active ? "0 0 0 3px rgba(41,82,227,0.12)" : "none",
                      }}
                    >
                      {item.tag && (
                        <span className="badge-green absolute -top-2 right-3">
                          {item.tag}
                        </span>
                      )}
                      <div>
                        <p
                          className="font-extrabold text-sm"
                          style={{ fontFamily: "var(--font-display)", color: "var(--txt-primary)" }}
                        >
                          {item.name}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--txt-muted)" }}>{item.amount}</p>
                      </div>
                      <div className="flex items-end justify-between pt-1" style={{ borderTop: `1px solid ${active ? "rgba(41,82,227,0.15)" : "var(--border-soft)"}` }}>
                        <p className="text-sm price-num font-extrabold" style={{ color: "var(--blue)" }}>
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {item.originalPrice && (
                            <span className="text-[10px] line-through" style={{ color: "var(--txt-subtle)" }}>
                              {item.originalPrice.toLocaleString("id-ID")}
                            </span>
                          )}
                          {item.discountPercent && (
                            <span className="badge-green text-[10px]">-{item.discountPercent}%</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3 */}
            <div className="surface p-6 space-y-5" style={{ borderRadius: 16 }}>
              <StepLabel n={3} title="Metode Pembayaran" sub="Pilih cara bayar yang paling mudah untukmu" />

              <div className="space-y-2.5">
                {paymentMethodsData.map((pay) => {
                  const active = selectedPayment.id === pay.id;
                  const lineTotal = selectedNominal.price + pay.adminFee;
                  return (
                    <button
                      type="button"
                      key={pay.id}
                      onClick={() => setSelectedPayment(pay)}
                      className="w-full p-4 rounded-xl flex items-center gap-4 text-left transition-all"
                      style={{
                        background: active ? "var(--blue-light)" : "var(--bg)",
                        border: `1.5px solid ${active ? "var(--blue)" : "var(--border)"}`,
                        boxShadow: active ? "0 0 0 3px rgba(41,82,227,0.12)" : "none",
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: active ? "rgba(41,82,227,0.12)" : "var(--border-soft)" }}
                      >
                        {pay.category === "qris"    && <QrCode      className="w-5 h-5" style={{ color: "var(--blue)" }} />}
                        {pay.category === "ewallet" && <Wallet      className="w-5 h-5" style={{ color: "var(--blue)" }} />}
                        {pay.category === "va"      && <Building2   className="w-5 h-5" style={{ color: "var(--blue)" }} />}
                        {pay.category === "retail"  && <Store       className="w-5 h-5" style={{ color: "var(--blue)" }} />}
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className="font-bold text-sm"
                            style={{ fontFamily: "var(--font-display)", color: "var(--txt-primary)" }}
                          >
                            {pay.name}
                          </p>
                          {pay.badge && <span className="badge-green">{pay.badge}</span>}
                        </div>
                        {pay.promoText && (
                          <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--txt-muted)" }}>
                            {pay.promoText}
                          </p>
                        )}
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--txt-subtle)" }}>{pay.fee}</p>
                      </div>

                      {/* Total */}
                      <div className="text-right shrink-0">
                        <p
                          className="text-sm price-num font-extrabold"
                          style={{ color: "var(--blue)" }}
                        >
                          Rp {lineTotal.toLocaleString("id-ID")}
                        </p>
                        {pay.adminFee === 0 && (
                          <p className="text-[10px] font-semibold" style={{ color: "var(--green)" }}>
                            Gratis Admin
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4 */}
            <div className="surface p-6 space-y-4" style={{ borderRadius: 16 }}>
              <StepLabel
                n={4}
                title="Nomor WhatsApp"
                sub="Struk & status transaksi dikirim otomatis ke nomor ini"
              />
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-wide mb-2"
                  style={{ color: "var(--txt-muted)" }}
                >
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  required
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 085117394878"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>

            {/* CHECKOUT BAR */}
            <div
              className="surface p-5 flex flex-col sm:flex-row justify-between items-center gap-4"
              style={{ borderRadius: 16, border: "2px solid var(--blue)" }}
            >
              <div>
                <p className="text-xs" style={{ color: "var(--txt-muted)" }}>Total Pembayaran</p>
                <p
                  className="price-num font-black text-2xl"
                  style={{ color: "var(--blue)", fontFamily: "var(--font-display)" }}
                >
                  Rp {total.toLocaleString("id-ID")}
                </p>
              </div>
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto px-10 py-3.5 flex items-center justify-center gap-2"
                style={{ fontSize: 15 }}
              >
                Beli Sekarang <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* ── Help Modal ─────────────────────────────────────── */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,41,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="surface w-full max-w-md p-6 space-y-4" style={{ borderRadius: 16 }}>
            <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="font-extrabold text-base" style={{ fontFamily: "var(--font-display)", color: "var(--txt-primary)" }}>
                Cara Menemukan User ID
              </h3>
              <button onClick={() => setShowHelp(false)} style={{ color: "var(--txt-muted)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--txt-muted)" }}>{game.guideText}</p>
            <button
              onClick={() => setShowHelp(false)}
              className="btn-primary w-full py-3 text-sm"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* ── Confirm Modal ──────────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,41,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="surface w-full max-w-md p-6 space-y-5" style={{ borderRadius: 16 }}>
            <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="font-extrabold text-base flex items-center gap-2" style={{ fontFamily: "var(--font-display)", color: "var(--txt-primary)" }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: "var(--green)" }} />
                Konfirmasi Pesanan
              </h3>
              <button onClick={() => setShowConfirm(false)} style={{ color: "var(--txt-muted)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="rounded-xl p-4 space-y-2 text-sm"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              {[
                ["Game", game.name],
                ["User ID", `${userId}${zoneId ? ` (${zoneId})` : ""}`],
                ["Item", selectedNominal.name],
                ["Pembayaran", selectedPayment.name],
                ["Total", `Rp ${total.toLocaleString("id-ID")}`],
              ].map(([k, v], i, arr) => (
                <div
                  key={k}
                  className={`flex justify-between gap-4 ${i < arr.length - 1 ? "pb-2" : "pt-2 font-bold"}`}
                  style={i === arr.length - 1 ? { borderTop: "1px solid var(--border)" } : undefined}
                >
                  <span style={{ color: "var(--txt-muted)" }}>{k}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      color: i === arr.length - 1 ? "var(--blue)" : "var(--txt-primary)",
                    }}
                    className={i === arr.length - 1 ? "price-num font-extrabold text-base" : ""}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: "var(--bg)", border: "1.5px solid var(--border)", color: "var(--txt-muted)" }}
              >
                Batal
              </button>
              <button
                onClick={processOrder}
                className="btn-primary flex-1 py-3 text-sm"
              >
                Lanjut Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
