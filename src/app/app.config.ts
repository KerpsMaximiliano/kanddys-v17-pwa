import { ApplicationConfig, isDevMode } from '@angular/core';

// * HTTP.
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';

// * Animations.
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// * Routing.
import { provideRouter, withViewTransitions } from '@angular/router';

// * Service worker.
import { provideServiceWorker } from '@angular/service-worker';

// * NgRx.
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// * State.
import { ROOT_EFFECTS } from './app.effects';
import { ROOT_REDUCERS } from './app.reducers';

// * GraphQL.
import { GRAPHQL_PROVIDER } from './app.graphql';

// * Routes.
import { ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideAnimationsAsync(),
		provideHttpClient(withJsonpSupport()),
		GRAPHQL_PROVIDER,
		provideRouter(ROUTES, withViewTransitions()),
		provideStore(ROOT_REDUCERS),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
		provideServiceWorker('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerWhenStable:30000'
		}),
		provideEffects(ROOT_EFFECTS)
	]
};
