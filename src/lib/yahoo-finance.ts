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

// The last close of the session before the latest one. Yahoo's meta.chartPreviousClose is the close before
// the requested range, which can be several sessions back, so day change is worked out from the bars.
export function previousSessionClose(result: any): number {
  const timestamps: number[] = result?.timestamp ?? [];
  const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];
  const offset: number = result?.meta?.gmtoffset ?? 0;

  const lastCloseByDay = new Map<string, number>();
  timestamps.forEach((time, i) => {
    const close = closes[i];
    if (close != null) lastCloseByDay.set(new Date((time + offset) * 1000).toISOString().slice(0, 10), close);
  });

  const sessions = [...lastCloseByDay.values()];
  return sessions.length >= 2 ? sessions[sessions.length - 2] : result?.meta?.chartPreviousClose;
}

// Fallback data
const FALLBACK_VIX: VixData = { value: 0, lastUpdated: 'Data unavailable' };

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
        chartData 
    };
  } catch (error) {
    console.error("Failed to fetch India VIX from Yahoo Finance:", error);
    return { vixData: FALLBACK_VIX, chartData: [] };
  }
}

// Minimal fallback generator for chart data
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

  // A period that fails stays empty, and the chart says so. Prices are never invented.
  return { '1D': day, '5D': week, '1M': month, '6M': sixMonths, '1Y': year };
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
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(idx.yahoo)}?range=5d&interval=1d`;
      const res = await fetch(url, fetchInit(policy, 60));
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      
      if (!meta) throw new Error("Metadata missing for " + idx.symbol);

      const price = meta.regularMarketPrice;
      const prevClose = previousSessionClose(data.chart.result[0]);
      const change = price - prevClose;
      const changePercent = (change / prevClose) * 100;

      return {
        symbol: idx.symbol,
        value: price,
        change: change,
        percentChange: changePercent,
        lastTradeAt: meta.regularMarketTime,
        previousClose: prevClose,
        dayHigh: meta.regularMarketDayHigh,
        dayLow: meta.regularMarketDayLow,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
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
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(getYahooSymbol(ticker.symbol))}?range=5d&interval=1d`;
      // Revalidate every 5 minutes to keep trending somewhat fresh but avoid aggressive limits
      const res = await fetch(url, { next: { revalidate: 300 }, headers: YAHOO_HEADERS });
      const data = await res.json();

      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) return ticker; // Return fallback base if unavailable

      const price = meta.regularMarketPrice;
      const prevClose = previousSessionClose(data.chart.result[0]);
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
  // A ticker whose fetch failed still carries the registry's price of 0, which isn't a market move
  const sorted = updatedTickers.filter(t => t.price > 0).sort((a, b) => b.percentChange - a.percentChange);
  
  return {
    gainers: sorted.slice(0, 4),
    losers: sorted.slice().reverse().slice(0, 4)
  };
}

import type { NewsArticle } from './types';

