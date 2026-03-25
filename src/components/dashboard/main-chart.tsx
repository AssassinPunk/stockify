'use client';

import { useState, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  Label as RechartsLabel,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { MainChartData, Ticker, ChartDataPoint } from '@/lib/types';
import { ChartConfig } from '@/components/ui/chart';
import { Button } from '../ui/button';
import { XIcon, Activity, Layers, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getMainChartData } from '@/lib/data';
import { cn } from '@/lib/utils';

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
  SENSEX: {
    label: 'SENSEX',
    color: '#ff7300',
  },
  'BANK NIFTY': {
    label: 'BANK NIFTY',
    color: '#387908',
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

export default function MainChart({
  ticker,
  chartData,
}: {
  ticker: Ticker;
  chartData: MainChartData;
}) {
  const [timeframe, setTimeframe] = useState<keyof MainChartData>('1M');
  const [markers, setMarkers] = useState<string[]>([]);
  const [showMA, setShowMA] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [compareWith, setCompareWith] = useState<string[]>([]);

  // Derived data based on timeframe and indicators
  const baseData = chartData[timeframe];
  
  const processedData = useMemo(() => {
    let data = [...baseData];
    
    // Add Indicators
    if (showMA) data = calculateMA(data);
    if (showRSI) data = calculateRSI(data);
    
    // Add Comparison Data
    compareWith.forEach(symbol => {
      const compData = getMainChartData(symbol)[timeframe];
      data = data.map((d, i) => ({
        ...d,
        [symbol]: compData[i]?.value || null
      }));
    });
    
    return data;
  }, [baseData, showMA, showRSI, compareWith, timeframe]);

  // Predefined Annotations for mock visualization
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
      ...(showMA && d.ma ? [d.ma] : []),
      ...compareWith.map(s => d[s] as number).filter(v => v !== null)
    ]);
    return [Math.min(...values) * 0.95, Math.max(...values) * 1.05];
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

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full overflow-hidden">
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">{ticker.symbol}</CardTitle>
            <CardDescription>{ticker.name}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {markers.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearMarkers}>
                <XIcon className="mr-2 h-4 w-4" />
                Clear Markers
              </Button>
            )}
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

        {/* Visual Controls Panel */}
        <div className="flex flex-wrap items-center gap-6 rounded-xl bg-secondary/30 p-3 text-xs">
          <div className="flex items-center gap-4 border-r pr-4 border-border/50">
            <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Layers className="h-3.5 w-3.5" /> Compare:
            </span>
            <div className="flex gap-3">
              {['SENSEX', 'BANK NIFTY'].map(s => (
                <div key={s} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`comp-${s}`} 
                    checked={compareWith.includes(s)}
                    onCheckedChange={() => toggleComparison(s)}
                  />
                  <Label htmlFor={`comp-${s}`} className="cursor-pointer">{s}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Activity className="h-3.5 w-3.5" /> Indicators:
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
          <AreaChart
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
              yId="price"
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
                yId="rsi"
                orientation="left"
                domain={[0, 100]}
                hide={true}
              />
            )}

            <ChartTooltip
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="rounded-xl border-border/50 bg-background/95 backdrop-blur-sm"
                />
              }
            />

            {/* Main Area */}
            <Area
              yId="price"
              type="monotone"
              dataKey="value"
              name={ticker.symbol}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#mainChartGradient)"
              dot={false}
            />

            {/* Indicator: Moving Average */}
            {showMA && (
              <Line
                yId="price"
                type="monotone"
                dataKey="ma"
                stroke={chartConfig.ma.color}
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="5 5"
              />
            )}

            {/* Indicator: RSI (Simple mapping to main area for "simple version") */}
            {showRSI && (
              <Line
                yId="rsi"
                type="monotone"
                dataKey="rsi"
                stroke={chartConfig.rsi.color}
                strokeWidth={1.5}
                dot={false}
              />
            )}

            {/* Comparison Lines */}
            {compareWith.map(symbol => (
              <Line
                key={symbol}
                yId="price"
                type="monotone"
                dataKey={symbol}
                stroke={chartConfig[symbol as keyof typeof chartConfig]?.color || '#8884d8'}
                strokeWidth={1.5}
                dot={false}
              />
            ))}

            {/* User Custom Markers */}
            {markers.map(marker => (
              <ReferenceLine
                key={marker}
                x={marker}
                stroke="hsl(var(--foreground))"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            {/* Auto Annotations */}
            {annotations.map((ann, idx) => (
              <ReferenceLine
                key={idx}
                x={ann.date}
                stroke="hsl(var(--muted-foreground))"
                strokeOpacity={0.5}
                strokeWidth={1}
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
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
