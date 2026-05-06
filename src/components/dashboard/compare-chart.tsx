'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  createChart,
  LineSeries,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  IChartApi,
} from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GitCompare, TrendingUp, TrendingDown, AreaChart as AreaIcon, CandlestickChart } from 'lucide-react';
import { getAllTickers } from '@/lib/data';
import type { Ticker, MainChartData, ChartDataPoint } from '@/lib/types';
import { cn } from '@/lib/utils';

type Timeframe = '1M' | '6M' | '1Y';
type ChartType = 'line' | 'candle';

const COLOR_A = '#ffffff';
const COLOR_B = '#f59e0b';
const CHART_BG   = '#050505';
const GRID_COLOR = '#1c1c1c';

// ── Normalise to base-100 at period start ────────────────────────────────────
function getBase(data: ChartDataPoint[]) {
  return data.find(d => (d.close || d.value) > 0)?.close ??
         data.find(d => d.value > 0)?.value ?? 0;
}

function normLine(data: ChartDataPoint[]) {
  const base = getBase(data);
  if (!base) return [];
  return data.map(d => ({
    time: Math.floor(new Date(d.date).getTime() / 1000) as any,
    value: ((d.close || d.value) / base) * 100,
  }));
}

function normCandle(data: ChartDataPoint[]) {
  const base = getBase(data);
  if (!base) return [];
  const n = (v: number) => (v / base) * 100;
  return data.map(d => ({
    time:  Math.floor(new Date(d.date).getTime() / 1000) as any,
    open:  n(d.open  || d.value),
    high:  n(d.high  || d.value),
    low:   n(d.low   || d.value),
    close: n(d.close || d.value),
  }));
}

