"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Receipt,
  Zap,
  ShieldCheck,
  QrCode,
  Sparkles,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  X,
  Gamepad2,
  Ticket,
  Tv,
} from "lucide-react";
import { todayStat, gamesData, Game } from "@/lib/games";

export default function Navbar({
  onSearch,
}: {
  onSearch?: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);

    if (val.trim()) {
      const q = val.toLowerCase();
      const matched = gamesData.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.shortName.toLowerCase().includes(q) ||
          g.publisher.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      );
      setSearchResults(matched.slice(0, 6));
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
    onSearch?.("");
  };

  // Close search popover when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-sm">
      {/* ── Top Micro Announcement Bar ── */}
      <div className="w-full bg-[#F3F4F8] border-b border-gray-200/80 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-600">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="text-gray-900 font-semibold font-display">Server Online 24 Jam</span>
            <span className="text-gray-300">·</span>
            <span className="text-[#534AB7] font-semibold">
              {todayStat.totalOrders} order diproses
            </span>
            <span className="text-emerald-600 font-bold">
              ({todayStat.successRate} sukses)
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 font-medium text-gray-600 font-display">
            <span className="flex items-center gap-1">
              <Zap className="size-3 text-[#534AB7]" />
              <span>Instan 1–5 Detik</span>
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1">
              <QrCode className="size-3 text-[#534AB7]" />
              <span>QRIS 0% Fee</span>
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-600" />
              <span>100% Legal &amp; Bergaransi</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Gaming Navbar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="size-9 rounded-xl bg-[#534AB7] text-white flex items-center justify-center shadow-sm">
            <Zap className="size-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-lg font-black tracking-tight text-[#1A1A2E] font-display">
                Topup<span className="text-[#534AB7]">KD</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#EEF2FF] text-[#534AB7] border border-[#E0E7FF] uppercase tracking-wider font-mono">
                Store
              </span>
            </div>
            <span className="block text-[10px] text-gray-500 font-medium tracking-wide mt-0.5 font-sans">
              Portal Game &amp; Voucher No. 1
            </span>
          </div>
        </Link>

        {/* ── Center Prominent Search Bar ── */}
        <div ref={dropdownRef} className="relative flex-1 max-w-xl hidden sm:block">
          <div
            className={`relative rounded-xl transition-all duration-200 ${
              isFocused
                ? "ring-2 ring-[#534AB7] bg-white shadow-md border-transparent"
                : "border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300"
            }`}
          >
            <div className="relative flex items-center">
              <Search
                className={`size-4 absolute left-3.5 transition-colors ${
                  isFocused ? "text-[#534AB7]" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                placeholder="Cari game, voucher, streaming, atau produk disini..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-medium bg-transparent text-[#1A1A2E] placeholder:text-gray-400 outline-none font-sans"
              />
              {query ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="size-3.5" />
                </button>
              ) : (
                <kbd className="absolute right-3 inline-flex h-5 select-none items-center gap-0.5 rounded border border-gray-200 bg-white px-1.5 font-mono text-[10px] font-semibold text-gray-400">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Instant Search Popup Results */}
          {isFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 max-h-96 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center justify-between border-b border-gray-100">
                <span>Hasil Pencarian ({searchResults.length})</span>
                <span className="text-[#534AB7] font-bold">Klik untuk order</span>
              </div>
              {searchResults.map((g) => {
                const lowest =
                  g.nominals && g.nominals.length > 0
                    ? Math.min(...g.nominals.map((n) => n.price))
                    : 0;

                return (
                  <Link
                    key={g.id}
                    href={`/order/${g.slug}`}
                    onClick={() => setIsFocused(false)}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[#534AB7] font-display font-bold text-xs shrink-0">
                        {g.shortName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#1A1A2E] group-hover:text-[#534AB7] truncate font-display">
                          {g.name}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate font-sans">
                          {g.publisher} · {g.category.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-gray-400 font-mono">Mulai</div>
                      <div className="text-xs font-black text-amber-600 font-display price-num">
                        Rp {lowest.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right Action Buttons ── */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/margin"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 transition-all font-display"
          >
            <SlidersHorizontal className="size-3.5 text-[#534AB7]" />
            <span>Admin</span>
          </Link>

          <Link
            href="/lacak"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 transition font-display"
          >
            <Receipt className="size-3.5 text-gray-500" />
            <span className="hidden sm:inline">Lacak Order</span>
          </Link>

          <a
            href="https://wa.me/6285117394878"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#534AB7] hover:bg-[#4338CA] text-white shadow-sm transition-all font-display"
          >
            <Sparkles className="size-3.5" />
            <span>CS 24/7</span>
          </a>
        </div>
      </div>
    </header>
  );
}

