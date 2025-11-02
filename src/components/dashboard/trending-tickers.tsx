import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import type { Ticker, TrendingData } from "@/lib/types";
import { cn } from "@/lib/utils";

const TickerTable = ({ tickers, type }: { tickers: Ticker[], type: 'gainer' | 'loser' }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">% Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickers.map((ticker) => (
          <TableRow key={ticker.symbol}>
            <TableCell className="font-medium">{ticker.symbol}</TableCell>
            <TableCell className="text-right font-code">{formatNumber(ticker.price, {style: 'currency', currency: 'INR', minimumFractionDigits: 2})}</TableCell>
            <TableCell className={cn("text-right font-code", type === 'gainer' ? 'text-up' : 'text-down')}>
              {ticker.percentChange > 0 ? '+' : ''}{ticker.percentChange.toFixed(2)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default function TrendingTickers({ trending }: { trending: TrendingData }) {
  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full">
      <CardHeader>
        <CardTitle>Trending Tickers</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="gainers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
          </TabsList>
          <TabsContent value="gainers" className="mt-4">
            <TickerTable tickers={trending.gainers} type="gainer" />
          </TabsContent>
          <TabsContent value="losers" className="mt-4">
            <TickerTable tickers={trending.losers} type="loser" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
