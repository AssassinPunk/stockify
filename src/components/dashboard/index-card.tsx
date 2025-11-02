import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatChange, formatNumber } from "@/lib/format";
import type { IndexData } from "@/lib/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function IndexCard({ index }: { index: IndexData }) {
  const isPositive = index.change >= 0;
  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 transition-all hover:shadow-black/20 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{index.symbol}</CardTitle>
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
        <p className={cn("font-code text-xs", isPositive ? 'text-up' : 'text-down')}>
          {formatChange(index.change, index.percentChange)}
        </p>
      </CardContent>
    </Card>
  );
}
