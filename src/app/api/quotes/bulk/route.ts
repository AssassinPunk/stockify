import { NextRequest, NextResponse } from 'next/server';
import { TICKER_REGISTRY } from '@/lib/data';

export type BulkQuote = {
  price:         number;
  change:        number;
  percentChange: number;
};

export type BulkQuotesResponse = Record<string, BulkQuote>;

function toYahoo(symbol: string): string {
  if (symbol === 'NIFTY 50')   return '^NSEI';
  if (symbol === 'SENSEX')     return '^BSESN';
  if (symbol === 'BANK NIFTY') return '^NSEBANK';
  if (symbol === 'S&P 500')    return '^GSPC';
  if (symbol === 'NASDAQ')     return '^IXIC';
  if (symbol === 'FTSE 100')   return '^FTSE';
  if (symbol.includes('='))    return symbol;
  const meta = TICKER_REGISTRY.find(t => t.symbol === symbol);
  if (meta?.yahooSymbol) return meta.yahooSymbol;
  if (meta && meta.currency !== 'INR') return symbol;
  if (!symbol.includes('.'))   return `${symbol}.NS`;
  return symbol;
}

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

async function fetchQuote(symbol: string): Promise<BulkQuote | null> {
  try {
    const y   = toYahoo(symbol);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(y)}?range=1d&interval=1d`;
    const res = await fetch(url, { next: { revalidate: 60 }, headers: YAHOO_HEADERS });
    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price      = meta.regularMarketPrice as number;
    const prevClose  = meta.chartPreviousClose as number;
    const change     = price - prevClose;
    const percentChange = (change / prevClose) * 100;
    return { price, change, percentChange };
  } catch {
    return null;
  }
}

// GET /api/quotes/bulk?symbols=RELIANCE,TCS,AAPL,MSFT
// Returns: { RELIANCE: { price, change, percentChange }, ... }
export async function GET(req: NextRequest) {
  const raw     = req.nextUrl.searchParams.get('symbols') ?? '';
  const symbols = raw.split(',').map(s => s.trim()).filter(Boolean);

  if (symbols.length === 0) {
    return NextResponse.json({ error: 'Provide ?symbols=SYM1,SYM2,...' }, { status: 400 });
  }
  if (symbols.length > 50) {
    return NextResponse.json({ error: 'Maximum 50 symbols per request' }, { status: 400 });
  }

  const results = await Promise.all(
    symbols.map(async sym => ({ sym, quote: await fetchQuote(sym) }))
  );

  const response: BulkQuotesResponse = {};
  for (const { sym, quote } of results) {
    if (quote) response[sym] = quote;
  }

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=30' },
  });
}
