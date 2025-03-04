import { Routes } from '@angular/router';

// ! IMPORTANT: Always include this comment before the loadComponent line.
// It serves to disable specific ESLint rules for the next line of code, preventing any ESLint errors that may occur during code execution.
// eslint-disable-next-line @typescript-eslint/promise-function-async
// ! EXAMPLE:
// {
// 	path: 'example',
// 	// eslint-disable-next-line @typescript-eslint/promise-function-async
// 	loadComponent: () => import('./example/example.component').then((m) => m.ExampleComponent)
// },

export const ROUTES: Routes = [
	{
		path: 'auth',
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		loadChildren: () => import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES)
	},
	{
		path: ':slug',
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		loadChildren: () => import('./modules/ecommerce/ecommerce.routes').then((m) => m.ECOMMERCE_ROUTES)
	},
	{
		path: '**',
		redirectTo: 'dlicianthus',
		pathMatch: 'full'
	}
];
