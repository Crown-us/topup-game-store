"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpDown,
  Check,
  ChevronRight,
  Code2,
  Copy,
  DollarSign,
  Layers,
  Percent,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface PricedProduct {
  id: string;
  name: string;
  amount: string;
  gameId: string;
  gameSlug: string;
  gameName: string;
  category: "mobile" | "pc" | "voucher" | string;
  isAvailable: boolean;
  pricing: {
    modal_price: number;
    margin: number;
    sell_price: number;
    profit_percent: string;
  };
}

type SortField =
  | "gameName"
  | "name"
  | "modal_price"
  | "margin"
  | "sell_price"
  | "profit_percent";

const formatRp = (val: number) =>
  "Rp " + val.toLocaleString("id-ID");

const GAME_INITIALS: Record<string, { bg: string; text: string; label: string }> = {
  mlbb: { bg: "bg-blue-50 border-blue-200 text-blue-700", text: "ML", label: "Mobile Legends" },
  ff: { bg: "bg-orange-50 border-orange-200 text-orange-700", text: "FF", label: "Free Fire" },
  pubg: { bg: "bg-amber-50 border-amber-200 text-amber-700", text: "PB", label: "PUBG Mobile" },
  hok: { bg: "bg-rose-50 border-rose-200 text-rose-700", text: "HK", label: "Honor of Kings" },
  genshin: { bg: "bg-cyan-50 border-cyan-200 text-cyan-700", text: "GI", label: "Genshin Impact" },
  hsr: { bg: "bg-purple-50 border-purple-200 text-purple-700", text: "SR", label: "Honkai Star Rail" },
  cod: { bg: "bg-slate-100 border-slate-300 text-slate-800", text: "CD", label: "CoD Mobile" },
  aov: { bg: "bg-violet-50 border-violet-200 text-violet-700", text: "AV", label: "Arena of Valor" },
  ragnarok: { bg: "bg-sky-50 border-sky-200 text-sky-700", text: "RM", label: "Ragnarok M" },
  valorant: { bg: "bg-red-50 border-red-200 text-red-700", text: "VL", label: "Valorant" },
  roblox: { bg: "bg-red-50 border-red-200 text-red-700", text: "RB", label: "Roblox" },
  growtopia: { bg: "bg-emerald-50 border-emerald-200 text-emerald-700", text: "GT", label: "Growtopia" },
};

