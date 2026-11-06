'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
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

// Symbol/label metadata only — no prices. Prices always come from the API.
const COMMODITY_META = [
  { id: 'gold',     label: 'Gold',        symbol: 'GC=F',     unit: '$/oz',    category: 'Metal'  },
  { id: 'silver',   label: 'Silver',      symbol: 'SI=F',     unit: '$/oz',    category: 'Metal'  },
  { id: 'platinum', label: 'Platinum',    symbol: 'PL=F',     unit: '$/oz',    category: 'Metal'  },
  { id: 'copper',   label: 'Copper',      symbol: 'HG=F',     unit: '$/lb',    category: 'Metal'  },
  { id: 'oil',      label: 'Crude Oil',   symbol: 'CL=F',     unit: '$/bbl',   category: 'Energy' },
  { id: 'brent',    label: 'Brent Crude', symbol: 'BZ=F',     unit: '$/bbl',   category: 'Energy' },
  { id: 'natgas',   label: 'Natural Gas', symbol: 'NG=F',     unit: '$/MMBtu', category: 'Energy' },
  { id: 'usdinr',   label: 'USD/INR',     symbol: 'USDINR=X', unit: '₹',      category: 'Forex'  },
  { id: 'eurusd',   label: 'EUR/USD',     symbol: 'EURUSD=X', unit: '$',       category: 'Forex'  },
  { id: 'gbpusd',   label: 'GBP/USD',     symbol: 'GBPUSD=X', unit: '$',       category: 'Forex'  },
  { id: 'usdjpy',   label: 'USD/JPY',     symbol: 'USDJPY=X', unit: '¥',      category: 'Forex'  },
  { id: 'usdcny',   label: 'USD/CNY',     symbol: 'USDCNY=X', unit: '¥',      category: 'Forex'  },
];

// Forex rates carry their own currency in the unit, so only commodities get a dollar sign.
function formatPrice(p: number, category: string) {
  const prefix = category === 'Forex' ? '' : '$';
  if (p >= 1000) return `${prefix}${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (p >= 10)   return `${prefix}${p.toFixed(2)}`;
  return `${prefix}${p.toFixed(4)}`;
}

function TickerItem({ item, onClick }: { item: Commodity; onClick: () => void }) {
  const isPos = item.percentChange >= 0;

  return (
    <button
      onClick={onClick}
      className="flex shrink-0 flex-col items-start rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="text-xs leading-4 text-muted-foreground">{item.label}</span>
      <span className="flex items-baseline gap-2 text-sm leading-5 tabular-nums">
        <span className="font-semibold">{formatPrice(item.price, item.category)}</span>
        <span className="text-xs text-muted-foreground">{item.unit}</span>
        <span className={isPos ? 'text-up' : 'text-down'}>{isPos ? '+' : ''}{item.percentChange.toFixed(2)}%</span>
      </span>
    </button>
  );
}

const CONVERTER_INPUT = 'h-9 rounded-md bg-secondary px-2 text-sm tabular-nums outline-none focus:ring-1 focus:ring-ring';

// Compact inline currency converter
function MiniConverter() {
  const [from, setFrom]         = useState('USD');
  const [to, setTo]             = useState('INR');
  const [amountStr, setAmountStr] = useState('');
  const amount = parseFloat(amountStr) || 0;
  const [rate, setRate]         = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://open.er-api.com/v6/latest/${from}`)
      .then(r => r.json())
      .then(d => { if (!cancelled && d.result === 'success') setRate(d.rates[to] ?? null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [from, to]);

  const result = rate != null && amount > 0 ? (amount * rate).toFixed(4) : '0.0000';

  return (
    <form
      className="flex flex-wrap items-center gap-2 p-3 lg:flex-nowrap lg:px-4"
      aria-label="Currency converter"
      onSubmit={e => e.preventDefault()}
    >
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground lg:whitespace-nowrap">
        <ArrowLeftRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Convert
      </span>
      <input
        type="text"
        inputMode="decimal"
        aria-label="Amount"
        value={amountStr}
        placeholder="0"
        onChange={e => {
          const v = e.target.value;
          if (/^\d*\.?\d*$/.test(v)) setAmountStr(v);
        }}
        onBlur={() => { if (!amountStr || amountStr === '.') setAmountStr(''); }}
        className={`w-16 ${CONVERTER_INPUT}`}
      />
      <input
        aria-label="From currency"
        value={from}
        maxLength={3}
        onChange={e => setFrom(e.target.value.toUpperCase())}
        className={`w-14 uppercase ${CONVERTER_INPUT}`}
      />
      <span className="shrink-0 text-sm text-muted-foreground" aria-hidden="true">→</span>
      <input
        aria-label="To currency"
        value={to}
        maxLength={3}
        onChange={e => setTo(e.target.value.toUpperCase())}
        className={`w-14 uppercase ${CONVERTER_INPUT}`}
      />
      <output className="text-sm font-semibold tabular-nums text-foreground">{result}</output>
    </form>
  );
}

function SkeletonItem() {
  return (
    <div className="flex shrink-0 flex-col gap-1.5 px-3 py-1.5">
      <div className="h-3 w-12 rounded bg-secondary" />
      <div className="h-4 w-28 rounded bg-secondary" />
    </div>
  );
}

export default function CommodityStrip() {
  const [data, setData]     = useState<Commodity[] | null>(null);
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

  // duplicate for seamless loop; only start scrolling once real data is loaded
  const items = data ? [...data, ...data] : [];
  const speed = (data?.length ?? 0) * 4; // seconds

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-card lg:flex-row lg:items-center">

      {/* Scrolling ticker, clipped to whatever width is left beside the converter */}
      <div
        className="relative min-w-0 flex-1 overflow-hidden [contain:inline-size] motion-reduce:overflow-x-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {data === null ? (
          // Show the final layout until the first API response arrives
          <div className="flex h-14 items-center">
            {COMMODITY_META.map(m => <SkeletonItem key={m.id} />)}
          </div>
        ) : (
          <div
            className="flex h-14 items-center motion-reduce:![animation:none]"
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
        )}
      </div>

      {/* Converter pinned to the right end */}
      <div className="shrink-0 bg-secondary/40">
        <MiniConverter />
      </div>
    </div>
  );
}
