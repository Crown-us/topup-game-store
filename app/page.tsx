"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle, Pause, Play, QrCode, ShieldCheck, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameImg from "@/components/GameImg";
import { gamesData, heroBanners, Game } from "@/lib/games";
import { activeFlashSale, FlashSaleItem } from "@/lib/promos";
import { useIsClient, usePrefersReducedMotion } from "@/lib/useClient";

type Cat = "all" | "mobile" | "pc" | "voucher" | "entertainment";

const CATS: { id: Cat; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "mobile", label: "Game mobile" },
  { id: "pc", label: "Game PC" },
  { id: "voucher", label: "Voucher" },
  { id: "entertainment", label: "Hiburan" },
];

/* Slide skins in the TopupKD palette, cycled across banners */
const SKINS = [
  { bg: "linear-gradient(115deg, #4B3DFF 0%, #2A1FB0 100%)", fg: "#FFFFFF", sub: "rgba(255,255,255,.85)", cta: { bg: "#FFD23F", fg: "#1B1500" } },
  { bg: "linear-gradient(115deg, #FFD23F 0%, #F5A524 100%)", fg: "#1B1500", sub: "rgba(27,21,0,.8)", cta: { bg: "#0F0D26", fg: "#FFFFFF" } },
  { bg: "linear-gradient(115deg, #231F55 0%, #4B3DFF 120%)", fg: "#FFFFFF", sub: "rgba(255,255,255,.85)", cta: { bg: "#FFD23F", fg: "#1B1500" } },
];

const AUTOPLAY_MS = 5500;

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
const pad = (n: number) => String(n).padStart(2, "0");
const lowestPrice = (g: Game) => (g.nominals.length ? Math.min(...g.nominals.map((n) => n.price)) : null);
const bySlug = (slug: string) => gamesData.find((g) => g.slug === slug);

function useCountdown(endsAt: string | null) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!endsAt) return;
    const end = new Date(endsAt).getTime();
    const tick = () => setLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  if (left === null) return null;
  return [pad(Math.floor(left / 3600)), pad(Math.floor((left % 3600) / 60)), pad(left % 60)] as const;
}

function BannerCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // null = no explicit choice yet: autoplay unless the visitor prefers reduced motion.
  const [choice, setChoice] = useState<boolean | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const playing = choice ?? !reducedMotion;
  const hovered = useRef(false);

  const slideEls = () => Array.from(trackRef.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? []);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const slides = slideEls();
    if (!track || !slides.length) return;
    const n = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[n].offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (!hovered.current) goTo(active + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [active, playing, goTo]);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <section aria-roledescription="carousel" aria-label="Pilihan utama" className="wrap pt-5 md:pt-7">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerEnter={() => (hovered.current = true)}
        onPointerLeave={() => (hovered.current = false)}
        onFocus={() => (hovered.current = true)}
        onBlur={() => (hovered.current = false)}
        className="carousel"
        aria-live={playing ? "off" : "polite"}
      >
        {heroBanners.map((b, i) => {
          const s = SKINS[i % SKINS.length];
          const game = bySlug(b.gameSlug);
          const from = game ? lowestPrice(game) : null;
          return (
            <article
              key={b.id}
              data-slide
              className="slide"
              style={{ background: s.bg, color: s.fg }}
              aria-roledescription="slide"
              aria-label={`${i + 1} dari ${heroBanners.length}: ${b.title}`}
            >
              <span className="slide-ghost" aria-hidden />
              <div className="min-w-0 pr-4">
                <h2 className="max-w-[18ch] text-xl font-extrabold leading-tight md:text-[2.6rem]">{b.title}</h2>
                <p className="mt-2 hidden max-w-[48ch] md:block" style={{ color: s.sub }}>
                  {b.subtitle}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-6">
                  <Link
                    href={`/order/${b.gameSlug}`}
                    tabIndex={i === active ? 0 : -1}
                    className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold md:px-6"
                    style={{ background: s.cta.bg, color: s.cta.fg }}
                  >
                    {b.btnText}
                  </Link>
                  {from && (
                    <span className="text-sm font-semibold" style={{ color: s.sub }}>
                      Mulai <strong style={{ color: s.fg }}>{rp(from)}</strong>
                    </span>
                  )}
                </div>
              </div>
              <GameImg src={b.image} name={b.title} size={230} priority={i === 0} className="slide-art" />
            </article>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="icon-btn mr-1 !border-transparent !bg-transparent"
            aria-label={playing ? "Jeda geser otomatis" : "Putar geser otomatis"}
            onClick={() => setChoice(!playing)}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          {heroBanners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className="dot"
              aria-current={i === active}
              aria-label={`Ke slide ${i + 1}: ${b.title}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <button type="button" aria-label="Slide sebelumnya" onClick={() => goTo(active - 1)} className="icon-btn">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" aria-label="Slide berikutnya" onClick={() => goTo(active + 1)} className="icon-btn">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/** Renders only when lib/promos.ts holds a real, unexpired promo. */
function FlashSale({ items }: { items: FlashSaleItem[] }) {
  const soonest = items.reduce<string | null>((min, p) => (!min || p.endsAt < min ? p.endsAt : min), null);
  const t = useCountdown(soonest);
  return (
    <section className="flash" aria-labelledby="flash-title">
      <div className="sec-head">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="flash-title" className="sec-title inline-flex items-center gap-2">
            <Zap className="size-5 fill-current" style={{ color: "var(--coin)" }} />
            Flash sale
          </h2>
          {t && (
            <p className="flex items-center gap-1 text-sm" aria-label={`Berakhir dalam ${t[0]} jam ${t[1]} menit ${t[2]} detik`}>
              <span className="mr-1" style={{ color: "var(--text-2)" }}>Berakhir</span>
              <span className="timer-box">{t[0]}</span>:<span className="timer-box">{t[1]}</span>:<span className="timer-box">{t[2]}</span>
            </p>
          )}
        </div>
      </div>
      <div className="no-scrollbar -mx-[18px] flex gap-3 overflow-x-auto px-[18px] pb-1 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {items.map((p) => {
          const game = bySlug(p.gameSlug);
          const item = game?.nominals.find((n) => n.id === p.nominalId);
          if (!game || !item) return null;
          const off = Math.round((1 - p.salePrice / p.normalPrice) * 100);
          return (
            <Link key={`${p.gameSlug}-${p.nominalId}`} href={`/order/${game.slug}`} className="flash-card">
              <div className="flex items-center gap-2">
                <GameImg src={game.image} name={game.shortName} size={32} className="size-8 rounded-lg object-cover text-[10px]" />
                <span className="truncate text-xs" style={{ color: "var(--text-2)" }}>{game.shortName}</span>
              </div>
              <p className="mt-3 line-clamp-2 min-h-[2.5em] text-sm font-bold leading-tight">{item.name}</p>
              <p className="mt-2 text-xs line-through" style={{ color: "var(--mute)" }}>{rp(p.normalPrice)}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="choice-price">{rp(p.salePrice)}</span>
                <span className="off-badge">-{off}%</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function GameTile({ game }: { game: Game }) {
  const inner = (
    <>
      <div className="tile-art">
        <GameImg src={game.image} name={game.shortName} className="h-full w-full object-cover" />
        {game.comingSoon && (
          <span className="absolute inset-0 grid place-items-center bg-black/65 text-xs font-bold">Segera hadir</span>
        )}
      </div>
      <p className="tile-name">{game.shortName}</p>
      <p className="tile-pub">{game.publisher}</p>
    </>
  );
  return game.comingSoon ? (
    <div className="tile opacity-70" aria-label={`${game.name}, segera hadir`}>{inner}</div>
  ) : (
    <Link href={`/order/${game.slug}`} className="tile">
      {inner}
    </Link>
  );
}

export default function Home() {
  const [cat, setCat] = useState<Cat>("all");
  // Promos depend on the clock: read them on the client so an expired one disappears without a rebuild.
  const isClient = useIsClient();
  const promos: FlashSaleItem[] = isClient ? activeFlashSale() : [];

  const popular = gamesData.filter((g) => g.popular && !g.comingSoon).slice(0, 6);
  const list = gamesData.filter((g) => cat === "all" || g.category === cat);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
      <h1 className="sr-only">TopupKD: top up game dan voucher digital</h1>
      <BannerCarousel />

      <div className="wrap space-y-10 py-8 md:space-y-14 md:py-10">
        {promos.length > 0 && <FlashSale items={promos} />}

        <section aria-labelledby="popular-title">
          <div className="sec-head">
            <h2 id="popular-title" className="sec-title">Pilihan kami</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((g) => (
              <Link key={g.id} href={`/order/${g.slug}`} className="pop-card">
                <GameImg src={g.image} name={g.shortName} size={60} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{g.name}</p>
                  <p className="text-xs" style={{ color: "var(--mute)" }}>{g.publisher}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px]" style={{ color: "var(--mute)" }}>Mulai</p>
                  <p className="choice-price text-sm">{rp(lowestPrice(g) ?? 0)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="games" className="scroll-mt-20" aria-labelledby="games-title">
          <div className="sec-head flex-col !items-start md:flex-row md:!items-center">
            <h2 id="games-title" className="sec-title">Semua game & voucher</h2>
            <div className="no-scrollbar -mx-4 flex max-w-[100vw] gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="group" aria-label="Kategori">
              {CATS.map((c) => (
                <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          {list.length === 0 ? (
            <p className="panel p-6 text-sm" style={{ color: "var(--text-2)" }}>
              Belum ada produk di kategori ini.{" "}
              <button type="button" className="link" onClick={() => setCat("all")}>Lihat semua game</button>
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:gap-x-4 lg:grid-cols-6 xl:grid-cols-8">
              {list.map((g) => (
                <GameTile key={g.id} game={g} />
              ))}
            </div>
          )}
        </section>

        {/* Only statements the checkout itself proves: the form asks for an ID, QRIS fee is 0 in the price list, CS is a real WA link. */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Cara belanja di TopupKD">
          {[
            { icon: ShieldCheck, t: "Cukup ID akun", d: "Kami nggak pernah minta password akun game kamu." },
            { icon: QrCode, t: "QRIS tanpa biaya admin", d: "Bayar pakai e-wallet atau m-banking apa pun." },
            { icon: MessageCircle, t: "Tanya lewat WhatsApp", d: "Ada kendala pesanan? Chat CS kami.", href: "https://wa.me/6285117394878" },
          ].map(({ icon: Icon, t, d, href }) => {
            const body = (
              <>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: "var(--cobalt-tint)", color: "var(--link)" }}>
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">{t}</p>
                  <p className="text-xs" style={{ color: "var(--mute)" }}>{d}</p>
                </div>
              </>
            );
            return href ? (
              <a key={t} href={href} target="_blank" rel="noopener noreferrer" className="panel flex items-start gap-3 p-4 hover:border-[var(--mute)]">
                {body}
              </a>
            ) : (
              <div key={t} className="panel flex items-start gap-3 p-4">
                {body}
              </div>
            );
          })}
        </section>
      </div>
      </main>

      <Footer />
    </div>
  );
}
