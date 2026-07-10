# AGENTS.md (Frontend)

## What this project is

**Lumina UI** is the React frontend for a TV series tracker. It lets users
search for TV series, add them to a personal list, mark episodes watched,
and view watch stats/profile info. All data comes from a separate Express
API (see that project's own AGENTS.md) — this app holds no direct database
or TMDB access beyond TMDB's static image CDN for posters.

## Tech stack

- React + Vite — **plain JS, not TypeScript**
- Tailwind CSS v4 (`@tailwindcss/vite`, CSS-based `@plugin` config, no
  `tailwind.config.js`)
- DaisyUI (component styling on top of Tailwind), theme: `dim` (dark).
  **Not** shadcn/ui — shadcn was tried first and abandoned (see
  DECISIONS.md).
- React Router (routing)
- TanStack Query (server state, caching, mutations)
- React Hook Form + Zod (forms + validation)
- Axios (HTTP client; JWT auto-attached via a request interceptor)
- `lucide-react` (icons)

## How to run locally

```bash
npm install
npm run dev          # Vite dev server, default http://localhost:5173
```

Requires `.env`:
```
VITE_API_URL=http://localhost:3000/api
```
Vite only exposes env vars prefixed `VITE_`, and only reads `.env` at
startup — restart the dev server after editing it.

Backend must be running separately (`http://localhost:3000` by default) and
its `FRONTEND_URL` env var must match this app's actual dev port for CORS to
work.

## Coding conventions

- **All HTTP calls live in `src/api/*.api.js`** — components never call
  `axios`/`axiosClient` directly. One file per backend resource
  (`auth.api.js`, `series.api.js`, `userSeries.api.js`,
  `userEpisodes.api.js`).
- **Server state** (search results, progress, stats, lists) goes through
  TanStack Query (`useQuery`/`useMutation`), keyed consistently (e.g.
  `['seriesProgress', seriesId]`, `['mySeries', activeStatus]`,
  `['myStats']`). After any mutation that changes server data, call
  `queryClient.invalidateQueries` on every affected key rather than
  manually patching cached data.
- **Local-only UI state** (form inputs, active tab, toggle visibility) uses
  plain `useState` — don't reach for TanStack Query or Context for things
  that never leave the component.
- **Auth state** lives in `AuthContext` only. Token in `localStorage` under
  key `lumina_token`. Never read/write that key outside `AuthContext`/
  `axiosClient`.
- **Forms**: React Hook Form + Zod schema, `register()`/`handleSubmit()`
  pattern (no shadcn `<Form>` wrapper — that was removed with shadcn
  itself; see DECISIONS.md). Show Zod validation errors inline per field,
  show server-side errors via a DaisyUI `alert alert-error`.
- **Styling**: DaisyUI utility/component classes (`btn`, `card`, `input`,
  `alert`, `stats`, `collapse`, `progress`, `tabs`, `select`, `loading`,
  etc.) plus Tailwind utilities. No CSS-in-JS, no per-component stylesheets.
- **Routing**: pages live in `src/pages/`, one file per route. Auth-gated
  pages wrap in `<ProtectedRoute>`. Shared chrome (Navbar + Sidebar) lives
  in `AppLayout`, applied once at the router level, not per-page.
- **Naming**: PascalCase `.jsx` files for components/pages, camelCase for
  functions/variables, hooks prefixed `use`.

## Things to never do without asking

- Don't reintroduce shadcn/ui or its CLI — deliberately replaced with
  DaisyUI after repeated registry/CLI failures (see DECISIONS.md). If
  shadcn is wanted again, that's a fresh decision to revisit, not a
  default to fall back into.
- Don't switch to TypeScript without an explicit request.
- Don't move the JWT out of `localStorage` (e.g. to a cookie) without also
  coordinating the corresponding backend CORS/cookie changes — this is a
  cross-project change, not frontend-only.
- Don't reimplement the watchlist/watching/completed status logic in
  React. Status is computed and owned entirely by the backend
  (`recalculateSeriesStatus`) — the frontend only ever reflects
  `getSeriesStatus`/`getSeriesProgress` results and calls the relevant
  mutation endpoints. Duplicating the rules client-side risks
  client/server disagreement.
- Don't add a client-side "total watch time" calculation from raw episode
  data — always call `GET /users/me/stats` and trust its numbers; the
  backend deliberately computes this live (see backend DECISIONS.md #010).

## Other docs

- `docs/ARCHITECTURE.md` — folder layout, page-by-page responsibilities, data
  flow.
- `docs/DECISIONS.md` — ADR-style log of why things are built this way.
- `docs/STATE.md` — what's done, in progress, known issues, session log. **Read
  this first**, especially the open UI bugs before touching
  `SeriesDetailPage` or `ProfilePage`.
