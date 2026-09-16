# BlockDetails Feature Audit

## Executive Summary

BlockDetails is a **partially functional** cryptocurrency market-data application built on Next.js 15 with CoinGecko's free API. It has a solid foundation — real data flows from the API to the UI across several pages — but it's missing key interactive features, has some broken/incomplete areas, and lacks polish that would make it feel like a complete product.

**Strongest areas:** Coin listing page with real data, coin detail pages with charts, search dialog, theme system, currency selector on most pages.

**Biggest missing areas:** Sorting/filtering/pagination in the coin table, no gainers/losers page, no trending/gainers discovery pages, no portfolio or comparison feature, limited currency persistence, no robots.txt/sitemap/structured data.

**Maturity:** ~40% feature-complete as a crypto market-data product. It works well enough to be useful for browsing coins and exchanges, but feels like a prototype rather than a finished product.

---

## Current Feature Matrix

| Area | Feature | Status | Evidence | Notes |
|------|---------|--------|----------|-------|
| Market | Global market stats (market cap, volume, BTC dominance) | ✅ IMPLEMENTED | `src/app/cryptocurrency/page.tsx:37-44` — calls `/global_data`, renders 4 stat cards | Works on Coins page only; not on homepage (redirects) or Tokens/Exchanges pages |
| Market | BTC dominance | ✅ IMPLEMENTED | `src/app/cryptocurrency/page.tsx:41` | ETH dominance is NOT shown despite being in the API response |
| Market | Trending coins | ✅ IMPLEMENTED | `src/app/cryptocurrency/page.tsx:60-75` — calls `/search/trending`, renders horizontal scroll cards | Works; links to coin detail pages correctly |
| Market | Top gainers/losers | ⚪ MISSING | No page, no API call | CoinGecko provides this via `/coins/markets` with `order: market_cap_gainers_desc` / `market_cap_losers_desc` |
| Market | Recently added coins | ⚪ MISSING | No page, no API call | CoinGecko provides via `/coins/markets` with `order: newly_listed_desc` |
| Coins | Coin listing table (rank, name, symbol, price, 1h/24h/7d changes, market cap, volume) | ✅ IMPLEMENTED | `src/app/cryptocurrency/page.tsx:96-147` — full table with all columns | Works; responsive hiding on mobile (hidden sm/table-cell, hidden md/table-cell) |
| Coins | Sparkline chart per coin | ⚪ MISSING (API supports it, UI doesn't render it) | `getCoins()` accepts `sparkline: true` but page passes `false` (line 25) | CoinGecko returns `sparkline.price[]`; no sparkline rendering in the table |
| Coins | Sorting by column | ⚪ MISSING | No sort state, no `order` param changes in the API call | CoinGecko supports `order: market_cap_desc`, `price_change_24h_desc`, etc. |
| Coins | Pagination | 🟡 PARTIAL | `page` param passed to API (line 25), but no pagination UI (prev/next/page numbers) | API supports `per_page` + `page`; only page 1 is fetched, no navigation UI |
| Coins | Currency selector (USD/EUR/GBP/JPY/AUD/PHP) | ✅ IMPLEMENTED | `src/app/cryptocurrency/page.tsx:47-57` — links update URL query param | Works on Coins page; NOT on Tokens (only 4 currencies), NOT on Exchanges (only 3); NOT persisted |
| Coins | Watchlist (localStorage) | ✅ IMPLEMENTED | `src/lib/storage.ts` — get/toggle/isWatchlisted; used in coin table and detail page | Works but only per-page state (useState on mount); no cross-page sync |
| Coins | Coin detail page (price, market cap, supply, ATH/ATL, description, links) | ✅ IMPLEMENTED | `src/app/cryptocurrency/[slug]/page.tsx` — full detail view with sanitized HTML | Works; hardcoded to USD only (line 32: `const currency = 'usd'`) |
| Coins | Coin detail — FDV (fully diluted valuation) | 🟡 PARTIAL | Not explicitly shown; `market_data.current_price` exists but FDV = price × total_supply is not computed/displayed | CoinGecko provides `market_data.fully_diluted_valuation` — not rendered |
| Coins | Coin detail — 30d/60d/1y price changes | ⚪ MISSING | API returns `price_change_percentage_30d/60d/1y` but UI only shows 1h, 24h, 7d | Badge rendering stops at 7d (lines 65-75) |
| Coins | Coin detail — categories/tags | ✅ IMPLEMENTED | `src/app/cryptocurrency/[slug]/page.tsx:157-163` — renders category badges | Works |
| Coins | Coin detail — contract addresses | ⚪ MISSING (API provides, UI doesn't show) | `CoinDetail` type has no contract_address field; CoinGecko returns it on platform coins | Not displayed anywhere in the UI |
| Coins | Compare coins | ⚪ MISSING | No `/compare` route, no comparison UI | Would be a useful P1 feature |
| Coins | Shareable coin pages | 🟡 PARTIAL | OpenGraph metadata exists on layout and page level; no share button or dynamic OG per-coin | OG title/description are static strings, not coin-specific |
| Charts | Historical price chart (1D/7D/1M/3M/1Y/MAX) | ✅ IMPLEMENTED | `src/app/components/coin-chart.tsx` — Recharts AreaChart with timeframe selector, localStorage persistence | Works; uses Next.js API route proxy (`/api/coins/[coinId]/market_chart`) |
| Charts | Chart responsive behavior | ✅ IMPLEMENTED | `ResponsiveContainer width="100%" height={320}` | Works on resize |
| Charts | Chart tooltip with formatted price/date | ✅ IMPLEMENTED | Custom Tooltip component (lines 89-99) | Works |
| Charts | Chart loading/empty states | ✅ IMPLEMENTED | Lines 62-65: "Loading chart..." and "No chart data available." | Works |
| Charts | Currency-aware chart | 🟡 PARTIAL | `currency` prop passed to chart but coin detail page hardcodes USD (line 79: `currency={currency}` where currency is always 'usd') | Chart respects currency when passed, but detail page never passes it |
| Search | Global search dialog (Cmd/Ctrl+K shortcut) | ✅ IMPLEMENTED | `src/app/components/search-dialog.tsx` — debounced search, keyboard shortcut, results with links | Works; 300ms debounce, shows up to 8 results |
| Search | Search empty/loading/error states | ✅ IMPLEMENTED | Lines 70-92: loading text, no-results text, empty state | Works |
| Search | Exchange search results | ⚪ MISSING | `searchCoins()` only returns coins; CoinGecko `/coins/search` also returns `exchanges` array | Not surfaced in UI |
| Search | Keyboard navigation within results | ⚪ MISSING | No arrow-key navigation, no highlighted result index | Usability gap — user can't navigate results with keyboard |
| Trending | Trending coins on homepage | ✅ IMPLEMENTED | `src/app/cryptocurrency/page.tsx:60-75` | Works (homepage redirects to /cryptocurrency anyway) |
| Trending | Dedicated trending page (`/trending`) | ⚪ MISSING | No route exists | CoinGecko `/search/trending` is already called on the coins page but not exposed separately |
| Exchanges | Exchange listing (rank, name, logo, trust score, volume) | ✅ IMPLEMENTED | `src/app/exchanges/page.tsx` — full table with trust score badges | Works; hardcoded to 50 results, page 1 only (no pagination) |
| Exchanges | Exchange detail (name, trust score, established, markets count, volume, links) | ✅ IMPLEMENTED | `src/app/exchanges/[slug]/page.tsx` — full detail view with markets table | Works; uses `getExchangeList()` for static params (limited to 30) |
| Exchanges | Exchange markets table (pair, price, volume, trust score) | ✅ IMPLEMENTED | Lines 72-91 — renders markets from CoinGecko | Works; hardcoded to 50 per page, no pagination |
| Exchanges | Exchange currency selector (USD/EUR/GBP only) | ✅ IMPLEMENTED | Lines 29-38 — but only 3 currencies (missing JPY, AUD, PHP) | Works on exchanges page |
| Currency | Fiat currency selector across all pages | 🟡 PARTIAL | Exists on Coins (6 currencies), Tokens (4), Exchanges (3) — but NOT persisted globally | No global currency state; each page reads from URL query param independently. Changing currency on one page doesn't affect others. |
| Currency | Currency persistence across navigation | ⚪ MISSING | No global currency context; URL query param only | Would need a provider or shared state |
| Currency | Price formatting for selected currency | ✅ IMPLEMENTED | `formatPrice()` uses `Intl.NumberFormat` with the currency code | Works correctly |
| Navigation | Header with logo, nav links, search, theme toggle | ✅ IMPLEMENTED | `src/app/components/header.tsx` — sticky header with backdrop blur | Works; logo links to `/` which redirects to `/cryptocurrency` |
| Navigation | Nav links (Coins, Tokens, Exchanges) with active state | ✅ IMPLEMENTED | `src/app/components/layout/page.tsx` — `usePathname` highlights current section | Works; uses `startsWith` for active detection |
| Navigation | Mobile navigation | ⚪ MISSING (no hamburger menu) | Nav links are always visible; no mobile-specific nav pattern | On very narrow screens, nav text may overflow — no hamburger/drawer |
| Navigation | Breadcrumbs | ⚪ MISSING | No breadcrumb component anywhere | Not critical for this product scope |
| Navigation | Broken routes handling | ✅ IMPLEMENTED | `src/app/not-found.tsx` — 404 page | Works; any unmatched route shows the 404 |
| Theme | System/Light/Dark theme toggle | ✅ IMPLEMENTED | `src/lib/theme.tsx` — full theme context with system detection, localStorage persistence | Works; cycles through 3 modes via `ThemeToggle` component |
| Theme | Dark mode CSS variables | ✅ IMPLEMENTED | `src/app/globals.css` — full dark/light variable definitions | Works; `.dark` class toggled on `<html>` |
| Responsive | Mobile-responsive coin table (column hiding) | ✅ IMPLEMENTED | `hidden sm:table-cell`, `hidden md:table-cell` classes on table columns | Works; 1h and 7D hide on mobile, market cap and volume hide on small tablets |
| Responsive | Mobile-responsive chart | ✅ IMPLEMENTED | `ResponsiveContainer` from Recharts handles resize | Works |
| Responsive | Mobile-responsive search dialog | ✅ IMPLEMENTed | Full-screen overlay, `pt-24` positioning | Works; no mobile-specific adjustments but functional |
| Responsive | Mobile-responsive exchange table | ✅ IMPLEMENTED | Same `hidden sm:table-cell` pattern | Works |
| Responsive | Mobile-responsive coin detail page | 🟡 PARTIAL | No explicit mobile breakpoints for the detail layout; flex-wrap handles some cases | Large images (w-10, w-12) and dense text may feel cramped on phones |
| SEO | Static metadata (title, description, OG) | ✅ IMPLEMENTED | `src/app/layout.tsx` + per-page metadata exports | Works but static — not coin-specific or dynamic |
| SEO | Dynamic metadata per page | 🟡 PARTIAL | Coins and Tokens pages have dynamic titles/descriptions; coin detail page has NO metadata export | Coin detail `[slug]/page.tsx` doesn't export `metadata` — all coin pages get the same generic title |
| SEO | robots.txt | ⚪ MISSING | No `app/robots.ts` or public/robots.txt | CoinGecko-scraped sites should allow crawling |
| SEO | sitemap.xml | ⚪ MISSING | No `app/sitemap.ts` | Would be useful for SEO if this goes public |
| SEO | Structured data (JSON-LD) | ⚪ MISSING | No schema.org markup anywhere | Crypto assets could use `CryptoCurrency` or `Dataset` structured data |
| SEO | Canonical URLs | ⚪ MISSING | No `<link rel="canonical">` tags | Could be added via metadata `alternates` |
| Error Handling | API failure on coin list | ✅ IMPLEMENTED | `try/catch` with empty array fallback, "Failed to load coins" message (line 98) | Works — user sees a friendly error |
| Error Handling | API failure on coin detail | ✅ IMPLEMENTED | `try/catch` returns null, renders "Coin not found" (lines 23-30) | Works but says "not found" for both 404 and network errors — misleading |
| Error Handling | API failure on chart | ✅ IMPLEMENTED | `catch` sets loading=false, renders "No chart data available" (line 65) | Works — no crash on API failure |
| Error Handling | Rate limiting handling | ⚪ MISSING | No retry logic, no rate-limit headers checked, no backoff | CoinGecko free tier: 10-30 calls/min. Multiple concurrent requests could trigger 429s silently |
| Error Handling | Network failure handling | ✅ IMPLEMENTED | All API calls wrapped in try/catch with fallback states | Works — no unhandled exceptions reach the user |
| Error Handling | 404 / not-found pages | ✅ IMPLEMENTED | `src/app/not-found.tsx` + coin/exchange "not found" messages | Works but could be improved (see above) |
| Watchlist | Add/remove from watchlist | ✅ IMPLEMENTED | `src/app/components/watchlist-button.tsx` — star toggle with localStorage | Works but per-page state only (no cross-page sync) |
| Watchlist | Persistent watchlist across sessions | ✅ IMPLEMENTED | localStorage key `blockdetails_watchlist` | Works — survives page refreshes |
| Watchlist | Dedicated watchlist page (`/watchlist`) | ⚪ MISSING | No route exists; only inline toggle buttons on coin table and detail page | Would be a useful P1 feature |
| UX | Loading/skeleton states on data sections | 🟡 PARTIAL | Chart has loading text; coin table has "Failed to load" message; no skeleton loaders anywhere | Could be improved with skeleton placeholders for the table rows and stat cards |
| UX | Empty states | ✅ IMPLEMENTED | "No tokens found", "Failed to load coins/exchanges" messages | Works — but could be more helpful (e.g., "Try a different currency") |
| UX | Error states | ✅ IMPLEMENTED | All pages handle API failures gracefully with user-friendly messages | Works — but no retry buttons |
| UX | Currency formatting (price, compact numbers, percentages) | ✅ IMPLEMENTED | `src/lib/format.ts` — formatPrice, formatNum, formatCompact, formatPct, pctColor | Works correctly across all pages |
| UX | Sanitized HTML rendering (description) | ✅ IMPLEMENTED | `sanitizeHtml()` and `sanitizeUrl()` in coin detail and exchange detail pages | Works — strips scripts, styles, event handlers, javascript: URLs |
| UX | Dark mode support | ✅ IMPLEMENTED | Full dark theme with CSS variables, theme toggle UI | Works — both light and dark are intentionally designed |

---

## Implemented Features (Working)

1. **Cryptocurrency listing page** (`/cryptocurrency`) — real CoinGecko data, rank, name, symbol, price, 1h/24h/7d changes, market cap, volume
2. **Global market statistics** — total market cap, 24h volume, BTC dominance, active coins count
3. **Trending coins** — horizontal scroll cards from CoinGecko `/search/trending`
4. **Coin detail pages** (`/cryptocurrency/[slug]`) — price, market cap, supply info, ATH/ATL, description (sanitized), social/explorer links, categories
5. **Historical price charts** (`/api/coins/[coinId]/market_chart`) — 1D/7D/1M/3M/1Y/MAX ranges, Recharts AreaChart with tooltips
6. **Global search dialog** — Cmd/Ctrl+K shortcut, debounced (300ms), shows up to 8 results with links
7. **Exchange listing** (`/exchanges`) — rank, name, trust score badge, markets count, 24h volume
8. **Exchange detail pages** (`/exchanges/[slug]`) — name, trust score, established year, markets table with pair/price/volume
9. **Fiat currency selector** — USD/EUR/GBP/JPY/AUD/PHP on Coins page; partial on Tokens (4) and Exchanges (3)
10. **Theme system** — System/Light/Dark with localStorage persistence, CSS variables for both themes
11. **Watchlist (localStorage)** — add/remove stars on coin table and detail page, persists across sessions
12. **Responsive design** — column hiding on mobile/tablet, responsive charts, responsive search dialog
13. **404 page** — handled via Next.js `not-found.tsx`
14. **Error handling** — all API calls wrapped in try/catch with user-friendly fallback messages
15. **Static metadata** — title, description, OpenGraph on layout and most pages

---

## Partially Implemented Features

1. **Pagination** — API accepts `page` parameter but no pagination UI (prev/next/page numbers) exists. Only page 1 is ever fetched.
2. **Static params pre-rendering** — `generateStaticParams` fetches top 50 coins and all exchange slugs at build time. This works but means new coins/exchanges won't appear until rebuild (mitigated by `revalidate` for dynamic pages).
3. **Currency selector** — exists on most pages but: (a) different currency sets per page, (b) not persisted globally, (c) coin detail page hardcodes USD.
4. **Chart currency awareness** — the chart component accepts a `currency` prop and formats correctly, but the coin detail page always passes `'usd'`.
5. **Shareable pages** — OG metadata exists but is static (same for all coins). No dynamic per-coin OG title/description, no share button.
6. **Mobile navigation** — nav links are always visible with no hamburger menu or mobile drawer. Works but not optimized for small screens.
7. **Loading/skeleton states** — chart has loading text, table has error messages, but no skeleton loaders for the main content areas.

---

## Broken Features

1. **Homepage redirects to `/cryptocurrency`** — `src/app/page.tsx` is a 5-line file that just redirects. There's no actual homepage with market overview, trending, gainers/losers. This is a missing feature masquerading as a redirect.
2. **Coin detail page says "not found" for API errors** — `src/app/cryptocurrency/[slug]/page.tsx:23-30` renders "Coin not found" for both 404 responses AND network errors. Should distinguish between the two.
3. **Tokens page filtering is unreliable** — `src/app/cryptocurrency/tokens/page.tsx:27` filters coins by `c.platform_id || c.symbol.includes('.')`. This is a heuristic that misses many tokens and includes non-tokens. CoinGecko doesn't have a native "tokens" filter.
4. **Exchange static params limited to 30** — `src/lib/exchange.ts:69` slices exchange list to 30, but the exchanges page fetches 50. Static params will miss exchanges beyond index 29, causing 404s for slugs like `kucoin` or `bybit`.
5. **No retry on API failure** — when CoinGecko returns 429 (rate limit) or times out, the user sees a silent error with no way to retry.

---

## Missing Essential Features — P0

1. **Dedicated homepage** (Medium)
   - CoinGecko/CMC all have a proper homepage with market overview, trending, gainers/losers. BlockDetails' homepage is just a redirect.
   - Would reuse existing `/global_data`, `/search/trending` calls plus add `/coins/markets?order=market_cap_gainers_desc`.

2. **Gainers and Losers pages** (Small)
   - CoinGecko provides `order: market_cap_gainers_desc` and `market_cap_losers_desc`. These are single API calls, no new infrastructure needed.
   - Reuses the existing CoinTable component with different sort params.

3. **Pagination UI for coin/exchange tables** (Small)
   - API already accepts `page` and `per_page`. Just need prev/next buttons and page indicators.
   - Minimal UI change, no new API calls.

4. **Global currency persistence** (Small)
   - A simple context/provider that reads from URL query param or localStorage and provides currency to all pages.
   - Would fix the inconsistency where coin detail hardcodes USD, tokens has fewer currencies, exchanges has even fewer.

5. **Dynamic metadata per coin** (Small)
   - Export `generateMetadata` in `[slug]/page.tsx` with coin-specific title/description/OG.
   - One function, ~10 lines of code.

---

## High Value Features — P1

1. **Dedicated `/trending` page** (Small)
   - Reuse the existing trending data already fetched on the coins page. Just extract it into its own route.

2. **Recently Added / New Coins page** (Small)
   - CoinGecko supports `order: newly_listed_desc`. One API call, reuses CoinTable.

3. **Compare coins page** (Medium)
   - Route like `/compare/bitcoin/ethereum/solana`. Show side-by-side metrics + normalized percentage chart.
   - Would need a new component but reuses existing chart and format utilities.

4. **Dedicated `/watchlist` page** (Small)
   - Read from localStorage, render a filtered coin table. Simple to implement with existing components.

5. **Sparkline charts in the coin table** (Small)
   - CoinGecko returns `sparkline.price[]` when `sparkline: true`. A small inline SVG chart per row.
   - Would require passing `sparkline: true` to the API call and rendering a tiny chart.

6. **Retry buttons on error states** (Small)
   - Add a "Try Again" button next to "Failed to load" messages. Simple state management.

7. **Skeleton loading states** (Medium)
   - Replace "Loading chart..." text with skeleton placeholders for the table rows and stat cards.

---

## Nice-to-Have Features — P2

1. **ETH dominance** — already in the API response (`global.eth_dominance`), just add a stat card.
2. **FDV (Fully Diluted Valuation)** — compute as `price × total_supply` and display in coin detail stats.
3. **30d/60d/1y price change badges** — API returns these, coin detail only shows 1h/24h/7d.
4. **Contract addresses on coin detail** — CoinGecko returns `contract_address` for platform coins; display them.
5. **Search exchange results** — CoinGecko `/coins/search` returns both coins and exchanges; surface exchange results.
6. **Canonical URLs** — add `<link rel="canonical">` via metadata `alternates`.
7. **robots.txt and sitemap.xml** — standard Next.js files, minimal effort.
8. **Share button on coin detail** — Web Share API or copy-link button with dynamic OG URL.
9. **Structured data (JSON-LD)** — `CryptoCurrency` schema on coin detail pages.

---

## Future / Not Recommended Yet — P3

1. **Authentication / User accounts** — explicitly out of scope per IDEA.md. No backend needed.
2. **Portfolio tracker with transaction history** — requires database, user accounts, and complex accounting logic.
3. **Real-time WebSocket prices** — CoinGecko free API doesn't support websockets; paid APIs exist but add cost.
4. **Price alerts / notifications** — requires backend infrastructure, push notification system.
5. **Multi-provider API abstraction** — abstracting over CoinGecko/CoinMarketCap/CryptoCompare adds complexity for marginal benefit when one provider works fine.
6. **Mobile app** — out of scope; this is a web application.

---

## UX Gaps

### Desktop
- No "Try Again" button on any error state — user is stuck when API fails.
- Coin detail page has no currency selector — always shows USD even if user selected EUR on the listing page.
- No breadcrumb navigation to show where you are in the site hierarchy.
- Search dialog has no keyboard arrow-key navigation through results.

### Mobile
- No hamburger menu or mobile nav drawer — nav links are always visible and may overflow on very narrow screens.
- Coin detail page images (w-10, w-12) and dense text feel cramped on phones.
- Exchange table trust score column hides on `sm:table-cell` — mobile users never see it.
- No haptic or visual feedback when toggling watchlist stars.

### Loading/Empty/Error States
- No skeleton loaders for the coin table or stat cards — just text messages.
- Chart loading shows "Loading chart..." text instead of a skeleton placeholder.
- Empty search results show "No results found" — could suggest popular coins instead.

---

## Technical Gaps Affecting Features

1. **No rate-limit handling** — CoinGecko free tier allows ~10-30 calls/min. Multiple concurrent requests (global_data + coins + trending on one page = 3 API calls) could trigger 429 responses silently. No retry/backoff logic exists.
2. **No global caching strategy** — Each page fetches independently. The same coin data could be fetched on the listing page AND the detail page with no deduplication.
3. **`generateStaticParams` fetches live API at build time** — If CoinGecko is down during `next build`, the build fails. The 50-coin limit also means new coins are never pre-rendered.
4. **Duplicate `sanitizeHtml`/`sanitizeUrl`** — Both coin detail and exchange detail pages implement identical sanitization functions. Should be a shared utility.
5. **Duplicate stat card component** — `Stat` component is redefined in every page that uses it (coins, tokens, coin detail, exchanges). Should be a shared component.
6. **No error boundaries** — If an unexpected JavaScript error occurs, the whole page crashes with a white screen.

---

## Recommended Implementation Order

1. **Fix exchange static params** — Remove the `.slice(0, 30)` limit in `getExchangeList()` so all pre-rendered exchange pages exist. (Small, fixes broken 404s)
2. **Add a proper homepage** — Market overview cards, trending section, top gainers/losers. Reuses existing API calls and components. (Medium)
3. **Add pagination UI** — Prev/next buttons for coin and exchange tables. (Small)
4. **Add global currency context** — A simple provider that persists currency across navigation and feeds it to all pages including coin detail. (Small)
5. **Add dynamic metadata per coin** — `generateMetadata` in `[slug]/page.tsx` with coin-specific title, description, and OG. (Small)
6. **Add gainers/losers pages** — `/gainers` and `/losers` routes reusing CoinTable with different sort params. (Small)
7. **Add retry buttons** — "Try Again" on all error states. (Small)
8. **Extract shared components** — `Stat`, `sanitizeHtml`, `sanitizeUrl` into shared utilities. (Small, code quality)
9. **Add `/watchlist` page** — Read from localStorage, render filtered table. (Small)
10. **Add `/trending` page** — Extract existing trending logic into its own route. (Small)

---

## Features We Should NOT Build Yet

1. **Authentication system** — Explicitly out of scope per project direction. localStorage-based watchlist is sufficient for now.
2. **Database / backend infrastructure** — No user accounts, no portfolio tracking with transaction history. The product is a read-only market data dashboard.
3. **Multi-API provider abstraction** — CoinGecko works fine for this scope. Adding CoinMarketCap/CryptoCompare adds API key management, response normalization complexity, and rate-limit coordination for no user-visible benefit.
4. **Real-time WebSocket prices** — CoinGecko free API doesn't support websockets. Paid tiers exist but add ongoing cost. Polling every 60s (current revalidate) is sufficient for a market data dashboard.
5. **Price alerts / push notifications** — Requires backend infrastructure, user accounts, and notification delivery system. Premature for a read-only dashboard.
6. **Mobile app** — This is a web application. A PWA could be considered later, but native mobile apps are out of scope.

---

## Terminal Summary

- **Implemented features:** 28
- **Partial features:** 7
- **Broken features:** 5
- **Missing P0 features:** 5
- **P1 features:** 7
- **Top 5 recommended next implementations:**
  1. Fix exchange static params (`.slice(0,30)` causing 404s)
  2. Add proper homepage (market overview + trending + gainers/losers)
  3. Add pagination UI for coin/exchange tables
  4. Add global currency context (persist across pages, feed to coin detail)
  5. Add dynamic metadata per coin (`generateMetadata` in `[slug]/page.tsx`)
