import { ArrowDown, ArrowUp } from 'lucide-react';
import VixGauge from '@/components/dashboard/vix-gauge';
import { formatChange, formatNumber } from '@/lib/format';
import type { ChartDataPoint, IndexData, SectorData, VixData } from '@/lib/types';
import { getRiskLevel } from '@/lib/vix';

const money = (value: number) => formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function IndexTile({ index }: { index: IndexData }) {
  const up = index.change >= 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <div className="ui-panel ui-tile">
      <div className="ui-row">
        <span className="ui-label">{index.symbol}</span>
        <Icon className={up ? 'ui-up' : 'ui-down'} aria-hidden="true" />
      </div>
      {index.value > 0 ? (
        <>
          <strong className="ui-value">{money(index.value)}</strong>
          <span className={up ? 'ui-up' : 'ui-down'}>{formatChange(index.change, index.percentChange)}</span>
        </>
      ) : (
        <span className="ui-label">Data unavailable</span>
      )}
    </div>
  );
}

function Candles({ data }: { data: ChartDataPoint[] }) {
  const points = data.filter((d) => d.high > 0 && d.low > 0).slice(-24);
  if (points.length < 2) return <p className="ui-label ui-empty">Chart data unavailable</p>;

  const W = 800;
  const H = 300;
  const AXIS = 76;
  const high = Math.max(...points.map((p) => p.high));
  const low = Math.min(...points.map((p) => p.low));
  const y = (value: number) => 12 + ((high - value) / (high - low || 1)) * (H - 24);
  const step = (W - AXIS) / points.length;
  const ticks = [high, (high + low) / 2, low];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="ui-chart" role="img" aria-label={`NIFTY 50 daily candles for the last ${points.length} sessions`}>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1="0" x2={W - AXIS} y1={y(tick)} y2={y(tick)} className="ui-grid" />
          <text x={W - AXIS + 8} y={y(tick) + 5} className="ui-axis">{Math.round(tick).toLocaleString('en-IN')}</text>
        </g>
      ))}
      {points.map((p, i) => {
        const x = step * i + step / 2;
        const up = p.close >= p.open;
        const top = y(Math.max(p.open, p.close));
        return (
          <g key={p.date} className={up ? 'ui-candle-up' : 'ui-candle-down'}>
            <line x1={x} x2={x} y1={y(p.high)} y2={y(p.low)} />
            <rect x={x - step * 0.32} y={top} width={step * 0.64} height={Math.max(2, y(Math.min(p.open, p.close)) - top)} />
          </g>
        );
      })}
    </svg>
  );
}

export default function ProductFragment({
  indices,
  vix,
  candles,
  sectors,
}: {
  indices: IndexData[];
  vix: VixData;
  candles: ChartDataPoint[];
  sectors: SectorData[];
}) {
  const risk = getRiskLevel(vix.value);
  const updated = indices.find((index) => index.value > 0)?.lastUpdated;

  return (
    <div className="product" data-ui>
      <div className="product-indices">
        {indices.map((index) => <IndexTile key={index.symbol} index={index} />)}
        <div className="ui-panel ui-tile ui-vix">
          <div className="ui-row">
            <span className="ui-label">India VIX</span>
            <span className="ui-risk">{risk.level}</span>
          </div>
          <div className="ui-vix-body">
            <strong className="ui-value">{vix.value > 0 ? money(vix.value) : 'Unavailable'}</strong>
            <div className="ui-gauge"><VixGauge value={vix.value} size="sm" /></div>
          </div>
        </div>
      </div>
      <div className="product-main">
        <div className="ui-panel ui-chart-panel">
          <div className="ui-row">
            <strong>NIFTY 50</strong>
            <span className="ui-chips" aria-hidden="true">
              <span>Area</span><span className="is-on">Candle</span><span>1D</span><span>5D</span><span className="is-on">1M</span><span>6M</span><span>1Y</span>
            </span>
          </div>
          <Candles data={candles} />
          {updated && <span className="ui-label">Last updated {updated}</span>}
        </div>
        <div className="product-side">
          <div className="ui-panel">
            <strong>Sector Heatmap</strong>
            <ul className="ui-sectors">
              {sectors.slice(0, 6).map((sector) => (
                <li key={sector.name} className={sector.change >= 0 ? 'is-up' : 'is-down'}>
                  <span>{sector.name.replace(/^Nifty\s+/i, '')}</span>
                  <b>{sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%</b>
                </li>
              ))}
            </ul>
          </div>
          <FinPilotSnippet />
        </div>
      </div>
    </div>
  );
}

export function FinPilotSnippet() {
  return (
    <div className="ui-panel ui-pilot" data-ui>
      <div className="ui-row">
        <strong>FinPilot</strong>
        <span className="ui-label">Concept preview</span>
      </div>
      <p className="ui-ask">What would a ₹12 lakh car cost me each month?</p>
      <p className="ui-answer">With 20% down over 5 years at an illustrative 9% p.a., the EMI is about ₹19,928.</p>
    </div>
  );
}

export function MarketSnippet({ indices }: { indices: IndexData[] }) {
  const nifty = indices.find((index) => index.symbol === 'NIFTY 50') ?? indices[0];
  return <div className="ui-snippet" data-ui>{nifty && <IndexTile index={nifty} />}</div>;
}
