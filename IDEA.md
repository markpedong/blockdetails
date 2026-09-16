# BlockDetails 2.0 — Project Direction

## Purpose

Modernize the existing **BlockDetails** project into a clean, fast, maintainable cryptocurrency market dashboard.

The existing project should evolve into a modern React application while preserving useful functionality and removing outdated architecture.

The intended product direction is:

> **BlockDetails = a lightweight, modern alternative to CoinMarketCap and CoinGecko.**

It should remain focused on cryptocurrency market information.

Do not turn it into:

* an exchange
* a wallet
* a DeFi platform
* a trading platform
* an unnecessarily complicated Web3 application

---

# Core Technology Direction

Move the project away from Next.js.

Target stack:

```text
React
Vite
TypeScript
React Router
TanStack Query
```

Use current stable and compatible versions.

The application should operate as a modern React SPA.

Remove Next.js-specific architecture once equivalent React functionality has been migrated successfully.

---

# Engineering Philosophy

Follow KISS.

Prioritize:

* simple architecture
* readable code
* maintainability
* predictable data flow
* reusable domain logic
* good performance
* responsive design
* strict TypeScript

Avoid:

* unnecessary abstractions
* unnecessary wrappers
* excessive hooks
* duplicated state
* duplicated API logic
* giant components
* premature optimization
* premature design systems
* unnecessary dependencies
* over-engineering

Modernization should make the project easier to understand, not just newer.

---

# Migration Philosophy

Do not blindly rewrite the entire repository.

Before changing architecture:

1. inspect the existing implementation
2. understand current routes
3. identify current features
4. understand API integrations
5. identify reusable components
6. identify reusable utilities
7. identify obsolete code
8. identify Next.js-specific code
9. identify performance problems
10. preserve useful behavior

Migrate functionality incrementally.

Do not delete working functionality until its replacement is implemented and verified.

---

# Suggested Application Structure

A reasonable structure may look like:

```text
src/
  api/
  components/
  features/
    coins/
    market/
    watchlist/
    search/
    compare/
  hooks/
  layouts/
  pages/
  routes/
  services/
  store/
  types/
  utils/
```

Feature folders may contain:

```text
api/
components/
hooks/
types.ts
```

Only create these when they provide real value.

Do not create empty architectural layers simply for organizational appearance.

---

# Data Architecture

Use **TanStack Query** for remote/server state.

It should manage:

* API caching
* stale data
* refetching
* retries
* request deduplication
* loading states
* background refresh
* errors
* query invalidation

Avoid storing API responses in Redux unless there is a very strong reason.

Redux Toolkit should remain only if the project has meaningful global client state that benefits from Redux.

Otherwise, simplify or remove it.

---

# Crypto API Layer

Crypto API requests should not be scattered throughout UI components.

Create a centralized provider-independent interface.

Example:

```ts
cryptoApi.getGlobalMarket()
cryptoApi.getMarkets()
cryptoApi.getCoin()
cryptoApi.getCoinChart()
cryptoApi.getTrending()
cryptoApi.getGainers()
cryptoApi.getLosers()
```

The UI should work primarily with application-specific normalized data.

External provider response structures should not leak unnecessarily into presentation components.

Centralize:

* provider URLs
* request handling
* API keys
* request parameters
* response normalization
* errors
* rate-limit handling

If an existing provider works well, preserve it unless there is a valid reason to replace it.

---

# Product Areas

The main application should contain:

```text
BlockDetails
│
├── Home
├── Market
├── Coin Details
├── Trending
├── Gainers & Losers
├── New Coins
├── Watchlist
├── Compare
└── Global Search
```

---

# Homepage

The homepage should provide a concise overview of the cryptocurrency market.

Potential information:

* global crypto market cap
* 24-hour volume
* BTC dominance
* ETH dominance
* number of active cryptocurrencies
* overall market movement
* trending cryptocurrencies
* biggest gainers
* biggest losers

If a reliable source exists, optionally include:

* Fear & Greed Index

Do not place every possible dataset on the homepage.

Large datasets should have dedicated pages.

