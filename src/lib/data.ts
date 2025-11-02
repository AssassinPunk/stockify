import type { IndexData, VixData, SectorData, TrendingData, NewsArticle, MainChartData, ChartDataPoint, Ticker } from './types';

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
  return { value: 14.35, lastUpdated: '2 min ago' };
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
    { id: '1', title: 'Sensex, Nifty trade flat amid volatility; IT stocks gain', source: 'MoneyControl', timestamp: '10 min ago', url: '#', category: 'Indices' },
    { id: '2', title: 'RBI announces new measures to control inflation', source: 'Livemint', timestamp: '30 min ago', url: '#', category: 'Macro' },
    { id: '3', title: 'Tata Motors shares jump 5% on strong JLR sales data', source: 'Economic Times', timestamp: '1 hour ago', url: '#', category: 'Stocks' },
    { id: '4', title: 'SEBI plans to introduce T+0 settlement by next year', source: 'Reuters', timestamp: '2 hours ago', url: '#', category: 'Macro' },
    { id: '5', title: 'FIIs turn net buyers in Indian market after a week', source: 'Business Standard', timestamp: '3 hours ago', url: '#', category: 'Indices' },
  ];
}

export function getInternationalNews(): NewsArticle[] {
    return [
      { id: '6', title: 'Fed holds interest rates steady, signals one cut in 2024', source: 'Wall Street Journal', timestamp: '15 min ago', url: '#', category: 'Macro' },
      { id: '7', title: 'NVIDIA stock continues to rally on AI optimism', source: 'Bloomberg', timestamp: '45 min ago', url: '#', category: 'Stocks' },
      { id: '8', title: 'European markets dip on French political uncertainty', source: 'Financial Times', timestamp: '1.5 hours ago', url: '#', category: 'Indices' },
      { id: '9', title: 'US jobless claims unexpectedly rise, hinting at cooling labor market', source: 'CNBC', timestamp: '2 hours ago', url: '#', category: 'Macro' },
      { id: '10', title: 'Apple unveils new AI features for iPhone at WWDC', source: 'The Verge', timestamp: '4 hours ago', url: '#', category: 'Stocks' },
    ];
}

const generateChartData = (base: number, points: number, volatility: number, period: string): ChartDataPoint[] => {
  let lastValue = base;
  const data: ChartDataPoint[] = [];
  const today = new Date();

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.49) * volatility * lastValue / 100;
    lastValue += change;
    
    let date: Date;
    switch(period) {
      case '1D':
        date = new Date(today.getTime() - (points - 1 - i) * 5 * 60 * 1000); // 5 minute intervals
        break;
      case '5D':
        date = new Date(today.getTime() - (points - 1 - i) * 60 * 60 * 1000); // Hourly intervals
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

    data.push({ date: date.toISOString(), value: parseFloat(lastValue.toFixed(2)) });
  }
  return data;
};


export function getVixChartData(): ChartDataPoint[] {
    return generateChartData(14, 30, 2, '1M');
}

export function getMainChartData(symbol: string): MainChartData {
  // In a real app, you'd fetch data based on the symbol.
  // Here, we'll generate random data for demonstration.
  const allTickers = getAllTickers();
  const ticker = allTickers.find(t => t.symbol === symbol) || { price: 23500 };
  const basePrice = ticker.price;

  return {
      '1D': generateChartData(basePrice, 96, 0.5, '1D'), // ~8 hours of 5-min intervals
      '5D': generateChartData(basePrice, 60, 1, '5D'), // 5 days of hourly data
      '1M': generateChartData(basePrice, 30, 2, '1M'), // 1 month of daily data
      '6M': generateChartData(basePrice, 26, 5, '6M'), // 6 months of weekly data
      '1Y': generateChartData(basePrice, 52, 8, '1Y'), // 1 year of weekly data
  };
}

