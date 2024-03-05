import { MemoizedSelector, createSelector } from '@ngrx/store';

// * State.
import { state } from '@core/state';

// * Interfaces.
import { ILoadableEntities, ILoadableEntity, ILoading, IState, loading } from '@core/interfaces/state.interface';
import {
	IBatch,
	ICalendar,
	ICart,
	IEcommerce,
	IInvoice,
	IMerchant,
	IMessage,
	IOrder,
	IPayment,
	IProduct,
	IUser
} from '@ecommerce/interfaces/ecommerce.interface';

// * Selectors.
// * USER.
export const selectEcommerceUser = createSelector(
	state,
	(state: IState): ILoadableEntity<IUser> => state.ecommerce.user
);

// * USER LOGGED.
export const selectEcommerceUserLogin = createSelector(state, (state: IState): { id: number; logged: boolean } => {
	return {
		id: state.ecommerce.user.data.id,
		logged: state.ecommerce.user.data.logged
	};
});

// * USER ADDRESSES.
export const selectEcommerceUserAddresses = createSelector(
	state,
	(state: IState): IUser['address'] => state.ecommerce.user.data.address
);

// * MERCHANT.
export const selectEcommerceMerchant = createSelector(
	state,
	(state: IState): ILoadableEntity<IMerchant> => state.ecommerce.merchant
);

// * MERCHANT ADDRESSES.
export const selectEcommerceMerchantAddress = createSelector(
	state,
	(state: IState): ILoadableEntities<string> => state.ecommerce.merchant.data.address
);

// * INFO.
export const selectEcommerceInfo = createSelector(state, (state: IState): IEcommerce['info'] => state.ecommerce.info);

// * PRODUCTS.
export const selectEcommerceProducts = createSelector(
	state,
	(state: IState): ILoadableEntities<ILoadableEntity<IProduct>> => state.ecommerce.products
);

// * PRODUCT.
export const selectEcommerceProduct = (id: number | undefined): MemoizedSelector<IState, ILoadableEntity<IProduct>> =>
	createSelector(state, (state: IState): ILoadableEntity<IProduct> => {
		const err: ILoadableEntity<IProduct> = {
			status: loading,
			data: {
				id: 0,
				title: null,
				price: 0,
				images: [],
				stock: 0,
				details: [],
				check: 0
			}
		};
		if (!id) {
			return err;
		} else {
			const product: ILoadableEntity<IProduct> | undefined =
				state.ecommerce.products.items.find((product: ILoadableEntity<IProduct>) => product.data.id === id) ||
				undefined;
			return product ?? err;
		}
	});

// * CART INFO.
export const selectEcommerceCartInfo = createSelector(state, (state: IState): { id: number; count: number } => {
	return {
		id: state.ecommerce.order.data.id,
		count: state.ecommerce.order.data.count
	};
});

// * CART.
export const selectEcommerceCart = createSelector(state, (state: IState): ICart => {
	return {
		id: state.ecommerce.order.data.id,
		slug: state.ecommerce.merchant.data.slug,
		status: state.ecommerce.order.status,
		products: state.ecommerce.order.data.products,
		count: state.ecommerce.order.data.count
	};
});

// * ORDER.
export const selectEcommerceOrder = createSelector(
	state,
	(state: IState): ILoadableEntity<IOrder> => state.ecommerce.order
);

// * ORDER ID.
export const selectEcommerceOrderID = createSelector(state, (state: IState): { id: number; status: ILoading } => {
	return {
		id: state.ecommerce.order.data.id,
		status: state.ecommerce.order.status
	};
});

// * MESSAGE.
export const selectEcommerceMessage = createSelector(state, (state: IState): IMessage => {
	return {
		order: { status: state.ecommerce.order.status, id: state.ecommerce.order.data.id },
		message: state.ecommerce.order.data.message
	};
});

// * CALENDAR.
export const selectEcommerceCalendar = createSelector(
	state,
	(state: IState): ILoadableEntity<ICalendar> => state.ecommerce.merchant.data.calendar
);

// * BATCHES.
export const selectEcommerceBatches = createSelector(
	state,
	(state: IState): ILoadableEntities<IBatch> => state.ecommerce.batches
);

// * ADDRESS.
export const selectEcommerceAddress = createSelector(
	state,
	(state: IState): IEcommerce['order']['data']['address']['data'] => {
		return {
			id: state.ecommerce.order.data.address.data.id,
			mode: state.ecommerce.order.data.address.data.mode,
			lat: state.ecommerce.order.data.address.data.lat,
			lng: state.ecommerce.order.data.address.data.lng,
			direction: state.ecommerce.order.data.address.data.direction
		};
	}
);

// * PAYMENTS.
export const selectEcommercePayments = createSelector(
	state,
	(state: IState): ILoadableEntities<IPayment> => state.ecommerce.merchant.data.payments
);

// * INVOICE.
export const selectEcommerceInvoice = createSelector(
	state,
	(state: IState): ILoadableEntity<IInvoice> => state.ecommerce.invoice
);

// * INVOICE ID.
export const selectEcommerceInvoiceID = createSelector(state, (state: IState): { id: number; status: ILoading } => {
	return {
		id: state.ecommerce.invoice.data.id,
		status: state.ecommerce.invoice.status
	};
});

// * INVOICE MAP.
export const selectEcommerceInvoiceMap = createSelector(
	state,
	(state: IState): { status: ILoading; direction: string; lat: number; lng: number } => {
		return {
			status: state.ecommerce.invoice.status,
			direction: state.ecommerce.invoice.data.addressDirection,
			lat: Number(state.ecommerce.invoice.data.addressLat),
			lng: Number(state.ecommerce.invoice.data.addressLng)
		};
	}
);

// * INVOICE VOUCHER.
export const selectEcommerceInvoiceVoucher = createSelector(
	state,
	(state: IState): string => state.ecommerce.invoice.data.voucher
);
