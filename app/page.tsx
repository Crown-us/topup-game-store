"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Smartphone,
  Gamepad2,
  Ticket,
  Tv,
  Zap,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Clock,
  ChevronLeft,
  ChevronRight,
  Headphones,
  BookOpen,
  Send,
  Layers,
  Swords,
  Crosshair,
  Sparkles,
  Compass,
  Target,
  Box,
  Boxes,
  Gem,
  Coins,
  Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  gamesData,
  heroBanners,
  articlesData,
  Game,
} from "@/lib/games";

type TabCategory = "all" | "popular" | "games" | "voucher_entertainment";

const formatRp = (n: number) => "Rp " + n.toLocaleString("id-ID");

interface GenreStyle {
  genre: string;
  bgLight: string;
  border: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  icon: typeof Swords;
}

const GENRE_MAP: Record<string, GenreStyle> = {
  mlbb: { genre: "MOBA 5v5", bgLight: "#EEF2FF", border: "#C7D2FE", accent: "#4F46E5", badgeBg: "#E0E7FF", badgeText: "#4338CA", icon: Swords },
  ff: { genre: "BATTLE ROYALE", bgLight: "#FFF7ED", border: "#FFEDD5", accent: "#EA580C", badgeBg: "#FFEDD5", badgeText: "#C2410C", icon: Flame },
  pubg: { genre: "SURVIVAL FPS", bgLight: "#FEFCE8", border: "#FEF08A", accent: "#CA8A04", badgeBg: "#FEF9C3", badgeText: "#A16207", icon: Crosshair },
  hok: { genre: "GLOBAL MOBA", bgLight: "#EFF6FF", border: "#BFDBFE", accent: "#2563EB", badgeBg: "#DBEAFE", badgeText: "#1D4ED8", icon: Swords },
  genshin: { genre: "OPEN WORLD RPG", bgLight: "#ECFEFF", border: "#A5F3FC", accent: "#0891B2", badgeBg: "#CFFAFE", badgeText: "#0E7490", icon: Sparkles },
  hsr: { genre: "SPACE FANTASY", bgLight: "#F5F3FF", border: "#DDD6FE", accent: "#7C3AED", badgeBg: "#EDE9FE", badgeText: "#6D28D9", icon: Compass },
  cod: { genre: "TACTICAL FPS", bgLight: "#F1F5F9", border: "#CBD5E1", accent: "#475569", badgeBg: "#E2E8F0", badgeText: "#334155", icon: Target },
  aov: { genre: "5V5 ARENA", bgLight: "#FAF5FF", border: "#E9D5FF", accent: "#9333EA", badgeBg: "#F3E8FF", badgeText: "#7E22CE", icon: Zap },
  ragnarok: { genre: "MMORPG", bgLight: "#F0F9FF", border: "#BAE6FD", accent: "#0284C7", badgeBg: "#E0F2FE", badgeText: "#0369A1", icon: Gem },
  coc: { genre: "STRATEGY MMO", bgLight: "#FEFCE8", border: "#FEF08A", accent: "#CA8A04", badgeBg: "#FEF9C3", badgeText: "#A16207", icon: Shield },
  valorant: { genre: "TACTICAL 5V5", bgLight: "#FFF1F2", border: "#FECDD3", accent: "#E11D48", badgeBg: "#FFE4E6", badgeText: "#BE123C", icon: Target },
  steam: { genre: "WALLET IDR", bgLight: "#F0F9FF", border: "#BAE6FD", accent: "#0284C7", badgeBg: "#E0F2FE", badgeText: "#0369A1", icon: Gamepad2 },
  pointblank: { genre: "CLASSIC FPS", bgLight: "#F3F4F6", border: "#E5E7EB", accent: "#4B5563", badgeBg: "#E5E7EB", badgeText: "#374151", icon: Crosshair },
  minecraft: { genre: "SURVIVAL", bgLight: "#ECFDF5", border: "#A7F3D0", accent: "#059669", badgeBg: "#D1FAE5", badgeText: "#047857", icon: Boxes },
  roblox: { genre: "SANDBOX", bgLight: "#FEF2F2", border: "#FECACA", accent: "#DC2626", badgeBg: "#FEE2E2", badgeText: "#B91C1C", icon: Box },
  googleplay: { genre: "GIFT CARD", bgLight: "#ECFDF5", border: "#A7F3D0", accent: "#059669", badgeBg: "#D1FAE5", badgeText: "#047857", icon: Ticket },
  psn: { genre: "PLAYSTATION", bgLight: "#EFF6FF", border: "#BFDBFE", accent: "#2563EB", badgeBg: "#DBEAFE", badgeText: "#1D4ED8", icon: Gamepad2 },
  razergold: { genre: "DIRECT PIN", bgLight: "#ECFDF5", border: "#A7F3D0", accent: "#059669", badgeBg: "#D1FAE5", badgeText: "#047857", icon: Coins },
  vidio: { genre: "STREAMING EPL", bgLight: "#FFF1F2", border: "#FECDD3", accent: "#E11D48", badgeBg: "#FFE4E6", badgeText: "#BE123C", icon: Tv },
  wetv: { genre: "VIP STREAM", bgLight: "#FFF7ED", border: "#FFEDD5", accent: "#EA580C", badgeBg: "#FFEDD5", badgeText: "#C2410C", icon: Tv },
  iqiyi: { genre: "ASIAN DRAMA", bgLight: "#ECFDF5", border: "#A7F3D0", accent: "#059669", badgeBg: "#D1FAE5", badgeText: "#047857", icon: Tv },
  tiktok: { genre: "LIVE COINS", bgLight: "#FDF2F8", border: "#FBCFE8", accent: "#DB2777", badgeBg: "#FCE7F3", badgeText: "#BE185D", icon: Zap },
  bstation: { genre: "ANIME STREAM", bgLight: "#F0F9FF", border: "#BAE6FD", accent: "#0284C7", badgeBg: "#E0F2FE", badgeText: "#0369A1", icon: Tv },
};

