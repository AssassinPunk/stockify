'use client';

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { BacktestResult } from '@/app/api/backtest/route';
import { money, monthTick, monthYear } from '@/lib/backtest-format';

const GRID = 'hsl(var(--border))';
const TICK = { fill: 'hsl(var(--muted-foreground))', fontSize: 12 };
const UP = 'hsl(var(--up))';
const DOWN = 'hsl(var(--down))';
const BENCHMARK = '#fbbf24';
const INVESTED = 'hsl(var(--muted-foreground))';

function TooltipBox({ title, rows }: { title: string; rows: { name: string; color: string; value: string }[] }) {
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs">
      <p className="mb-1 font-medium">{title}</p>
      {rows.map(row => (
        <p key={row.name} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-0.5 w-3" style={{ background: row.color }} aria-hidden="true" />
            {row.name}
          </span>
          <span className="font-medium tabular-nums">{row.value}</span>
        </p>
      ))}
    </div>
  );
}

// Each swatch is the line it explains, scaled down.
export function ValueChartLegend({ result }: { result: BacktestResult }) {
  const gained = result.finalValue >= result.totalInvested;
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-0.5 w-4" style={{ background: gained ? UP : DOWN }} />{result.symbol}</li>
      <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-0.5 w-4" style={{ background: BENCHMARK }} />{result.benchmark.symbol}</li>
      <li className="flex items-center gap-1.5"><span aria-hidden="true" className="w-4 border-t border-dashed" style={{ borderColor: INVESTED }} />Invested</li>
    </ul>
  );
}

export function ValueChart({ result }: { result: BacktestResult }) {
  const color = result.finalValue >= result.totalInvested ? UP : DOWN;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={result.timeline} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="date" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} tickFormatter={monthTick} minTickGap={40} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={72} tickFormatter={value => money(value, result.currency)} tickCount={5} />
        <Tooltip
          cursor={{ stroke: 'hsl(var(--muted-foreground))' }}
          content={({ active, payload, label }) => (active && payload?.length ? (
            <TooltipBox
              title={monthYear(String(label))}
              rows={payload.map(item => ({ name: String(item.name), color: String(item.color), value: money(Number(item.value), result.currency) }))}
            />
          ) : null)}
        />
        <Area type="linear" dataKey="invested" name="Invested" stroke={INVESTED} strokeWidth={1.5} strokeDasharray="4 3" fill="none" dot={false} isAnimationActive={false} />
        <Area type="linear" dataKey="benchValue" name={result.benchmark.symbol} stroke={BENCHMARK} strokeWidth={1.5} fill="none" dot={false} isAnimationActive={false} />
        <Area type="linear" dataKey="value" name={result.symbol} stroke={color} strokeWidth={2} fill={color} fillOpacity={0.08} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function GrowthChart({ result }: { result: BacktestResult }) {
  // The same month-over-month figure the page has always drawn.
  const data = result.timeline.slice(1).map((point, index) => ({
    date: point.date,
    change: ((point.value - result.timeline[index].value) / result.timeline[index].value) * 100,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="date" tick={TICK} tickLine={false} axisLine={false} tickFormatter={monthTick} minTickGap={40} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={72} tickFormatter={value => `${Number(value).toFixed(0)}%`} tickCount={5} />
        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          cursor={{ fill: 'hsl(var(--secondary))', fillOpacity: 0.5 }}
          content={({ active, payload, label }) => (active && payload?.length ? (
            <TooltipBox
              title={monthYear(String(label))}
              rows={[{ name: 'Monthly Return', color: Number(payload[0].value) >= 0 ? UP : DOWN, value: `${Number(payload[0].value).toFixed(2)}%` }]}
            />
          ) : null)}
        />
        <Bar dataKey="change" isAnimationActive={false}>
          {data.map(item => <Cell key={item.date} fill={item.change >= 0 ? UP : DOWN} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
