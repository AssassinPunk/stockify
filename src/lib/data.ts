import type { IndexData, VixData, SectorData, TrendingData, NewsArticle, MainChartData, ChartDataPoint, Ticker } from './types';

export function getIndices(): IndexData[] {
  return [
    { symbol: 'NIFTY 50', value: 23516.00, change: 48.50, percentChange: 0.21, lastUpdated: '1 min ago' },
    { symbol: 'SENSEX', value: 77241.59, change: -236.48, percentChange: -0.31, lastUpdated: '1 min ago' },
    { symbol: 'BANK NIFTY', value: 51703.95, change: 385.20, percentChange: 0.75, lastUpdated: '1 min ago' },
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

export function getNews(): NewsArticle[] {
  return [
    { id: '1', title: 'Sensex, Nifty trade flat amid volatility; IT stocks gain', source: 'MoneyControl', timestamp: '10 min ago', url: '#', category: 'Indices' },
    { id: '2', title: 'RBI announces new measures to control inflation', source: 'Livemint', timestamp: '30 min ago', url: '#', category: 'Macro' },
    { id: '3', title: 'Tata Motors shares jump 5% on strong JLR sales data', source: 'Economic Times', timestamp: '1 hour ago', url: '#', category: 'Stocks' },
    { id: '4', title: 'SEBI plans to introduce T+0 settlement by next year', source: 'Reuters', timestamp: '2 hours ago', url: '#', category: 'Macro' },
    { id: '5', title: 'FIIs turn net buyers in Indian market after a week', source: 'Business Standard', timestamp: '3 hours ago', url: '#', category: 'Indices' },
  ];
}

const generateChartData = (base: number, points: number, volatility: number): ChartDataPoint[] => {
    let lastValue = base;
    const data = [];
    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * volatility;
        lastValue += change;
        data.push({ date: `T-${points - i}`, value: parseFloat(lastValue.toFixed(2)) });
    }
    return data.reverse();
};

export function getVixChartData(): ChartDataPoint[] {
    return generateChartData(14, 30, 0.5);
}

export function getMainChartData(): MainChartData {
    return {
        '1D': generateChartData(23500, 96, 50), // ~8 hours of 5-min intervals
        '5D': generateChartData(23300, 60, 100), // 5 days of hourly data
        '1M': generateChartData(23000, 30, 150), // 1 month of daily data
        '6M': generateChartData(21000, 26, 300), // 6 months of weekly data
        '1Y': generateChartData(19000, 52, 500), // 1 year of weekly data
    };
}

export function getAllTickers(): Ticker[] {
  return [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2880.25, change: -60.55, percentChange: -2.06 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3816.00, change: 15.25, percentChange: 0.40 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1658.90, change: -45.80, percentChange: -2.69 },
    { symbol: 'INFY', name: 'Infosys', price: 1530.00, change: 44.10, percentChange: 2.97 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1115.60, change: -15.20, percentChange: -1.34 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2545.00, change: 5.00, percentChange: 0.20 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1205.50, change: 10.10, percentChange: 0.84 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 760.80, change: 8.30, percentChange: 1.10 },
    { symbol: 'LICI', name: 'Life Insurance Corporation of India', price: 975.00, change: -2.50, percentChange: -0.26 },
    { symbol: 'ITC', name: 'ITC Limited', price: 430.25, change: 1.15, percentChange: 0.27 },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1770.00, change: -20.50, percentChange: -1.14 },
    { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1445.00, change: 25.00, percentChange: 1.76 },
    { symbol: 'LT', name: 'Larsen & Toubro', price: 3540.00, change: -40.10, percentChange: -1.12 },
    { symbol: 'AXISBANK', name: 'Axis Bank', price: 1160.70, change: 12.00, percentChange: 1.04 },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 7250.00, change: -50.00, percentChange: -0.68 },
    { symbol: 'WIPRO', name: 'Wipro', price: 490.15, change: 18.50, percentChange: 3.92 },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 12800.00, change: 150.00, percentChange: 1.19 },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', price: 1502.00, change: 8.00, percentChange: 0.54 },
    { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3250.00, change: -30.00, percentChange: -0.91 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 985.50, change: 45.20, percentChange: 4.81 },
    { symbol: 'NTPC', name: 'NTPC Limited', price: 360.50, change: 2.00, percentChange: 0.56 },
    { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation', price: 270.00, change: -1.50, percentChange: -0.55 },
    { symbol: 'POWERGRID', name: 'Power Grid Corporation of India', price: 310.00, change: 5.00, percentChange: 1.64 },
    { symbol: 'COALINDIA', name: 'Coal India', price: 470.00, change: -3.00, percentChange: -0.63 },
    { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ', price: 1450.70, change: 52.30, percentChange: 3.75 },
  ];
}
