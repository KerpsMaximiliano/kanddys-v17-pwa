import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
import { ILoading, IState, complete, loaded, loading } from '@core/interfaces/state.interface';
import { ICart } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import { LOAD_ECOMMERCE_CART, USER_LOGOUT } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceCart, selectEcommerceUserLogin } from '@ecommerce/state/ecommerce.selectors';

// * Util.
import { currency } from '@core/util/currency.pipe';

// * Material.
import { MatDialogRef } from '@angular/material/dialog';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { LoadingComponent } from '@core/components/loading/loading.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-dialog-content-cart',
	standalone: true,
	imports: [ButtonComponent, LoadingComponent],
	templateUrl: './cart.component.html',
	styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
	public readonly currency = currency;
	public readonly loading: ILoading = loading;
	public readonly complete: ILoading = complete;
	public login: boolean = true;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _ref: MatDialogRef<CartComponent> = inject(MatDialogRef);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly cart: Signal<ICart> = this._store.selectSignal(selectEcommerceCart);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly user: Signal<{ id: number; logged: boolean }> = this._store.selectSignal(selectEcommerceUserLogin);

	public ngOnInit(): void {
		if (this.cart().status === loaded) this._store.dispatch(LOAD_ECOMMERCE_CART({ order: this.cart().id }));
	}

	public redirect(route: string, id?: number | string): void {
		this._ref.close();
		switch (route) {
			case 'product':
				this._core.redirect(`${this.cart().slug}/product/`, id);
				break;
			case 'order':
				this._core.redirect(`${this.cart().slug}/order/`, this.cart().id);
				break;
			case 'shop':
				this._core.redirect(`${this.cart().slug}/shop`);
				break;
			case 'auth':
				this._core.redirect(route);
				break;
			default:
				break;
		}
	}

	public logout(): void {
		if (this.user().logged) {
			localStorage.removeItem('email');
			this._store.dispatch(USER_LOGOUT());
			switch (this.cart().count) {
				case 1:
					this._core.height = 354;
					break;
				case 2:
					this._core.height = 437;
					break;
				case 3:
					this._core.height = 521;
					break;
				case 4:
					this._core.height = 602;
					break;
				default:
					break;
			}
		}
	}
}
