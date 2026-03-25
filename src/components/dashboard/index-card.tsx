import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatChange, formatNumber } from "@/lib/format";
import type { IndexData } from "@/lib/types";
import { ArrowDown, ArrowUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function IndexCard({ index }: { index: IndexData }) {
  const isPositive = index.change >= 0;
  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 transition-all hover:shadow-black/20 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          {index.symbol}
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Major market index representing the performance of a group of stocks.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        {isPositive ? (
          <ArrowUp className="h-4 w-4 text-up" />
        ) : (
          <ArrowDown className="h-4 w-4 text-down" />
        )}
      </CardHeader>
      <CardContent>
        <div className="font-code text-2xl font-bold">
          {formatNumber(index.value, { minimumFractionDigits: 2 })}
        </div>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <p className={cn("font-code text-xs cursor-default", isPositive ? 'text-up' : 'text-down')}>
                {formatChange(index.change, index.percentChange)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPositive ? "Upward market momentum" : "Downward market pressure"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}