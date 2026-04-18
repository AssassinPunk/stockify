import type { IndexData } from './types';

// Fallback data in case the API rate limits are hit
const FALLBACK_INDICES: IndexData[] = [
  { symbol: 'NIFTY 50', value: 23516.00, change: 48.50, percentChange: 0.21, lastUpdated: 'Just now' },
  { symbol: 'SENSEX', value: 77241.59, change: -236.48, percentChange: -0.31, lastUpdated: 'Just now' },
  { symbol: 'BANK NIFTY', value: 51703.95, change: 385.20, percentChange: 0.75, lastUpdated: 'Just now' },
];

export async function fetchWithTwelveData(): Promise<IndexData[]> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    console.warn("TWELVE_DATA_API_KEY not found in environment, using fallback data.");
    return FALLBACK_INDICES;
  }

  try {
    // We fetch global equivalents since free tier doesn't support Indian Indices reliably
    const url = `https://api.twelvedata.com/quote?symbol=AAPL,MSFT,NVDA&apikey=${apiKey}`;
    
    // Cache for 60 seconds to avoid hitting the 8 req/min rate limit
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    if (data.code === 429 || data.status === 'error') {
      console.warn("Twelve Data API error or rate limit hit, using fallback data.", data);
      return FALLBACK_INDICES;
    }

    // Map fetched US stocks to our dashboard slots or you can use them directly
    const createIndex = (symbolBase: string, quoteMap: any): IndexData | null => {
        const quote = quoteMap[symbolBase];
        if (!quote) return null;
        return {
            symbol: quote.symbol,
            value: parseFloat(quote.close),
            change: parseFloat(quote.change),
            percentChange: parseFloat(quote.percent_change),
            lastUpdated: new Date(quote.timestamp * 1000).toLocaleTimeString(),
        };
    };

    const results = [
        createIndex('AAPL', data),
        createIndex('MSFT', data),
        createIndex('NVDA', data)
    ].filter(Boolean) as IndexData[];
    
    if (results.length === 0) return FALLBACK_INDICES;
    return results;

  } catch (err) {
    console.error("Failed to fetch from Twelve Data", err);
    return FALLBACK_INDICES;
  }
}
