import type { Ticker } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/format';

function MoverRow({ ticker, currency }: { ticker: Ticker; currency: 'INR' | 'USD' }) {
  const pct    = ticker.percentChange;
  const symbol = currency === 'USD' ? '$' : '₹';

  return (
    <li className="flex items-start justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug">{ticker.name}</p>
        <p className="text-[13px] tabular-nums text-muted-foreground">
          {symbol}{formatNumber(ticker.price, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
      <span className={cn(
        'shrink-0 text-sm font-medium tabular-nums',
        pct > 0 ? 'text-up' : pct < 0 ? 'text-down' : 'text-muted-foreground',
      )}>
        {pct > 0 ? '+' : ''}{pct.toFixed(2)}%
      </span>
    </li>
  );
}

function MoverList({ title, tickers, currency }: { title: string; tickers: Ticker[]; currency: 'INR' | 'USD' }) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <ul className="mt-1 divide-y divide-border/60">
        {tickers.map(t => <MoverRow key={t.symbol} ticker={t} currency={currency} />)}
      </ul>
    </div>
  );
}

export default function MoversCard({ gainers, losers, currency = 'INR' }: { gainers: Ticker[]; losers: Ticker[]; currency?: 'INR' | 'USD' }) {
  // A stock whose quote failed has no price, and it would otherwise read as a real 0.00% move.
  const liveGainers = gainers.filter(t => t.price > 0);
  const liveLosers  = losers.filter(t => t.price > 0);
  const hasData     = liveGainers.length > 0 || liveLosers.length > 0;

  return (
    <section className="flex h-full flex-col gap-3 rounded-2xl bg-card p-5" aria-label="Today's movers">
      <h2 className="text-base font-semibold">Today&apos;s Movers</h2>
      {hasData ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <MoverList title="Top Gainers" tickers={liveGainers} currency={currency} />
          <MoverList title="Top Losers" tickers={liveLosers} currency={currency} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Movers are unavailable right now. Please check back shortly.</p>
      )}
    </section>
  );
}
