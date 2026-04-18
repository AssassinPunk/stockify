
'use client';

/**
 * RealtimeDataService simulates a WebSocket server for stock price updates.
 * In a production environment, this would connect to a real Socket.io or WebSocket server.
 */

type PriceUpdate = {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
};

type Listener = (update: PriceUpdate) => void;

class RealtimeDataService {
  private listeners: Set<Listener> = new Set();
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.startSimulating();
    }
  }

  private startSimulating() {
    // This simulates push updates from a WebSocket server
    this.interval = setInterval(() => {
      this.listeners.forEach(listener => {
        // Pick a random index or stock to update
        const symbols = ['NIFTY 50', 'SENSEX', 'BANK NIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INDIA VIX'];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Simulate a small price tick (0.01% - 0.05%)
        const volatility = 0.0005;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const tick = direction * (Math.random() * volatility);
        
        // We'll just emit the relative tick data
        // In a real app, the server would push the absolute current price
        listener({
          symbol,
          price: 0, // In this mock, we'll handle absolute calculation in the hook
          change: tick, 
          percentChange: tick * 100
        });
      });
    }, 1500); // Push updates every 1.5 seconds
  }

  subscribe(callback: Listener) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }
}

export const realtimeService = new RealtimeDataService();
