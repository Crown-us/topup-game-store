import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ orderId: string }> }): Promise<Metadata> {
  const { orderId } = await params;
  return { title: `Invoice ${orderId} | TopupKD` };
}

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
