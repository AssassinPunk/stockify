'use client';

import { useEffect, useState } from 'react';
import { formatNumber } from '@/lib/format';
import { INDEX_MEANINGS } from '@/lib/index-meanings';
import type { IndexData, VixData } from '@/lib/types';
import { calculateVixMoves, getRiskLevel } from '@/lib/vix';

const POLL_MS = 30_000;

function Change({ percent }: { percent?: number }) {
  if (percent === undefined || !Number.isFinite(percent)) return <p className="snap-change">No change data</p>;
  const up = percent >= 0;
  return (
    <p className={`snap-change ${up ? 'is-up' : 'is-down'}`}>
      <span aria-hidden="true">{up ? '▲' : '▼'}</span>
      {up ? '+' : '-'}{formatNumber(Math.abs(percent), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
    </p>
  );
}

export default function MarketSnapshot({
  initialIndices,
  initialVix,
  vixPreviousClose,
}: {
  initialIndices: IndexData[];
  initialVix: VixData;
  vixPreviousClose?: number;
}) {
  const [indices, setIndices] = useState(initialIndices);
  const [vix, setVix] = useState(initialVix);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      if (document.hidden) return;
      try {
        const [indexRes, vixRes] = await Promise.all([
          fetch('/api/indices', { cache: 'no-store' }),
          fetch('/api/vix', { cache: 'no-store' }),
        ]);
        if (indexRes.ok) {
          const data = (await indexRes.json()) as IndexData[];
          if (!cancelled && Array.isArray(data) && data.length) setIndices(data);
        }
        if (vixRes.ok) {
          const data = (await vixRes.json()) as { vixData?: VixData };
          if (!cancelled && data?.vixData) setVix(data.vixData);
        }
      } catch {
        // Keep the last values; the timestamp shows how old they are.
      }
    };
    const id = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const available = indices.some((index) => index.value > 0);
  const updated = indices.find((index) => index.value > 0)?.lastUpdated;
  const risk = getRiskLevel(vix.value);
  const vixPercent = vixPreviousClose ? ((vix.value - vixPreviousClose) / vixPreviousClose) * 100 : undefined;
  const dailyMove = formatNumber(calculateVixMoves(vix.value).daily, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <div className="band-head">
        <h2 id="markets-title" data-reveal>The market, in plain words</h2>
        <p className="lede" data-reveal>
          {available
            ? `Market data from Stockify's feed, last updated ${updated}. It may be delayed, and it is refreshed while this page is open.`
            : 'Market data is unavailable right now. Please check back shortly.'}
        </p>
      </div>
      <ul className="snapshot">
        {indices.map((index) => (
          <li key={index.symbol} data-reveal>
            <div className="snap-name">
              <h3>{index.symbol}</h3>
              <p>{INDEX_MEANINGS[index.symbol]}</p>
            </div>
            <p className="snap-value">{index.value > 0 ? formatNumber(index.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Unavailable'}</p>
            {index.value > 0 ? <Change percent={index.percentChange} /> : <p className="snap-change">No data</p>}
          </li>
        ))}
        <li data-reveal>
          <div className="snap-name">
            <h3>India VIX</h3>
            <p>
              {vix.value > 0
                ? `Expected market volatility, currently ${risk.level.toLowerCase()}. This level implies a daily move of about ±${dailyMove}%.`
                : 'Expected market volatility over the next 30 days.'}
            </p>
          </div>
          <p className="snap-value is-risk">{vix.value > 0 ? formatNumber(vix.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Unavailable'}</p>
          {vix.value > 0 ? <Change percent={vixPercent} /> : <p className="snap-change">No data</p>}
        </li>
      </ul>
    </>
  );
}
