import { createAction, props } from '@ngrx/store';

// * Interfaces.
import { IInvoice, IProduct } from '@ecommerce/interfaces/ecommerce.interface';

// * LOAD MERCHANT.
export const LOAD_ECOMMERCE_MERCHANT = createAction('[Ecommerce] Load Merchant', props<{ slug: string }>());
export const LOADED_ECOMMERCE_MERCHANT = createAction(
	'[Ecommerce] Loaded Merchant',
	props<{ id: number; slug: string }>()
);

// * LOAD PRODUCTS.
export const LOAD_ECOMMERCE_PRODUCTS = createAction(
	'[Ecommerce] Load Products',
	props<{ merchant: number; page: number }>()
);
export const LOADED_ECOMMERCE_PRODUCTS = createAction('[Ecommerce] Loaded Products', props<{ products: IProduct[] }>());

// * LOAD PRODUCT.
export const LOAD_ECOMMERCE_PRODUCT = createAction('[Ecommerce] Load Product', props<{ id: number }>());
export const LOADED_ECOMMERCE_PRODUCT = createAction('[Ecommerce] Loaded Product', props<{ product: IProduct }>());

// * LOAD PRODUCT INFO.
export const LOAD_ECOMMERCE_PRODUCT_INFO = createAction('[Ecommerce] Load Product Info', props<{ id: number }>());
export const LOADED_ECOMMERCE_PRODUCT_INFO = createAction(
	'[Ecommerce] Loaded Product Info',
	props<{ id: number; stock: number; images: string[] }>()
);

// * LOAD PRODUCT DETAIL.
export const LOAD_ECOMMERCE_PRODUCT_DETAIL = createAction('[Ecommerce] Load Product Detail', props<{ id: number }>());
export const LOADED_ECOMMERCE_PRODUCT_DETAIL = createAction(
	'[Ecommerce] Loaded Product Detail',
	props<{ id: number; detail: IProduct['detail'] }>()
);

// * LOAD INVOICE.
export const LOAD_ECOMMERCE_INVOICE = createAction(
	'[Ecommerce] Load Invoice',
	props<{ merchant: number; user?: number; status?: 'COMPLETE' | 'INITIAL' | 'PENDING' }>()
);
export const LOADED_ECOMMERCE_INVOICE = createAction('[Ecommerce] Loaded Invoice', props<{ invoice: IInvoice }>());
