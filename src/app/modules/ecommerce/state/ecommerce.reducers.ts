import { createReducer, on } from '@ngrx/store';

// * Actions.
import {
	ADDED_ECOMMERCE_CART_PRODUCT,
	ADDED_USER_ADDRESS,
	ADD_ECOMMERCE_CART_PRODUCT,
	LOADED_ECOMMERCE_BATCHES,
	LOADED_ECOMMERCE_CALENDAR,
	LOADED_ECOMMERCE_CART,
	LOADED_ECOMMERCE_ORDER,
	LOADED_ECOMMERCE_PAGE_PRODUCT,
	LOADED_ECOMMERCE_PAGE_SHOP,
	LOADED_ECOMMERCE_PAYMENTS,
	LOADED_ECOMMERCE_PRODUCT,
	LOADED_ECOMMERCE_PRODUCTS,
	LOADED_MERCHANT_ADDRESSES,
	LOADED_USER_ADDRESSES,
	LOAD_ECOMMERCE_BATCHES,
	LOAD_ECOMMERCE_CALENDAR,
	LOAD_ECOMMERCE_PAYMENTS,
	LOAD_MERCHANT_ADDRESSES,
	LOAD_USER_ADDRESSES,
	RESET_ORDER,
	UPDATED_ECOMMERCE_CART,
	UPDATED_ECOMMERCE_ORDER_ADDRESS,
	UPDATED_ECOMMERCE_ORDER_CALENDAR,
	UPDATED_ECOMMERCE_ORDER_MESSAGE,
	UPDATE_ECOMMERCE_CART_PRODUCT,
	UPDATE_ECOMMERCE_ORDER_ADDRESS,
	USER_CHECK,
	USER_CHECKED,
	USER_LOGIN,
	USER_LOGIN_ERROR,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_RESTORE
} from './ecommerce.actions';

// * Interfaces.
import { ILoadableEntity, complete, failed, loaded, loading } from '@core/interfaces/state.interface';
import { IEcommerce, IOrder, IProduct } from '@ecommerce/interfaces/ecommerce.interface';

// * Utils.
import { date } from '@core/util/date.pipe';

// * Initial state.
export const ECOMMERCE_STATE: IEcommerce = {
	user: {
		status: loading,
		data: {
			id: 0,
			check: null,
			logged: false,
			email: null,
			image: null,
			name: null,
			surname: null,
			phone: null,
			address: {
				status: loading,
				items: []
			}
		}
	},
	merchant: {
		status: loading,
		data: {
			id: 0,
			slug: '',
			image: null,
			title: null,
			payments: {
				status: loading,
				items: []
			},
			calendar: {
				status: loading,
				data: { id: 0, delay: 0, typeDelay: 'MN', days: [], disabled: [], exceptions: [] }
			},
			address: {
				status: loading,
				items: []
			}
		}
	},
	products: {
		status: loading,
		items: []
	},
	order: {
		status: loading,
		data: {
			id: 0,
			count: 0,
			merchant: 0,
			user: 0,
			products: {
				status: loading,
				items: []
			},
			calendar: {
				status: loading,
				data: {
					id: null,
					reservation: null
				}
			},
			message: { status: loading, data: null },
			address: {
				status: loading,
				data: {
					id: 0,
					direction: null,
					lat: null,
					lng: null
				}
			},
			total: 0
		}
	},
	batches: {
		status: loading,
		items: []
	},
	info: {
		status: loading,
		data: {}
	}
};

