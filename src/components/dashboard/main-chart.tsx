'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { MainChartData, Ticker } from '@/lib/types';
import { ChartConfig } from '@/components/ui/chart';
import { Button } from '../ui/button';
import { XIcon } from 'lucide-react';

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function MainChart({
  ticker,
  chartData,
}: {
  ticker: Ticker;
  chartData: MainChartData;
}) {
  const [timeframe, setTimeframe] = useState<keyof MainChartData>('1M');
  const [markers, setMarkers] = useState<string[]>([]);

  const data = chartData[timeframe];
  const yDomain = [
    Math.min(...data.map(d => d.value)) * 0.98,
    Math.max(...data.map(d => d.value)) * 1.02,
  ];

  const handleChartClick = (e: any) => {
    if (e && e.activeLabel) {
      if (!markers.includes(e.activeLabel)) {
        setMarkers([...markers, e.activeLabel]);
      }
    }
  };
  
  const clearMarkers = () => {
    setMarkers([]);
  }

  const chartLabel = ticker.symbol === 'NIFTY 50' ? 'NIFTY 50' : ticker.name;

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full">
      <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{ticker.symbol}</CardTitle>
          <CardDescription>{chartLabel}</CardDescription>
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
            onValueChange={(value) => setTimeframe(value as keyof MainChartData)}
            className="space-x-1"
          >
            <TabsList>
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="5D">5D</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="6M">6M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ChartContainer
          config={{
            ...chartConfig,
            [ticker.symbol]: {
              label: ticker.symbol,
              color: 'hsl(var(--primary))',
            },
          }}
          className="h-full w-full"
        >
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            onClick={handleChartClick}
          >
            <defs>
              <linearGradient id="mainChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              orientation="right"
              domain={yDomain}
            />
            <ChartTooltip
              cursor={{
                stroke: 'hsl(var(--primary))',
                strokeWidth: 1,
                strokeDasharray: '3 3',
              }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelClassName="font-bold font-code"
                  className="rounded-lg border-border/50 bg-background/95 backdrop-blur-sm"
                />
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#mainChartGradient)"
              dot={false}
            />
            {markers.map(marker => (
              <ReferenceLine
                key={marker}
                x={marker}
                stroke="hsl(var(--foreground))"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
