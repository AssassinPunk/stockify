
import { Quote } from "@/types/market";

const baseValues: Record<string, number> = {
  "NIFTY 50": 23516.00,
  "SENSEX": 77241.59,
  "BANK NIFTY": 51703.95,
  "INDIA VIX": 26.80,
};

// Simulated server-side persistence for drift effect
let lastQuotes: Quote[] = [];

/**
 * Generates mock market quotes with realistic random fluctuations.
 * In production, replace this logic with a real market API call.
 */
export async function getQuotes(): Promise<Quote[]> {
  const now = Date.now();
  
  const quotes: Quote[] = Object.entries(baseValues).map(([symbol, basePrice]) => {
    // Find last price to create a continuous drift, or use base
    const prevQuote = lastQuotes.find(q => q.symbol === symbol);
    const startPrice = prevQuote ? prevQuote.price : basePrice;
    
    // Calculate random drift
    let drift = 0;
    if (symbol === "INDIA VIX") {
      // VIX moves in smaller absolute increments
      drift = (Math.random() - 0.5) * 0.15; 
    } else {
      // Indices move by small percentages (0.01% - 0.03%)
      const volatility = 0.0003; 
      drift = startPrice * (Math.random() - 0.5) * volatility;
    }

    const price = parseFloat((startPrice + drift).toFixed(2));
    const change = parseFloat((price - basePrice).toFixed(2));
    const changePercent = parseFloat(((change / basePrice) * 100).toFixed(2));

    return {
      symbol,
      price,
      change,
      changePercent,
      timestamp: now,
    };
  });

  lastQuotes = quotes;
  return quotes;
}
