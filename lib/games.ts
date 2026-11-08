export interface NominalItem {
  id: string;
  name: string;
  amount: string;
  bonus?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  popular?: boolean;
  tag?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: "qris" | "ewallet" | "va" | "retail";
  fee?: string;
  badge?: string;
  adminFee: number;
  promoText?: string;
}

export interface Game {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  publisher: string;
  category: "mobile" | "pc" | "voucher" | "entertainment";
  image: string;
  iconBg: string;
  popular: boolean;
  hot?: boolean;
  discountBadge?: string;
  comingSoon?: boolean;
  rating: string;
  soldCount: string;
  processTime: string;
  hasZoneId: boolean;
  zoneIdLabel?: string;
  userIdLabel: string;
  guideText: string;
  nominals: NominalItem[];
}

/**
 * Home banner. Only describe what the store really offers: no discount, promo
 * code, or speed claim unless it is backed by real pricing or a working code field.
 */
export interface HeroBanner {
  id: string;
  /** slug of the game the banner sells; the starting price is read from its nominals */
  gameSlug: string;
  title: string;
  subtitle: string;
  image: string;
  btnText: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  readTime: string;
}

export const heroBanners: HeroBanner[] = [
  {
    id: "mlbb",
    gameSlug: "mobile-legends",
    title: "Diamond Mobile Legends",
    subtitle: "Cukup User ID dan Zone ID, tanpa password. Bayar pakai QRIS tanpa biaya admin.",
    image: "/logos/mobile-legends.png",
    btnText: "Pilih nominal diamond",
  },
  {
    id: "ff",
    gameSlug: "free-fire",
    title: "Diamond Free Fire",
    subtitle: "Masukkan Player ID, pilih jumlah diamond, lalu bayar pakai QRIS, e-wallet, atau transfer bank.",
    image: "/logos/free-fire.png",
    btnText: "Pilih nominal diamond",
  },
  {
    id: "vidio",
    gameSlug: "vidio",
    title: "Langganan Vidio",
    subtitle: "Pilih paket Vidio, isi akunmu, dan bayar dengan cara yang paling gampang buat kamu.",
    image: "/logos/vidio.png",
    btnText: "Pilih paket Vidio",
  },
];

