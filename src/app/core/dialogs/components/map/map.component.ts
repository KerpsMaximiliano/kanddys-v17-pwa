import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';

// * ENV.
import { environment } from '@env/environment';

// * Maps.
import { GoogleMapsModule } from '@angular/google-maps';

// * Interfaces.
import { ILoading, IState, complete } from '@core/interfaces/state.interface';
interface IMap {
	center: { lat: number; lng: number };
	zoom: number;
	options: google.maps.MapOptions;
}

// * Selectors.
import { selectEcommerceInvoiceMap } from '@ecommerce/state/ecommerce.selectors';

// * Shared.
import { LoadingComponent } from '@core/components/loading/loading.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-dialog-content-map',
	standalone: true,
	imports: [GoogleMapsModule, LoadingComponent],
	templateUrl: './map.component.html',
	styleUrl: './map.component.scss'
})
export class MapComponent {
	public readonly complete = complete;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly address: Signal<{ status: ILoading; direction: string; lat: number; lng: number }> =
		this._store.selectSignal(selectEcommerceInvoiceMap);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public config: IMap = {
		center: { lat: this.address().lat, lng: this.address().lng },
		zoom: 17,
		options: {
			mapId: environment.mapId,
			disableDefaultUI: true,
			clickableIcons: true
		}
	};
}
