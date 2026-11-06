import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchIndiaVix, fetchLiveIndianIndices, fetchLiveSectors, fetchYahooChart } from '@/lib/yahoo-finance';
import FeatureExhibit from '@/components/landing/feature-exhibit';
import FinPilotPreview from '@/components/landing/finpilot-preview';
import LandingFooter from '@/components/landing/landing-footer';
import LandingMotion from '@/components/landing/landing-motion';
import LandingNav from '@/components/landing/landing-nav';
import MarketSnapshot from '@/components/landing/market-snapshot';
import ProductFragment, { FinPilotSnippet, MarketSnippet } from '@/components/landing/product-fragment';
import '@/components/landing/landing.css';

export const metadata: Metadata = {
  title: 'Stockify: understand the market, make smarter decisions',
  description:
    'Stockify is a beginner-friendly stock market analytics platform for following Indian markets, with FinPilot, a personal finance assistant in development.',
};

const REASONS = [
  { title: 'Made for beginners', text: 'Market terms and numbers come with plain explanations, so you can start without a finance background.' },
  { title: 'The market in one place', text: 'Indices, charts, sectors, news and sentiment sit together, so you spend less time switching between sites.' },
  { title: 'Numbers you can follow', text: 'India VIX becomes a gauge and sector moves become a heatmap, so patterns are easier to see.' },
  { title: 'Guidance on the way', text: 'FinPilot is in development, and will explain loans, EMIs and major purchases in a conversation.' },
  { title: 'A clean, simple interface', text: 'Stockify is built to feel calm and readable, and to work nothing like a trading terminal.' },
  { title: 'Tools for learning', text: 'What-if backtesting lets you explore past scenarios without putting any money at risk.' },
];

export default async function LandingPage() {
  const [indices, vix, chart, sectors] = await Promise.all([
    fetchLiveIndianIndices(),
    fetchIndiaVix({ policy: { revalidate: 300 } }),
    fetchYahooChart('NIFTY 50').catch(() => null),
    fetchLiveSectors().catch(() => []),
  ]);
  const closes = vix.chartData;
  const vixPreviousClose = closes.length > 1 ? closes[closes.length - 2].value : undefined;

  return (
    <div className="landing" id="top">
      <LandingMotion />
      <LandingNav />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title" className="rise">
            <span>Understand the market.</span> <span>Make smarter decisions.</span>
          </h1>
          <div className="hero-lede rise rise-2">
            <p className="lede">
              Explore market movements, uncover financial insights, and simplify your financial decisions, all in one
              place.
            </p>
            <div className="actions">
              <Link className="btn btn-primary" href="/dashboard">Explore Stockify</Link>
              <a className="btn btn-quiet" href="#finpilot">Discover FinPilot</a>
            </div>
          </div>
          <div className="hero-product rise rise-3">
            <ProductFragment indices={indices} vix={vix.vixData} candles={chart?.['1M'] ?? []} sectors={sectors} />
          </div>
        </section>

        <section className="band" id="markets" aria-labelledby="markets-title">
          <MarketSnapshot initialIndices={indices} initialVix={vix.vixData} vixPreviousClose={vixPreviousClose} />
        </section>

        <section className="band" id="features" aria-labelledby="features-title">
          <div className="band-head">
            <h2 id="features-title" data-reveal>Explore what Stockify does</h2>
            <p className="lede" data-reveal>
              Choose a tool to see its real screen, then open it. These screens were captured from the app on
              6 November 2026, so their figures are not current.
            </p>
          </div>
          <FeatureExhibit />
        </section>

        <section className="field-pilot" id="finpilot" aria-labelledby="finpilot-title">
          <div className="field-inner">
            <h2 id="finpilot-title" data-reveal>Meet FinPilot. Your personal finance companion.</h2>
            <div className="pilot-grid">
              <div className="pilot-copy">
                <p className="lede" data-reveal>
                  Big financial decisions don&apos;t have to be confusing. Ask questions, explore possibilities, and
                  understand the numbers behind your next move.
                </p>
                <p data-reveal>
                  FinPilot is in development, and this is a concept preview. It is planned as a chat assistant inside
                  Stockify for purchases, loans, EMIs and everyday finance questions, offering general educational
                  guidance rather than personalised investment advice.
                </p>
                <p className="pilot-line" data-reveal>
                  Stockify helps you understand the market. FinPilot helps you understand what financial decisions mean
                  for you.
                </p>
                <div className="actions" data-reveal>
                  <a className="btn btn-pilot" href="#how">Explore FinPilot</a>
                </div>
              </div>
              <div data-reveal>
                <FinPilotPreview />
              </div>
            </div>
          </div>
        </section>

        <section className="band" id="how" aria-labelledby="how-title">
          <div className="band-head">
            <h2 id="how-title" data-reveal>How Stockify and FinPilot work together</h2>
            <p className="lede" data-reveal>Stockify tells you what is happening. FinPilot will help you work out what it means for you.</p>
          </div>
          <ol className="journey">
            <li className="journey-field journey-market" data-reveal>
              <div>
                <h3>Understand the market</h3>
                <p>Explore market data, stock performance, and financial indicators through Stockify.</p>
              </div>
              <MarketSnippet indices={indices} />
            </li>
            <li className="journey-field journey-self" data-reveal>
              <span className="journey-join" aria-hidden="true">+</span>
              <div>
                <h3>Understand your finances</h3>
                <p>Use FinPilot to explore personal finance questions and understand financial scenarios.</p>
              </div>
              <FinPilotSnippet />
            </li>
            <li className="journey-field journey-decide" data-reveal>
              <h3>Make informed decisions</h3>
              <p>Bring financial awareness and accessible guidance together, in one platform.</p>
            </li>
          </ol>
        </section>

        <section className="band why" id="about" aria-labelledby="about-title">
          <div className="why-title">
            <h2 id="about-title" data-reveal>Why Stockify?</h2>
            <p className="lede" data-reveal>
              The name joins &ldquo;stock&rdquo; and &ldquo;simplify&rdquo;. It is built for beginner and retail
              investors, students and young earners, and anyone who wants the market explained.
            </p>
          </div>
          <ul className="why-list">
            {REASONS.map((reason) => (
              <li key={reason.title} data-reveal>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="field-cta" aria-labelledby="cta-title">
          <div className="cta-inner">
            <div className="cta-copy">
              <h2 id="cta-title" data-reveal>Your financial journey, made simpler.</h2>
              <p data-reveal>
                Explore the market with Stockify and discover a more accessible way to understand your finances.
              </p>
            </div>
            <div className="cta-actions" data-reveal>
              <Link className="btn btn-ink" href="/signup">Get Started</Link>
              <p>
                Prefer to look first? <Link href="/dashboard">Open the dashboard</Link> without an account.
              </p>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
