# ARCHITECTURE.md (Frontend)

## System role

Single-page React app. Talks only to the Lumina backend (`VITE_API_URL`)
over JSON, plus TMDB's static image CDN directly for poster images
(`https://image.tmdb.org/t/p/w342{poster_path}`). No direct database
access, no direct TMDB API calls for data (only images).

## Folder breakdown

```
src/
  api/                        # all HTTP calls — components never call axios directly
    axiosClient.js             # axios instance, JWT request interceptor, 401 handling
    auth.api.js                 # register, login, getMe, updateProfile, getMyStats
    series.api.js                # searchSeries, importSeries, getPopularSeries
    userSeries.api.js             # addSeriesToList, updateSeriesStatus,
                                   # removeSeriesFromList, getMySeries, getSeriesStatus
    userEpisodes.api.js            # markWatched, unmarkWatched, getSeriesProgress,
                                    # markSeriesCompleted
  components/
    ui/                        # empty — shadcn removed; DaisyUI needs no component files
    layout/
      Navbar.jsx                # brand (unclickable) + Home button + top-right search box
      Sidebar.jsx                 # Home, My List, username (→ /profile), Login/Register or Logout
      AppLayout.jsx                # composes Navbar + Sidebar + <Outlet/>
  context/
    AuthContext.jsx              # user + token state; login/register/logout/refreshUser
  routes/
    ProtectedRoute.jsx            # redirects to /login if not authenticated
  pages/
    HomePage.jsx                  # hero + TMDB "popular now" grid
    SearchPage.jsx                  # reads ?q= from URL, TMDB search results, click imports + navigates
    SeriesDetailPage.jsx             # progress bar, season/episode checklist, watchlist toggle, mark-completed
    ProfilePage.jsx                    # stats cards + editable profile form
    LoginPage.jsx / RegisterPage.jsx     # auth forms
  App.jsx                         # <Routes> tree
  main.jsx                          # BrowserRouter > QueryClientProvider > AuthProvider > App
```

## Routes

| Path                | Page                | Protected? |
|---------------------|----------------------|------------|
| `/`                  | `HomePage`            | No |
| `/search`             | `SearchPage`           | No |
| `/series/:seriesId`    | `SeriesDetailPage`      | No (but progress query is `enabled: !!user`) |
| `/login`               | `LoginPage`              | No |
| `/register`             | `RegisterPage`            | No |
| `/profile`               | `ProfilePage`              | Yes |

(`/my-list` previously existed as its own page/route; it was merged into
`/profile` and removed — see STATE.md.)

## Data flow — key examples

**Search → import → detail**
1. Navbar search box (top-right) submits → `navigate('/search?q=...')`.
2. `SearchPage` reads `q` from `useSearchParams()`, runs
   `useQuery(['seriesSearch', q], () => searchSeries(q), { enabled: !!q })`
   — this makes results shareable/bookmarkable by URL and correct on
   browser back/forward.
3. Clicking a result card calls `importMutation.mutate(tmdbId)` →
   `POST /series/:tmdbId/import` → on success, `navigate('/series/:seriesId')`
   using the **internal** `series_id` the backend returns (not the TMDB ID).

**Series Detail — status + progress**
`SeriesDetailPage` runs two independent queries:
- `['seriesStatus', seriesId]` → `getSeriesStatus` → drives the
  watchlist-toggle button's label/style (`Add to Watchlist` / `Watchlist` /
  `Watching` / `Completed`).
- `['seriesProgress', seriesId]` → `getSeriesProgress` → drives the
  progress bar and the season/episode checklist (each checkbox's `checked`
  reflects `ep.watched` from this response).

Three mutations act on this page, and **all of them invalidate both of the
above query keys plus `['myStats']`** so the UI, the toggle button, and
Profile stats stay in sync without any manual client-side state
recalculation:
- `toggleWatchlistMutation` — add (if no status) or remove (if any status
  exists) from the list.
- `toggleWatchedMutation` — mark/unmark a single episode.
- `markCompletedMutation` — bulk-mark every episode watched.

**My List / Profile**
`ProfilePage` combines: a stats block (`['myStats']` →
`getMyStats`) and a filterable series grid (`['mySeries', activeStatus]` →
`getMySeries`), with a status `<select>` per card (`updateSeriesStatus`)
and a remove button (`removeSeriesFromList`) — both invalidate `mySeries`
(and `removeSeriesFromList` also invalidates `myStats`, since removing a
series deletes its watch history server-side).

## Auth flow

- `AuthContext` holds `user` + `loading`. On mount, if a token exists in
  `localStorage`, it calls `getMe()` to restore the session; on failure it
  clears the token.
- `login(username, password)` and `register(username, password)` both
  resolve to storing the token and setting `user`; `register` internally
  calls `login` afterward (auto-login on successful signup).
- `axiosClient`'s request interceptor attaches
  `Authorization: Bearer <token>` from `localStorage` to every request.
  Its response interceptor clears the token on any `401`.
- `ProtectedRoute` reads `useAuth()` and redirects to `/login` if `loading`
  is false and `user` is null.

## Design reasoning

See `DECISIONS.md` for the numbered rationale behind: plain JS vs. TS,
DaisyUI vs. shadcn, JWT-in-localStorage, URL-driven search page, merging My
List into Profile, and treating the backend's status state machine as the
single source of truth rather than re-deriving it client-side.
