import type { Metadata } from "next";
import LegalPlaceholder from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Kebijakan Privasi | TopupKD" };

export default function PrivasiPage() {
  return (
    <LegalPlaceholder
      title="Kebijakan Privasi"
      covers={[
        "Data yang kami simpan: ID akun game, nomor WhatsApp, dan riwayat pesanan",
        "Untuk apa data itu dipakai, dan berapa lama disimpan",
        "Pihak lain yang menerima data (penyedia pembayaran dan supplier item)",
        "Cara minta data kamu dihapus",
      ]}
    />
  );
}
