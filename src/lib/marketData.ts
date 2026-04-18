import { Quote } from "@/types/market";
import { SYMBOL_MAP } from "./constants";

/**
 * Parses a string to a number safely, defaulting to 0 if invalid.
 */
function parseSafeFloat(value: string | undefined | null): number {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Fetches real-time market quotes from Twelve Data API.
 * Uses server-side environment variable for the API key.
 */
export async function getQuotes(): Promise<Quote[]> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  const now = Date.now();

  if (!apiKey) {
    console.error("Market Data Error: TWELVE_DATA_API_KEY is not configured in environment variables.");
    return [];
  }

  // Map our display symbols to Twelve Data symbols
  const apiSymbols = Object.values(SYMBOL_MAP).join(",");
  const url = `https://api.twelvedata.com/quote?symbol=${apiSymbols}&apikey=${apiKey}`;

  try {
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    // Twelve Data returns a global error object if the request fails completely
    if (data.status === "error") {
      console.error("Twelve Data API Global Error:", data.message);
      return [];
    }

    // Process each mapped symbol. Twelve Data returns an object keyed by symbol for batch requests.
    const quotes: Quote[] = Object.entries(SYMBOL_MAP).map(([displayName, apiSymbol]) => {
      const apiQuote = data[apiSymbol];

      if (!apiQuote) {
        console.warn(`Market Data Warning: No data returned for ${displayName} (${apiSymbol})`);
        return null;
      }

      if (apiQuote.status === "error") {
        console.warn(`Market Data Warning for ${displayName}:`, apiQuote.message);
        return null;
      }

      return {
        symbol: displayName,
        price: parseSafeFloat(apiQuote.close || apiQuote.price),
        change: parseSafeFloat(apiQuote.change),
        changePercent: parseSafeFloat(apiQuote.percent_change),
        timestamp: now,
      };
    }).filter((q): q is Quote => q !== null);

    return quotes;
  } catch (error) {
    console.error("Market Data critical failure:", error);
    return [];
  }
}
