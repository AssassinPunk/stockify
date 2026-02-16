'use client';

import { AreaChart, Settings, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import StockSearch from './stock-search';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { getAllTickers } from '@/lib/data';
import type { Ticker } from '@/lib/types';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

const MAX_PINNED_STOCKS = 3;

function EditPinnedStocksDialog({ pinnedStocks, onSave }: { pinnedStocks: Ticker[], onSave: (newPinned: Ticker[]) => void }) {
  const allTickers = getAllTickers().filter(t => !t.isIndex); // Filter out indices
  const [selected, setSelected] = useState<string[]>(pinnedStocks.map(s => s.symbol));
  const { toast } = useToast();

  const handleCheckedChange = (checked: boolean | 'indeterminate', symbol: string) => {
    if (checked) {
      if (selected.length >= MAX_PINNED_STOCKS) {
        toast({
          variant: "destructive",
          title: "Limit Reached",
          description: `You can only pin up to ${MAX_PINNED_STOCKS} stocks.`,
        });
        return;
      }
      setSelected([...selected, symbol]);
    } else {
      setSelected(selected.filter(s => s !== symbol));
    }
  };

  const handleSave = () => {
    const newPinned = getAllTickers().filter(t => selected.includes(t.symbol));
    onSave(newPinned);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Settings />
          <span className="sr-only">Edit Pinned Stocks</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pinned Stocks</DialogTitle>
          <DialogDescription>
            Select up to {MAX_PINNED_STOCKS} stocks to display in the header for quick access.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72">
            <div className="grid gap-4 py-4 pr-6">
            {allTickers.map(ticker => (
                <div key={ticker.symbol} className="flex items-center space-x-2">
                    <Checkbox
                        id={ticker.symbol}
                        checked={selected.includes(ticker.symbol)}
                        onCheckedChange={(checked) => handleCheckedChange(checked, ticker.symbol)}
                    />
                    <Label htmlFor={ticker.symbol} className="flex-1 cursor-pointer">
                        {ticker.name} ({ticker.symbol})
                    </Label>
                </div>
            ))}
            </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [pinnedStocks, setPinnedStocks] = useState<Ticker[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    try {
        const item = window.localStorage.getItem('pinnedStocks');
        const defaultSymbols = ['RELIANCE', 'TCS', 'HDFCBANK'];
        const allTickers = getAllTickers();
        const defaultStocks = allTickers.filter(t => defaultSymbols.includes(t.symbol));
        setPinnedStocks(item ? JSON.parse(item) : defaultStocks);
    } catch (error) {
        const defaultSymbols = ['RELIANCE', 'TCS', 'HDFCBANK'];
        const allTickers = getAllTickers();
        const defaultStocks = allTickers.filter(t => defaultSymbols.includes(t.symbol));
        setPinnedStocks(defaultStocks);
    }
  }, []);

  const handleSavePinnedStocks = (newPinned: Ticker[]) => {
    setPinnedStocks(newPinned);
     try {
        window.localStorage.setItem('pinnedStocks', JSON.stringify(newPinned));
    } catch (error) {
        console.error("Could not save pinned stocks to local storage", error);
    }
  };

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
          <span className="text-lg hidden sm:inline-block">Stockify</span>
        </Link>

        <div className="flex items-center gap-2">
            <Link href="/" className={getLinkClass('/')}>India</Link>
            <Link href="/international" className={getLinkClass('/international')}>International</Link>
            <Separator orientation="vertical" className="h-6 mx-2" />
            {pinnedStocks.map(stock => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`} className={getLinkClass(`/stock/${stock.symbol}`)}>
                    {stock.name}
                </Link>
            ))}
             <EditPinnedStocksDialog pinnedStocks={pinnedStocks} onSave={handleSavePinnedStocks} />
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
