import type { VixData, ChartDataPoint } from './types';

type FetchPolicy = {
  /**
   * Use `no-store` for truly live client polling endpoints.
   * Default behavior uses Next's revalidate caching.
   */
  cache?: RequestCache;
  revalidate?: number;
};

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

function fetchInit(policy: FetchPolicy | undefined, defaultRevalidate: number) {
  const headers = YAHOO_HEADERS;
  if (policy?.cache === 'no-store') return { cache: 'no-store' as const, headers };
  return { next: { revalidate: policy?.revalidate ?? defaultRevalidate }, headers };
}

// Fallback data
const FALLBACK_VIX: VixData = { value: 26.80, lastUpdated: new Date().toLocaleTimeString() };

export async function fetchIndiaVix(options?: {
  range?: string;
  interval?: string;
  policy?: FetchPolicy;
}): Promise<{ vixData: VixData, chartData: ChartDataPoint[] }> {
  try {
    const range = options?.range ?? '1mo';
    const interval = options?.interval ?? '1d';
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/%5EINDIAVIX?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`;
    // Default: revalidate every 6 hours for daily history.
    const res = await fetch(url, fetchInit(options?.policy, 21600));
    const data = await res.json();
    
    if (data.chart.error) {
       throw new Error(data.chart.error.description);
    }
    
    const result = data.chart.result[0];
    const meta = result.meta;
    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];

    // Build the chart data backwards from the results
    const chartData: ChartDataPoint[] = [];
    if (timestamps && quote) {
      for (let i = 0; i < timestamps.length; i++) {
        // Only include valid points
        if (quote.close[i] !== null) {
          chartData.push({
            date: new Date(timestamps[i] * 1000).toISOString(),
            open: quote.open[i] ?? 0,
            high: quote.high[i] ?? 0,
            low: quote.low[i] ?? 0,
            close: quote.close[i] ?? 0,
            value: quote.close[i] ?? 0, // Used by the AreaChart
            volume: result.indicators.quote[0]?.volume?.[i] ?? 0,
          });
        }
      }
    }

    const currentVix = meta.regularMarketPrice;
    const lastUpdated = new Date(meta.regularMarketTime * 1000).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ' IST';

    return { 
        vixData: { value: currentVix, lastUpdated }, 
        chartData: chartData.length > 0 ? chartData : generateFallbackChartData(currentVix) 
    };
  } catch (error) {
    console.error("Failed to fetch India VIX from Yahoo Finance:", error);
    return { vixData: FALLBACK_VIX, chartData: generateFallbackChartData(FALLBACK_VIX.value) };
  }
}

// Minimal fallback generator for chart data
function generateFallbackChartData(baseValue: number, points: number = 30): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];
    let lastValue = baseValue;
    const today = new Date();
    for(let i=points; i>=0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        data.push({
            date: d.toISOString(),
            open: lastValue,
            high: lastValue + 1,
            low: lastValue - 1,
            close: lastValue,
            value: lastValue,
        });
    }
    return data;
}

// Convert app symbols to Yahoo Finance symbols.
// Uses TICKER_REGISTRY to determine currency — no hardcoded international list needed.
function getYahooSymbol(symbol: string): string {
    if (symbol === 'NIFTY 50')   return '^NSEI';
    if (symbol === 'SENSEX')     return '^BSESN';
    if (symbol === 'BANK NIFTY') return '^NSEBANK';
    if (symbol === 'INDIA VIX')  return '^INDIAVIX';
    if (symbol === 'S&P 500')    return '^GSPC';
    if (symbol === 'NASDAQ')     return '^IXIC';
    if (symbol === 'FTSE 100')   return '^FTSE';
    // Commodity futures (=F) and forex pairs (=X) pass through unchanged
    if (symbol.includes('=')) return symbol;
    // Look up in registry — use override symbol if present
    const meta = TICKER_REGISTRY.find(t => t.symbol === symbol);
    if (meta?.yahooSymbol) return meta.yahooSymbol;
    if (meta && meta.currency !== 'INR') return symbol; // USD/GBP symbols pass through
    // Default: assume NSE-listed Indian stock
    if (!symbol.includes('.')) return `${symbol}.NS`;
    return symbol;
}

export async function fetchYahooChart(
  symbol: string,
  policy?: FetchPolicy
): Promise<import('./types').MainChartData> {
  const ySymbol = getYahooSymbol(symbol);
  
  // Format individual timeframe chart
  async function fetchTimeframe(range: string, interval: string): Promise<ChartDataPoint[]> {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?range=${range}&interval=${interval}`;
      const res = await fetch(url, fetchInit(policy, 300));
      const data = await res.json();
      
      if (data.chart.error) return [];
      
      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const quote = result.indicators.quote[0];

      const chartData: ChartDataPoint[] = [];
      if (timestamps && quote) {
        for (let i = 0; i < timestamps.length; i++) {
          if (quote.close[i] !== null) {
            chartData.push({
              date: new Date(timestamps[i] * 1000).toISOString(),
              open: quote.open[i] ?? 0,
              high: quote.high[i] ?? 0,
              low: quote.low[i] ?? 0,
              close: quote.close[i] ?? 0,
              value: quote.close[i] ?? 0,
              volume: quote.volume?.[i] ?? 0,
            });
          }
        }
      }
      return chartData;
    } catch {
      return [];
    }
  }

  // Fetch all concurrently
  const [day, week, month, sixMonths, year] = await Promise.all([
    fetchTimeframe('1d', '5m'),
    fetchTimeframe('5d', '15m'),
    fetchTimeframe('1mo', '1d'),
    fetchTimeframe('6mo', '1d'),
    fetchTimeframe('1y', '1d')
  ]);

  // Provide fallback logic if it fails
  return {
    '1D': day.length > 0 ? day : generateFallbackChartData(100, 96),
    '5D': week.length > 0 ? week : generateFallbackChartData(100, 60),
    '1M': month.length > 0 ? month : generateFallbackChartData(100, 30),
    '6M': sixMonths.length > 0 ? sixMonths : generateFallbackChartData(100, 120),
    '1Y': year.length > 0 ? year : generateFallbackChartData(100, 250),
  };
}

