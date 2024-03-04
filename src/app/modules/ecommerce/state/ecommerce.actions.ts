import { createAction, props } from '@ngrx/store';

// * Interfaces.
import { ILoadableEntity } from '@core/interfaces/state.interface';
import { IBatch, ICalendar, IInfo, IOrder, IPayment, IProduct, IUser } from '@ecommerce/interfaces/ecommerce.interface';

// * USER RESET.
export const USER_RESTORE = createAction('[Ecommerce] Restore User');

// * USER CHECK.
export const USER_CHECK = createAction('[Ecommerce] User Check', props<{ email: string }>());
export const USER_CHECKED = createAction('[Ecommerce] User Checked', props<{ check: number; logged: boolean }>());

// * USER LOGIN.
export const USER_LOGIN = createAction(
	'[Ecommerce] User Login',
	props<{ user: number; email: string; password: string }>()
);
export const USER_LOGIN_SUCCESS = createAction('[Ecommerce] User Success', props<{ email: string }>());
export const USER_LOGIN_ERROR = createAction('[Ecommerce] User Error', props<{ err: number }>());

// * USER INFO.
export const USER_INFO = createAction(
	'[Ecommerce] User Info',
	props<{ name?: string; surname?: string; phone?: string }>()
);
export const USER_INFO_SUCCESS = createAction(
	'[Ecommerce] User Info Success',
	props<{ name: string; surname: string; phone: string }>()
);

// * USER LOGOUT.
export const USER_LOGOUT = createAction('[Ecommerce] User Logout');
export const USER_LOGOUT_SUCCESS = createAction('[Ecommerce] User Logout Success');

// * USER ADDRESSES.
export const LOAD_USER_ADDRESSES = createAction('[Ecommerce] Load User Addresses', props<{ page?: number }>());
export const LOADED_USER_ADDRESSES = createAction(
	'[Ecommerce] Loaded User Addresses',
	props<{
		addresses: IUser['address']['items'];
	}>()
);

// * USER ADD ADDRESS.
export const ADD_USER_ADDRESS = createAction(
	'[Ecommerce] Add User Address',
	props<{ lng: string; lat: string; direction: string; update: boolean }>()
);
export const ADDED_USER_ADDRESS = createAction(
	'[Ecommerce] Added User Address',
	props<{ address: IUser['address']['items'][number]; update: boolean }>()
);

// * MERCHANT ADDRESSES.
export const LOAD_MERCHANT_ADDRESSES = createAction('[Ecommerce] Load Merchant Addresses', props<{ page?: number }>());
export const LOADED_MERCHANT_ADDRESSES = createAction(
	'[Ecommerce] Loaded Merchant Addresses',
	props<{
		addresses: string[];
	}>()
);

// * PAGE SHOP.
export const LOAD_ECOMMERCE_PAGE_SHOP = createAction(
	'[Ecommerce] Load Page Shop',
	props<{ slug: string; page: number }>()
);
export const LOADED_ECOMMERCE_PAGE_SHOP = createAction(
	'[Ecommerce] Loaded Page Shop',
	props<{
		user: { id: number; logged: boolean };
		merchant: { id: number; title: string | null; slug: string };
		order: { id: number; count: number };
		products: ILoadableEntity<{ id: number; title: string | null; price: number; images: string[] }>[];
		info: IInfo;
	}>()
);

// * PRODUCTS.
export const LOAD_ECOMMERCE_PRODUCTS = createAction(
	'[Ecommerce] Load Products',
	props<{ merchant: number; page: number }>()
);
export const LOADED_ECOMMERCE_PRODUCTS = createAction(
	'[Ecommerce] Loaded Products',
	props<{ products: ILoadableEntity<{ id: number; title: string | null; price: number; images: string[] }>[] }>()
);

// * PAGE PRODUCT.
export const LOAD_ECOMMERCE_PAGE_PRODUCT = createAction(
	'[Ecommerce] Load Page Product',
	props<{ product: number; slug: string }>()
);
export const LOADED_ECOMMERCE_PAGE_PRODUCT = createAction(
	'[Ecommerce] Loaded Page Product',
	props<{
		user: { id: number; logged: boolean };
		merchant: { id: number; title: string | null; slug: string };
		order: { id: number; count: number };
		product: ILoadableEntity<IProduct>;
		info: IInfo;
	}>()
);

// * PRODUCT.
export const LOAD_ECOMMERCE_PRODUCT = createAction(
	'[Ecommerce] Load Product',
	props<{ product: number; order?: number }>()
);
export const LOADED_ECOMMERCE_PRODUCT = createAction(
	'[Ecommerce] Loaded Product',
	props<{
		product: {
			id: number;
			stock: number;
			images: string[];
			details: { title: string | null; description: string | null; image: string | null }[];
			check: number;
		};
	}>()
);

