'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Ticker = { symbol: string; name: string };

const LIST_ID = 'backtest-stock-list';

export default function StockPicker({
  id, tickers, value, onChange,
}: {
  id: string;
  tickers: Ticker[];
  value: string;
  onChange: (symbol: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  const matches = useMemo(() => {
    const words = query.trim().toLowerCase();
    if (!words) return tickers;
    return tickers.filter(t => t.symbol.toLowerCase().includes(words) || t.name.toLowerCase().includes(words));
  }, [query, tickers]);

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const openList = () => {
    setQuery('');
    setActive(Math.max(0, tickers.findIndex(t => t.symbol === value)));
    setOpen(true);
  };
  const choose = (ticker?: Ticker) => {
    if (ticker) onChange(ticker.symbol);
    setOpen(false);
  };

  const selected = tickers.find(t => t.symbol === value);

  return (
    <div className="relative">
      <Input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={LIST_ID}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? `${LIST_ID}-${matches[active].symbol}` : undefined}
        autoComplete="off"
        placeholder="Search by name or symbol"
        value={open ? query : selected ? `${selected.symbol} · ${selected.name}` : value}
        onFocus={openList}
        onClick={() => { if (!open) openList(); }}
        onBlur={() => setOpen(false)}
        onChange={event => { setQuery(event.target.value); setActive(0); setOpen(true); }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) { openList(); return; }
            const step = event.key === 'ArrowDown' ? 1 : -1;
            setActive(current => (matches.length ? (current + step + matches.length) % matches.length : 0));
          } else if (event.key === 'Enter' && open) {
            event.preventDefault();
            choose(matches[active]);
          } else if (event.key === 'Escape' && open) {
            event.preventDefault();
            setOpen(false);
          }
        }}
        className="h-10 truncate pr-9 text-sm max-sm:h-11"
      />
      <ChevronDown className={cn('pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />

      {open && (
        <ul
          ref={list}
          id={LIST_ID}
          role="listbox"
          aria-label="Stocks"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-border bg-popover p-1"
        >
          {matches.length === 0 && <li className="px-2.5 py-2 text-sm text-muted-foreground">No stock matches &ldquo;{query.trim()}&rdquo;.</li>}
          {matches.map((ticker, index) => (
            <li
              key={ticker.symbol}
              id={`${LIST_ID}-${ticker.symbol}`}
              role="option"
              aria-selected={ticker.symbol === value}
              onMouseDown={event => event.preventDefault()}
              onClick={() => choose(ticker)}
              onMouseEnter={() => setActive(index)}
              className={cn('flex min-h-9 cursor-pointer items-baseline gap-2 rounded-md px-2.5 py-2 text-sm max-sm:min-h-11', index === active && 'bg-secondary')}
            >
              <span className="flex-none font-medium">{ticker.symbol}</span>
              <span className="min-w-0 truncate text-muted-foreground">{ticker.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
