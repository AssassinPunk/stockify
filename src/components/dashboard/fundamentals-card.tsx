'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type FundamentalsData = {
  marketCap: number | null;
  trailingPE: number | null;
  forwardPE: number | null;
  eps: number | null;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  beta: number | null;
};

function formatMetric(
  val: number | null,
  type: 'number' | 'percent' | 'cap' | 'price',
  currency = 'INR',
): string {
  if (val === null || val === undefined) return '—';
  switch (type) {
    case 'percent':
      return `${(val * 100).toFixed(2)}%`;
    case 'cap': {
      const sym = currency === 'INR' ? '₹' : '$';
      if (currency === 'INR') {
        const cr = val / 1e7;
        if (cr >= 1e5) return `${sym}${(cr / 1e5).toFixed(2)} L Cr`;
        return `${sym}${Math.round(cr).toLocaleString('en-IN')} Cr`;
      }
      if (val >= 1e12) return `${sym}${(val / 1e12).toFixed(2)}T`;
      if (val >= 1e9) return `${sym}${(val / 1e9).toFixed(2)}B`;
      return `${sym}${(val / 1e6).toFixed(2)}M`;
    }
    case 'price': {
      const sym = currency === 'INR' ? '₹' : '$';
      return `${sym}${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    default:
      return val.toFixed(2);
  }
}

export default function FundamentalsCard({
  symbol,
  currency = 'INR',
}: {
  symbol: string;
  currency?: string;
}) {
  const [data, setData] = useState<FundamentalsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/fundamentals?symbol=${encodeURIComponent(symbol)}`)
      .then(r => r.json())
      .then(d => { if (!d.error) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [symbol]);

  const metrics: { label: string; value: number | null; type: 'number' | 'percent' | 'cap' | 'price' }[] = [
    { label: 'Market Cap',   value: data?.marketCap ?? null,       type: 'cap'     },
    { label: 'P/E (TTM)',    value: data?.trailingPE ?? null,      type: 'number'  },
    { label: 'Fwd P/E',     value: data?.forwardPE ?? null,       type: 'number'  },
    { label: 'EPS (TTM)',    value: data?.eps ?? null,             type: 'price'   },
    { label: '52W High',     value: data?.fiftyTwoWeekHigh ?? null,type: 'price'   },
    { label: '52W Low',      value: data?.fiftyTwoWeekLow ?? null, type: 'price'   },
    { label: 'Beta',         value: data?.beta ?? null,            type: 'number'  },
    { label: 'Div. Yield',   value: data?.dividendYield ?? null,   type: 'percent' },
  ];

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Key Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {metrics.map(({ label, value, type }) => (
            <div key={label}>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              {loading ? (
                <Skeleton className="mt-1.5 h-5 w-20" />
              ) : (
                <p className="mt-1 font-mono text-sm font-semibold">
                  {formatMetric(value, type, currency)}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