// Fetch live quotes for Indian indices
export async function fetchLiveIndianIndices(policy?: FetchPolicy): Promise<import('./types').IndexData[]> {
  const indices = [
    { name: 'NIFTY 50', symbol: 'NIFTY 50', yahoo: '^NSEI' },
    { name: 'SENSEX', symbol: 'SENSEX', yahoo: '^BSESN' },
    { name: 'BANK NIFTY', symbol: 'BANK NIFTY', yahoo: '^NSEBANK' }
  ];

  try {
    const promises = indices.map(async (idx) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(idx.yahoo)}?range=1d&interval=1d`;
      const res = await fetch(url, fetchInit(policy, 60));
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      
      if (!meta) throw new Error("Metadata missing for " + idx.symbol);

      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose;
      const change = price - prevClose;
      const changePercent = (change / prevClose) * 100;

      return {
        symbol: idx.symbol,
        value: price,
        change: change,
        percentChange: changePercent,
        lastUpdated: new Date(meta.regularMarketTime * 1000).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }) + ' IST'
      };
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Failed to fetch Live Indian Indices from Yahoo:", error);
    // Fallback to initial if Yahoo completely fails
    return [
      { symbol: 'NIFTY 50',   value: 0, change: 0, percentChange: 0, lastUpdated: 'Data unavailable' },
      { symbol: 'SENSEX',     value: 0, change: 0, percentChange: 0, lastUpdated: 'Data unavailable' },
      { symbol: 'BANK NIFTY', value: 0, change: 0, percentChange: 0, lastUpdated: 'Data unavailable' },
    ];
  }
}

import { getAllTickers, TICKER_REGISTRY } from './data';
import type { TrendingData } from './types';

// Fetch live quotes for all covered Indian stocks and dynamically calculate Top Gainers / Losers
export async function fetchLiveTrendingTickers(): Promise<TrendingData> {
  const allTickers = getAllTickers().filter(t => t.currency === 'INR' && !t.isIndex);
  
  const promises = allTickers.map(async (ticker) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(getYahooSymbol(ticker.symbol))}?range=1d&interval=1d`;
      // Revalidate every 5 minutes to keep trending somewhat fresh but avoid aggressive limits
      const res = await fetch(url, { next: { revalidate: 300 }, headers: YAHOO_HEADERS });
      const data = await res.json();

      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) return ticker; // Return fallback base if unavailable

      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose;
      const change = price - prevClose;
      const percentChange = (change / prevClose) * 100;

      return {
        ...ticker,
        price,
        change,
        percentChange
      };
    } catch {
      return ticker; // fallback
    }
  });

  const updatedTickers = await Promise.all(promises);
  const sorted = updatedTickers.sort((a, b) => b.percentChange - a.percentChange);
  
  return {
    gainers: sorted.slice(0, 4),
    losers: sorted.slice().reverse().slice(0, 4)
  };
}

import type { NewsArticle } from './types';

