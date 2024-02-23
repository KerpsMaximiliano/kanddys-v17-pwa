import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';

// * Services.
import { CoreService } from '@core/services/core.service';
import { EcommerceService } from '@ecommerce/services/ecommerce.service';

// * Interfaces.
import { IState } from '@core/interfaces/state.interface';
import { IMerchant, IProduct } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import { LOAD_ECOMMERCE_INVOICE, LOAD_ECOMMERCE_PRODUCTS } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceMerchant, selectEcommerceProducts } from '@ecommerce/state/ecommerce.selectors';

// * Material.
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// * Util.
import { currency } from '@core/util/currency.pipe';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-shop',
	standalone: true,
	imports: [MatIconModule, MatMenuModule, ButtonComponent],
	templateUrl: './shop.component.html',
	styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit, AfterViewInit {
	public currency = currency;
	public organize: string = 'Más Relevantes';

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _ecommerce: EcommerceService = inject(EcommerceService);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly products: Signal<IProduct[]> = this._store.selectSignal(selectEcommerceProducts);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly merchant: Signal<IMerchant> = this._store.selectSignal(selectEcommerceMerchant);

	public ngOnInit(): void {
		// if (this._core.merchant)
		this._store.dispatch(LOAD_ECOMMERCE_PRODUCTS({ merchant: 1, page: 1 }));
	}

	public ngAfterViewInit(): void {
		const options: { merchant: number; user?: number; status?: 'COMPLETE' | 'INITIAL' | 'PENDING' } = {
			merchant: 1,
			user: this._core.local,
			status: 'INITIAL'
		};
		this._store.dispatch(LOAD_ECOMMERCE_INVOICE(options));
	}

	public redirect(route: string, id?: number): void {
		this._ecommerce.redirect(route, id);
	}
}
