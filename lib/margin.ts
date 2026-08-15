/**
 * lib/margin.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Konfigurasi margin reseller. Ganti nilai-nilai di bawah sesuai kebutuhan.
 *
 * Priority lookup (dari tertinggi ke terendah):
 *   1. byProductId   → override per item spesifik
 *   2. byCategory    → override per kategori game
 *   3. default       → fallback semua produk
 */

export interface MarginConfig {
  /** Default flat margin (Rp) untuk semua produk */
  default: number;

  /** Override margin per kategori game (game id, bukan slug) */
  byCategory: Record<string, number>;

  /** Override margin per nominal item (product id di dalam game) */
  byProductId: Record<string, number>;
}

/** ─── EDIT MARGIN LO DI SINI ──────────────────────────────────────────── */
export const MARGIN_CONFIG: MarginConfig = {
  default: 2000, // Rp 2.000 untuk semua produk (fallback)

  byCategory: {
    mlbb: 3000,      // Mobile Legends → margin Rp 3.000
    ff: 2500,        // Free Fire      → Rp 2.500
    pubg: 2000,      // PUBG           → Rp 2.000
    hok: 2000,       // Honor of Kings → Rp 2.000
    genshin: 3000,   // Genshin Impact → Rp 3.000
    hsr: 2500,       // Honkai SR      → Rp 2.500
    cod: 2000,
    aov: 1500,
    ragnarok: 2000,
    valorant: 3000,  // Valorant PC    → Rp 3.000
    roblox: 2500,
    growtopia: 1500,
    zzz: 2500,
    pointblank: 1500,
    minecraft: 2000,
    coc: 2000,
    steam: 2000,
  },

  byProductId: {
    // Produk dengan margin custom khusus
    "ml-pass": 5000,   // Weekly Diamond Pass → lebih mahal, margin lebih gede
    "gi-welkin": 5000, // Blessing Welkin Moon
    "ff-720": 3500,    // FF 720 Diamonds
  },
};
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Hasil kalkulasi margin untuk satu produk
 */
export interface MarginResult {
  modalPrice: number;     // Harga beli dari supplier
  margin: number;         // Selisih yang jadi profit lo
  sellPrice: number;      // Harga jual ke customer
  profitPercent: string;  // "17.6%"
}

/**
 * Hitung margin + sell price dari harga modal supplier.
 *
 * @param modalPrice  - Harga modal dari supplier (Rp)
 * @param productId   - ID produk (misal: "ml-86", "ff-140")
 * @param gameId      - ID game / kategori (misal: "mlbb", "ff")
 */
export function applyMargin(
  modalPrice: number,
  productId: string,
  gameId: string
): MarginResult {
  // 1. Cek override per-produk
  let margin = MARGIN_CONFIG.byProductId[productId];

  // 2. Fallback ke per-kategori
  if (margin === undefined) {
    margin = MARGIN_CONFIG.byCategory[gameId];
  }

  // 3. Fallback ke default
  if (margin === undefined) {
    margin = MARGIN_CONFIG.default;
  }

  const sellPrice = modalPrice + margin;
  const profitPercent = ((margin / modalPrice) * 100).toFixed(1) + "%";

  return { modalPrice, margin, sellPrice, profitPercent };
}

/**
 * Hitung total estimasi profit harian (semua produk × volume penjualan)
 * Utility untuk dashboard admin.
 */
export function estimateDailyProfit(
  items: Array<{ modalPrice: number; productId: string; gameId: string; volume: number }>
): number {
  return items.reduce((total, item) => {
    const { margin } = applyMargin(item.modalPrice, item.productId, item.gameId);
    return total + margin * item.volume;
  }, 0);
}
