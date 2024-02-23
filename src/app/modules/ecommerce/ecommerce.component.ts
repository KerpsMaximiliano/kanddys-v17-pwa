import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

// * Services.
import { CoreService } from '@core/services/core.service';
import { EcommerceService } from './services/ecommerce.service';

// * Interfaces.
import { IState } from '@core/interfaces/state.interface';

// * Actions.
import { LOAD_ECOMMERCE_MERCHANT } from './state/ecommerce.actions';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce',
	standalone: true,
	imports: [RouterOutlet],
	template: '<router-outlet/>',
	providers: [EcommerceService]
})
export class EcommerceComponent implements OnInit {
	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _route: ActivatedRoute = inject(ActivatedRoute);
	private readonly _core: CoreService = inject(CoreService);

	public ngOnInit(): void {
		this._core.slug = this._route.snapshot.params['slug'];
		if (this._core.slug) this._store.dispatch(LOAD_ECOMMERCE_MERCHANT({ slug: this._core.slug }));
	}
}
