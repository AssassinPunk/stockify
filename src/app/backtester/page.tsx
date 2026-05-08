'use client';

import { useState } from 'react';
import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { FlaskConical, TrendingUp, TrendingDown, IndianRupee, DollarSign, Trophy, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllTickers } from '@/lib/data';
import type { BacktestResult } from '../api/backtest/route';

// ── Ticker lists ─────────────────────────────────────────────────────────────
const allTickers = getAllTickers().filter(t => !t.isIndex);
const indiaTickers = allTickers.filter(t => t.currency === 'INR');
const intlTickers  = allTickers.filter(t => t.currency === 'USD');

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(val: number, currency: string) {
  if (currency === 'INR') {
    if (val >= 1_00_00_000) return `₹${(val / 1_00_00_000).toFixed(2)} Cr`;
    if (val >= 1_00_000)    return `₹${(val / 1_00_000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000)     return `$${(val / 1_000).toFixed(2)}K`;
  return `$${val.toFixed(2)}`;
}

function pct(val: number) {
  return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
}

// ── Stat card ────────────────────────────────────────────────────────────────
function Stat({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-medium">{label}</p>
      <p className={cn(
        'text-xl font-mono font-bold',
        positive === true  && 'text-emerald-400',
        positive === false && 'text-red-400',
      )}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, currency }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm p-3 text-xs shadow-xl">
      <p className="font-semibold mb-2 text-foreground/80">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-mono font-semibold">{fmt(p.value, currency)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function BacktesterPage() {
  const [symbol,      setSymbol]      = useState('RELIANCE');
  const [amountStr,   setAmountStr]   = useState('10000');
  const amount = parseFloat(amountStr) || 0;
  const [type,     setType]     = useState<'sip' | 'lumpsum'>('sip');
  const [period,   setPeriod]   = useState('3Y');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const [result,  setResult]  = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // When currency changes, reset to first ticker in that currency
  const handleCurrency = (c: 'INR' | 'USD') => {
    setCurrency(c);
    setSymbol(c === 'INR' ? indiaTickers[0].symbol : intlTickers[0].symbol);
    setAmountStr(c === 'INR' ? '10000' : '500');
    setResult(null);
  };

  const run = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res  = await fetch(
        `/api/backtest?symbol=${encodeURIComponent(symbol)}&amount=${amount}&type=${type}&period=${period}&currency=${currency}`,
        { cache: 'no-store' },
      );
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResult(json);
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const tickers = currency === 'INR' ? indiaTickers : intlTickers;
  const CurrIcon = currency === 'INR' ? IndianRupee : DollarSign;
  const beatsBench = result ? result.totalReturn > result.benchmark.totalReturn : false;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">

        {/* Page header */}
        <div className="flex items-center gap-2.5">
          <FlaskConical className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold leading-none">&ldquo;What If&rdquo; Backtester</h1>
            <p className="text-xs text-muted-foreground mt-1">Simulate SIP or lump sum investments using real historical price data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* ── Input form ────────────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Configure Backtest</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">

                {/* Currency */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-medium">Market</label>
                  <div className="flex rounded-lg bg-secondary/50 p-0.5 gap-0.5">
                    {(['INR', 'USD'] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => handleCurrency(c)}
                        className={cn(
                          'flex-1 rounded-md py-1.5 text-xs font-semibold transition-all',
                          currency === c ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {c === 'INR' ? '🇮🇳 India' : '🇺🇸 US'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock selector */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-medium">Stock</label>
                  <Select value={symbol} onValueChange={v => { setSymbol(v); setResult(null); }}>
                    <SelectTrigger className="h-9 text-xs">
                      <span>{symbol} — {tickers.find(t => t.symbol === symbol)?.name}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {tickers.map(t => (
                        <SelectItem key={t.symbol} value={t.symbol}>
                          <span className="font-mono font-semibold">{t.symbol}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{t.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Investment type */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-medium">Investment Type</label>
                  <div className="flex rounded-lg bg-secondary/50 p-0.5 gap-0.5">
                    {([['sip', 'Monthly SIP'], ['lumpsum', 'Lump Sum']] as const).map(([v, l]) => (
                      <button
                        key={v}
                        onClick={() => { setType(v); setResult(null); }}
                        className={cn(
                          'flex-1 rounded-md py-1.5 text-xs font-semibold transition-all',
                          type === v ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-medium">
                    {type === 'sip' ? 'Monthly Amount' : 'One-Time Amount'} ({currency})
                  </label>
                  <div className="relative">
                    <CurrIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={amountStr}
                      placeholder="0"
                      onChange={e => {
                        const v = e.target.value;
                        if (/^\d*$/.test(v)) { setAmountStr(v); setResult(null); }
                      }}
                      onBlur={() => { if (!amountStr) setAmountStr(''); }}
                      className="pl-8 h-9 text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Period */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-medium">Period</label>
                  <div className="flex gap-1">
                    {['1Y', '2Y', '3Y', '5Y'].map(p => (
                      <button
                        key={p}
                        onClick={() => { setPeriod(p); setResult(null); }}
                        className={cn(
                          'flex-1 rounded-lg py-1.5 text-xs font-bold transition-all border',
                          period === p
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'border-border/40 text-muted-foreground hover:text-foreground hover:border-border',
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={run}
                  disabled={loading}
                  className="w-full gap-2"
                >
                  <FlaskConical className={cn('h-4 w-4', loading && 'animate-pulse')} />
                  {loading ? 'Running simulation…' : 'Run Backtest'}
                </Button>

                {error && (
                  <p className="text-xs text-red-400 rounded-lg bg-red-500/10 border border-red-500/20 p-3">{error}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Results panel ─────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">

            {!result && !loading && (
              <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-2xl border border-border/40 bg-card/40 text-muted-foreground">
                <FlaskConical className="h-12 w-12 opacity-20" />
                <p className="text-sm">Configure your backtest and click Run</p>
                <p className="text-xs opacity-60">Uses real monthly price data from Yahoo Finance</p>
              </div>
            )}

            {loading && (
              <div className="flex h-96 flex-col items-center justify-center gap-3">
                <div className="flex gap-1.5">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="h-2 w-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i*0.15}s` }} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Fetching historical data &amp; running simulation…</p>
              </div>
            )}

            {result && (
              <>
                {/* Summary stats */}
                <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>
                        {result.type === 'sip' ? 'Monthly SIP' : 'Lump Sum'} in {result.symbol} — {result.period}
                      </span>
                      <span className={cn(
                        'flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 border',
                        beatsBench
                          ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25'
                          : 'text-red-400 bg-red-400/10 border-red-400/25',
                      )}>
                        {beatsBench ? <Trophy className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        {beatsBench ? `Beat ${result.benchmark.symbol}` : `Trailed ${result.benchmark.symbol}`}
                        {' '}by {Math.abs(result.totalReturn - result.benchmark.totalReturn).toFixed(1)}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <Stat label="Total Invested"  value={fmt(result.totalInvested, result.currency)} />
                      <Stat label="Current Value"   value={fmt(result.finalValue, result.currency)}
                        positive={result.finalValue >= result.totalInvested} />
                      <Stat label="Total Return"    value={pct(result.totalReturn)}
                        positive={result.totalReturn >= 0}
                        sub={`CAGR ${pct(result.cagr)}`} />
                      <Stat label={`vs ${result.benchmark.symbol}`} value={pct(result.benchmark.totalReturn)}
                        positive={result.benchmark.totalReturn >= 0}
                        sub={`CAGR ${pct(result.benchmark.cagr)}`} />
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <Stat label={result.type === 'sip' ? `${result.period} SIP Total` : 'Deployed'}
                        value={result.type === 'sip'
                          ? `${result.timeline.length}× ${fmt(amount, result.currency)}`
                          : `1× ${fmt(amount, result.currency)}`} />
                      <Stat label="Gain / Loss"
                        value={fmt(result.finalValue - result.totalInvested, result.currency)}
                        positive={result.finalValue >= result.totalInvested} />
                      <Stat label="Best Month"  value={pct(result.bestMonth)}  positive />
                      <Stat label="Worst Month" value={pct(result.worstMonth)} positive={false} />
                    </div>
                  </CardContent>
                </Card>

                {/* Comparison chart */}
                <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Portfolio Value vs Benchmark</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={result.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradPortfolio" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02}/>
                          </linearGradient>
                          <linearGradient id="gradBench" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: '#555', fontSize: 10 }}
                          tickFormatter={d => d.slice(0, 7)}
                          interval="preserveStartEnd"
                          stroke="#222"
                        />
                        <YAxis
                          tick={{ fill: '#555', fontSize: 10 }}
                          tickFormatter={v => fmt(v, result.currency)}
                          width={70}
                          stroke="#222"
                        />
                        <Tooltip content={<ChartTooltip currency={result.currency} />} />
                        <Legend
                          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                          formatter={v => <span style={{ color: '#aaa' }}>{v}</span>}
                        />
                        {/* Invested amount — dashed gray */}
                        <Area
                          type="monotone"
                          dataKey="invested"
                          name="Invested"
                          stroke="#555"
                          strokeWidth={1.5}
                          strokeDasharray="4 3"
                          fill="none"
                          dot={false}
                        />
                        {/* Benchmark */}
                        <Area
                          type="monotone"
                          dataKey="benchValue"
                          name={result.benchmark.symbol}
                          stroke="#f59e0b"
                          strokeWidth={2}
                          fill="url(#gradBench)"
                          dot={false}
                        />
                        {/* Portfolio */}
                        <Area
                          type="monotone"
                          dataKey="value"
                          name={result.symbol}
                          stroke="#6366f1"
                          strokeWidth={2.5}
                          fill="url(#gradPortfolio)"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Monthly return chart */}
                <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Month-over-Month Portfolio Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart
                        data={result.timeline.slice(1).map((pt, i) => ({
                          date: pt.date.slice(0, 7),
                          change: ((pt.value - result.timeline[i].value) / result.timeline[i].value) * 100,
                        }))}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                        <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 9 }} interval="preserveStartEnd" stroke="#222" />
                        <YAxis
                          tick={{ fill: '#555', fontSize: 10 }}
                          tickFormatter={v => `${v.toFixed(1)}%`}
                          stroke="#222"
                        />
                        <Tooltip
                          formatter={(v: any) => [`${Number(v).toFixed(2)}%`, 'Monthly Return']}
                          contentStyle={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: 8, fontSize: 11 }}
                          labelStyle={{ color: '#aaa' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="change"
                          stroke="#6366f1"
                          strokeWidth={1.5}
                          dot={false}
                        />
                        {/* zero line */}
                        <CartesianGrid horizontal={false} strokeDasharray="0" stroke="#333" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

      </main>
      <Disclaimer />
    </div>
  );
}
