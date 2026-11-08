import type { Metadata } from "next";
import { gamesData } from "@/lib/games";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = gamesData.find((g) => g.slug === slug && !g.comingSoon);
  return { title: game ? `Top up ${game.name} | TopupKD` : "Game nggak ketemu | TopupKD" };
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
