import type { IndexData, VixData, SectorData, TrendingData, NewsArticle, MainChartData, ChartDataPoint, Ticker } from './types';

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

export function getIndices(): IndexData[] {
  return [
    { symbol: 'NIFTY 50', value: 23516.00, change: 48.50, percentChange: 0.21, lastUpdated: '1 min ago' },
    { symbol: 'SENSEX', value: 77241.59, change: -236.48, percentChange: -0.31, lastUpdated: '1 min ago' },
    { symbol: 'BANK NIFTY', value: 51703.95, change: 385.20, percentChange: 0.75, lastUpdated: '1 min ago' },
  ];
}

export function getInternationalIndices(): IndexData[] {
  return [
    { symbol: 'S&P 500', value: 5477.90, change: 4.60, percentChange: 0.08, lastUpdated: '1 min ago' },
    { symbol: 'NASDAQ', value: 17721.59, change: -32.23, percentChange: -0.18, lastUpdated: '1 min ago' },
    { symbol: 'FTSE 100', value: 8237.72, change: -43.83, percentChange: -0.53, lastUpdated: '1 min ago' },
  ];
}

export function getVixData(): VixData {
  return { value: 26.80, lastUpdated: '27 Mar, 3:35 pm IST' };
}

export function getSectors(): SectorData[] {
  return [
    { name: 'Nifty IT', change: 1.25 },
    { name: 'Nifty Bank', change: 0.75 },
    { name: 'Nifty Auto', change: 0.50 },
    { name: 'Nifty Pharma', change: -0.20 },
    { name: 'Nifty FMCG', change: 0.10 },
    { name: 'Nifty Realty', change: 2.15 },
    { name: 'Nifty Metal', change: -1.80 },
    { name: 'Nifty Media', change: 0.90 },
    { name: 'Nifty PSE', change: -0.55 },
  ];
}

export function getInternationalSectors(): SectorData[] {
  return [
    { name: 'Technology',         change:  1.85 },
    { name: 'Healthcare',         change: -0.42 },
    { name: 'Financials',         change:  0.67 },
    { name: 'Energy',             change: -1.20 },
    { name: 'Consumer Discret.',  change:  1.10 },
    { name: 'Consumer Staples',   change:  0.28 },
    { name: 'Industrials',        change:  0.55 },
    { name: 'Materials',          change: -0.75 },
    { name: 'Real Estate',        change:  0.38 },
    { name: 'Utilities',          change: -0.18 },
    { name: 'Communication',      change:  2.05 },
  ];
}

export function getTrendingTickers(): TrendingData {
  return {
    gainers: [
      { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 985.50, change: 45.20, percentChange: 4.81 },
      { symbol: 'WIPRO', name: 'Wipro', price: 490.15, change: 18.50, percentChange: 3.92 },
      { symbol: 'ADANIPORTS', name: 'Adani Ports', price: 1450.70, change: 52.30, percentChange: 3.75 },
      { symbol: 'INFY', name: 'Infosys', price: 1530.00, change: 44.10, percentChange: 2.97 },
    ],
    losers: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1658.90, change: -45.80, percentChange: -2.69 },
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2880.25, change: -60.55, percentChange: -2.06 },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1115.60, change: -15.20, percentChange: -1.34 },
      { symbol: 'LT', name: 'Larsen & Toubro', price: 3540.00, change: -40.10, percentChange: -1.12 },
    ],
  };
}

export function getInternationalTrendingTickers(): TrendingData {
    return {
      gainers: [
        { symbol: 'NVDA', name: 'NVIDIA Corp', price: 126.57, change: 5.50, percentChange: 4.54, currency: 'USD' },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 187.35, change: 4.32, percentChange: 2.36, currency: 'USD' },
        { symbol: 'AMZN', name: 'Amazon.com Inc', price: 186.34, change: 2.50, percentChange: 1.36, currency: 'USD' },
        { symbol: 'META', name: 'Meta Platforms Inc', price: 505.78, change: 6.21, percentChange: 1.24, currency: 'USD' },
      ],
      losers: [
        { symbol: 'AAPL', name: 'Apple Inc', price: 208.14, change: -2.51, percentChange: -1.19, currency: 'USD' },
        { symbol: 'MSFT', name: 'Microsoft Corp', price: 447.67, change: -3.42, percentChange: -0.76, currency: 'USD' },
        { symbol: 'GOOGL', name: 'Alphabet Inc Class A', price: 179.22, change: -0.42, percentChange: -0.23, currency: 'USD' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co', price: 197.88, change: -0.98, percentChange: -0.49, currency: 'USD' },
      ],
    };
  }

