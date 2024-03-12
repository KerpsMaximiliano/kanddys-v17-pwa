import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

// * ENV.
import { environment } from '@env/environment';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
import { ILoadableEntity, IState, complete } from '@core/interfaces/state.interface';
import { IInvoice } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import { LOAD_ECOMMERCE_INVOICE } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceInvoice } from '@ecommerce/state/ecommerce.selectors';

// * Utils.
import { currency } from '@core/util/currency.pipe';
import { date } from '@core/util/date.pipe';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { LoadingComponent } from '@core/components/loading/loading.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-invoice',
	standalone: true,
	imports: [ButtonComponent, LoadingComponent],
	templateUrl: './invoice.component.html',
	styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit, AfterViewInit, OnDestroy {
	public readonly currency = currency;
	public readonly date = date;
	public readonly complete = complete;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _http: HttpClient = inject(HttpClient);
	private readonly _route: ActivatedRoute = inject(ActivatedRoute);

	private readonly _subscriptions: Subject<void> = new Subject<void>();

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly invoice: Signal<ILoadableEntity<IInvoice>> = this._store.selectSignal(selectEcommerceInvoice);

	public ngOnInit(): void {
		const invoice: string | undefined = this._route.snapshot.params['id'];
		if (invoice && !isNaN(Number(invoice))) {
			this._store.dispatch(LOAD_ECOMMERCE_INVOICE({ invoice: Number(invoice) }));
		} else {
			this.redirect('');
			return;
		}
	}

	public ngAfterViewInit(): void {
		this._http
			.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiMap}&libraries=places`, 'callback')
			.pipe(takeUntil(this._subscriptions))
			.subscribe();
	}

	public getName(): string {
		const lastName = this.invoice().data.userLastName;
		const name = this.invoice().data.userName;
		if (name && lastName) {
			return name + ' ' + lastName;
		} else if (name) {
			return name;
		} else if (lastName) {
			return lastName;
		} else {
			return this.invoice().data.userEmail;
		}
	}

	public open(dialog: string): void {
		this._core.open(dialog);
	}

	public redirect(route: string): void {
		this._core.redirect(route);
	}

	public ngOnDestroy(): void {
		this._subscriptions.next();
		this._subscriptions.complete();
	}
}
