import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
  withNoHttpTransferCache
} from '@angular/platform-browser';
import { authInterceptor } from './interceptors/auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    // withNoHttpTransferCache(): without this, Angular 17+ caches every
    // SSR/prerender HTTP GET in TransferState and replays it on hydration,
    // skipping the client-side fetch. For dashboard routes that are
    // prerendered at build time (when the backend is OFF), this caches an
    // empty response and the page only "wakes up" on a router navigation
    // (e.g. clicking the brand logo), which is exactly the bug we saw.
    provideClientHydration(withEventReplay(), withNoHttpTransferCache())
  ]
};
