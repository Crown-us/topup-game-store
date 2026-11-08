/**
 * Real promotions only. The home flash sale, crossed-out prices, and discount
 * badges render from this list and nothing else, so an empty list means no
 * promo UI at all. Add an entry only for a promo you will actually honour:
 * `normalPrice` must be the price the item really sold at before the promo.
 */
export interface FlashSaleItem {
  gameSlug: string;
  nominalId: string;
  normalPrice: number;
  salePrice: number;
  /** ISO date-time when the promo ends; the countdown runs to this moment */
  endsAt: string;
}

export const flashSale: FlashSaleItem[] = [];

/** Promos still running at `now`, so an expired entry never shows a dead countdown. */
export function activeFlashSale(now: Date = new Date()): FlashSaleItem[] {
  return flashSale.filter((p) => new Date(p.endsAt).getTime() > now.getTime());
}

export function promoFor(gameSlug: string, nominalId: string, now: Date = new Date()): FlashSaleItem | undefined {
  return activeFlashSale(now).find((p) => p.gameSlug === gameSlug && p.nominalId === nominalId);
}
