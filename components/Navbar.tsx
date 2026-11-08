"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Receipt, Search, X } from "lucide-react";
import { gamesData } from "@/lib/games";
import GameImg from "@/components/GameImg";

function SearchBox({ autoFocus, onPick }: { autoFocus?: boolean; onPick?: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? gamesData
        .filter((g) => [g.name, g.shortName, g.publisher].some((v) => v.toLowerCase().includes(q)))
        .slice(0, 6)
    : [];

  return (
    <div ref={boxRef} className="relative w-full">
      <label className="search">
        <Search className="size-4 shrink-0" style={{ color: "var(--mute)" }} />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Cari game atau voucher"
          aria-label="Cari game atau voucher"
        />
        {query && (
          <button type="button" aria-label="Hapus pencarian" onClick={() => setQuery("")} className="tap -mr-3">
            <X className="size-4" style={{ color: "var(--mute)" }} />
          </button>
        )}
      </label>

      {open && q && (
        <div className="dropdown">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm" style={{ color: "var(--text-2)" }}>
              &ldquo;{query}&rdquo; belum tersedia. Coba nama game lain.
            </p>
          ) : (
            <ul>
              {results.map((g) => (
                <li key={g.id}>
                  <Link
                    href={g.comingSoon ? "#" : `/order/${g.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                      onPick?.();
                    }}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--panel-2)]"
                  >
                    <GameImg src={g.image} name={g.shortName} size={36} className="size-9 rounded-lg object-cover text-xs" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{g.name}</span>
                      <span className="block text-xs" style={{ color: "var(--mute)" }}>
                        {g.comingSoon ? "Segera hadir" : g.publisher}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <header className="nav">
      <div className="wrap flex h-16 items-center gap-4 md:gap-8">
        <Link href="/" className="wordmark shrink-0" aria-label="TopupKD, ke beranda">
          Topup<b>KD</b>
        </Link>

        <div className="hidden max-w-xl flex-1 md:block">
          <SearchBox />
        </div>

        <nav className="ml-auto flex items-center gap-2 sm:gap-5">
          <Link href="/lacak" className="nav-link inline-flex min-h-11 items-center gap-1.5">
            <Receipt className="size-4" />
            <span>Cek transaksi</span>
          </Link>
          <a
            href="https://wa.me/6285117394878"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link hidden min-h-11 items-center lg:inline-flex"
          >
            Bantuan
          </a>
          <button
            type="button"
            className="icon-btn md:hidden"
            aria-label={mobileSearch ? "Tutup pencarian" : "Cari game"}
            aria-expanded={mobileSearch}
            onClick={() => setMobileSearch((v) => !v)}
          >
            {mobileSearch ? <X className="size-4" /> : <Search className="size-4" />}
          </button>
        </nav>
      </div>

      {mobileSearch && (
        <div className="wrap pb-3 md:hidden">
          <SearchBox autoFocus onPick={() => setMobileSearch(false)} />
        </div>
      )}
    </header>
  );
}
