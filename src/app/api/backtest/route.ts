import { NextRequest, NextResponse } from 'next/server';

export type BacktestTimelinePoint = {
  date:       string;
  value:      number; // portfolio value
  invested:   number; // cumulative amount invested
  benchValue: number; // benchmark portfolio value
};

export type BacktestResult = {
  symbol:       string;
  type:         string;
  period:       string;
  currency:     string;
  totalInvested: number;
  finalValue:    number;
  totalReturn:   number;    // %
  cagr:          number;    // %
  bestMonth:     number;    // %
  worstMonth:    number;    // %
  benchmark: {
    symbol:      string;
    finalValue:  number;
    totalReturn: number;
    cagr:        number;
  };
  timeline: BacktestTimelinePoint[];
};

import { TICKER_REGISTRY } from '@/lib/data';

function toYahoo(symbol: string): string {
  if (symbol === 'NIFTY 50')   return '^NSEI';
  if (symbol === 'SENSEX')     return '^BSESN';
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

const PERIOD_RANGE: Record<string, string> = {
  '1Y': '1y', '2Y': '2y', '3Y': '3y', '5Y': '5y',
};

export async function GET(req: NextRequest) {
  const p          = req.nextUrl.searchParams;
  const symbol     = p.get('symbol')   ?? 'RELIANCE';
  const amount     = parseFloat(p.get('amount')   ?? '10000');
  const type       = p.get('type')     ?? 'sip';     // 'sip' | 'lumpsum'
  const period     = p.get('period')   ?? '3Y';
  const currency   = p.get('currency') ?? 'INR';

  const benchYahoo = currency === 'USD' ? '^GSPC' : '^NSEI';
  const benchLabel = currency === 'USD' ? 'S&P 500' : 'NIFTY 50';
  const range      = PERIOD_RANGE[period] ?? '3y';
  const ySymbol    = toYahoo(symbol);

  const YAHOO_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json',
  };

  try {
    const [stockRes, benchRes] = await Promise.all([
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?range=${range}&interval=1mo`,      { cache: 'no-store', headers: YAHOO_HEADERS }),
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(benchYahoo)}?range=${range}&interval=1mo`, { cache: 'no-store', headers: YAHOO_HEADERS }),
    ]);

    const [stockJson, benchJson] = await Promise.all([stockRes.json(), benchRes.json()]);

    const sResult = stockJson.chart?.result?.[0];
    const bResult = benchJson.chart?.result?.[0];
    if (!sResult || !bResult) {
      return NextResponse.json({ error: 'Price data unavailable for this symbol.' }, { status: 404 });
    }

    const timestamps: number[]         = sResult.timestamp ?? [];
    const stockClose: (number|null)[]  = sResult.indicators.quote[0].close ?? [];
    const benchClose: (number|null)[]  = bResult.indicators.quote[0].close ?? [];

    // Align valid data points where both series have values
    type Pt = { date: string; sp: number; bp: number };
    const pts: Pt[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (stockClose[i] != null && benchClose[i] != null) {
        pts.push({
          date: new Date(timestamps[i] * 1000).toISOString().slice(0, 10),
          sp:   stockClose[i]!,
          bp:   benchClose[i]!,
        });
      }
    }

    if (pts.length < 2) {
      return NextResponse.json({ error: 'Insufficient data for the chosen period.' }, { status: 404 });
    }

    // ── Simulation ────────────────────────────────────────────────────────────
    const timeline: BacktestTimelinePoint[] = [];
    let stockShares = 0, benchShares = 0, totalInvested = 0;

    const monthlyReturns: number[] = [];

    if (type === 'sip') {
      for (let i = 0; i < pts.length; i++) {
        const { date, sp, bp } = pts[i];
        stockShares   += amount / sp;
        benchShares   += amount / bp;
        totalInvested += amount;
        const val = stockShares * sp;
        timeline.push({ date, value: val, invested: totalInvested, benchValue: benchShares * bp });
        if (i > 0) monthlyReturns.push(((val - timeline[i - 1].value) / timeline[i - 1].value) * 100);
      }
    } else {
      // Lump sum: buy everything at first month
      stockShares   = amount / pts[0].sp;
      benchShares   = amount / pts[0].bp;
      totalInvested = amount;
      for (let i = 0; i < pts.length; i++) {
        const { date, sp, bp } = pts[i];
        const val = stockShares * sp;
        timeline.push({ date, value: val, invested: totalInvested, benchValue: benchShares * bp });
        if (i > 0) monthlyReturns.push(((val - timeline[i - 1].value) / timeline[i - 1].value) * 100);
      }
    }

    const finalValue = timeline.at(-1)!.value;
    const benchFinal = timeline.at(-1)!.benchValue;
    const benchInvested = type === 'sip' ? totalInvested : amount;

    const years       = pts.length / 12;
    const cagr        = years > 0 ? (Math.pow(finalValue / totalInvested, 1 / years) - 1) * 100 : 0;
    const benchCagr   = years > 0 ? (Math.pow(benchFinal / benchInvested,  1 / years) - 1) * 100 : 0;
    const totalReturn = ((finalValue - totalInvested) / totalInvested) * 100;
    const benchReturn = ((benchFinal - benchInvested)  / benchInvested)  * 100;

    const result: BacktestResult = {
      symbol,
      type,
      period,
      currency,
      totalInvested,
      finalValue,
      totalReturn,
      cagr,
      bestMonth:  monthlyReturns.length ? Math.max(...monthlyReturns) : 0,
      worstMonth: monthlyReturns.length ? Math.min(...monthlyReturns) : 0,
      benchmark: {
        symbol:      benchLabel,
        finalValue:  benchFinal,
        totalReturn: benchReturn,
        cagr:        benchCagr,
      },
      timeline,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('Backtest error:', err);
    return NextResponse.json({ error: 'Backtest failed. Please try again.' }, { status: 500 });
  }
}
