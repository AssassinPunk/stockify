'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Plus, Trash2, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getAllTickers } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const STORAGE_KEY = 'stockify_watchlist_v2';

type WatchlistEntry = {
  symbol: string;
  name: string;
  currency: string;
  addedAt: number;
  addedPrice: number;
};

type LiveQuote = {
  price: number;
  change: number;
  percentChange: number;
  sparkline: number[];
};

// Inline SVG sparkline — no library needed
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return <div className="w-20 h-8" />;
  const W = 80, H = 32, P = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) =>
      `${P + (i / (data.length - 1)) * (W - P * 2)},${H - P - ((v - min) / range) * (H - P * 2)}`
    )
    .join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline
        points={pts}
        fill="none"
        stroke={positive ? '#10b981' : '#ef4444'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SinceAddedBadge({ pct }: { pct: number }) {
  const positive = pct >= 0;
  const neutral = Math.abs(pct) < 0.01;
  const Icon = neutral ? Minus : positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold font-mono',
        neutral
          ? 'bg-secondary text-muted-foreground'
          : positive
          ? 'bg-up/10 text-up'
          : 'bg-down/10 text-down'
      )}
    >
      <Icon className="h-3 w-3" />
      {positive && !neutral ? '+' : ''}{pct.toFixed(2)}%
    </span>
  );
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>({});
  const [loadingSymbols, setLoadingSymbols] = useState<Set<string>>(new Set());
  const [addSymbol, setAddSymbol] = useState<string | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const fetchedRef = useRef<Set<string>>(new Set());
  const { toast } = useToast();
  const allTickers = getAllTickers().filter(t => !t.isIndex);

  // Load persisted watchlist on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWatchlist(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = useCallback((list: WatchlistEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }, []);

  const fetchQuote = useCallback(async (symbol: string) => {
    setLoadingSymbols(prev => new Set(prev).add(symbol));
    try {
      const res = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (!data.error) {
        setQuotes(prev => ({ ...prev, [symbol]: data }));
      }
    } catch {}
    setLoadingSymbols(prev => {
      const next = new Set(prev);
      next.delete(symbol);
      return next;
    });
  }, []);

  // Fetch quotes for any symbol not yet fetched
  useEffect(() => {
    watchlist.forEach(({ symbol }) => {
      if (!fetchedRef.current.has(symbol)) {
        fetchedRef.current.add(symbol);
        fetchQuote(symbol);
      }
    });
  }, [watchlist, fetchQuote]);

  const handleAdd = (symbol: string) => {
    if (watchlist.some(e => e.symbol === symbol)) {
      toast({ variant: 'destructive', title: 'Already watching', description: `${symbol} is already in your watchlist.` });
      setAddSymbol(undefined);
      return;
    }
    const ticker = allTickers.find(t => t.symbol === symbol);
    if (!ticker) return;

    const entry: WatchlistEntry = {
      symbol: ticker.symbol,
      name: ticker.name,
      currency: ticker.currency || 'INR',
      addedAt: Date.now(),
      addedPrice: ticker.price,
    };
    const updated = [...watchlist, entry];
    setWatchlist(updated);
    persist(updated);
    setAddSymbol(undefined);
    toast({ title: `Added ${ticker.symbol}`, description: `Now tracking ${ticker.name}.` });
  };

  const handleRemove = (symbol: string) => {
    const updated = watchlist.filter(e => e.symbol !== symbol);
    setWatchlist(updated);
    persist(updated);
    fetchedRef.current.delete(symbol);
    setQuotes(prev => {
      const next = { ...prev };
      delete next[symbol];
      return next;
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchedRef.current.clear();
    setQuotes({});
    await Promise.allSettled(watchlist.map(({ symbol }) => fetchQuote(symbol)));
    watchlist.forEach(({ symbol }) => fetchedRef.current.add(symbol));
    setRefreshing(false);
  };

  // Summary stats
  const loaded = watchlist.filter(e => quotes[e.symbol]);
  const gainersToday = loaded.filter(e => (quotes[e.symbol]?.percentChange ?? 0) >= 0).length;
  const losersToday = loaded.length - gainersToday;
  const bestSinceAdded = loaded.reduce<{ symbol: string; pct: number } | null>((best, e) => {
    const live = quotes[e.symbol];
    if (!live) return best;
    const pct = ((live.price - e.addedPrice) / e.addedPrice) * 100;
    return !best || pct > best.pct ? { symbol: e.symbol, pct } : best;
  }, null);

  const available = allTickers.filter(t => !watchlist.some(e => e.symbol === t.symbol));

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 fill-primary text-primary" />
            <h1 className="text-2xl font-bold">Your Watchlist</h1>
            <Badge variant="secondary">{watchlist.length} stock{watchlist.length !== 1 ? 's' : ''}</Badge>
          </div>
          {watchlist.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')} />
              Refresh
            </Button>
          )}
        </div>

        {/* ── Summary cards ── */}
        {watchlist.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Watching', value: <span className="text-2xl font-bold">{watchlist.length}</span> },
              {
                label: 'Up today',
                value: <span className="text-2xl font-bold text-up">{gainersToday}</span>,
              },
              {
                label: 'Down today',
                value: <span className="text-2xl font-bold text-down">{losersToday}</span>,
              },
              {
                label: 'Best since added',
                value: bestSinceAdded ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-mono font-bold">{bestSinceAdded.symbol}</span>
                    <SinceAddedBadge pct={bestSinceAdded.pct} />
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                ),
              },
            ].map(({ label, value }) => (
              <Card key={label} className="rounded-2xl border-border/50 bg-card">
                <CardContent className="p-4">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  {value}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Add stock bar ── */}
        <Card className="rounded-2xl border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 shrink-0 text-muted-foreground" />
              <Select value={addSymbol} onValueChange={setAddSymbol}>
                <SelectTrigger className="flex-1 max-w-sm">
                  <SelectValue placeholder="Search and add a stock…" />
                </SelectTrigger>
                <SelectContent>
                  {available.map(t => (
                    <SelectItem key={t.symbol} value={t.symbol}>
                      <span className="font-mono font-semibold">{t.symbol}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{t.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" disabled={!addSymbol} onClick={() => addSymbol && handleAdd(addSymbol)}>
                Add to Watchlist
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Empty state ── */}
        {watchlist.length === 0 ? (
          <Card className="rounded-2xl border-border/50 bg-card">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-5 rounded-full bg-primary/10 p-5">
                <Star className="h-10 w-10 text-primary" />
              </div>
              <p className="mb-2 text-lg font-semibold">Your watchlist is empty</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Add stocks above. We'll track their price and show how they move from the day you started watching.
              </p>
            </CardContent>
          </Card>
        ) : (

          /* ── Watchlist table ── */
          <Card className="rounded-2xl border-border/50 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 text-left">Stock</th>
                    <th className="px-6 py-3 text-right">Price</th>
                    <th className="px-6 py-3 text-right">Day Change</th>
                    <th className="px-6 py-3 text-center">5D Trend</th>
                    <th className="px-6 py-3 text-right">Since Added</th>
                    <th className="px-6 py-3 text-right">Added On</th>
                    <th className="px-3 py-3 text-center" />
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((entry, idx) => {
                    const live = quotes[entry.symbol];
                    const isLoading = loadingSymbols.has(entry.symbol);
                    const currentPrice = live?.price ?? entry.addedPrice;
                    const sinceAdded = ((currentPrice - entry.addedPrice) / entry.addedPrice) * 100;
                    const dayPositive = (live?.percentChange ?? 0) >= 0;

                    return (
                      <tr
                        key={entry.symbol}
                        className={cn(
                          'border-b border-border/20 transition-colors hover:bg-secondary/20',
                          idx % 2 !== 0 && 'bg-secondary/5'
                        )}
                      >
                        {/* Stock */}
                        <td className="px-6 py-4">
                          <Link href={`/stock/${entry.symbol}`} className="group flex flex-col">
                            <span className="font-mono font-bold group-hover:underline">
                              {entry.symbol}
                            </span>
                            <span className="mt-0.5 hidden text-[11px] text-muted-foreground md:block">
                              {entry.name}
                            </span>
                          </Link>
                        </td>

                        {/* Current price */}
                        <td className="px-6 py-4 text-right font-mono font-semibold">
                          {isLoading ? (
                            <Skeleton className="ml-auto h-4 w-24" />
                          ) : (
                            formatNumber(currentPrice)
                          )}
                        </td>

                        {/* Day change */}
                        <td className="px-6 py-4 text-right">
                          {isLoading ? (
                            <Skeleton className="ml-auto h-4 w-16" />
                          ) : live ? (
                            <div className="flex flex-col items-end">
                              <span className={cn('font-mono text-xs font-bold', dayPositive ? 'text-up' : 'text-down')}>
                                {dayPositive ? '+' : ''}{live.percentChange.toFixed(2)}%
                              </span>
                              <span className={cn('font-mono text-[10px] text-muted-foreground')}>
                                {live.change >= 0 ? '+' : ''}{formatNumber(live.change)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>

                        {/* 5D sparkline */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {isLoading ? (
                              <Skeleton className="h-8 w-20" />
                            ) : live?.sparkline?.length ? (
                              <Sparkline data={live.sparkline} positive={dayPositive} />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                        </td>

                        {/* Since added */}
                        <td className="px-6 py-4 text-right">
                          {isLoading ? (
                            <Skeleton className="ml-auto h-4 w-20" />
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              <SinceAddedBadge pct={sinceAdded} />
                              <span className="text-[10px] text-muted-foreground">
                                from {formatNumber(entry.addedPrice)}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Added date */}
                        <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                          {new Date(entry.addedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                          })}
                        </td>

                        {/* Remove */}
                        <td className="px-3 py-4 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemove(entry.symbol)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
      <Disclaimer />
    </div>
  );
}
