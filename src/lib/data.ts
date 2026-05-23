import type { Ticker } from './types';

// ── Ticker registry ───────────────────────────────────────────────────────────
// Add a stock here and live data works everywhere automatically.
// For Indian (NSE) stocks: use the exact NSE symbol — .NS is appended automatically.
// For US stocks: use the exact Yahoo Finance ticker.
// price/change/percentChange are NOT stored here; they are always fetched live.

export type TickerMeta = {
  symbol: string;
  name: string;
  currency: 'INR' | 'USD' | 'GBP';
  isIndex?: boolean;
  /** Override the Yahoo Finance symbol when the NSE ticker differs from the app symbol */
  yahooSymbol?: string;
};

export const TICKER_REGISTRY: TickerMeta[] = [
  // ── Indian large-caps (NSE) ───────────────────────────────────────────────
  { symbol: 'RELIANCE',    name: 'Reliance Industries',                  currency: 'INR' },
  { symbol: 'TCS',         name: 'Tata Consultancy Services',            currency: 'INR' },
  { symbol: 'HDFCBANK',    name: 'HDFC Bank',                            currency: 'INR' },
  { symbol: 'INFY',        name: 'Infosys',                              currency: 'INR' },
  { symbol: 'ICICIBANK',   name: 'ICICI Bank',                           currency: 'INR' },
  { symbol: 'HINDUNILVR',  name: 'Hindustan Unilever',                   currency: 'INR' },
  { symbol: 'BHARTIARTL',  name: 'Bharti Airtel',                        currency: 'INR' },
  { symbol: 'SBIN',        name: 'State Bank of India',                  currency: 'INR' },
  { symbol: 'LICI',        name: 'Life Insurance Corporation of India',  currency: 'INR' },
  { symbol: 'ITC',         name: 'ITC Limited',                          currency: 'INR' },
  { symbol: 'KOTAKBANK',   name: 'Kotak Mahindra Bank',                  currency: 'INR' },
  { symbol: 'HCLTECH',     name: 'HCL Technologies',                     currency: 'INR' },
  { symbol: 'LT',          name: 'Larsen & Toubro',                      currency: 'INR' },
  { symbol: 'AXISBANK',    name: 'Axis Bank',                            currency: 'INR' },
  { symbol: 'BAJFINANCE',  name: 'Bajaj Finance',                        currency: 'INR' },
  { symbol: 'WIPRO',       name: 'Wipro',                                currency: 'INR' },
  { symbol: 'MARUTI',      name: 'Maruti Suzuki India',                  currency: 'INR' },
  { symbol: 'SUNPHARMA',   name: 'Sun Pharmaceutical Industries',        currency: 'INR' },
  { symbol: 'ADANIENT',    name: 'Adani Enterprises',                    currency: 'INR' },
  { symbol: 'TATAMOTORS',  name: 'Tata Motors',                          currency: 'INR' },
  { symbol: 'NTPC',        name: 'NTPC Limited',                         currency: 'INR' },
  { symbol: 'ONGC',        name: 'Oil & Natural Gas Corporation',        currency: 'INR' },
  { symbol: 'POWERGRID',   name: 'Power Grid Corporation of India',      currency: 'INR' },
  { symbol: 'COALINDIA',   name: 'Coal India',                           currency: 'INR' },
  { symbol: 'ADANIPORTS',  name: 'Adani Ports & SEZ',                    currency: 'INR' },
  { symbol: 'BAJAJFINSV',  name: 'Bajaj Finserv',                        currency: 'INR' },
  { symbol: 'TITAN',       name: 'Titan Company',                        currency: 'INR' },
  { symbol: 'ASIANPAINT',  name: 'Asian Paints',                         currency: 'INR' },
  { symbol: 'ULTRACEMCO',  name: 'UltraTech Cement',                     currency: 'INR' },
  { symbol: 'NESTLEIND',   name: 'Nestlé India',                         currency: 'INR' },
  { symbol: 'DRREDDY',     name: "Dr. Reddy's Laboratories",             currency: 'INR' },
  { symbol: 'CIPLA',       name: 'Cipla',                                currency: 'INR' },
  { symbol: 'DIVISLAB',    name: "Divi's Laboratories",                  currency: 'INR' },
  { symbol: 'TECHM',       name: 'Tech Mahindra',                        currency: 'INR' },
  { symbol: 'INDUSINDBK',  name: 'IndusInd Bank',                        currency: 'INR' },
  { symbol: 'GRASIM',      name: 'Grasim Industries',                    currency: 'INR' },
  { symbol: 'JSWSTEEL',    name: 'JSW Steel',                            currency: 'INR' },
  { symbol: 'TATASTEEL',   name: 'Tata Steel',                           currency: 'INR' },
  { symbol: 'HEROMOTOCO',  name: 'Hero MotoCorp',                        currency: 'INR' },
  { symbol: 'EICHERMOT',   name: 'Eicher Motors',                        currency: 'INR' },
  { symbol: 'BPCL',        name: 'Bharat Petroleum',                     currency: 'INR' },
  { symbol: 'IOC',         name: 'Indian Oil Corporation',               currency: 'INR' },
  { symbol: 'DABUR',       name: 'Dabur India',                          currency: 'INR' },
  { symbol: 'PIDILITIND',  name: 'Pidilite Industries',                  currency: 'INR' },
  { symbol: 'HAVELLS',     name: 'Havells India',                        currency: 'INR' },
  { symbol: 'APOLLOHOSP',  name: 'Apollo Hospitals',                     currency: 'INR' },
  { symbol: 'ZOMATO',      name: 'Zomato (Eternal)',                     currency: 'INR', yahooSymbol: 'ETERNAL.NS' },
  { symbol: 'PAYTM',       name: 'Paytm (One97 Communications)',         currency: 'INR', yahooSymbol: 'PAYTM.NS' },
  { symbol: 'NYKAA',       name: 'Nykaa (FSN E-Commerce)',               currency: 'INR', yahooSymbol: 'NYKAA.NS' },
  { symbol: 'VEDL',        name: 'Vedanta',                              currency: 'INR' },
  { symbol: 'INDUSTOWER',  name: 'Indus Towers',                         currency: 'INR' },
  { symbol: 'TATACONSUM',  name: 'Tata Consumer Products',               currency: 'INR' },
  { symbol: 'BAJAJ-AUTO',  name: 'Bajaj Auto',                           currency: 'INR' },
  { symbol: 'BRITANNIA',   name: 'Britannia Industries',                 currency: 'INR' },
  { symbol: 'SHRIRAMFIN',  name: 'Shriram Finance',                      currency: 'INR' },

  // ── US / International ────────────────────────────────────────────────────
  { symbol: 'AAPL',    name: 'Apple Inc',                   currency: 'USD' },
  { symbol: 'MSFT',    name: 'Microsoft Corp',              currency: 'USD' },
  { symbol: 'GOOGL',   name: 'Alphabet Inc Class A',        currency: 'USD' },
  { symbol: 'AMZN',    name: 'Amazon.com Inc',              currency: 'USD' },
  { symbol: 'NVDA',    name: 'NVIDIA Corp',                 currency: 'USD' },
  { symbol: 'TSLA',    name: 'Tesla Inc',                   currency: 'USD' },
  { symbol: 'META',    name: 'Meta Platforms Inc',          currency: 'USD' },
  { symbol: 'JPM',     name: 'JPMorgan Chase & Co',         currency: 'USD' },
  { symbol: 'BRK-B',   name: 'Berkshire Hathaway B',        currency: 'USD' },
  { symbol: 'V',       name: 'Visa Inc',                    currency: 'USD' },
  { symbol: 'MA',      name: 'Mastercard Inc',              currency: 'USD' },
  { symbol: 'WMT',     name: 'Walmart Inc',                 currency: 'USD' },
  { symbol: 'JNJ',     name: 'Johnson & Johnson',           currency: 'USD' },
  { symbol: 'UNH',     name: 'UnitedHealth Group',          currency: 'USD' },
  { symbol: 'XOM',     name: 'Exxon Mobil',                 currency: 'USD' },
  { symbol: 'NFLX',    name: 'Netflix Inc',                 currency: 'USD' },
  { symbol: 'AMD',     name: 'Advanced Micro Devices',      currency: 'USD' },
  { symbol: 'INTC',    name: 'Intel Corp',                  currency: 'USD' },
  { symbol: 'CRM',     name: 'Salesforce Inc',              currency: 'USD' },
  { symbol: 'PYPL',    name: 'PayPal Holdings',             currency: 'USD' },
  { symbol: 'UBER',    name: 'Uber Technologies',           currency: 'USD' },
  { symbol: 'DIS',     name: 'Walt Disney Co',              currency: 'USD' },
  { symbol: 'BAC',     name: 'Bank of America',             currency: 'USD' },
  { symbol: 'GS',      name: 'Goldman Sachs',               currency: 'USD' },
  { symbol: 'COIN',    name: 'Coinbase Global',             currency: 'USD' },
  { symbol: 'PLTR',    name: 'Palantir Technologies',       currency: 'USD' },
  { symbol: 'TSM',     name: 'Taiwan Semiconductor (ADR)',  currency: 'USD' },
  { symbol: 'ASML',    name: 'ASML Holding (ADR)',          currency: 'USD' },
  { symbol: 'SAP',     name: 'SAP SE (ADR)',                currency: 'USD' },
  { symbol: 'NVO',     name: 'Novo Nordisk (ADR)',          currency: 'USD' },
  { symbol: 'BABA',    name: 'Alibaba Group (ADR)',         currency: 'USD' },

  // ── Indices (isIndex: true — excluded from stock selectors) ───────────────
  { symbol: 'S&P 500',  name: 'S&P 500',           currency: 'USD', isIndex: true },
  { symbol: 'NASDAQ',   name: 'NASDAQ Composite',  currency: 'USD', isIndex: true },
  { symbol: 'FTSE 100', name: 'FTSE 100',          currency: 'GBP', isIndex: true },
  { symbol: 'NIFTY 50', name: 'NIFTY 50',          currency: 'INR', isIndex: true },
];


// Derive getAllTickers from the registry. price/change/percentChange default to 0
// because live values are always fetched from Yahoo Finance at runtime.
export function getAllTickers(): Ticker[] {
  return TICKER_REGISTRY.map(t => ({
    symbol:        t.symbol,
    name:          t.name,
    currency:      t.currency,
    isIndex:       t.isIndex,
    price:         0,
    change:        0,
    percentChange: 0,
  }));
}
