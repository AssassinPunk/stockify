'use client';

import { AreaChart } from 'lucide-react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import StockSearch from './stock-search';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const famousStocks = [
    { symbol: 'RELIANCE', name: 'Reliance' },
    { symbol: 'TCS', name: 'TCS' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    return cn(
        'transition-colors hover:text-foreground px-3 py-1.5 rounded-md text-sm font-medium',
        pathname === href ? 'bg-secondary text-foreground' : 'text-muted-foreground'
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <nav className="flex w-full items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AreaChart className="h-6 w-6 text-primary" />
          <span className="text-lg hidden sm:inline-block">India Markets Radar</span>
        </Link>

        <div className="flex items-center gap-2">
            <Link href="/" className={getLinkClass('/')}>Home</Link>
            {famousStocks.map(stock => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`} className={getLinkClass(`/stock/${stock.symbol}`)}>
                    {stock.name}
                </Link>
            ))}
        </div>

        <div className="relative ml-auto flex-1 md:grow-0">
           <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  className="w-full rounded-lg bg-secondary pl-10 md:w-[200px] lg:w-[320px]"
                  onFocus={() => setOpen(true)}
                  onBlur={() => setOpen(false)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[calc(100vw-32px)] rounded-lg bg-secondary p-0 md:w-[200px] lg:w-[320px]"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <StockSearch onSelect={() => setOpen(false)} />
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </header>
  );
}
