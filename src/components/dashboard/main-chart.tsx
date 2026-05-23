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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MainChartData, Ticker } from '@/lib/types';
import { Button } from '../ui/button';
import {
  XIcon,
  CandlestickChart,
  AreaChart as AreaChartIcon,
  Maximize2,
  Loader2,
  Layers,
  Activity,
  Info,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getAllTickers } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FullChartDialog from './full-chart-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateMA, calculateRSI } from '@/lib/indicators';

const CHART_BG = '#050505';
const GRID_COLOR = '#1c1c1c';

const BASE_CHART_OPTS = {
  layout: {
    background: { type: ColorType.Solid, color: CHART_BG },
    textColor: '#888888',
  },
  grid: {
    vertLines: { color: GRID_COLOR },
    horzLines: { color: GRID_COLOR },
  },
  rightPriceScale: { borderColor: GRID_COLOR },
  crosshair: { mode: CrosshairMode.Normal },
};

const COMPARE_COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

const toTime = (date: string): number => Math.floor(new Date(date).getTime() / 1000);
function last<T>(arr: T[]): T | undefined { return arr.length ? arr[arr.length - 1] : undefined; }

export default function MainChart({
  ticker: initialTicker,
  chartData: initialChartData,
}: {
  ticker: Ticker;
  chartData: MainChartData;
}) {
  const allTickers = useMemo(() => getAllTickers(), []);

  const [currentTicker, setCurrentTicker] = useState<Ticker>(initialTicker);
  const [currentData, setCurrentData]     = useState<MainChartData>(initialChartData);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const [timeframe,   setTimeframe]   = useState<keyof MainChartData>('1M');
  const [chartType,   setChartType]   = useState<'area' | 'candle'>('candle');
  const [showMA,      setShowMA]      = useState(false);
  const [showRSI,     setShowRSI]     = useState(false);
  const [compareWith, setCompareWith] = useState<string[]>([]);
  const [compareToAdd, setCompareToAdd] = useState<string | undefined>(undefined);
  const [compChartData, setCompChartData] = useState<Record<string, MainChartData>>({});
  const [isFullChartOpen, setIsFullChartOpen] = useState(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef   = useRef<HTMLDivElement>(null);
  const chartRef          = useRef<IChartApi | null>(null);
  const rsiChartRef       = useRef<IChartApi | null>(null);
  const mainSeriesRef     = useRef<any>(null);
  const liveBarRef        = useRef<any>(null);

  // ── fetch live data for comparison overlays ──────────────────────────────
  useEffect(() => {
    const missing = compareWith.filter(s => !compChartData[s]);
    if (missing.length === 0) return;
    missing.forEach(async (sym) => {
      try {
        const res = await fetch(`/api/chart?symbol=${encodeURIComponent(sym)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.error) setCompChartData(prev => ({ ...prev, [sym]: data }));
      } catch {}
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareWith]);

  // ── chart initialisation ────────────────────────────────────────────────────
  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;

    let destroyed = false;
    let initDone  = false;

    const cleanUp = () => {
      chartRef.current?.remove();
      rsiChartRef.current?.remove();
      chartRef.current    = null;
      rsiChartRef.current = null;
      mainSeriesRef.current = null;
      liveBarRef.current    = null;
    };

    cleanUp();

    const init = () => {
      if (destroyed || initDone) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      initDone = true;

      const dataPoints = [...(currentData[timeframe] ?? [])]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // ── main chart ──
      const chart = createChart(el, {
        ...BASE_CHART_OPTS,
        autoSize: true,
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
        const candles = dataPoints.map(d => ({
          time: toTime(d.date), open: d.open, high: d.high, low: d.low, close: d.close,
        }));
        const series = chart.addSeries(CandlestickSeries, {
          upColor:       '#10b981',
          downColor:     '#ef4444',
          wickUpColor:   '#10b981',
          wickDownColor: '#ef4444',
          borderVisible: false,
        } as any);
        series.setData(candles as any);
        mainSeriesRef.current = series;
        liveBarRef.current    = last(candles) ?? null;
      } else {
        const areaData = dataPoints.map(d => ({ time: toTime(d.date), value: d.value }));
        const series   = chart.addSeries(AreaSeries, {
          lineColor:       '#6366f1',
          topColor:        'rgba(99,102,241,0.35)',
          bottomColor:     'rgba(99,102,241,0)',
          lineWidth:       2,
          crosshairMarkerVisible: true,
        } as any);
        series.setData(areaData as any);
        mainSeriesRef.current = series;
        liveBarRef.current    = last(areaData) ?? null;
      }

      // ── MA overlay ──
      if (showMA) {
        const maData = calculateMA(dataPoints, 20)
          .filter(d => d.value !== null)
          .map(d => ({ time: toTime(d.date), value: d.value as number }));
        const maSeries = chart.addSeries(LineSeries, {
          color: 'rgba(251,191,36,0.9)',
          lineWidth: 1,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
        } as any);
        maSeries.setData(maData as any);
      }

      // ── comparison overlays ──
      compareWith.forEach((sym, idx) => {
        const compData = compChartData[sym]?.[timeframe];
        if (!compData?.length) return;
        const sorted = [...compData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const lineData = sorted.map(d => ({ time: toTime(d.date), value: d.value }));
        const compSeries = chart.addSeries(LineSeries, {
          color:     COMPARE_COLORS[idx % COMPARE_COLORS.length],
          lineWidth: 1.5,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
        } as any);
        compSeries.setData(lineData as any);
      });

      // ── RSI pane ──
      if (showRSI && rsiContainerRef.current) {
        const rsiChart = createChart(rsiContainerRef.current, {
          ...BASE_CHART_OPTS,
          autoSize: true,
          timeScale: { borderColor: GRID_COLOR, timeVisible: false, secondsVisible: false },
        });
        rsiChartRef.current = rsiChart;

        const rsiData = calculateRSI(dataPoints, 14)
          .filter(d => d.value !== null)
          .map(d => ({ time: toTime(d.date), value: d.value as number }));

        const rsiSeries = rsiChart.addSeries(LineSeries, {
          color: '#8b5cf6', lineWidth: 1.5,
        } as any);
        rsiSeries.setData(rsiData as any);

        // sync time scales
        chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
          if (range) try { rsiChart.timeScale().setVisibleRange(range); } catch {}
        });
        rsiChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
          if (range) try { chart.timeScale().setVisibleRange(range); } catch {}
        });
      }

      requestAnimationFrame(() => { try { chart.timeScale().fitContent(); } catch {} });
    };

    const ro = new ResizeObserver(init);
    ro.observe(el);
    init();

    return () => {
      destroyed = true;
      ro.disconnect();
      cleanUp();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe, chartType, showMA, showRSI, compareWith, currentData, compChartData]);

  // ── live polling ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let inFlight  = false;
    const pollMs  = timeframe === '1D' ? 5000 : timeframe === '5D' ? 10000 : 30000;

    const tick = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const res = await fetch(`/api/chart?symbol=${encodeURIComponent(currentTicker.symbol)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && !data?.error) setCurrentData(data);
      } catch {} finally { inFlight = false; }
    };

    tick();
    const id = setInterval(tick, pollMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [currentTicker.symbol, timeframe]);

  const handleStockChange = async (symbol: string) => {
    const t = allTickers.find(t => t.symbol === symbol);
    if (!t) return;
    setCurrentTicker(t);
    setIsLoadingChart(true);
    try {
      const res = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!data.error) setCurrentData(data);
    } catch {} finally { setIsLoadingChart(false); }
  };

  const compareCandidates = useMemo(
    () => allTickers.filter(t => t.symbol !== currentTicker.symbol && !compareWith.includes(t.symbol)),
    [allTickers, currentTicker.symbol, compareWith],
  );

  const handleAddComparison    = (s: string) => { setCompareWith(p => [...p, s]); setCompareToAdd(undefined); };
  const handleRemoveComparison = (s: string) => {
    setCompareWith(p => p.filter(x => x !== s));
    setCompChartData(prev => { const n = { ...prev }; delete n[s]; return n; });
  };

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 overflow-hidden flex flex-col">
      {/* ── toolbar ─────────────────────────────────────────────────────────── */}
      <CardHeader className="shrink-0 flex flex-col gap-3 pb-3">

        {/* Row 1: ticker + chart-type + timeframe + expand */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Select value={currentTicker.symbol} onValueChange={handleStockChange}>
              <SelectTrigger className="w-auto border-none shadow-none focus:ring-0 p-0 h-auto font-bold text-lg bg-transparent gap-1.5">
                <span>{currentTicker.symbol}</span>
              </SelectTrigger>
              <SelectContent>
                {allTickers.map(t => (
                  <SelectItem key={t.symbol} value={t.symbol}>
                    <span className="font-semibold">{t.symbol}</span>
                    <span className="ml-2 font-normal text-muted-foreground text-xs">{t.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingChart && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          <div className="flex items-center gap-2">
            {/* Chart type toggle */}
            <div className="flex items-center rounded-lg bg-secondary/50 p-0.5">
              <Button
                variant={chartType === 'area' ? 'secondary' : 'ghost'}
                size="sm" className="h-7 px-2 gap-1"
                onClick={() => setChartType('area')}
              >
                <AreaChartIcon className="h-3.5 w-3.5" />
                <span className="text-xs">Area</span>
              </Button>
              <Button
                variant={chartType === 'candle' ? 'secondary' : 'ghost'}
                size="sm" className="h-7 px-2 gap-1"
                onClick={() => setChartType('candle')}
              >
                <CandlestickChart className="h-3.5 w-3.5" />
                <span className="text-xs">Candle</span>
              </Button>
            </div>

            {/* Timeframe */}
            <div className="flex items-center rounded-lg bg-secondary/50 p-0.5">
              {(['1D', '5D', '1M', '6M', '1Y'] as (keyof MainChartData)[]).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                    tf === timeframe
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>

            <Button variant="outline" size="sm" className="h-7 px-2 gap-1" onClick={() => setIsFullChartOpen(true)}>
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="text-xs">Full</span>
            </Button>
          </div>
        </div>

        {/* Row 2: indicators + compare */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-secondary/20 px-3 py-2 text-xs">
          {/* Indicators */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-muted-foreground">
              <Activity className="h-3 w-3" /> Indicators
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Checkbox id="ma" checked={showMA} onCheckedChange={v => setShowMA(!!v)} />
                <Label htmlFor="ma" className="cursor-pointer text-xs">MA (20)</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <Checkbox id="rsi" checked={showRSI} onCheckedChange={v => setShowRSI(!!v)} />
                <Label htmlFor="rsi" className="cursor-pointer text-xs">RSI (14)</Label>
              </div>
            </div>
          </div>

          <div className="h-3 w-px bg-border/50" />

          {/* Compare */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-muted-foreground">
              <Layers className="h-3 w-3" /> Compare
            </span>
            <Select value={compareToAdd} onValueChange={handleAddComparison}>
              <SelectTrigger className="h-6 w-[150px] text-xs">
                <SelectValue placeholder="Add ticker…" />
              </SelectTrigger>
              <SelectContent>
                {compareCandidates.map(t => (
                  <SelectItem key={t.symbol} value={t.symbol} textValue={t.symbol}>
                    {t.symbol}
                    <span className="ml-1 font-normal text-muted-foreground">{t.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {compareWith.map((s, i) => (
              <span
                key={s}
                className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                style={{ borderColor: COMPARE_COLORS[i % COMPARE_COLORS.length], color: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
              >
                {s}
                <button onClick={() => handleRemoveComparison(s)}>
                  <XIcon className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      {/* ── chart area ──────────────────────────────────────────────────────── */}
      <CardContent className="p-0 flex flex-col overflow-hidden rounded-b-2xl">
        <div className="relative w-full" style={{ height: 420, background: CHART_BG }} ref={chartContainerRef} />
        {showRSI && (
          <div className="h-28 shrink-0 border-t border-[#1c1c1c] relative">
            <span className="absolute top-1.5 left-3 z-10 text-[10px] font-semibold text-violet-400">RSI (14)</span>
            <div className="h-full w-full" ref={rsiContainerRef} />
          </div>
        )}
      </CardContent>

      <FullChartDialog
        ticker={currentTicker}
        isOpen={isFullChartOpen}
        onOpenChange={setIsFullChartOpen}
        chartData={currentData}
      />
    </Card>
  );
}