export function getAllTickers(): Ticker[] {
  return [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2880.25, change: -60.55, percentChange: -2.06, currency: 'INR' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3816.00, change: 15.25, percentChange: 0.40, currency: 'INR' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1658.90, change: -45.80, percentChange: -2.69, currency: 'INR' },
    { symbol: 'INFY', name: 'Infosys', price: 1530.00, change: 44.10, percentChange: 2.97, currency: 'INR' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1115.60, change: -15.20, percentChange: -1.34, currency: 'INR' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2545.00, change: 5.00, percentChange: 0.20, currency: 'INR' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1205.50, change: 10.10, percentChange: 0.84, currency: 'INR' },
    { symbol: 'SBIN', name: 'State Bank of India', price: 760.80, change: 8.30, percentChange: 1.10, currency: 'INR' },
    { symbol: 'LICI', name: 'Life Insurance Corporation of India', price: 975.00, change: -2.50, percentChange: -0.26, currency: 'INR' },
    { symbol: 'ITC', name: 'ITC Limited', price: 430.25, change: 1.15, percentChange: 0.27, currency: 'INR' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1770.00, change: -20.50, percentChange: -1.14, currency: 'INR' },
    { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1445.00, change: 25.00, percentChange: 1.76, currency: 'INR' },
    { symbol: 'LT', name: 'Larsen & Toubro', price: 3540.00, change: -40.10, percentChange: -1.12, currency: 'INR' },
    { symbol: 'AXISBANK', name: 'Axis Bank', price: 1160.70, change: 12.00, percentChange: 1.04, currency: 'INR' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 7250.00, change: -50.00, percentChange: -0.68, currency: 'INR' },
    { symbol: 'WIPRO', name: 'Wipro', price: 490.15, change: 18.50, percentChange: 3.92, currency: 'INR' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 12800.00, change: 150.00, percentChange: 1.19, currency: 'INR' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', price: 1502.00, change: 8.00, percentChange: 0.54, currency: 'INR' },
    { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3250.00, change: -30.00, percentChange: -0.91, currency: 'INR' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 985.50, change: 45.20, percentChange: 4.81, currency: 'INR' },
    { symbol: 'NTPC', name: 'NTPC Limited', price: 360.50, change: 2.00, percentChange: 0.56, currency: 'INR' },
    { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation', price: 270.00, change: -1.50, percentChange: -0.55, currency: 'INR' },
    { symbol: 'POWERGRID', name: 'Power Grid Corporation of India', price: 310.00, change: 5.00, percentChange: 1.64, currency: 'INR' },
    { symbol: 'COALINDIA', name: 'Coal India', price: 470.00, change: -3.00, percentChange: -0.63, currency: 'INR' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ', price: 1450.70, change: 52.30, percentChange: 3.75, currency: 'INR' },
    
    // International Tickers
    { symbol: 'AAPL', name: 'Apple Inc', price: 208.14, change: -2.51, percentChange: -1.19, currency: 'USD' },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 447.67, change: -3.42, percentChange: -0.76, currency: 'USD' },
    { symbol: 'GOOGL', name: 'Alphabet Inc Class A', price: 179.22, change: -0.42, percentChange: -0.23, currency: 'USD' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 186.34, change: 2.50, percentChange: 1.36, currency: 'USD' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 126.57, change: 5.50, percentChange: 4.54, currency: 'USD' },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 187.35, change: 4.32, percentChange: 2.36, currency: 'USD' },
    { symbol: 'META', name: 'Meta Platforms Inc', price: 505.78, change: 6.21, percentChange: 1.24, currency: 'USD' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co', price: 197.88, change: -0.98, percentChange: -0.49, currency: 'USD' },

    // International Indices (for charting)
    { symbol: 'S&P 500', name: 'S&P 500', price: 5477.90, change: 4.60, percentChange: 0.08, currency: 'USD', isIndex: true },
    { symbol: 'NASDAQ', name: 'NASDAQ Composite', price: 17721.59, change: -32.23, percentChange: -0.18, currency: 'USD', isIndex: true },
    { symbol: 'FTSE 100', name: 'FTSE 100', price: 8237.72, change: -43.83, percentChange: -0.53, currency: 'GBP', isIndex: true },
    // Indian Indices (for charting)
    { symbol: 'NIFTY 50', name: 'NIFTY 50', price: 23516.00, change: 48.50, percentChange: 0.21, currency: 'INR', isIndex: true },
  ];
}
