import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * SSR render-mode policy:
 *
 *  Prerender → static page that doesn't depend on a live backend at request
 *              time (login form, register form, hero copy with no data).
 *
 *  Server    → dynamic page whose initial HTML reflects backend data. Must
 *              be Server, NOT Prerender — prerender runs at `ng build` time
 *              when the backend is offline, captures an empty fetch, and
 *              that empty SSR HTML then ships forever.
 *
 *  All routes that fetch /api/v1/builds, /api/v1/statistics, /api/v1/admin/*
 *  or per-user data are Server-rendered for that reason.
 */
export const serverRoutes: ServerRoute[] = [
  // Auth + static landing surfaces — safe to prerender (no backend fetch on init).
  { path: 'login',           renderMode: RenderMode.Prerender },
  { path: 'register',        renderMode: RenderMode.Prerender },
  { path: 'builds/create',   renderMode: RenderMode.Prerender },
  { path: 'students',        renderMode: RenderMode.Prerender },
  { path: 'students/create', renderMode: RenderMode.Prerender },

  // Dynamic dashboards — must be Server so they fetch fresh data at request time.
  { path: '',                renderMode: RenderMode.Server },
  { path: 'explore',         renderMode: RenderMode.Server },
  { path: 'builds',          renderMode: RenderMode.Server },
  { path: 'my-builds',       renderMode: RenderMode.Server },
  { path: 'statistics',      renderMode: RenderMode.Server },
  { path: 'account',         renderMode: RenderMode.Server },
  { path: 'admin/queue',     renderMode: RenderMode.Server },
  { path: 'admin/users',     renderMode: RenderMode.Server },
  { path: 'test-runs',       renderMode: RenderMode.Server },
  { path: 'marketplace',     renderMode: RenderMode.Server },
  { path: 'messages',        renderMode: RenderMode.Server },

  // Per-id detail / edit pages
  { path: 'builds/:id',         renderMode: RenderMode.Server },
  { path: 'builds/edit/:id',    renderMode: RenderMode.Server },
  { path: 'students/edit/:id',  renderMode: RenderMode.Server },

  // Catch-all
  { path: '**', renderMode: RenderMode.Server }
];