const getGenreMeta = (gameId: string): GenreStyle => {
  return (
    GENRE_MAP[gameId] || {
      genre: "GAME",
      bgLight: "#F8FAFC",
      border: "#E2E8F0",
      accent: "#534AB7",
      badgeBg: "#EEF2FF",
      badgeText: "#4338CA",
      icon: Gamepad2,
    }
  );
};

/**
 * Clean Compact Game Card
 * Uses solid semantic genre background + large subtle decorative line icon (NO stock photos)
 */
function CompactGameCard({ game }: { game: Game }) {
  const lowestPrice =
    game.nominals && game.nominals.length > 0
      ? Math.min(...game.nominals.map((n) => n.price))
      : null;

  const meta = getGenreMeta(game.id);
  const LineIcon = meta.icon;

  return (
    <Link
      href={`/order/${game.slug}`}
      className="group flex flex-col justify-between rounded-xl bg-white border border-gray-200 hover:border-[#534AB7] hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Visual Header: Solid Semantic Genre Color + Large Subtle Line-art Decorative Icon */}
      <div
        className="relative aspect-[4/3] w-full p-3 flex flex-col justify-between overflow-hidden border-b border-gray-100"
        style={{ backgroundColor: meta.bgLight }}
      >
        {/* Large subtle decorative line-art in background (NO stock photo) */}
        <LineIcon
          className="absolute -right-2 -bottom-2 size-20 pointer-events-none opacity-10 transition-transform duration-300 group-hover:scale-110"
          style={{ color: meta.accent }}
          strokeWidth={1.5}
        />

        {/* Top: Clean Logo Icon + Genre Tag */}
        <div className="flex items-center justify-between z-10">
          <div
            className="size-8 rounded-lg overflow-hidden shadow-xs bg-white border border-black/5"
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <span
            className="px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider"
            style={{ backgroundColor: meta.badgeBg, color: meta.badgeText }}
          >
            {meta.genre}
          </span>
        </div>

        {/* Bottom Tag (Only if genuinely discounted) */}
        <div className="z-10 flex items-center justify-between">
          {game.discountBadge ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#16A34A] text-white font-mono">
              {game.discountBadge}
            </span>
          ) : (
            <span className="text-[10px] text-gray-500 font-medium truncate">
              {game.publisher}
            </span>
          )}
          <span className="text-[9px] font-mono text-gray-500">
            {game.processTime}
          </span>
        </div>
      </div>

      {/* Card Content Padding */}
      <div className="p-3 flex flex-col justify-between flex-1 bg-white space-y-1.5">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-[#1A1A2E] truncate leading-tight group-hover:text-[#534AB7] transition-colors">
            {game.name}
          </h3>
          <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
            {game.publisher}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-400 block font-mono">Mulai</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#1A1A2E] font-display price-num">
              {lowestPrice ? formatRp(lowestPrice) : "Cek Harga"}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#534AB7] group-hover:translate-x-0.5 transition-transform">
            Top Up →
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Distinct Featured / Popular Horizontal Card Layout
 * (Breaks visual repetition from the compact grid)
 */
function FeaturedPopularCard({ game }: { game: Game }) {
  const lowestPrice =
    game.nominals && game.nominals.length > 0
      ? Math.min(...game.nominals.map((n) => n.price))
      : null;

  const meta = getGenreMeta(game.id);
  const LineIcon = meta.icon;

  return (
    <Link
      href={`/order/${game.slug}`}
      className="group relative p-4 rounded-xl bg-white border border-gray-200 hover:border-[#534AB7] hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      {/* Decorative large low-opacity genre icon in background */}
      <LineIcon
        className="absolute -right-3 -bottom-3 size-24 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity"
        style={{ color: meta.accent }}
        strokeWidth={1.5}
      />

      <div className="space-y-3 z-10">
        <div className="flex items-start justify-between gap-2">
          {/* Logo Image */}
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg overflow-hidden shrink-0 bg-white border border-black/5 shadow-xs">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#1A1A2E] truncate group-hover:text-[#534AB7] transition-colors font-display">
                {game.name}
              </h3>
              <p className="text-[11px] text-[#6B7280] truncate">
                {game.publisher} · {meta.genre}
              </p>
            </div>
          </div>

          {game.discountBadge && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#16A34A] text-white font-mono shrink-0">
              {game.discountBadge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <Zap className="size-3" /> {game.processTime}
          </span>
          <span>·</span>
          <span>{game.soldCount}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between z-10 mt-3">
        <div>
          <span className="text-[10px] text-gray-400 block font-mono">Mulai dari</span>
          <span className="text-sm font-extrabold text-[#1A1A2E] font-display price-num">
            {lowestPrice ? formatRp(lowestPrice) : "Cek Harga"}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#534AB7] hover:bg-[#4338CA] text-white text-xs font-bold transition">
          Beli Sekarang
        </span>
      </div>
    </Link>
  );
}

export default function GamingStorefront() {
  const [activeTab, setActiveTab] = useState<TabCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  // Search filtering
  const filterBySearch = (list: Game[]) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.shortName.toLowerCase().includes(q) ||
        g.publisher.toLowerCase().includes(q)
    );
  };

  const popularGames = filterBySearch(gamesData.filter((g) => g.popular));
  const mobileAndPcGames = filterBySearch(
    gamesData.filter((g) => g.category === "mobile" || g.category === "pc")
  );
  const vouchersAndEntertainment = filterBySearch(
    gamesData.filter(
      (g) => g.category === "voucher" || g.category === "entertainment"
    )
  );

  const categoryTabs: { id: TabCategory; label: string; icon: typeof Layers }[] = [
    { id: "all", label: "Semua Game", icon: Layers },
    { id: "popular", label: "🔥 Populer & Terlaris", icon: Flame },
    { id: "games", label: "Mobile & PC", icon: Smartphone },
    { id: "voucher_entertainment", label: "Voucher & Streaming", icon: Ticket },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A2E] font-sans selection:bg-[#534AB7] selection:text-white">
      {/* ── Top Navigation ── */}
      <Navbar onSearch={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-8 md:space-y-10">
        
        {/* ─── 1. SOLID TWO-TONE INDIGO HERO BANNER (NO STOCK PHOTOS) ─── */}
        <section className="relative rounded-2xl overflow-hidden bg-[#534AB7] text-white shadow-sm border border-indigo-900/10">
          <div className="relative min-h-[200px] sm:min-h-[240px] md:min-h-[260px] w-full flex items-center p-6 sm:p-8 md:p-10">
            {/* Background Two-Tone Geometry & Line-art Motif (No photos) */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#4338CA]/40 -skew-x-12 transform origin-top pointer-events-none" />
            <Swords className="absolute right-8 top-1/2 -translate-y-1/2 size-48 text-white/5 pointer-events-none" strokeWidth={1} />

            {heroBanners.map((banner, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={banner.id}
                  className={`transition-opacity duration-400 ease-in-out w-full max-w-2xl z-10 ${
                    isActive ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-gray-950 font-mono uppercase tracking-wider">
                        <Zap className="size-3 fill-current" />
                        {banner.badge}
                      </span>
                      {banner.promoCode && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/15 border border-white/20 text-white text-[10px] font-mono">
                          Kode: <strong>{banner.promoCode}</strong>
                        </span>
                      )}
                    </div>

                    <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white font-display leading-tight tracking-tight">
                      {banner.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-indigo-100 max-w-xl font-normal leading-relaxed">
                      {banner.subtitle}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <Link
                        href={banner.linkUrl}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#534AB7] font-bold text-xs sm:text-sm tracking-wide shadow-sm transition"
                      >
                        <span>{banner.btnText}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>

                      <span className="text-xs font-bold text-amber-300 font-display">
                        {banner.highlightText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Slider Navigation Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-lg bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-lg bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition"
            >
              <ChevronRight className="size-4" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-xs">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentSlide ? "w-5 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─── 2. CATEGORY FILTER TABS ───────────────────────────────── */}
        <section className="flex items-center justify-between gap-4 border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {categoryTabs.map((cat) => {
              const isActive = activeTab === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#534AB7] text-white shadow-xs"
                      : "bg-white text-[#6B7280] hover:text-[#1A1A2E] hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-mono">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>{gamesData.length} Produk Siap Top Up</span>
          </div>
        </section>

        {/* ─── 3. SECTION 1: POPULER & TERLARIS (Distinct Horizontal Card Grid) ─── */}
        {(activeTab === "all" || activeTab === "popular") && popularGames.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="size-4 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-[#1A1A2E] font-display tracking-tight">
                  Populer &amp; Terlaris
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">Paling sering dibeli</span>
            </div>

            {/* Distinct Featured Horizontal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {popularGames.slice(0, 6).map((game) => (
                <FeaturedPopularCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {/* ─── 4. SECTION 2: MOBILE & PC GAMES (Compact Clean Grid) ─── */}
        {(activeTab === "all" || activeTab === "games") && mobileAndPcGames.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className="size-4 text-[#534AB7]" />
                <h2 className="text-base sm:text-lg font-bold text-[#1A1A2E] font-display tracking-tight">
                  Mobile &amp; PC Games
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">Pilihan game lengkap</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mobileAndPcGames.map((game) => (
                <CompactGameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {/* ─── 5. SECTION 3: VOUCHER & HIBURAN (Clean Horizontal Capsule Tiles) ─── */}
        {(activeTab === "all" || activeTab === "voucher_entertainment") &&
          vouchersAndEntertainment.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="size-4 text-emerald-600" />
                  <h2 className="text-base sm:text-lg font-bold text-[#1A1A2E] font-display tracking-tight">
                    Voucher &amp; Hiburan Streaming
                  </h2>
                </div>
                <span className="text-xs text-gray-500 font-mono">Voucher digital resmi</span>
              </div>

              {/* Clean Horizontal Capsule Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {vouchersAndEntertainment.map((item) => {
                  const lowestPrice =
                    item.nominals && item.nominals.length > 0
                      ? Math.min(...item.nominals.map((n) => n.price))
                      : null;

                  const meta = getGenreMeta(item.id);

                  return (
                    <Link
                      key={item.id}
                      href={`/order/${item.slug}`}
                      className="group p-3 rounded-xl bg-white border border-gray-200 hover:border-[#534AB7] hover:shadow-xs transition-all flex items-center justify-between gap-3"
                    >
                      {/* Left: 32px Emblem */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="size-9 rounded-lg flex items-center justify-center font-display font-black text-xs text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: meta.accent }}
                        >
                          {item.shortName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-[#1A1A2E] truncate group-hover:text-[#534AB7] transition-colors font-display">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-[#6B7280] truncate font-sans">
                            {item.publisher} · {meta.genre}
                          </p>
                        </div>
                      </div>

                      {/* Right: Price Tag */}
                      <div className="text-right shrink-0">
                        <span className="text-[9px] text-gray-400 block font-mono">Mulai</span>
                        <span className="text-xs sm:text-sm font-extrabold text-[#1A1A2E] font-display price-num">
                          {lowestPrice ? formatRp(lowestPrice) : "Cek"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

        {/* ─── 6. COMPACT HORIZONTAL TRUST BAR ─── */}
        <section className="rounded-xl bg-white border border-gray-200 p-4 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex items-center gap-3 pt-1 md:pt-0">
              <Clock className="size-4 text-[#534AB7] shrink-0" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1A1A2E] leading-tight">1–5 Detik</h4>
                <p className="text-[11px] text-[#6B7280]">Otomatis 24 jam nonstop</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 md:pt-0 md:pl-4">
              <QrCode className="size-4 text-[#534AB7] shrink-0" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1A1A2E] leading-tight">QRIS 0% Fee</h4>
                <p className="text-[11px] text-[#6B7280]">Semua e-wallet &amp; bank</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 md:pt-0 md:pl-4">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1A1A2E] leading-tight">100% Legal</h4>
                <p className="text-[11px] text-[#6B7280]">Resmi direct publisher</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 md:pt-0 md:pl-4">
              <Headphones className="size-4 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1A1A2E] leading-tight">CS 24/7</h4>
                <p className="text-[11px] text-[#6B7280]">Bantuan via WhatsApp</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. BLOG & BERITA GAME (SOLID COLOR + LINE ICON, NO STOCK PHOTOS) ─── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-[#534AB7]" />
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A2E] font-display tracking-tight">
                Blog &amp; Berita Game
              </h2>
            </div>
            <a
              href="#"
              className="text-xs font-semibold text-[#534AB7] hover:text-[#4338CA] flex items-center gap-1"
            >
              <span>Semua artikel</span>
              <ArrowRight className="size-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {articlesData.map((article, idx) => {
              const solidBgs = ["#EEF2FF", "#FFF7ED", "#F0FDF4"];
              const solidText = ["#4338CA", "#C2410C", "#15803D"];
              const SolidIcon = idx === 0 ? Flame : idx === 1 ? Sparkles : Swords;

              return (
                <article
                  key={article.id}
                  className="group rounded-xl bg-white border border-gray-200 overflow-hidden hover:border-[#534AB7] hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  {/* Solid Color Thumbnail with Clean Line Icon (NO STOCK PHOTO) */}
                  <div
                    className="relative aspect-[16/9] w-full p-4 flex items-center justify-center overflow-hidden border-b border-gray-100"
                    style={{ backgroundColor: solidBgs[idx % solidBgs.length] }}
                  >
                    <SolidIcon
                      className="size-16 opacity-30 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: solidText[idx % solidText.length] }}
                      strokeWidth={1.5}
                    />
                    <span
                      className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase"
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: solidText[idx % solidText.length],
                      }}
                    >
                      {article.category}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {article.date} · {article.readTime}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#1A1A2E] group-hover:text-[#534AB7] transition-colors line-clamp-2 leading-snug mt-1 font-display">
                        {article.title}
                      </h3>
                      <p className="text-[11px] text-[#6B7280] line-clamp-2 mt-1">
                        {article.excerpt}
                      </p>
                    </div>

                    <span className="pt-2 text-[11px] font-bold text-[#534AB7] flex items-center gap-1">
                      Baca artikel <ArrowRight className="size-3" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ─── 8. SOLID #534AB7 CTA BANNER (NO RAINBOW GRADIENTS) ─── */}
        <section className="rounded-2xl bg-[#534AB7] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              Gabung Saluran Promo WhatsApp
            </h2>
            <p className="text-xs text-indigo-100 max-w-md">
              Dapatkan voucher diskon kilat, giveaway mingguan, dan notifikasi flash sale langsung ke nomor HP kamu.
            </p>
          </div>

          <a
            href="https://wa.me/6285117394878"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#534AB7] font-bold text-xs sm:text-sm shadow-xs transition shrink-0"
          >
            <Send className="size-3.5" />
            <span>Gabung Channel WA</span>
          </a>
        </section>

      </main>

      {/* ─── 9. FOOTER ─── */}
      <footer className="bg-white border-t border-gray-200 pt-10 pb-6 text-[#6B7280] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-[#534AB7] text-white flex items-center justify-center shadow-xs">
                  <Zap className="size-3.5 fill-current" />
                </div>
                <span className="text-base font-bold text-[#1A1A2E] font-display">
                  Topup<span className="text-[#534AB7]">KD</span> Store
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] max-w-sm leading-relaxed">
                Toko top up game dan voucher digital instan 24 jam dengan sistem otomatis dan bebas biaya admin QRIS.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#1A1A2E] uppercase tracking-wider text-[11px] font-display">
                Game Populer
              </h4>
              <ul className="space-y-1 text-[11px] text-[#6B7280]">
                <li><Link href="/order/mobile-legends" className="hover:text-[#534AB7]">Mobile Legends</Link></li>
                <li><Link href="/order/free-fire" className="hover:text-[#534AB7]">Free Fire</Link></li>
                <li><Link href="/order/pubg-mobile" className="hover:text-[#534AB7]">PUBG Mobile</Link></li>
                <li><Link href="/order/valorant" className="hover:text-[#534AB7]">Valorant PC</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#1A1A2E] uppercase tracking-wider text-[11px] font-display">
                Voucher &amp; Hiburan
              </h4>
              <ul className="space-y-1 text-[11px] text-[#6B7280]">
                <li><Link href="/order/vidio" className="hover:text-[#534AB7]">Vidio Premier</Link></li>
                <li><Link href="/order/roblox" className="hover:text-[#534AB7]">Roblox Robux</Link></li>
                <li><Link href="/order/steam-wallet" className="hover:text-[#534AB7]">Steam Wallet IDR</Link></li>
                <li><Link href="/order/tiktok-coins" className="hover:text-[#534AB7]">TikTok Coins</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#1A1A2E] uppercase tracking-wider text-[11px] font-display">
                Bantuan
              </h4>
              <ul className="space-y-1 text-[11px] text-[#6B7280]">
                <li><Link href="/lacak" className="hover:text-[#534AB7]">Lacak Pesanan</Link></li>
                <li><a href="https://wa.me/6285117394878" target="_blank" rel="noopener noreferrer" className="hover:text-[#534AB7]">Hubungi CS WA</a></li>
                <li><Link href="/admin/margin" className="hover:text-[#534AB7]">Admin Panel</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-400">
            <p>© 2026 TopupKD Store. Semua hak cipta dilindungi.</p>
            <p className="font-mono">Direct Publisher API · 100% Guaranteed Safe</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
