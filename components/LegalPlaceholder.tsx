import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * TODO(owner): replace with the real legal text before taking real payments.
 * The page says plainly that the text is missing instead of shipping invented terms.
 */
export default function LegalPlaceholder({ title, covers }: { title: string; covers: string[] }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="wrap flex-1 py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <div className="demo-note mt-6" role="note">
            <p>
              <strong>Belum diisi.</strong> Teks resmi halaman ini masih disiapkan pemilik toko. Sampai teks ini ada,
              TopupKD belum menerima pembayaran sungguhan.
            </p>
          </div>
          <h2 className="mt-8 text-lg font-bold">Yang akan dibahas di halaman ini</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5" style={{ color: "var(--text-2)" }}>
            {covers.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-8 text-sm" style={{ color: "var(--text-2)" }}>
            Ada pertanyaan sekarang?{" "}
            <a className="link" href="https://wa.me/6285117394878" target="_blank" rel="noopener noreferrer">
              Chat CS di WhatsApp
            </a>{" "}
            atau{" "}
            <Link className="link" href="/">
              kembali ke beranda
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
