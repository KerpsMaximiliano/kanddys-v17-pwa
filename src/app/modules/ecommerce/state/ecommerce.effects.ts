import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

// * Services.
import { CoreService } from '@core/services/core.service';

// * GraphQL.
import {
	QUERY_MERCHANT,
	QUERY_PRODUCT,
	QUERY_PRODUCT_DETAIL,
	QUERY_PRODUCT_INFO,
	QUERY_PRODUCTS
} from './ecommerce.graphql';

// * Interfaces.
import { IProduct } from '@ecommerce/interfaces/ecommerce.interface';
import {
	IMerchantResponse,
	IProductDetailResponse,
	IProductInfoResponse,
	IProductResponse,
	IProductsResponse
} from './response.interface';

// * Actions.
import {
	LOAD_ECOMMERCE_MERCHANT,
	LOAD_ECOMMERCE_PRODUCT,
	LOAD_ECOMMERCE_PRODUCT_DETAIL,
	LOAD_ECOMMERCE_PRODUCT_INFO,
	LOAD_ECOMMERCE_PRODUCTS,
	LOADED_ECOMMERCE_MERCHANT,
	LOADED_ECOMMERCE_PRODUCT,
	LOADED_ECOMMERCE_PRODUCT_DETAIL,
	LOADED_ECOMMERCE_PRODUCT_INFO,
	LOADED_ECOMMERCE_PRODUCTS
} from './ecommerce.actions';

@Injectable({ providedIn: 'root' })
export class EcommerceEffects {
	private readonly _actions$: Actions = inject(Actions);
	private readonly _core: CoreService = inject(CoreService);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceMerchant$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_MERCHANT),
			exhaustMap((action) =>
				this._core.query<IMerchantResponse['data']>(QUERY_MERCHANT, { slug: action.slug }).pipe(
					map((merchant) => {
						this._core.merchant = merchant.merchantS.id;
						return LOADED_ECOMMERCE_MERCHANT({ id: merchant.merchantS.id, slug: action.slug });
					}),
					catchError(() => of({ type: 'ERROR_ECOMMERCE_MERCHANT' }))
				)
			)
		);
	});

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceProducts$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_PRODUCTS),
			exhaustMap((action) =>
				this._core
					.query<IProductsResponse['data']>(QUERY_PRODUCTS, {
						page: action.page,
						merchant: action.merchant
					})
					.pipe(
						map((data) => this._transformProducts(data)),
						map((products) => LOADED_ECOMMERCE_PRODUCTS({ products })),
						catchError(() => of({ type: 'ERROR_ECOMMERCE_PRODUCTS' }))
					)
			)
		);
	});

	private _transformProducts(products: IProductsResponse['data']): IProduct[] {
		return products.products.map((product) => {
			return {
				id: product.id,
				title: product.title,
				price: product.price,
				images: product.frontPage ? [product.frontPage] : []
			};
		});
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceProduct$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_PRODUCT),
			exhaustMap((action) =>
				this._core.query<IProductResponse['data']>(QUERY_PRODUCT, { product: action.id }).pipe(
					map((product) => {
						return LOADED_ECOMMERCE_PRODUCT({
							product: {
								id: product.productId.id,
								title: product.productId.title,
								price: product.productId.price,
								images: product.productId.frontPage ? [product.productId.frontPage] : []
							}
						});
					}),
					catchError(() => of({ type: 'ERROR_ECOMMERCE_PRODUCT' }))
				)
			)
		);
	});

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceProductInfo$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_PRODUCT_INFO),
			exhaustMap((action) =>
				this._core.query<IProductInfoResponse['data']>(QUERY_PRODUCT_INFO, { product: action.id }).pipe(
					map((res) =>
						LOADED_ECOMMERCE_PRODUCT_INFO({
							id: action.id,
							stock: res.productDSId.stock,
							images: res.productDSId.images.map((image) => image.url)
						})
					),
					catchError(() => of({ type: 'ERROR_ECOMMERCE_PRODUCT_INFO' }))
				)
			)
		);
	});

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceProductDetail$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_PRODUCT_DETAIL),
			exhaustMap((action) =>
				this._core.query<IProductDetailResponse['data']>(QUERY_PRODUCT_DETAIL, { product: action.id }).pipe(
					map((data) => this._transformProductDetail(data)),
					map((detail) => LOADED_ECOMMERCE_PRODUCT_DETAIL({ id: action.id, detail })),
					catchError(() => of({ type: 'ERROR_ECOMMERCE_PRODUCT_DETAIL' }))
				)
			)
		);
	});

	private _transformProductDetail(details: IProductDetailResponse['data']): IProduct['detail'] {
		return details.productDId.map((detail) => {
			return {
				title: detail.title,
				description: detail.description,
				url: detail.url
			};
		});
	}
}
