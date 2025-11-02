'use client';

import { useEffect, useState, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getAllTickers } from '@/lib/data';
import type { Ticker } from '@/lib/types';
import { useDebounce } from '@/hooks/use-debounce';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function StockSearch({ onSelect }: { onSelect?: () => void }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);
  const [results, setResults] = useState<Ticker[]>([]);
  const allTickers = useMemo(() => getAllTickers(), []);

  useEffect(() => {
    if (debouncedQuery) {
      const filtered = allTickers.filter(
        (ticker) =>
          ticker.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          ticker.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setResults(filtered.slice(0, 10)); // Limit results for performance
    } else {
      setResults([]);
    }
  }, [debouncedQuery, allTickers]);

  const handleSelect = () => {
    setQuery('');
    onSelect?.();
  };

  return (
    <Command shouldFilter={false} className="bg-secondary">
      <CommandInput
        placeholder="Search stocks..."
        value={query}
        onValueChange={setQuery}
        className="h-11 border-0 bg-secondary ring-offset-0 focus:ring-0"
      />
      <CommandList>
        {results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((ticker) => (
              <CommandItem key={ticker.symbol} onSelect={handleSelect} value={`${ticker.symbol} ${ticker.name}`}>
                <div className="flex w-full cursor-pointer items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold">{ticker.symbol}</span>
                    <span className="text-xs text-muted-foreground">{ticker.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="font-code text-sm font-medium">
                        {formatNumber(ticker.price, {style: 'currency', currency: 'INR', minimumFractionDigits: 2})}
                     </span>
                     <span className={cn("font-code text-xs", ticker.percentChange >= 0 ? 'text-up' : 'text-down')}>
                        {ticker.percentChange > 0 ? '+' : ''}{ticker.percentChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {debouncedQuery && results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
      </CommandList>
    </Command>
  );
}