// Fetch real-time market news
export async function fetchLiveNews(): Promise<NewsArticle[]> {
  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=Indian+Stock+Market&newsCount=8`;
    const res = await fetch(url, { next: { revalidate: 600 }, headers: YAHOO_HEADERS });
    const data = await res.json();

    if (!data.news || !Array.isArray(data.news)) {
      throw new Error("Invalid news format returned from Yahoo");
    }

    return data.news.map((item: any, index: number) => {
      // Calculate human-readable 'time ago'
      const secondsAgo = Math.floor(Date.now() / 1000 - item.providerPublishTime);
      let timestamp = '';
      if (secondsAgo < 3600) timestamp = `${Math.floor(secondsAgo / 60)} min ago`;
      else if (secondsAgo < 86400) timestamp = `${Math.floor(secondsAgo / 3600)} hours ago`;
      else timestamp = `${Math.floor(secondsAgo / 86400)} days ago`;

      // Categorize based on keywords in title
      const lowerTitle = item.title.toLowerCase();
      let category: 'Indices' | 'Stocks' | 'Macro' = 'Macro';
      
      if (lowerTitle.match(/nifty|sensex|index|dow jones|nasdaq|s&p|nse|bse|markets/)) {
        category = 'Indices';
      } else if (lowerTitle.match(/shares|stock|earnings|revenue|profit|dividend|tata|reliance|hdfc|infosys|wipro|buy|sell|target/)) {
        category = 'Stocks';
      }

      return {
        id: item.uuid || `news-${index}`,
        title: item.title,
        source: item.publisher || 'Yahoo Finance',
        timestamp: timestamp,
        url: item.link,
        category: category
      };
    });
  } catch (error) {
    console.error("Failed to fetch live news:", error);
    // Fallback static array if network fails completely
    return [
      { id: '1', title: 'Market faces turbulent session amidst global cues', source: 'MarketWire', timestamp: '2 hours ago', url: '#', category: 'Macro' as const },
      { id: '2', title: 'IT sector sees massive selloff ahead of earnings', source: 'Financial Express', timestamp: '3 hours ago', url: '#', category: 'Stocks' as const },
    ];
  }
}

export async function fetchLiveQuote(
  symbol: string,
  policy?: FetchPolicy,
): Promise<{ price: number; change: number; percentChange: number } | null> {
  const ySymbol = getYahooSymbol(symbol);
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?range=1d&interval=1d`;
    const res  = await fetch(url, fetchInit(policy, 60));
    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price         = meta.regularMarketPrice as number;
    const prevClose     = meta.chartPreviousClose  as number;
    const change        = price - prevClose;
    const percentChange = (change / prevClose) * 100;
    return { price, change, percentChange };
  } catch { return null; }
}

export async function fetchLiveInternationalIndices(policy?: FetchPolicy): Promise<import('./types').IndexData[]> {
  const indices = [
    { symbol: 'S&P 500',  yahoo: '^GSPC' },
    { symbol: 'NASDAQ',   yahoo: '^IXIC' },
    { symbol: 'FTSE 100', yahoo: '^FTSE' },
  ];
  try {
    const promises = indices.map(async (idx) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(idx.yahoo)}?range=1d&interval=1d`;
      const res  = await fetch(url, fetchInit(policy, 60));
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) throw new Error('Missing meta for ' + idx.symbol);
      const price      = meta.regularMarketPrice;
      const prevClose  = meta.chartPreviousClose;
      const change     = price - prevClose;
      const percentChange = (change / prevClose) * 100;
      return {
        symbol: idx.symbol,
        value:  price,
        change,
        percentChange,
        lastUpdated: new Date(meta.regularMarketTime * 1000).toLocaleString('en-US', {
          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
        }) + ' ET',
      };
    });
    return await Promise.all(promises);
  } catch (error) {
    console.error('Failed to fetch live international indices:', error);
    return [
      { symbol: 'S&P 500',  value: 0, change: 0, percentChange: 0, lastUpdated: 'Data unavailable' },
      { symbol: 'NASDAQ',   value: 0, change: 0, percentChange: 0, lastUpdated: 'Data unavailable' },
      { symbol: 'FTSE 100', value: 0, change: 0, percentChange: 0, lastUpdated: 'Data unavailable' },
    ];
  }
}

export async function fetchLiveInternationalTrendingTickers(): Promise<TrendingData> {
  const tickers = getAllTickers().filter(t => t.currency === 'USD' && !t.isIndex);
  const promises = tickers.map(async (ticker) => {
    try {
      const url  = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker.symbol)}?range=1d&interval=1d`;
      const res  = await fetch(url, { next: { revalidate: 300 }, headers: YAHOO_HEADERS });
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) return ticker;
      const price      = meta.regularMarketPrice;
      const prevClose  = meta.chartPreviousClose;
      const change     = price - prevClose;
      const percentChange = (change / prevClose) * 100;
      return { ...ticker, price, change, percentChange };
    } catch { return ticker; }
  });
  const updated = await Promise.all(promises);
  const sorted  = [...updated].sort((a, b) => b.percentChange - a.percentChange);
  return { gainers: sorted.slice(0, 4), losers: sorted.slice().reverse().slice(0, 4) };
}

