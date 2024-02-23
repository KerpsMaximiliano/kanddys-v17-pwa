import { ApplicationConfig, inject } from '@angular/core';

// * Apollo.
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

function apolloOptionsFactory(): ApolloClientOptions<unknown> {
	const httpLink = inject(HttpLink);
	return {
		link: httpLink.create({ uri: 'https://laia-dev.up.railway.app/graphql' }),
		cache: new InMemoryCache()
	};
}

export const GRAPHQL_PROVIDER: ApplicationConfig['providers'] = [
	Apollo,
	{ provide: APOLLO_OPTIONS, useFactory: apolloOptionsFactory }
];
