import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withDisabledInitialNavigation, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { httpInterceptor } from '@interceptors';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withDisabledInitialNavigation(),
      withViewTransitions(),
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding()
    ),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptorsFromDi(), withInterceptors([httpInterceptor])),
    provideAnimationsAsync()
  ]
};
