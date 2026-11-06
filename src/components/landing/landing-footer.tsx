import Link from 'next/link';
import { Wordmark } from './landing-nav';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Markets', href: '#markets' },
      { label: 'Features', href: '#features' },
      { label: 'About', href: '#about' },
      { label: 'Sign In', href: '/login' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Market Dashboard', href: '/dashboard' },
      { label: 'Sector Insights', href: '/insights' },
      { label: 'Market News', href: '/news' },
      { label: 'Fear and Greed Index', href: '/fear-greed' },
      { label: 'What-If Backtesting', href: '/backtester' },
      { label: 'Watchlist', href: '/watchlist' },
    ],
  },
  {
    title: 'FinPilot',
    links: [
      { label: 'Concept preview', href: '#finpilot' },
      { label: 'How it fits with Stockify', href: '#how' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-about">
          <Wordmark />
          <p>A beginner-friendly stock market analytics platform that makes financial information easier to understand.</p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2>{column.title}</h2>
            {column.links.map((link) =>
              link.href.startsWith('#')
                ? <a key={link.label} href={link.href}>{link.label}</a>
                : <Link key={link.label} href={link.href}>{link.label}</Link>,
            )}
          </nav>
        ))}
      </div>
      <p className="footer-legal">
        Stockify and FinPilot provide general information for educational purposes. They do not provide investment,
        loan or tax advice, and nothing here is a recommendation to buy or sell. Market data may be delayed. All
        investment decisions are made at your own risk, and Stockify is not responsible for any profit or loss.
      </p>
      <p className="footer-legal">© {new Date().getFullYear()} Stockify. All rights reserved.</p>
    </footer>
  );
}