export const gamesData: Game[] = [
  /* ─── POPULAR / MOBILE ─────────────────────────────────── */
  {
    id: "mlbb",
    slug: "mobile-legends",
    name: "Mobile Legends: Bang Bang",
    shortName: "Mobile Legends",
    publisher: "Moonton",
    category: "mobile",
    popular: true,
    hot: true,
    discountBadge: "-15%",
    rating: "4.9",
    soldCount: "128.4k terjual",
    processTime: "1–5 Detik",
    image: "/logos/mobile-legends.png",
    iconBg: "#1A3C8C",
    userIdLabel: "User ID",
    hasZoneId: true,
    zoneIdLabel: "Zone ID (Server)",
    guideText: "Buka Mobile Legends → tap foto profil kiri atas. User ID & Zone ID tertera di bawah nama (format: 12345678 (1234)).",
    nominals: [
      { id: "ml-pass",  name: "Weekly Diamond Pass", amount: "210 Diamonds",    price: 28500,  originalPrice: 32000,  discountPercent: 11, popular: true, tag: "TERLARIS" },
      { id: "ml-86",   name: "86 Diamonds",          amount: "78+8 Bonus",      price: 20000,  originalPrice: 23000,  discountPercent: 13 },
      { id: "ml-172",  name: "172 Diamonds",         amount: "156+16 Bonus",    price: 40000,  originalPrice: 45000,  discountPercent: 11 },
      { id: "ml-257",  name: "257 Diamonds",         amount: "234+23 Bonus",    price: 60000,  originalPrice: 68000,  discountPercent: 12, popular: true, tag: "PALING LARIS" },
      { id: "ml-344",  name: "344 Diamonds",         amount: "312+32 Bonus",    price: 80000,  originalPrice: 90000,  discountPercent: 11 },
      { id: "ml-706",  name: "706 Diamonds",         amount: "625+81 Bonus",    price: 160000, originalPrice: 180000, discountPercent: 11, popular: true },
      { id: "ml-2195", name: "2195 Diamonds",        amount: "1860+335 Bonus",  price: 490000, originalPrice: 550000, discountPercent: 11 },
    ],
  },
  {
    id: "ff",
    slug: "free-fire",
    name: "Free Fire",
    shortName: "Free Fire",
    publisher: "Garena",
    category: "mobile",
    popular: true,
    hot: true,
    discountBadge: "-20%",
    rating: "4.9",
    soldCount: "95.2k terjual",
    processTime: "1–3 Detik",
    image: "/logos/free-fire.png",
    iconBg: "#D14F00",
    userIdLabel: "Player ID",
    hasZoneId: false,
    guideText: "Buka Free Fire → tap ikon profil kiri atas. Player ID 8–10 digit di bawah nama karakter.",
    nominals: [
      { id: "ff-50",   name: "50 Diamonds",   amount: "50 Diamonds",   price: 8000,   originalPrice: 10000,  discountPercent: 20 },
      { id: "ff-140",  name: "140 Diamonds",  amount: "140 Diamonds",  price: 20000,  originalPrice: 24000,  discountPercent: 16, popular: true, tag: "TERLARIS" },
      { id: "ff-355",  name: "355 Diamonds",  amount: "355 Diamonds",  price: 50000,  originalPrice: 58000,  discountPercent: 14 },
      { id: "ff-720",  name: "720 Diamonds",  amount: "720 Diamonds",  price: 100000, originalPrice: 115000, discountPercent: 13, popular: true },
      { id: "ff-1450", name: "1450 Diamonds", amount: "1450 Diamonds", price: 200000, originalPrice: 230000, discountPercent: 13 },
    ],
  },
  {
    id: "pubg",
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    shortName: "PUBG Mobile",
    publisher: "Tencent Games",
    category: "mobile",
    popular: true,
    discountBadge: "-10%",
    rating: "4.8",
    soldCount: "74.1k terjual",
    processTime: "3–5 Detik",
    image: "/logos/pubg-mobile.png",
    iconBg: "#C59820",
    userIdLabel: "Character ID",
    hasZoneId: false,
    guideText: "Buka statistik karakter PUBG Mobile. Character ID 9–11 digit di halaman profil.",
    nominals: [
      { id: "pubg-60",   name: "60 UC",   amount: "60 UC",          price: 14500,  originalPrice: 17000,  discountPercent: 14 },
      { id: "pubg-325",  name: "325 UC",  amount: "300+25 Bonus",   price: 72000,  originalPrice: 80000,  discountPercent: 10, popular: true, tag: "POPULER" },
      { id: "pubg-660",  name: "660 UC",  amount: "600+60 Bonus",   price: 145000, originalPrice: 160000, discountPercent: 9 },
      { id: "pubg-1800", name: "1800 UC", amount: "1500+300 Bonus", price: 360000, originalPrice: 400000, discountPercent: 10 },
    ],
  },
  {
    id: "hok",
    slug: "honor-of-kings",
    name: "Honor of Kings",
    shortName: "Honor of Kings",
    publisher: "Level Infinite",
    category: "mobile",
    popular: true,
    discountBadge: "-12%",
    rating: "4.9",
    soldCount: "42.8k terjual",
    processTime: "2–5 Detik",
    image: "/logos/honor-of-kings.png",
    iconBg: "#9B1B1B",
    userIdLabel: "UID / Player ID",
    hasZoneId: false,
    guideText: "Salin UID dari halaman profil Honor of Kings kamu.",
    nominals: [
      { id: "hok-80",  name: "80 Tokens",  amount: "80+8 Bonus",   price: 15000,  originalPrice: 18000, discountPercent: 16 },
      { id: "hok-240", name: "240 Tokens", amount: "240+24 Bonus", price: 44000,  originalPrice: 50000, discountPercent: 12, popular: true, tag: "TERLARIS" },
      { id: "hok-400", name: "400 Tokens", amount: "400+45 Bonus", price: 73000,  originalPrice: 82000, discountPercent: 11 },
      { id: "hok-800", name: "800 Tokens", amount: "800+95 Bonus", price: 146000, originalPrice: 165000, discountPercent: 11 },
    ],
  },
  {
    id: "genshin",
    slug: "genshin-impact",
    name: "Genshin Impact",
    shortName: "Genshin Impact",
    publisher: "HoYoverse",
    category: "mobile",
    popular: true,
    discountBadge: "-11%",
    rating: "4.9",
    soldCount: "38.1k terjual",
    processTime: "5–10 Detik",
    image: "/logos/genshin-impact.png",
    iconBg: "#2E6B9E",
    userIdLabel: "UID",
    hasZoneId: true,
    zoneIdLabel: "Server Region",
    guideText: "UID tertera di sudut kanan bawah layar Genshin Impact (9 digit).",
    nominals: [
      { id: "gi-welkin", name: "Blessing Welkin Moon", amount: "300 Genesis+2700 Primogems", price: 79000, originalPrice: 89000, discountPercent: 11, popular: true, tag: "REKOMENDASI" },
      { id: "gi-60",     name: "60 Genesis Crystals",  amount: "60 Crystals",               price: 16000, originalPrice: 18000, discountPercent: 11 },
      { id: "gi-330",    name: "330 Genesis Crystals", amount: "300+30 Bonus",               price: 79000, originalPrice: 88000, discountPercent: 10 },
      { id: "gi-1090",   name: "1090 Genesis Crystals",amount: "980+110 Bonus",              price: 239000, originalPrice: 265000, discountPercent: 10 },
    ],
  },
  {
    id: "hsr",
    slug: "honkai-star-rail",
    name: "Honkai: Star Rail",
    shortName: "Star Rail",
    publisher: "HoYoverse",
    category: "mobile",
    popular: false,
    rating: "4.9",
    soldCount: "21.3k terjual",
    processTime: "5–10 Detik",
    image: "/logos/honkai-star-rail.png",
    iconBg: "#1A1A2E",
    userIdLabel: "UID",
    hasZoneId: true,
    zoneIdLabel: "Server",
    guideText: "UID tertera di pojok kiri bawah layar Honkai: Star Rail.",
    nominals: [
      { id: "hsr-60",   name: "60 Oneiric Shards",   amount: "60 Shards",      price: 16000,  originalPrice: 18000,  discountPercent: 11 },
      { id: "hsr-330",  name: "330 Oneiric Shards",  amount: "300+30 Bonus",   price: 79000,  originalPrice: 88000,  discountPercent: 10, popular: true, tag: "VALUE" },
      { id: "hsr-1090", name: "1090 Oneiric Shards", amount: "980+110 Bonus",  price: 239000, originalPrice: 265000, discountPercent: 10 },
    ],
  },
  {
    id: "cod",
    slug: "call-of-duty-mobile",
    name: "Call of Duty: Mobile",
    shortName: "CoD Mobile",
    publisher: "Activision",
    category: "mobile",
    popular: false,
    rating: "4.7",
    soldCount: "15.8k terjual",
    processTime: "3–5 Detik",
    image: "/logos/call-of-duty-mobile.png",
    iconBg: "#1C3A5E",
    userIdLabel: "Player ID",
    hasZoneId: false,
    guideText: "Buka CoD Mobile → profil → salin Player ID di bawah nama.",
    nominals: [
      { id: "cod-80",  name: "80 CP",  amount: "80 CoD Points",  price: 15000,  originalPrice: 17000,  discountPercent: 11 },
      { id: "cod-400", name: "400 CP", amount: "400 CoD Points", price: 72000,  originalPrice: 80000,  discountPercent: 10, popular: true },
      { id: "cod-800", name: "800 CP", amount: "800 CoD Points", price: 143000, originalPrice: 160000, discountPercent: 11 },
    ],
  },
  {
    id: "aov",
    slug: "arena-of-valor",
    name: "Arena of Valor",
    shortName: "Arena of Valor",
    publisher: "Level Infinite",
    category: "mobile",
    popular: false,
    rating: "4.7",
    soldCount: "12.5k terjual",
    processTime: "3–5 Detik",
    image: "/logos/arena-of-valor.png",
    iconBg: "#6B21A8",
    userIdLabel: "Player ID",
    hasZoneId: false,
    guideText: "Buka profil Arena of Valor. Player ID tertera di bawah nama karakter.",
    nominals: [
      { id: "aov-50",  name: "50 Vouchers",  amount: "50 Vouchers",  price: 12000, originalPrice: 14000, discountPercent: 14 },
      { id: "aov-100", name: "100 Vouchers", amount: "100 Vouchers", price: 22000, originalPrice: 26000, discountPercent: 15, popular: true },
      { id: "aov-250", name: "250 Vouchers", amount: "250 Vouchers", price: 55000, originalPrice: 63000, discountPercent: 13 },
    ],
  },
  {
    id: "ragnarok",
    slug: "ragnarok-m",
    name: "Ragnarok M: Eternal Love",
    shortName: "Ragnarok M",
    publisher: "Gravity",
    category: "mobile",
    popular: false,
    rating: "4.6",
    soldCount: "9.2k terjual",
    processTime: "5–10 Detik",
    image: "/logos/ragnarok-m.png",
    iconBg: "#0070B8",
    userIdLabel: "Character ID",
    hasZoneId: true,
    zoneIdLabel: "Server",
    guideText: "Buka Ragnarok M → menu → salin Character ID dari halaman profil.",
    nominals: [
      { id: "rom-100", name: "100 Kafra Coins", amount: "100 Coins", price: 14000, originalPrice: 16000, discountPercent: 12 },
      { id: "rom-300", name: "300 Kafra Coins", amount: "300 Coins", price: 40000, originalPrice: 46000, discountPercent: 13, popular: true },
      { id: "rom-600", name: "600 Kafra Coins", amount: "600 Coins", price: 79000, originalPrice: 89000, discountPercent: 11 },
    ],
  },
  {
    id: "coc",
    slug: "clash-of-clans",
    name: "Clash of Clans",
    shortName: "Clash of Clans",
    publisher: "Supercell",
    category: "mobile",
    popular: false,
    rating: "4.8",
    soldCount: "14.1k terjual",
    processTime: "5–10 Detik",
    image: "/logos/clash-of-clans.png",
    iconBg: "#CA8A04",
    userIdLabel: "Player Tag (#XXXXXX)",
    hasZoneId: false,
    guideText: "Buka profil akun Clash of Clans. Player Tag tertera di bawah nama (diawali #).",
    nominals: [
      { id: "coc-80",  name: "80 Gems",   amount: "80 Gems",   price: 15000, originalPrice: 17000, discountPercent: 11 },
      { id: "coc-500", name: "500 Gems",  amount: "500 Gems",  price: 79000, originalPrice: 89000, discountPercent: 11, popular: true },
    ],
  },

  /* ─── PC GAMES ─────────────────────────────────────────── */
  {
    id: "valorant",
    slug: "valorant",
    name: "Valorant (PC)",
    shortName: "Valorant",
    publisher: "Riot Games",
    category: "pc",
    popular: true,
    discountBadge: "-10%",
    rating: "4.8",
    soldCount: "18.9k terjual",
    processTime: "5–10 Detik",
    image: "/logos/valorant.png",
    iconBg: "#FF4655",
    userIdLabel: "Riot ID (username#tag)",
    hasZoneId: false,
    guideText: "Masukkan Riot ID dalam format: NamaKamu#ID (contoh: Kevindwi#1234).",
    nominals: [
      { id: "vp-125",  name: "125 VP",  amount: "125 Valorant Points", price: 15000,  originalPrice: 17000,  discountPercent: 11 },
      { id: "vp-420",  name: "420 VP",  amount: "420 Valorant Points", price: 50000,  originalPrice: 56000,  discountPercent: 11, popular: true, tag: "TERLARIS" },
      { id: "vp-1000", name: "1000 VP", amount: "1000 VP",             price: 120000, originalPrice: 133000, discountPercent: 10 },
      { id: "vp-2050", name: "2050 VP", amount: "2050 VP",             price: 240000, originalPrice: 266000, discountPercent: 10 },
    ],
  },
  {
    id: "steam",
    slug: "steam-wallet",
    name: "Steam Wallet Code IDR",
    shortName: "Steam Wallet",
    publisher: "Valve",
    category: "pc",
    popular: true,
    discountBadge: "-8%",
    rating: "4.9",
    soldCount: "45.2k terjual",
    processTime: "1–5 Detik",
    image: "/logos/steam-wallet.png",
    iconBg: "#1B2838",
    userIdLabel: "Nomor WhatsApp / Email",
    hasZoneId: false,
    guideText: "Kode voucher Steam akan dikirimkan otomatis ke WhatsApp & Email setelah bayar.",
    nominals: [
      { id: "steam-12k",  name: "Rp 12.000",  amount: "Steam Wallet IDR 12.000",  price: 14000, originalPrice: 16000, discountPercent: 12 },
      { id: "steam-50k",  name: "Rp 50.000",  amount: "Steam Wallet IDR 50.000",  price: 54000, originalPrice: 59000, discountPercent: 8, popular: true },
      { id: "steam-100k", name: "Rp 100.000", amount: "Steam Wallet IDR 100.000", price: 108000, originalPrice: 118000, discountPercent: 8 },
      { id: "steam-250k", name: "Rp 250.000", amount: "Steam Wallet IDR 250.000", price: 269000, originalPrice: 285000, discountPercent: 6 },
    ],
  },
  {
    id: "pointblank",
    slug: "point-blank",
    name: "Point Blank Zepetto",
    shortName: "Point Blank",
    publisher: "Zepetto",
    category: "pc",
    popular: false,
    rating: "4.7",
    soldCount: "11.2k terjual",
    processTime: "3–5 Detik",
    image: "/logos/point-blank.png",
    iconBg: "#374151",
    userIdLabel: "PB User ID",
    hasZoneId: false,
    guideText: "Buka Point Blank → profil → salin User ID akun.",
    nominals: [
      { id: "pb-1200", name: "1.200 PB Cash", amount: "1.200 PB Cash", price: 11000, originalPrice: 13000, discountPercent: 15 },
      { id: "pb-2400", name: "2.400 PB Cash", amount: "2.400 PB Cash", price: 21500, originalPrice: 25000, discountPercent: 14, popular: true },
      { id: "pb-6000", name: "6.000 PB Cash", amount: "6.000 PB Cash", price: 53000, originalPrice: 60000, discountPercent: 12 },
    ],
  },
  {
    id: "minecraft",
    slug: "minecraft",
    name: "Minecraft Minecoins",
    shortName: "Minecraft",
    publisher: "Mojang",
    category: "pc",
    popular: false,
    rating: "4.8",
    soldCount: "7.9k terjual",
    processTime: "5–10 Detik",
    image: "/logos/minecraft.png",
    iconBg: "#16A34A",
    userIdLabel: "Minecraft Gamertag / Email",
    hasZoneId: false,
    guideText: "Masukkan Gamertag Xbox / Microsoft akun Minecraft kamu.",
    nominals: [
      { id: "mc-320",  name: "320 Minecoins",  amount: "320 Minecoins",  price: 39000, originalPrice: 44000, discountPercent: 11 },
      { id: "mc-1020", name: "1020 Minecoins", amount: "1020 Minecoins", price: 109000, originalPrice: 125000, discountPercent: 12, popular: true },
    ],
  },

  /* ─── VOUCHERS ─────────────────────────────────────────── */
  {
    id: "roblox",
    slug: "roblox",
    name: "Roblox Gift Card & Robux",
    shortName: "Roblox",
    publisher: "Roblox Corporation",
    category: "voucher",
    popular: true,
    discountBadge: "-12%",
    rating: "4.8",
    soldCount: "31.6k terjual",
    processTime: "1–5 Detik",
    image: "/logos/roblox.png",
    iconBg: "#CC0000",
    userIdLabel: "Username Roblox",
    hasZoneId: false,
    guideText: "Masukkan username Roblox kamu (bukan display name).",
    nominals: [
      { id: "rbx-80",   name: "80 Robux",    amount: "80 Robux",    price: 15000,  originalPrice: 17000,  discountPercent: 11 },
      { id: "rbx-400",  name: "400 Robux",   amount: "400 Robux",   price: 70000,  originalPrice: 80000,  discountPercent: 12, popular: true, tag: "VALUE" },
      { id: "rbx-800",  name: "800 Robux",   amount: "800 Robux",   price: 139000, originalPrice: 155000, discountPercent: 10 },
      { id: "rbx-1700", name: "1700 Robux",  amount: "1700 Robux",  price: 290000, originalPrice: 325000, discountPercent: 11 },
    ],
  },
  {
    id: "googleplay",
    slug: "google-play",
    name: "Google Play Voucher IDR",
    shortName: "Google Play",
    publisher: "Google LLC",
    category: "voucher",
    popular: true,
    discountBadge: "-5%",
    rating: "4.9",
    soldCount: "62.4k terjual",
    processTime: "1–3 Detik",
    image: "/logos/google-play.png",
    iconBg: "#0F9D58",
    userIdLabel: "Nomor WhatsApp",
    hasZoneId: false,
    guideText: "Kode Google Play IDR akan langsung dikirim ke WhatsApp kamu setelah pembayaran.",
    nominals: [
      { id: "gp-20k",  name: "Rp 20.000",  amount: "Saldo Google Play Rp 20.000",  price: 21500, originalPrice: 23000, discountPercent: 6 },
      { id: "gp-50k",  name: "Rp 50.000",  amount: "Saldo Google Play Rp 50.000",  price: 52500, originalPrice: 56000, discountPercent: 6, popular: true },
      { id: "gp-100k", name: "Rp 100.000", amount: "Saldo Google Play Rp 100.000", price: 104000, originalPrice: 110000, discountPercent: 5 },
      { id: "gp-300k", name: "Rp 300.000", amount: "Saldo Google Play Rp 300.000", price: 310000, originalPrice: 325000, discountPercent: 5 },
    ],
  },
  {
    id: "psn",
    slug: "playstation-network",
    name: "PlayStation Network (PSN ID)",
    shortName: "PlayStation Store",
    publisher: "Sony Interactive",
    category: "voucher",
    popular: false,
    rating: "4.8",
    soldCount: "19.3k terjual",
    processTime: "1–5 Detik",
    image: "/logos/playstation-network.png",
    iconBg: "#003791",
    userIdLabel: "Nomor WhatsApp",
    hasZoneId: false,
    guideText: "Voucher PSN Card Region Indonesia dikirim instan via WhatsApp & Email.",
    nominals: [
      { id: "psn-100k", name: "Rp 100.000", amount: "PSN Wallet IDR 100.000", price: 107000, originalPrice: 115000, discountPercent: 7 },
      { id: "psn-400k", name: "Rp 400.000", amount: "PSN Wallet IDR 400.000", price: 420000, originalPrice: 450000, discountPercent: 7, popular: true },
    ],
  },
  {
    id: "razergold",
    slug: "razer-gold",
    name: "Razer Gold PIN (IDR)",
    shortName: "Razer Gold",
    publisher: "Razer Inc.",
    category: "voucher",
    popular: false,
    rating: "4.8",
    soldCount: "16.8k terjual",
    processTime: "1–3 Detik",
    image: "/logos/razer-gold.png",
    iconBg: "#00FF00",
    userIdLabel: "Nomor WhatsApp",
    hasZoneId: false,
    guideText: "PIN & Serial Razer Gold langsung dikirim ke WhatsApp kamu.",
    nominals: [
      { id: "rz-20k",  name: "Rp 20.000",  amount: "Razer Gold PIN 20.000",  price: 21500, originalPrice: 23000, discountPercent: 6 },
      { id: "rz-50k",  name: "Rp 50.000",  amount: "Razer Gold PIN 50.000",  price: 53000, originalPrice: 57000, discountPercent: 7, popular: true },
      { id: "rz-100k", name: "Rp 100.000", amount: "Razer Gold PIN 100.000", price: 105000, originalPrice: 112000, discountPercent: 6 },
    ],
  },

  /* ─── ENTERTAINMENT & STREAMING ────────────────────────── */
  {
    id: "vidio",
    slug: "vidio",
    name: "Vidio Premier & Diamond",
    shortName: "Vidio",
    publisher: "PT Vidio Dot Com",
    category: "entertainment",
    popular: true,
    hot: true,
    discountBadge: "-40%",
    rating: "4.9",
    soldCount: "54.7k terjual",
    processTime: "1–5 Detik",
    image: "/logos/vidio.png",
    iconBg: "#E50914",
    userIdLabel: "Nomor Akun Vidio / Email",
    hasZoneId: false,
    guideText: "Masukkan email atau nomor HP yang terdaftar di akun Vidio kamu.",
    nominals: [
      { id: "vid-platinum-30", name: "Platinum 30 Hari", amount: "All Devices Bebas Iklan", price: 39000, originalPrice: 45000, discountPercent: 13, popular: true, tag: "POPULER" },
      { id: "vid-diamond-30",  name: "Diamond EPL 30 Hari", amount: "Mobile Only + Liga Inggris", price: 79000, originalPrice: 99000, discountPercent: 20, popular: true, tag: "BEST SELLER" },
      { id: "vid-diamond-all", name: "Diamond EPL 1 Tahun", amount: "All Screen + TV + Mobile", price: 699000, originalPrice: 1099000, discountPercent: 36, tag: "SUPER HEMAT" },
    ],
  },
  {
    id: "wetv",
    slug: "wetv",
    name: "WeTV VIP Subscription",
    shortName: "WeTV",
    publisher: "Tencent Video",
    category: "entertainment",
    popular: true,
    discountBadge: "-30%",
    rating: "4.8",
    soldCount: "22.1k terjual",
    processTime: "1–5 Detik",
    image: "/logos/wetv.png",
    iconBg: "#FF6B00",
    userIdLabel: "WeTV ID / Email",
    hasZoneId: false,
    guideText: "Masukkan WeTV ID (bisa dilihat di menu Me / Saya).",
    nominals: [
      { id: "wetv-1m", name: "VIP 1 Bulan", amount: "Akses VIP 30 Hari", price: 29000, originalPrice: 39000, discountPercent: 25, popular: true },
      { id: "wetv-3m", name: "VIP 3 Bulan", amount: "Akses VIP 90 Hari", price: 79000, originalPrice: 109000, discountPercent: 27 },
      { id: "wetv-1y", name: "VIP 1 Tahun", amount: "Akses VIP 365 Hari", price: 289000, originalPrice: 399000, discountPercent: 28 },
    ],
  },
  {
    id: "iqiyi",
    slug: "iqiyi",
    name: "iQIYI VIP Standard / Premium",
    shortName: "iQIYI",
    publisher: "iQIYI Inc.",
    category: "entertainment",
    popular: false,
    rating: "4.8",
    soldCount: "13.6k terjual",
    processTime: "1–5 Detik",
    image: "/logos/iqiyi.png",
    iconBg: "#00C853",
    userIdLabel: "UID iQIYI / Email",
    hasZoneId: false,
    guideText: "Masukkan UID iQIYI yang ada di halaman profil akun kamu.",
    nominals: [
      { id: "iq-std-1m",  name: "Standard VIP 1 Bulan", amount: "2 Perangkat 1080p", price: 29000, originalPrice: 39000, discountPercent: 25, popular: true },
      { id: "iq-prem-1m", name: "Premium VIP 1 Bulan",  amount: "4 Perangkat 4K Ultra HD", price: 49000, originalPrice: 65000, discountPercent: 24 },
    ],
  },
  {
    id: "tiktok",
    slug: "tiktok-coins",
    name: "TikTok Coins Live",
    shortName: "TikTok Live",
    publisher: "TikTok Pte. Ltd.",
    category: "entertainment",
    popular: true,
    discountBadge: "-15%",
    rating: "4.9",
    soldCount: "88.9k terjual",
    processTime: "1–3 Detik",
    image: "/logos/tiktok-coins.png",
    iconBg: "#FE2C55",
    userIdLabel: "Username TikTok (@username)",
    hasZoneId: false,
    guideText: "Masukkan username TikTok kamu diawali dengan @ (contoh: @topupkd).",
    nominals: [
      { id: "tt-70",   name: "70 Koin",   amount: "70 TikTok Coins",   price: 13000, originalPrice: 15000, discountPercent: 13 },
      { id: "tt-350",  name: "350 Koin",  amount: "350 TikTok Coins",  price: 64000, originalPrice: 75000, discountPercent: 14, popular: true, tag: "POPULER" },
      { id: "tt-700",  name: "700 Koin",  amount: "700 TikTok Coins",  price: 128000, originalPrice: 150000, discountPercent: 14 },
      { id: "tt-1400", name: "1.400 Koin", amount: "1.400 TikTok Coins", price: 255000, originalPrice: 300000, discountPercent: 15 },
    ],
  },
  {
    id: "bstation",
    slug: "bstation",
    name: "Bstation / Bilibili Premium",
    shortName: "Bstation",
    publisher: "Bilibili",
    category: "entertainment",
    popular: false,
    rating: "4.7",
    soldCount: "9.8k terjual",
    processTime: "1–5 Detik",
    image: "/logos/bstation.png",
    iconBg: "#00A1D6",
    userIdLabel: "UID Bstation / Bilibili",
    hasZoneId: false,
    guideText: "Buka Bstation → profil Saya → salin nomor UID.",
    nominals: [
      { id: "bst-1m", name: "Premium 1 Bulan", amount: "Akses Anime Full HD", price: 25000, originalPrice: 32000, discountPercent: 21, popular: true },
      { id: "bst-1y", name: "Premium 1 Tahun", amount: "Akses Anime 365 Hari", price: 229000, originalPrice: 299000, discountPercent: 23 },
    ],
  },
];

