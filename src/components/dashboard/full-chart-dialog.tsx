'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  LineSeries,
  ColorType,
  CrosshairMode,
  IChartApi,
} from 'lightweight-charts';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XIcon, SlidersHorizontal, CandlestickChart, AreaChart as AreaChartIcon } from 'lucide-react';
import type { ChartDataPoint, MainChartData, Ticker } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { calculateADL, calculateMA, calculateRSI } from '@/lib/indicators';
import { cn } from '@/lib/utils';

const CHART_BG    = '#000000';
const GRID_COLOR  = '#1f1f1f';

const CHART_OPTS = {
  layout: { background: { type: ColorType.Solid, color: CHART_BG }, textColor: '#888' },
  grid:   { vertLines: { color: GRID_COLOR }, horzLines: { color: GRID_COLOR } },
  rightPriceScale: { borderColor: GRID_COLOR },
  crosshair: { mode: CrosshairMode.Normal },
};

const toTime = (date: string): number => Math.floor(new Date(date).getTime() / 1000);
function last<T>(arr: T[]): T | undefined { return arr.length ? arr[arr.length - 1] : undefined; }
function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }

export default function FullChartDialog({
  ticker,
  isOpen,
  onOpenChange,
  chartData,
}: {
  ticker: Ticker;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  chartData: MainChartData;
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef   = useRef<HTMLDivElement>(null);
  const adlContainerRef   = useRef<HTMLDivElement>(null);

  const [timeframe, setTimeframe] = useState<keyof MainChartData>('1M');
  const [chartType, setChartType] = useState<'candle' | 'area'>('candle');
  const [showRSI, setShowRSI] = useState(false);
  const [showADL, setShowADL] = useState(false);
  const [showMA,  setShowMA]  = useState(false);

  const mainChartRef    = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<any>(null);
  const chartsRef       = useRef<IChartApi[]>([]);
  const liveBarRef      = useRef<{ time: number; open: number; high: number; low: number; close: number } | null>(null);
  const latestChartDataRef = useRef<MainChartData>(chartData);
  const animTokenRef    = useRef(0);

  useEffect(() => { latestChartDataRef.current = chartData; }, [chartData]);

  const baseDataPoints = useMemo(() => {
    return chartData[timeframe]
      .map(d => ({ ...d }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [chartData, timeframe]);

  // ── chart initialisation ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !chartContainerRef.current) return;

    let destroyed = false;
    let initOnce  = false;

    const cleanupCharts = () => {
      animTokenRef.current++;
      chartsRef.current.forEach(c => c.remove());
      chartsRef.current     = [];
      mainChartRef.current  = null;
      candleSeriesRef.current = null;
      liveBarRef.current    = null;
    };

    cleanupCharts();

    const initIfReady = () => {
      if (destroyed || initOnce) return;
      const el = chartContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      initOnce = true;

      const dataPoints = (latestChartDataRef.current?.[timeframe] ?? [])
        .map(d => ({ ...d }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const maData = calculateMA(dataPoints, 20)
        .filter(d => d.value !== null)
        .map(d => ({ time: toTime(d.date), value: d.value as number }));

      const rsiData = calculateRSI(dataPoints, 14)
        .filter(d => d.value !== null)
        .map(d => ({ time: toTime(d.date), value: d.value as number }));

      const adlData = calculateADL(dataPoints)
        .map(d => ({ time: toTime(d.date), value: d.value as number }));

      const charts: IChartApi[] = [];

      const mainChart = createChart(el, {
        ...CHART_OPTS,
        autoSize: true,
        timeScale: {
          borderColor: GRID_COLOR,
          timeVisible: timeframe === '1D' || timeframe === '5D',
          secondsVisible: false,
        },
      });
      charts.push(mainChart);
      mainChartRef.current = mainChart;

      // ── main series: candle or area ──
      if (chartType === 'candle') {
        const candlesData = dataPoints.map(d => ({
          time: toTime(d.date), open: d.open, high: d.high, low: d.low, close: d.close,
        }));
        const series = mainChart.addSeries(CandlestickSeries, {
          upColor:       '#10b981',
          downColor:     '#ef4444',
          borderVisible: false,
          wickUpColor:   '#10b981',
          wickDownColor: '#ef4444',
        } as any);
        series.setData(candlesData as any);
        candleSeriesRef.current = series;
        liveBarRef.current      = last(candlesData) ?? null;
      } else {
        const areaData = dataPoints.map(d => ({ time: toTime(d.date), value: d.value }));
        const series   = mainChart.addSeries(AreaSeries, {
          lineColor:   '#6366f1',
          topColor:    'rgba(99,102,241,0.35)',
          bottomColor: 'rgba(99,102,241,0)',
          lineWidth:   2,
          crosshairMarkerVisible: true,
        } as any);
        series.setData(areaData as any);
        candleSeriesRef.current = series;
        liveBarRef.current = last(areaData) ? { ...(last(areaData) as any), open: 0, high: 0, low: 0, close: (last(areaData) as any).value } : null;
      }

      if (showMA) {
        const maSeries = mainChart.addSeries(LineSeries, {
          color: 'rgba(251,191,36,0.9)', lineWidth: 1,
          crosshairMarkerVisible: false, lastValueVisible: false, priceLineVisible: false,
        } as any);
        maSeries.setData(maData as any);
      }

      // ── RSI pane ──
      let rsiChart: IChartApi | null = null;
      if (showRSI && rsiContainerRef.current) {
        rsiChart = createChart(rsiContainerRef.current, { ...CHART_OPTS, autoSize: true });
        charts.push(rsiChart);
        const rsiSeries = rsiChart.addSeries(LineSeries, { color: '#8b5cf6', lineWidth: 1.5 } as any);
        rsiSeries.setData(rsiData as any);
      }

      // ── ADL pane ──
      let adlChart: IChartApi | null = null;
      if (showADL && adlContainerRef.current) {
        adlChart = createChart(adlContainerRef.current, { ...CHART_OPTS, autoSize: true });
        charts.push(adlChart);
        const adlSeries = adlChart.addSeries(LineSeries, { color: '#facc15', lineWidth: 1.5 } as any);
        adlSeries.setData(adlData as any);
      }

      chartsRef.current = charts;

      // ── sync time scales ──
      const sync = (src: IChartApi, targets: (IChartApi | null)[]) => {
        src.timeScale().subscribeVisibleTimeRangeChange(range => {
          if (!range) return;
          targets.forEach(t => { if (t && t !== src) try { t.timeScale().setVisibleRange(range); } catch {} });
        });
      };
      sync(mainChart, [rsiChart, adlChart]);
      if (rsiChart) sync(rsiChart, [mainChart, adlChart]);
      if (adlChart) sync(adlChart, [mainChart, rsiChart]);

      requestAnimationFrame(() => { try { mainChart.timeScale().fitContent(); } catch {} });
    };

    const ro = new ResizeObserver(initIfReady);
    ro.observe(chartContainerRef.current);
    initIfReady();

    return () => {
      destroyed = true;
      ro.disconnect();
      cleanupCharts();
    };
  }, [isOpen, showRSI, showADL, showMA, timeframe, chartType]);

  // ── incremental data updates (preserve zoom) ──────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const chart  = mainChartRef.current;
    const series = candleSeriesRef.current;
    if (!chart || !series) return;

    const nextPoints = baseDataPoints;
    if (!nextPoints.length) return;

    const ts    = chart.timeScale();
    const range = ts.getVisibleRange();

    if (chartType === 'candle') {
      const nextCandles = nextPoints.map(d => ({
        time: toTime(d.date), open: d.open, high: d.high, low: d.low, close: d.close,
      }));
      const prev     = liveBarRef.current;
      const nextLast = last(nextCandles);
      if (prev && nextLast && prev.time === (nextLast.time as unknown as number)) {
        series.update(nextLast as any);
        liveBarRef.current = nextLast as any;
      } else {
        series.setData(nextCandles as any);
        liveBarRef.current = (nextLast as any) ?? null;
      }
    } else {
      const areaData = nextPoints.map(d => ({ time: toTime(d.date), value: d.value }));
      series.setData(areaData as any);
    }

    if (range) try { ts.setVisibleRange(range); } catch {}
  }, [isOpen, baseDataPoints, chartType]);

  // ── live candle animation (1D only) ──────────────────────────────────────
  useEffect(() => {
    if (!isOpen || timeframe !== '1D' || chartType !== 'candle') return;
    let cancelled = false;
    let inFlight  = false;
    let raf: number | null = null;
    const token = ++animTokenRef.current;

    const animateTo = (next: { time: number; open: number; high: number; low: number; close: number }) => {
      const series = candleSeriesRef.current;
      if (!series) return;
      const prev = liveBarRef.current;
      if (prev && next.time < prev.time) return;
      const start = performance.now(), duration = 650;
      const from = prev && prev.time === next.time
        ? prev
        : { ...next, close: next.open, high: Math.max(next.open, next.close), low: Math.min(next.open, next.close) };

      const step = (t: number) => {
        if (token !== animTokenRef.current) return;
        const p = clamp((t - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const close = from.close + (next.close - from.close) * eased;
        const high  = Math.max(from.high, next.high, from.open, close);
        const low   = Math.min(from.low,  next.low,  from.open, close);
        const bar   = { ...next, close, high, low };
        try { series.update(bar as any); liveBarRef.current = bar; } catch { cancelled = true; return; }
        if (p < 1 && !cancelled) raf = requestAnimationFrame(step);
      };
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };

    const tick = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const res = await fetch(`/api/chart?symbol=${encodeURIComponent(ticker.symbol)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as MainChartData;
        const pt: ChartDataPoint | undefined = last(data?.['1D'] ?? []);
        if (!pt || cancelled || !candleSeriesRef.current) return;
        animateTo({ time: toTime(pt.date), open: pt.open, high: pt.high, low: pt.low, close: pt.close });
      } catch {} finally { inFlight = false; }
    };

    tick();
    const id = window.setInterval(tick, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isOpen, ticker.symbol, timeframe, chartType]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] rounded-2xl bg-[#000000] border-white/5 p-0 flex flex-col overflow-hidden">
        <DialogTitle className="sr-only">Full Chart</DialogTitle>
        <DialogDescription className="sr-only">Detailed stock analysis chart</DialogDescription>

        {/* ── toolbar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#050505] shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-tight">{ticker.symbol}</h2>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-sm font-medium text-emerald-400">
              {formatNumber(ticker.price)}&nbsp;
              <span className="text-emerald-500/60">({ticker.percentChange > 0 ? '+' : ''}{ticker.percentChange}%)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart type toggle */}
            <div className="flex items-center rounded-lg border border-white/10 bg-black/30 p-0.5">
              <button
                onClick={() => setChartType('candle')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors',
                  chartType === 'candle' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white',
                )}
              >
                <CandlestickChart className="h-3.5 w-3.5" />
                Candle
              </button>
              <button
                onClick={() => setChartType('area')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors',
                  chartType === 'area' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white',
                )}
              >
                <AreaChartIcon className="h-3.5 w-3.5" />
                Area
              </button>
            </div>

            {/* Timeframe */}
            <div className="flex items-center rounded-xl border border-white/10 bg-black/30 p-1">
              {(['1D', '5D', '1M', '6M', '1Y'] as (keyof MainChartData)[]).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors',
                    tf === timeframe ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10',
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Indicators dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white">
                  <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
                  Indicators
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#050505] border-[#1f1f1f] text-white" align="end">
                <DropdownMenuCheckboxItem checked={showMA}  onCheckedChange={setShowMA}  className="focus:bg-white/10 focus:text-white cursor-pointer">Moving Average (MA 20)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showRSI} onCheckedChange={setShowRSI} className="focus:bg-white/10 focus:text-white cursor-pointer">Relative Strength Index (RSI 14)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showADL} onCheckedChange={setShowADL} className="focus:bg-white/10 focus:text-white cursor-pointer">Accum/Dist Line (ADL)</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white/60 hover:bg-white/10 hover:text-white rounded-xl">
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* ── chart area ────────────────────────────────────────────────────── */}
        <div className="flex-1 w-full bg-[#000000] flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 w-full relative min-h-0" ref={chartContainerRef} />

          {showRSI && (
            <div className="h-40 w-full border-t border-[#1f1f1f] relative flex flex-col shrink-0">
              <span className="absolute top-2 left-4 z-10 text-[#8b5cf6] text-xs font-semibold">RSI (14)</span>
              <div className="flex-1 w-full" ref={rsiContainerRef} />
            </div>
          )}

          {showADL && (
            <div className="h-40 w-full border-t border-[#1f1f1f] relative flex flex-col shrink-0">
              <span className="absolute top-2 left-4 z-10 text-[#facc15] text-xs font-semibold">Accum/Dist (ADL)</span>
              <div className="flex-1 w-full" ref={adlContainerRef} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
