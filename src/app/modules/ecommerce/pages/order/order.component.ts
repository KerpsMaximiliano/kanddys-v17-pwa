import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';

// * Services.
import { CoreService } from '@core/services/core.service';
import { EcommerceService } from '@ecommerce/services/ecommerce.service';

// * Interfaces.
import { ILoadableEntity, IState, loaded, loading } from '@core/interfaces/state.interface';
import { IEcommerce, IOrder } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import {
	LOAD_ECOMMERCE_CALENDAR,
	LOAD_ECOMMERCE_ORDER,
	LOAD_ECOMMERCE_PAYMENTS,
	UPDATE_ECOMMERCE_CART,
	UPDATE_ECOMMERCE_CART_PRODUCT
} from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import {
	selectEcommerceInfo,
	selectEcommerceOrder,
	selectEcommerceUserLogin
} from '@ecommerce/state/ecommerce.selectors';

// * Material.
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// * Util.
import { currency } from '@core/util/currency.pipe';
import { date } from '@core/util/date.pipe';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-order',
	standalone: true,
	imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ButtonComponent],
	templateUrl: './order.component.html',
	styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy {
	public currency = currency;
	public date = date;
	public loaded = loaded;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _ecommerce: EcommerceService = inject(EcommerceService);
	private _change: boolean = false;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly invoice: Signal<ILoadableEntity<IOrder>> = this._store.selectSignal(selectEcommerceOrder);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly user: Signal<{ id: number; logged: boolean }> = this._store.selectSignal(selectEcommerceUserLogin);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly info: Signal<IEcommerce['info']> = this._store.selectSignal(selectEcommerceInfo);

	public ngOnInit(): void {
		if (this.invoice().data.products.status === loading) {
			this.redirect('shop');
			return;
		}
		if (this.invoice().status === loaded) this._store.dispatch(LOAD_ECOMMERCE_ORDER({ order: this.invoice().data.id }));
		this._change = false;
	}

	public back(): void {
		this._core.back();
	}

	public change(product: number, quantity: number): void {
		this._store.dispatch(UPDATE_ECOMMERCE_CART_PRODUCT({ product, quantity }));
		this._change = true;
	}

	public redirect(route: string, id?: number | string): void {
		switch (route) {
			case 'calendar':
				this._store.dispatch(LOAD_ECOMMERCE_CALENDAR({ year: 2024, month: 2, day: 27 }));
				break;
			case 'payments':
				this._store.dispatch(LOAD_ECOMMERCE_PAYMENTS({ page: 1 }));
				break;
			case 'auth':
				this._core.redirect(route);
				return;
		}
		this._ecommerce.redirect(route, id);
	}

	public ngOnDestroy(): void {
		if (this._change) this._store.dispatch(UPDATE_ECOMMERCE_CART({ products: this.invoice().data.products.items }));
	}
}