export function getNews(): NewsArticle[] {
  return [
    { id: '1', title: 'NIFTY 50 crosses 23,500 led by strong IT stocks', source: 'MarketWire', timestamp: '2 hours ago', url: '#', category: 'Indices' },
    { id: '2', title: 'SENSEX dips as banking sector sees profit booking', source: 'Financial Express', timestamp: '3 hours ago', url: '#', category: 'Stocks' },
    { id: '3', title: 'Markets cautious ahead of RBI decision', source: 'Livemint', timestamp: '5 hours ago', url: '#', category: 'Macro' },
    { id: '4', title: 'FIIs turn net buyers in Indian market after a week', source: 'Business Standard', timestamp: '3 hours ago', url: '#', category: 'Indices' },
    { id: '5', title: 'Tata Motors shares jump 5% on strong JLR sales data', source: 'Economic Times', timestamp: '1 hour ago', url: '#', category: 'Stocks' },
  ];
}

export function getInternationalNews(): NewsArticle[] {
    return [
      { id: '6', title: 'Dow Jones declines after Fed signals rate hikes', source: 'Reuters', timestamp: '1 hour ago', url: '#', category: 'Macro' },
      { id: '7', title: 'Nasdaq surges driven by AI stocks', source: 'Bloomberg', timestamp: '2 hours ago', url: '#', category: 'Indices' },
      { id: '8', title: 'European markets dip on French political uncertainty', source: 'Financial Times', timestamp: '1.5 hours ago', url: '#', category: 'Indices' },
      { id: '9', title: 'NVIDIA stock continues to rally on AI optimism', source: 'Wall Street Journal', timestamp: '45 min ago', url: '#', category: 'Stocks' },
      { id: '10', title: 'Apple unveils new AI features for iPhone at WWDC', source: 'The Verge', timestamp: '4 hours ago', url: '#', category: 'Stocks' },
    ];
}

const generateChartData = (base: number, points: number, volatility: number, period: string): ChartDataPoint[] => {
  let lastValue = base;
  const data: ChartDataPoint[] = [];
  const today = new Date();

  for (let i = 0; i < points; i++) {
    const open = lastValue;
    const change = (Math.random() - 0.49) * volatility * lastValue / 100;
    const close = open + change;
    
    const high = Math.max(open, close) + (Math.random() * (volatility / 2) * lastValue / 100);
    const low = Math.min(open, close) - (Math.random() * (volatility / 2) * lastValue / 100);

    lastValue = close;
    const volume = Math.floor(Math.random() * 1000000) + 500000;
    
    let date: Date;
    switch(period) {
      case '1D':
        date = new Date(today.getTime() - (points - 1 - i) * 5 * 60 * 1000); 
        break;
      case '5D':
        date = new Date(today.getTime() - (points - 1 - i) * 60 * 60 * 1000); 
        break;
      case '1M':
        date = new Date(today);
        date.setDate(today.getDate() - (points - 1 - i));
        break;
      case '6M':
        date = new Date(today);
        date.setDate(today.getDate() - (points - 1 - i) * 7);
        break;
      case '1Y':
        date = new Date(today);
        date.setDate(today.getDate() - (points - 1 - i) * 7);
        break;
      default:
        date = new Date();
    }

    data.push({ 
      date: date.toISOString(), 
      value: parseFloat(close.toFixed(2)),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume 
    });
  }
  return data;
};


export function getVixChartData(): ChartDataPoint[] {
    return generateChartData(26.80, 30, 2, '1M');
}

export function getMainChartData(symbol: string): MainChartData {
  const allTickers = getAllTickers();
  const ticker = allTickers.find(t => t.symbol === symbol) || { price: 23500 };
  const basePrice = ticker.price;

  return {
      '1D': generateChartData(basePrice, 96, 0.5, '1D'), 
      '5D': generateChartData(basePrice, 60, 1, '5D'), 
      '1M': generateChartData(basePrice, 30, 2, '1M'), 
      '6M': generateChartData(basePrice, 26, 5, '6M'), 
      '1Y': generateChartData(basePrice, 52, 8, '1Y'), 
  };
}

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
