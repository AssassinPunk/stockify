import { NextResponse } from 'next/server';

const COMMODITIES = [
  { id: 'gold',   label: 'Gold',      symbol: 'GC=F',     unit: '$/oz'  },
  { id: 'oil',    label: 'Crude Oil', symbol: 'CL=F',     unit: '$/bbl' },
  { id: 'usdinr', label: 'USD/INR',   symbol: 'USDINR=X', unit: '₹/USD' },
];

export async function GET() {
  try {
    const results = await Promise.all(
      COMMODITIES.map(async c => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(c.symbol)}?range=1d&interval=1d`;
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        const meta = data.chart?.result?.[0]?.meta;
        if (!meta) throw new Error('No meta for ' + c.symbol);
        const price: number = meta.regularMarketPrice;
        const prev: number = meta.chartPreviousClose;
        return {
          ...c,
          price,
          change: price - prev,
          percentChange: ((price - prev) / prev) * 100,
        };
      }),
    );
    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
