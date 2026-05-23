import Header from '@/components/dashboard/header';
import MainChart from '@/components/dashboard/main-chart';
import NewsFeed from '@/components/dashboard/news-feed';
import Disclaimer from '@/components/dashboard/disclaimer';
import FundamentalsCard from '@/components/dashboard/fundamentals-card';
import CompareChart from '@/components/dashboard/compare-chart';
import { getAllTickers } from '@/lib/data';
import {
  fetchLiveQuote,
  fetchLiveNews,
  fetchLiveInternationalNews,
  fetchLiveTrendingTickers,
  fetchLiveInternationalTrendingTickers,
  fetchYahooChart,
} from '@/lib/yahoo-finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatChange, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';
import TrendingTickers from '@/components/dashboard/trending-tickers';

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = await params;
  const decodedSymbol = decodeURIComponent(rawSymbol);
  const ticker = getAllTickers().find(t => t.symbol.toLowerCase() === decodedSymbol.toLowerCase());

  if (!ticker) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 p-4 text-center md:p-6">
          <h1 className="text-2xl font-bold">Stock not found</h1>
          <p>The stock with symbol {decodedSymbol.toUpperCase()} could not be found.</p>
        </main>
        <Disclaimer />
      </div>
    );
  }

  const isIndianTicker = ticker.currency === 'INR';

  const [liveQuote, news, trendingData, mainChartData] = await Promise.all([
    fetchLiveQuote(ticker.symbol, { cache: 'no-store' }),
    isIndianTicker ? fetchLiveNews() : fetchLiveInternationalNews(),
    isIndianTicker ? fetchLiveTrendingTickers() : fetchLiveInternationalTrendingTickers(),
    fetchYahooChart(ticker.symbol),
  ]);

  const displayTicker = {
    ...ticker,
    price:         liveQuote?.price         ?? 0,
    change:        liveQuote?.change        ?? 0,
    percentChange: liveQuote?.percentChange ?? 0,
  };
  const isPositive = displayTicker.change >= 0;

  const firstWord = displayTicker.name.toLowerCase().split(' ')[0];
  const stockNews = news.filter(a => a.title.toLowerCase().includes(firstWord));
  const otherNews = news.filter(a => !a.title.toLowerCase().includes(firstWord));
  const combinedNews = [...stockNews, ...otherNews].slice(0, 5);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        {/* Price header */}
        <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                {displayTicker.name} ({displayTicker.symbol})
              </CardTitle>
            </div>
            {isPositive ? (
              <ArrowUp className="h-6 w-6 text-up" />
            ) : (
              <ArrowDown className="h-6 w-6 text-down" />
            )}
          </CardHeader>
          <CardContent>
            <div className="font-code text-3xl font-bold">
              {formatNumber(displayTicker.price, {
                style: 'currency',
                currency: displayTicker.currency || 'INR',
                minimumFractionDigits: 2,
              })}
            </div>
            <p className={cn('font-code text-lg', isPositive ? 'text-up' : 'text-down')}>
              {formatChange(displayTicker.change, displayTicker.percentChange)}
            </p>
          </CardContent>
        </Card>

        {/* Key metrics */}
        <FundamentalsCard symbol={displayTicker.symbol} currency={displayTicker.currency ?? 'INR'} />

        {/* Chart + sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MainChart ticker={displayTicker} chartData={mainChartData} />
          </div>
          <div className="lg:col-span-4">
            <TrendingTickers trending={trendingData} />
          </div>
        </div>

        {/* Comparison chart */}
        <CompareChart ticker={displayTicker} />

        <div className="grid grid-cols-1">
          <NewsFeed news={combinedNews} />
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
