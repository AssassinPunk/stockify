import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Ticker } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/format';

function MoverRow({ ticker, isGainer }: { ticker: Ticker; isGainer: boolean }) {
  const color = isGainer ? 'text-emerald-400' : 'text-red-400';
  const pct   = ticker.percentChange.toFixed(2);

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{ticker.name}</p>
        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
          ₹{formatNumber(ticker.price, { minimumFractionDigits: 2 })}
        </p>
      </div>
      <span className={cn('text-xs font-mono font-bold shrink-0', color)}>
        {isGainer ? '+' : ''}{pct}%
      </span>
    </div>
  );
}

export default function MoversCard({ gainers, losers }: { gainers: Ticker[]; losers: Ticker[] }) {
  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Today&apos;s Movers</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        {/* Gainers */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <p className="text-xs font-semibold text-emerald-400">Top Gainers</p>
          </div>
          {gainers.map(t => <MoverRow key={t.symbol} ticker={t} isGainer />)}
        </div>

        {/* Losers */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown className="h-3.5 w-3.5 text-red-400" />
            <p className="text-xs font-semibold text-red-400">Top Losers</p>
          </div>
          {losers.map(t => <MoverRow key={t.symbol} ticker={t} isGainer={false} />)}
        </div>
      </CardContent>
    </Card>
  );
}
