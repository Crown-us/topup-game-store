/**
 * app/api/supplier/products/[id]/route.ts
 *
 * GET /api/supplier/products/:id
 *   → Detail satu produk dengan pricing breakdown
 */

import { fetchSupplierProduct } from "@/lib/supplier";
import { applyMargin } from "@/lib/margin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await fetchSupplierProduct(id);

    if (!product) {
      return Response.json(
        { success: false, error: `Produk "${id}" tidak ditemukan di supplier` },
        { status: 404 }
      );
    }

    if (!product.isAvailable) {
      return Response.json(
        { success: false, error: `Produk "${id}" sedang tidak tersedia` },
        { status: 503 }
      );
    }

    const { modalPrice, margin, sellPrice, profitPercent } = applyMargin(
      product.modalPrice,
      product.id,
      product.gameId
    );

    return Response.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        amount: product.amount,
        gameId: product.gameId,
        gameSlug: product.gameSlug,
        gameName: product.gameName,
        category: product.category,
        isAvailable: product.isAvailable,
        pricing: {
          modal_price: modalPrice,
          margin: margin,
          sell_price: sellPrice,
          profit_percent: profitPercent,
        },
      },
    });
  } catch (error) {
    console.error("[/api/supplier/products/[id]] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
