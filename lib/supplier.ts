/**
 * lib/supplier.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Abstraksi layer supplier API.
 *
 * SEKARANG: Dummy mode — simulasi response supplier pakai data dari games.ts
 *
 * NANTI (real integration):
 *   1. Ganti isi `fetchSupplierProducts()` dengan fetch ke endpoint supplier
 *   2. Map response supplier ke interface `SupplierProduct` di bawah
 *   3. Simpan API key di .env.local:
 *      SUPPLIER_API_KEY=xxx
 *      SUPPLIER_API_URL=https://api.digiflazz.com/v1
 *
 * Contoh real call Digiflazz:
 *   const res = await fetch(`${process.env.SUPPLIER_API_URL}/price-list`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({
 *       cmd: "prepaid",
 *       username: process.env.DIGIFLAZZ_USERNAME,
 *       sign: md5(username + apiKey + "pricelist"),
 *     }),
 *   });
 */

import { gamesData } from "./games";

/** Struktur produk yang dikembalikan supplier */
export interface SupplierProduct {
  /** ID unik produk (harus match dengan nominal id di games.ts untuk mapping) */
  id: string;
  /** Nama deskriptif produk */
  name: string;
  /** Game/layanan yang dilayani */
  gameId: string;
  /** Slug game untuk routing */
  gameSlug: string;
  /** Nama game */
  gameName: string;
  /** Kategori: mobile | pc | voucher | entertainment */
  category: "mobile" | "pc" | "voucher" | "entertainment";
  /** Harga modal dari supplier (sebelum margin) */
  modalPrice: number;
  /** Keterangan jumlah item (misal: "78+8 Bonus") */
  amount: string;
  /** Apakah produk aktif/tersedia dari supplier */
  isAvailable: boolean;
}

/**
 * Fetch semua produk dari supplier.
 *
 * DUMMY MODE: Langsung pakai data dari games.ts dan asumsikan
 * harga modal = 85% dari harga jual sekarang (simulasi).
 * Artinya margin sekitar 15% — kita override nanti lewat margin.ts.
 */
export async function fetchSupplierProducts(): Promise<SupplierProduct[]> {
  // ── DUMMY MODE ──────────────────────────────────────────────────────────
  // Simulasi supplier mengembalikan harga modal.
  // Kita asumsikan modal = price dari games.ts dikurangi margin default
  // (supaya setelah +margin hasilnya sama dengan harga jual sekarang).
  // Nanti replace blok ini dengan real API call.

  const products: SupplierProduct[] = [];

  for (const game of gamesData) {
    // Skip comingSoon — supplier belum support
    if (game.comingSoon) continue;

    for (const nominal of game.nominals) {
      // Simulasi: modal = 85% dari harga jual sekarang (rounded ke ratusan)
      const simulatedModal = Math.round((nominal.price * 0.85) / 100) * 100;

      products.push({
        id: nominal.id,
        name: nominal.name,
        gameId: game.id,
        gameSlug: game.slug,
        gameName: game.name,
        category: game.category,
        modalPrice: simulatedModal,
        amount: nominal.amount,
        isAvailable: true,
      });
    }
  }

  return products;
  // ── END DUMMY MODE ───────────────────────────────────────────────────────
}

/**
 * Fetch satu produk spesifik dari supplier berdasarkan product id.
 * Return null jika tidak ditemukan / tidak tersedia.
 */
export async function fetchSupplierProduct(
  productId: string
): Promise<SupplierProduct | null> {
  const all = await fetchSupplierProducts();
  return all.find((p) => p.id === productId) ?? null;
}

/**
 * Fetch semua produk untuk satu game tertentu.
 */
export async function fetchSupplierProductsByGame(
  gameId: string
): Promise<SupplierProduct[]> {
  const all = await fetchSupplierProducts();
  return all.filter((p) => p.gameId === gameId && p.isAvailable);
}
