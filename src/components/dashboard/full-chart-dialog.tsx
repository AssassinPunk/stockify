'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XIcon, SlidersHorizontal } from 'lucide-react';
import { Ticker, MainChartData } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { calculateADL, calculateMA, calculateRSI } from '@/lib/indicators';

const CHART_OPTIONS = {
  layout: { background: { type: 'solid' as any, color: '#000000' }, textColor: '#888' },
  grid: { vertLines: { color: '#1f1f1f' }, horzLines: { color: '#1f1f1f' } },
  timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#1f1f1f' },
  rightPriceScale: { borderColor: '#1f1f1f' },
};

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

  const [showRSI, setShowRSI] = useState(false);
  const [showADL, setShowADL] = useState(false);
  const [showMA, setShowMA] = useState(false);

  useEffect(() => {
    if (!isOpen || !chartContainerRef.current) return;

    // ----- 1. PREPARE DATA -----
    // Ensure chronological order
    const dataPoints = chartData['1M'].map(d => ({ ...d })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Lightweight Charts wants strictly typed time
    const chartTime = dataPoints.map(d => (new Date(d.date).getTime() / 1000) as any);

    // Candles
    const candlesData = dataPoints.map((d, i) => ({
      time: chartTime[i], open: d.open, high: d.high, low: d.low, close: d.close
    }));

    // Indicators
    const maData = calculateMA(dataPoints, 20).filter(d => d.value !== null).map((d, i) => ({ time: chartTime[i], value: d.value as number }));
    const rsiData = calculateRSI(dataPoints, 14).filter(d => d.value !== null).map((d, i) => ({ time: chartTime[i], value: d.value as number }));
    const adlData = calculateADL(dataPoints).map((d, i) => ({ time: chartTime[i], value: d.value as number }));


    // ----- 2. CREATE CHARTS -----
    const charts: IChartApi[] = [];

    // Main Chart
    const mainChart = createChart(chartContainerRef.current, {
      ...CHART_OPTIONS,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });
    charts.push(mainChart);

    const candlestickSeries = (mainChart as any).addCandlestickSeries({
      upColor: '#10b981', downColor: '#ef4444', borderVisible: false, wickUpColor: '#10b981', wickDownColor: '#ef4444',
    });
    candlestickSeries.setData(candlesData);

    if (showMA) {
      const maSeries = (mainChart as any).addLineSeries({ color: 'rgba(255, 193, 7, 1)', lineWidth: 1.5, crosshairMarkerVisible: false });
      maSeries.setData(maData);
    }

    // RSI Pane
    let rsiChart: IChartApi | null = null;
    if (showRSI && rsiContainerRef.current) {
        rsiChart = createChart(rsiContainerRef.current, {
            ...CHART_OPTIONS,
            width: rsiContainerRef.current.clientWidth,
            height: rsiContainerRef.current.clientHeight,
        });
        charts.push(rsiChart);
        const rsiSeries = (rsiChart as any).addLineSeries({ color: '#8b5cf6', lineWidth: 1.5 });
        rsiSeries.setData(rsiData);
    }

    // ADL Pane
    let adlChart: IChartApi | null = null;
    if (showADL && adlContainerRef.current) {
        adlChart = createChart(adlContainerRef.current, {
            ...CHART_OPTIONS,
            width: adlContainerRef.current.clientWidth,
            height: adlContainerRef.current.clientHeight,
        });
        charts.push(adlChart);
        const adlSeries = (adlChart as any).addLineSeries({ color: '#facc15', lineWidth: 1.5 });
        adlSeries.setData(adlData);
    }

    // ----- 3. SYNC LOGIC -----
    function syncTimeScales(source: IChartApi, targets: (IChartApi | null)[]) {
        source.timeScale().subscribeVisibleTimeRangeChange((range) => {
            if (!range) return;
            targets.forEach(target => {
                if (target && target !== source) {
                    target.timeScale().setVisibleRange(range);
                }
            });
        });
    }

    // Wire up symmetric sync
    syncTimeScales(mainChart, [rsiChart, adlChart]);
    if (rsiChart) syncTimeScales(rsiChart, [mainChart, adlChart]);
    if (adlChart) syncTimeScales(adlChart, [mainChart, rsiChart]);

    // Fit content initially
    mainChart.timeScale().fitContent();


    // ----- 4. RESIZE -----
    const handleResize = () => {
      if (chartContainerRef.current) mainChart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      if (showRSI && rsiContainerRef.current && rsiChart) rsiChart.applyOptions({ width: rsiContainerRef.current.clientWidth, height: rsiContainerRef.current.clientHeight });
      if (showADL && adlContainerRef.current && adlChart) adlChart.applyOptions({ width: adlContainerRef.current.clientWidth, height: adlContainerRef.current.clientHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      charts.forEach(c => c.remove());
    };
  }, [isOpen, chartData, showRSI, showADL, showMA]);

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
               {formatNumber(ticker.price)} <span className="text-emerald-500/70 ml-1">({ticker.percentChange}%)</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
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
