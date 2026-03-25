'use client';
import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/format";
import type { VixData, ChartDataPoint } from "@/lib/types";
import { calculateVixMoves, getRiskLevel } from "@/lib/vix";
import { Info, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { explainIndiaVIX, ExplainIndiaVIXOutput } from "@/ai/flows/explain-india-vix-insights";

export default function VixCard({ vixData, chartData }: { vixData: VixData; chartData: ChartDataPoint[] }) {
  const moves = calculateVixMoves(vixData.value);
  const risk = getRiskLevel(vixData.value);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (explanation) return;
    setIsLoading(true);
    try {
      const result = await explainIndiaVIX({
        vixValue: vixData.value,
        dailyMove: moves.daily,
        weeklyMove: moves.weekly,
        monthlyMove: moves.monthly,
        yearlyMove: moves.yearly,
      });
      setExplanation(result.explanation);
    } catch (error) {
      console.error("Failed to fetch VIX explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 transition-all hover:shadow-black/20 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            INDIA VIX
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">India VIX measures market's expectation of volatility over the next 30 days. High VIX usually means high fear/uncertainty.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] h-5", risk.color)}>
              <ShieldAlert className="mr-1 h-3 w-3" />
              {risk.level} Risk
            </Badge>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={handleExplain}>
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">AI Insight</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                VIX Analysis
              </DialogTitle>
              <DialogDescription>
                AI-generated insight for the current market volatility.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Analyzing market moves...</p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert">
                  {explanation ? (
                    <p className="text-sm leading-relaxed">{explanation}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Click the button to generate a beginner-friendly analysis.</p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="font-code text-2xl font-bold cursor-default">
                {formatNumber(vixData.value, { minimumFractionDigits: 2 })}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{vixData.value < 15 ? "Low VIX = Stable market environment" : "Elevated VIX = Expect wider price swings"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mt-2 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                 <linearGradient id="vixGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <RechartsTooltip
                cursor={false}
                contentStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--muted-foreground))" strokeWidth={2} fill="url(#vixGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Object.entries(moves).map(([period, value]) => (
            <TooltipProvider key={period}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="cursor-default text-xs font-code rounded-full bg-secondary px-2 py-1">
                    <span className="capitalize text-muted-foreground">{period.slice(0, 1)}: </span>
                    <span className="font-semibold">
                      ±{formatNumber(value, { minimumFractionDigits: 2 })}%
                    </span>
                  </div>
                </TooltipTrigger>
                 <TooltipContent>
                    <p>Statistically likely range the market might move in a {period}.</p>
                 </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}