export default function AdminMarginShadcnLightPage() {
  const [products, setProducts] = React.useState<PricedProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [sortField, setSortField] = React.useState<SortField>("gameName");
  const [sortAsc, setSortAsc] = React.useState(true);

  // Interactive copy toast state
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Live Simulation state
  const [simModal, setSimModal] = React.useState<number>(20000);
  const [simMargin, setSimMargin] = React.useState<number>(3000);

  const fetchProducts = React.useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/supplier/products");
      const json = await res.json();
      if (json.success) {
        setProducts(json.products);
        setError(null);
      } else {
        setError(json.error || "Gagal memuat katalog supplier.");
      }
    } catch {
      setError("Terjadi kesalahan saat menghubungi API server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredProducts = React.useMemo(() => {
    let list = [...products];

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.gameName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.amount.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      switch (sortField) {
        case "gameName":
          valA = a.gameName;
          valB = b.gameName;
          break;
        case "name":
          valA = a.name;
          valB = b.name;
          break;
        case "modal_price":
          valA = a.pricing.modal_price;
          valB = b.pricing.modal_price;
          break;
        case "margin":
          valA = a.pricing.margin;
          valB = b.pricing.margin;
          break;
        case "sell_price":
          valA = a.pricing.sell_price;
          valB = b.pricing.sell_price;
          break;
        case "profit_percent":
          valA = parseFloat(a.pricing.profit_percent);
          valB = parseFloat(b.pricing.profit_percent);
          break;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [products, activeCategory, searchQuery, sortField, sortAsc]);

  // Summary computations
  const totalMarginSum = React.useMemo(
    () => filteredProducts.reduce((sum, p) => sum + p.pricing.margin, 0),
    [filteredProducts]
  );

  const avgMargin = React.useMemo(() => {
    if (!filteredProducts.length) return 0;
    return Math.round(totalMarginSum / filteredProducts.length);
  }, [filteredProducts, totalMarginSum]);

  const avgProfitPct = React.useMemo(() => {
    if (!filteredProducts.length) return 0;
    const totalPct = filteredProducts.reduce(
      (sum, p) => sum + parseFloat(p.pricing.profit_percent || "0"),
      0
    );
    return (totalPct / filteredProducts.length).toFixed(1);
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans pb-24">
      {/* ─── Top Navbar (shadcn style header) ─────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-zinc-700 border border-zinc-200 bg-white transition hover:bg-zinc-100 hover:text-zinc-950 shadow-sm"
            >
              <Zap className="size-3.5 text-zinc-900" />
              <span>Storefront</span>
            </Link>
            <ChevronRight className="size-3.5 text-zinc-400" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-zinc-900">
                Reseller Margin Control
              </span>
              <Badge variant="indigo" className="gap-1 px-2 py-0 text-[10px]">
                <Sparkles className="size-3" />
                Live Sync
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="hidden sm:inline-flex items-center gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-700 text-xs py-1 px-2.5 shadow-none"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Dummy Mode Active
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchProducts(true)}
              disabled={refreshing || loading}
              className="h-8 gap-1.5 text-xs border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-100"
            >
              <RefreshCw
                className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh Data</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ─── Hero Header ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
              Margin & Pricing Manager
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Pantau harga modal supplier, tentukan margin reseller, dan kontrol harga jual katalog secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs bg-white text-zinc-800"
              asChild
            >
              <a href="#simulator">
                <SlidersHorizontal className="size-3.5 text-zinc-700" />
                Live Margin Calc
              </a>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-2 text-xs bg-zinc-900 text-white hover:bg-zinc-800"
              asChild
            >
              <a href="#config-guide">
                <Code2 className="size-3.5" />
                Config Rule
              </a>
            </Button>
          </div>
        </div>

        {/* ─── Stat KPI Cards (shadcn/ui Card Light) ────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Total Produk Aktif
              </CardTitle>
              <div className="p-1.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
                <Layers className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">
                {filteredProducts.length}
                <span className="text-xs font-normal text-zinc-400 ml-1.5">
                  / {products.length} SKU
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-medium">100% Sync</span>{" "}
                dari supplier catalog
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Rata-rata Margin
              </CardTitle>
              <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <DollarSign className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 price-num">
                {formatRp(avgMargin)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Net profit per order (default flat)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Total Margin Terdaftar
              </CardTitle>
              <div className="p-1.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                <TrendingUp className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600 price-num">
                {formatRp(totalMarginSum)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Akumulasi margin seluruh katalog
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Avg. Profit Margin %
              </CardTitle>
              <div className="p-1.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                <Percent className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 price-num">
                {avgProfitPct}%
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Persentase markup terhadap modal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ─── Product Catalog & Margin Table (shadcn light) ──── */}
        <Card className="bg-white border-zinc-200 shadow-sm">
          <CardHeader className="border-b border-zinc-200/80 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold text-zinc-950 flex items-center gap-2">
                  <Activity className="size-4 text-zinc-900" />
                  Katalog Produk & Margin Breakdown
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 mt-0.5">
                  Tabel mapping harga modal, markup margin, dan harga jual yang muncul di aplikasi.
                </CardDescription>
              </div>

              {/* Filter Tabs */}
              <Tabs
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full md:w-auto"
              >
                <TabsList className="bg-zinc-100 border border-zinc-200 w-full sm:w-auto">
                  <TabsTrigger value="all" className="text-xs">
                    Semua ({products.length})
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="text-xs">
                    Mobile
                  </TabsTrigger>
                  <TabsTrigger value="pc" className="text-xs">
                    PC
                  </TabsTrigger>
                  <TabsTrigger value="voucher" className="text-xs">
                    Voucher
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Search Input */}
            <div className="pt-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                <Input
                  placeholder="Cari berdasarkan nama game, nominal, atau Product SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white border-zinc-200 text-xs h-9 text-zinc-900 placeholder:text-zinc-400"
                />
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-zinc-500 h-9 hover:text-zinc-900"
                >
                  Reset
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-3">
                <RefreshCw className="size-6 animate-spin text-zinc-900" />
                <p className="text-xs">Mengambil data harga dari supplier...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600 text-xs space-y-2">
                <p className="font-semibold">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchProducts(true)}
                  className="mt-2 text-xs"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center text-zinc-400 text-xs">
                Tidak ada produk yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 hover:bg-transparent bg-zinc-50/70">
                    <TableHead
                      className="cursor-pointer select-none text-zinc-600 font-semibold text-xs"
                      onClick={() => handleSort("gameName")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Game & Kategori</span>
                        <ArrowUpDown className="size-3 text-zinc-400" />
                      </div>
                    </TableHead>

                    <TableHead
                      className="cursor-pointer select-none text-zinc-600 font-semibold text-xs"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Item / SKU</span>
                        <ArrowUpDown className="size-3 text-zinc-400" />
                      </div>
                    </TableHead>

                    <TableHead
                      className="cursor-pointer select-none text-zinc-600 font-semibold text-xs text-right"
                      onClick={() => handleSort("modal_price")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Harga Modal (Supplier)</span>
                        <ArrowUpDown className="size-3 text-zinc-400" />
                      </div>
                    </TableHead>

                    <TableHead
                      className="cursor-pointer select-none text-zinc-600 font-semibold text-xs text-right"
                      onClick={() => handleSort("margin")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Margin (Profit Lo)</span>
                        <ArrowUpDown className="size-3 text-zinc-400" />
                      </div>
                    </TableHead>

                    <TableHead
                      className="cursor-pointer select-none text-zinc-600 font-semibold text-xs text-right"
                      onClick={() => handleSort("sell_price")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Harga Jual Customer</span>
                        <ArrowUpDown className="size-3 text-zinc-400" />
                      </div>
                    </TableHead>

                    <TableHead
                      className="cursor-pointer select-none text-zinc-600 font-semibold text-xs text-right"
                      onClick={() => handleSort("profit_percent")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Markup %</span>
                        <ArrowUpDown className="size-3 text-zinc-400" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredProducts.map((p) => {
                    const badgeVariant =
                      p.category === "mobile"
                        ? "indigo"
                        : p.category === "pc"
                        ? "purple"
                        : "emerald";

                    const brand = GAME_INITIALS[p.gameId] || {
                      bg: "bg-zinc-100 border-zinc-200 text-zinc-800",
                      text: p.gameName.slice(0, 2).toUpperCase(),
                      label: p.gameName,
                    };

                    const profitNum = parseFloat(p.pricing.profit_percent);

                    return (
                      <TableRow
                        key={p.id}
                        className="border-zinc-100 hover:bg-zinc-50/80 transition-colors"
                      >
                        {/* Game info */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`size-8 rounded-md border flex items-center justify-center text-[11px] font-bold shrink-0 ${brand.bg}`}
                            >
                              {brand.text}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-900 text-xs">
                                {p.gameName}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Badge
                                  variant={badgeVariant}
                                  className="text-[9px] px-1.5 py-0 uppercase"
                                >
                                  {p.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Item Name & SKU */}
                        <TableCell className="py-3">
                          <div className="text-xs font-medium text-zinc-800">
                            {p.amount}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <code className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                              {p.id}
                            </code>
                            <button
                              onClick={() => handleCopy(p.id)}
                              className="text-zinc-400 hover:text-zinc-800 transition p-0.5 rounded"
                              title="Salin SKU"
                            >
                              {copiedId === p.id ? (
                                <Check className="size-3 text-emerald-600" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          </div>
                        </TableCell>

                        {/* Modal Price */}
                        <TableCell className="py-3 text-right">
                          <span className="font-mono text-xs text-zinc-600 price-num">
                            {formatRp(p.pricing.modal_price)}
                          </span>
                        </TableCell>

                        {/* Margin */}
                        <TableCell className="py-3 text-right">
                          <span className="inline-flex items-center justify-end font-mono text-xs font-semibold text-emerald-700 price-num bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            +{formatRp(p.pricing.margin)}
                          </span>
                        </TableCell>

                        {/* Sell Price */}
                        <TableCell className="py-3 text-right">
                          <span className="font-mono text-xs font-bold text-zinc-950 price-num">
                            {formatRp(p.pricing.sell_price)}
                          </span>
                        </TableCell>

                        {/* Profit % */}
                        <TableCell className="py-3 text-right">
                          <Badge
                            variant={
                              profitNum >= 20
                                ? "emerald"
                                : profitNum >= 12
                                ? "amber"
                                : "secondary"
                            }
                            className="font-mono text-[10px] px-1.5 py-0.5"
                          >
                            {p.pricing.profit_percent}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* ─── Live Margin Simulator & Config Docs (Light theme) ─ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="simulator">
          {/* Simulator Card */}
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-zinc-900" />
                Live Margin Simulator
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Uji perhitungan margin secara instan sebelum lo ubah konfigurasi di file code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Harga Modal Supplier (Rp)
                  </label>
                  <Input
                    type="number"
                    value={simModal}
                    onChange={(e) => setSimModal(Number(e.target.value) || 0)}
                    className="bg-white font-mono text-xs border-zinc-200 text-zinc-900"
                    placeholder="20000"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Margin Reseller (Rp)
                  </label>
                  <Input
                    type="number"
                    value={simMargin}
                    onChange={(e) => setSimMargin(Number(e.target.value) || 0)}
                    className="bg-white font-mono text-xs text-emerald-700 border-zinc-200 font-semibold"
                    placeholder="3000"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600">Harga Jual ke Customer:</span>
                  <span className="font-bold text-zinc-950 font-mono text-sm">
                    {formatRp(simModal + simMargin)}
                  </span>
                </div>
                <Separator className="bg-zinc-200" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600">Persentase Profit (Markup):</span>
                  <Badge variant="emerald" className="font-mono text-xs">
                    {simModal > 0
                      ? ((simMargin / simModal) * 100).toFixed(1) + "%"
                      : "0%"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600">Estimasi profit per 100 order:</span>
                  <span className="font-semibold text-emerald-700 font-mono">
                    {formatRp(simMargin * 100)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Config & Integration Docs */}
          <Card className="bg-white border-zinc-200 shadow-sm" id="config-guide">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Code2 className="size-4 text-zinc-900" />
                Cara Edit Konfigurasi Margin
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Hirarki aturan margin di <code className="text-zinc-800 font-semibold">lib/margin.ts</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 space-y-2 font-mono text-[11px]">
                <div className="text-zinc-400">// lib/margin.ts</div>
                <div className="text-zinc-800">
                  <span className="text-purple-600 font-bold">export const</span>{" "}
                  MARGIN_CONFIG = &#123;
                </div>
                <div className="pl-4 text-zinc-700">
                  <span className="text-blue-600 font-medium">default</span>:{" "}
                  <span className="text-emerald-600 font-semibold">2000</span>,{" "}
                  <span className="text-zinc-400">// fallback semua item</span>
                </div>
                <div className="pl-4 text-zinc-700">
                  <span className="text-blue-600 font-medium">byCategory</span>: &#123;{" "}
                  mlbb: <span className="text-emerald-600 font-semibold">3000</span>, ff:{" "}
                  <span className="text-emerald-600 font-semibold">2500</span> &#125;,
                </div>
                <div className="pl-4 text-zinc-700">
                  <span className="text-blue-600 font-medium">byProductId</span>: &#123;{" "}
                  &quot;ml-pass&quot;:{" "}
                  <span className="text-emerald-600 font-semibold">5000</span> &#125;,
                </div>
                <div className="text-zinc-800">&#125;;</div>
              </div>

              <div className="flex items-center gap-2 text-zinc-600 text-xs pt-1">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>
                  Prioritas perhitungan:{" "}
                  <strong className="text-zinc-900">byProductId</strong> &gt;{" "}
                  <strong className="text-zinc-900">byCategory</strong> &gt;{" "}
                  <strong className="text-zinc-900">default</strong>.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
