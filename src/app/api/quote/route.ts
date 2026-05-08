import { NextRequest, NextResponse } from 'next/server';
import { TICKER_REGISTRY } from '@/lib/data';

function toYahooSymbol(symbol: string): string {
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
  if (!symbol.includes('.')) return `${symbol}.NS`;
  return symbol;
}

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  if (!symbol) return NextResponse.json({ error: 'Symbol required' }, { status: 400 });

  try {
    const ySymbol = toYahooSymbol(symbol);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?range=5d&interval=1h`;
    const res = await fetch(url, { next: { revalidate: 300 }, headers: YAHOO_HEADERS });
    const data = await res.json();

    if (data.chart?.error) throw new Error(data.chart.error.description);

    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators.quote[0];
    const timestamps: number[] = result.timestamp ?? [];

    const price: number = meta.regularMarketPrice;
    const prevClose: number = meta.chartPreviousClose;
    const change = price - prevClose;
    const percentChange = (change / prevClose) * 100;

    const sparkline: number[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const v = quote.close[i];
      if (v !== null && v !== undefined) sparkline.push(v);
    }

    return NextResponse.json({ price, change, percentChange, sparkline });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
