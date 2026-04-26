import Header from '@/components/dashboard/header';
import MainChart from '@/components/dashboard/main-chart';
import NewsFeed from '@/components/dashboard/news-feed';
import Disclaimer from '@/components/dashboard/disclaimer';
import FundamentalsCard from '@/components/dashboard/fundamentals-card';
import CompareChart from '@/components/dashboard/compare-chart';
import { getAllTickers, getNews, getMainChartData, getInternationalNews } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatChange, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';
import TrendingTickers from '@/components/dashboard/trending-tickers';
import { getTrendingTickers, getInternationalTrendingTickers } from '@/lib/data';

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = await params;
  const allTickers = getAllTickers();
  const indianNews = getNews();
  const internationalNews = getInternationalNews();
  const indianTrending = getTrendingTickers();
  const internationalTrending = getInternationalTrendingTickers();

  const decodedSymbol = decodeURIComponent(rawSymbol);
  const ticker = allTickers.find(t => t.symbol.toLowerCase() === decodedSymbol.toLowerCase());

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
  const news = isIndianTicker ? indianNews : internationalNews;
  const trending = isIndianTicker ? indianTrending : internationalTrending;
  const mainChartData = getMainChartData(ticker.symbol);
  const isPositive = ticker.change >= 0;

  const stockNews = news.filter(
    article => article.title.toLowerCase().includes(ticker.name.toLowerCase().split(' ')[0])
  );
  const otherNews = news.filter(
    article => !article.title.toLowerCase().includes(ticker.name.toLowerCase().split(' ')[0])
  );
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
                {ticker.name} ({ticker.symbol})
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
              {formatNumber(ticker.price, {
                style: 'currency',
                currency: ticker.currency || 'INR',
                minimumFractionDigits: 2,
              })}
            </div>
            <p className={cn('font-code text-lg', isPositive ? 'text-up' : 'text-down')}>
              {formatChange(ticker.change, ticker.percentChange)}
            </p>
          </CardContent>
        </Card>

        {/* Key metrics */}
        <FundamentalsCard symbol={ticker.symbol} currency={ticker.currency ?? 'INR'} />

        {/* Chart + sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MainChart ticker={ticker} chartData={mainChartData} />
          </div>
          <div className="lg:col-span-4">
            <TrendingTickers trending={trending} />
          </div>
        </div>

        {/* Comparison chart */}
        <CompareChart ticker={ticker} />

        <div className="grid grid-cols-1">
          <NewsFeed news={combinedNews} />
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
