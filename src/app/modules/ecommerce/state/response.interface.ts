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

export type IMerchantResponse = IResponse<{ merchantS: IMerchant }>;
export type IProductsResponse = IResponse<{ products: IProduct[] }>;
export type IProductResponse = IResponse<{ productId: IProduct }>;
export type IProductInfoResponse = IResponse<{ productDSId: IProductInfo }>;
export type IProductDetailResponse = IResponse<{ productDId: IProductDetail[] }>;