// * ADD CART PRODUCT.
export const ADD_ECOMMERCE_CART_PRODUCT = createAction('[Ecommerce] Add Product', props<{ product: IProduct }>());
export const ADDED_ECOMMERCE_CART_PRODUCT = createAction('[Ecommerce] Added Product', props<{ product: IProduct }>());

// * CART.
export const LOAD_ECOMMERCE_CART = createAction('[Ecommerce] Load Cart', props<{ order: number; page?: number }>());
export const LOADED_ECOMMERCE_CART = createAction('[Ecommerce] Loaded Cart', props<{ products: IOrder['products'] }>());

// * ORDER.
export const LOAD_ECOMMERCE_ORDER = createAction('[Ecommerce] Load Order', props<{ order: number }>());
export const LOADED_ECOMMERCE_ORDER = createAction(
	'[Ecommerce] Loaded Order',
	props<{
		calendar?: { id: number; reservation: string };
		message: string | null;
		address: {
			id: number;
			direction: string | null;
			lat: string | null;
			lng: string | null;
			mode: 'DELIVERY' | 'PICK-UP';
		};
		total: number;
	}>()
);

// * UPDATE CART PRODUCT.
export const UPDATE_ECOMMERCE_CART_PRODUCT = createAction(
	'[Ecommerce] Update Product',
	props<{ product: number; quantity: number }>()
);

// * UPDATE CART.
export const UPDATE_ECOMMERCE_CART = createAction(
	'[Ecommerce] Update Cart',
	props<{ products: IOrder['products']['items'] }>()
);
export const UPDATED_ECOMMERCE_CART = createAction(
	'[Ecommerce] Updated Cart',
	props<{ products: IOrder['products']['items'] }>()
);

// * UPDATE ORDER MESSAGE.
export const UPDATE_ECOMMERCE_ORDER_MESSAGE = createAction(
	'[Ecommerce] Update Order Message',
	props<{ order: number; message: string }>()
);
export const UPDATED_ECOMMERCE_ORDER_MESSAGE = createAction(
	'[Ecommerce] Updated Order Message',
	props<{ message: string }>()
);

// * CALENDAR.
export const LOAD_ECOMMERCE_CALENDAR = createAction(
	'[Ecommerce] Load Calendar',
	props<{ year: number; month: number; day?: number }>()
);
export const LOADED_ECOMMERCE_CALENDAR = createAction(
	'[Ecommerce] Loaded Calendar',
	props<{ calendar: ICalendar; details: boolean }>()
);

// * BATCHES.
export const LOAD_ECOMMERCE_BATCHES = createAction(
	'[Ecommerce] Load Batches',
	props<{ calendar: number; day: string; date: string; exception?: number }>()
);
export const LOADED_ECOMMERCE_BATCHES = createAction('[Ecommerce] Loaded Batches', props<{ batches: IBatch[] }>());

// * UPDATE ORDER CALENDAR.
export const UPDATE_ECOMMERCE_ORDER_CALENDAR = createAction(
	'[Ecommerce] Update Order Calendar',
	props<{ batch: number; date: string }>()
);
export const UPDATED_ECOMMERCE_ORDER_CALENDAR = createAction(
	'[Ecommerce] Updated Order Calendar',
	props<{ id: number; reservation: string }>()
);

// * UPDATE ORDER ADDRESS.
export const UPDATE_ECOMMERCE_ORDER_ADDRESS = createAction(
	'[Ecommerce] Update Order Address',
	props<{ id: number; direction: string; lat: string; lng: string; mode: 'DELIVERY' | 'PICK-UP' }>()
);
export const UPDATED_ECOMMERCE_ORDER_ADDRESS = createAction(
	'[Ecommerce] Updated Order Address',
	props<{ id: number; direction: string; lat: string; lng: string; mode: 'DELIVERY' | 'PICK-UP' }>()
);

// * PAYMENTS.
export const LOAD_ECOMMERCE_PAYMENTS = createAction('[Ecommerce] Load Payments', props<{ page?: number }>());
export const LOADED_ECOMMERCE_PAYMENTS = createAction('[Ecommerce] Loaded Payments', props<{ payments: IPayment[] }>());

// * UPDATE ORDER.
export const UPDATE_ECOMMERCE_ORDER = createAction(
	'[Ecommerce] Update Order',
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props<{ voucher: any; payment: number; date: string; batch: number }>()
);
export const UPDATED_ECOMMERCE_ORDER = createAction(
	'[Ecommerce] Updated Order',
	props<{ order: number; payment: number; voucher: string }>()
);

// * RESER ORDER.
export const RESET_ORDER = createAction('[Ecommerce] Reset Order');

// * INVOICE.
export const LOAD_ECOMMERCE_INVOICE = createAction('[Ecommerce] Load Invoice', props<{ invoice: number }>());
export const LOADED_ECOMMERCE_INVOICE = createAction('[Ecommerce] Loaded Invoice', props<{ invoice: IOrder }>());
