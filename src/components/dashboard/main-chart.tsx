'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { MainChartData, Ticker, ChartDataPoint } from '@/lib/types';
import { ChartConfig } from '@/components/ui/chart';
import { Button } from '../ui/button';
import { XIcon, Activity, Layers, Info, CandlestickChart, AreaChart as AreaChartIcon, Maximize2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getMainChartData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/format';
import FullChartDialog from './full-chart-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllTickers } from '@/lib/data';
import { Loader2 } from 'lucide-react';

const chartConfig = {
  value: {
    label: 'Price',
    color: 'hsl(var(--primary))',
  },
  ma: {
    label: 'Moving Average (20)',
    color: 'hsl(var(--warning, 45 93% 47%))',
  },
  rsi: {
    label: 'RSI (14)',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

// Simple Technical Indicators
const calculateMA = (data: ChartDataPoint[], period: number = 20) => {
  return data.map((d, i) => {
    if (i < period - 1) return { ...d, ma: null };
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, curr) => acc + curr.value, 0);
    return { ...d, ma: sum / period };
  });
};

const calculateRSI = (data: ChartDataPoint[], period: number = 14) => {
  return data.map((d, i) => {
    if (i < period) return { ...d, rsi: null };
    let gains = 0;
    let losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const change = data[j].value - data[j - 1].value;
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }
    const rs = gains / (losses || 1);
    const rsi = 100 - 100 / (1 + rs);
    return { ...d, rsi };
  });
};

