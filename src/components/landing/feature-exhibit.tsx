'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity, Eye, FlaskConical, GraduationCap, LayoutDashboard, LineChart, Newspaper, PieChart,
} from 'lucide-react';

const FEATURES = [
  { title: 'Market Dashboard', text: 'Follow major market indices.', href: '/dashboard', icon: LayoutDashboard, image: 'dashboard', alt: 'Stockify dashboard with NIFTY 50, SENSEX, BANK NIFTY and an India VIX gauge above a chart' },
  { title: 'Stock Analytics', text: 'Explore stock performance and charts.', href: '/stock/RELIANCE', icon: LineChart, image: 'stock', alt: 'Stockify stock page for Reliance with its price chart' },
  { title: 'Sector Insights', text: 'Understand industry-level market movements.', href: '/insights', icon: PieChart, image: 'sectors', alt: 'Stockify sector heatmap with a tile for each Nifty sector' },
  { title: 'Market News', text: 'Stay informed about financial developments.', href: '/news', icon: Newspaper, image: 'news', alt: 'Stockify news page listing market headlines' },
  { title: 'Fear and Greed Index', text: 'Explore market sentiment.', href: '/fear-greed', icon: Activity, image: 'fear-greed', alt: 'Stockify Fear and Greed Index with its gauge and components' },
  { title: 'What-If Backtesting', text: 'Explore hypothetical investment scenarios.', href: '/backtester', icon: FlaskConical, image: 'backtester', alt: 'Stockify backtester comparing a monthly SIP in Reliance with NIFTY 50' },
  { title: 'Watchlist', text: 'Keep track of selected stocks.', href: '/watchlist', icon: Eye, image: 'watchlist', alt: 'Stockify watchlist page with a stock search field' },
  { title: 'Educational Resources', text: 'Understand financial concepts. Coming soon.', href: '/education', icon: GraduationCap, image: 'education', alt: 'Stockify Education Center with its planned topics, marked coming soon' },
];

const HOLD_MS = 6000;

export default function FeatureExhibit() {
  const [active, setActive] = useState(0);
  const touched = useRef(false);

  // The picture changes slowly on its own until the visitor picks one.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (touched.current || document.hidden) return;
      setActive((value) => (value + 1) % FEATURES.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, []);

  const pick = (index: number) => {
    touched.current = true;
    setActive(index);
  };

  return (
    <ul className="exhibit" data-reveal>
      {FEATURES.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <li key={feature.title} className={index === active ? 'is-active' : undefined}>
            <Link href={feature.href} onMouseEnter={() => pick(index)} onFocus={() => pick(index)}>
              <Icon aria-hidden="true" />
              <span>
                <strong>{feature.title}</strong>
                <span>{feature.text}</span>
              </span>
            </Link>
            <figure data-ui>
              <Image
                src={`/landing/${feature.image}.jpg`}
                alt={feature.alt}
                width={1776}
                height={1140}
                sizes="(max-width: 900px) 100vw, 60vw"
              />
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
