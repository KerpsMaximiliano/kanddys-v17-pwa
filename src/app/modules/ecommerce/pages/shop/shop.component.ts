import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';

// * Services.
import { CoreService } from '@core/services/core.service';
import { EcommerceService } from '@ecommerce/services/ecommerce.service';

// * Interfaces.
import {
	ILoadableEntities,
	ILoadableEntity,
	ILoading,
	IState,
	loaded,
	loading
} from '@core/interfaces/state.interface';
import { IMerchant, IProduct } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import { LOAD_ECOMMERCE_PAGE_SHOP, LOAD_ECOMMERCE_PRODUCTS } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import {
	selectEcommerceCartInfo,
	selectEcommerceMerchant,
	selectEcommerceProducts,
	selectEcommerceUserLogin
} from '@ecommerce/state/ecommerce.selectors';

// * Util.
import { currency } from '@core/util/currency.pipe';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { LoadingComponent } from '@core/components/loading/loading.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-shop',
	standalone: true,
	imports: [ButtonComponent, LoadingComponent],
	templateUrl: './shop.component.html',
	styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
	public readonly currency = currency;
	public readonly loading: ILoading = loading;
	public readonly loaded: ILoading = loaded;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _ecommerce: EcommerceService = inject(EcommerceService);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly products: Signal<ILoadableEntities<ILoadableEntity<IProduct>>> =
		this._store.selectSignal(selectEcommerceProducts);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly merchant: Signal<ILoadableEntity<IMerchant>> = this._store.selectSignal(selectEcommerceMerchant);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly cart: Signal<{ id: number; count: number }> = this._store.selectSignal(selectEcommerceCartInfo);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly user: Signal<{ id: number; logged: boolean }> = this._store.selectSignal(selectEcommerceUserLogin);

	public ngOnInit(): void {
		if (this._core.state.ecommerce.invoice && this.products().status === this.loading) {
			this._store.dispatch(LOAD_ECOMMERCE_PRODUCTS({ merchant: this.merchant().data.id, page: 1 }));
		} else {
			const slug: string | undefined = this._ecommerce.slug();
			if (slug && this.products().status === this.loading)
				this._store.dispatch(LOAD_ECOMMERCE_PAGE_SHOP({ slug, page: 1 }));
		}
	}

	public open(dialog: string): void {
		this._core.open(dialog, { option: this.cart().count, logged: this.user().logged });
	}

	public redirect(route: string, id?: number | string): void {
		this._ecommerce.redirect(route, id);
	}

	public login(): void {
		this._core.redirect('auth');
	}

	public loadImage(value: HTMLDivElement, img: HTMLImageElement): void {
		img.style.display = 'block';
		value.style.background = 'none';
	}
}
