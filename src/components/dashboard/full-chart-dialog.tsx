'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2, XIcon } from 'lucide-react';
import { Ticker, MainChartData } from '@/lib/types';
import { formatNumber } from '@/lib/format';

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
  const [chartInstance, setChartInstance] = useState<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || !chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid' as any, color: 'transparent' },
        textColor: '#888',
      },
      grid: {
        vertLines: { color: '#333' },
        horzLines: { color: '#333' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // Format data for lightweight-charts
    const data = chartData['1M'].map(d => ({
        time: (new Date(d.date).getTime() / 1000) as any,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
    })).sort((a, b) => (a.time as number) - (b.time as number)); // Needs to be chronological

    // Simulate "candles forming" by feeding them in over time
    const initialData = data.slice(0, Math.max(10, data.length - 20));
    const remainingData = data.slice(Math.max(10, data.length - 20));

    candlestickSeries.setData(initialData);

    chart.timeScale().fitContent();

    setChartInstance(chart);
    candlestickSeriesRef.current = candlestickSeries;

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < remainingData.length) {
        candlestickSeries.update(remainingData[idx]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
           width: chartContainerRef.current.clientWidth,
           height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [isOpen, chartData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] rounded-2xl bg-[#131722] border-border/10 p-0 flex flex-col overflow-hidden">
        <DialogTitle className="sr-only">Full Chart</DialogTitle>
        <DialogDescription className="sr-only">Detailed stock analysis chart</DialogDescription>
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1e222d]">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">{ticker.symbol}</h2>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-sm font-medium text-emerald-400">
               {formatNumber(ticker.price)} <span className="text-emerald-500/70 ml-1">({ticker.percentChange}%)</span>
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/10 hover:text-white rounded-xl">
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Chart Container */}
        <div className="flex-1 w-full bg-[#131722] overflow-hidden" ref={chartContainerRef} style={{cursor: "crosshair"}} />
      </DialogContent>
    </Dialog>
  );
}
