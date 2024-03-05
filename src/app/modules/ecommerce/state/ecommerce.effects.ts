import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

// * Services.
import { CoreService } from '@core/services/core.service';

// * GraphQL.
import {
	MUTATION_INVOICE_NOTE,
	MUTATION_ORDER_ADD_PRODUCT,
	MUTATION_ORDER_ADDRESS,
	MUTATION_ORDER_CALENDAR,
	MUTATION_ORDER_CART,
	MUTATION_ORDER_MESSAGE,
	MUTATION_USER_ADD_ADDRESS,
	MUTATION_USER_INFO,
	QUERY_BATCHES,
	QUERY_CALENDAR,
	QUERY_CART,
	QUERY_INVOICE,
	QUERY_MERCHANT_ADDRESS,
	QUERY_ORDER,
	QUERY_PAGE_PRODUCT,
	QUERY_PAGE_SHOP,
	QUERY_PAYMENTS,
	QUERY_PRODUCT,
	QUERY_PRODUCTS,
	QUERY_USER_ADDRESSES,
	QUERY_USER_CHECK,
	QUERY_USER_LOGIN
} from './ecommerce.graphql';

// * Interfaces.
import { complete, loaded } from '@core/interfaces/state.interface';
import {
	IBatchesResponse,
	ICalendarResponse,
	ICartResponse,
	IInvoiceResponse,
	IInvoiceUpdateResponse,
	IMerchantAddressesResponse,
	IOrderResponse,
	IPageProductResponse,
	IPageShopResponse,
	IPaymentsResponse,
	IProductResponse,
	IProductsResponse,
	IResponse,
	IUserAddAddressResponse,
	IUserAddressesResponse,
	IUserLoginResponse
} from './response.interface';

// * Actions.
import {
	ADD_ECOMMERCE_CART_PRODUCT,
	ADD_USER_ADDRESS,
	ADDED_ECOMMERCE_CART_PRODUCT,
	ADDED_USER_ADDRESS,
	LOAD_ECOMMERCE_BATCHES,
	LOAD_ECOMMERCE_CALENDAR,
	LOAD_ECOMMERCE_CART,
	LOAD_ECOMMERCE_INVOICE,
	LOAD_ECOMMERCE_ORDER,
	LOAD_ECOMMERCE_PAGE_PRODUCT,
	LOAD_ECOMMERCE_PAGE_SHOP,
	LOAD_ECOMMERCE_PAYMENTS,
	LOAD_ECOMMERCE_PRODUCT,
	LOAD_ECOMMERCE_PRODUCTS,
	LOAD_MERCHANT_ADDRESSES,
	LOAD_USER_ADDRESSES,
	LOADED_ECOMMERCE_BATCHES,
	LOADED_ECOMMERCE_CALENDAR,
	LOADED_ECOMMERCE_CART,
	LOADED_ECOMMERCE_INVOICE,
	LOADED_ECOMMERCE_ORDER,
	LOADED_ECOMMERCE_PAGE_PRODUCT,
	LOADED_ECOMMERCE_PAGE_SHOP,
	LOADED_ECOMMERCE_PAYMENTS,
	LOADED_ECOMMERCE_PRODUCT,
	LOADED_ECOMMERCE_PRODUCTS,
	LOADED_MERCHANT_ADDRESSES,
	LOADED_USER_ADDRESSES,
	UPDATE_ECOMMERCE_CART,
	UPDATE_ECOMMERCE_INVOICE_NOTE,
	UPDATE_ECOMMERCE_INVOICE_VOUCHER,
	UPDATE_ECOMMERCE_ORDER,
	UPDATE_ECOMMERCE_ORDER_ADDRESS,
	UPDATE_ECOMMERCE_ORDER_CALENDAR,
	UPDATE_ECOMMERCE_ORDER_MESSAGE,
	UPDATED_ECOMMERCE_CART,
	UPDATED_ECOMMERCE_INVOICE_NOTE,
	UPDATED_ECOMMERCE_INVOICE_VOUCHER,
	UPDATED_ECOMMERCE_ORDER,
	UPDATED_ECOMMERCE_ORDER_ADDRESS,
	UPDATED_ECOMMERCE_ORDER_CALENDAR,
	UPDATED_ECOMMERCE_ORDER_MESSAGE,
	USER_CHECK,
	USER_CHECKED,
	USER_INFO,
	USER_INFO_SUCCESS,
	USER_LOGIN,
	USER_LOGIN_ERROR,
	USER_LOGIN_SUCCESS
} from './ecommerce.actions';

