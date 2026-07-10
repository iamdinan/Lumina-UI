# STATE.md (Frontend)

_Last updated: session where docs were split into frontend/backend
versions. No frontend code changed in that session._

## What's done

- Vite + React (plain JS) + Tailwind v4 + DaisyUI (`dim` theme). shadcn/ui
  was tried and abandoned (see DECISIONS.md).
- Routing: `/`, `/search`, `/series/:seriesId`, `/login`, `/register`,
  `/profile` (protected). `/my-list` removed — merged into `/profile`.
- Layout: `Navbar` (unclickable "Lumina" brand + Home button + top-right
  search box navigating to `/search?q=...`) + `Sidebar` (Home, My List
  link, username button → `/profile`, Login/Register or Logout), composed
  via `AppLayout`.
- Auth: `AuthContext` (token in `localStorage`), `ProtectedRoute`, working
  Login/Register pages (react-hook-form + zod), matching visual style
  (same card layout, spacing, alert style, spinner on both).
- `HomePage`: hero + TMDB "popular now" grid; clicking a poster imports +
  routes to detail page (same flow as Search).
- `SearchPage`: URL-driven (`?q=`), results via `useQuery`, shareable link.
- `SeriesDetailPage`: progress bar, per-season collapsible episode
  checklist, watchlist toggle button reflecting live server status,
  "Mark All Completed" bulk button.
- `ProfilePage`: stats cards (episodes watched / hours / days / months) +
  editable profile form (full name, email, country, birthday) via
  `PATCH /users/me`, plus the merged-in "My List" grid with status
  dropdown + remove button per card.

## Known issues / unconfirmed

- **Episode checkbox on `SeriesDetailPage` was reported unclickable** after
  the watchlist-toggle/status-machine work was added. Suspected causes
  given to the user: unsafe `statusData.status` access somewhere (should be
  `statusData?.status`), or a `disabled` prop bound to a mutation's
  `isPending` that got stuck `true` after an uncaught error. **Not
  confirmed fixed in-session** — check the browser console for thrown
  render errors and audit every `disabled={...mutation.isPending}` binding
  on that page before doing further work there.
- **Watch-time stats reported as "not working."** Given debugging steps
  (verify `runtime_minutes` isn't null after re-import; curl
  `/api/users/me/stats` directly) but no confirmation was logged. If the
  backend endpoint checks out fine independently, re-check the frontend
  side: `ProfilePage`'s `stats` object is accessed as `stats.episodes_watched`
  etc. without optional chaining once `statsLoading` is false — if the
  query errors instead of loading, this will throw. Consider adding an
  `isError` branch similar to the list section's, if not already present.
- **"Mark All Completed" ticking every UI checkbox** — implemented by
  invalidating `seriesProgress`/`seriesStatus`/`myStats` after the bulk
  endpoint call, which should be sufficient (checkboxes are driven by
  `ep.watched` from the refetched `seriesProgress` response), but this was
  not explicitly confirmed working by the user before the session moved on
  to documentation. Verify visually.
- **Old `addToListMutation` in `SeriesDetailPage`** — should have been
  deleted (superseded by `toggleWatchlistMutation`). Confirm it was
  actually removed and not left dead in the file alongside the new one.
- **`ProfilePage` was effectively built twice** — an earlier version was
  designed in one message, then the user clarified they hadn't actually
  applied it, so it was rebuilt (with additional profile-edit-form scope)
  in the same session. Don't assume prior partial implementations exist;
  treat the most recent full version (stats + edit form + merged list) as
  the current one.

## Explicitly not started

- No pagination/infinite-scroll on Search or Profile's series grid.
- No public profile view for other users — `ProfilePage` currently
  force-redirects to your own username if the URL param doesn't match.
- No avatar/photo upload.
- No loading skeletons — current loading states are plain DaisyUI spinners.
- No automated tests (unit, integration, or e2e).
- No responsive/mobile-specific pass beyond Tailwind's default grid
  breakpoints already in use (`sm:`/`md:` column counts on grids).

## Session log

**Latest session (docs split into frontend/backend, no code changes):**
Re-organized `AGENTS.md`/`ARCHITECTURE.md`/`STATE.md`/`DECISIONS.md` into
separate frontend and backend versions at the user's request. The three
open issues above (checkbox unclickable, stats not working, mark-completed
UI confirmation) remain exactly as they were — first priority for the next
working session.

**Prior session:** Implemented the watchlist/watching/completed toggle
button and "Mark All Completed" on `SeriesDetailPage`, wired to the new
backend status-machine endpoints. User reported the checkbox-unclickable
and stats-not-working issues during/after this work; not resolved
in-session.

**Prior session:** Added `ProfilePage` (stats + editable profile form,
merging in the old My List grid), restructured layout to add `Sidebar`,
simplified `Navbar` to unclickable brand + Home button + top-right search,
made `SearchPage` URL-driven via `?q=`.

**Earlier sessions:** Scaffolded the app (Vite+React, attempted shadcn/ui,
abandoned it for Tailwind+DaisyUI with the `dim` theme); built
`AuthContext`, routing, Login/Register, Search, Series Detail, and an
original standalone My List page (later merged into Profile); built Home
page with TMDB "popular" grid.
