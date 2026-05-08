import Header from '@/components/dashboard/header';
import IndexCard from '@/components/dashboard/index-card';
import MainChart from '@/components/dashboard/main-chart';
import TrendingTickers from '@/components/dashboard/trending-tickers';
import NewsFeed from '@/components/dashboard/news-feed';
import Disclaimer from '@/components/dashboard/disclaimer';
import SectorHeatmap from '@/components/dashboard/sector-heatmap';
import { getMainChartData, getAllTickers, getInternationalSectors } from '@/lib/data';
import {
  fetchLiveInternationalIndices,
  fetchLiveInternationalTrendingTickers,
  fetchLiveInternationalNews,
} from '@/lib/yahoo-finance';

export default async function InternationalPage() {
  const [indices, trendingData, news] = await Promise.all([
    fetchLiveInternationalIndices(),
    fetchLiveInternationalTrendingTickers(),
    fetchLiveInternationalNews(),
  ]);

  const allTickers = getAllTickers();
  const sectors = getInternationalSectors();

  const sp500Ticker = allTickers.find(t => t.symbol === 'S&P 500');
  if (!sp500Ticker) return <div>Loading...</div>;

  const mainChartData = getMainChartData(sp500Ticker.symbol);

  const sp500   = indices.find(i => i.symbol === 'S&P 500');
  const nasdaq  = indices.find(i => i.symbol === 'NASDAQ');
  const ftse100 = indices.find(i => i.symbol === 'FTSE 100');

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sp500   && <IndexCard index={sp500} />}
          {nasdaq  && <IndexCard index={nasdaq} />}
          {ftse100 && <IndexCard index={ftse100} />}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MainChart ticker={sp500Ticker} chartData={mainChartData} />
          </div>
          <div className="lg:col-span-4">
            <SectorHeatmap sectors={sectors} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TrendingTickers trending={trendingData} />
          </div>
          <div className="lg:col-span-7">
            <NewsFeed news={news} />
          </div>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
