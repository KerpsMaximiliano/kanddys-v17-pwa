export interface IEcommerce {
	merchant: IMerchant;
	products: IProduct[];
}

export interface IMerchant {
	id: number;
	slug: string;
}

export interface IProduct {
	id: number;
	title: string | null;
	images: string[];
	price: number;
	detail?: IDetail[];
	stock?: number;
}

export interface IDetail {
	title: string | null;
	description: string | null;
	url: string | null;
}

export interface IInvoice {
	id: number;
	merchant: number;
	user: number;
	count: number;
}

// // * CORE.
// import { ILoading } from '@core/interfaces/app.interface';

// // * INTERFACES.
// export interface IEcommerce {
// 	status: ILoading;
// 	shop: IShop;
// 	conf: IConf;
// 	cart: ICart;
// 	calendar: ICalendar;
// 	disabled?: string[];
// }

// export interface IShop {
// 	merchant: IMerchant;
// 	products: IProduct[];
// }

// export interface IMerchant {
// 	title: string;
// 	description: string;
// 	logo: string;
// 	email: string;
// }

// export interface IProduct {
// 	id: string;
// 	title: string;
// 	description: string;
// 	images: string[];
// 	price: number;
// 	stock: number;
// }

// export interface IConf {
// 	traditional: boolean;
// 	virtual: boolean;
// 	delivery: boolean;
// 	pickup: boolean;
// 	reservation: boolean;
// }

// export interface ICart {
// 	id?: string;
// 	products: {
// 		id: string;
// 		title: string;
// 		description: string;
// 		image: string;
// 		price: number;
// 		stock: number;
// 		quantity: number;
// 	}[];
// 	traditional: string | null;
// 	count: number;
// 	total: number;
// 	valid: boolean;
// }

// export interface ICalendar {
// 	batch: {
// 		limit: number;
// 		to: string;
// 		from: string;
// 		day: string;
// 		title: string;
// 	}[];
// 	delay: number;
// }
