import { Routes } from '@angular/router';

// ! IMPORTANT: Always include this comment before the loadComponent line.
// It serves to disable specific ESLint rules for the next line of code, preventing any ESLint errors that may occur during code execution.
// eslint-disable-next-line @typescript-eslint/promise-function-async
// ! EXAMPLE:
// {
// 	path: 'example',
// // eslint-disable-next-line @typescript-eslint/promise-function-async
// 	loadComponent: () => import('./example/example.component').then((m) => m.ExampleComponent)
// },

export const AUTH_ROUTES: Routes = [
	{
		path: 'login',
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
	},
	// {
	// 	path: 'info',
	// 	// eslint-disable-next-line @typescript-eslint/promise-function-async
	// 	loadComponent: () => import('./pages/info/info.component').then((m) => m.InfoComponent)
	// },
	{
		path: 'first',
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		loadComponent: () => import('./pages/first/first.component').then((m) => m.FirstComponent)
	},
	{
		path: '**',
		redirectTo: 'login',
		pathMatch: 'full'
	}
];