function timeAgo(epochSeconds: number): string {
  const secondsAgo = Math.floor(Date.now() / 1000 - epochSeconds);
  const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'} ago`;
  if (secondsAgo < 60) return 'Just now';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`;
  if (secondsAgo < 86400) return plural(Math.floor(secondsAgo / 3600), 'hour');
  return plural(Math.floor(secondsAgo / 86400), 'day');
}

function categorizeIndianNews(title: string): NewsArticle['category'] {
  const t = title.toLowerCase();
  if (t.match(/nifty|sensex|index|dow jones|nasdaq|s&p|nse|bse|markets/)) return 'Indices';
  if (t.match(/shares|stock|earnings|revenue|profit|dividend|tata|reliance|hdfc|infosys|wipro|buy|sell|target/)) return 'Stocks';
  return 'Macro';
}

function categorizeInternationalNews(title: string): NewsArticle['category'] {
  const t = title.toLowerCase();
  if (t.match(/s&p|nasdaq|dow|ftse|index|markets/)) return 'Indices';
  if (t.match(/stock|shares|earnings|profit|apple|nvidia|microsoft|tesla|amazon|meta|google/)) return 'Stocks';
  return 'Macro';
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

// Yahoo's news search can come back empty or rate limited, so headlines fall back to Google News RSS
async function fetchGoogleNews(
  query: string,
  locale: string,
  categorize: (title: string) => NewsArticle['category'],
): Promise<NewsArticle[]> {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${query} when:2d`)}&${locale}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    const tag = (item: string, name: string) => {
      const value = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1];
      return value ? decodeXmlEntities(value) : '';
    };

    return (xml.match(/<item>[\s\S]*?<\/item>/g) ?? []).slice(0, 8).map((item, index) => {
      const source = tag(item, 'source');
      // Google appends " - Publisher" to every headline
      const title = tag(item, 'title').replace(new RegExp(` - ${source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '');
      return {
        id: tag(item, 'guid') || `google-news-${index}`,
        title,
        source: source || 'Google News',
        timestamp: timeAgo(Date.parse(tag(item, 'pubDate')) / 1000),
        url: tag(item, 'link'),
        category: categorize(title),
      };
    });
  } catch (error) {
    console.error('Failed to fetch Google News:', error);
    return [];
  }
}

// Fetch real-time market news
export async function fetchLiveNews(): Promise<NewsArticle[]> {
  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=Indian+Stock+Market&newsCount=8`;
    const res = await fetch(url, { next: { revalidate: 600 }, headers: YAHOO_HEADERS });
    const data = await res.json();

    if (!Array.isArray(data.news) || data.news.length === 0) {
      throw new Error("No news returned from Yahoo");
    }

    return data.news.map((item: any, index: number) => ({
      id: item.uuid || `news-${index}`,
      title: item.title,
      source: item.publisher || 'Yahoo Finance',
      timestamp: timeAgo(item.providerPublishTime),
      url: item.link,
      category: categorizeIndianNews(item.title),
    }));
  } catch (error) {
    console.warn("Falling back to Google News for Indian market news:", error);
    return fetchGoogleNews('Indian stock market', 'hl=en-IN&gl=IN&ceid=IN:en', categorizeIndianNews);
  }
}

export async function fetchLiveQuote(
  symbol: string,
  policy?: FetchPolicy,
): Promise<{ price: number; change: number; percentChange: number } | null> {
  const ySymbol = getYahooSymbol(symbol);
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?range=5d&interval=1d`;
    const res  = await fetch(url, fetchInit(policy, 60));
    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price         = meta.regularMarketPrice as number;
    const prevClose     = previousSessionClose(data.chart.result[0]);
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
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(idx.yahoo)}?range=5d&interval=1d`;
      const res  = await fetch(url, fetchInit(policy, 60));
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) throw new Error('Missing meta for ' + idx.symbol);
      const price      = meta.regularMarketPrice;
      const prevClose  = previousSessionClose(data.chart.result[0]);
      const change     = price - prevClose;
      const percentChange = (change / prevClose) * 100;
      return {
        symbol: idx.symbol,
        value:  price,
        change,
        percentChange,
        lastTradeAt: meta.regularMarketTime,
        previousClose: prevClose,
        dayHigh: meta.regularMarketDayHigh,
        dayLow: meta.regularMarketDayLow,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
        lastUpdated: new Date(meta.regularMarketTime * 1000).toLocaleString('en-US', {
          timeZone: 'America/New_York',
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
      const url  = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker.symbol)}?range=5d&interval=1d`;
      const res  = await fetch(url, { next: { revalidate: 300 }, headers: YAHOO_HEADERS });
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) return ticker;
      const price      = meta.regularMarketPrice;
      const prevClose  = previousSessionClose(data.chart.result[0]);
      const change     = price - prevClose;
      const percentChange = (change / prevClose) * 100;
      return { ...ticker, price, change, percentChange };
    } catch { return ticker; }
  });
  const updated = await Promise.all(promises);
  const sorted  = updated.filter(t => t.price > 0).sort((a, b) => b.percentChange - a.percentChange);
  return { gainers: sorted.slice(0, 4), losers: sorted.slice().reverse().slice(0, 4) };
}

export async function fetchLiveInternationalNews(): Promise<import('./types').NewsArticle[]> {
  try {
    const url  = 'https://query2.finance.yahoo.com/v1/finance/search?q=US+Stock+Market+Wall+Street&newsCount=8';
    const res  = await fetch(url, { next: { revalidate: 600 }, headers: YAHOO_HEADERS });
    const data = await res.json();
    if (!Array.isArray(data.news) || data.news.length === 0) throw new Error('No news returned from Yahoo');
    return data.news.map((item: { uuid?: string; title: string; publisher?: string; providerPublishTime: number; link: string }, index: number) => ({
      id: item.uuid ?? `intl-${index}`,
      title: item.title,
      source: item.publisher ?? 'Yahoo Finance',
      timestamp: timeAgo(item.providerPublishTime),
      url: item.link,
      category: categorizeInternationalNews(item.title),
    }));
  } catch (error) {
    console.warn('Falling back to Google News for international market news:', error);
    return fetchGoogleNews('US stock market Wall Street', 'hl=en-US&gl=US&ceid=US:en', categorizeInternationalNews);
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
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s.yahoo)}?range=5d&interval=1d`;
      const res  = await fetch(url, fetchInit(policy, 300));
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) throw new Error(`No meta for ${s.name}`);
      const price = meta.regularMarketPrice as number;
      const prev  = previousSessionClose(data.chart.result[0]);
      return { name: s.name, change: ((price - prev) / prev) * 100 };
    })
  );

  return results.flatMap(r => (r.status === 'fulfilled' ? [r.value] : []));
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
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s.etf)}?range=5d&interval=1d`;
      const res  = await fetch(url, fetchInit(policy, 300));
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) throw new Error(`No meta for ${s.name}`);
      const price = meta.regularMarketPrice as number;
      const prev  = previousSessionClose(data.chart.result[0]);
      return { name: s.name, change: ((price - prev) / prev) * 100 };
    })
  );

  return results.flatMap(r => (r.status === 'fulfilled' ? [r.value] : []));
}
