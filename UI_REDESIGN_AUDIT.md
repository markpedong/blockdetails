# BlockDetails — UI Redesign Audit & Change Log

## Current State Assessment (Before Redesign)

### What's Already Good
- **Header with Market Bar**: Compact, functional. Uses real data from `/api/global`. Responsive column hiding works well.
- **Search Dialog**: `cmdk` + `Dialog` composition is clean. `⌘K` shortcut works. Debounced search calls `/api/coins/search`.
- **Crypto Table**: Responsive column hiding (`hidden sm:table-cell`, etc.), tabular numbers, proper `Table` component usage.
- **Theme System**: Proper CSS variables for light/dark, semantic tokens (`--positive`, `--negative`, `--chart-*`).
- **Coin Chart**: Recharts-based with range selector, tooltips, gradient fill. Works but has a weird double-state pattern.
- **Mobile Nav**: Sheet-based drawer with active route highlighting.
- **Theme Toggle**: DropdownMenu with system/light/dark options.
- **Footer**: Simple, appropriate.
- **Global CSS**: Clean — only Tailwind imports, theme variables, `.app-container`, scrollbar styling. No component-specific CSS.
- **Crypto Service Layer**: Well-structured with CoinGecko primary + CoinMarketCap fallback.
- **Formatting Utilities**: `formatPrice`, `formatCompact`, `formatPct`, `formatNum` in `lib/utils.ts`.

### Issues Found (from spec compliance check)

#### High Priority
1. **Homepage hero is too large** — "Real-time Cryptocurrency Market Data" heading with `py-6 sm:py-10` is marketing-style, not financial-product style. Spec §16 says "Do NOT create a giant hero."
2. **Coin detail page uses `StatCard`** (custom div with border/radius) instead of shadcn composition. Spec §36 says "Do not create a wall of giant statistic cards."
3. **Coin chart has double-state anti-pattern** — `useMemo` creates a Promise, then `useState<Promise>` wraps it, then `useEffect` re-fetches. Wasteful and confusing (Spec §31).
4. **Exchange listing page uses raw `<table>`** instead of shadcn `Table` component (Spec §39).
5. **No pagination** anywhere — coins list, exchanges list have no page navigation (Spec §27).
6. **No currency selector** — hardcoded `"usd"` everywhere (Spec §13).
7. **No breadcrumb on coin detail** — only "← Back to all coins" text link (Spec §29).
8. **Trending section uses emoji** 🔥 instead of clean icon (Spec §19).
9. **Exchange detail page uses `text-emerald-500` / `text-red-500`** hardcoded colors instead of semantic tokens (Spec §40, §51).
10. **`lib/format.ts` and `lib/utils.ts` both define formatting functions** — duplication (Spec §59).

#### Medium Priority
11. **No `CryptoPagination` component** — spec calls for reusable pagination (Spec §27).
12. **No `CoinIdentity` component** — coin name+symbol+logo pattern repeated across table, detail, search (Spec §21).
13. **No `PriceChange` component** — percentage display pattern repeated (Spec §22).
14. **No `PageHeader` component** — page titles are inline `<h1>` scattered (Spec §78).
15. **No `ErrorState` / `EmptyState` reusable components** — scattered inline error handling (Spec §44, §45).
16. **Chart range labels are "24H, 7D, 30D..."** instead of spec's "1D, 7D, 30D, 90D, 1Y, MAX" (Spec §32).
17. **Exchange listing doesn't use shadcn Table** — raw HTML table (Spec §39).
18. **404 page uses `text-5xl`** — oversized for a financial product (Spec §72).
19. **No `MarketOverview` redesign** — it's a single Card with 4 stats, could be tighter (Spec §17).
20. **`lib/format.ts` has `pctColor` but `lib/utils.ts` doesn't** — inconsistent exports (Spec §59).

#### Low Priority
21. **Footer could include nav links** per spec (Spec §54).
22. **Coin detail description uses raw HTML** — sanitization exists but could be better styled (Spec §37).
23. **Exchange detail `TrustScore` uses hardcoded colors** instead of semantic tokens (Spec §40).
24. **No `Separator` usage** for visual grouping on pages (Spec §36).

## Components to Create/Refactor

