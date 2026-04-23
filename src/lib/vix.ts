import type { ChartDataPoint } from './types';

export const MAX_VIX = 40;

export function calculateVixMoves(vixValue: number) {
  if (vixValue <= 0) return { daily: 0, weekly: 0, monthly: 0, yearly: 0 };
  return {
    daily:   vixValue / Math.sqrt(245),
    weekly:  vixValue / Math.sqrt(52),
    monthly: vixValue / Math.sqrt(12),
    yearly:  vixValue,
  };
}

export function getRiskLevel(vixValue: number): {
  level: 'Low' | 'Moderate' | 'High' | 'Extreme';
  color: string;
  hex: string;
} {
  if (vixValue < 13)  return { level: 'Low',      color: 'text-up',          hex: '#10b981' };
  if (vixValue < 18)  return { level: 'Moderate',  color: 'text-yellow-400',  hex: '#facc15' };
  if (vixValue < 25)  return { level: 'High',       color: 'text-orange-400',  hex: '#fb923c' };
  return               { level: 'Extreme',   color: 'text-down',        hex: '#ef4444' };
}

export function getVixAnchors(data: ChartDataPoint[]) {
  if (!data.length) return { high: 0, low: 0, avg: 0 };
  const values = data.map(d => d.value);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return {
    high: parseFloat(Math.max(...values).toFixed(2)),
    low:  parseFloat(Math.min(...values).toFixed(2)),
    avg:  parseFloat(avg.toFixed(2)),
  };
}

export function getVixPercentile(current: number, data: ChartDataPoint[]): number {
  if (!data.length) return 50;
  const values = data.map(d => d.value);
  const below = values.filter(v => v <= current).length;
  return Math.round((below / values.length) * 100);
}

export type StrategyTip = { text: string; icon: 'shield' | 'trend' | 'warn' | 'ban' | 'clock' | 'target' | 'cash' | 'trophy' };

export type ZoneStrategy = {
  title: string;
  description: string;
  tips: StrategyTip[];
};

export const ZONE_STRATEGIES: Record<'Low' | 'Moderate' | 'High' | 'Extreme', ZoneStrategy> = {
  Low: {
    title: 'Calm Markets — Stay Alert',
    description: 'VIX below 13 signals market complacency. Conditions look stable, but sharp reversals can erupt with no warning.',
    tips: [
      { icon: 'shield', text: 'Options premiums are near lows — buy protective puts cheaply as portfolio insurance' },
      { icon: 'trend',  text: 'Trend-following strategies work well here; ride momentum with tight trailing stops' },
      { icon: 'warn',   text: 'Historically, prolonged low-VIX periods often precede sharp corrections' },
      { icon: 'target', text: 'Good time to review and rebalance your portfolio to target weights' },
    ],
  },
  Moderate: {
    title: 'Healthy Volatility — Normal Environment',
    description: 'VIX between 13–18 reflects balanced conditions. Risk is fairly priced; both buyers and sellers can operate confidently.',
    tips: [
      { icon: 'target', text: 'Standard position sizing — no need to be overly aggressive or defensive' },
      { icon: 'cash',   text: 'Credit spreads and covered calls offer attractive risk/reward' },
      { icon: 'clock',  text: 'Ideal regime for systematic SIP / dollar-cost averaging strategies' },
      { icon: 'trend',  text: 'Focus on fundamentals; valuations matter most in stable-volatility phases' },
    ],
  },
  High: {
    title: 'Elevated Fear — Stay Disciplined',
    description: 'VIX between 18–25 means markets are nervous. Expect wide intraday swings and gap-downs on bad news.',
    tips: [
      { icon: 'ban',    text: 'Reduce position sizes; widen stop-losses to avoid being shaken out by noise' },
      { icon: 'shield', text: 'Avoid naked short options — sell spreads to define and cap your maximum loss' },
      { icon: 'clock',  text: 'Long-term investors: elevated VIX has historically rewarded buyers over a 12-month horizon' },
      { icon: 'warn',   text: 'Never add leverage here — gap opens and whipsaws can wipe leveraged positions overnight' },
    ],
  },
  Extreme: {
    title: 'Panic Mode — Contrarian Opportunity',
    description: 'VIX above 25 signals widespread panic. Emotionally the hardest time to act — historically, the most rewarding.',
    tips: [
      { icon: 'trophy', text: 'Extreme VIX is a strong contrarian buy signal for quality stocks over a 6–12 month horizon' },
      { icon: 'cash',   text: 'Deploy capital in tranches (3–5 equal buys) — never try to nail the exact bottom' },
      { icon: 'shield', text: 'Preserve dry powder; you may need liquidity for an additional leg down' },
      { icon: 'ban',    text: 'Do not panic-sell quality holdings — long-term value is being created in real time' },
    ],
  },
};
