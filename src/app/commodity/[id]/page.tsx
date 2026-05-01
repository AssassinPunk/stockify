import { notFound } from 'next/navigation';
import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import CommodityChart from '@/components/dashboard/commodity-chart';
import { COMMODITIES } from '@/lib/commodities-data';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

async function getCommodityQuote(symbol: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`;
    const res  = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price: number = meta.regularMarketPrice;
    const prev: number  = meta.chartPreviousClose;
    return {
      price,
      change:        price - prev,
      percentChange: ((price - prev) / prev) * 100,
      open:          meta.regularMarketOpen          ?? prev,
      dayHigh:       meta.regularMarketDayHigh       ?? price,
      dayLow:        meta.regularMarketDayLow        ?? price,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh        ?? price,
      fiftyTwoWeekLow:  meta.fiftyTwoWeekLow         ?? price,
      previousClose: prev,
    };
  } catch {
    return null;
  }
}

export default async function CommodityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const commodity = COMMODITIES.find(c => c.id === id);
  if (!commodity) notFound();

  const quote = await getCommodityQuote(commodity.symbol);
  const price = quote?.price ?? 0;
  const change = quote?.change ?? 0;
  const pct   = quote?.percentChange ?? 0;
  const isPos = change >= 0;

  const fmt = (n: number) =>
    n >= 1000
      ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : n >= 1
      ? n.toFixed(4)
      : n.toFixed(6);

  const stats = quote
    ? [
        { label: 'Open',          value: fmt(quote.open) },
        { label: 'Day High',      value: fmt(quote.dayHigh) },
        { label: 'Day Low',       value: fmt(quote.dayLow) },
        { label: 'Prev Close',    value: fmt(quote.previousClose) },
        { label: '52W High',      value: fmt(quote.fiftyTwoWeekHigh) },
        { label: '52W Low',       value: fmt(quote.fiftyTwoWeekLow) },
      ]
    : [];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">

        {/* Price header */}
        <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {commodity.category}
              </p>
              <CardTitle className="text-2xl font-bold">
                {commodity.label}
                <span className="ml-3 text-sm font-normal text-muted-foreground">{commodity.symbol}</span>
              </CardTitle>
            </div>
            {isPos
              ? <ArrowUp className="h-6 w-6 text-up" />
              : <ArrowDown className="h-6 w-6 text-down" />}
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold">
              {fmt(price)}
              <span className="ml-2 text-base font-normal text-muted-foreground">{commodity.unit}</span>
            </div>
            <p className={cn('font-mono text-lg', isPos ? 'text-up' : 'text-down')}>
              {isPos ? '+' : ''}{fmt(Math.abs(change))} ({isPos ? '+' : ''}{pct.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>

        {/* Key stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map(s => (
              <Card key={s.label} className="rounded-xl border-border/50 bg-card">
                <CardContent className="px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="mt-0.5 font-mono text-sm font-bold">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Chart */}
        <CommodityChart symbol={commodity.symbol} label={commodity.label} unit={commodity.unit} />

      </main>
      <Disclaimer />
    </div>
  );
}
