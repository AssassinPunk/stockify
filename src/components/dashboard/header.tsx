'use client';

import { AreaChart, Settings, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import StockSearch from './stock-search';
import { Input } from '../ui/input';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MAX_PINNED_STOCKS = 3;

function EditPinnedStocksDialog({ pinnedStocks, onSave }: { pinnedStocks: Ticker[], onSave: (newPinned: Ticker[]) => void }) {
  const allTickers = getAllTickers().filter(t => !t.isIndex); 
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
          <Settings className="h-4 w-4" />
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
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  const getLinkClass = (href: string) => {
    return cn(
        'transition-colors hover:text-foreground px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap',
        pathname === href ? 'bg-secondary text-foreground' : 'text-muted-foreground'
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <nav className="flex w-full items-center gap-4 md:gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold flex-shrink-0">
          <AreaChart className="h-6 w-6 text-primary" />
          <span className="text-lg hidden sm:inline-block">Stockify</span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
            <Link href="/" className={getLinkClass('/')}>India</Link>
            <Link href="/international" className={getLinkClass('/international')}>International</Link>
            <Separator orientation="vertical" className="h-6 mx-2 hidden md:block" />
            <div className="hidden lg:flex items-center gap-1 md:gap-2">
              {pinnedStocks.map(stock => (
                  <Link key={stock.symbol} href={`/stock/${stock.symbol}`} className={getLinkClass(`/stock/${stock.symbol}`)}>
                      {stock.symbol}
                  </Link>
              ))}
              <EditPinnedStocksDialog pinnedStocks={pinnedStocks} onSave={handleSavePinnedStocks} />
            </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative hidden md:flex items-center">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stocks..."
                    className="w-full rounded-lg bg-secondary pl-10 md:w-[180px] lg:w-[300px]"
                    onFocus={() => setOpen(true)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-[calc(100vw-32px)] rounded-lg bg-secondary p-0 md:w-[200px] lg:w-[320px]"
                align="end"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <StockSearch onSelect={() => setOpen(false)} />
              </PopoverContent>
            </Popover>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || ''} alt={user.email || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.email?.[0].toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'Account'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
