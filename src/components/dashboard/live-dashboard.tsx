'use client';

import { useEffect, useState } from 'react';
import type { ChartDataPoint, IndexData, VixData } from '@/lib/types';
import IndexCard from '@/components/dashboard/index-card';
import VixCard from '@/components/dashboard/vix-card';
import GlowPanel from '@/components/dashboard/glow-panel';

export default function LiveDashboard({
  initialIndices,
  initialVixData,
  initialVixChartData,
}: {
  initialIndices: IndexData[];
  initialVixData: VixData;
  initialVixChartData: ChartDataPoint[];
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

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {nifty50 && <GlowPanel><IndexCard index={nifty50} /></GlowPanel>}
      {sensex && <GlowPanel><IndexCard index={sensex} /></GlowPanel>}
      {bankNifty && <GlowPanel><IndexCard index={bankNifty} /></GlowPanel>}
      {vixData && <GlowPanel><VixCard vixData={vixData} chartData={vixChartData} /></GlowPanel>}
    </div>
  );
}

