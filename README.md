# BlockDetails

A cryptocurrency and exchange information dashboard built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Quick Start

```bash
pnpm install
cp .env.example .env.local  # (optional) add your CoinGecko API key
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  api/              # Server-side API routes (proxy to crypto providers)
    coins/          # Coin listing, detail, chart, search, trending
    exchanges/      # Exchange listing, detail, markets
    global/         # Global market data
  components/       # Reusable UI components
  cryptocurrency/   # Crypto listing, coin detail pages (SSG)
  exchanges/        # Exchange listing page (SSR)
  page.tsx          # Home page with global market stats
lib/
  crypto/           # Crypto data abstraction layer (NEW)
    types.ts        # Internal type definitions
    provider.ts     # Provider interface
    service.ts      # Service layer with fallback logic
    providers/
      coingecko.ts  # CoinGecko provider (primary)
      coinmarketcap.ts  # CoinMarketCap provider (fallback)
    index.ts        # Re-exports for backward compatibility
  crypto.ts         # Backward-compat shim (old imports)
  api.ts            # Backward-compat shim (old API imports)
  exchange.ts       # Backward-compat shim (old exchange imports)
  currency.ts       # Currency formatting utilities
  format.ts         # Price/number formatting helpers
docs/
  crypto-data-architecture.md  # Full architecture spec
```

## Crypto Data Architecture

BlockDetails uses a **server-side crypto data abstraction layer**. The frontend never calls CoinGecko or CoinMarketCap directly — all provider logic, normalization, caching, and fallback live on the server.

### API Endpoints

| Endpoint | Method | Description | Cache |
|----------|--------|-------------|-------|
| `/api/coins` | GET | List top coins (paginated) | 1 min |
| `/api/coins/[slug]` | GET | Single coin detail + live price | 5 min (metadata) / no-store (price) |
| `/api/coins/[slug]/chart` | GET | Historical price chart data | 1 min (last hour) / 5 min (older) |
| `/api/coins/trending` | GET | Trending coins | 5 min |
| `/api/coins/search` | GET | Search coins by query | 1 min |
| `/api/coins/list` | GET | Full coin list (for static params) | 24 hours |
| `/api/global` | GET | Global market data | 1 min |
| `/api/exchanges` | GET | Exchange list (paginated) | 5 min |
| `/api/exchanges/[slug]` | GET | Single exchange detail | 10 min |
| `/api/exchanges/[slug]/markets` | GET | Exchange markets/trading pairs | 1 min |

### Providers

- **CoinGecko** (primary) — Free tier. Base URL from `COINGECKO_BASE_URL` env var.
- **CoinMarketCap** (fallback) — Free tier trial endpoints. No API key required for basic listing/quotes.

Provider selection is internal to the server. The client never knows which provider served data.

### Fallback Behavior

1. Primary provider (CoinGecko) is called first.
2. On 429, 502, 503, 504, or network timeout → fallback to CoinMarketCap.
3. Fallback response is normalized into the same internal shape.
4. Client behavior is unchanged regardless of which provider served data.

### Environment Variables

```env
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
# COINGECKO_API_KEY=your_key_here  (optional, for paid tier)
```

No `NEXT_PUBLIC_*` crypto variables. All provider keys remain server-only.

## Pages

| Route | Description | Rendering |
|-------|-------------|-----------|
| `/` | Home — global market stats | SSR |
| `/cryptocurrency` | Coin listing with sorting, pagination, currency filter | SSG (dynamic) |
| `/cryptocurrency/[slug]` | Coin detail page with chart, stats, links | SSG (dynamic) |
| `/cryptocurrency/coins` | All coins listing | SSR |
| `/cryptocurrency/tokens` | Token listing (filtered) | SSR |
| `/exchanges` | Exchange listing with pagination | SSR |
| `/exchanges/[slug]` | Exchange detail + trading pairs | SSG (dynamic) |

## Features

- **Multi-currency support** — switch between USD, EUR, GBP, JPY, etc.
- **Sorting & pagination** — sort by rank, price, volume, change; paginate through results.
- **Search dialog** — fuzzy search coins via `/api/coins/search`.
- **Watchlist** — save/remove favorite coins (localStorage).
- **Dark/light theme** — system-aware with manual toggle.
- **Responsive design** — mobile-first layout with shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Data fetching**: Server components + API routes (no client-side crypto calls)
- **Crypto providers**: CoinGecko (primary), CoinMarketCap (fallback)

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm start      # Start production server
```

## Adding a New Provider

1. Create `lib/crypto/providers/<name>.ts` implementing the `CryptoProvider` interface.
2. Add mapping logic for all 9 methods (chart, trending, search may return empty for limited tiers).
3. Register the provider name in `lib/crypto/service.ts` fallback chain.

See `docs/crypto-data-architecture.md` for the full spec.
