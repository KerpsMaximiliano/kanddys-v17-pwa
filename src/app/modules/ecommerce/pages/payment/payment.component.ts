import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	Signal,
	ViewChild,
	inject
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';

// * Services.
import { CoreService } from '@core/services/core.service';
import { IPayment } from '@ecommerce/interfaces/ecommerce.interface';

// * Interfaces.
import { ILoadableEntities, IState, complete, loading } from '@core/interfaces/state.interface';

// * Actions.
import { LOAD_ECOMMERCE_PAYMENTS, UPDATE_ECOMMERCE_ORDER } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import {
	selectEcommerceOrder,
	selectEcommercePayments,
	selectEcommerceUserLogin
} from '@ecommerce/state/ecommerce.selectors';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { LoadingComponent } from '@core/components/loading/loading.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-payment',
	standalone: true,
	imports: [ButtonComponent, LoadingComponent],
	templateUrl: './payment.component.html',
	styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit, OnDestroy {
	@ViewChild('fileInput') public input?: ElementRef<HTMLInputElement>;

	public readonly complete = complete;
	public payment: IPayment | undefined = undefined;
	public image: string | undefined = undefined;
	public request: boolean = false;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private _store: Store<IState> = inject(Store);
	private _core: CoreService = inject(CoreService);

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	private _blob: any;
	private _subscription?: Subscription;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly payments: Signal<ILoadableEntities<IPayment>> = this._store.selectSignal(selectEcommercePayments);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	private readonly _user: Signal<{ id: number; logged: boolean }> = this._store.selectSignal(selectEcommerceUserLogin);

	public ngOnInit(): void {
		if (!this._core.state.ecommerce.user) {
			this._core.redirect('');
			return;
		}
		if (this.payments().status === loading) this._store.dispatch(LOAD_ECOMMERCE_PAYMENTS({}));
	}

	public back(): void {
		if (this.request) return;
		if (this.payment) {
			this.payment = undefined;
			this.image = undefined;
		} else {
			this._core.back();
		}
	}

	public onClickInput(): void {
		if (this.request) return;
		this.input?.nativeElement.click();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	public onFileSelected(event: any): void {
		if (this.request) return;
		const input = event.target;
		if (input.files && input.files.length > 0) {
			const file: File = input.files[0];
			if (file.type.match('image.*')) {
				this.image = URL.createObjectURL(file);
				this._blob = file;
			} else {
				alert('Por favor selecciona una imagen.');
			}
		}
	}

	public reset(): void {
		if (this.request) return;
		this.image = undefined;
		this._blob = undefined;
		if (this.input) this.input.nativeElement.value = '';
	}

	public save(): void {
		if (this.request) return;
		if (!this._user().logged) {
			this._core.redirect('auth');
			return;
		}
		this.request = true;
		this._subscription = this._store
			.select(selectEcommerceOrder)
			.pipe(take(1))
			.subscribe((order) => {
				const payment: number | undefined = this.payment?.id;
				const batch: number | null = order.data.calendar.data.id;
				const date: string | null = order.data.calendar.data.reservation;
				const direction: string | null = order.data.address.data.direction;
				const lat: string | null = order.data.address.data.lat;
				const lng: string | null = order.data.address.data.lng;
				if (batch && date && payment && direction && lat && lng) {
					this._store.dispatch(
						UPDATE_ECOMMERCE_ORDER({ batch, date, payment, voucher: this._blob, direction, lat, lng })
					);
				} else {
					this.request = false;
					if (this._subscription) this._subscription.unsubscribe();
				}
			});
	}

	public ngOnDestroy(): void {
		if (this._subscription) this._subscription.unsubscribe();
	}
}