export const articlesData: Article[] = [
  {
    id: "art-1",
    title: "Tips Push Rank Free Fire Season Baru: Setup Karakter & Senjata Meta 2026",
    excerpt: "Panduan lengkap memilih kombinasi skill karakter dan senjata terbaik untuk cepat naik tier Grandmaster tanpa kalah beruntun.",
    category: "Tips & Trik",
    date: "14 Agu 2026",
    image: "/logos/mobile-legends.png",
    readTime: "3 mnt baca",
  },
  {
    id: "art-2",
    title: "Bocoran Event Diamond Kuning MLBB 2026: Cara Maksimalkan Diskon Skin Epic",
    excerpt: "Simak trik menyelesaikan seluruh quest harian agar dapat diskon 1 Diamond untuk skin Collector & Epic impian kamu.",
    category: "Event Promo",
    date: "12 Agu 2026",
    image: "/logos/mobile-legends.png",
    readTime: "4 mnt baca",
  },
  {
    id: "art-3",
    title: "Hasil Drawing & Jadwal Lengkap Playoff MPL ID Season 17: Siapa Juara Baru?",
    excerpt: "Klasemen akhir regular season dan jadwal pertandingan babak playoff MPL Indonesia yang siap memperebutkan tiket M-Series.",
    category: "Esports",
    date: "10 Agu 2026",
    image: "/logos/free-fire.png",
    readTime: "5 mnt baca",
  },
];

export const paymentMethodsData: PaymentMethod[] = [
  { id: "qris",     name: "QRIS",                   category: "qris",    fee: "Semua E-Wallet & Mobile Banking", badge: "BEBAS ADMIN", adminFee: 0,    promoText: "DANA · OVO · GoPay · ShopeePay · LinkAja" },
  { id: "dana",     name: "DANA",                   category: "ewallet", fee: "Instan 24 Jam",                   adminFee: 500 },
  { id: "gopay",    name: "GoPay",                  category: "ewallet", fee: "Instan 24 Jam",                   adminFee: 500 },
  { id: "bca",      name: "BCA Virtual Account",    category: "va",      fee: "Verifikasi Otomatis",             adminFee: 1500 },
  { id: "mandiri",  name: "Mandiri Virtual Account",category: "va",      fee: "Verifikasi Otomatis",             adminFee: 1500 },
  { id: "alfamart", name: "Alfamart / AlfaExpress", category: "retail",  fee: "Bayar di Kasir",                  adminFee: 2500 },
];

export const todayStat = {
  totalOrders: "2.847",
  successRate: "99.8%",
};