const CustomTooltip = ({ active, payload, label, ticker, chartType }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const firstPoint = payload[0].chartData?.[0]?.value || data.value;
    const percentChange = ((data.value - firstPoint) / firstPoint) * 100;
    const isPositive = percentChange >= 0;

    return (
      <div className="rounded-xl border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {new Date(label).toLocaleString()}
        </p>
        <div className="space-y-1.5">
          {chartType === 'area' ? (
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">Price</span>
              <span className="font-code text-xs font-bold">
                {formatNumber(data.value, { style: 'currency', currency: ticker.currency || 'INR' })}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-8">
                <span className="text-xs text-muted-foreground">Open</span>
                <span className="font-code text-xs font-bold">{formatNumber(data.open)}</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span className="text-xs text-muted-foreground">High</span>
                <span className="font-code text-xs font-bold">{formatNumber(data.high)}</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span className="text-xs text-muted-foreground">Low</span>
                <span className="font-code text-xs font-bold">{formatNumber(data.low)}</span>
              </div>
              <div className="flex items-center justify-between gap-8 border-t pt-1 border-border/50">
                <span className="text-xs text-muted-foreground">Close</span>
                <span className="font-code text-xs font-bold">{formatNumber(data.close)}</span>
              </div>
            </>
          )}
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-muted-foreground">% Change</span>
            <span className={cn("font-code text-xs font-bold", isPositive ? 'text-up' : 'text-down')}>
              {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
            </span>
          </div>
          {data.volume && (
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">Volume</span>
              <span className="font-code text-xs font-bold">
                {formatNumber(data.volume, { notation: 'compact' })}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Custom Candlestick Component for Recharts
// Recharts passes y = pixel position of `close`, height = pixel distance from close to yDomain[0].
// We derive the full scale from those two anchors.
const Candlestick = (props: any) => {
  const { x, y, width, height, open, close, high, low, yDomain } = props;
  const isUp = close >= open;
  const color = isUp ? 'hsl(var(--up))' : 'hsl(var(--down))';

  // scale(val): price -> pixel y (higher price = smaller y = higher on screen)
  // y anchors close; y+height anchors yDomain[0]
  const denominator = close - (yDomain?.[0] ?? 0);
  const scale = (val: number) => {
    if (!denominator) return y;
    return y + height * (close - val) / denominator;
  };

  const openY = scale(open);
  const closeY = y; // scale(close) === y by definition
  const highY = scale(high);
  const lowY = scale(low);

  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.max(1, Math.abs(openY - closeY));
  const wickX = x + width / 2;

  return (
    <g>
      <line x1={wickX} y1={highY} x2={wickX} y2={lowY} stroke={color} strokeWidth={1} />
      <rect x={x} y={bodyTop} width={Math.max(1, width - 1)} height={bodyHeight} fill={color} />
    </g>
  );
};

export default function MainChart({
  ticker: initialTicker,
  chartData: initialChartData,
}: {
  ticker: Ticker;
  chartData: MainChartData;
}) {
  const allTickers = useMemo(() => getAllTickers(), []);
  const [currentTicker, setCurrentTicker] = useState<Ticker>(initialTicker);
  const [currentData, setCurrentData] = useState<MainChartData>(initialChartData);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const [timeframe, setTimeframe] = useState<keyof MainChartData>('1M');
  const [chartType, setChartType] = useState<'area' | 'candle'>('area');
  const [isFullChartOpen, setIsFullChartOpen] = useState(false);
  const [markers, setMarkers] = useState<string[]>([]);
  const [showMA, setShowMA] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [compareWith, setCompareWith] = useState<string[]>([]);
  const [compareToAdd, setCompareToAdd] = useState<string | undefined>(undefined);

  const handleStockChange = async (symbol: string) => {
    const newTicker = allTickers.find(t => t.symbol === symbol);
    if (!newTicker) return;
    setCurrentTicker(newTicker);
    setIsLoadingChart(true);
    try {
      const res = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}`, { cache: 'no-store' });
      const newData = await res.json();
      if (!newData.error) setCurrentData(newData);
    } catch {}
    setIsLoadingChart(false);
  };

  // Live refresh (no page reload) for the selected symbol.
  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    const pollMs =
      timeframe === '1D' ? 5000 :
      timeframe === '5D' ? 10000 :
      30000;

    const tick = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const res = await fetch(`/api/chart?symbol=${encodeURIComponent(currentTicker.symbol)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && !data?.error) setCurrentData(data);
      } catch {
      } finally {
        inFlight = false;
      }
    };

    tick();
    const id = setInterval(tick, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [currentTicker.symbol, timeframe]);

  const baseData = currentData[timeframe];
  
  const processedData = useMemo(() => {
    let data = [...baseData];
    
    if (showMA) data = calculateMA(data);
    if (showRSI) data = calculateRSI(data);
    
    compareWith.forEach(symbol => {
      const compData = getMainChartData(symbol)[timeframe];
      data = data.map((d, i) => ({
        ...d,
        [symbol]: compData[i]?.value || null
      }));
    });
    
    return data;
  }, [baseData, showMA, showRSI, compareWith, timeframe]);

  const annotations = useMemo(() => {
    if (timeframe === '1M' || timeframe === '6M' || timeframe === '1Y') {
      const midPoint = Math.floor(processedData.length / 3);
      const endPoint = Math.floor((processedData.length * 2) / 3);
      return [
        { date: processedData[midPoint]?.date, label: 'Budget Announcement' },
        { date: processedData[endPoint]?.date, label: 'Fed Rate Cut' },
      ].filter(a => !!a.date);
    }
    return [];
  }, [processedData, timeframe]);

  const yDomain = useMemo(() => {
    const values = processedData.flatMap(d => [
      d.value,
      d.high,
      d.low,
      ...(showMA && d.ma ? [d.ma] : []),
      ...compareWith.map(s => d[s] as number).filter(v => v !== null)
    ]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return [min * 0.98, max * 1.02];
  }, [processedData, showMA, compareWith]);

  const handleChartClick = (e: any) => {
    if (e && e.activeLabel) {
      if (!markers.includes(e.activeLabel)) {
        setMarkers([...markers, e.activeLabel]);
      }
    }
  };
  
  const clearMarkers = () => setMarkers([]);

  const toggleComparison = (symbol: string) => {
    setCompareWith(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const compareCandidates = useMemo(() => {
    return allTickers.filter(t => t.symbol !== currentTicker.symbol);
  }, [allTickers, currentTicker.symbol]);

  const handleAddComparison = (symbol: string) => {
    setCompareWith(prev => (prev.includes(symbol) ? prev : [...prev, symbol]));
    setCompareToAdd(undefined);
  };

  const removeComparison = (symbol: string) => {
    setCompareWith(prev => prev.filter(s => s !== symbol));
  };

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full overflow-hidden">
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Select value={currentTicker.symbol} onValueChange={handleStockChange}>
              <SelectTrigger className="w-[200px] border-none shadow-none focus:ring-0 p-0 h-auto font-bold text-xl bg-transparent">
                <SelectValue placeholder="Select Stock" />
              </SelectTrigger>
              <SelectContent>
                {allTickers.map((t) => (
                  <SelectItem key={t.symbol} value={t.symbol}>
                    {t.symbol} <span className="text-muted-foreground font-normal ml-2">{t.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingChart && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-secondary/50 p-1 mr-2">
                <Button 
                    variant={chartType === 'area' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-7 px-2"
                    onClick={() => setChartType('area')}
                >
                    <AreaChartIcon className="h-4 w-4 mr-1" />
                    Area
                </Button>
                <Button 
                    variant={chartType === 'candle' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-7 px-2"
                    onClick={() => setChartType('candle')}
                >
                    <CandlestickChart className="h-4 w-4 mr-1" />
                    Candle
                </Button>
            </div>
            {markers.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearMarkers}>
                <XIcon className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsFullChartOpen(true)}>
              <Maximize2 className="mr-2 h-4 w-4" />
              Full Chart
            </Button>
            <Tabs
              defaultValue="1M"
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as keyof MainChartData)}
              className="space-x-1"
            >
              <TabsList>
                {['1D', '5D', '1M', '6M', '1Y'].map(tf => (
                  <TabsTrigger key={tf} value={tf}>{tf}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 rounded-xl bg-secondary/30 p-3 text-xs">
          <div className="flex items-center gap-4 border-r pr-4 border-border/50">
            <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Layers className="h-3.5 w-3.5" /> Compare:
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add one or more tickers to compare.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={compareToAdd} onValueChange={handleAddComparison}>
                <SelectTrigger className="h-8 w-[220px]">
                  <SelectValue placeholder="Add ticker..." />
                </SelectTrigger>
                <SelectContent>
                  {compareCandidates
                    .filter(t => !compareWith.includes(t.symbol))
                    .map((t) => (
                      <SelectItem key={t.symbol} value={t.symbol}>
                        {t.symbol} <span className="text-muted-foreground font-normal ml-2">{t.name}</span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {compareWith.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-1 rounded-full border border-border/60 bg-background/50 px-2 py-1"
                >
                  <span className="font-medium">{s}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removeComparison(s)}
                    aria-label={`Remove ${s} comparison`}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Activity className="h-3.5 w-3.5" /> Indicators:
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Technical overlays for trend analysis.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <div className="flex gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="toggle-ma" 
                  checked={showMA}
                  onCheckedChange={(checked) => setShowMA(!!checked)}
                />
                <Label htmlFor="toggle-ma" className="cursor-pointer">MA (20)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="toggle-rsi" 
                  checked={showRSI}
                  onCheckedChange={(checked) => setShowRSI(!!checked)}
                />
                <Label htmlFor="toggle-rsi" className="cursor-pointer">RSI (14)</Label>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-[400px] pb-6">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full"
        >
          <ComposedChart
            data={processedData}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            onClick={handleChartClick}
          >
            <defs>
              <linearGradient id="mainChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return timeframe === '1D' 
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis
              yAxisId="price"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              orientation="right"
              domain={yDomain}
              tickFormatter={(value) => value.toLocaleString()}
            />
            
            {showRSI && (
              <YAxis
                yAxisId="rsi"
                orientation="left"
                domain={[0, 100]}
                hide={true}
              />
            )}

            <ChartTooltip
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={<CustomTooltip ticker={currentTicker} chartType={chartType} />}
            />

            {chartType === 'area' ? (
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="value"
                name={currentTicker.symbol}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#mainChartGradient)"
                dot={false}
              />
            ) : (
              <Bar
                yAxisId="price"
                dataKey="close"
                name={currentTicker.symbol}
                shape={(shapeProps: any) => <Candlestick {...shapeProps} yDomain={yDomain} />}
              />
            )}

            {showMA && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="ma"
                stroke={chartConfig.ma.color}
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="5 5"
              />
            )}

            {showRSI && (
              <Line
                yAxisId="rsi"
                type="monotone"
                dataKey="rsi"
                stroke={chartConfig.rsi.color}
                strokeWidth={1.5}
                dot={false}
              />
            )}

            {compareWith.map(symbol => (
              <Line
                key={symbol}
                yAxisId="price"
                type="monotone"
                dataKey={symbol}
                stroke={chartConfig[symbol as keyof typeof chartConfig]?.color || '#8884d8'}
                strokeWidth={1.5}
                dot={false}
              />
            ))}

            {markers.map(marker => (
              <ReferenceLine
                key={marker}
                x={marker}
                stroke="hsl(var(--foreground))"
                strokeWidth={1}
                strokeDasharray="4 4"
                yAxisId="price"
              />
            ))}

            {annotations.map((ann, idx) => (
              <ReferenceLine
                key={idx}
                x={ann.date}
                stroke="hsl(var(--muted-foreground))"
                strokeOpacity={0.5}
                strokeWidth={1}
                yAxisId="price"
                label={{
                  position: 'top',
                  value: ann.label,
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 10,
                  fontWeight: 600,
                  className: "bg-background/80"
                }}
              />
            ))}
          </ComposedChart>
        </ChartContainer>
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