// * Reducers.
export const ecommerceReducer = createReducer(
	// * INITIAL STATE.
	ECOMMERCE_STATE,
	// USER CHECK.
	on(USER_CHECK, (state): IEcommerce => {
		return {
			...state,
			user: {
				...state.user,
				status: loading
			}
		};
	}),
	on(USER_CHECKED, (state, { check, logged }): IEcommerce => {
		return {
			...state,
			user: {
				status: loaded,
				data: {
					...state.user.data,
					check,
					logged
				}
			}
		};
	}),
	// * USER RESTORE.
	on(USER_RESTORE, (state): IEcommerce => {
		return {
			...state,
			user: {
				...state.user,
				data: {
					...state.user.data,
					check: null
				}
			}
		};
	}),
	// * USER LOGIN.
	on(USER_LOGIN, (state): IEcommerce => {
		return { ...state, user: { ...state.user, status: loading } };
	}),
	// * USER SUCCESS.
	on(USER_LOGIN_SUCCESS, (state, { email }): IEcommerce => {
		return {
			...state,
			user: {
				status: loaded,
				data: {
					...state.user.data,
					logged: true,
					email
				}
			}
		};
	}),
	// * USER ERROR.
	on(USER_LOGIN_ERROR, (state, { err }): IEcommerce => {
		if (err === 1) {
			return {
				...state,
				user: {
					...state.user,
					status: failed
				}
			};
		} else {
			return {
				...state,
				user: {
					...state.user,
					status: loaded
				}
			};
		}
	}),
	// * USER LOGOUT.
	on(USER_LOGOUT, (state): IEcommerce => {
		return {
			...state,
			user: {
				...state.user,
				data: {
					...state.user.data,
					logged: false,
					check: null
				}
			}
		};
	}),
	// * USER ADDRESSES.
	on(LOAD_USER_ADDRESSES, (state): IEcommerce => {
		return {
			...state,
			user: {
				...state.user,
				data: {
					...state.user.data,
					address: {
						...state.user.data.address,
						status: loading
					}
				}
			}
		};
	}),
	on(LOADED_USER_ADDRESSES, (state, { addresses }): IEcommerce => {
		return {
			...state,
			user: {
				...state.user,
				data: {
					...state.user.data,
					address: {
						status: complete,
						items: addresses
					}
				}
			}
		};
	}),
	// * USER ADD ADDRESS.
	// on(ADD_USER_ADDRESS, (state): IEcommerce => {
	// 	return {
	// 		...state,
	// 		user: {
	// 			...state.user,
	// 			status: loading
	// 		}
	// 	};
	// }),
	on(ADDED_USER_ADDRESS, (state, { address, update }): IEcommerce => {
		return {
			...state,
			user: {
				status: complete,
				data: {
					...state.user.data,
					address: {
						status: complete,
						items: update ? [...state.user.data.address.items, address] : [address]
						// items: [...state.user.data.address.items, address]
					}
				}
			}
			// order: {
			// 	...state.order,
			// 	data: {
			// 		...state.order.data,
			// 		address: {
			// 			status: complete,
			// 			data: {
			// 				id: address.id,
			// 				direction: address.direction,
			// 				lat: address.lat,
			// 				lng: address.lng,
			// 				mode: 'DELIVERY'
			// 			}
			// 		}
			// 	}
			// }
		};
	}),
	// * MERCHANT ADDRESS.
	on(LOAD_MERCHANT_ADDRESSES, (state): IEcommerce => {
		return {
			...state,
			merchant: {
				...state.merchant,
				data: {
					...state.merchant.data,
					address: {
						...state.merchant.data.address,
						status: loading
					}
				}
			}
		};
	}),
	on(LOADED_MERCHANT_ADDRESSES, (state, { addresses }): IEcommerce => {
		return {
			...state,
			merchant: {
				...state.merchant,
				data: {
					...state.merchant.data,
					address: {
						status: complete,
						items: addresses
					}
				}
			}
		};
	}),
	// * PAGE SHOP.
	on(LOADED_ECOMMERCE_PAGE_SHOP, (state, { user, merchant, order: invoice, products, info }): IEcommerce => {
		return {
			...state,
			user: { status: loaded, data: { ...state.user.data, id: user.id, logged: user.logged } },
			merchant: {
				status: loaded,
				data: { ...state.merchant.data, id: merchant.id, title: merchant.title, slug: merchant.slug }
			},
			products: {
				status: loaded,
				items: [
					...state.products.items,
					...products.map((product) => ({
						status: product.status,
						data: { ...product.data, details: [], stock: 0, check: 0 }
					}))
				]
			},
			order: {
				status: loaded,
				data: {
					...state.order.data,
					id: invoice.id,
					count: invoice.count,
					calendar: {
						status: complete,
						data: {
							id: info.batch ?? null,
							reservation: date(info.calendar, info.from, info.to)
						}
					}
				}
			},
			info: { status: complete, data: info }
		};
	}),
	// PRODUCTS.
	on(LOADED_ECOMMERCE_PRODUCTS, (state, { products }): IEcommerce => {
		const items: ILoadableEntity<{ id: number; title: string | null; price: number; images: string[] }>[] =
			products.filter((product) => !state.products.items.some((item) => item.data.id === product.data.id));
		return {
			...state,
			products: {
				status: loaded,
				items: [
					...state.products.items,
					...items.map((product) => ({
						status: product.status,
						data: { ...product.data, details: [], stock: 0, check: 0 }
					}))
				]
			}
		};
	}),
	// * PAGE PRODUCT.
	on(LOADED_ECOMMERCE_PAGE_PRODUCT, (state, { user, merchant, order, product, info }): IEcommerce => {
		return {
			...state,
			user: { status: loaded, data: { ...state.user.data, id: user.id, logged: user.logged } },
			merchant: {
				status: loaded,
				data: { ...state.merchant.data, id: merchant.id, title: merchant.title, slug: merchant.slug }
			},
			products: { status: loading, items: [product] },
			order: {
				status: loaded,
				data: {
					...state.order.data,
					id: order.id,
					count: order.count,
					calendar: {
						status: complete,
						data: {
							id: info.batch ?? null,
							reservation: date(info.calendar, info.from, info.to)
						}
					}
				}
			},
			info: { status: complete, data: info }
		};
	}),
	// * PRODUCT.
	on(LOADED_ECOMMERCE_PRODUCT, (state, { product }): IEcommerce => {
		const products: ILoadableEntity<IProduct>[] = [...state.products.items];
		const index: number = products.findIndex((item) => item.data.id === product.id);
		if (index !== -1) {
			const productData = {
				...products[index].data,
				stock: product.stock,
				images: [...products[index].data.images, ...product.images],
				details: product.details,
				check: product.check
			};
			products[index] = { status: complete, data: productData };
		}
		return {
			...state,
			products: {
				status: state.products.status,
				items: products
			}
		};
	}),
	// * CART.
	on(LOADED_ECOMMERCE_CART, (state, { products }): IEcommerce => {
		const items: IOrder['products']['items'] = products.items.filter(
			(product) => !state.order.data.products.items.some((item) => item.id === product.id)
		);
		return {
			...state,
			order: {
				status: loaded,
				data: {
					...state.order.data,
					products: {
						status: complete,
						items: [...state.order.data.products.items, ...items]
					}
				}
			}
		};
	}),
	// * ADD PRODUCT.
	on(ADD_ECOMMERCE_CART_PRODUCT, (state, { product }): IEcommerce => {
		const products: ILoadableEntity<IProduct>[] = [...state.products.items];
		const index: number = products.findIndex((item) => item.data.id === product.id);
		if (index === -1) {
			return state;
		} else {
			products[index] = { status: loading, data: { ...products[index].data, check: -1 } };
			return {
				...state,
				products: {
					...state.products,
					items: products
				}
			};
		}
	}),
	on(ADDED_ECOMMERCE_CART_PRODUCT, (state, { product }): IEcommerce => {
		const products: ILoadableEntity<IProduct>[] = [...state.products.items];
		const index: number = products.findIndex((item) => item.data.id === product.id);
		if (index === -1) {
			return state;
		} else {
			products[index] = { status: complete, data: { ...products[index].data, check: 1 } };
			return {
				...state,
				products: {
					...state.products,
					items: products
				},
				order: {
					...state.order,
					data: {
						...state.order.data,
						total: state.order.data.total + product.price,
						count: state.order.data.count + 1,
						products: {
							status: state.order.data.products.status,
							items: [
								...state.order.data.products.items,
								{
									id: product.id,
									title: product.title,
									image: product.images[0],
									price: product.price,
									stock: product.stock,
									quantity: 1
								}
							]
						}
					}
				}
			};
		}
	}),
	// * ORDER.
	on(LOADED_ECOMMERCE_ORDER, (state, { calendar, message, address, total }): IEcommerce => {
		const sCalendar: IOrder['calendar'] = {
			status: complete,
			data: {
				id: calendar?.id ?? state.order.data.calendar.data.id,
				reservation: calendar?.reservation ?? state.order.data.calendar.data.reservation
			}
		};
		return {
			...state,
			order: {
				status: complete,
				data: {
					...state.order.data,
					calendar: sCalendar,
					message: { status: complete, data: message },
					address: { status: complete, data: address },
					total
				}
			}
		};
	}),
	// * UPDATE PRODUCT.
	on(UPDATE_ECOMMERCE_CART_PRODUCT, (state, { product, quantity }): IEcommerce => {
		const iIndex: number = state.order.data.products.items.findIndex((item) => item.id === product);
		if (iIndex === -1) return state; // ! Breakpoint. No existe, retorna el estado.
		const iProducts: IOrder['products']['items'] = [...state.order.data.products.items];
		let total: number = state.order.data.total;
		let sProducts: ILoadableEntity<IProduct>[] = [...state.products.items];
		let count: number = state.order.data.count;
		if (quantity === 0) {
			sProducts = [...state.products.items];
			const sIndex: number = sProducts.findIndex((item) => item.data.id === product);
			if (sIndex !== -1) {
				const iProduct: ILoadableEntity<IProduct> = {
					...sProducts[sIndex],
					data: { ...sProducts[sIndex].data, check: 0 }
				};
				sProducts[sIndex] = iProduct;
				count -= 1;
			}
			total -= iProducts[iIndex].price * iProducts[iIndex].quantity;
			iProducts.splice(iIndex, 1);
		} else {
			total -= iProducts[iIndex].price * iProducts[iIndex].quantity;
			total += iProducts[iIndex].price * quantity;
			const product: IOrder['products']['items'][number] = { ...iProducts[iIndex], quantity };
			iProducts[iIndex] = product;
		}
		return {
			...state,
			order: {
				...state.order,
				data: {
					...state.order.data,
					count,
					total,
					products: {
						status: state.order.data.products.status,
						items: iProducts
					}
				}
			},
			products: {
				status: state.products.status,
				items: sProducts
			}
		};
	}),
	// * UPDATE CART.
	on(UPDATED_ECOMMERCE_CART, (state, { products }): IEcommerce => {
		return {
			...state,
			order: {
				...state.order,
				data: {
					...state.order.data,
					products: {
						...state.order.data.products,
						items: products
					},
					count: products.length,
					total: products.reduce((acc, product) => acc + product.price * product.quantity, 0)
				}
			}
		};
	}),
	// * CALENDAR.
	on(LOAD_ECOMMERCE_CALENDAR, (state): IEcommerce => {
		return {
			...state,
			merchant: {
				...state.merchant,
				data: {
					...state.merchant.data,
					calendar: {
						...state.merchant.data.calendar,
						status: loaded
					}
				}
			}
		};
	}),
	on(LOADED_ECOMMERCE_CALENDAR, (state, { calendar, details }): IEcommerce => {
		if (details) {
			return {
				...state,
				merchant: {
					...state.merchant,
					data: {
						...state.merchant.data,
						calendar: {
							status: complete,
							data: {
								...state.merchant.data.calendar.data,
								disabled: calendar.disabled,
								exceptions: calendar.exceptions
							}
						}
					}
				}
			};
		} else {
			return {
				...state,
				merchant: {
					...state.merchant,
					data: {
						...state.merchant.data,
						calendar: {
							status: complete,
							data: calendar
						}
					}
				}
			};
		}
	}),
	// * BATCHES.
	on(LOAD_ECOMMERCE_BATCHES, (state): IEcommerce => {
		return {
			...state,
			batches: {
				status: loaded,
				items: []
			}
		};
	}),
	on(LOADED_ECOMMERCE_BATCHES, (state, { batches }): IEcommerce => {
		return {
			...state,
			batches: {
				status: complete,
				items: batches
			}
		};
	}),
	// * UPDATE CALENDAR.
	on(UPDATED_ECOMMERCE_ORDER_CALENDAR, (state, { id, reservation }): IEcommerce => {
		return {
			...state,
			order: {
				...state.order,
				data: {
					...state.order.data,
					calendar: {
						status: complete,
						data: {
							id,
							reservation
						}
					}
				}
			}
		};
	}),
	// * PAYMENTS.
	on(LOAD_ECOMMERCE_PAYMENTS, (state): IEcommerce => {
		return {
			...state,
			merchant: {
				...state.merchant,
				data: {
					...state.merchant.data,
					payments: {
						status: loaded,
						items: []
					}
				}
			}
		};
	}),
	on(LOADED_ECOMMERCE_PAYMENTS, (state, { payments }): IEcommerce => {
		return {
			...state,
			merchant: {
				...state.merchant,
				data: {
					...state.merchant.data,
					payments: {
						status: complete,
						items: payments
					}
				}
			}
		};
	}),
	// * MESSAGE.
	on(UPDATED_ECOMMERCE_ORDER_MESSAGE, (state, { message }): IEcommerce => {
		return {
			...state,
			order: { ...state.order, data: { ...state.order.data, message: { status: complete, data: message } } }
		};
	}),
	// * UPDATE ORDER ADDRESS.
	on(UPDATE_ECOMMERCE_ORDER_ADDRESS, (state): IEcommerce => {
		return {
			...state,
			order: { ...state.order, status: loading }
		};
	}),
	on(UPDATED_ECOMMERCE_ORDER_ADDRESS, (state, { id, direction, lat, lng, mode }): IEcommerce => {
		return {
			...state,
			order: {
				status: complete,
				data: {
					...state.order.data,
					address: {
						status: complete,
						data: {
							id,
							direction,
							lat,
							lng,
							mode
						}
					}
				}
			}
		};
	}),
	// * RESET ORDER.
	on(RESET_ORDER, (state): IEcommerce => {
		return {
			...state,
			order: {
				status: loaded,
				data: {
					...state.order.data,
					address: {
						status: loading,
						data: {
							direction: null,
							lat: null,
							lng: null,
							id: 0
						}
					},
					calendar: {
						status: loading,
						data: {
							id: null,
							reservation: null
						}
					},
					count: 0,
					message: {
						status: loading,
						data: null
					},
					products: {
						status: loading,
						items: []
					},
					total: 0,
					id: 0
				}
			}
		};
	})
);
