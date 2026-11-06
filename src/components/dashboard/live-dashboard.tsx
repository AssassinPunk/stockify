'use client';

import { useEffect, useState } from 'react';
import type { ChartDataPoint, IndexData, SectorData, VixData } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import { getRiskLevel } from '@/lib/vix';
import IndexCard from '@/components/dashboard/index-card';
import VixCard from '@/components/dashboard/vix-card';

// One sentence on today's market, built from the same values the cards below show.
function marketReading(nifty: IndexData | undefined, vix: VixData, sectors: SectorData[]) {
  if (!nifty || nifty.value <= 0) return 'Market data is unavailable right now. Please check back shortly.';

  const size = formatNumber(Math.abs(nifty.percentChange), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parts = [
    nifty.change === 0
      ? 'NIFTY 50 is unchanged from its previous close.'
      : `NIFTY 50 is ${nifty.change > 0 ? 'up' : 'down'} ${size}% from its previous close.`,
  ];
  if (sectors.length > 0) {
    const rising = sectors.filter((sector) => sector.change > 0).length;
    parts.push(`${rising} of ${sectors.length} sectors are up.`);
  }
  if (vix.value > 0) parts.push(`Expected volatility is ${getRiskLevel(vix.value).level.toLowerCase()}.`);
  return parts.join(' ');
}

export default function LiveDashboard({
  initialIndices,
  initialVixData,
  initialVixChartData,
  sectors,
}: {
  initialIndices: IndexData[];
  initialVixData: VixData;
  initialVixChartData: ChartDataPoint[];
  sectors: SectorData[];
}) {
  const [indices, setIndices] = useState<IndexData[]>(initialIndices);
  const [vixData, setVixData] = useState<VixData>(initialVixData);
  const [vixChartData, setVixChartData] = useState<ChartDataPoint[]>(initialVixChartData);

  // Indices: poll fast (small payload)
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch('/api/indices', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as IndexData[];
        if (!cancelled && Array.isArray(data) && data.length) setIndices(data);
      } catch {}
    };

    tick();
    const id = setInterval(tick, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // VIX: poll slightly slower (includes chart series)
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch('/api/vix', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { vixData: VixData; chartData: ChartDataPoint[] };
        if (cancelled || !data?.vixData) return;
        setVixData(data.vixData);
        if (Array.isArray(data.chartData) && data.chartData.length) setVixChartData(data.chartData);
      } catch {}
    };

    tick();
    const id = setInterval(tick, 10000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const nifty50 = indices.find(i => i.symbol === 'NIFTY 50');
  const sensex = indices.find(i => i.symbol === 'SENSEX');
  const bankNifty = indices.find(i => i.symbol === 'BANK NIFTY');
  const updated = nifty50 && nifty50.value > 0 ? nifty50.lastUpdated : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">India Markets</h1>
          <p className="mt-1 text-base text-foreground">{marketReading(nifty50, vixData, sectors)}</p>
        </div>
        {updated && <p className="text-sm tabular-nums text-muted-foreground">Updated {updated}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {nifty50 && <div className="col-span-2 xl:col-span-1"><IndexCard index={nifty50} lead /></div>}
        {sensex && <IndexCard index={sensex} />}
        {bankNifty && <IndexCard index={bankNifty} />}
        {vixData && <div className="col-span-2 xl:col-span-1"><VixCard vixData={vixData} chartData={vixChartData} /></div>}
      </div>
    </div>
  );
}
