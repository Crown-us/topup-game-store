import type { Metadata } from "next";
import LegalPlaceholder from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Syarat & Ketentuan | TopupKD" };

export default function SyaratPage() {
  return (
    <LegalPlaceholder
      title="Syarat & Ketentuan"
      covers={[
        "Siapa penjual dan cara menghubunginya",
        "Kapan pesanan dianggap berhasil, dan apa yang terjadi kalau User ID salah",
        "Kebijakan refund dan pembatalan",
        "Batas tanggung jawab kalau layanan game sedang gangguan",
      ]}
    />
  );
}
