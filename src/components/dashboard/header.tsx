'use client';

import { AreaChart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import StockSearch from './stock-search';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <nav className="flex w-full items-center gap-4">
        <div className="flex items-center gap-2 font-semibold">
          <AreaChart className="h-6 w-6 text-primary" />
          <span className="text-lg">India Markets Radar</span>
        </div>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start rounded-lg bg-secondary text-muted-foreground md:w-[200px] lg:w-[320px]"
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Search stocks...</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[208px] rounded-lg bg-secondary p-0 md:w-[200px] lg:w-[320px]"
              align="start"
            >
              <StockSearch onSelect={() => setOpen(false)} />
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </header>
  );
}
