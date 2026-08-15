/**
 * app/api/supplier/products/route.ts
 *
 * GET /api/supplier/products
 *   → Semua produk dengan harga modal, margin, dan harga jual
 *
 * GET /api/supplier/products?gameId=mlbb
 *   → Filter per game
 *
 * GET /api/supplier/products?category=mobile
 *   → Filter per kategori
 */

import { type NextRequest } from "next/server";
import { fetchSupplierProducts } from "@/lib/supplier";
import { applyMargin } from "@/lib/margin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const gameIdFilter = searchParams.get("gameId");
    const categoryFilter = searchParams.get("category");

    // Ambil semua produk dari supplier (dummy/real)
    let products = await fetchSupplierProducts();

    // Filter opsional
    if (gameIdFilter) {
      products = products.filter((p) => p.gameId === gameIdFilter);
    }
    if (categoryFilter) {
      products = products.filter((p) => p.category === categoryFilter);
    }

    // Terapkan margin ke setiap produk
    const pricedProducts = products.map((product) => {
      const { modalPrice, margin, sellPrice, profitPercent } = applyMargin(
        product.modalPrice,
        product.id,
        product.gameId
      );

      return {
        id: product.id,
        name: product.name,
        amount: product.amount,
        gameId: product.gameId,
        gameSlug: product.gameSlug,
        gameName: product.gameName,
        category: product.category,
        isAvailable: product.isAvailable,
        pricing: {
          modal_price: modalPrice,     // Harga beli dari supplier
          margin: margin,              // Keuntungan lo per transaksi
          sell_price: sellPrice,       // Harga yang ditampilkan ke customer
          profit_percent: profitPercent,
        },
      };
    });

    // Summary profit total (berguna untuk dashboard admin)
    const totalMargin = pricedProducts.reduce(
      (sum, p) => sum + p.pricing.margin,
      0
    );

    return Response.json({
      success: true,
      count: pricedProducts.length,
      summary: {
        total_products: pricedProducts.length,
        avg_margin: Math.round(totalMargin / (pricedProducts.length || 1)),
      },
      products: pricedProducts,
    });
  } catch (error) {
    console.error("[/api/supplier/products] Error:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data produk dari supplier" },
      { status: 500 }
    );
  }
}
