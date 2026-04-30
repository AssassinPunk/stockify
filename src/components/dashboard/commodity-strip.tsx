'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Coins, Droplets, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CurrencyConverterTile } from '@/components/dashboard/currency-converter-tile';

type Commodity = {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  price: number;
  change: number;
  percentChange: number;
};

const ICONS = {
  gold:   Coins,
  oil:    Droplets,
  fx: ArrowLeftRight,
} as const;

const FALLBACK: Commodity[] = [
  { id: 'gold',   label: 'Gold',      symbol: 'GC=F',     unit: '$/oz',  price: 3300, change: 0, percentChange: 0 },
  { id: 'oil',    label: 'Crude Oil', symbol: 'CL=F',     unit: '$/bbl', price: 65,   change: 0, percentChange: 0 },
];

function CommodityItem({ item }: { item: Commodity }) {
  const isPos = item.percentChange >= 0;
  const Icon = ICONS[item.id as keyof typeof ICONS] ?? Coins;
  const priceStr =
    `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-1 items-center gap-3 px-5 py-3.5">
      <div className={cn('rounded-lg p-2 shrink-0', isPos ? 'bg-up/10' : 'bg-down/10')}>
        <Icon className={cn('h-4 w-4', isPos ? 'text-up' : 'text-down')} />
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">
            {item.label}
          </p>
          <p className="font-mono text-sm font-bold leading-tight">
            {priceStr}
            <span className="ml-1 text-[10px] font-normal text-muted-foreground">{item.unit}</span>
          </p>
        </div>
        <div className={cn('flex items-center gap-0.5 text-xs font-bold font-mono shrink-0', isPos ? 'text-up' : 'text-down')}>
          {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPos ? '+' : ''}{item.percentChange.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

export default function CommodityStrip() {
  const [data, setData] = useState<Commodity[]>(FALLBACK);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/commodities', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json) && json.length === 2) setData(json);
      } catch {}
    };

    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/10 sm:flex-row">
      {data.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            'flex flex-1',
            'border-b border-border/30 sm:border-b-0 sm:border-r',
            i === data.length - 1 && 'sm:border-r-0',
          )}
        >
          <CommodityItem item={item} />
        </div>
      ))}

      <div className="flex flex-1">
        <CurrencyConverterTile />
      </div>
    </div>
  );
}