async function fetchChart(symbol: string): Promise<MainChartData | null> {
  try {
    const res = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}`, { cache: 'no-store' });
    const data = await res.json();
    return data?.error ? null : data;
  } catch { return null; }
}

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

export default function CompareChart({ ticker }: { ticker: Ticker }) {
  const [symbolB, setSymbolB]     = useState<string | undefined>();
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [dataA, setDataA]         = useState<MainChartData | null>(null);
  const [dataB, setDataB]         = useState<MainChartData | null>(null);
  const [loadingA, setLoadingA]   = useState(true);
  const [loadingB, setLoadingB]   = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);

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

  // ── build / rebuild chart whenever deps change ──────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !dataA || !symbolB) return;

    let destroyed = false;
    let initDone  = false;

    const cleanup = () => {
      chartRef.current?.remove();
      chartRef.current = null;
    };
    cleanup();

    const init = () => {
      if (destroyed || initDone) return;
      const { width, height } = el.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      initDone = true;

      const rawA = dataA[timeframe];
      const rawB = dataB ? dataB[timeframe] : null;

      const chart = createChart(el, {
        autoSize: true,
        layout: { background: { type: ColorType.Solid, color: CHART_BG }, textColor: '#888' },
        grid:   { vertLines: { color: GRID_COLOR }, horzLines: { color: GRID_COLOR } },
        rightPriceScale: {
          borderColor: GRID_COLOR,
          // Format Y-axis as +X% / -X%
          mode: 0,
        },
        crosshair: { mode: CrosshairMode.Normal },
        timeScale: {
          borderColor: GRID_COLOR,
          timeVisible: false,
          secondsVisible: false,
        },
      });
      chartRef.current = chart;

      // Custom price formatter: show (value - 100) as %
      chart.applyOptions({
        localization: {
          priceFormatter: (v: number) => {
            const pct = v - 100;
            return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
          },
        },
      });

      if (chartType === 'line') {
        const serA = chart.addSeries(LineSeries, {
          color: COLOR_A, lineWidth: 2,
          priceLineVisible: false, lastValueVisible: false,
        } as any);
        serA.setData(normLine(rawA) as any);

        if (rawB) {
          const serB = chart.addSeries(LineSeries, {
            color: COLOR_B, lineWidth: 2,
            priceLineVisible: false, lastValueVisible: false,
          } as any);
          serB.setData(normLine(rawB) as any);
        }
      } else {
        const serA = chart.addSeries(CandlestickSeries, {
          upColor: '#10b981', downColor: '#ef4444',
          borderVisible: false,
          wickUpColor: '#10b981', wickDownColor: '#ef4444',
          priceLineVisible: false, lastValueVisible: false,
        } as any);
        serA.setData(normCandle(rawA) as any);

        if (rawB) {
          const serB = chart.addSeries(CandlestickSeries, {
            upColor:         'transparent',
            downColor:       'transparent',
            borderUpColor:   COLOR_B,
            borderDownColor: COLOR_B,
            wickUpColor:     COLOR_B,
            wickDownColor:   COLOR_B,
            priceLineVisible: false, lastValueVisible: false,
          } as any);
          serB.setData(normCandle(rawB) as any);
        }
      }

      requestAnimationFrame(() => { try { chart.timeScale().fitContent(); } catch {} });
    };

    const ro = new ResizeObserver(init);
    ro.observe(el);
    init();

    return () => { destroyed = true; ro.disconnect(); cleanup(); };
  }, [dataA, dataB, timeframe, chartType, symbolB]);

  // ── return values for badges ─────────────────────────────────────────────
  const { retA, retB } = useMemo(() => {
    if (!dataA) return { retA: 0, retB: null };
    const rawA = dataA[timeframe];
    const lastA = rawA[rawA.length - 1];
    const baseA = getBase(rawA);
    const retA  = baseA ? ((lastA?.close || lastA?.value) / baseA) * 100 - 100 : 0;

    let retB: number | null = null;
    if (dataB) {
      const rawB  = dataB[timeframe];
      const lastB = rawB[rawB.length - 1];
      const baseB = getBase(rawB);
      retB = baseB ? ((lastB?.close || lastB?.value) / baseB) * 100 - 100 : null;
    }
    return { retA, retB };
  }, [dataA, dataB, timeframe]);

  const isLoading = loadingA || loadingB;

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 overflow-hidden flex flex-col">
      <CardHeader className="shrink-0 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Compare Performance</CardTitle>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={symbolB} onValueChange={setSymbolB}>
              <SelectTrigger className="h-8 w-[180px] text-xs">
                <span>{symbolB ? `${symbolB} ${candidates.find(c => c.symbol === symbolB)?.name ?? ''}` : 'Compare with…'}</span>
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
              <Button variant={chartType === 'line'   ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2 text-xs" onClick={() => setChartType('line')}>
                <AreaIcon className="mr-1 h-3.5 w-3.5" /> Line
              </Button>
              <Button variant={chartType === 'candle' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2 text-xs" onClick={() => setChartType('candle')}>
                <CandlestickChart className="mr-1 h-3.5 w-3.5" /> Candle
              </Button>
            </div>

            <div className="flex items-center rounded-lg bg-secondary/50 p-0.5">
              {(['1M', '6M', '1Y'] as Timeframe[]).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                    tf === timeframe ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {symbolB && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <ReturnBadge symbol={ticker.symbol} ret={retA} color={COLOR_A} />
            {retB !== null && <ReturnBadge symbol={symbolB} ret={retB} color={COLOR_B} />}
            {chartType === 'candle' && (
              <span className="text-[10px] text-muted-foreground">
                White candles = {ticker.symbol} · Amber outline = {symbolB}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-none" />
        ) : !symbolB ? (
          <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <GitCompare className="h-8 w-8 opacity-30" />
            <p>Select a stock above to compare</p>
            <p className="text-[11px] opacity-60">Both stocks normalised to 100 at period start</p>
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{ height: 280, background: CHART_BG }}
            className="w-full rounded-b-2xl"
          />
        )}
      </CardContent>
    </Card>
  );
}
