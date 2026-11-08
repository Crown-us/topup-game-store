"use client";

import { use, useCallback, useState } from "react";
import { useIsClient } from "@/lib/useClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ChevronLeft, HelpCircle, QrCode, ShieldCheck, Store, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameImg from "@/components/GameImg";
import Modal from "@/components/Modal";
import { gamesData, paymentMethodsData, Game, NominalItem, PaymentMethod } from "@/lib/games";
import { promoFor } from "@/lib/promos";

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
const sentence = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

const PAY_GROUPS: { id: PaymentMethod["category"]; label: string; icon: typeof QrCode }[] = [
  { id: "qris", label: "QRIS", icon: QrCode },
  { id: "ewallet", label: "E-wallet", icon: Wallet },
  { id: "va", label: "Transfer bank (virtual account)", icon: Building2 },
  { id: "retail", label: "Bayar di gerai", icon: Store },
];

function Step({ n, title, action, children }: { n: number; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="panel" aria-labelledby={`step-${n}`}>
      <div className="step-head">
        <span className="step-badge" aria-hidden>{n}</span>
        <h2 id={`step-${n}`} className="step-title">
          <span className="sr-only">Langkah {n}: </span>
          {title}
        </h2>
        {action}
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </section>
  );
}

function GameNotFound({ slug }: { slug: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="wrap flex-1 py-16">
        <div className="panel mx-auto max-w-lg p-8 text-center">
          <h1 className="text-2xl font-extrabold">Game nggak ketemu</h1>
          <p className="mt-2" style={{ color: "var(--text-2)" }}>
            Kami belum punya produk dengan alamat &ldquo;{slug}&rdquo;. Mungkin link-nya salah ketik, atau game ini belum tersedia.
          </p>
          <Link href="/#games" className="btn-primary mt-6 inline-flex min-h-11 px-6">
            Lihat semua game
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OrderForm({ game }: { game: Game }) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [nominal, setNominal] = useState<NominalItem>(game.nominals[0]);
  const [payment, setPayment] = useState<PaymentMethod>(paymentMethodsData[0]);
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // Promos depend on the clock, so resolve them on the client only.
  const now = useIsClient() ? new Date() : null;

  const priceOf = (item: NominalItem) => {
    const promo = now ? promoFor(game.slug, item.id, now) : undefined;
    return { price: promo?.salePrice ?? item.price, normal: promo?.normalPrice };
  };

  const itemPrice = priceOf(nominal).price;
  const total = itemPrice + payment.adminFee;

  const closeHelp = useCallback(() => setShowHelp(false), []);
  const closeConfirm = useCallback(() => setShowConfirm(false), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!userId.trim()) next.userId = `Isi ${game.userIdLabel} dulu.`;
    if (game.hasZoneId && !zoneId.trim()) next.zoneId = `Isi ${game.zoneIdLabel ?? "Zone ID"} dulu.`;
    if (!/^(\+?62|0)8\d{7,12}$/.test(whatsapp.replace(/[\s-]/g, "")))
      next.whatsapp = "Nomor WhatsApp harus diawali 08 atau 62, contoh 081234567890.";
    setErrors(next);
    if (Object.keys(next).length === 0) setShowConfirm(true);
    else document.getElementById(Object.keys(next)[0])?.focus();
  };

  const processOrder = () => {
    const orderId = "INV" + Date.now().toString().slice(-8);
    setShowConfirm(false);
    const q = new URLSearchParams({
      game: game.name,
      item: nominal.name,
      price: String(total),
      pay: payment.name,
      wa: whatsapp,
    });
    router.push(`/invoice/${orderId}?${q}`);
  };

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-1.5 text-sm font-medium" style={{ color: "var(--danger)" }}>
        {errors[k]}
      </p>
    ) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="relative overflow-hidden border-b" style={{ borderColor: "var(--line)" }}>
          <img src={game.image} alt="" aria-hidden width={64} height={64} className="absolute inset-0 h-full w-full scale-125 object-cover opacity-25 blur-3xl" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, var(--bg))" }} />
          <div className="wrap relative py-4 md:py-7">
            <Link href="/#games" className="nav-link -ml-1 inline-flex min-h-11 items-center gap-1 text-sm">
              <ChevronLeft className="size-4" /> Semua game
            </Link>
            <div className="mt-2 flex items-center gap-4 md:gap-6">
              <GameImg
                src={game.image}
                name={game.shortName}
                size={112}
                priority
                className="size-20 shrink-0 rounded-2xl object-cover shadow-2xl md:size-28 md:rounded-3xl"
              />
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold leading-tight md:text-4xl">{game.name}</h1>
                <p className="mt-0.5 text-sm" style={{ color: "var(--text-2)" }}>{game.publisher}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap py-6 md:py-8">
          <form onSubmit={handleSubmit} noValidate className="grid gap-5 lg:grid-cols-12 lg:gap-6">
            <div className="space-y-5 lg:col-span-8">
              <Step
                n={1}
                title="Masukkan data akun"
                action={
                  <button type="button" onClick={() => setShowHelp(true)} className="link -mr-2 inline-flex min-h-11 items-center gap-1 px-2 text-sm">
                    <HelpCircle className="size-4" /> Cara cek ID
                  </button>
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="userId" className="field-label">{game.userIdLabel}</label>
                    <input
                      id="userId"
                      inputMode="numeric"
                      autoComplete="off"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Contoh: 12345678"
                      className="field"
                      aria-invalid={!!errors.userId}
                      aria-describedby={errors.userId ? "userId-err" : undefined}
                    />
                    {err("userId")}
                  </div>
                  {game.hasZoneId && (
                    <div>
                      <label htmlFor="zoneId" className="field-label">{game.zoneIdLabel}</label>
                      <input
                        id="zoneId"
                        inputMode="numeric"
                        autoComplete="off"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        placeholder="Contoh: 1234"
                        className="field"
                        aria-invalid={!!errors.zoneId}
                        aria-describedby={errors.zoneId ? "zoneId-err" : undefined}
                      />
                      {err("zoneId")}
                    </div>
                  )}
                </div>
              </Step>

              <Step n={2} title="Pilih nominal">
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                  {game.nominals.map((item) => {
                    const { price, normal } = priceOf(item);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setNominal(item)}
                        aria-pressed={nominal.id === item.id}
                        className="choice flex min-h-[104px] flex-col justify-between p-3"
                      >
                        {item.tag && <span className="corner-tag !left-auto !right-2 !top-2">{sentence(item.tag)}</span>}
                        <div>
                          <p className={`text-sm font-bold leading-tight ${item.tag ? "pr-16" : ""}`}>{item.name}</p>
                          <p className="choice-sub mt-0.5">{item.amount}</p>
                        </div>
                        <div className="mt-3 whitespace-nowrap">
                          {normal && <span className="choice-sub block text-xs line-through">{rp(normal)}</span>}
                          <span className="choice-price">{rp(price)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Step>

              <Step n={3} title="Pilih pembayaran">
                <div className="space-y-4">
                  {PAY_GROUPS.map((grp) => {
                    const methods = paymentMethodsData.filter((p) => p.category === grp.id);
                    if (!methods.length) return null;
                    return (
                      <div key={grp.id} role="group" aria-label={grp.label}>
                        <p className="pay-group-label">{grp.label}</p>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                          {methods.map((pay) => (
                            <button
                              type="button"
                              key={pay.id}
                              onClick={() => setPayment(pay)}
                              aria-pressed={payment.id === pay.id}
                              className="choice flex items-center gap-3 p-3"
                            >
                              <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: "var(--panel-2)" }}>
                                <grp.icon className="size-5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">{pay.name}</p>
                                <p className="choice-sub truncate">
                                  {pay.adminFee === 0 ? "Tanpa biaya admin" : `Admin ${rp(pay.adminFee)}`}
                                </p>
                              </div>
                              <span className="choice-price shrink-0 text-sm">{rp(itemPrice + pay.adminFee)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Step>

              <Step n={4} title="Nomor WhatsApp">
                <label htmlFor="whatsapp" className="field-label">Bukti pembelian dan status pesanan dikirim ke nomor ini</label>
                <input
                  id="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="field"
                  aria-invalid={!!errors.whatsapp}
                  aria-describedby={errors.whatsapp ? "whatsapp-err" : undefined}
                />
                {err("whatsapp")}
              </Step>
            </div>

            <aside className="hidden lg:col-span-4 lg:block" aria-label="Ringkasan pesanan">
              <div className="panel sticky top-24 p-5">
                <h2 className="text-lg font-extrabold">Ringkasan pesanan</h2>
                <dl className="mt-4 space-y-1 border-b pb-4 text-sm" style={{ borderColor: "var(--line)" }}>
                  <div className="flex justify-between gap-3">
                    <dt style={{ color: "var(--text-2)" }}>{nominal.name}</dt>
                    <dd>{rp(itemPrice)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt style={{ color: "var(--text-2)" }}>Biaya admin {payment.name}</dt>
                    <dd>{payment.adminFee ? rp(payment.adminFee) : "Gratis"}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-baseline justify-between">
                  <span style={{ color: "var(--text-2)" }}>Total bayar</span>
                  <span className="choice-price text-2xl">{rp(total)}</span>
                </div>
                <button type="submit" className="buy-btn mt-5 min-h-12 w-full">Beli sekarang</button>
                <p className="mt-3 text-xs" style={{ color: "var(--text-2)" }}>
                  Dengan membeli, kamu setuju dengan <Link className="link" href="/syarat">Syarat & Ketentuan</Link>.
                </p>
                <p className="mt-3 flex items-start gap-2 text-xs" style={{ color: "var(--text-2)" }}>
                  <ShieldCheck className="size-4 shrink-0" style={{ color: "var(--ok)" }} />
                  Kami cuma butuh ID akun kamu. Jangan pernah kasih password ke siapa pun.
                </p>
              </div>
            </aside>

            <div className="checkout-bar -mx-4 lg:hidden">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-xs" style={{ color: "var(--text-2)" }}>
                    {nominal.name}, {payment.name}
                  </p>
                  <p className="choice-price text-xl">{rp(total)}</p>
                </div>
                <button type="submit" className="buy-btn min-h-12 shrink-0 px-6">Beli sekarang</button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      {showHelp && (
        <Modal title={`Cara cek ${game.userIdLabel}`} onClose={closeHelp}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{game.guideText}</p>
          <button type="button" onClick={closeHelp} className="btn-primary mt-5 min-h-12 w-full">
            Oke, paham
          </button>
        </Modal>
      )}

      {showConfirm && (
        <Modal title="Cek lagi pesananmu" onClose={closeConfirm}>
          <dl className="divide-y rounded-xl text-sm" style={{ background: "var(--bg-2)", border: "1px solid var(--line)" }}>
            {[
              ["Game", game.name],
              [game.userIdLabel, `${userId}${zoneId ? ` (${zoneId})` : ""}`],
              ["Item", nominal.name],
              ["Pembayaran", payment.name],
              ["WhatsApp", whatsapp],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-2.5" style={{ borderColor: "var(--line)" }}>
                <dt style={{ color: "var(--text-2)" }}>{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-baseline justify-between">
            <span style={{ color: "var(--text-2)" }}>Total bayar</span>
            <span className="choice-price text-2xl">{rp(total)}</span>
          </div>
          <div className="demo-note mt-4" role="note">
            <p>
              <strong>Mode demo.</strong> Pembayaran belum aktif. Kamu akan lihat contoh halaman pembayaran, dan nggak ada uang yang ditagih.
            </p>
          </div>
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={closeConfirm} className="min-h-12 flex-1 rounded-xl font-semibold hover:bg-[var(--panel-2)]" style={{ border: "1.5px solid var(--line)" }}>
              Ubah
            </button>
            <button type="button" onClick={processOrder} className="buy-btn min-h-12 flex-1">
              Lanjut ke pembayaran
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const game = gamesData.find((g) => g.slug === slug && !g.comingSoon);
  return game ? <OrderForm game={game} /> : <GameNotFound slug={slug} />;
}
