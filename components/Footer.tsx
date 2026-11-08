import Link from "next/link";

const PAYMENTS = ["QRIS", "DANA", "GoPay", "BCA", "Mandiri", "Alfamart"];
const WA = "https://wa.me/6285117394878";

const linkCls = "inline-flex min-h-11 items-center";

export default function Footer() {
  return (
    <footer className="footer mt-auto">
      <div className="wrap grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="wordmark" style={{ color: "var(--text)" }}>
            Topup<b>KD</b>
          </Link>
          <p className="mt-3 max-w-[42ch] text-sm leading-relaxed">
            Top up game dan voucher digital. Masukkan ID akun, pilih nominal, lalu bayar dengan cara yang paling gampang buat kamu.
          </p>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="buy-btn mt-5 inline-flex min-h-11 items-center px-5 text-sm">
            Chat CS di WhatsApp
          </a>
        </div>

        <nav aria-label="Tautan footer" className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 md:col-span-7">
          <div>
            <h2 className="mb-1 text-sm font-bold" style={{ color: "var(--text)" }}>Game</h2>
            <ul>
              <li><Link className={linkCls} href="/order/mobile-legends">Mobile Legends</Link></li>
              <li><Link className={linkCls} href="/order/free-fire">Free Fire</Link></li>
              <li><Link className={linkCls} href="/order/pubg-mobile">PUBG Mobile</Link></li>
              <li><Link className={linkCls} href="/order/valorant">Valorant</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-1 text-sm font-bold" style={{ color: "var(--text)" }}>Voucher</h2>
            <ul>
              <li><Link className={linkCls} href="/order/steam-wallet">Steam Wallet</Link></li>
              <li><Link className={linkCls} href="/order/roblox">Roblox</Link></li>
              <li><Link className={linkCls} href="/order/vidio">Vidio</Link></li>
              <li><Link className={linkCls} href="/order/tiktok-coins">TikTok Coins</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-1 text-sm font-bold" style={{ color: "var(--text)" }}>Bantuan</h2>
            <ul>
              <li><Link className={linkCls} href="/lacak">Cek transaksi</Link></li>
              <li><a className={linkCls} href={WA} target="_blank" rel="noopener noreferrer">Chat CS WhatsApp</a></li>
              <li><Link className={linkCls} href="/syarat">Syarat & Ketentuan</Link></li>
              <li><Link className={linkCls} href="/privasi">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="wrap border-t py-6" style={{ borderColor: "var(--line)" }}>
        <p className="mb-3 text-xs font-semibold">Metode pembayaran</p>
        <ul className="flex flex-wrap gap-2" aria-label="Metode pembayaran yang tersedia di checkout">
          {PAYMENTS.map((p) => (
            <li key={p} className="pay-chip">{p}</li>
          ))}
        </ul>
        <p className="mt-6 text-xs" style={{ color: "var(--mute)" }}>
          © 2026 TopupKD. Semua merek game adalah milik pemiliknya masing-masing.
        </p>
      </div>
    </footer>
  );
}
