'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  ColorType,
  IChartApi,
} from 'lightweight-charts';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XIcon, SlidersHorizontal } from 'lucide-react';
import type { ChartDataPoint, MainChartData, Ticker } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { calculateADL, calculateMA, calculateRSI } from '@/lib/indicators';

const CHART_OPTIONS = {
  layout: { background: { type: ColorType.Solid, color: '#000000' }, textColor: '#888' },
  grid: { vertLines: { color: '#1f1f1f' }, horzLines: { color: '#1f1f1f' } },
  timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#1f1f1f' },
  rightPriceScale: { borderColor: '#1f1f1f' },
};

const toTime = (date: string): number => Math.floor(new Date(date).getTime() / 1000);

function last<T>(arr: T[]): T | undefined {
  return arr.length ? arr[arr.length - 1] : undefined;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

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
  const rsiContainerRef = useRef<HTMLDivElement>(null);
  const adlContainerRef = useRef<HTMLDivElement>(null);

  const [timeframe, setTimeframe] = useState<keyof MainChartData>('1M');
  const [showRSI, setShowRSI] = useState(false);
  const [showADL, setShowADL] = useState(false);
  const [showMA, setShowMA] = useState(false);

  const mainChartRef = useRef<IChartApi | null>(null);
  // lightweight-charts v5 types vary; keep series typed loosely.
  const candleSeriesRef = useRef<any>(null);
  const chartsRef = useRef<IChartApi[]>([]);
  const liveBarRef = useRef<{ time: number; open: number; high: number; low: number; close: number } | null>(null);
  const latestChartDataRef = useRef<MainChartData>(chartData);
  const animTokenRef = useRef(0);

  useEffect(() => {
    latestChartDataRef.current = chartData;
  }, [chartData]);

  const baseDataPoints = useMemo(() => {
    return chartData[timeframe]
      .map(d => ({ ...d }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [chartData, timeframe]);

  useEffect(() => {
    if (!isOpen || !chartContainerRef.current) return;

    // Lightweight-charts may render blank if created while the dialog is still
    // transitioning and the container is 0x0. We wait until we have real pixels.
    let destroyed = false;
    let initOnce = false;

    const cleanupCharts = () => {
      animTokenRef.current++;
      chartsRef.current.forEach(c => c.remove());
      chartsRef.current = [];
      mainChartRef.current = null;
      candleSeriesRef.current = null;
      liveBarRef.current = null;
    };

    cleanupCharts();

    const initIfReady = () => {
      if (destroyed || initOnce) return;
      const el = chartContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      initOnce = true;

      // ----- 1. PREPARE DATA -----
      const dataPoints =
        (latestChartDataRef.current?.[timeframe] ?? [])
          .map(d => ({ ...d }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const candlesData = dataPoints.map(d => ({
        time: toTime(d.date), open: d.open, high: d.high, low: d.low, close: d.close,
      }));

      // Use d.date (not a filtered index) so times stay aligned after .filter()
      const maData = calculateMA(dataPoints, 20)
        .filter(d => d.value !== null)
        .map(d => ({ time: toTime(d.date), value: d.value as number }));

      const rsiData = calculateRSI(dataPoints, 14)
        .filter(d => d.value !== null)
        .map(d => ({ time: toTime(d.date), value: d.value as number }));

      const adlData = calculateADL(dataPoints)
        .map(d => ({ time: toTime(d.date), value: d.value as number }));

      // ----- 2. CREATE CHARTS -----
      const charts: IChartApi[] = [];

      const mainChart = createChart(el, {
        ...CHART_OPTIONS,
        autoSize: true,
        // For longer ranges, time labels can be less dense.
        timeScale: {
          ...CHART_OPTIONS.timeScale,
          timeVisible: timeframe === '1D' || timeframe === '5D',
        },
      });
      charts.push(mainChart);
      mainChartRef.current = mainChart;

      const candlestickSeries = mainChart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      } as any);
      candleSeriesRef.current = candlestickSeries;
      candlestickSeries.setData(candlesData as any);
      liveBarRef.current = last(candlesData) ?? null;

      if (showMA) {
        const maSeries = mainChart.addSeries(LineSeries, {
          color: 'rgba(255, 193, 7, 1)',
          lineWidth: 1.5,
          crosshairMarkerVisible: false,
        } as any);
        maSeries.setData(maData as any);
      }

      // RSI Pane
      let rsiChart: IChartApi | null = null;
      if (showRSI && rsiContainerRef.current) {
        rsiChart = createChart(rsiContainerRef.current, { ...CHART_OPTIONS, autoSize: true });
        charts.push(rsiChart);
        const rsiSeries = rsiChart.addSeries(LineSeries, { color: '#8b5cf6', lineWidth: 1.5 } as any);
        rsiSeries.setData(rsiData as any);
      }

      // ADL Pane
      let adlChart: IChartApi | null = null;
      if (showADL && adlContainerRef.current) {
        adlChart = createChart(adlContainerRef.current, { ...CHART_OPTIONS, autoSize: true });
        charts.push(adlChart);
        const adlSeries = adlChart.addSeries(LineSeries, { color: '#facc15', lineWidth: 1.5 } as any);
        adlSeries.setData(adlData as any);
      }

      chartsRef.current = charts;

      // ----- 3. SYNC TIME SCALES -----
      function syncTimeScales(source: IChartApi, targets: (IChartApi | null)[]) {
        source.timeScale().subscribeVisibleTimeRangeChange((range) => {
          if (!range) return;
          targets.forEach(target => {
            if (target && target !== source) target.timeScale().setVisibleRange(range);
          });
        });
      }

      syncTimeScales(mainChart, [rsiChart, adlChart]);
      if (rsiChart) syncTimeScales(rsiChart, [mainChart, adlChart]);
      if (adlChart) syncTimeScales(adlChart, [mainChart, rsiChart]);

      // Fit after the first real layout.
      requestAnimationFrame(() => {
        try {
          mainChart.timeScale().fitContent();
        } catch {}
      });
    };

    const ro = new ResizeObserver(() => initIfReady());
    ro.observe(chartContainerRef.current);
    initIfReady();

    return () => {
      destroyed = true;
      ro.disconnect();
      cleanupCharts();
    };
  }, [isOpen, showRSI, showADL, showMA, timeframe]);

  // Update the candlestick data without resetting the user's zoom/scroll.
  useEffect(() => {
    if (!isOpen) return;
    const chart = mainChartRef.current;
    const series = candleSeriesRef.current;
    if (!chart || !series) return;

    const nextPoints = baseDataPoints;
    if (!nextPoints.length) return;

    const nextCandles = nextPoints.map(d => ({
      time: toTime(d.date),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    // Preserve the current viewport.
    const ts = chart.timeScale();
    const range = ts.getVisibleRange();

    // Prefer incremental update when possible (keeps view steadier).
    const prev = liveBarRef.current;
    const nextLast = last(nextCandles);
    if (prev && nextLast && prev.time === (nextLast.time as unknown as number)) {
      series.update(nextLast as any);
      liveBarRef.current = nextLast as any;
    } else {
      series.setData(nextCandles as any);
      liveBarRef.current = (nextLast as any) ?? null;
    }

    if (range) {
      try {
        ts.setVisibleRange(range);
      } catch {}
    }
  }, [isOpen, baseDataPoints]);

  // Live candle "forming" animation (updates the last candle smoothly).
  useEffect(() => {
    if (!isOpen || timeframe !== '1D') return;
    let cancelled = false;
    let inFlight = false;
    let raf: number | null = null;
    const token = ++animTokenRef.current;

    const animateTo = (next: { time: number; open: number; high: number; low: number; close: number }) => {
      const series = candleSeriesRef.current;
      if (!series) return;

      const prev = liveBarRef.current;
      // Never "rewind" the series; if Yahoo returns an older bar, ignore it.
      if (prev && next.time < prev.time) return;

      const start = performance.now();
      const duration = 650;

      const from = prev && prev.time === next.time ? prev : { ...next, close: next.open, high: Math.max(next.open, next.close), low: Math.min(next.open, next.close) };

      const step = (t: number) => {
        if (token !== animTokenRef.current) return; // superseded by new init/data
        const p = clamp((t - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const close = from.close + (next.close - from.close) * eased;
        const high = Math.max(from.high, next.high, from.open, close);
        const low = Math.min(from.low, next.low, from.open, close);

        const bar = { ...next, close, high, low };
        try {
          series.update(bar as any);
          liveBarRef.current = bar;
        } catch {
          // If the series time sequence changed underneath (e.g. timeframe switch),
          // stop animating rather than crashing the page.
          cancelled = true;
          return;
        }

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
        const lastPoint: ChartDataPoint | undefined = last(data?.['1D'] ?? []);
        if (!lastPoint || cancelled) return;

        const nextBar = {
          time: toTime(lastPoint.date),
          open: lastPoint.open,
          high: lastPoint.high,
          low: lastPoint.low,
          close: lastPoint.close,
        };

        // Ensure the series exists (chart initialization is async due to sizing).
        if (!candleSeriesRef.current) return;

        animateTo(nextBar);
      } catch {
      } finally {
        inFlight = false;
      }
    };

    tick();
    const id = window.setInterval(tick, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isOpen, ticker.symbol, timeframe]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] rounded-2xl bg-[#000000] border-border/10 p-0 flex flex-col overflow-hidden">
        <DialogTitle className="sr-only">Full Chart</DialogTitle>
        <DialogDescription className="sr-only">Detailed stock analysis chart</DialogDescription>

        {/* Header toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#050505]">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">{ticker.symbol}</h2>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-sm font-medium text-emerald-400">
              {formatNumber(ticker.price)}{' '}
              <span className="text-emerald-500/70 ml-1">({ticker.percentChange}%)</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Timeframe */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
              {(['1D', '5D', '1M', '6M', '1Y'] as (keyof MainChartData)[]).map(tf => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={[
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors',
                    tf === timeframe ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                  ].join(' ')}
                >
                  {tf}
                </button>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Indicators
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#050505] border-[#1f1f1f] text-white" align="end">
                <DropdownMenuCheckboxItem checked={showMA} onCheckedChange={setShowMA} className="focus:bg-white/10 focus:text-white cursor-pointer">
                  Moving Average (MA)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showRSI} onCheckedChange={setShowRSI} className="focus:bg-white/10 focus:text-white cursor-pointer">
                  Relative Strength Index (RSI)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showADL} onCheckedChange={setShowADL} className="focus:bg-white/10 focus:text-white cursor-pointer">
                  Accum/Dist Line (ADL)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/10 hover:text-white rounded-xl">
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chart Container Group */}
        <div className="flex-1 w-full bg-[#000000] flex flex-col overflow-hidden">
          {/* Main Pane */}
          <div className="flex-1 w-full relative" ref={chartContainerRef} />

          {/* RSI Pane */}
          {showRSI && (
            <div className="h-48 w-full border-t border-[#1f1f1f] relative flex flex-col shrink-0">
              <div className="absolute top-2 left-4 z-10 text-[#8b5cf6] text-xs font-semibold">RSI (14)</div>
              <div className="flex-1 w-full" ref={rsiContainerRef} />
            </div>
          )}

          {/* ADL Pane */}
          {showADL && (
            <div className="h-48 w-full border-t border-[#1f1f1f] relative flex flex-col shrink-0">
              <div className="absolute top-2 left-4 z-10 text-[#facc15] text-xs font-semibold">Accum/Dist (ADL)</div>
              <div className="flex-1 w-full" ref={adlContainerRef} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
