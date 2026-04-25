import { NextRequest, NextResponse } from 'next/server';

function toYahooSymbol(symbol: string): string {
  const international = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM'];
  if (!international.includes(symbol) && !symbol.includes('.')) return `${symbol}.NS`;
  return symbol;
}

const EMPTY = {
  marketCap: null, trailingPE: null, forwardPE: null,
  eps: null, dividendYield: null, fiftyTwoWeekHigh: null,
  fiftyTwoWeekLow: null, beta: null,
};

async function fromV10(ySymbol: string) {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(ySymbol)}?modules=defaultKeyStatistics%2CsummaryDetail`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.quoteSummary?.error) throw new Error(data.quoteSummary.error.description);
  const result = data.quoteSummary?.result?.[0];
  if (!result) throw new Error('No result');
  const k = result.defaultKeyStatistics;
  const s = result.summaryDetail;
  return {
    marketCap: s?.marketCap?.raw ?? null,
    trailingPE: s?.trailingPE?.raw ?? null,
    forwardPE: s?.forwardPE?.raw ?? null,
    eps: k?.trailingEps?.raw ?? null,
    dividendYield: s?.dividendYield?.raw ?? null,
    fiftyTwoWeekHigh: s?.fiftyTwoWeekHigh?.raw ?? null,
    fiftyTwoWeekLow: s?.fiftyTwoWeekLow?.raw ?? null,
    beta: s?.beta?.raw ?? k?.beta?.raw ?? null,
  };
}

async function fromV8Chart(ySymbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?range=1d&interval=1d`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();
  const meta = data.chart?.result?.[0]?.meta ?? {};
  return {
    marketCap: meta.marketCap ?? null,
    trailingPE: meta.trailingPE ?? null,
    forwardPE: meta.forwardPE ?? null,
    eps: meta.epsTrailingTwelveMonths ?? null,
    dividendYield: meta.dividendYield ?? null,
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? null,
    beta: meta.beta ?? null,
  };
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  if (!symbol) return NextResponse.json({ error: 'Symbol required' }, { status: 400 });

  const ySymbol = toYahooSymbol(symbol);
  try {
    return NextResponse.json(await fromV10(ySymbol));
  } catch {
    try {
      return NextResponse.json(await fromV8Chart(ySymbol));
    } catch {
      return NextResponse.json(EMPTY);
    }
  }
}
