'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import {
  Plus, Trash2, RefreshCw,
  Bell, BellRing, CloudOff, Cloud,
} from 'lucide-react';
import { getAllTickers } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const STORAGE_KEY        = 'stockify_watchlist_v2';
const ALERTS_STORAGE_KEY = 'stockify_alerts_v1';

type WatchlistEntry = {
  symbol:     string;
  name:       string;
  currency:   string;
  addedAt:    number;
  addedPrice: number;
};

type LiveQuote = {
  price:         number;
  change:        number;
  percentChange: number;
  sparkline:     number[];
};

type AlertEntry = {
  symbol:      string;
  targetPrice: number;
  condition:   'above' | 'below';
  createdAt:   number;
};

type DbWishlistItem = {
  id:           string;
  stock_symbol: string;
  stock_name:   string;
  added_at:     string;
  notes:        string | null;
};

const DASH = '—';

function formatMoney(value: number, currency: string) {
  return formatNumber(value, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function signedPercent(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

// Change since the stock was added. Null when there is no usable start price, so a start of 0 never shows as Infinity.
function sinceAddedPercent(entry: WatchlistEntry, live: LiveQuote | undefined) {
  if (!live || !(entry.addedPrice > 0)) return null;
  const pct = ((live.price - entry.addedPrice) / entry.addedPrice) * 100;
  return Number.isFinite(pct) ? pct : null;
}

function toneOf(value: number) {
  if (value > 0) return 'text-up';
  if (value < 0) return 'text-down';
  return 'text-muted-foreground';
}

// ── Inline SVG sparkline ────────────────────────────────────────────────────
function Sparkline({ data, label }: { data: number[]; label: string }) {
  if (data.length < 2) return <span className="text-sm text-muted-foreground">{DASH}</span>;
  const W = 120, H = 36, P = 2;
  const min   = Math.min(...data);
  const max   = Math.max(...data);
  const range = max - min || 1;
  const pts   = data
    .map((v, i) => `${P + (i / (data.length - 1)) * (W - P * 2)},${H - P - ((v - min) / range) * (H - P * 2)}`)
    .join(' ');
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      className={cn('h-9 w-[88px] xl:w-[120px]', data[data.length - 1] >= data[0] ? 'text-up' : 'text-down')}
    >
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DayChange({ live, currency }: { live: LiveQuote | undefined; currency: string }) {
  if (!live) return <span className="text-sm text-muted-foreground">{DASH}</span>;
  return (
    <span className={cn('flex flex-col items-end whitespace-nowrap tabular-nums', toneOf(live.change))}>
      <span className="text-sm font-medium">{signedPercent(live.percentChange)}</span>
      <span className="text-[13px]">{live.change > 0 ? '+' : ''}{formatMoney(live.change, currency)}</span>
    </span>
  );
}

function SinceAdded({ entry, live }: { entry: WatchlistEntry; live: LiveQuote | undefined }) {
  const pct = sinceAddedPercent(entry, live);
  return (
    <span className="flex flex-col items-end whitespace-nowrap tabular-nums">
      {pct === null ? (
        <span className="text-sm text-muted-foreground">{DASH}</span>
      ) : (
        <span className={cn('text-sm font-medium', toneOf(pct))}>{signedPercent(pct)}</span>
      )}
      <span className="text-[13px] text-muted-foreground">
        {entry.addedPrice > 0 ? `from ${formatMoney(entry.addedPrice, entry.currency)}` : 'No start price'}
      </span>
    </span>
  );
}

function addedOn(entry: WatchlistEntry) {
  return new Date(entry.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

function trendLabel(symbol: string, live: LiveQuote) {
  const first = live.sparkline[0];
  const last  = live.sparkline[live.sparkline.length - 1];
  return `${symbol} over 5 days: ${last >= first ? 'up' : 'down'} ${Math.abs(((last - first) / first) * 100).toFixed(2)}%`;
}

function RowActions({
  symbol, hasAlert, onAlert, onRemove,
}: {
  symbol:   string;
  hasAlert: boolean;
  onAlert:  () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', hasAlert ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
        onClick={onAlert}
        title={hasAlert ? 'Edit alert' : 'Set alert'}
        aria-label={`${hasAlert ? 'Edit' : 'Set'} alert for ${symbol}`}
      >
        {hasAlert ? <BellRing className="h-4 w-4" aria-hidden="true" /> : <Bell className="h-4 w-4" aria-hidden="true" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-down"
        onClick={onRemove}
        title="Remove from watchlist"
        aria-label={`Remove ${symbol} from watchlist`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

// ── Alert dialog ─────────────────────────────────────────────────────────────
function AlertDialog({
  symbol, currency, currentPrice, existing, onSave, onRemove, onClose,
}: {
  symbol:       string;
  currency:     string;
  currentPrice: number;
  existing:     AlertEntry | undefined;
  onSave:       (targetPrice: number, condition: 'above' | 'below') => void;
  onRemove:     () => void;
  onClose:      () => void;
}) {
  const [condition, setCondition] = useState<'above' | 'below'>(existing?.condition ?? 'above');
  const [price, setPrice]         = useState(String(existing?.targetPrice ?? ''));
  const currSym = currency === 'INR' ? '₹' : '$';

  const handleSave = () => {
    const n = parseFloat(price);
    if (!n || n <= 0) return;
    onSave(n, condition);
  };

  return (
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Price Alert — {symbol}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <p className="text-sm text-muted-foreground">
          Current price:{' '}
          <span className="font-semibold tabular-nums text-foreground">
            {currSym}{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </p>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Alert me when price goes
          </Label>
          <div className="flex gap-2">
            {(['above', 'below'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={cn(
                  'flex-1 rounded-lg border py-2 text-sm font-semibold transition-colors',
                  condition === c
                    ? c === 'above'
                      ? 'border-up bg-up/10 text-up'
                      : 'border-down bg-down/10 text-down'
                    : 'border-border/50 text-muted-foreground hover:bg-secondary',
                )}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-price" className="text-sm text-muted-foreground">
            Target price ({currSym})
          </Label>
          <Input
            id="target-price"
            type="number"
            placeholder={`e.g. ${(currentPrice * (condition === 'above' ? 1.05 : 0.95)).toFixed(2)}`}
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="tabular-nums"
          />
        </div>
      </div>

      <DialogFooter className="gap-2">
        {existing && (
          <Button variant="destructive" size="sm" onClick={onRemove}>
            Remove Alert
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={!price || parseFloat(price) <= 0}>
          {existing ? 'Update Alert' : 'Set Alert'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function WatchlistPage() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && !!session?.user?.id;

  const [watchlist,          setWatchlist]          = useState<WatchlistEntry[]>([]);
  const [alerts,             setAlerts]             = useState<AlertEntry[]>([]);
  const [quotes,             setQuotes]             = useState<Record<string, LiveQuote>>({});
  const [loadingSymbols,     setLoadingSymbols]     = useState<Set<string>>(new Set());
  const [addSymbol,          setAddSymbol]          = useState<string | undefined>();
  const [refreshing,         setRefreshing]         = useState(false);
  const [alertDialogSymbol,  setAlertDialogSymbol]  = useState<string | null>(null);
  const [synced,             setSynced]             = useState(false);
  const [lastUpdated,        setLastUpdated]        = useState<string | null>(null);
  const [adding,             setAdding]             = useState(false);

  const fetchedRef  = useRef<Set<string>>(new Set());
  const backfillRef = useRef<Set<string>>(new Set());
  const alertsRef   = useRef<AlertEntry[]>([]);
  const { toast }   = useToast();
  const allTickers  = getAllTickers().filter(t => !t.isIndex);

  // Keep alertsRef in sync for use inside callbacks
  useEffect(() => { alertsRef.current = alerts; }, [alerts]);

  // ── Persist helpers ───────────────────────────────────────────────────────
  const saveLocal = useCallback((list: WatchlistEntry[]) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  }, []);

  const saveAlertsLocal = useCallback((list: AlertEntry[]) => {
    try { localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(list)); } catch {}
  }, []);

  // ── Load on mount / auth change ──────────────────────────────────────────
  useEffect(() => {
    // Always load localStorage first (instant, available for guests)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWatchlist(JSON.parse(raw));
      const rawAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (rawAlerts) setAlerts(JSON.parse(rawAlerts));
    } catch {}

    if (status === 'loading') return;

    if (!isLoggedIn) {
      setSynced(false);
      return;
    }

    // Merge DB watchlist into local state
    fetch('/api/wishlist')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((dbItems: DbWishlistItem[]) => {
        setWatchlist(prev => {
          const localSymbols = new Set(prev.map(e => e.symbol));
          const extra: WatchlistEntry[] = [];

          for (const item of dbItems) {
            if (!localSymbols.has(item.stock_symbol)) {
              // Reconstruct metadata from notes JSON
              let addedPrice = 0;
              let addedAt    = new Date(item.added_at).getTime();
              try {
                const meta = item.notes ? JSON.parse(item.notes) : {};
                if (typeof meta.addedPrice === 'number') addedPrice = meta.addedPrice;
                if (typeof meta.addedAt    === 'number') addedAt    = meta.addedAt;
              } catch {}

              const ticker = allTickers.find(t => t.symbol === item.stock_symbol);
              extra.push({
                symbol:     item.stock_symbol,
                name:       item.stock_name,
                currency:   ticker?.currency ?? 'INR',
                addedAt,
                addedPrice,
              });
            }
          }

          if (extra.length === 0) return prev;
          const merged = [...prev, ...extra];
          saveLocal(merged);
          return merged;
        });
        setSynced(true);
      })
      .catch(() => setSynced(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, status]);

  // ── Quote fetching ────────────────────────────────────────────────────────
  const fetchQuote = useCallback(async (symbol: string) => {
    setLoadingSymbols(prev => new Set(prev).add(symbol));
    try {
      const res  = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (!data.error) {
        setQuotes(prev => ({ ...prev, [symbol]: data }));
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }));
      }
    } catch {}
    setLoadingSymbols(prev => { const n = new Set(prev); n.delete(symbol); return n; });
  }, []);

  useEffect(() => {
    watchlist.forEach(({ symbol }) => {
      if (!fetchedRef.current.has(symbol)) {
        fetchedRef.current.add(symbol);
        fetchQuote(symbol);
      }
    });
  }, [watchlist, fetchQuote]);

  // ── Start prices ──────────────────────────────────────────────────────────
  // Entries added before start prices were recorded hold 0. Their real start is the close on the day
  // they were added, from the daily chart. Nothing is guessed: with no bar for that day, it stays 0.
  const backfillStartPrices = useCallback((list: WatchlistEntry[]) => {
    list
      .filter(e => !(e.addedPrice > 0) && !backfillRef.current.has(e.symbol))
      .forEach(async entry => {
        backfillRef.current.add(entry.symbol);
        try {
          const res  = await fetch(`/api/chart?symbol=${encodeURIComponent(entry.symbol)}`);
          const data = await res.json();
          const endOfDay = new Date(entry.addedAt).setHours(23, 59, 59, 999);
          const bars: { date: string; close: number }[] = (data?.['1Y'] ?? [])
            .filter((bar: { date: string; close: number }) => bar.close > 0 && Date.parse(bar.date) <= endOfDay)
            .sort((a: { date: string }, b: { date: string }) => Date.parse(a.date) - Date.parse(b.date));
          const startPrice = bars[bars.length - 1]?.close;
          // A year of daily bars can't price an entry older than that, and a gap isn't that day's close
          const lastBarDay = bars.length ? Date.parse(bars[bars.length - 1].date) : 0;
          const closeEnough = entry.addedAt - lastBarDay < 7 * 86_400_000;
          if (!startPrice || !closeEnough) { backfillRef.current.delete(entry.symbol); return; }

          setWatchlist(prev => {
            const updated = prev.map(e => (e.symbol === entry.symbol && !(e.addedPrice > 0) ? { ...e, addedPrice: startPrice } : e));
            saveLocal(updated);
            return updated;
          });
        } catch {
          backfillRef.current.delete(entry.symbol);
        }
      });
  }, [saveLocal]);

  useEffect(() => { backfillStartPrices(watchlist); }, [watchlist, backfillStartPrices]);

  // ── Alert check (runs whenever quotes update) ─────────────────────────────
  useEffect(() => {
    const currentAlerts = alertsRef.current;
    if (currentAlerts.length === 0 || Object.keys(quotes).length === 0) return;

    const triggered = currentAlerts.filter(a => {
      const q = quotes[a.symbol];
      if (!q) return false;
      return (a.condition === 'above' && q.price >= a.targetPrice) ||
             (a.condition === 'below' && q.price <= a.targetPrice);
    });

    if (triggered.length === 0) return;

    triggered.forEach(a => {
      const q    = quotes[a.symbol];
      const sym  = '₹';
      toast({
        title:       `Alert triggered: ${a.symbol}`,
        description: `Price ${a.condition === 'above' ? 'crossed above' : 'dropped below'} ${sym}${a.targetPrice.toFixed(2)} — now at ${sym}${q?.price.toFixed(2)}`,
      });
    });

    const remaining = currentAlerts.filter(a => !triggered.includes(a));
    setAlerts(remaining);
    saveAlertsLocal(remaining);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes]);

  // ── Watchlist actions ─────────────────────────────────────────────────────
  const handleAdd = async (symbol: string) => {
    if (watchlist.some(e => e.symbol === symbol)) {
      toast({ variant: 'destructive', title: 'Already watching', description: `${symbol} is already in your watchlist.` });
      setAddSymbol(undefined);
      return;
    }
    const ticker = allTickers.find(t => t.symbol === symbol);
    if (!ticker) return;

    // The registry holds no prices, so the start price is the live quote at the moment of adding.
    setAdding(true);
    let addedPrice = 0;
    try {
      const res  = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (!data.error && data.price > 0) {
        addedPrice = data.price;
        fetchedRef.current.add(symbol);
        setQuotes(prev => ({ ...prev, [symbol]: data }));
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }));
      }
    } catch {}
    setAdding(false);

    const entry: WatchlistEntry = {
      symbol:     ticker.symbol,
      name:       ticker.name,
      currency:   ticker.currency ?? 'INR',
      addedAt:    Date.now(),
      addedPrice,
    };

    const updated = [...watchlist, entry];
    setWatchlist(updated);
    saveLocal(updated);
    setAddSymbol(undefined);

    // Persist to DB when logged in
    if (isLoggedIn) {
      fetch('/api/wishlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          stock_symbol: ticker.symbol,
          stock_name:   ticker.name,
          notes:        JSON.stringify({ addedPrice, addedAt: entry.addedAt }),
        }),
      })
        .then(r => r.ok && setSynced(true))
        .catch(() => {});
    }

    toast({ title: `Added ${ticker.symbol}`, description: `Now tracking ${ticker.name}.` });
  };

  const handleRemove = (symbol: string) => {
    const updated = watchlist.filter(e => e.symbol !== symbol);
    setWatchlist(updated);
    saveLocal(updated);
    fetchedRef.current.delete(symbol);
    setQuotes(prev => { const n = { ...prev }; delete n[symbol]; return n; });

    // Remove any alert for this symbol too
    const updatedAlerts = alerts.filter(a => a.symbol !== symbol);
    if (updatedAlerts.length !== alerts.length) {
      setAlerts(updatedAlerts);
      saveAlertsLocal(updatedAlerts);
    }

    // Remove from DB when logged in
    if (isLoggedIn) {
      fetch('/api/wishlist', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ stock_symbol: symbol }),
      }).catch(() => {});
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchedRef.current.clear();
    backfillStartPrices(watchlist);
    await Promise.allSettled(watchlist.map(({ symbol }) => fetchQuote(symbol)));
    watchlist.forEach(({ symbol }) => fetchedRef.current.add(symbol));
    setRefreshing(false);
  };

  // ── Alert actions ─────────────────────────────────────────────────────────
  const handleSaveAlert = (symbol: string, targetPrice: number, condition: 'above' | 'below') => {
    const filtered = alerts.filter(a => a.symbol !== symbol);
    const updated  = [...filtered, { symbol, targetPrice, condition, createdAt: Date.now() }];
    setAlerts(updated);
    saveAlertsLocal(updated);
    setAlertDialogSymbol(null);
    toast({
      title:       `Alert set for ${symbol}`,
      description: `You'll be notified when it goes ${condition} ₹${targetPrice.toFixed(2)}.`,
    });
  };

  const handleRemoveAlert = (symbol: string) => {
    const updated = alerts.filter(a => a.symbol !== symbol);
    setAlerts(updated);
    saveAlertsLocal(updated);
    setAlertDialogSymbol(null);
    toast({ title: `Alert removed for ${symbol}` });
  };

  // ── Summary stats ─────────────────────────────────────────────────────────
  const loaded          = watchlist.filter(e => quotes[e.symbol]);
  const gainers         = loaded.filter(e => quotes[e.symbol].change > 0);
  const losers          = loaded.filter(e => quotes[e.symbol].change < 0);
  const bestSinceAdded  = loaded.reduce<{ symbol: string; pct: number } | null>((best, e) => {
    const pct = sinceAddedPercent(e, quotes[e.symbol]);
    if (pct === null) return best;
    return !best || pct > best.pct ? { symbol: e.symbol, pct } : best;
  }, null);

  const biggestMove = loaded.reduce<WatchlistEntry | null>((top, e) =>
    !top || Math.abs(quotes[e.symbol].percentChange) > Math.abs(quotes[top.symbol].percentChange) ? e : top, null);
  const reading = watchlist.length === 0
    ? 'Add a stock to start tracking it.'
    : loaded.length === 0
      ? `Getting prices for ${watchlist.length} stock${watchlist.length !== 1 ? 's' : ''}.`
      : `${gainers.length} of ${loaded.length} stock${loaded.length !== 1 ? 's are' : ' is'} up today.${
          biggestMove ? ` ${biggestMove.symbol} moved most, ${signedPercent(quotes[biggestMove.symbol].percentChange)}.` : ''
        }`;

  const available          = allTickers.filter(t => !watchlist.some(e => e.symbol === t.symbol));
  const activeAlertSymbol  = alertDialogSymbol ? watchlist.find(e => e.symbol === alertDialogSymbol) : null;

  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6">

        {/* ── Page header ── */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">Your Watchlist</h1>
            <p className="mt-1 text-base text-foreground">{reading}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {isLoggedIn ? (
              <span className="flex items-center gap-1.5">
                {synced ? <Cloud className="h-3.5 w-3.5" aria-hidden="true" /> : <CloudOff className="h-3.5 w-3.5" aria-hidden="true" />}
                {synced ? 'Synced' : 'Syncing…'}
              </span>
            ) : (
              <Link href="/login" className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
                Sign in to sync
              </Link>
            )}
            {lastUpdated && <span className="tabular-nums">Updated {lastUpdated}</span>}
            {watchlist.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={cn('mr-1.5 h-3.5 w-3.5', refreshing && 'animate-spin')} aria-hidden="true" />
                Refresh
              </Button>
            )}
          </div>
        </div>

        {/* ── Summary cards ── */}
        {watchlist.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                label: 'Watching',
                value: <span className="text-foreground">{watchlist.length}</span>,
                note: `${alerts.length} price alert${alerts.length !== 1 ? 's' : ''} set`,
              },
              {
                label: 'Up today',
                value: <span className={gainers.length > 0 ? 'text-up' : 'text-muted-foreground'}>{gainers.length}</span>,
                note: gainers.length > 0 ? gainers.map(e => e.symbol).join(', ') : 'None right now',
              },
              {
                label: 'Down today',
                value: <span className={losers.length > 0 ? 'text-down' : 'text-muted-foreground'}>{losers.length}</span>,
                note: losers.length > 0 ? losers.map(e => e.symbol).join(', ') : 'None right now',
              },
              {
                label: 'Best since added',
                value: bestSinceAdded
                  ? <span className={toneOf(bestSinceAdded.pct)}>{signedPercent(bestSinceAdded.pct)}</span>
                  : <span className="text-muted-foreground">{DASH}</span>,
                note: bestSinceAdded ? bestSinceAdded.symbol : 'No start prices to compare',
              },
            ].map(({ label, value, note }) => (
              <div key={label} className="min-w-0 rounded-2xl bg-card p-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
                <p className="mt-1 truncate text-sm text-muted-foreground" title={note}>{note}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Add stock bar ── */}
        <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 sm:flex-row sm:items-center">
          <Select value={addSymbol} onValueChange={setAddSymbol}>
            <SelectTrigger className="w-full sm:max-w-sm" aria-label="Search and add a stock">
              <SelectValue placeholder="Search and add a stock…" />
            </SelectTrigger>
            <SelectContent>
              {available.map(t => (
                <SelectItem key={t.symbol} value={t.symbol}>
                  <span className="font-semibold">{t.symbol}</span>
                  <span className="ml-2 text-[13px] text-muted-foreground">{t.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full sm:w-auto" disabled={!addSymbol || adding} onClick={() => addSymbol && handleAdd(addSymbol)}>
            <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Add to Watchlist
          </Button>
        </div>

        {/* ── Empty state ── */}
        {watchlist.length === 0 ? (
          <div className="rounded-2xl bg-card p-6">
            <p className="text-base font-semibold">Your watchlist is empty</p>
            <p className="mt-1 max-w-prose text-sm text-muted-foreground">
              Add stocks above. We&apos;ll track their price and show how they move from the day you started watching.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-card">

            {/* ── Watchlist table, from tablet width up ── */}
            <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th scope="col" className="w-full px-3 py-3 text-left font-normal xl:px-4">Stock</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right font-normal xl:px-4">Price</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right font-normal xl:px-4">Day change</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right font-normal xl:px-4">5D trend</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right font-normal xl:px-4">Since added</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right font-normal xl:px-4">Added on</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map(entry => {
                  const live      = quotes[entry.symbol];
                  const isLoading = loadingSymbols.has(entry.symbol) && !live;
                  const hasAlert  = alerts.some(a => a.symbol === entry.symbol);

                  return (
                    <tr key={entry.symbol} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40">
                      <td className="max-w-0 px-3 py-3 xl:px-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/stock/${entry.symbol}`} className="group min-w-0 flex-1">
                            <span className="block font-semibold group-hover:underline">{entry.symbol}</span>
                            <span className="block truncate text-[13px] text-muted-foreground">{entry.name}</span>
                          </Link>
                          <RowActions
                            symbol={entry.symbol}
                            hasAlert={hasAlert}
                            onAlert={() => setAlertDialogSymbol(entry.symbol)}
                            onRemove={() => handleRemove(entry.symbol)}
                          />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-medium tabular-nums xl:px-4">
                        {isLoading
                          ? <Skeleton className="ml-auto h-4 w-20" />
                          : live ? formatMoney(live.price, entry.currency) : <span className="font-normal text-muted-foreground">{DASH}</span>}
                      </td>
                      <td className="px-3 py-3 text-right xl:px-4">
                        {isLoading ? <Skeleton className="ml-auto h-8 w-16" /> : <DayChange live={live} currency={entry.currency} />}
                      </td>
                      <td className="px-3 py-3 xl:px-4">
                        <div className="flex justify-end">
                          {isLoading
                            ? <Skeleton className="h-9 w-[88px] xl:w-[120px]" />
                            : live?.sparkline?.length
                              ? <Sparkline data={live.sparkline} label={trendLabel(entry.symbol, live)} />
                              : <span className="text-sm text-muted-foreground">{DASH}</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right xl:px-4">
                        {isLoading ? <Skeleton className="ml-auto h-8 w-20" /> : <SinceAdded entry={entry} live={live} />}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 xl:px-4 text-right text-[13px] tabular-nums text-muted-foreground">
                        {addedOn(entry)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>

            {/* ── Stacked rows on a phone, with every field the table shows ── */}
            <ul className="divide-y divide-border/60 md:hidden">
              {watchlist.map(entry => {
                const live      = quotes[entry.symbol];
                const isLoading = loadingSymbols.has(entry.symbol) && !live;
                const hasAlert  = alerts.some(a => a.symbol === entry.symbol);

                return (
                  <li key={entry.symbol} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/stock/${entry.symbol}`} className="min-w-0 flex-1">
                        <span className="block font-semibold">{entry.symbol}</span>
                        <span className="block truncate text-sm text-muted-foreground">{entry.name}</span>
                      </Link>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-base font-semibold tabular-nums">
                          {isLoading
                            ? <Skeleton className="h-5 w-20" />
                            : live ? formatMoney(live.price, entry.currency) : <span className="font-normal text-muted-foreground">{DASH}</span>}
                        </span>
                        {!isLoading && <DayChange live={live} currency={entry.currency} />}
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        {isLoading
                          ? <Skeleton className="h-9 w-[88px] xl:w-[120px]" />
                          : live?.sparkline?.length
                            ? <Sparkline data={live.sparkline} label={trendLabel(entry.symbol, live)} />
                            : null}
                        <span className="text-[13px] text-muted-foreground">5D trend, added {addedOn(entry)}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[13px] text-muted-foreground">Since added</span>
                        {isLoading ? <Skeleton className="ml-auto h-8 w-20" /> : <SinceAdded entry={entry} live={live} />}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="h-11 flex-1"
                        onClick={() => setAlertDialogSymbol(entry.symbol)}
                      >
                        {hasAlert ? <BellRing className="mr-1.5 h-4 w-4" aria-hidden="true" /> : <Bell className="mr-1.5 h-4 w-4" aria-hidden="true" />}
                        {hasAlert ? 'Edit alert' : 'Set alert'}
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-11 flex-1"
                        aria-label={`Remove ${entry.symbol} from watchlist`}
                        onClick={() => handleRemove(entry.symbol)}
                      >
                        <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Remove
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>

{/* ── Alert dialog ── */}
      <Dialog open={!!alertDialogSymbol} onOpenChange={open => !open && setAlertDialogSymbol(null)}>
        {alertDialogSymbol && activeAlertSymbol && (
          <AlertDialog
            symbol={alertDialogSymbol}
            currency={activeAlertSymbol.currency}
            currentPrice={quotes[alertDialogSymbol]?.price ?? activeAlertSymbol.addedPrice}
            existing={alerts.find(a => a.symbol === alertDialogSymbol)}
            onSave={(tp, cond) => handleSaveAlert(alertDialogSymbol, tp, cond)}
            onRemove={() => handleRemoveAlert(alertDialogSymbol)}
            onClose={() => setAlertDialogSymbol(null)}
          />
        )}
      </Dialog>

      <Disclaimer />
    </div>
  );
}
