# Stockify

A real-time Indian and global stock market dashboard built with Next.js 15, featuring live market data, interactive charts, technical indicators, an investment backtester, a custom Fear & Greed index, and AI-generated market briefs.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.3.8-000000?logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white">
</p>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [AI Layer](#ai-layer)
- [Usage](#usage)
- [Implementation Highlights](#implementation-highlights)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)

---

## Overview

Retail investors tracking Indian markets typically juggle several tools: one site for index levels, another for charts, a third for volatility data, and a separate spreadsheet for watchlists and return calculations. Free, real-time market APIs for Indian exchanges are scarce, which makes building a single consolidated view non-trivial.

Stockify consolidates that workflow into one dashboard. It tracks NIFTY 50, SENSEX, BANK NIFTY and India VIX alongside 85 individual equities, 12 commodity and forex instruments, and global indices — with interactive charts, technical overlays, a SIP/lumpsum backtester, and a market sentiment index computed from live data.

Market data is sourced from Yahoo Finance's public chart endpoints through a dedicated adapter layer, with Twelve Data used for supplementary quote and earnings data. Every upstream call degrades gracefully, so a single failing data source never takes the dashboard down.

## Key Features

| Feature | Description |
| --- | --- |
| **Live market dashboard** | NIFTY 50, SENSEX and BANK NIFTY with price, absolute change, percentage change and last-updated timestamp in IST |
| **India VIX analysis** | Live volatility gauge with implied daily, weekly, monthly and yearly moves, risk-zone classification and historical percentile |
| **Interactive charts** | Candlestick and area modes across 1D / 5D / 1M / 6M / 1Y timeframes, powered by TradingView's `lightweight-charts` |
| **Technical indicators** | 20-period moving average overlay and a synchronised 14-period RSI pane |
| **Multi-symbol comparison** | Overlay additional tickers on the main chart for relative performance, each in a distinct colour |
| **Watchlist** | Add/remove tickers with live quotes, inline sparklines, and return-since-added. Stored in `localStorage` for guests and synced to PostgreSQL when signed in |
| **Price alerts** | Client-side above/below price alerts that fire an in-app toast while the tab is open |
| **Sector heatmap** | Live performance across nine Nifty sector indices (India) and eleven SPDR sector ETFs (US) |
| **Trending tickers** | Top gainers and losers computed dynamically from live quotes across the ticker registry |
| **Fear & Greed Index** | Custom composite sentiment score from four weighted sub-indicators — volatility, momentum, breadth and safe-haven demand |
| **What-If Backtester** | Simulates SIP or lumpsum investments over 1, 2, 3 or 5 years against a NIFTY 50 or S&P 500 benchmark, reporting total return, CAGR, and best/worst month |
| **Commodities & forex** | Gold, silver, platinum, copper, crude, Brent, natural gas plus five currency pairs, each with a detail page |
| **International dashboard** | S&P 500, NASDAQ and FTSE 100 with their own trending tickers, sectors and news |
| **News feed** | Live financial headlines from Yahoo Finance, auto-categorised into Indices / Stocks / Macro |
| **Economic calendar** | Static macro, RBI and central-bank events combined with live earnings dates from Twelve Data |
| **AI market briefs** | On-demand Gemini-generated market summaries with headline, outlook, sentiment label and three key risks |
| **Authentication** | Email/password and Google OAuth via NextAuth, with bcrypt password hashing |

> **Note:** The Education Center (`/education`) is currently a placeholder page marked "Coming Soon" in the UI.

## Tech Stack

### Framework and Language

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js | 15.3.8 | App Router, React Server Components, route handlers, Server Actions |
| React | 18.3 | UI runtime |
| TypeScript | 5 | Static typing across domain models, API payloads and AI schemas (`strict: true`) |

### Frontend

| Technology | Purpose |
| --- | --- |
| Tailwind CSS 3.4 | Utility styling with HSL CSS-variable design tokens |
| shadcn/ui | Component layer generated into `src/components/ui/` (not an npm dependency) |
| Radix UI | 21 unstyled, accessible primitives underpinning the UI components |
| lightweight-charts 5.1 | Candlestick and area charts with crosshair and time-scale sync |
| Recharts 2.15 | Declarative charts for the VIX gauge, sector heatmap and backtester |
| lucide-react | Icon set |
| class-variance-authority | Typed component variants |
| clsx + tailwind-merge | The `cn()` class-composition helper |
| react-hook-form + Zod resolvers | Form state and validation |

### Backend and Data

| Technology | Purpose |
| --- | --- |
| Prisma 7 | Type-safe PostgreSQL access and schema management |
| PostgreSQL | Users, wishlists and NextAuth account storage |
| NextAuth 4.24 | Credentials and Google OAuth providers, JWT sessions |
| bcryptjs | Password hashing at cost factor 12 |
| Zod 3.24 | Runtime validation of API request bodies and AI output schemas |
| Yahoo Finance (public endpoints) | Primary market data source — quotes, OHLCV, news, fundamentals |
| Twelve Data | Supplementary quotes and live earnings calendar data |

### AI

| Technology | Purpose |
| --- | --- |
| Genkit 1.20 | Flow definition, prompt templating, schema-constrained output |
| Google Gemini 2.5 Flash | Model backing all AI flows |

## Project Structure

Only significant directories and files are shown.

```
stockify/
├── prisma/
│   └── schema.prisma              # User, Wishlist, Account, Session, VerificationToken
├── prisma.config.ts               # Prisma 7 config; reads DATABASE_URL
├── src/
│   ├── ai/
│   │   ├── genkit.ts              # Genkit instance, Gemini 2.5 Flash
│   │   ├── dev.ts                 # Local Genkit dev entrypoint
│   │   └── flows/
│   │       ├── generate-market-brief.ts
│   │       ├── generate-international-brief.ts
│   │       ├── summarize-market-news.ts
│   │       └── explain-india-vix-insights.ts
│   ├── app/
│   │   ├── layout.tsx             # Root layout: session provider, sidebar, toaster
│   │   ├── page.tsx               # India markets dashboard (Server Component)
│   │   ├── international/         # Global markets dashboard
│   │   ├── watchlist/             # Watchlist with local + DB sync
│   │   ├── insights/              # AI briefs, movers, sectors, news digest
│   │   ├── backtester/            # SIP / lumpsum simulator
│   │   ├── fear-greed/            # Composite sentiment index
│   │   ├── calendar/              # Economic and earnings calendar
│   │   ├── news/                  # Combined news hub
│   │   ├── education/             # Placeholder page
│   │   ├── stock/[symbol]/        # Per-stock detail page
│   │   ├── commodity/[id]/        # Per-commodity detail page
│   │   ├── login/ signup/ forgot-password/
│   │   └── api/                   # Route handlers (see API Endpoints)
│   ├── components/
│   │   ├── dashboard/             # Charts, tickers, heatmap, news, VIX widgets
│   │   ├── insights/              # AI brief cards, movers, sector cards
│   │   ├── fear-greed/            # Gauge
│   │   ├── providers/             # NextAuth SessionProvider client wrapper
│   │   └── ui/                    # shadcn/ui components
│   ├── hooks/
│   │   ├── use-realtime-price.ts  # Subscribes to the realtime service
│   │   ├── useLiveMarket.ts       # Polls Twelve Data quotes
│   │   ├── use-debounce.ts
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── yahoo-finance.ts       # Yahoo adapter: quotes, charts, news, sectors
│   │   ├── data.ts                # TICKER_REGISTRY — single source of truth
│   │   ├── realtime-service.ts    # Pub/sub polling singleton
│   │   ├── indicators.ts          # MA, RSI, ADL
│   │   ├── vix.ts                 # Implied moves, risk zones, percentile
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── marketData.ts          # Twelve Data quote fetching
│   │   ├── commodities-data.ts    # Commodity and forex registry
│   │   ├── calendar-data.ts       # Static economic events
│   │   ├── format.ts              # Intl number formatting (en-IN / en-US)
│   │   └── utils.ts               # cn() helper
│   ├── types/
│   │   ├── market.ts
│   │   └── next-auth.d.ts         # Module augmentation adding user.id
│   └── firebase/                  # Legacy Firebase layer (see Known Limitations)
├── tailwind.config.ts
├── next.config.ts
├── components.json                # shadcn/ui configuration
└── package.json
```

## How It Works

The application separates market data from user data into two distinct paths.

**Market data (read path)** — anonymous and cache-heavy. Pages such as `src/app/page.tsx` are async Server Components that fetch from the Yahoo adapter inside a single `Promise.all`, so six upstream calls resolve in parallel rather than as a waterfall. The HTML is rendered server-side with data already populated. Client components then poll route handlers for live updates.

**User data (write path)** — authenticated and never cached. Client components call `/api/wishlist`, which resolves the session via `getServerSession`, validates the request body with Zod, and queries Prisma scoped to `session.user.id`.

**The Yahoo adapter** (`src/lib/yahoo-finance.ts`) is the core of the data layer. Yahoo returns columnar data — a `timestamp[]` array alongside separate `open[]`, `high[]`, `low[]`, `close[]` and `volume[]` arrays, with `null` holes for non-trading intervals. The adapter normalises this into the app's own `ChartDataPoint` type, converts epoch seconds to ISO strings, and skips null bars. It also maps internal symbols to Yahoo's conventions: NSE equities get a `.NS` suffix, indices use a `^` prefix, futures use `=F` and forex uses `=X`.

**Caching** operates in three tiers:

| Tier | Mechanism | Example |
| --- | --- | --- |
| Server data cache | `next: { revalidate: n }` per fetch | VIX history 6h, fundamentals 1h, news 10m, sectors 5m, quotes 60s |
| HTTP cache | `Cache-Control` response headers | `/api/quotes/bulk` uses `max-age=60, stale-while-revalidate=30` |
| Client memory | `Map` inside the realtime singleton | New subscribers receive the last known price immediately |

**Live updates** are handled by `RealtimeDataService`, a module-level pub/sub singleton that polls `/api/quotes/bulk` every 30 seconds and fans results out to a `Set` of listeners. This means eight components displaying eight symbols cause one network request per tick rather than eight. The main chart runs its own adaptive polling interval (5s on 1D, 10s on 5D, 30s otherwise).

## Prerequisites

- **Node.js 20 or later** (the workspace configuration in `.idx/dev.nix` pins Node 20)
- **npm** (the repository uses `package-lock.json`)
- **A PostgreSQL database** — local or hosted (Neon, Supabase, Railway, etc.)
- **A Google Gemini API key** — required for the AI brief features
- **A Twelve Data API key** — optional; used for the earnings calendar and the Twelve Data quote route
- **Google OAuth credentials** — optional; required only for Google sign-in

## Environment Variables

Create a `.env` file in the project root. This file is gitignored and is never committed.

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string, read by `prisma.config.ts` |
| `NEXTAUTH_SECRET` | Yes | Secret used to sign NextAuth JWTs. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Base URL of the app — `http://localhost:9002` in development |
| `GEMINI_API_KEY` | Yes (for AI features) | Google Gemini API key used by the Genkit `googleAI` plugin |
| `TWELVE_DATA_API_KEY` | Optional | Enables the live earnings calendar and `/api/market/quotes`. Features degrade silently when absent |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID; required for Google sign-in |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |

Example `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/stockify"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:9002"
GEMINI_API_KEY="your-gemini-api-key"
TWELVE_DATA_API_KEY="your-twelve-data-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

> Yahoo Finance endpoints require no API key, so the core dashboard, charts, watchlist and backtester work without any third-party keys once the database is configured.

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/AssassinPunk/stockify.git
cd stockify
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root using the table above as a reference.

**4. Set up the database**

Generate the Prisma client and apply the schema to your database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

The repository does not include a `prisma/migrations/` directory, so the command above creates the initial migration. Alternatively, to push the schema without creating migration files:

```bash
npx prisma db push
```

## Running the Project

**Development server** — runs on port **9002**:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002).

**Production build:**

```bash
npm run build
npm run start
```

**Genkit developer UI** — inspect and test AI flows locally:

```bash
npm run genkit:dev
```

> This script invokes `tsx`, which is not declared in `package.json`. Install it first with `npm install -D tsx` if the command fails.

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `next dev -p 9002` | Start the development server on port 9002 |
| `build` | `next build` | Create a production build |
| `start` | `next start` | Serve the production build |
| `lint` | `next lint` | Run ESLint |
| `typecheck` | `tsc --noEmit` | Type-check without emitting output |
| `genkit:dev` | `genkit start -- tsx src/ai/dev.ts` | Launch the Genkit developer UI |
| `genkit:watch` | `genkit start -- tsx --watch src/ai/dev.ts` | Genkit developer UI with file watching |

## API Endpoints

All route handlers live under `src/app/api/`.

### Market Data

| Method | Endpoint | Query Parameters | Description |
| --- | --- | --- | --- |
| `GET` | `/api/quote` | `symbol` | Single quote with price, change, percent change and a sparkline series |
| `GET` | `/api/quotes/bulk` | `symbols` (comma-separated, max 50) | Batch quotes keyed by symbol; failed symbols are omitted |
| `GET` | `/api/chart` | `symbol` | OHLCV data across all five timeframes |
| `GET` | `/api/indices` | — | NIFTY 50, SENSEX and BANK NIFTY |
| `GET` | `/api/vix` | — | Live India VIX value plus intraday series |
| `GET` | `/api/fundamentals` | `symbol` | Market cap, P/E, forward P/E, EPS, dividend yield, 52-week range, beta |
| `GET` | `/api/commodities` | — | Live prices for all 12 commodity and forex instruments |
| `GET` | `/api/market/quotes` | — | Index quotes via Twelve Data |

### Analytics

| Method | Endpoint | Query Parameters | Description |
| --- | --- | --- | --- |
| `GET` | `/api/fear-greed` | — | Composite sentiment score with its four weighted components |
| `GET` | `/api/backtest` | `symbol`, `amount`, `type` (`sip`\|`lumpsum`), `period` (`1Y`, `2Y`, `3Y`, `5Y`), `currency` | Investment simulation with benchmark comparison and a monthly timeline |

### Authentication and User Data

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET`/`POST` | `/api/auth/[...nextauth]` | — | NextAuth catch-all: sign-in, callback, session, CSRF, sign-out |
| `POST` | `/api/auth/register` | — | Create an account. Validates with Zod, hashes with bcrypt (cost 12), returns `409` on duplicate email |
| `GET` | `/api/wishlist` | Required | Return the signed-in user's watchlist |
| `POST` | `/api/wishlist` | Required | Add a symbol. Returns `409` if it is already present |
| `DELETE` | `/api/wishlist` | Required | Remove a symbol, scoped to the session user |

Authenticated endpoints return `401` when no valid session is present.

## Database

PostgreSQL accessed through Prisma. The schema is defined in `prisma/schema.prisma`, and the connection URL is supplied by `prisma.config.ts` from `DATABASE_URL`.

| Model | Table | Purpose |
| --- | --- | --- |
| `User` | `users` | Account records. `password_hash` is nullable so OAuth-only users have no password |
| `Wishlist` | `wishlists` | Saved tickers, unique per `[user_id, stock_symbol]`, cascade-deleted with the user |
| `Account` | `accounts` | NextAuth OAuth provider links, unique per `[provider, providerAccountId]` |
| `Session` | `sessions` | Required by the Prisma adapter schema. Unused at runtime because sessions use the JWT strategy |
| `VerificationToken` | `verification_tokens` | Required by the NextAuth adapter schema |

Notable schema decisions:

- **`cuid()` primary keys** rather than auto-incrementing integers, so IDs are not enumerable and do not leak row counts.
- **Composite unique constraint** `@@unique([user_id, stock_symbol])` enforces one row per symbol per user at the database level rather than in application code.
- **`onDelete: Cascade`** on user relations removes wishlists and accounts atomically.
- **`@@map`** keeps idiomatic PascalCase models in TypeScript while using snake_case plural table names in Postgres.

## AI Layer

Four Genkit flows live in `src/ai/flows/`, all backed by Gemini 2.5 Flash configured once in `src/ai/genkit.ts`.

| Flow | Exported function | Output |
| --- | --- | --- |
| `marketBriefFlow` | `generateMarketBrief` | Headline, summary, outlook, sentiment label, three key risks |
| `intlBriefFlow` | `generateInternationalBrief` | The same structure for global markets |
| `summarizeMarketNewsFlow` | `summarizeMarketNews` | Concise summary of supplied headlines |
| `explainIndiaVIXFlow` | `explainIndiaVIX` | Plain-language explanation of current VIX levels |

Each flow declares a Zod schema for both input and output. Passing the output schema to `ai.definePrompt` constrains generation to that JSON shape and validates the result, so consuming components can read typed fields such as `result.sentiment` without parsing model text. Prompts use Handlebars templating to interpolate live market figures, which grounds the model in supplied data rather than recalled knowledge.

Flow files are marked `'use server'`, so they are invoked directly from client components as Server Actions — no hand-written API route or fetch client, and the Gemini API key never leaves the server.

## Usage

1. **Browse the dashboard.** The landing page shows live Indian indices, the VIX gauge, a commodity strip, the main chart, sector heatmap, trending tickers and news. Switch to `/international` for global markets.
2. **Explore a chart.** Use the ticker selector to change symbols, toggle between candlestick and area modes, switch timeframes, enable the MA(20) or RSI(14) overlays, or add comparison tickers.
3. **Build a watchlist.** Add tickers from `/watchlist`. Entries persist in `localStorage` immediately; signing in syncs them to PostgreSQL and merges any existing server-side entries.
4. **Set a price alert.** Choose an above or below threshold on any watchlist row. Alerts fire as a toast while the tab is open and are removed once triggered.
5. **Run a backtest.** On `/backtester`, pick a ticker, amount, SIP or lumpsum, and a period of 1, 2, 3 or 5 years. Results include total return, CAGR, best and worst month, and a benchmark comparison chart.
6. **Check sentiment.** `/fear-greed` shows the composite score and a breakdown of each weighted component.
7. **Generate an AI brief.** On `/insights`, click generate to produce a market summary from the current live figures.

## Implementation Highlights

**Adapter pattern for market data.** Every Yahoo-specific detail — URL shapes, header requirements, symbol conventions, columnar response parsing — is isolated inside `src/lib/yahoo-finance.ts` behind functions returning the app's own types. Swapping data providers means rewriting one file rather than touching components.

**Graceful degradation throughout.** `fetchLiveSectors` uses `Promise.allSettled` with an index-aligned fallback so one failing sector renders as zero rather than blanking the heatmap. `/api/fundamentals` chains three sources — Yahoo `v10/quoteSummary`, then `v8/chart` metadata, then a typed all-null object — so the UI never crashes on missing fields.

**A single ticker registry.** `TICKER_REGISTRY` in `src/lib/data.ts` stores only metadata — symbol, display name, currency, optional Yahoo override. Prices are never stored, so there is no stale hardcoded data, and adding a ticker makes it available across search, charts, comparison, watchlist and backtester at once.

**Pub/sub over per-component polling.** `RealtimeDataService` uses a `Set` of listeners for O(1) subscribe and unsubscribe, returns its own unsubscribe closure so React effect cleanup is a one-liner, replays its cache to new subscribers, and guards `setInterval` behind a `typeof window` check to avoid leaking timers during server rendering.

**Offline-first watchlist sync.** Local state loads from `localStorage` first for instant rendering, then merges server rows as a union once the session resolves. Writes are optimistic — local state updates before the API call — and the three-state `useSession` status is handled explicitly so the loading state does not flash the guest view.

**Careful React lifecycle management around an imperative chart library.** The chart effect guards against zero-size containers, retries initialisation through a `ResizeObserver`, and uses `destroyed` and `initDone` flags so observer callbacks cannot construct a chart after unmount or double-initialise.

**Security practices.** Passwords hashed with bcrypt at cost 12; `authorize` returns an identical `null` for every failure mode to prevent user enumeration; registration responses use an explicit Prisma `select` so the hash can never leak; all wishlist queries are scoped to `session.user.id` from the signed cookie rather than a client-supplied ID; and third-party API keys are read only from server-side environment variables.

## Known Limitations

Documented honestly so contributors know what they are working with.

- **No automated tests.** There is no test suite in the repository.
- **Legacy Firebase layer.** `src/firebase/` remains from the original Firebase Studio scaffold. The app migrated to NextAuth and Prisma, but `/forgot-password` still calls Firebase's `sendPasswordResetEmail`, and `FirebaseClientProvider` is not mounted in the root layout — so password reset is non-functional in its current state.
- **Build checks disabled.** `next.config.ts` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` to `true`, so type and lint errors do not fail the build.
- **Unofficial data source.** Yahoo Finance's chart endpoints are undocumented and carry no SLA. The app sends a browser-like `User-Agent` and relies on fallbacks when calls fail.
- **No rate limiting** on route handlers or Server Actions.
- **Polling interval mismatch.** `useLiveMarket` polls every 3 seconds against Twelve Data, whose free tier allows 8 requests per minute.
- **Duplicated symbol mapping.** The Yahoo symbol translation is reimplemented in the adapter and in four route handlers, and the `/api/fundamentals` copy has drifted from the shared registry.
- **Unused dependencies.** `socket.io-client` and `patch-package` are declared but not used.
- **Watchlist sync is additive only.** Deletions do not propagate between devices, and optimistic writes have no rollback if the API call fails.

## Future Improvements

- Add a test suite — unit tests for `lib/indicators.ts`, `lib/vix.ts` and the backtest simulator, plus end-to-end coverage of the auth flow.
- Replace CAGR with XIRR in the backtester, since CAGR is not a correct annualisation for staggered SIP cash flows.
- Consolidate symbol mapping into a single exported helper in `src/lib/data.ts`.
- Use `series.update()` for live chart bars instead of rebuilding the chart on every poll.
- Add rate limiting, error tracking and structured logging.
- Reference-count subscribers in the realtime service and pause polling on hidden tabs.
- Remove the legacy Firebase layer and reimplement password reset through NextAuth.
- Move watchlist metadata out of the `notes` JSON string into dedicated typed columns.
- Add `error.tsx` and `loading.tsx` boundaries per route segment.
- Build out the Education Center.

## Contributing

Contributions are welcome.

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes, keeping to the existing TypeScript and Tailwind conventions.
3. Verify types and linting before committing:
   ```bash
   npm run typecheck
   npm run lint
   ```
4. Commit using a descriptive message and open a pull request describing the change and its rationale.

When adding a new ticker, add it to `TICKER_REGISTRY` in `src/lib/data.ts` — it will then be available across every feature automatically.

## Disclaimer

Stockify is an educational project. Market data is sourced from public third-party endpoints and may be delayed, incomplete or inaccurate. Nothing in this application constitutes financial advice. All investment decisions are made at your own risk.
