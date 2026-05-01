'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Coins, Droplets, FlameKindling, ArrowLeftRight, Cpu, Diamond } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export type Commodity = {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  category: string;
  price: number;
  change: number;
  percentChange: number;
};

const ITEM_ICONS: Record<string, React.ElementType> = {
  gold:     Coins,
  silver:   Diamond,
  platinum: Coins,
  copper:   Cpu,
  oil:      Droplets,
  brent:    Droplets,
  natgas:   FlameKindling,
  usdinr:   ArrowLeftRight,
  eurusd:   ArrowLeftRight,
  gbpusd:   ArrowLeftRight,
  usdjpy:   ArrowLeftRight,
  usdcny:   ArrowLeftRight,
};

const FALLBACK: Commodity[] = [
  { id: 'gold',     label: 'Gold',        symbol: 'GC=F',     unit: '$/oz',    category: 'Metal',  price: 3300,  change: 0, percentChange: 0 },
  { id: 'silver',   label: 'Silver',      symbol: 'SI=F',     unit: '$/oz',    category: 'Metal',  price: 33,    change: 0, percentChange: 0 },
  { id: 'platinum', label: 'Platinum',    symbol: 'PL=F',     unit: '$/oz',    category: 'Metal',  price: 980,   change: 0, percentChange: 0 },
  { id: 'copper',   label: 'Copper',      symbol: 'HG=F',     unit: '$/lb',    category: 'Metal',  price: 4.5,   change: 0, percentChange: 0 },
  { id: 'oil',      label: 'Crude Oil',   symbol: 'CL=F',     unit: '$/bbl',   category: 'Energy', price: 65,    change: 0, percentChange: 0 },
  { id: 'brent',    label: 'Brent Crude', symbol: 'BZ=F',     unit: '$/bbl',   category: 'Energy', price: 68,    change: 0, percentChange: 0 },
  { id: 'natgas',   label: 'Natural Gas', symbol: 'NG=F',     unit: '$/MMBtu', category: 'Energy', price: 3.5,   change: 0, percentChange: 0 },
  { id: 'usdinr',   label: 'USD/INR',     symbol: 'USDINR=X', unit: '₹',      category: 'Forex',  price: 83.5,  change: 0, percentChange: 0 },
  { id: 'eurusd',   label: 'EUR/USD',     symbol: 'EURUSD=X', unit: '$',       category: 'Forex',  price: 1.09,  change: 0, percentChange: 0 },
  { id: 'gbpusd',   label: 'GBP/USD',     symbol: 'GBPUSD=X', unit: '$',       category: 'Forex',  price: 1.27,  change: 0, percentChange: 0 },
  { id: 'usdjpy',   label: 'USD/JPY',     symbol: 'USDJPY=X', unit: '¥',      category: 'Forex',  price: 149,   change: 0, percentChange: 0 },
  { id: 'usdcny',   label: 'USD/CNY',     symbol: 'USDCNY=X', unit: '¥',      category: 'Forex',  price: 7.24,  change: 0, percentChange: 0 },
];

function formatPrice(p: number) {
  if (p >= 1000) return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (p >= 10)   return `$${p.toFixed(2)}`;
  if (p >= 1)    return `$${p.toFixed(4)}`;
  return `$${p.toFixed(4)}`;
}

function TickerItem({ item, onClick }: { item: Commodity; onClick: () => void }) {
  const isPos = item.percentChange >= 0;
  const Icon  = ITEM_ICONS[item.id] ?? Coins;

  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition-colors rounded-lg group"
    >
      <div className={cn('rounded-md p-1.5 shrink-0', isPos ? 'bg-up/10' : 'bg-down/10')}>
        <Icon className={cn('h-3.5 w-3.5', isPos ? 'text-up' : 'text-down')} />
      </div>
      <div className="flex flex-col items-start gap-0">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground leading-none">
          {item.label}
        </span>
        <span className="font-mono text-sm font-bold leading-tight">
          {formatPrice(item.price)}
          <span className="ml-1 text-[9px] font-normal text-muted-foreground">{item.unit}</span>
        </span>
      </div>
      <span className={cn('flex items-center gap-0.5 font-mono text-xs font-bold ml-1', isPos ? 'text-up' : 'text-down')}>
        {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {isPos ? '+' : ''}{item.percentChange.toFixed(2)}%
      </span>
    </button>
  );
}

// Compact inline currency converter
function MiniConverter() {
  const [from, setFrom]     = useState('USD');
  const [to, setTo]         = useState('INR');
  const [amount, setAmount] = useState(1);
  const [rate, setRate]     = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://open.er-api.com/v6/latest/${from}`)
      .then(r => r.json())
      .then(d => { if (!cancelled && d.result === 'success') setRate(d.rates[to] ?? null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [from, to]);

  const result = rate != null ? (amount * rate).toFixed(4) : '—';

  return (
    <div className="flex items-center gap-3 px-5">
      <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <input
        type="number"
        value={amount}
        min={0}
        onChange={e => setAmount(Number(e.target.value))}
        className="w-16 rounded-md bg-secondary/60 px-2 py-1 font-mono text-xs font-bold outline-none focus:ring-1 focus:ring-border"
      />
      <input
        value={from}
        maxLength={3}
        onChange={e => setFrom(e.target.value.toUpperCase())}
        className="w-14 rounded-md bg-secondary/60 px-2 py-1 font-mono text-xs font-bold uppercase outline-none focus:ring-1 focus:ring-border"
      />
      <span className="text-xs text-muted-foreground shrink-0">→</span>
      <input
        value={to}
        maxLength={3}
        onChange={e => setTo(e.target.value.toUpperCase())}
        className="w-14 rounded-md bg-secondary/60 px-2 py-1 font-mono text-xs font-bold uppercase outline-none focus:ring-1 focus:ring-border"
      />
      <span className="font-mono text-sm font-bold text-foreground">{result}</span>
    </div>
  );
}

export default function CommodityStrip() {
  const [data, setData]     = useState<Commodity[]>(FALLBACK);
  const [paused, setPaused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch('/api/commodities', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) setData(json);
      } catch {}
    };
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  // duplicate for seamless loop
  const items = [...data, ...data];
  const speed = data.length * 4; // seconds

  return (
    <div className="flex w-full items-center overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/10 h-14">

      {/* Scrolling ticker — fixed width, never stretches layout */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: 620,
          maskImage: 'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex items-center h-14"
          style={{
            animation: `ticker-scroll-h ${speed}s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
            width: 'max-content',
          }}
        >
          {items.map((item, i) => (
            <TickerItem
              key={`${item.id}-${i}`}
              item={item}
              onClick={() => router.push(`/commodity/${item.id}`)}
            />
          ))}
        </div>
      </div>

      <div className="h-8 w-px shrink-0 bg-border/40" />

      {/* Middle label */}
      <div className="flex flex-1 min-w-0 items-center justify-center gap-2 px-4">
        <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 whitespace-nowrap">
          Currency Converter
        </span>
      </div>

      <div className="h-8 w-px shrink-0 bg-border/40" />

      {/* Converter pinned to the right end */}
      <MiniConverter />
    </div>
  );
}
