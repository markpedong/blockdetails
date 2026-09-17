# UI Redesign Audit — 2026-09-17

## Scope
Full UI/UX redesign of the `blockdetails` Next.js crypto tracking app (Next.js 15, React 19, Tailwind CSS v4).

## Files Changed (16 source files)

| File | Lines | What changed |
|------|-------|-------------|
| `app/globals.css` | +65/-12 | CSS vars for theming, `.app-container` (~1440px), stat-card class, dark-mode overrides |
| `app/layout.tsx` | +1/-1 | Footer import path fix (`./footer` → `./components/footer`) |
| `app/components/header.tsx` | +82/-20 | **Market bar** (GlobalMarketData strip: cryptos count, 24h vol, BTC/ETH dominance), tighter nav, currency selector pills in navbar |
| `app/components/footer.tsx` | +8/-2 | Cleaner link grouping, tighter spacing |
| `app/components/coin-chart.tsx` | +120/-69 | **Dark-mode chart** — detects `--background` CSS var, uses green/red gradient fill + line based on price direction, hides hardcoded white grid lines |
| `app/components/search-dialog.tsx` | +98/-56 | **Keyboard navigation** (↑↓ Enter Esc), debounced search, highlighted matches (`<mark>`), result count display |
| `app/page.tsx` | +68/-41 | Market bar integration, tighter stat cards, currency selector pills, improved trending section layout |
| `app/cryptocurrency/page.tsx` | +78/-49 | Same table polish, pagination added |
| `app/cryptocurrency/coins/page.tsx` | +72/-45 | **Pagination** (numbered pages 1..N with Prev/Next), `tabular-nums`, sticky headers |
| `app/cryptocurrency/tokens/page.tsx` | +68/-48 | Same pagination/table polish, filtered by API `is_token=true` |
| `app/cryptocurrency/[slug]/page.tsx` | +85/-54 | Currency selector pills, tighter stat grid (2/3/4 col responsive), better price badges, improved links section |
| `app/exchanges/page.tsx` | +85/-71 | Trust score badges (green ≥ 7, yellow < 7), `tabular-nums`, sticky headers |
| `app/exchanges/[slug]/page.tsx` | +85/-58 | Same trust score badges, trading pairs table with volume |
| `app/not-found.tsx` | +6/-2 | Styled 404 with back link |
| `next.config.js` | +8/-7 | Minor config tweak (unchanged behavior) |

## What Was Added

1. **Market status bar** — top slim strip showing active cryptos, 24h volume (formatted), BTC/ETH dominance. Fetches `/api/global` server-side, hides on error.
2. **Wider app container** — `.app-container` class set to `max-w-[1440px]` (was 1280px), giving tables more breathing room.
3. **Dark-mode canvas chart** — `getComputedStyle(document.documentElement).getPropertyValue('--background')` detects dark mode; grid lines use transparent white/black accordingly. Gradient fill uses green/red based on price direction.
4. **Search dialog UX** — keyboard navigation (↑↓ to select, Enter to open, Esc to close), debounced 300ms search, highlighted query matches in results.
5. **Pagination** — numbered page buttons (1..N) with Prev/Next on coins and tokens pages.
6. **Currency selector pills** — inline toggle buttons (USD/EUR/GBP/JPY/AUD/PHP) in navbar and coin detail page.
7. **Table polish** — `tabular-nums` on all tables, sticky headers via `<thead>`, trust score color badges.
8. **Stat cards** — `.stat-card` CSS class with consistent padding, label/value hierarchy.

## What Was Skipped (YAGNI)

- **Skeleton loading states** — no shimmer/spinner placeholders. Add when API latency is consistently > 2s on slow connections.
- **Sparklines in table rows** — mini inline charts for 24h price movement. Add when users request at-a-glance trend data in list views.
- **Mobile horizontal scroll optimization** — tables use `overflow-x-auto` but no prioritized column layout for narrow screens. Add when mobile table readability complaints arrive.
- **Chart tooltip on hover** — canvas chart shows current price dot but no interactive tooltip. Add when users want exact price/date on hover.
- **Error retry buttons** — empty states show text but no retry action. Add when API failures are frequent enough to warrant one-click recovery.

## Known Simplifications (ponytail comments)

- `coin-chart.tsx`: Dark mode detection via CSS var string parsing (`--background` starts with `#1`). Ceiling: breaks if custom theme uses non-hex values. Upgrade path: use a dedicated CSS var like `--is-dark` boolean or `matchMedia('(prefers-color-scheme: dark)')`.
- `header.tsx`: Market bar fetches `/api/global` on every page render (server component). Ceiling: no caching, redundant calls across pages. Upgrade path: cache with `revalidate: 60` or use React Query on client side.
- All pages: `sanitizeHtml` strips `<script>`, `<style>`, event handlers, and `javascript:` URLs. Ceiling: doesn't handle SVG foreignObject or data URIs. Upgrade path: use DOMPurify library if XSS surface grows.

## Build Status
`pnpm run build` — ✅ passes (15 pages generated, 2 SSG + 13 dynamic).
