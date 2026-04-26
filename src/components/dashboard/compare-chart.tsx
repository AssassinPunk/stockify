'use client';

import { useState, useEffect, useMemo } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GitCompare, TrendingUp, TrendingDown, AreaChart as AreaIcon, CandlestickChart } from 'lucide-react';
import { getAllTickers } from '@/lib/data';
import type { Ticker, MainChartData, ChartDataPoint } from '@/lib/types';
import { cn } from '@/lib/utils';

type Timeframe = '1M' | '6M' | '1Y';
type ChartType = 'line' | 'candle';

const COLOR_A = 'hsl(var(--primary))';
const COLOR_B = '#f59e0b';

// ── Normalize helpers ────────────────────────────────────────────────────────
function getBase(data: ChartDataPoint[]) {
  return data.find(d => (d.close || d.value) > 0)?.close ||
         data.find(d => d.value > 0)?.value || 0;
}

/** Normalized close-only (for line mode) */
function normalizeClose(data: ChartDataPoint[]) {
  const base = getBase(data);
  if (!base) return [];
  return data.map(d => ({
    date: d.date,
    value: parseFloat((((d.close || d.value) / base) * 100).toFixed(3)),
  }));
}

/** Normalized OHLC for Stock A — fields: open, high, low, close, value */
function normalizeOHLC_A(data: ChartDataPoint[]) {
  const base = getBase(data);
  if (!base) return [];
  const n = (v: number) => parseFloat(((v / base) * 100).toFixed(3));
  return data.map(d => ({
    date:  d.date,
    open:  n(d.open  || d.value),
    high:  n(d.high  || d.value),
    low:   n(d.low   || d.value),
    close: n(d.close || d.value),
    value: n(d.close || d.value),
  }));
}

/** Normalized OHLC for Stock B — fields: bOpen, bHigh, bLow, bClose, bValue */
function normalizeOHLC_B(data: ChartDataPoint[]) {
  const base = getBase(data);
  if (!base) return [];
  const n = (v: number) => parseFloat(((v / base) * 100).toFixed(3));
  return data.map(d => ({
    date:   d.date,
    bOpen:  n(d.open  || d.value),
    bHigh:  n(d.high  || d.value),
    bLow:   n(d.low   || d.value),
    bClose: n(d.close || d.value),
    bValue: n(d.close || d.value),
  }));
}

