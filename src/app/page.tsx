import Header from '@/components/dashboard/header';
import IndexCard from '@/components/dashboard/index-card';
import VixCard from '@/components/dashboard/vix-card';
import MainChart from '@/components/dashboard/main-chart';
import SectorHeatmap from '@/components/dashboard/sector-heatmap';
import TrendingTickers from '@/components/dashboard/trending-tickers';
import NewsFeed from '@/components/dashboard/news-feed';
import Disclaimer from '@/components/dashboard/disclaimer';
import { getSectors, getMainChartData, getAllTickers } from '@/lib/data';
import { fetchIndiaVix, fetchLiveIndianIndices, fetchLiveTrendingTickers, fetchLiveNews } from '@/lib/yahoo-finance';

export default async function Home() {
  // Fetch real data via Yahoo Finance
  const [liveIndices, { vixData, chartData: vixChartData }, trending, news] = await Promise.all([
    fetchLiveIndianIndices(),
    fetchIndiaVix(),
    fetchLiveTrendingTickers(),
    fetchLiveNews()
  ]);

  const sectors = getSectors();
  const allTickers = getAllTickers();

  const nifty50Ticker = allTickers.find(t => t.symbol === 'NIFTY 50');

  if (!nifty50Ticker) {
    return <div>Loading...</div>;
  }

  const mainChartData = getMainChartData(nifty50Ticker.symbol);

  const nifty50 = liveIndices[0];
  const sensex = liveIndices[1];
  const bankNifty = liveIndices[2];
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {nifty50 && <IndexCard index={nifty50} />}
          {sensex && <IndexCard index={sensex} />}
          {bankNifty && <IndexCard index={bankNifty} />}
          {vixData && <VixCard vixData={vixData} chartData={vixChartData} />}
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MainChart ticker={nifty50Ticker} chartData={mainChartData} />
          </div>
          <div className="lg:col-span-4">
            <SectorHeatmap sectors={sectors} />
          </div>
        </div>

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
