# BlockDetails

Cryptocurrency dashboard built with Next.js App Router, React, TypeScript, Tailwind and existing shadcn/Base UI components. Root-level `app/`, `components/`, `lib/`; no `src/`.

## Run

Node >=22.18 and pnpm10.33 (pinned in package.json):

```bash
corepack pnpm install
pnpm dev
```

Open http://localhost:3000. Public CoinGecko and supported official CoinMarketCap keyless endpoints work without secrets. For higher quotas, configure server environment variables securely:

- `CRYPTO_PRIMARY_PROVIDER`: `coingecko` (default) or `coinmarketcap`.
- `COINMARKETCAP_API_KEY`: optional; authenticated capabilities depend on your plan.
- `COINGECKO_DEMO_API_KEY`: optional demo key. Legacy `COINGECKO_API_KEY` aliases this, not Pro.
- `COINGECKO_PRO_API_KEY`: explicitly selects the Pro host.

No crypto keys in `NEXT_PUBLIC_*`. Never commit `.env.local`. Provider hosts are fixed, not user-controlled URLs.

## Features

Rankings, currency selection, search, global metrics, coin details/metadata, historical charts, trading pairs, exchanges/detail, categories, trending, top-250 gainers/losers, persistent local watchlist and portfolio. Token navigation uses provider categories rather than pretending a ticker or rank distinguishes tokens.

Portfolio is **local-only USD accounting**, not an exchange or synced account. It supports BUY, SELL, TRANSFER_IN, TRANSFER_OUT, REWARD, AIRDROP and STAKING_REWARD; asset ID, decimal quantity/price/fee, time and notes; edit/delete with validation; JSON backup/restore. Weighted-average cost and BigInt arithmetic calculate holdings, cost, invested value, valuation, realized/unrealized/total P&L, percentages and allocations. Missing prices make valuation unavailable, not zero. Rewards use zero purchase basis; transfers carry cost without pretending to be sales. Full policy is shown in `/portfolio`; this is not a tax engine. Export backups before clearing browser storage.

## Data flow

`provider HTTP -> adapters/validation -> central capability router -> normalized crypto service -> server components / route handlers`

- `lib/crypto/types.ts`: normalized contract; missing values are null.
- `lib/crypto/core.ts`: actual adapters, identity map, routing, bounded6s/provider deadlines and128-entry success cache. 429/5xx/network/timeout/schema/quota failures try a compatible fallback. No scattered provider catches.
- `lib/crypto/service.ts`: server-only secrets and Next persistent cache. Server components call this directly, never a localhost API.
- `lib/crypto/http.ts`: safe HTTP errors; unavailable503, invalid input400, authoritative not-found404.

### Capability matrix

Default primary is CG; the configured preference reverses compatible providers. Every listed operation has response validation. Availability is not identical across plans.

| Capability / HTTP route | CoinGecko | CoinMarketCap fallback | Next revalidation |
|---|---|---|---|
| Markets/quotes `/api/coins` | coins/markets | v3 listings/latest or quotes/latest; keyless | 60s |
| Details `/api/coins/[id]` | coins/id | v2 info + v3 quotes/latest; keyless | 60s |
| Chart `/api/coins/[id]/market_chart` | market_chart; range limits | v3 quotes/historical; key/plan required | 300s |
| Global `/api/global` | global | v1 global-metrics/quotes/latest; keyless | 60s |
| Trending `/api/trending` | search/trending + quotes | v1 trending/latest; key/plan, provider-specific ranking | 300s |
| Search `/api/coins/search?q=` | search | No equivalent substring-search fallback | 300s |
| Categories `/api/categories` | coins/categories/list | No interchangeable taxonomy fallback | 24h |
| Exchanges `/api/exchanges` | exchanges | v1 exchange/listings/latest; key/plan | 300s |
| Exchange `/api/exchanges/[id]` | exchanges/id | exchange quotes/info/pairs; key/plan | 300s |
| Pairs `/api/coins/[id]/markets`, `/api/exchanges/[id]/markets` | coin/exchange tickers | official market-pairs; key/plan | 60s |

All HTTP responses use `{data}`; chart data contains `prices`. Common query parameters: `vs_currency`, `page`, `per_page`; markets additionally accept `ids`, `category`, `order`; charts accept `days`.

Transport is no-store; only validated successes enter caches. Next may serve an older successful result while revalidating. Quotes are cached snapshots, not a streaming price feed. Public-provider IP rate limits can still make capabilities without compatible fallback unavailable; the UI reports that rather than inventing data.

### Identity and limits

CG IDs are canonical. The reviewed cross-provider map currently covers bitcoin1, ethereum1027, solana5426, and exchange binance270. Unmapped CMC assets use `cmc:<id>`; normalized data also carries source slug, symbol and provider IDs. Never join by symbol or assume identical provider slugs. Unmapped CG assets have no safe CMC quote fallback until their mapping is reviewed. Add mappings with independent identity evidence, not fuzzy name matches.

Official [CMC keyless documentation](https://coinmarketcap.com/api/documentation/pro-api-reference/keyless-public-api) defines the `/public-api` endpoints; no undocumented website API is used. Live keyless success codes may be numeric0 or string"0". CMC historical/trending/exchange/pairs access requires applicable authentication/entitlement; fixture tests are not live-plan verification. Long historical ranges may be unavailable.

## Verify

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:runtime
```

`test` runs deterministic Node tests (explicit synthetic provider fixtures) for both fallback directions,429/5xx/timeout/malformed/missing fields/both down, normalization, identity safety, cache behavior and portfolio math/storage protection.

`test:runtime` starts/stops a production server, runs paced real HTTP checks, then installed Chrome in a disposable profile. Set `CHROME_BIN` if Chrome is not in a supported default location; `BLOCKDETAILS_PORT` changes3100. Browser checks exercise portfolio add/edit/reload/oversell, watchlist persistence, page rendering/mobile width and uncaught exceptions. Public API quotas may cause explicit degraded-state UI; API tests still fail if a required live endpoint returns503. Standalone `test:live` and `test:browser` target `BLOCKDETAILS_URL` (default localhost3100). `SKIP_LIVE=1` runs browser-only; `RUNTIME_DEV=1` enables non-minified diagnosis.

Verified2026-09-20:41 unit tests, lint, typecheck, production build;12 live data operations200 and3 invalid queries400; production browser checks passed with no uncaught exceptions. CMC public listings/quotes/details/global were independently confirmed live. Paid CMC paths were not live-verified. These checks do not establish universal asset mapping, unlimited provider availability or complete CoinMarketCap feature parity.