// ── Candlestick shape ─────────────────────────────────────────────────────────
// `outline` = true renders Stock B as hollow candles so the two series stay distinct
const Candlestick = ({
  x, y, width, height, open, close, high, low, yDomain, outline = false,
}: {
  x: number; y: number; width: number; height: number;
  open: number; close: number; high: number; low: number;
  yDomain: [number, number]; outline?: boolean;
}) => {
  if (close === undefined || open === undefined) return null;
  const isUp = close >= open;
  const color = isUp ? 'hsl(var(--up))' : 'hsl(var(--down))';
  const denom = close - (yDomain?.[0] ?? 0);
  const scale = (val: number) => (!denom ? y : y + height * (close - val) / denom);
  const openY  = scale(open);
  const highY  = scale(high);
  const lowY   = scale(low);
  const bodyTop = Math.min(openY, y);
  const bodyH   = Math.max(1, Math.abs(openY - y));
  const wickX   = x + width / 2;
  return (
    <g>
      <line x1={wickX} y1={highY} x2={wickX} y2={lowY} stroke={color} strokeWidth={1} />
      <rect
        x={x} y={bodyTop}
        width={Math.max(1, width - 1)} height={bodyH}
        fill={outline ? 'transparent' : color}
        stroke={color}
        strokeWidth={outline ? 1.5 : 0}
      />
    </g>
  );
};

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchChart(symbol: string): Promise<MainChartData | null> {
  try {
    const res = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}`, { cache: 'no-store' });
    const data = await res.json();
    return data?.error ? null : data;
  } catch { return null; }
}

// ── Tooltips ──────────────────────────────────────────────────────────────────
const LineTooltip = ({ active, payload, label, symA, symB }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {new Date(label).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
      </p>
      {payload.map((p: any) => {
        const ret = (p.value ?? 100) - 100;
        return (
          <div key={p.dataKey} className="flex items-center justify-between gap-8">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.dataKey === 'a' ? symA : symB}
            </span>
            <span className={cn('font-mono text-xs font-bold', ret >= 0 ? 'text-up' : 'text-down')}>
              {ret >= 0 ? '+' : ''}{ret.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

const CandleTooltip = ({ active, payload, label, symA, symB }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const fmtRet = (v: number | undefined) =>
    v != null ? `${(v - 100) >= 0 ? '+' : ''}${(v - 100).toFixed(2)}%` : '—';
  const hasB = d?.bClose != null;

  return (
    <div className="rounded-xl border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-sm min-w-[170px]">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {new Date(label).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
      </p>

      {/* Stock A */}
      <p className="mb-1 text-[10px] font-bold" style={{ color: COLOR_A }}>{symA}</p>
      {(['open', 'high', 'low', 'close'] as const).map(k => (
        <div key={k} className="flex justify-between gap-6">
          <span className="text-[10px] uppercase text-muted-foreground">{k}</span>
          <span className={cn('font-mono text-[10px] font-bold',
            d?.[k] != null && (d[k] - 100) >= 0 ? 'text-up' : 'text-down'
          )}>
            {fmtRet(d?.[k])}
          </span>
        </div>
      ))}

      {/* Stock B */}
      {hasB && symB && (
        <div className="mt-2 border-t border-border/30 pt-2">
          <p className="mb-1 text-[10px] font-bold" style={{ color: COLOR_B }}>{symB}</p>
          {(['bOpen', 'bHigh', 'bLow', 'bClose'] as const).map(k => (
            <div key={k} className="flex justify-between gap-6">
              <span className="text-[10px] uppercase text-muted-foreground">{k.slice(1)}</span>
              <span className={cn('font-mono text-[10px] font-bold',
                d?.[k] != null && (d[k] - 100) >= 0 ? 'text-up' : 'text-down'
              )}>
                {fmtRet(d?.[k])}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Return badge ──────────────────────────────────────────────────────────────
function ReturnBadge({ symbol, ret, color }: { symbol: string; ret: number; color: string }) {
  const pos = ret >= 0;
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
      pos ? 'border-up/30 bg-up/10 text-up' : 'border-down/30 bg-down/10 text-down',
    )}>
      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
      {symbol}
      {pos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {pos ? '+' : ''}{ret.toFixed(2)}%
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CompareChart({ ticker }: { ticker: Ticker }) {
  const [symbolB, setSymbolB]     = useState<string | undefined>();
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [dataA, setDataA]         = useState<MainChartData | null>(null);
  const [dataB, setDataB]         = useState<MainChartData | null>(null);
  const [loadingA, setLoadingA]   = useState(true);
  const [loadingB, setLoadingB]   = useState(false);

  const candidates = useMemo(
    () => getAllTickers().filter(t => !t.isIndex && t.symbol !== ticker.symbol),
    [ticker.symbol],
  );

  useEffect(() => {
    setLoadingA(true);
    fetchChart(ticker.symbol).then(d => { setDataA(d); setLoadingA(false); });
  }, [ticker.symbol]);

  useEffect(() => {
    if (!symbolB) { setDataB(null); return; }
    setLoadingB(true);
    fetchChart(symbolB).then(d => { setDataB(d); setLoadingB(false); });
  }, [symbolB]);

  const chartData = useMemo(() => {
    if (!dataA) return [];
    const rawA = dataA[timeframe];
    const rawB = symbolB && dataB ? dataB[timeframe] : null;

    if (chartType === 'candle') {
      const normA = normalizeOHLC_A(rawA);
      const normB = rawB ? normalizeOHLC_B(rawB) : null;
      const len   = normB ? Math.min(normA.length, normB.length) : normA.length;
      return Array.from({ length: len }, (_, i) => ({
        ...normA[i],
        ...(normB ? normB[i] : {}),
      }));
    }

    const normA = normalizeClose(rawA);
    const normB = rawB ? normalizeClose(rawB) : null;
    const len   = normB ? Math.min(normA.length, normB.length) : normA.length;
    return Array.from({ length: len }, (_, i) => ({
      date: normA[i].date,
      a:    normA[i].value,
      ...(normB ? { b: normB[i].value } : {}),
    }));
  }, [dataA, dataB, timeframe, symbolB, chartType]);

  const yDomain = useMemo((): [number, number] => {
    if (!chartData.length) return [90, 110];
    let vals: number[] = [];
    if (chartType === 'candle') {
      vals = chartData.flatMap(d => {
        const x = d as any;
        return [x.high, x.low, x.bHigh, x.bLow].filter((v): v is number => v != null);
      });
    } else {
      vals = chartData.flatMap(d => {
        const x = d as any;
        return [x.a, x.b].filter((v): v is number => v != null);
      });
    }
    if (!vals.length) return [90, 110];
    return [Math.min(...vals) * 0.997, Math.max(...vals) * 1.003];
  }, [chartData, chartType]);

  const last = chartData[chartData.length - 1] as any;
  const retA = last ? ((chartType === 'candle' ? last.close : last.a) ?? 100) - 100 : 0;
  const retB = chartType === 'candle'
    ? (last?.bClose != null ? last.bClose - 100 : null)
    : (last?.b      != null ? last.b       - 100 : null);

  const isLoading      = loadingA || loadingB;
  const showPlaceholder = !symbolB;

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Compare Performance</CardTitle>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={symbolB} onValueChange={setSymbolB}>
              <SelectTrigger className="h-8 w-[180px] text-xs">
                <SelectValue placeholder="Compare with…" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map(t => (
                  <SelectItem key={t.symbol} value={t.symbol}>
                    <span className="font-mono font-semibold">{t.symbol}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{t.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center rounded-lg bg-secondary/50 p-0.5">
              <Button
                variant={chartType === 'line'   ? 'secondary' : 'ghost'}
                size="sm" className="h-7 px-2 text-xs"
                onClick={() => setChartType('line')}
              >
                <AreaIcon className="mr-1 h-3.5 w-3.5" /> Line
              </Button>
              <Button
                variant={chartType === 'candle' ? 'secondary' : 'ghost'}
                size="sm" className="h-7 px-2 text-xs"
                onClick={() => setChartType('candle')}
              >
                <CandlestickChart className="mr-1 h-3.5 w-3.5" /> Candle
              </Button>
            </div>

            <Tabs value={timeframe} onValueChange={v => setTimeframe(v as Timeframe)}>
              <TabsList className="h-8">
                {(['1M', '6M', '1Y'] as Timeframe[]).map(tf => (
                  <TabsTrigger key={tf} value={tf} className="h-6 px-2.5 text-xs">{tf}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {!showPlaceholder && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <ReturnBadge symbol={ticker.symbol} ret={retA} color={COLOR_A} />
            {retB !== null && symbolB && (
              <ReturnBadge symbol={symbolB} ret={retB} color={COLOR_B} />
            )}
            {chartType === 'candle' && symbolB && (
              <span className="text-[10px] text-muted-foreground">
                Solid = {ticker.symbol} · Outline = {symbolB}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="h-[300px] pb-4">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : showPlaceholder ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <GitCompare className="h-8 w-8 opacity-30" />
            <p>Select a stock above to compare</p>
            <p className="text-[11px] opacity-60">Both stocks normalized to 100 at period start</p>
          </div>
        ) : (
          <ChartContainer
            config={{
              a:      { label: ticker.symbol, color: COLOR_A },
              close:  { label: ticker.symbol, color: COLOR_A },
              b:      { label: symbolB ?? '', color: COLOR_B },
              bValue: { label: symbolB ?? '', color: COLOR_B },
            }}
            className="h-full w-full"
          >
            <ComposedChart data={chartData} margin={{ top: 10, right: 14, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10} tickLine={false} axisLine={false}
                tickFormatter={v =>
                  new Date(v).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                }
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10} tickLine={false} axisLine={false}
                orientation="right"
                domain={yDomain}
                tickFormatter={v => `${(v - 100) >= 0 ? '+' : ''}${(v - 100).toFixed(0)}%`}
              />
              <ChartTooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                content={
                  chartType === 'candle'
                    ? <CandleTooltip symA={ticker.symbol} symB={symbolB} />
                    : <LineTooltip   symA={ticker.symbol} symB={symbolB} />
                }
              />
              <ReferenceLine y={100} stroke="hsl(var(--border))" strokeDasharray="4 4" />

              {chartType === 'line' ? (
                <>
                  <Line type="monotone" dataKey="a" stroke={COLOR_A} strokeWidth={2} dot={false} />
                  {symbolB && (
                    <Line type="monotone" dataKey="b" stroke={COLOR_B} strokeWidth={2} dot={false} />
                  )}
                </>
              ) : (
                <>
                  {/* Stock A — solid candles */}
                  <Bar
                    dataKey="value"
                    isAnimationActive={false}
                    shape={(p: any) => (
                      <Candlestick
                        {...p}
                        open={p.open} high={p.high} low={p.low} close={p.close}
                        yDomain={yDomain}
                        outline={false}
                      />
                    )}
                  />
                  {/* Stock B — outline candles */}
                  {symbolB && (
                    <Bar
                      dataKey="bValue"
                      isAnimationActive={false}
                      shape={(p: any) => (
                        <Candlestick
                          {...p}
                          open={p.bOpen} high={p.bHigh} low={p.bLow} close={p.bClose}
                          yDomain={yDomain}
                          outline={true}
                        />
                      )}
                    />
                  )}
                </>
              )}
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
