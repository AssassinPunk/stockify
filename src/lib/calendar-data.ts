export type CalendarEvent = {
  date: string; // ISO YYYY-MM-DD, the day the decision or data comes out
  title: string;
  category: 'RBI' | 'Earnings' | 'Global' | 'Index' | 'Macro' | 'Central Bank' | 'Forex';
  market: 'India' | 'International';
  impact: 'High' | 'Medium' | 'Low';
  description?: string;
};

// Published schedules, checked on the date below. Nothing here updates itself: when a list runs out,
// add the next schedule from the same source. The calendar page hides each event once its day ends.
//   RBI      https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62422
//   MoSPI    https://www.mospi.gov.in/uploads/documents/releaseCalender/1791356248513-ARC_2026_27_Sept_2026.pdf
//   Fed      https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
//   BLS      https://www.bls.gov/schedule/news_release/cpi.htm and /empsit.htm
//   ECB      https://www.ecb.europa.eu/press/calendars/mgcgc/html/index.en.html
//   BoE      https://www.bankofengland.co.uk/monetary-policy/upcoming-mpc-dates
//   BoJ      https://www.boj.or.jp/en/mopo/mpmsche_minu/index.htm
export const SCHEDULE_CHECKED_ON = '6 November 2026';

const india = (
  date: string,
  title: string,
  category: CalendarEvent['category'],
  impact: CalendarEvent['impact'],
  description: string,
): CalendarEvent => ({ date, title, category, market: 'India', impact, description });

const global = (
  date: string,
  title: string,
  category: CalendarEvent['category'],
  impact: CalendarEvent['impact'],
  description: string,
): CalendarEvent => ({ date, title, category, market: 'International', impact, description });

const usCpi = ([date, month]: [string, string]) =>
  global(date, `US CPI Inflation (${month})`, 'Macro', 'High', `US Consumer Price Index for ${month}`);

const usJobs = ([date, month]: [string, string]) =>
  global(date, `US Non-Farm Payrolls (${month})`, 'Macro', 'High', `US Employment Situation report for ${month}`);

const fomc = ([date, days]: [string, string]) =>
  global(date, 'US FOMC Rate Decision', 'Central Bank', 'High', `Federal Reserve meeting on ${days}. Dates stay tentative until the previous meeting confirms them`);

const ecb = ([date, days]: [string, string]) =>
  global(date, 'ECB Rate Decision', 'Central Bank', 'High', `European Central Bank Governing Council meeting on ${days}`);

const boe = (date: string) =>
  global(date, 'Bank of England Decision', 'Central Bank', 'Medium', 'Monetary Policy Committee announcement');

const boj = ([date, days]: [string, string]) =>
  global(date, 'Bank of Japan Decision', 'Central Bank', 'Medium', `Monetary Policy Meeting on ${days}`);

