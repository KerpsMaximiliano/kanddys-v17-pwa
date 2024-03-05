import { IDays, ILoadableEntities, ILoadableEntity, ILoading } from '@core/interfaces/state.interface';

// * MAIN

export interface IEcommerce {
	merchant: ILoadableEntity<IMerchant>;
	order: ILoadableEntity<IOrder>;
	products: ILoadableEntities<ILoadableEntity<IProduct>>;
	user: ILoadableEntity<IUser>;
	batches: ILoadableEntities<IBatch>;
	info: ILoadableEntity<IInfo>;
	invoice: ILoadableEntity<IInvoice>;
}

export interface IUser {
	id: number;
	check: number | null;
	logged: boolean;
	name: string | null;
	surname: string | null;
	email: string | null;
	phone: number | null;
	image: string | null;
	address: ILoadableEntities<IAddress>;
}

export interface IAddress {
	id: number;
	lng: string | null;
	lat: string | null;
	direction: string | null;
	mode?: 'DELIVERY' | 'PICK-UP';
}

export interface IMerchant {
	id: number;
	slug: string;
	title: string | null;
	image: string | null;
	payments: ILoadableEntities<IPayment>;
	calendar: ILoadableEntity<ICalendar>;
	address: ILoadableEntities<string>;
}

export interface IProduct {
	id: number;
	title: string | null;
	images: string[];
	price: number;
	details: IDetail[];
	stock: number;
	check: number;
}

export interface IDetail {
	title: string | null;
	description: string | null;
	image: string | null;
}

export interface ICalendar {
	id: number;
	delay: number;
	// eslint-disable-next-line @typescript-eslint/sort-type-constituents
	typeDelay: 'HR' | 'MN' | 'DY';
	// eslint-disable-next-line @typescript-eslint/sort-type-constituents
	days: IDays[];
	disabled: string[];
	exceptions: string[];
}

export interface IBatch {
	id: number;
	title: string | null;
	from: string;
	to: string;
}

export interface IPayment {
	id: number;
	type: 'BT';
	title: string | null;
	cvu: string | null;
}

export interface IOrder {
	id: number;
	count: number;
	products: {
		status: ILoading;
		items: IOrderProduct[];
	};
	merchant: number;
	user: number;
	calendar: ILoadableEntity<{
		id: number | null;
		reservation: string | null;
	}>;
	message: ILoadableEntity<string | null>;
	address: ILoadableEntity<{
		id: number;
		direction: string | null;
		lat: string | null;
		lng: string | null;
		mode?: 'DELIVERY' | 'PICK-UP';
	}>;
	total: number;
}

export interface IInvoice {
	id: number;
	merchant: number;
	user: number;
	code: string;
	products: {
		image: string | null;
		title: string | null;
		price: number;
		quantity: number;
	}[];
	total: number;
	reservation: string;
	message: string | null;
	voucher: string;
	note: string | null;
	addressLat: string;
	addressLng: string;
	addressDirection: string;
	status: 'COMPLETE' | 'PENDING';
}

export interface IInfo {
	calendar?: string;
	direction?: string;
	batch?: number;
	from?: string;
	to?: string;
}

// ! AUX.

interface IOrderProduct {
	id: number;
	title: string | null;
	image: string | null;
	price: number;
	stock: number;
	quantity: number;
}

export interface ICart {
	id: number;
	slug: string;
	status: ILoading;
	products: IOrder['products'];
	count: number;
}

export interface IMessage {
	order: { status: ILoading; id: number };
	message: ILoadableEntity<string | null>;
}

export interface IOrderRequest {
	voucher: File;
	invoiceId: string;
	paymentId: string;
	date: string;
	batchId: string;
	merchantId: string;
	userId: string;
}