export async function fetchLiveInternationalNews(): Promise<import('./types').NewsArticle[]> {
  try {
    const url  = 'https://query2.finance.yahoo.com/v1/finance/search?q=US+Stock+Market+Wall+Street&newsCount=8';
    const res  = await fetch(url, { next: { revalidate: 600 }, headers: YAHOO_HEADERS });
    const data = await res.json();
    if (!data.news || !Array.isArray(data.news)) throw new Error('Bad format');
    return data.news.map((item: { uuid?: string; title: string; publisher?: string; providerPublishTime: number; link: string }, index: number) => {
      const secondsAgo = Math.floor(Date.now() / 1000 - item.providerPublishTime);
      let timestamp = '';
      if (secondsAgo < 3600)       timestamp = `${Math.floor(secondsAgo / 60)} min ago`;
      else if (secondsAgo < 86400) timestamp = `${Math.floor(secondsAgo / 3600)} hours ago`;
      else                         timestamp = `${Math.floor(secondsAgo / 86400)} days ago`;
      const t = item.title.toLowerCase();
      let category: 'Indices' | 'Stocks' | 'Macro' = 'Macro';
      if (t.match(/s&p|nasdaq|dow|ftse|index|markets/)) category = 'Indices';
      else if (t.match(/stock|shares|earnings|profit|apple|nvidia|microsoft|tesla|amazon|meta|google/)) category = 'Stocks';
      return { id: item.uuid ?? `intl-${index}`, title: item.title, source: item.publisher ?? 'Yahoo Finance', timestamp, url: item.link, category };
    });
  } catch (error) {
    console.error('Failed to fetch international news:', error);
    return [];
  }
}

// ── Live sector performance ──────────────────────────────────────────────────

export async function fetchLiveSectors(policy?: FetchPolicy): Promise<import('./types').SectorData[]> {
  const sectors = [
    { name: 'Nifty IT',     yahoo: '^CNXIT' },
    { name: 'Nifty Bank',   yahoo: '^NSEBANK' },
    { name: 'Nifty Auto',   yahoo: '^CNXAUTO' },
    { name: 'Nifty Pharma', yahoo: '^CNXPHARMA' },
    { name: 'Nifty FMCG',   yahoo: '^CNXFMCG' },
    { name: 'Nifty Realty', yahoo: '^CNXREALTY' },
    { name: 'Nifty Metal',  yahoo: '^CNXMETAL' },
    { name: 'Nifty Media',  yahoo: '^CNXMEDIA' },
    { name: 'Nifty PSE',    yahoo: '^CNXPSE' },
  ];

  const results = await Promise.allSettled(
    sectors.map(async (s) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s.yahoo)}?range=1d&interval=1d`;
      const res  = await fetch(url, fetchInit(policy, 300));
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) throw new Error(`No meta for ${s.name}`);
      const price = meta.regularMarketPrice as number;
      const prev  = meta.chartPreviousClose  as number;
      return { name: s.name, change: ((price - prev) / prev) * 100 };
    })
  );

  return results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : { name: sectors[i].name, change: 0 }
  );
}

export async function fetchLiveInternationalSectors(policy?: FetchPolicy): Promise<import('./types').SectorData[]> {
  // SPDR Select Sector ETFs — free-tier Yahoo Finance, no auth needed
  const sectors = [
    { name: 'Technology',        etf: 'XLK'  },
    { name: 'Healthcare',        etf: 'XLV'  },
    { name: 'Financials',        etf: 'XLF'  },
    { name: 'Energy',            etf: 'XLE'  },
    { name: 'Consumer Discret.', etf: 'XLY'  },
    { name: 'Consumer Staples',  etf: 'XLP'  },
    { name: 'Industrials',       etf: 'XLI'  },
    { name: 'Materials',         etf: 'XLB'  },
    { name: 'Real Estate',       etf: 'XLRE' },
    { name: 'Utilities',         etf: 'XLU'  },
    { name: 'Communication',     etf: 'XLC'  },
  ];

  const results = await Promise.allSettled(
    sectors.map(async (s) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s.etf)}?range=1d&interval=1d`;
      const res  = await fetch(url, fetchInit(policy, 300));
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) throw new Error(`No meta for ${s.name}`);
      const price = meta.regularMarketPrice as number;
      const prev  = meta.chartPreviousClose  as number;
      return { name: s.name, change: ((price - prev) / prev) * 100 };
    })
  );

  return results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : { name: sectors[i].name, change: 0 }
  );
}
