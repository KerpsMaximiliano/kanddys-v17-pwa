import { MemoizedSelector, createSelector } from '@ngrx/store';

// * State.
import { state } from '@core/state';

// * Interfaces.
import { IState } from '@core/interfaces/state.interface';
import { IMerchant, IProduct } from '@ecommerce/interfaces/ecommerce.interface';

// * Selectors.
// * MERCHANT.
export const selectEcommerceMerchant = createSelector(state, (state: IState): IMerchant => state.ecommerce.merchant);
// * PRODUCTS.
export const selectEcommerceProducts = createSelector(state, (state: IState): IProduct[] => state.ecommerce.products);
// * PRODUCT.
// PRODUCT.
export const selectEcommerceProduct = (id: number): MemoizedSelector<IState, IProduct> =>
	createSelector(state, (state: IState): IProduct => {
		const product: IProduct | undefined =
			state.ecommerce.products.find((product: IProduct) => product.id === id) || undefined;

		if (product) {
			return product;
		} else {
			return {
				id: 0,
				title: null,
				price: 0,
				images: []
			};
		}
	});

// * ID.
// export const selectEcommerceId = createSelector(state, (state: IState): string => state.ecommerce.merchant.data.id);
