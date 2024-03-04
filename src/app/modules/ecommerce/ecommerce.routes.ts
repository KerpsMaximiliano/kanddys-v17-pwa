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

export const ECOMMERCE_ROUTES: Routes = [
	{
		path: '',
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		loadComponent: () => import('./ecommerce.component').then((m) => m.EcommerceComponent),
		children: [
			{
				path: 'shop',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/shop/shop.component').then((m) => m.ShopComponent)
			},
			{
				path: 'product/:id',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/product/product.component').then((m) => m.ProductComponent)
			},
			{
				path: 'order/:id',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/order/order.component').then((m) => m.OrderComponent)
			},
			{
				path: 'message',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/message/message.component').then((m) => m.MessageComponent)
			},
			{
				path: 'calendar',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/calendar/calendar.component').then((m) => m.CalendarComponent)
			},
			{
				path: 'address',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/address/address.component').then((m) => m.AddressComponent)
			},
			{
				path: 'payments',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/payment/payment.component').then((m) => m.PaymentComponent)
			},
			{
				path: 'invoice/:id',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/invoice/invoice.component').then((m) => m.InvoiceComponent)
			},
			{
				path: '**',
				redirectTo: 'shop',
				pathMatch: 'full'
			}
		]
	},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
	}
];