// * Utils.
import { undate } from '@core/util/undate.pipe';

@Injectable({ providedIn: 'root' })
export class EcommerceEffects {
	private readonly _actions$: Actions = inject(Actions);
	private readonly _core: CoreService = inject(CoreService);

	// ! USER CHECK.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly userCheck$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(USER_CHECK),
			exhaustMap((action) => {
				const user: number | undefined = localStorage.getItem('user')
					? Number(localStorage.getItem('user'))
					: undefined;
				if (user) {
					return this._core
						.query<IResponse<{ cUserE: number }>['data']>(QUERY_USER_CHECK, { user, email: action.email }, true)
						.pipe(
							map((res) => {
								if (res.cUserE === 0) localStorage.setItem('email', String(action.email));
								return USER_CHECKED({ check: res.cUserE, logged: res.cUserE === 0 });
							}),
							catchError(() => of({ type: '[ERROR_ECOMMERCE_USER_CHECK]: QUERY_USER_CHECK' }))
						);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_USER_CHECK]: USER_NOT_FOUND' });
				}
			})
		);
	});

	// ! USER LOGIN.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly userLogin$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(USER_LOGIN),
			exhaustMap((action) => {
				let user: number | undefined = localStorage.getItem('user') ? Number(localStorage.getItem('user')) : undefined;
				if (user) {
					if (action.user !== 1) user = action.user;
					return this._core
						.query<
							IUserLoginResponse['data']
						>(QUERY_USER_LOGIN, { user, email: action.email, password: action.password }, false)
						.pipe(
							map((res) => {
								if (res.lUser.operationStatus === 1) {
									localStorage.setItem('user', String(action.user));
									localStorage.setItem('email', action.email);
									this._core.state.ecommerce.user = action.user;
									return USER_LOGIN_SUCCESS({ email: action.email });
								} else {
									return USER_LOGIN_ERROR({ err: 1 });
								}
							}),
							catchError(() => of({ type: '[ERROR_ECOMMERCE_USER_LOGIN]: QUERY_USER_LOGIN' }))
						);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_USER_LOGIN]: USER_NOT_FOUND' });
				}
			})
		);
	});

	// ! USER ADDRESSES.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadUserAddresses$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_USER_ADDRESSES),
			exhaustMap((action) => {
				const user: number | undefined = this._core.state.ecommerce.user;
				if (user) {
					return this._core
						.query<IUserAddressesResponse['data']>(QUERY_USER_ADDRESSES, { user: user, page: action.page ?? 1 })
						.pipe(
							map(
								(res) =>
									LOADED_USER_ADDRESSES({
										addresses: res.gAddressUId.map((address) => {
											return {
												id: address.id,
												lng: address.lng,
												lat: address.lat,
												direction: address.direction ?? 'Sin dirección'
											};
										})
									}),
								catchError(() => of({ type: '[ERROR_ECOMMERCE_USER_ADDRESSES]: QUERY_USER_ADDRESSES' }))
							)
						);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_USER_ADDRESSES]: USER_NOT_FOUND' });
				}
			})
		);
	});

	// ! USER ADD ADDRESS.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly addUserAddress$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(ADD_USER_ADDRESS),
			exhaustMap((action) => {
				const user: number | undefined = this._core.state.ecommerce.user;
				if (user) {
					if (action.update) {
						return this._core
							.mutation<IUserAddAddressResponse['data']>(MUTATION_USER_ADD_ADDRESS, {
								user,
								lng: `${action.lng}`,
								lat: `${action.lat}`,
								direction: action.direction
							})
							.pipe(
								map((res) =>
									ADDED_USER_ADDRESS({
										address: {
											id: res.aAddress,
											direction: action.direction,
											lat: action.lat,
											lng: action.lng
										},
										update: action.update
									})
								),
								catchError(() => of({ type: '[ERROR_ECOMMERCE_USER_ADD_ADDRESS]: MUTATION_USER_ADD_ADDRESS' }))
							);
					} else {
						return of(
							ADDED_USER_ADDRESS({
								address: { id: -1, direction: action.direction, lat: action.lat, lng: action.lng },
								update: action.update
							})
						);
					}
				} else {
					return of({ type: '[ERROR_ECOMMERCE_USER_ADD_ADDRESS]: USER_NOT_FOUND' });
				}
			})
		);
	});

	// ! USER INFO.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly updateUserInfo$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(USER_INFO),
			exhaustMap((action) => {
				const user: number | undefined = this._core.state.ecommerce.user;
				if (user) {
					return this._core
						.mutation(MUTATION_USER_INFO, {
							user,
							name: action.name,
							surname: action.surname,
							phone: action.phone,
							password: action.password
						})
						.pipe(
							map(() => USER_INFO_SUCCESS({ name: action.name, surname: action.surname, phone: action.phone })),
							catchError(() => of({ type: '[ERROR_ECOMMERCE_USER_INFO]: MUTATION_USER_INFO' }))
						);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_USER_INFO]: USER_NOT_FOUND' });
				}
			})
		);
	});

	// ! MERCHANT ADDRESSES.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadMerchantAddresses$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_MERCHANT_ADDRESSES),
			exhaustMap((action) => {
				const merchant: number | undefined = this._core.state.ecommerce.merchant;
				if (merchant) {
					return this._core
						.query<IMerchantAddressesResponse['data']>(QUERY_MERCHANT_ADDRESS, { merchant, page: action.page ?? 1 })
						.pipe(
							map((res) =>
								LOADED_MERCHANT_ADDRESSES({
									addresses: res.merchantId.address ? [res.merchantId.address] : []
								})
							),
							catchError(() => of({ type: '[ERROR_ECOMMERCE_MERCHANT_ADDRESSES]: QUERY_MERCHANT_ADDRESS' }))
						);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_MERCHANT_ADDRESSES]: MERCHANT_NOT_FOUND' });
				}
			})
		);
	});

	// ! PAGE SHOP.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommercePageShop$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_PAGE_SHOP),
			exhaustMap((action) => {
				let user: number | undefined = undefined;
				if (this._core.state.ecommerce.user) {
					user = this._core.state.ecommerce.user;
				} else {
					user = localStorage.getItem('user') ? Number(localStorage.getItem('user')) : undefined;
				}
				return this._core.query<IPageShopResponse['data']>(QUERY_PAGE_SHOP, { slug: action.slug, user }, true).pipe(
					map((res) => {
						this._core.state.ecommerce = {
							user: res.combinedShop.userId,
							merchant: res.combinedShop.merchantId,
							invoice: res.combinedShop.invoiceId
						};
						localStorage.setItem('user', String(res.combinedShop.userId));
						const logged: boolean = localStorage.getItem('email') ? true : false;
						return LOADED_ECOMMERCE_PAGE_SHOP({
							user: {
								id: res.combinedShop.userId,
								logged
							},
							merchant: {
								id: res.combinedShop.merchantId,
								slug: action.slug,
								title: res.combinedShop.merchantTitle
							},
							order: {
								id: res.combinedShop.invoiceId,
								count: res.combinedShop.invoiceCount
							},
							products: res.combinedShop.products.map((products) => {
								return {
									status: loaded,
									data: {
										id: products.id,
										title: products.title,
										price: products.price,
										images: products.frontPage ? [products.frontPage] : []
									}
								};
							}),
							info: {
								calendar: res.combinedShop.firstShippingDate ?? undefined,
								direction: res.combinedShop.merchantDirection ?? undefined,
								batch: res.combinedShop.batchId ?? undefined,
								from: res.combinedShop.batchFrom ?? undefined,
								to: res.combinedShop.batchTo ?? undefined
							}
						});
					}),
					catchError(() => of({ type: '[ERROR_ECOMMERCE_PAGE_SHOP]: QUERY_PAGE_SHOP' }))
				);
			})
		);
	});

	// ! PRODUCTS.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceProducts$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_PRODUCTS),
			exhaustMap((action) =>
				this._core
					.query<IProductsResponse['data']>(QUERY_PRODUCTS, { page: action.page, merchant: action.merchant })
					.pipe(
						map((res) =>
							LOADED_ECOMMERCE_PRODUCTS({
								products: res.products.map((product) => {
									return {
										status: loaded,
										data: {
											id: product.id,
											title: product.title,
											price: product.price,
											images: product.frontPage ? [product.frontPage] : []
										}
									};
								})
							})
						),
						catchError(() => of({ type: '[ERROR_ECOMMERCE_PRODUCTS]: QUERY_PRODUCTS' }))
					)
			)
		);
	});

	// ! PAGE PRODUCT.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommercePageProduct$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_PAGE_PRODUCT),
			exhaustMap((action) => {
				let user: number | undefined = undefined;
				if (this._core.state.ecommerce.user) {
					user = this._core.state.ecommerce.user;
				} else {
					user = localStorage.getItem('user') ? Number(localStorage.getItem('user')) : undefined;
				}
				return this._core
					.query<IPageProductResponse['data']>(QUERY_PAGE_PRODUCT, {
						product: action.product,
						slug: action.slug,
						user
					})
					.pipe(
						map((res) => {
							this._core.state.ecommerce = {
								user: res.combinedProduct.userId,
								merchant: res.combinedProduct.merchantId,
								invoice: res.combinedProduct.invoiceId
							};
							localStorage.setItem('user', String(res.combinedProduct.userId));
							const images: string[] = res.combinedProduct.productFrontPage
								? [res.combinedProduct.productFrontPage]
								: [];
							res.combinedProduct.images.forEach((image) => images.push(image.url));
							return LOADED_ECOMMERCE_PAGE_PRODUCT({
								user: {
									id: res.combinedProduct.userId,
									logged: localStorage.getItem('email') ? true : false
								},
								merchant: {
									id: res.combinedProduct.merchantId,
									slug: action.slug,
									title: res.combinedProduct.merchantTitle
								},
								order: {
									id: res.combinedProduct.invoiceId,
									count: res.combinedProduct.invoiceCount
								},
								product: {
									status: complete,
									data: {
										id: action.product,
										title: res.combinedProduct.productTitle,
										images,
										price: res.combinedProduct.productPrice,
										stock: res.combinedProduct.productStock,
										details: res.combinedProduct.details.map((detail) => {
											return {
												title: detail.title,
												description: detail.description,
												image: detail.url
											};
										}),
										check: res.combinedProduct.check
									}
								},
								info: {
									calendar: res.combinedProduct.firstShippingDate ?? undefined,
									direction: res.combinedProduct.merchantDirection ?? undefined,
									batch: res.combinedProduct.batchId ?? undefined,
									from: res.combinedProduct.batchFrom ?? undefined,
									to: res.combinedProduct.batchTo ?? undefined
								}
							});
						})
					);
			})
		);
	});

	// ! PRODUCT.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceProduct$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_PRODUCT),
			exhaustMap((action) => {
				const merchant: number | undefined = this._core.state.ecommerce.merchant;
				const invoice: number | undefined = this._core.state.ecommerce.invoice;
				if (merchant && invoice) {
					return this._core
						.query<IProductResponse['data']>(QUERY_PRODUCT, { product: action.product, invoice, merchant })
						.pipe(
							map((res) => {
								return LOADED_ECOMMERCE_PRODUCT({
									product: {
										id: action.product,
										stock: res.rProduct.stock,
										images: res.rProduct.images.map((image) => image.url),
										details: res.rProduct.details.map((detail) => {
											return {
												title: detail.title,
												description: detail.description,
												image: detail.url
											};
										}),
										check: res.rProduct.check
									}
								});
							}),
							catchError(() => of({ type: '[ERROR_ECOMMERCE_PRODUCT]: QUERY_PRODUCT' }))
						);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_PRODUCT]: MERCHANT_NOT_FOUND' });
				}
			})
		);
	});

	// ! ADD CART PRODUCT.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly addEcommerceCartProduct$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(ADD_ECOMMERCE_CART_PRODUCT),
			exhaustMap((action) =>
				this._core
					.mutation(MUTATION_ORDER_ADD_PRODUCT, {
						invoice: this._core.state.ecommerce.invoice,
						product: action.product.id
					})
					.pipe(
						map(() => ADDED_ECOMMERCE_CART_PRODUCT({ product: action.product })),
						catchError(() => of({ type: '[ERROR_ECOMMERCE_CART]: MUTATION_ADD_PRODUCT' }))
					)
			)
		);
	});

	// ! CART.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceCart$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_CART),
			exhaustMap((action) =>
				this._core.query<ICartResponse['data']>(QUERY_CART, { invoice: action.order, page: action.page || 1 }).pipe(
					map((res) =>
						LOADED_ECOMMERCE_CART({
							products: {
								status: complete,
								items: res.gIProducts.map((product) => {
									return {
										id: product.product.id,
										title: product.product.title,
										image: product.product.frontPage,
										price: product.product.price,
										stock: product.product.stock,
										quantity: product.quantity
									};
								})
							}
						})
					),
					catchError(() => of({ type: '[ERROR_ECOMMERCE_CART]: QUERY_CART' }))
				)
			)
		);
	});

	// ! ORDER.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceOrder$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_ORDER),
			exhaustMap((action) =>
				this._core.query<IOrderResponse['data']>(QUERY_ORDER, { invoice: action.order }).pipe(
					map((res) => {
						return LOADED_ECOMMERCE_ORDER({
							calendar:
								res.gInvoice.batchId && res.gInvoice.reservation
									? {
											id: res.gInvoice.batchId,
											reservation: res.gInvoice.reservation
										}
									: undefined,
							total: res.gInvoice.total,
							message: res.gInvoice.message,
							address: {
								id: res.gInvoice.addressNumber ?? -3,
								direction: res.gInvoice.addressDirection ?? res.gInvoice.merchantDirection,
								lat: res.gInvoice.addressLat ?? res.gInvoice.merchantLat,
								lng: res.gInvoice.addressLng ?? res.gInvoice.merchantLng,
								mode: res.gInvoice.type ?? 'PICK-UP'
							}
						});
					}),
					catchError(() => of({ type: '[ERROR_ECOMMERCE_ORDER]: QUERY_ORDER' }))
				)
			)
		);
	});

	// ! UPDATE CART.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly updateEcommerceOrderCart$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(UPDATE_ECOMMERCE_CART),
			exhaustMap((action) => {
				const invoice: number | undefined = this._core.state.ecommerce.invoice;
				if (invoice) {
					const list: { productId: number; quantity: number }[] = action.products.map((product) => {
						return { invoiceId: invoice, productId: product.id, quantity: product.quantity };
					});
					return this._core.mutation(MUTATION_ORDER_CART, { invoice, list }).pipe(
						map(() => UPDATED_ECOMMERCE_CART({ products: action.products })),
						catchError(() => of({ type: '[ERROR_ECOMMERCE_CART]: MUTATION_UPDATE_CART' }))
					);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_CART]: INVOICE_NOT_FOUND' });
				}
			})
		);
	});

	// ! MESSAGE
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly updateEcommerceOrderMessage$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(UPDATE_ECOMMERCE_ORDER_MESSAGE),
			exhaustMap((action) =>
				this._core.mutation(MUTATION_ORDER_MESSAGE, { invoice: action.order, message: action.message }).pipe(
					map(() => UPDATED_ECOMMERCE_ORDER_MESSAGE({ message: action.message })),
					catchError(() => of({ type: '[ERROR_ECOMMERCE_INVOICE_MESSAGE]: MUTATION_MESSAGE' }))
				)
			)
		);
	});

	// ! CALENDAR.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceCalendar$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_CALENDAR),
			exhaustMap((action) => {
				const merchant: number | undefined = this._core.state.ecommerce.merchant;
				if (merchant) {
					const details: boolean = action.day ? true : false;
					return this._core
						.query<
							ICalendarResponse['data']
						>(QUERY_CALENDAR, { year: action.year, month: action.month, day: action.day ?? 1, merchant, details })
						.pipe(
							map((res) =>
								LOADED_ECOMMERCE_CALENDAR({
									calendar: {
										id: res.gCalendar.calendarId,
										delay: res.gCalendar.delay,
										typeDelay: res.gCalendar.typeDelay,
										days: res.gCalendar.workingDays as ('FRI' | 'MON' | 'SAT' | 'SUN' | 'THU' | 'TUE' | 'WED')[],
										exceptions: res.gCalendar.exceptionsDates,
										disabled: res.gCalendar.disabledDates
									},
									details: !details
								})
							),
							catchError(() => of({ type: '[ERROR_ECOMMERCE_CALENDAR]: QUERY_CALENDAR' }))
						);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_CALENDAR]: MERCHANT_NOT_FOUND' });
				}
			})
		);
	});

	// ! BATCHES.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceBatches$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_BATCHES),
			exhaustMap((action) =>
				this._core
					.query<IBatchesResponse['data']>(QUERY_BATCHES, {
						calendar: action.calendar,
						day: action.day,
						date: action.date,
						exception: action.exception
					})
					.pipe(
						map((res) =>
							LOADED_ECOMMERCE_BATCHES({
								batches: res.gBatches.map((batch) => {
									return {
										id: batch.id,
										title: batch.title,
										from: batch.from.substring(0, 5),
										to: batch.to.substring(0, 5)
									};
								})
							})
						),
						catchError(() => of({ type: '[ERROR_ECOMMERCE_BATCHES]: QUERY_BATCHES' }))
					)
			)
		);
	});

	// ! UPDATE CALENDAR.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly updateEcommerceInvoiceCalendar$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(UPDATE_ECOMMERCE_ORDER_CALENDAR),
			exhaustMap((action) => {
				const invoice: number | undefined = this._core.state.ecommerce.invoice;
				if (invoice) {
					return this._core.mutation(MUTATION_ORDER_CALENDAR, { invoice, batch: action.batch, date: action.date }).pipe(
						map(() => UPDATED_ECOMMERCE_ORDER_CALENDAR({ id: action.batch, reservation: action.date })),
						catchError(() => of({ type: '[ERROR_ECOMMERCE_INVOICE_CALENDAR]: MUTATION_INVOICE_CALENDAR' }))
					);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_INVOICE_CALENDAR]: INVOICE_NOT_FOUND' });
				}
			})
		);
	});

	// ! UPDATE ORDER ADDRESS.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly ecommerceUOrderAddress$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(UPDATE_ECOMMERCE_ORDER_ADDRESS),
			exhaustMap((action) => {
				const invoice: number | undefined = this._core.state.ecommerce.invoice;
				if (invoice) {
					return this._core
						.mutation(MUTATION_ORDER_ADDRESS, {
							invoice,
							direction: action.direction,
							lng: action.lng,
							lat: action.lat,
							type: action.mode,
							id: action.id
						})
						.pipe(
							map(() =>
								UPDATED_ECOMMERCE_ORDER_ADDRESS({
									id: action.id,
									direction: action.direction,
									lat: action.lat,
									lng: action.lng,
									mode: action.mode
								})
							),
							catchError(() => of({ type: '[ERROR_ECOMMERCE_ORDER_ADDRESS]: MUTATION_ORDER_ADDRESS' }))
						);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_ORDER_ADDRESS]: INVOICE_NOT_FOUND' });
				}
			})
		);
	});

	// ! PAYMENTS.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommercePayments$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_PAYMENTS),
			exhaustMap((action) => {
				const merchant: number | undefined = this._core.state.ecommerce.merchant;
				if (merchant) {
					return this._core.query<IPaymentsResponse['data']>(QUERY_PAYMENTS, { page: action.page || 1, merchant }).pipe(
						map((res) =>
							LOADED_ECOMMERCE_PAYMENTS({
								payments: res.payments.map((payment) => {
									return {
										id: payment.id,
										title: payment.title,
										type: payment.typePayment,
										cvu: payment.cvu
									};
								})
							})
						),
						catchError(() => of({ type: '[ERROR_ECOMMERCE_PAYMENTS]: QUERY_PAYMENTS' }))
					);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_PAYMENTS]: MERCHANT_NOT_FOUND' });
				}
			})
		);
	});

	// ! UPDATE ORDER.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly updateEcommerceOrder$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(UPDATE_ECOMMERCE_ORDER),
			exhaustMap((action) => {
				const invoice: number | undefined = this._core.state.ecommerce.invoice;
				const user: number | undefined = this._core.state.ecommerce.user;
				const merchant: number | undefined = this._core.state.ecommerce.merchant;
				if (invoice && user && merchant) {
					const formData: FormData = new FormData();
					formData.append('invoiceId', String(invoice));
					formData.append('paymentId', String(action.payment));
					formData.append('merchantId', String(merchant));
					formData.append('batchId', String(action.batch));
					formData.append('date', undate(action.date));
					formData.append('userId', String(user));
					formData.append('voucher', action.voucher);
					formData.append('addressDirection', action.direction);
					formData.append('addressLat', action.lat);
					formData.append('addressLng', action.lng);
					return this._core.post<IInvoiceUpdateResponse>('/invoices/upload', formData).pipe(
						map((res) => {
							this._core.redirect(`dlicianthus/invoice/${res.orderId}`);
							return UPDATED_ECOMMERCE_ORDER();
						}),
						catchError(() => of({ type: '[ERROR_ECOMMERCE_ORDER]: POST_ORDER' }))
					);
				} else {
					return of({ type: '[ERROR_ECOMMERCE_ORDER]: INVOICE - USER - MERCHANT: NOT_FOUND' });
				}
			})
		);
	});

	// ! INVOICE.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly loadEcommerceInvoice$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(LOAD_ECOMMERCE_INVOICE),
			exhaustMap((action) =>
				this._core.query<IInvoiceResponse['data']>(QUERY_INVOICE, { order: action.invoice }).pipe(
					map((res) =>
						LOADED_ECOMMERCE_INVOICE({
							invoice: {
								id: action.invoice,
								message: res.gOrder.message,
								merchant: res.gOrder.merchantId,
								total: res.gOrder.total,
								user: res.gOrder.userId,
								reservation: res.gOrder.reservation ?? '',
								products: res.gOrder.products.map((product) => {
									return {
										title: product.product.title,
										price: product.product.price,
										image: product.product.frontPage,
										quantity: product.quantity
									};
								}),
								addressDirection: res.gOrder.addressDirection,
								addressLat: res.gOrder.addressLat,
								addressLng: res.gOrder.addressLng,
								code: res.gOrder.code,
								note: res.gOrder.note,
								status: res.gOrder.status,
								voucher: res.gOrder.voucher
							}
						})
					),
					catchError(() => of({ type: '[ERROR_ECOMMERCE_INVOICE]: QUERY_INVOICE' }))
				)
			)
		);
	});

	// ! UPDATE INVOICE NOTE.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly updateEcommerceInvoiceNote$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(UPDATE_ECOMMERCE_INVOICE_NOTE),
			exhaustMap((action) =>
				this._core.mutation(MUTATION_INVOICE_NOTE, { order: action.invoice, note: action.note }).pipe(
					map(() => UPDATED_ECOMMERCE_INVOICE_NOTE({ note: action.note })),
					catchError(() => of({ type: '[ERROR_ECOMMERCE_INVOICE_NOTE]: MUTATION_INVOICE_NOTE' }))
				)
			)
		);
	});

	// ! UPDATE INVOICE VOUCHER.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly updateEcommerceInvoiceVoucher$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(UPDATE_ECOMMERCE_INVOICE_VOUCHER),
			exhaustMap((action) => {
				const form: FormData = new FormData();
				form.append('orderId', String(action.invoice));
				form.append('voucher', action.voucher);
				return this._core.put<IInvoiceUpdateResponse>(`/orders/update-voucher`, form).pipe(
					map((res) => UPDATED_ECOMMERCE_INVOICE_VOUCHER({ voucher: res.url ?? '' })),
					catchError(() => of({ type: '[ERROR_ECOMMERCE_INVOICE_VOUCHER]: PUT_INVOICE_VOUCHER' }))
				);
			})
		);
	});
}
