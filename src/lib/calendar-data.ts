export type CalendarEvent = {
  date: string; // ISO YYYY-MM-DD
  title: string;
  category: 'RBI' | 'Earnings' | 'Global' | 'Index' | 'Macro' | 'Central Bank' | 'Forex';
  market: 'India' | 'International';
  impact: 'High' | 'Medium' | 'Low';
  description?: string;
};

export const CALENDAR_EVENTS: CalendarEvent[] = [
  // ── India — April 2026 (past) ────────────────────────────────────────────
  { date: '2026-04-09', title: 'RBI MPC Rate Decision',       category: 'RBI',      market: 'India',         impact: 'High',   description: 'Rate held at 6.25% — accommodative stance maintained' },
  { date: '2026-04-14', title: 'Wipro Q4 FY26 Results',       category: 'Earnings', market: 'India',         impact: 'High',   description: 'Q4 FY26 earnings announcement' },
  { date: '2026-04-17', title: 'HDFC Life Q4 Results',        category: 'Earnings', market: 'India',         impact: 'Medium', description: 'Q4 FY26 earnings announcement' },
  { date: '2026-04-23', title: 'TCS Q4 FY26 Results',         category: 'Earnings', market: 'India',         impact: 'High',   description: 'Q4 FY26 earnings announcement' },

  // ── International — April 2026 (past) ───────────────────────────────────
  { date: '2026-04-10', title: 'US CPI Inflation (March)',     category: 'Macro',         market: 'International', impact: 'High',   description: 'US Consumer Price Index — March reading' },
  { date: '2026-04-17', title: 'ECB Rate Decision',            category: 'Central Bank',  market: 'International', impact: 'High',   description: 'European Central Bank monetary policy decision' },
  { date: '2026-04-23', title: 'US FOMC Meeting',              category: 'Global',        market: 'International', impact: 'High',   description: 'Federal Reserve rate decision — held at 4.25-4.50%' },
  { date: '2026-04-18', title: 'China Q1 GDP',                 category: 'Macro',         market: 'International', impact: 'Medium', description: 'China first quarter GDP growth rate' },

  // ── India — April 2026 (upcoming) ───────────────────────────────────────
  { date: '2026-04-25', title: 'Infosys Q4 FY26 Results',             category: 'Earnings', market: 'India', impact: 'High',   description: 'Q4 FY26 earnings announcement' },
  { date: '2026-04-28', title: 'HDFC Bank Q4 FY26 Results',           category: 'Earnings', market: 'India', impact: 'High',   description: 'Q4 FY26 earnings announcement' },
  { date: '2026-04-30', title: 'Reliance Industries Q4 Results',      category: 'Earnings', market: 'India', impact: 'High',   description: 'Q4 FY26 earnings announcement' },
  { date: '2026-04-30', title: 'India Fiscal Deficit Data (FY26)',     category: 'Macro',    market: 'India', impact: 'Medium', description: 'Full-year fiscal deficit vs 4.9% GDP target' },

  // ── India — May 2026 ─────────────────────────────────────────────────────
  { date: '2026-05-05', title: 'ICICI Bank Q4 Results',        category: 'Earnings', market: 'India', impact: 'High',   description: 'Q4 FY26 earnings announcement' },
  { date: '2026-05-07', title: 'Axis Bank Q4 Results',         category: 'Earnings', market: 'India', impact: 'Medium', description: 'Q4 FY26 earnings announcement' },
  { date: '2026-05-08', title: 'SBI Q4 FY26 Results',          category: 'Earnings', market: 'India', impact: 'High',   description: 'Q4 FY26 earnings announcement' },
  { date: '2026-05-15', title: 'Maruti Suzuki Q4 Results',     category: 'Earnings', market: 'India', impact: 'Medium', description: 'Q4 FY26 earnings announcement' },
  { date: '2026-05-20', title: 'India WPI Inflation (April)',  category: 'Macro',    market: 'India', impact: 'Low',    description: 'Wholesale Price Index — April 2026' },
  { date: '2026-05-22', title: 'India CPI Inflation (April)', category: 'Macro',    market: 'India', impact: 'Medium', description: 'Consumer Price Index — April 2026 reading' },
  { date: '2026-05-30', title: 'India GDP Q4 FY26',            category: 'Macro',    market: 'India', impact: 'High',   description: 'Final quarter GDP growth for FY2025-26' },

  // ── International — May 2026 ─────────────────────────────────────────────
  { date: '2026-05-02', title: 'US Non-Farm Payrolls (April)', category: 'Macro',        market: 'International', impact: 'High',   description: 'US jobs report — April 2026' },
  { date: '2026-05-07', title: 'US FOMC Meeting',              category: 'Global',       market: 'International', impact: 'High',   description: 'Federal Reserve interest rate decision' },
  { date: '2026-05-13', title: 'US CPI Inflation (April)',     category: 'Macro',        market: 'International', impact: 'High',   description: 'US Consumer Price Index — April 2026 reading' },
  { date: '2026-05-08', title: 'Bank of England Decision',     category: 'Central Bank', market: 'International', impact: 'Medium', description: 'BoE monetary policy rate decision' },
  { date: '2026-05-22', title: 'UK CPI Inflation (April)',     category: 'Macro',        market: 'International', impact: 'Medium', description: 'UK Consumer Price Index — April 2026' },
  { date: '2026-05-28', title: 'US GDP Q1 (Final)',            category: 'Macro',        market: 'International', impact: 'Medium', description: 'US Q1 2026 GDP final estimate' },

  // ── India — June 2026 ────────────────────────────────────────────────────
  { date: '2026-06-05', title: 'RBI MPC Rate Decision',               category: 'RBI',   market: 'India', impact: 'High',   description: 'Bi-monthly monetary policy committee decision' },
  { date: '2026-06-09', title: 'NIFTY 50 Semi-Annual Rebalancing',    category: 'Index', market: 'India', impact: 'Medium', description: 'NSE semi-annual index reconstitution effective date' },
  { date: '2026-06-12', title: 'India CPI Inflation (May)',           category: 'Macro', market: 'India', impact: 'Medium', description: 'Consumer Price Index — May 2026 reading' },
  { date: '2026-06-30', title: 'RBI Annual Report FY26',              category: 'RBI',   market: 'India', impact: 'Medium', description: 'Reserve Bank of India full-year annual report' },

  // ── International — June 2026 ────────────────────────────────────────────
  { date: '2026-06-06', title: 'US Non-Farm Payrolls (May)',  category: 'Macro',        market: 'International', impact: 'High',   description: 'US jobs report — May 2026' },
  { date: '2026-06-05', title: 'ECB Rate Decision',           category: 'Central Bank', market: 'International', impact: 'High',   description: 'European Central Bank monetary policy decision' },
  { date: '2026-06-11', title: 'US CPI Inflation (May)',      category: 'Macro',        market: 'International', impact: 'High',   description: 'US Consumer Price Index — May 2026 reading' },
  { date: '2026-06-17', title: 'US FOMC Meeting',             category: 'Global',       market: 'International', impact: 'High',   description: 'Federal Reserve interest rate decision' },
  { date: '2026-06-19', title: 'Bank of Japan Decision',      category: 'Central Bank', market: 'International', impact: 'Medium', description: 'Bank of Japan monetary policy decision' },
];
