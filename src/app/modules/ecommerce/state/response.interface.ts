interface IResponse<T> {
	data: T;
}

interface IMerchant {
	id: number;
}

interface IProduct {
	id: number;
	title: string | null;
	price: number;
	frontPage: string | null;
}

interface IProductInfo {
	stock: number;
	images: {
		url: string;
	}[];
}

interface IProductDetail {
	title: string | null;
	description: string | null;
	url: string | null;
}

interface IInvoice {
	id: number;
	merchantId: number;
	userId: number;
	count?: number;
}

export type IMerchantResponse = IResponse<{ merchantS: IMerchant }>;
export type IProductsResponse = IResponse<{ products: IProduct[] }>;
export type IProductResponse = IResponse<{ productId: IProduct }>;
export type IProductInfoResponse = IResponse<{ productDSId: IProductInfo }>;
export type IProductDetailResponse = IResponse<{ productDId: IProductDetail[] }>;
export type IInvoiceResponse = IResponse<{ gInvoice: IInvoice; cInvoice: IInvoice }>;

// {
// 	"data": {
// 			"cInvoice": {
// 					"id": 13,
// 					"merchantId": 1,
// 					"userId": 9,
// 					"paymentId": null,
// 					"code": "2024-02-23 17:55:19MV1N0",
// 					"shoppingCartId": null,
// 					"reservation": null,
// 					"total": null,
// 					"message": null,
// 					"status": "INITIAL",
// 					"voucher": null,
// 					"note": null
// 			}
// 	}
// }

// {
// 	"data": {
// 			"gInvoice": {
// 					"id": 10,
// 					"merchantId": 1,
// 					"userId": 6,
// 					"paymentId": null,
// 					"code": "2024-02-23 15:22:11MV1N0",
// 					"shoppingCartId": null,
// 					"reservation": null,
// 					"total": null,
// 					"message": null,
// 					"status": "INITIAL",
// 					"voucher": null,
// 					"note": null,
// 					"count": 0
// 			}
// 	}
// }
