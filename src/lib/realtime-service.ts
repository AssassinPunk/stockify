'use client';

type PriceUpdate = {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
};

type Listener = (update: PriceUpdate) => void;

// Symbols polled on every tick. Covers the indices shown in LiveDashboard
// plus a handful of high-visibility stocks.
const TRACKED_SYMBOLS = [
  'NIFTY 50', 'SENSEX', 'BANK NIFTY',
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
];

class RealtimeDataService {
  private listeners: Set<Listener> = new Set();
  private interval: NodeJS.Timeout | null = null;
  private cache = new Map<string, PriceUpdate>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.startPolling();
    }
  }

  private async poll() {
    try {
      const res = await fetch(
        `/api/quotes/bulk?symbols=${TRACKED_SYMBOLS.join(',')}`,
        { cache: 'no-store' }
      );
      if (!res.ok) return;

      const data: Record<string, { price: number; change: number; percentChange: number }> =
        await res.json();

      for (const [symbol, quote] of Object.entries(data)) {
        const update: PriceUpdate = {
          symbol,
          price: quote.price,
          change: quote.change,
          percentChange: quote.percentChange,
        };
        this.cache.set(symbol, update);
        this.listeners.forEach(l => l(update));
      }
    } catch {
      // Network error — keep serving cached values; no stale update emitted
    }
  }

  private startPolling() {
    // Initial fetch, then every 30 seconds (Yahoo Finance free tier is tolerant of this)
    this.poll();
    this.interval = setInterval(() => this.poll(), 30_000);
  }

  subscribe(callback: Listener) {
    this.listeners.add(callback);
    // Emit cached data immediately so new subscribers don't wait 30 s for first value
    this.cache.forEach(update => callback(update));
    return () => this.listeners.delete(callback);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const realtimeService = new RealtimeDataService();
