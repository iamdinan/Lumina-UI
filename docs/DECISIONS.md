# DECISIONS.md (Frontend)

Lightweight ADR log. Each entry: what was decided, alternatives considered,
why. Newest at the bottom. If a later decision reverses an earlier one,
don't delete the old entry — add a new one that supersedes it and
cross-reference.

---

### 001 — Plain JS, not TypeScript

**Decision:** React + Vite project uses plain `.jsx`, `jsconfig.json` (not
`tsconfig.json`), no TypeScript anywhere.

**Alternatives considered:** TypeScript from the start.

**Reasoning:** Matches the backend (also plain JS) and keeps the
"simple now, scale later" goal front and center. TS would add real value
(catching type mismatches, better autocomplete on API responses) but also
overhead, and since the backend isn't typed either, frontend types would
still need manual syncing with API shapes without extra tooling. Migrating
incrementally (file by file) remains possible later if desired.

---

### 002 — React + Vite + DaisyUI chosen over Next.js, SvelteKit, or Vue

**Decision:** Client-only Vite SPA with React, not a meta-framework.

**Alternatives considered:** Next.js (file-based routing, SSR option,
could fold the Express API into Next API routes), SvelteKit (less
boilerplate, built-in stores), Vue 3 + Pinia (arguably gentler learning
curve, smaller ecosystem).

**Reasoning:** The app is a personal, auth-gated tracker with no current
SEO/SSR requirement, and already has a working Express backend — folding
that into Next or running two servers was unnecessary complexity for no
near-term benefit. React was chosen over Vue/Svelte primarily for
ecosystem gravity (more examples, more available help, most AI tooling
defaults to it), not because it's technically superior for this app's
needs.

---

### 003 — shadcn/ui abandoned in favor of DaisyUI

**Decision:** Drop shadcn/ui entirely (all generated components,
`components.json`) and use DaisyUI (a Tailwind plugin, `dim` theme)
instead.

**Alternatives considered:** Keep retrying shadcn's CLI (its registry
500'd on the desired tweakcn preset URL — confirmed via a direct fetch,
not just local misconfiguration — and separately the CLI generated `.tsx`
files despite `tsx: false` in config on one attempt). Manually copying
shadcn's component source by hand instead of using its CLI. Headless UI,
Mantine, Chakra UI.

**Reasoning:** After multiple failed CLI attempts and one mismatched
file-extension issue, continuing to fight the tooling wasn't worth it.
DaisyUI needs zero CLI/codegen — a CSS `@plugin` line plus utility classes
— fitting the project's low-tooling-friction, plain-JS posture. Visual
fidelity to the originally-desired shadcn/tweakcn look is approximated
(via the `dim` theme and manually matching spacing/shadows/alerts between
pages), not pixel-identical.

---

### 004 — JWT in `localStorage`, not an httpOnly cookie

**Decision:** Token stored client-side under `lumina_token`, attached via
an axios request interceptor.

**Alternatives considered:** httpOnly, secure cookie-based session
(requires coordinated backend CORS/credentials changes).

**Reasoning:** Simplest to implement end-to-end quickly — no
cookie/CORS-credentials configuration needed on either side. Known
trade-off (more XSS-exposed than an httpOnly cookie) accepted deliberately
as a documented gap, not something to silently "fix" later since changing
it touches both this app's `axiosClient`/`AuthContext` and the backend's
CORS config together.

---

### 005 — Search page is URL-driven (`?q=`), not local-state-only

**Decision:** `SearchPage` reads its query from `useSearchParams()` and
runs a `useQuery` keyed on that value, rather than holding the search term
in local component state tied to a `useMutation` triggered by a submit
button.

**Alternatives considered:** Original implementation used a local
`useState` + `useMutation` triggered on form submit, with the search bar
living directly on the Search page.

**Reasoning:** Once the search bar moved to the persistent top-right
Navbar (per the sidebar/layout restructure), navigation naturally became
`navigate('/search?q=...')` — making the URL the source of truth lets
results be shareable/bookmarkable and makes browser back/forward behave
correctly, which a local-state-only approach wouldn't support.

---

### 006 — My List merged into Profile, not kept as a separate page

**Decision:** The original standalone `/my-list` page (status-filterable
series grid) was deleted; its contents (tabs, grid, status dropdown,
remove button) were folded directly into `/profile`, alongside new stats
cards and an editable profile form.

**Alternatives considered:** Keep My List as its own route, link to it
separately from Sidebar alongside a separate Profile page.

**Reasoning:** User explicitly requested this consolidation once the
sidebar/profile-button navigation pattern was introduced — clicking your
username became the natural single entry point for "everything about me,"
rather than splitting personal data across two separate nav items.

---

### 007 — Status state machine is never re-derived client-side

**Decision:** `SeriesDetailPage`'s watchlist-toggle button and episode
checkboxes are pure reflections of `getSeriesStatus`/`getSeriesProgress`
responses. No local logic infers "if all episodes are watched, show
Completed" — the frontend always asks the backend what the current status
is and displays exactly that, refetching after every relevant mutation.

**Alternatives considered:** Compute the displayed status client-side from
the already-fetched episode list (avoids one extra query), keeping the
backend's `user_series.status` column more as a cache than a live
authority.

**Reasoning:** The backend already owns and computes this logic
(`recalculateSeriesStatus` — see backend DECISIONS.md #011). Re-deriving
it in React risks the two disagreeing (e.g. a race between two mutations,
or a future backend rule change the frontend doesn't know about). Treating
the backend as the single source of truth and simply invalidating/refetching
after mutations was chosen as the more robust pattern, at the cost of one
extra network round-trip per page load.

---

### 008 — Navbar brand is intentionally unclickable; "Home" is a separate
explicit button

**Decision:** The "Lumina" wordmark in the Navbar has no link/navigation
behavior (`select-none cursor-default`, plain `<span>`). A distinct "Home"
button sits next to it and is the only way to navigate to `/` from the
Navbar.

**Alternatives considered:** Conventional pattern — make the brand/logo
itself the home link (the web-wide default convention).

**Reasoning:** Explicit user request, deviating from the usual
logo-links-home convention. Documented here specifically so a future
session doesn't "fix" this back to the conventional pattern, assuming it
was an oversight.
