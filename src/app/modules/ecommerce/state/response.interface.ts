export interface IResponse<T> {
	data: T;
}

// ! USER.

interface IUser {
	id: number;
	name: string | null;
	email: string | null;
	password: string | null;
	phone: string | null;
	image: string | null;
	first: number;
	operationStatus: number;
}

interface IUserLogin {
	name: string | null;
	phone: string | null;
	image: string | null;
	first: number;
	operationStatus: number;
}

interface IUserAddress {
	id: number;
	// title: string | null;
	lng: string | null;
	lat: string | null;
	direction: string | null;
}

// ! MERCHANT.

interface IMerchantAddress {
	address: string | null;
}

interface IPageShop {
	merchantId: number;
	merchantTitle: string | null;
	invoiceId: number;
	invoiceCount: number;
	userId: number;
	products: {
		id: number;
		title: string | null;
		price: number;
		frontPage: string | null;
	}[];
	merchantDirection: string | null;
	firstShippingDate: string | null;
	batchId: number | null;
	batchFrom: string | null;
	batchTo: string | null;
}

interface IPageProduct {
	merchantId: number;
	merchantTitle: string | null;
	productId: number;
	productTitle: string | null;
	productFrontPage: string | null;
	productPrice: number;
	productStock: number;
	invoiceId: number;
	invoiceCount: number;
	userId: number;
	images: {
		url: string;
	}[];
	details: {
		title: string | null;
		description: string | null;
		url: string | null;
	}[];
	check: number;
	merchantDirection: string | null;
	firstShippingDate: string | null;
	batchId: number | null;
	batchFrom: string | null;
	batchTo: string | null;
}

interface IProducts {
	id: number;
	title: string | null;
	price: number;
	frontPage: string | null;
}

interface IProduct {
	stock: number;
	check: 0 | 1;
	images: {
		url: string;
	}[];
	details: {
		title: string | null;
		description: string | null;
		url: string | null;
	}[];
	merchantDirection: string | null;
	firstShippingDate: string | null;
	batchId: number | null;
	batchFrom: string | null;
	batchTo: string | null;
}

interface ICart {
	quantity: number;
	product: {
		id: number;
		title: string | null;
		price: number;
		stock: number;
		frontPage: string | null;
	};
}

interface IOrder {
	reservation: string | null;
	total: number;
	message: string | null;
	addressDirection: string | null;
	addressLat: string | null;
	addressLng: string | null;
	addressNumber: number | null;
	type?: 'DELIVERY' | 'PICK-UP';
	batchId: number | null;
	merchantDirection: string | null;
	merchantLng: string | null;
	merchantLat: string | null;
}

interface ICalendar {
	calendarId: number;
	delay: number;
	typeDelay: 'DY' | 'HR' | 'MN';
	disabledDates: string[];
	workingDays: string[];
	exceptionsDates: string[];
}

interface IBatch {
	id: number;
	title: string | null;
	from: string;
	to: string;
}

interface IPayment {
	id: number;
	typePayment: 'BT';
	title: string | null;
	cvu: string | null;
}

interface IInvoice {
	merchantId: number;
	userId: number;
	userLastName: string | null;
	userName: string | null;
	userEmail: string;
	code: string;
	reservation: string | null;
	batchFrom: string;
	batchTo: string;
	total: number;
	message: string | null;
	status: 'COMPLETE' | 'PENDING';
	voucher: string;
	note: string | null;
	addressLat: string;
	addressLng: string;
	addressDirection: string;
	reservationType: string;
	products: {
		quantity: number;
		product: {
			title: string | null;
			price: number;
			frontPage: string | null;
		};
	}[];
	createdAt: string;
	updatedAt: string | null;
}

// ! USER.

export type IUserCheckResponse = IResponse<{ lUser: IUser }>;
export type IUserLoginResponse = IResponse<{ lUser: IUserLogin }>;
export type IUserAddressesResponse = IResponse<{ gAddressUId: IUserAddress[] }>;
export type IUserAddAddressResponse = IResponse<{ aAddress: number }>;

// ! MERCHANT.

export type IMerchantAddressesResponse = IResponse<{ merchantId: IMerchantAddress }>;

// ! PAGE.

export type IPageShopResponse = IResponse<{ combinedShop: IPageShop }>;
export type IPageProductResponse = IResponse<{ combinedProduct: IPageProduct }>;

// ! COMPONENTS.

export type IProductsResponse = IResponse<{ products: IProducts[] }>;
export type IProductResponse = IResponse<{ rProduct: IProduct }>;
export type ICartResponse = IResponse<{ gIProducts: ICart[] }>;
export type IOrderResponse = IResponse<{ gInvoice: IOrder }>;
export type ICalendarResponse = IResponse<{ gCalendar: ICalendar }>;
export type IBatchesResponse = IResponse<{ gBatches: IBatch[] }>;
export type IPaymentsResponse = IResponse<{ payments: IPayment[] }>;
export type IInvoiceResponse = IResponse<{ gOrder: IInvoice }>;

// ! REST API.
export interface IInvoiceUpdateResponse {
	url: string | null;
	code: string | null;
	orderId: number | null;
}