---

# Market Page

The market page should be one of the main parts of BlockDetails.

The market table should include available information such as:

* rank
* watchlist action
* coin icon
* name
* symbol
* price
* 1-hour change
* 24-hour change
* 7-day change
* market cap
* 24-hour volume
* circulating supply
* sparkline

Support:

* searching
* sorting
* filtering
* pagination or virtualization where appropriate
* currency selection

The market UI should remain responsive even while data refreshes.

---

# Coin Details Page

Each cryptocurrency should have a proper financial asset page.

Display available information such as:

* name
* symbol
* rank
* current price
* 1h change
* 24h change
* 7d change
* market capitalization
* fully diluted valuation
* 24-hour volume
* circulating supply
* total supply
* maximum supply
* ATH
* difference from ATH
* ATL
* 24-hour high
* 24-hour low

Also include available project information:

* official website
* explorer links
* contract addresses
* social/community links
* description

---

# Price Charts

Price charts should be interactive and responsive.

Support useful ranges such as:

```text
1D
7D
1M
3M
1Y
MAX
```

Users should be able to inspect historical values through hover or touch.

Display information such as:

* timestamp
* price
* percentage movement

Avoid unnecessary chart rerendering.

---

# Watchlist

Implement a simple watchlist.

Authentication is not required for the initial implementation.

Persist favorites locally using something lightweight such as:

```text
localStorage
```

Provide:

```text
/watchlist
```

Users should be able to toggle favorites from:

* market page
* coin details
* global search

The implementation may be structured so server synchronization can be added later, but do not build unnecessary backend functionality now.

---

# Global Search

Provide fast cryptocurrency search from anywhere in the application.

Possible shortcuts:

```text
/
Cmd + K
Ctrl + K
```

Search should support:

* cryptocurrency name
* ticker/symbol

Results may display:

* icon
* name
* symbol
* rank
* price

Support keyboard navigation.

Useful additions:

* recent searches
* recently viewed assets
* trending suggestions

---

# Comparison

Provide a cryptocurrency comparison page.

Possible route:

```text
/compare/bitcoin/ethereum/solana
```

Compare available metrics such as:

* price
* market cap
* volume
* circulating supply
* total supply
* ATH
* ATH drawdown
* 7-day performance
* 30-day performance
* 1-year performance

If historical data is available, use normalized percentage charts so assets with very different prices can be compared meaningfully.

---

# Discovery

Where supported by the API, include dedicated pages for:

```text
/trending
/gainers-losers
/new
```

Do not invent data that the provider does not supply reliably.

If a feature cannot be supported correctly, prefer leaving it incomplete rather than fabricating information.

---

# Currency Support

Support multiple fiat currencies where practical.

Potential initial options:

```text
USD
EUR
GBP
PHP
JPY
AUD
```

Currency selection should be centralized.

Persist the user's selection locally.

Changing currency should consistently update all relevant market information.

---

# Theme

Support:

```text
System
Light
Dark
```

Default to the system theme.

Remember explicit user selection.

Both light and dark themes should be intentionally designed.

---

# UI Direction

The application should feel like a modern financial product.

Use products such as these only for general inspiration:

* CoinMarketCap — information density
* CoinGecko — usability
* TradingView — chart presentation
* modern SaaS dashboards — layout consistency

Do not directly copy them.

Avoid:

* huge cards everywhere
* excessive border radius
* excessive gradients
* glassmorphism everywhere
* oversized typography
* excessive whitespace
* pointless animation

Prefer:

* compact spacing
* clear typography
* strong visual hierarchy
* aligned numeric data
* subtle surfaces
* restrained borders
* consistent spacing
* professional financial presentation

---

# Responsive Design

Mobile should not simply be a compressed desktop layout.

Design intentionally for:

* desktop
* laptop
* tablet
* mobile

For mobile:

* prioritize important market data
* use compact market rows
* avoid giant tables
* keep controls touch-friendly
* make charts usable
* keep typography appropriately sized
* make search easy to access
* preserve watchlist functionality

Avoid cramped layouts.

