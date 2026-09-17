# Crypto Cache Audit — Fixes Applied

## Problem

Current/live price data was being cached across the stack, making prices stale for up to 5 minutes. The provider layer was correct (price endpoints used `no-store`), but Next.js App Router's default caching and ISR revalidate settings silently cached rendered pages containing price data.

## Root Cause

Next.js App Router defaults all `fetch()` calls inside Server Components to `force-cache` (5 min ISR). Two layers were affected:

1. **ISR `revalidate = 300`** on detail pages cached the entire rendered HTML (including `current_price`) for 5 minutes.
2. **Missing `cache: 'no-store'`** on client-side fetches inside RSCs — Next.js defaults to caching, so price data from API routes was cached at the fetch level even though the API route itself returned no-store.

## Files Changed

### Removed stale ISR revalidate (2 files)
- `app/cryptocurrency/[slug]/page.tsx` — removed `export const revalidate = 300`. Coin detail includes `current_price`, price changes, ATH/ATL — all must be fresh.
- `app/exchanges/[slug]/page.tsx` — removed `export const revalidate = 300`. Exchange markets include `last_price` per trading pair.

### Added explicit no-store on fetch calls (5 files)
- `app/page.tsx` — home page fetches `/api/coins` (contains `current_price`, 1h/24h/7d changes). Added `{ cache: 'no-store' }`.
- `app/cryptocurrency/page.tsx` — coin listing page fetches `/api/coins`. Added `{ cache: 'no-store' }`.
- `app/cryptocurrency/tokens/page.tsx` — token listing page fetches `/api/coins`. Added `{ cache: 'no-store' }`.
- `app/cryptocurrency/coins/page.tsx` — all coins page fetches `/api/coins`. Added `{ cache: 'no-store' }`.
- `app/exchanges/[slug]/page.tsx` — exchange markets fetch contains `last_price`. Added `{ cache: 'no-store' }`.

### Updated documentation (2 files)
- `README.md` — corrected cache column to reflect actual behavior per endpoint.
- `docs/crypto-data-architecture.md` — same correction for the architecture spec table.

## Cache Matrix (After Fixes)

| Endpoint | Contains Price? | Cache Behavior |
|---|---|---|
| `/api/coins` | ✅ `current_price`, 1h/24h/7d changes | **no-store** (provider + route) |
| `/api/coins/[slug]` | ✅ `current_price`, chart prices | **no-store** (provider + route) |
| `/api/coins/[slug]/chart` | ✅ time-series prices | **no-store** (provider) |
| `/api/coins/trending` | ❌ rank + image only | 5 min (safe) |
| `/api/coins/search` | ❌ rank + image only | **no-store** (provider) |
| `/api/coins/list` | ❌ id/symbol/name only | 24 hours (safe) |
| `/api/global` | ❌ totals, dominance only | 1 min (safe) |
| `/api/exchanges` | ❌ volume, trust score only | 5 min (safe) |
| `/api/exchanges/[slug]` | ❌ no price fields | 10 min (safe) |
| `/api/exchanges/[slug]/markets` | ✅ `last_price` per pair | **no-store** (provider + route) |

## What Was Already Correct (No Changes)

- Provider layer (`lib/crypto/providers/coingecko.ts`): All price endpoints use `cache: 'no-store'`. Non-price endpoints correctly use `force-cache` with appropriate TTLs.
- `/api/coins/[slug]` route: Explicitly sets `Cache-Control: no-store, no-cache`.
- Trending/search/list/global/exchanges endpoints: Correctly cached (no price data in their responses).

## Build Verification

`pnpm run build` passes. All routes render correctly as Dynamic (server-rendered on demand) for price-containing pages, with appropriate SSG/SSG+static params for non-price pages.
