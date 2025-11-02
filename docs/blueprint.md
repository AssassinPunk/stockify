# **App Name**: India Markets Radar

## Core Features:

- Real-time Market Indices: Display live values for NIFTY 50, SENSEX, and BANK NIFTY with key metrics (value, change, percentage change, last updated).
- India VIX Analysis: Present the current India VIX value alongside calculated daily, weekly, monthly, and yearly implied moves using a tool, providing volatility context.
- Interactive Charts: Render interactive line charts for NIFTY 50 and INDIA VIX, allowing users to toggle between 1D, 5D, 1M, 6M, 1Y, and 5Y timeframes.
- Sector Heatmap: Showcase a sector heatmap visualizing percentage changes in NIFTY sector indices, enabling quick identification of leading and lagging sectors.
- Trending Tickers: Surface top gainers, losers, and volume buzzers to highlight significant stock movements.
- Financial News Feed: Aggregate and display financial news articles from various sources, filtered by 'Indices', 'Stocks', and 'Macro' topics.
- API Endpoint Integration: Provide an API endpoint to integrate the India VIX calculation: daily = vix / sqrt(245); weekly = vix / sqrt(52); monthly = vix / sqrt(12); yearly = vix

## Style Guidelines:

- Primary color: Blue (#60A5FA) for highlights and interactive elements.
- Background color: Dark graphite (#0B0F14) to establish a sleek, dark UI.
- Accent colors: Green (#22C55E) for positive changes, red (#EF4444) for negative changes.
- UI font: 'Inter' (sans-serif) for general UI elements and text. Note: currently only Google Fonts are supported.
- Numeric font: 'JetBrains Mono' (monospace) for displaying numeric data for consistent width and readability. Note: currently only Google Fonts are supported.
- Use 'lucide-react' icons to maintain a consistent and modern aesthetic throughout the application.
- Employ rounded cards with subtle shadows and a glassy hover effect to present information in a visually appealing and organized manner.
- Utilize skeleton loaders to provide visual feedback during data loading, enhancing the perceived performance of the application.