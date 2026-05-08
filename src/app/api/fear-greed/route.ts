import { NextResponse } from 'next/server';
import { getSectors } from '@/lib/data';

export type FGIComponent = {
  name: string;
  score: number;      // 0–100
  label: string;
  value: string;
  description: string;
};

export type FearGreedData = {
  score: number;
  label: string;
  components: FGIComponent[];
  updatedAt: string;
};

function scoreToLabel(s: number): string {
  if (s <= 20) return 'Extreme Fear';
  if (s <= 40) return 'Fear';
  if (s <= 60) return 'Neutral';
  if (s <= 80) return 'Greed';
  return 'Extreme Greed';
}

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

async function safeJson(url: string): Promise<any> {
  try {
    const r = await fetch(url, { next: { revalidate: 300 }, headers: YAHOO_HEADERS });
    return await r.json();
  } catch { return null; }
}

export async function GET() {
  try {
    const [vixJson, nifty3mJson, nifty1mJson, goldJson] = await Promise.all([
      safeJson('https://query1.finance.yahoo.com/v8/finance/chart/%5EINDIAVIX?range=1d&interval=1d'),
      safeJson('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?range=3mo&interval=1d'),
      safeJson('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?range=1mo&interval=1d'),
      safeJson('https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?range=1mo&interval=1d'),
    ]);

    // ── 1. Volatility: India VIX ─────────────────────────────────────────────
    const vix: number = vixJson?.chart?.result?.[0]?.meta?.regularMarketPrice ?? 20;
    let vixScore: number;
    if      (vix >= 30) vixScore = 5;
    else if (vix >= 25) vixScore = 20;
    else if (vix >= 20) vixScore = 38;
    else if (vix >= 16) vixScore = 55;
    else if (vix >= 12) vixScore = 75;
    else                vixScore = 90;

    // ── 2. Market Momentum: NIFTY vs 50-day MA ──────────────────────────────
    const rawClose3m: (number | null)[] =
      nifty3mJson?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
    const close3m = rawClose3m.filter((v): v is number => v != null);

    let momentumScore = 50;
    let momentumPct   = 0;
    if (close3m.length >= 20) {
      const window = close3m.slice(-Math.min(50, close3m.length));
      const ma     = window.reduce((a, b) => a + b, 0) / window.length;
      const last   = close3m[close3m.length - 1];
      momentumPct  = ((last - ma) / ma) * 100;
      // −5 % → 0, +5 % → 100 (clamped)
      momentumScore = Math.round(Math.min(100, Math.max(0, (momentumPct + 5) / 10 * 100)));
    }

    // ── 3. Sector Breadth ───────────────────────────────────────────────────
    const sectors      = getSectors();
    const positiveCount = sectors.filter(s => s.change > 0).length;
    const breadthPct   = (positiveCount / sectors.length) * 100;
    const breadthScore = Math.round(breadthPct);

    // ── 4. Safe Haven: Gold vs NIFTY (30-day return) ─────────────────────────
    const rawNifty1m: (number | null)[] =
      nifty1mJson?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
    const rawGold1m: (number | null)[] =
      goldJson?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];

    const nifty1m = rawNifty1m.filter((v): v is number => v != null);
    const gold1m  = rawGold1m.filter((v): v is number => v != null);

    const niftyRet = nifty1m.length >= 2
      ? ((nifty1m.at(-1)! - nifty1m[0]) / nifty1m[0]) * 100 : 0;
    const goldRet  = gold1m.length  >= 2
      ? ((gold1m.at(-1)!  - gold1m[0])  / gold1m[0])  * 100 : 0;

    // NIFTY outperforming gold → greed; gold outperforming → fear
    const diff         = niftyRet - goldRet; // positive = equities winning
    const safeHavenScore = Math.round(Math.min(100, Math.max(0, (diff + 5) / 10 * 100)));

    // ── Composite (weighted) ─────────────────────────────────────────────────
    const composite = Math.round(
      vixScore       * 0.30 +
      momentumScore  * 0.30 +
      breadthScore   * 0.25 +
      safeHavenScore * 0.15,
    );

    const components: FGIComponent[] = [
      {
        name: 'Volatility (India VIX)',
        score: vixScore,
        label: scoreToLabel(vixScore),
        value: vix.toFixed(2),
        description: 'Measures implied market volatility. Values above 25 signal elevated fear; below 12 suggest complacency.',
      },
      {
        name: 'Market Momentum',
        score: momentumScore,
        label: scoreToLabel(momentumScore),
        value: `${momentumPct >= 0 ? '+' : ''}${momentumPct.toFixed(2)}% vs MA${Math.min(50, close3m.length)}`,
        description: 'NIFTY 50 relative to its moving average. Prices above the MA signal bullish momentum.',
      },
      {
        name: 'Sector Breadth',
        score: breadthScore,
        label: scoreToLabel(breadthScore),
        value: `${positiveCount} / ${sectors.length} sectors positive`,
        description: 'Broad participation across Nifty sectors signals a healthy rally; narrow breadth = caution.',
      },
      {
        name: 'Safe Haven Demand',
        score: safeHavenScore,
        label: scoreToLabel(safeHavenScore),
        value: `Equities ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}% vs Gold (30d)`,
        description: 'Gold outperforming equities signals risk aversion. Equities outperforming gold signals confidence.',
      },
    ];

    return NextResponse.json({
      score: composite,
      label: scoreToLabel(composite),
      components,
      updatedAt: new Date().toISOString(),
    } satisfies FearGreedData);
  } catch (err) {
    console.error('Fear & Greed error:', err);
    return NextResponse.json({ error: 'Failed to compute' }, { status: 500 });
  }
}
