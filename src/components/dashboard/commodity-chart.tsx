'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  LineSeries,
  ColorType,
  CrosshairMode,
  IChartApi,
} from 'lightweight-charts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CandlestickChart, AreaChart as AreaChartIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MainChartData } from '@/lib/types';

const CHART_BG   = '#050505';
const GRID_COLOR = '#1c1c1c';

const TIMEFRAMES = ['1D', '5D', '1M', '6M', '1Y'] as const;
type TF = typeof TIMEFRAMES[number];

const toTime = (d: string) => Math.floor(new Date(d).getTime() / 1000);
function last<T>(arr: T[]): T | undefined { return arr.length ? arr[arr.length - 1] : undefined; }

export default function CommodityChart({
  symbol,
  label,
  unit,
}: {
  symbol: string;
  label: string;
  unit: string;
}) {
  const [timeframe, setTimeframe] = useState<TF>('1M');
  const [chartType, setChartType] = useState<'candle' | 'area'>('candle');
  const [loading, setLoading]     = useState(true);
  const [data, setData]           = useState<MainChartData | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const seriesRef    = useRef<any>(null);

  // fetch chart data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (!cancelled && !d.error) setData(d); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [symbol]);

  // poll for live updates
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const r = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}`, { cache: 'no-store' });
        const d = await r.json();
        if (!d.error) setData(d);
      } catch {}
    }, timeframe === '1D' ? 5000 : 30_000);
    return () => clearInterval(id);
  }, [symbol, timeframe]);

  // build chart
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !data) return;

    let destroyed = false;
    let initDone  = false;

    const cleanup = () => {
      chartRef.current?.remove();
      chartRef.current  = null;
      seriesRef.current = null;
    };
    cleanup();

    const init = () => {
      if (destroyed || initDone) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      initDone = true;

      const points = [...(data[timeframe] ?? [])]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const chart = createChart(el, {
        autoSize: true,
        layout: { background: { type: ColorType.Solid, color: CHART_BG }, textColor: '#888' },
        grid: { vertLines: { color: GRID_COLOR }, horzLines: { color: GRID_COLOR } },
        rightPriceScale: { borderColor: GRID_COLOR },
        crosshair: { mode: CrosshairMode.Normal },
        timeScale: {
          borderColor: GRID_COLOR,
          timeVisible: timeframe === '1D' || timeframe === '5D',
          secondsVisible: false,
          fixLeftEdge: true,
          fixRightEdge: true,
        },
      });
      chartRef.current = chart;

      if (chartType === 'candle') {
        const candles = points.map(d => ({
          time: toTime(d.date), open: d.open, high: d.high, low: d.low, close: d.close,
        }));
        const s = chart.addSeries(CandlestickSeries, {
          upColor: '#10b981', downColor: '#ef4444',
          borderVisible: false,
          wickUpColor: '#10b981', wickDownColor: '#ef4444',
        } as any);
        s.setData(candles as any);
        seriesRef.current = s;
      } else {
        const areaData = points.map(d => ({ time: toTime(d.date), value: d.value }));
        const s = chart.addSeries(AreaSeries, {
          lineColor: '#6366f1',
          topColor: 'rgba(99,102,241,0.35)',
          bottomColor: 'rgba(99,102,241,0)',
          lineWidth: 2,
        } as any);
        s.setData(areaData as any);
        seriesRef.current = s;
      }

      requestAnimationFrame(() => { try { chart.timeScale().fitContent(); } catch {} });
    };

    const ro = new ResizeObserver(init);
    ro.observe(el);
    init();
    return () => { destroyed = true; ro.disconnect(); cleanup(); };
  }, [data, timeframe, chartType]);

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 overflow-hidden flex flex-col">
      <CardHeader className="shrink-0 pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm font-semibold text-muted-foreground">{label} — Price Chart</p>

          <div className="flex items-center gap-2">
            {/* Chart type */}
            <div className="flex items-center rounded-lg bg-secondary/50 p-0.5">
              <button
                onClick={() => setChartType('candle')}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                  chartType === 'candle' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <CandlestickChart className="h-3.5 w-3.5" /> Candle
              </button>
              <button
                onClick={() => setChartType('area')}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                  chartType === 'area' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <AreaChartIcon className="h-3.5 w-3.5" /> Area
              </button>
            </div>

            {/* Timeframe */}
            <div className="flex items-center rounded-lg bg-secondary/50 p-0.5">
              {TIMEFRAMES.map(tf => (
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
      </CardHeader>

      <CardContent className="flex-1 p-0 min-h-0">
        {loading ? (
          <div className="flex h-[500px] items-center justify-center" style={{ background: CHART_BG }}>
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{ height: 500, background: CHART_BG }}
            className="w-full rounded-b-2xl"
          />
        )}
      </CardContent>
    </Card>
  );
}
