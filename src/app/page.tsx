'use client';

import Header from '@/components/dashboard/header';
import IndexCard from '@/components/dashboard/index-card';
import VixCard from '@/components/dashboard/vix-card';
import MainChart from '@/components/dashboard/main-chart';
import SectorHeatmap from '@/components/dashboard/sector-heatmap';
import TrendingTickers from '@/components/dashboard/trending-tickers';
import NewsFeed from '@/components/dashboard/news-feed';
import Disclaimer from '@/components/dashboard/disclaimer';
import { getIndices, getVixData, getSectors, getTrendingTickers, getNews, getVixChartData, getMainChartData, getAllTickers } from '@/lib/data';
import type { Ticker } from '@/lib/types';

export default function Home() {
  // Mock data fetching
  const indices = getIndices();
  const vixData = getVixData();
  const sectors = getSectors();
  const trending = getTrendingTickers();
  const news = getNews();
  const allTickers = getAllTickers();

  const nifty50Ticker = allTickers.find(t => t.symbol === 'NIFTY 50');

  // Helper to merge live quotes with initial data structures
  const getLiveIndexData = (symbol: string): IndexData | undefined => {
    const initial = initialIndices.find(i => i.symbol === symbol);
    if (!initial) return undefined;
    
    const live = quotes.find(q => q.symbol === symbol);
    if (!live) return initial;

    return {
      ...initial,
      value: live.price,
      change: live.change,
      percentChange: live.changePercent,
    };
  };

  const getLiveVixData = (): VixData => {
    const live = quotes.find(q => q.symbol === 'INDIA VIX');
    if (!live) return initialVixData;

    return {
      ...initialVixData,
      value: live.price,
    };
  };

  const nifty50 = getLiveIndexData('NIFTY 50');
  const sensex = getLiveIndexData('SENSEX');
  const bankNifty = getLiveIndexData('BANK NIFTY');
  const vixData = getLiveVixData();

  if (!nifty50Ticker) {
    return <div>Loading...</div>;
  }

  const mainChartData = getMainChartData(nifty50Ticker.symbol);

  const nifty50 = indices.find(i => i.symbol === 'NIFTY 50');
  const sensex = indices.find(i => i.symbol === 'SENSEX');
  const bankNifty = indices.find(i => i.symbol === 'BANK NIFTY');
  
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