---

# Loading States

Every asynchronous section should provide useful loading feedback.

Prefer localized skeleton states.

Examples:

* market table skeleton
* coin page skeleton
* chart skeleton
* trending skeleton
* search loading state

A small loading widget should not block the entire application.

---

# Error Handling

Handle common failure cases properly:

* request failures
* provider outages
* API rate limits
* network failures
* missing assets
* unavailable historical data
* invalid coin IDs
* empty responses

Show understandable UI messages.

Provide retry actions where useful.

Do not expose raw provider errors directly to users.

---

# Financial Formatting

Centralize number formatting.

Reusable formatting should cover:

* currency
* percentages
* market capitalization
* trading volume
* token supply
* large-number abbreviations

Examples:

```text
$115,820.32
+2.41%
$2.30T
$56.82B
19.7M BTC
```

Avoid duplicating formatting code across components.

---

# TypeScript

Use strict TypeScript.

Avoid `any` unless genuinely unavoidable.

Define useful domain types for:

* coins
* market coins
* global market data
* price history
* charts
* search results
* currencies
* market pairs

Prefer normalized internal types over exposing raw provider response types throughout the application.

---

# Performance

During modernization, investigate actual performance problems.

Look for:

* duplicate requests
* unnecessary rerenders
* large table rerenders
* unnecessary context updates
* duplicated derived state
* excessive `useEffect`
* expensive calculations during rendering
* chart rerenders
* unstable keys
* oversized dependencies
* unnecessary utility libraries

Do not blindly add:

```text
useMemo
useCallback
React.memo
```

Optimize only where there is a meaningful reason.

---

# Dependency Cleanup

Audit existing dependencies.

Remove packages that:

* are unused
* exist only because of Next.js
* duplicate another dependency
* are obsolete
* unnecessarily increase bundle size

Do not replace working dependencies just because another library is newer or more fashionable.

---

# Accessibility

Maintain basic accessibility standards.

Use:

* semantic HTML
* buttons for actions
* links for navigation
* visible focus states
* keyboard navigation
* labels
* accessible forms
* sufficient contrast

Global search and primary navigation should work properly with the keyboard.

---

# Features That Are Out of Scope

Do not add these unless the product direction changes later:

* authentication
* Supabase
* Firebase
* database infrastructure
* wallet connections
* MetaMask
* WalletConnect
* buying cryptocurrency
* selling cryptocurrency
* swaps
* smart contracts
* blockchain SDKs
* unnecessary Web3 libraries
* portfolio transaction accounting
* microservices

BlockDetails should remain focused on crypto market information and discovery.

---

# Suggested Migration Sequence

A reasonable implementation sequence is:

```text
1. Audit the existing repository
2. Identify useful existing functionality
3. Establish React + Vite foundation
4. Configure TypeScript
5. Configure React Router
6. Migrate shared styling
7. Migrate shared types and utilities
8. Build centralized API layer
9. Add TanStack Query
10. Migrate shared UI components
11. Migrate homepage
12. Migrate market functionality
13. Migrate coin details
14. Migrate charts
15. Implement global search
16. Implement watchlist
17. Implement comparison
18. Implement discovery pages
19. Audit responsive layouts
20. Audit performance
21. Remove obsolete code
22. Remove Next.js
23. Remove unused dependencies
24. Run typecheck
25. Run lint
26. Run production build
27. Fix remaining regressions
```

The application should remain functional during migration whenever practical.

---

# Definition of Done

The modernization is successful when:

* Next.js is fully removed
* the project runs using React + Vite
* routing works through React Router
* API data uses a centralized abstraction
* TanStack Query manages remote data
* current useful features remain functional
* major missing market features are implemented
* watchlist works
* search works
* comparison works
* responsive layouts work
* light/dark/system themes work
* TypeScript passes
* lint passes
* production build succeeds
* dead code is removed
* unnecessary dependencies are removed
* the codebase is simpler than before
* no fake or placeholder market data is presented as real data

The final project should feel like an intentional modernization of **BlockDetails**, not an unrelated application created from scratch.