// Company earnings are not listed here because no verified free source for their dates exists.
// The calendar page adds them from Twelve Data on plans that include its earnings endpoint.
export const CALENDAR_EVENTS: CalendarEvent[] = [
  // India: RBI, through February 2027
  india('2026-12-04', 'RBI MPC Rate Decision', 'RBI', 'High', 'Monetary Policy Committee meeting on 2, 3 and 4 December'),
  india('2027-02-05', 'RBI MPC Rate Decision', 'RBI', 'High', 'Monetary Policy Committee meeting on 3, 4 and 5 February'),

  // India: Union Budget. February 1 is the usual date, but no 2027 date has been announced yet.
  india('2027-02-01', 'Union Budget 2027-28 (expected)', 'Macro', 'High', 'Usually presented on 1 February. The date is not yet officially confirmed'),

  // India: MoSPI, through March 2027. MoSPI releases weekend dates on the next working day, as it did
  // with the CPI scheduled for Saturday 12 September 2026, so those dates are moved here too.
  india('2026-11-12', 'India CPI Inflation', 'Macro', 'High', 'All India Consumer Price Index'),
  india('2026-12-14', 'India CPI Inflation', 'Macro', 'High', 'All India Consumer Price Index. Scheduled for Saturday 12 December, so expected on the next working day'),
  india('2027-01-12', 'India CPI Inflation', 'Macro', 'High', 'All India Consumer Price Index'),
  india('2027-02-12', 'India CPI Inflation', 'Macro', 'High', 'All India Consumer Price Index'),
  india('2027-03-12', 'India CPI Inflation', 'Macro', 'High', 'All India Consumer Price Index'),
  india('2026-11-30', 'India GDP Q2 FY27', 'Macro', 'High', 'Quarterly estimates of GDP for Q2, FY 2026-27'),
  india('2027-01-07', 'India GDP First Advance Estimates', 'Macro', 'High', 'First advance estimates of GDP for FY 2026-27'),
  india('2027-02-26', 'India GDP Q3 FY27', 'Macro', 'High', 'Quarterly estimates for Q3 and second advance estimates for FY 2026-27'),
  india('2026-11-30', 'India Industrial Production (IIP)', 'Macro', 'Medium', 'All India Index of Industrial Production. Scheduled for Saturday 28 November, so expected on the next working day'),
  india('2026-12-28', 'India Industrial Production (IIP)', 'Macro', 'Medium', 'All India Index of Industrial Production'),
  india('2027-01-28', 'India Industrial Production (IIP)', 'Macro', 'Medium', 'All India Index of Industrial Production'),
  india('2027-03-01', 'India Industrial Production (IIP)', 'Macro', 'Medium', 'All India Index of Industrial Production. Scheduled for Sunday 28 February, so expected on the next working day'),
  india('2027-03-29', 'India Industrial Production (IIP)', 'Macro', 'Medium', 'All India Index of Industrial Production. Scheduled for Sunday 28 March, so expected on the next working day'),

  // International: through December 2027
  ...([
    ['2026-11-10', 'October 2026'], ['2026-12-10', 'November 2026'], ['2027-01-13', 'December 2026'],
    ['2027-02-11', 'January 2027'], ['2027-03-10', 'February 2027'], ['2027-04-13', 'March 2027'],
    ['2027-05-12', 'April 2027'], ['2027-06-10', 'May 2027'], ['2027-07-14', 'June 2027'],
    ['2027-08-11', 'July 2027'], ['2027-09-14', 'August 2027'], ['2027-10-14', 'September 2027'],
    ['2027-11-10', 'October 2027'], ['2027-12-10', 'November 2027'],
  ] as [string, string][]).map(usCpi),
  ...([
    ['2026-12-04', 'November 2026'], ['2027-01-08', 'December 2026'], ['2027-02-05', 'January 2027'],
    ['2027-03-05', 'February 2027'], ['2027-04-02', 'March 2027'], ['2027-05-07', 'April 2027'],
    ['2027-06-04', 'May 2027'], ['2027-07-02', 'June 2027'], ['2027-08-06', 'July 2027'],
    ['2027-09-03', 'August 2027'], ['2027-10-08', 'September 2027'], ['2027-11-05', 'October 2027'],
    ['2027-12-03', 'November 2027'],
  ] as [string, string][]).map(usJobs),
  ...([
    ['2026-12-09', '8-9 December'], ['2027-01-27', '26-27 January'], ['2027-03-17', '16-17 March'],
    ['2027-04-28', '27-28 April'], ['2027-06-09', '8-9 June'], ['2027-07-28', '27-28 July'],
    ['2027-09-15', '14-15 September'], ['2027-10-27', '26-27 October'], ['2027-12-08', '7-8 December'],
  ] as [string, string][]).map(fomc),
  ...([
    ['2026-12-17', '16-17 December'], ['2027-02-04', '3-4 February'], ['2027-03-18', '17-18 March'],
    ['2027-04-29', '28-29 April'], ['2027-06-10', '9-10 June'], ['2027-07-22', '21-22 July'],
    ['2027-09-09', '8-9 September'], ['2027-10-28', '27-28 October'], ['2027-12-16', '15-16 December'],
  ] as [string, string][]).map(ecb),
  ...['2026-12-17', '2027-02-04', '2027-03-18', '2027-04-29', '2027-06-17', '2027-07-29', '2027-09-16', '2027-11-04', '2027-12-16'].map(boe),
  ...([
    ['2026-12-18', '17-18 December'], ['2027-01-22', '21-22 January'], ['2027-03-18', '17-18 March'],
    ['2027-04-28', '27-28 April'], ['2027-06-11', '10-11 June'], ['2027-07-22', '21-22 July'],
    ['2027-09-22', '21-22 September'], ['2027-10-29', '28-29 October'], ['2027-12-17', '16-17 December'],
  ] as [string, string][]).map(boj),
];
