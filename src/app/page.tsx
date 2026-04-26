import Header from '@/components/dashboard/header';
import MainChart from '@/components/dashboard/main-chart';
import SectorHeatmap from '@/components/dashboard/sector-heatmap';
import TrendingTickers from '@/components/dashboard/trending-tickers';
import NewsFeed from '@/components/dashboard/news-feed';
import Disclaimer from '@/components/dashboard/disclaimer';
import LiveDashboard from '@/components/dashboard/live-dashboard';
import CommodityStrip from '@/components/dashboard/commodity-strip';
import { getSectors, getMainChartData, getAllTickers } from '@/lib/data';
import { fetchIndiaVix, fetchLiveIndianIndices, fetchLiveTrendingTickers, fetchLiveNews } from '@/lib/yahoo-finance';

export default async function Home() {
  const [liveIndices, { vixData, chartData: vixChartData }, trending, news] = await Promise.all([
    fetchLiveIndianIndices(),
    fetchIndiaVix(),
    fetchLiveTrendingTickers(),
    fetchLiveNews(),
  ]);

  const sectors = getSectors();
  const allTickers = getAllTickers();
  const nifty50Ticker = allTickers.find(t => t.symbol === 'NIFTY 50');

  if (!nifty50Ticker) return <div>Loading...</div>;

  const mainChartData = getMainChartData(nifty50Ticker.symbol);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">

        {/* Live indices */}
        <LiveDashboard
          initialIndices={liveIndices}
          initialVixData={vixData}
          initialVixChartData={vixChartData}
        />

        {/* Commodity & forex strip */}
        <CommodityStrip />

        {/* Main chart + sector heatmap */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MainChart ticker={nifty50Ticker} chartData={mainChartData} />
          </div>
          <div className="lg:col-span-4">
            <SectorHeatmap sectors={sectors} />
          </div>
        </div>

        {/* Trending + news */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TrendingTickers trending={trending} />
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
