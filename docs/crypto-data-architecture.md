# Crypto Data Architecture

## Overview

BlockDetails uses a server-side crypto data abstraction layer. The frontend never calls CoinGecko or CoinMarketCap directly — all provider logic, normalization, caching, and fallback live on the server.

## Internal API Endpoints

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

## Providers

- **CoinGecko** (primary) — Free tier. Base URL from `COINGECKO_BASE_URL` env var.
- **CoinMarketCMC** (fallback) — Free tier trial endpoints. No API key required for basic listing/quotes.

Provider selection is internal to the server. The client never knows which provider served data.

## Fallback Behavior

1. Primary provider (CoinGecko) is called first.
2. On 429, 502, 503, 504, or network timeout → fallback to CoinMarketCap.
3. Fallback response is normalized into the same internal shape.
4. Client behavior is unchanged regardless of which provider served data.

Fallback does NOT apply to invalid/nonexistent coin IDs — only temporary failures.

## Caching Policy

| Data Type | Strategy | TTL / Directive |
|-----------|----------|-----------------|
| Live price, market cap (derived from price), 24h volume | `no-store` | Always fresh |
| Coin detail (metadata + price) | Server-side compose: cached metadata + fresh price | Metadata 5 min, price no-store |
| Market chart (historical) | Mixed: last hour no-store, older data 1-5 min | Per-interval |
| Coin list, exchange list | Cache | 24h (coins), 5 min (exchanges) |
| Global market data | Cache | 1 min |
| Trending coins | Cache | 5 min |
| Exchange detail, markets | Cache | 10 min (detail), 1 min (markets) |

## Environment Variables

```env
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
# Optional: COINGECKO_API_KEY=your_key_here
```

No `NEXT_PUBLIC_*` crypto variables. All provider keys remain server-only.

## Adding a New Provider

1. Create `lib/crypto/providers/<name>.ts` implementing the provider interface.
2. Add mapping logic in `lib/crypto/mappers/<name>.ts`.
3. Register the provider name in `lib/crypto/service.ts` fallback chain.