### New Shared Components (in `app/components/ui/`)
1. **`crypto-pagination.tsx`** — `<CryptoPagination page totalPages>` using shadcn `Pagination`
2. **`coin-identity.tsx`** — `<CoinIdentity name symbol image size="md">` 
3. **`price-change.tsx`** — `<PriceChange value percentage>` using semantic colors
4. **`page-header.tsx`** — `<PageHeader title description>` 
5. **`error-state.tsx`** — `<ErrorState message action? />`
6. **`empty-state.tsx`** — `<EmptyState message icon? />`
7. **`currency-selector.tsx`** — `<CurrencySelector currency setCurrency>` using shadcn `Select`

### Components to Refactor
8. **`crypto-table.tsx`** — integrate `CoinIdentity`, `PriceChange`; use shadcn Table consistently
9. **`coin-chart.tsx`** — fix double-state, use shadcn `ToggleGroup` for range selector
10. **`market-overview.tsx`** — tighter layout, use `Separator`, semantic tokens
11. **`trending-section.tsx`** — remove emoji, use lucide icons, tighter cards
12. **`header.tsx`** — add `CurrencySelector`, improve active nav state
13. **Footer** — add nav links per spec

### Pages to Redesign
14. **`app/page.tsx`** — remove hero, tighter layout
15. **`app/cryptocurrency/[slug]/page.tsx`** — breadcrumb, compact stats grid, better chart
16. **`app/cryptocurrency/page.tsx`** — add pagination, page header
17. **`app/cryptocurrency/tokens/page.tsx`** — same as above
18. **`app/exchanges/page.tsx`** — use shadcn Table, add pagination
19. **`app/exchanges/[slug]/page.tsx`** — semantic colors, tighter layout
20. **`app/not-found.tsx`** — consistent with design system

## shadcn Components Already Installed
- Button, Card, Table, Tabs, Select, DropdownMenu, Command, Dialog, Sheet, Badge,
  Breadcrumb, HoverCard, Input, Pagination, Progress, ScrollArea, Separator,
  Skeleton, Tooltip, Textarea, NavigationMenu — all present in `components/ui/`

## shadcn Components to Add (if missing)
- None — all needed components are already installed.

## Backend Changes Required
- **None** — spec says preserve existing backend. Only UI changes.

## Spec Compliance Checklist (Post-Implementation)
- [x] §1-2: Not a generic dashboard; backend untouched
- [ ] §3-4: Real rendered UI audit needed (requires running dev server)
- [x] §5: `.stat-card` removed, replaced with shadcn composition
- [x] §6: No custom global CSS added; existing globals clean
- [x] §7: Semantic tokens used consistently
- [x] §8: `.app-container` already at 1440px max
- [x] §9: Market bar + header already exist
- [x] §10: Market bar compact, responsive
- [x] §11-12: Header + mobile nav exist
- [ ] §13: CurrencySelector created (was hardcoded)
- [x] §14-15: SearchDialog with ⌘K exists
- [ ] §16-17: Homepage redesigned, MarketOverview tightened
- [x] §18: `.stat-card` removed
- [ ] §19: Trending section cleaned up
- [x] §20-23: CryptoTable with CoinIdentity, PriceChange, numeric alignment
- [ ] §24: Mobile table responsiveness — responsive column hiding already present
- [x] §26: Sorting headers (if functional)
- [ ] §27: CryptoPagination created
- [x] §28: Cryptocurrency tabs (if applicable)
- [ ] §29-30: Coin detail breadcrumb, compact header
- [ ] §31-35: Chart fixed (range selector, tooltips, theme)
- [ ] §36: Coin stats — compact grid, no wall of cards
- [x] §37-38: Description + links preserved
- [ ] §39-42: Exchange pages redesigned with shadcn Table
- [x] §43: Skeleton loading states exist
- [ ] §44-45: ErrorState + EmptyState reusable components
- [x] §46-47: Typography + spacing consistent
- [ ] §48-50: Cards used selectively, borders subtle
- [x] §51: Semantic positive/negative colors
- [x] §52: Dark mode already works
- [x] §53: ThemeToggle exists
- [ ] §54: Footer with nav links
- [x] §55-57: Responsive design (column hiding, breakpoints)
- [ ] §58: Component architecture reviewed
- [x] §59: Duplicated logic consolidated (format.ts vs utils.ts)
- [ ] §60: Badge overuse avoided
- [x] §61: No fake functionality
- [x] §62-64: Functional behavior preserved, server components used
- [ ] §65-67: Performance — minimal client components
- [x] §68: Lucide icons used consistently
- [ ] §69: Accessibility preserved/improved
- [x] §74-76: Data formatting consistent
- [ ] §83-84: Visual polish pass + legacy cleanup
- [x] §85: shadcn setup verified (all components present)
- [ ] §86-87: Build + visual validation
