import { createReducer, on } from '@ngrx/store';

// * Actions.
import {
	LOADED_ECOMMERCE_MERCHANT,
	LOADED_ECOMMERCE_PRODUCT,
	LOADED_ECOMMERCE_PRODUCTS,
	LOADED_ECOMMERCE_PRODUCT_DETAIL,
	LOADED_ECOMMERCE_PRODUCT_INFO,
	LOAD_ECOMMERCE_MERCHANT,
	LOAD_ECOMMERCE_PRODUCT,
	LOAD_ECOMMERCE_PRODUCTS,
	LOAD_ECOMMERCE_PRODUCT_DETAIL,
	LOAD_ECOMMERCE_PRODUCT_INFO
} from './ecommerce.actions';

// * Interfaces.
import { IEcommerce } from '@ecommerce/interfaces/ecommerce.interface';

// * Initial state.
export const ECOMMERCE_STATE: IEcommerce = {
	merchant: {
		id: 0,
		slug: ''
	},
	products: []
};

// * Reducers.
export const ecommerceReducer = createReducer(
	// * INITIAL STATE.
	ECOMMERCE_STATE,
	// * LOAD MERCHANT.
	on(LOAD_ECOMMERCE_MERCHANT, (state): IEcommerce => {
		return { ...state };
	}),
	on(LOADED_ECOMMERCE_MERCHANT, (state, { id, slug }): IEcommerce => {
		return { ...state, merchant: { id, slug }, products: [...state.products] };
	}),
	// * LOAD PRODUCTS.
	on(LOAD_ECOMMERCE_PRODUCTS, (state): IEcommerce => {
		return { ...state };
	}),
	on(LOADED_ECOMMERCE_PRODUCTS, (state, { products }): IEcommerce => {
		return { ...state, merchant: { ...state.merchant }, products: products };
	}),
	// * LOAD PRODUCT.
	on(LOAD_ECOMMERCE_PRODUCT, (state): IEcommerce => {
		return { ...state };
	}),
	on(LOADED_ECOMMERCE_PRODUCT, (state, { product }): IEcommerce => {
		return { ...state, products: [...state.products, product] };
	}),
	// * LOAD PRODUCT INFO.
	on(LOAD_ECOMMERCE_PRODUCT_INFO, (state): IEcommerce => {
		return { ...state };
	}),
	on(LOADED_ECOMMERCE_PRODUCT_INFO, (state, { id, stock, images }): IEcommerce => {
		const products = state.products.map((product) => {
			if (product.id === id) {
				return { ...product, stock, images };
			}
			return product;
		});
		return { ...state, products };
	}),
	// * LOAD PRODUCT DETAIL.
	on(LOAD_ECOMMERCE_PRODUCT_DETAIL, (state): IEcommerce => {
		return { ...state };
	}),
	on(LOADED_ECOMMERCE_PRODUCT_DETAIL, (state, { id, detail }): IEcommerce => {
		const products = state.products.map((product) => {
			if (product.id === id) {
				return { ...product, detail };
			}
			return product;
		});
		return { ...state, products };
	})
);
