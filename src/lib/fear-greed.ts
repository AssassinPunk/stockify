import type { FearGreedData } from '@/app/api/fear-greed/route';

// One scale everywhere, with the same edges as the labels the API gives its scores (20 / 40 / 60 / 80).
// Red and green at two strengths with grey between, so the extremes read loudest and no extra hues appear.
export const ZONES = [
  { name: 'Extreme Fear',  range: '0–20',   from: 0,  to: 20,  color: 'hsl(var(--down))' },
  { name: 'Fear',          range: '21–40',  from: 20, to: 40,  color: 'hsl(0 45% 62%)' },
  { name: 'Neutral',       range: '41–60',  from: 40, to: 60,  color: 'hsl(0 0% 62%)' },
  { name: 'Greed',         range: '61–80',  from: 60, to: 80,  color: 'hsl(142 35% 55%)' },
  { name: 'Extreme Greed', range: '81–100', from: 80, to: 100, color: 'hsl(var(--up))' },
] as const;

export const zoneColor = (label: string) =>
  ZONES.find(zone => zone.name === label)?.color ?? 'hsl(0 0% 62%)';

// Exact to two decimals, because a score is a whole number and a weight a whole percent.
export const points = (score: number, weight: number) => (score * weight) / 100;
export const formatPoints = (value: number) => value.toFixed(2);

const IST = 'Asia/Kolkata';
const DELAYED_AFTER_MS = 20 * 60 * 1000;

const time = (iso: string | Date) =>
  new Date(iso).toLocaleTimeString('en-IN', { timeZone: IST, hour: 'numeric', minute: '2-digit' });

const dayAndTime = (iso: string) => {
  const date = new Date(iso);
  const weekday = date.toLocaleDateString('en-GB', { timeZone: IST, weekday: 'short' });
  const day = date.toLocaleDateString('en-GB', { timeZone: IST, day: 'numeric', month: 'short' });
  return `${weekday} ${day}, ${time(iso)} IST`;
};

export const clockTime = (date: Date) => `${time(date)} IST`;

export function marketStatus(data: Pick<FearGreedData, 'asOf' | 'marketOpen'>, now = Date.now()) {
  if (!data.asOf) return 'Last trade time unavailable';
  if (data.marketOpen === false) return `Market closed · as of ${dayAndTime(data.asOf)}`;
  if (data.marketOpen === null) return `As of ${dayAndTime(data.asOf)}`;
  return now - Date.parse(data.asOf) > DELAYED_AFTER_MS
    ? `Market open · delayed, last trade ${time(data.asOf)} IST`
    : `Market open · as of ${time(data.asOf)} IST`;
}

export const INDICATOR_NAMES = ['Volatility (India VIX)', 'Market Momentum', 'Sector Breadth', 'Safe Haven Demand'];

export const HOW_IT_WORKS = [
  { title: 'Volatility', weight: 30, body: 'India VIX from NSE. High VIX = fear, low VIX = greed. The single strongest signal in the composite.' },
  { title: 'Momentum', weight: 30, body: 'NIFTY 50 relative to its 50-day moving average. Prices above MA signal bullish sentiment.' },
  { title: 'Sector Breadth', weight: 25, body: 'Proportion of Nifty sectors trading positive. Broad rally = healthier market, narrow = suspect.' },
  { title: 'Safe Haven', weight: 15, body: 'Gold vs equities 30-day return. Money flowing into gold signals risk-off behavior.' },
];

export const ZONE_DESCRIPTIONS: Record<string, string> = {
  'Extreme Fear':  'Investors are extremely worried. Historically, extreme fear can signal buying opportunities for long-term investors.',
  'Fear':          'The market is showing signs of anxiety. Prices may be undervalued relative to fundamentals.',
  'Neutral':       'Markets are balanced between greed and fear. No strong signal in either direction.',
  'Greed':         'Investors are becoming more risk-seeking. Rally may continue but watch for signs of excess.',
  'Extreme Greed': 'Markets may be overheated. Historically, extreme greed has preceded corrections.',
};
