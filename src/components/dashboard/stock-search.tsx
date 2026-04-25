'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { getAllTickers } from '@/lib/data';
import type { Ticker } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

export default function StockSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 150);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const allTickers = useMemo(() => getAllTickers(), []);
  const router = useRouter();

  const results = useMemo(() => {
    if (!debouncedQuery) return allTickers.slice(0, 6);
    return allTickers
      .filter(
        t =>
          t.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          t.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
      .slice(0, 8);
  }, [debouncedQuery, allTickers]);

  const handleSelect = useCallback(
    (ticker: Ticker) => {
      setQuery('');
      setOpen(false);
      inputRef.current?.blur();
      router.push(`/stock/${encodeURIComponent(ticker.symbol)}`);
    },
    [router],
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={e => {
          if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
          if (e.key === 'Enter' && results.length > 0) handleSelect(results[0]);
        }}
        placeholder="Search stocks..."
        className="h-9 w-[140px] rounded-lg border border-border/50 bg-secondary pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:w-[200px] lg:w-[300px]"
      />

      {open && results.length > 0 && (
        <div className="absolute right-0 top-full z-50 mt-1 w-[280px] overflow-hidden rounded-lg border border-border/50 bg-popover shadow-xl sm:w-[320px]">
          <p className="border-b border-border/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {debouncedQuery ? 'Results' : 'Popular'}
          </p>
          {results.map(ticker => (
            <button
              key={ticker.symbol}
              className="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 transition-colors hover:bg-secondary/80"
              // onMouseDown instead of onClick so it fires before the input loses focus
              onMouseDown={e => {
                e.preventDefault();
                handleSelect(ticker);
              }}
            >
              <div className="flex flex-col items-start">
                <span className="font-mono font-semibold">{ticker.symbol}</span>
                <span className="text-[11px] text-muted-foreground">{ticker.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-sm font-medium">
                  {formatNumber(ticker.price, {
                    style: 'currency',
                    currency: ticker.currency || 'INR',
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className={cn('font-mono text-[11px]', ticker.percentChange >= 0 ? 'text-up' : 'text-down')}>
                  {ticker.percentChange > 0 ? '+' : ''}
                  {ticker.percentChange.toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
