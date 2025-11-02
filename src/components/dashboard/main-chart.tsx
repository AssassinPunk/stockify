"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MainChartData } from "@/lib/types";
import { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "NIFTY 50",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function MainChart({ chartData }: { chartData: MainChartData }) {
  const [timeframe, setTimeframe] = useState<keyof MainChartData>("1M");

  const data = chartData[timeframe];

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full">
      <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>NIFTY 50</CardTitle>
          <CardDescription>Interactive Chart</CardDescription>
        </div>
        <Tabs defaultValue="1M" onValueChange={(value) => setTimeframe(value as keyof MainChartData)} className="space-x-1">
          <TabsList>
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="5D">5D</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="6M">6M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mainChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} orientation="right" domain={['dataMin - 100', 'dataMax + 100']} />
              <ChartTooltip
                cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "3 3" }}
                content={<ChartTooltipContent
                  indicator="dot"
                  labelClassName="font-bold font-code"
                  className="rounded-lg border-border/50 bg-background/95 backdrop-blur-sm"
                  />}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#mainChartGradient)" dot={false} />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
