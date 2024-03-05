import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, first, takeUntil, tap } from 'rxjs';

// * ENV.
import { environment } from '@env/environment';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
import { ILoadableEntities, ILoading, IState, complete, loading } from '@core/interfaces/state.interface';
import { IAddress, IEcommerce } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import {
	ADD_USER_ADDRESS,
	LOAD_MERCHANT_ADDRESSES,
	LOAD_USER_ADDRESSES,
	UPDATE_ECOMMERCE_ORDER_ADDRESS
} from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import {
	selectEcommerceAddress,
	selectEcommerceMerchantAddress,
	selectEcommerceUserAddresses,
	selectEcommerceUserLogin
} from '@ecommerce/state/ecommerce.selectors';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { LoadingComponent } from '@core/components/loading/loading.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-address',
	standalone: true,
	imports: [ButtonComponent, LoadingComponent],
	templateUrl: './address.component.html',
	styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit, AfterViewInit, OnDestroy {
	public selected: IAddress | undefined = undefined;

	public mode: 'DELIVERY' | 'PICK-UP' | undefined = undefined;
	public readonly loading: ILoading = loading;
	public readonly complete: ILoading = complete;

	private readonly _subscriptions: Subject<void> = new Subject<void>();

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _http: HttpClient = inject(HttpClient);
	private readonly _core: CoreService = inject(CoreService);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly addresses: Signal<ILoadableEntities<IAddress>> =
		this._store.selectSignal(selectEcommerceUserAddresses);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly user: Signal<{ id: number; logged: boolean }> = this._store.selectSignal(selectEcommerceUserLogin);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly merchant: Signal<ILoadableEntities<string>> =
		this._store.selectSignal(selectEcommerceMerchantAddress);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly address: Signal<IEcommerce['order']['data']['address']['data']> =
		this._store.selectSignal(selectEcommerceAddress);

	public ngOnInit(): void {
		if (this.user().id === 0) {
			this._core.redirect('');
			return;
		}

		this._store
			.select(selectEcommerceAddress)
			.pipe(
				first(),
				tap((address) => {
					this.mode = this.address().mode;
					this.selected = {
						id: address.id,
						direction: address.direction,
						lat: address.lat,
						lng: address.lng
					};
					// this.selected = this.addresses().items.find((item) => item.id === address.id);

					if (this.addresses().items.length === 0 && address.mode && address.mode === 'DELIVERY') {
						if (this.user().logged) {
							this._store.dispatch(LOAD_USER_ADDRESSES({}));
						} else {
							this._store.dispatch(
								ADD_USER_ADDRESS({
									lng: address.lng ?? '',
									lat: address.lat ?? '',
									direction: address.direction ?? '',
									update: false
								})
							);
						}
					}

					if (this.mode === 'PICK-UP' && this.merchant().status === this.loading) {
						this._store.dispatch(LOAD_MERCHANT_ADDRESSES({}));
					}
				})
			)
			.subscribe();
	}

	public ngAfterViewInit(): void {
		// this.mode = this.address().mode;
		this._http
			.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiMap}&libraries=places`, 'callback')
			.pipe(takeUntil(this._subscriptions))
			.subscribe();
	}

	public select(mode: 'DELIVERY' | 'PICK-UP'): void {
		if (mode === this.mode) return;
		this.mode = mode;
		if (mode === 'DELIVERY') {
			if (this.user().logged && this.addresses().status === this.loading) {
				this._store.dispatch(LOAD_USER_ADDRESSES({}));
			}
		} else {
			if (this.merchant().status === this.loading) {
				this._store.dispatch(LOAD_MERCHANT_ADDRESSES({}));
			}
		}
	}

	public back(): void {
		this._core.back();
	}

	public redirect(route: string): void {
		this._core.redirect(route);
	}

	public open(dialog: string): void {
		this._core.open(dialog);
	}

	public save(): void {
		if (!this.mode) return;

		if (this.mode === 'PICK-UP') {
			this._store.dispatch(
				UPDATE_ECOMMERCE_ORDER_ADDRESS({
					id: -2,
					direction: this.merchant().items[0],
					lat: '0',
					lng: '0',
					mode: 'PICK-UP'
				})
			);
		} else {
			if (this.user().logged) {
				const address: IAddress | undefined = this.selected;
				if (address) {
					this._store.dispatch(
						UPDATE_ECOMMERCE_ORDER_ADDRESS({
							direction: address.direction ?? 'Sin dirección',
							id: address.id,
							lat: address.lat ?? '0',
							lng: address.lng ?? '0',
							mode: 'DELIVERY'
						})
					);
				}
			} else {
				this._store.dispatch(
					UPDATE_ECOMMERCE_ORDER_ADDRESS({
						id: -1,
						direction: this.addresses().items[0].direction ?? '',
						lat: this.addresses().items[0].lat ?? '',
						lng: this.addresses().items[0].lng ?? '',
						mode: 'DELIVERY'
					})
				);
			}
		}

		this._core.back();
	}

	public ngOnDestroy(): void {
		this._subscriptions.next();
		this._subscriptions.complete();
	}
}
