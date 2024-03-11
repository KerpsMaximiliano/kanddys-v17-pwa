import { AsyncPipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	Signal,
	ViewChild,
	inject
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, take } from 'rxjs';

// * ENV.
import { environment } from '@env/environment';

// * Maps.
import { GoogleMapsModule } from '@angular/google-maps';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
import { IState } from '@core/interfaces/state.interface';
interface IPrediction {
	description: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	place_id: string;
}

interface IMap {
	center: { lat: number; lng: number };
	zoom: number;
	options: google.maps.MapOptions;
}

// * Actions.
import { ADD_USER_ADDRESS } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceUserLogin } from '@ecommerce/state/ecommerce.selectors';

// * Forms.
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

// * Validators.
import { getErrorMessage, notOnlySpaces } from '@core/validators/character.validators';

// * Material.
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// * Shared.
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-dialog-content-maps',
	standalone: true,
	imports: [
		GoogleMapsModule,
		ReactiveFormsModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		MatInputModule,
		AsyncPipe,
		ButtonComponent
	],
	templateUrl: './maps.component.html',
	styleUrl: './maps.component.scss'
})
export class MapsComponent implements OnInit, OnDestroy {
	@ViewChild(MatAutocompleteTrigger) public trigger?: MatAutocompleteTrigger;
	@ViewChild('input') public input?: ElementRef<HTMLInputElement>;
	@ViewChild('markerElem') public markerElem?: ElementRef<HTMLInputElement>;

	public form: UntypedFormGroup = new UntypedFormGroup({ address: new UntypedFormControl(null, notOnlySpaces()) });

	public readonly getErrorMessage = getErrorMessage;

	public config: IMap = {
		center: { lat: 18.735693, lng: -70.162651 },
		zoom: 17,
		options: {
			mapId: environment.apiMap,
			disableDefaultUI: true,
			clickableIcons: true
		}
	};
	public autocompleteResults: BehaviorSubject<IPrediction[]> = new BehaviorSubject<IPrediction[]>([]);
	public currentPosition?: GeolocationPosition;

	public marker: google.maps.LatLngLiteral = {
		lat: 0,
		lng: 0
	};

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
	private readonly _ref: MatDialogRef<MapsComponent> = inject(MatDialogRef);
	private readonly _core: CoreService = inject(CoreService);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly user: Signal<{ id: number; logged: boolean }> = this._store.selectSignal(selectEcommerceUserLogin);

	public ngOnInit(): void {
		navigator.geolocation.getCurrentPosition((position) => {
			const currentPosition = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			this.config.center = currentPosition;
			this.currentPosition = position;
			this._marker(currentPosition);
			this.setAddress(currentPosition);
			this._cdr.markForCheck();
		});
	}

	public add(update: boolean): void {
		if (!this.form.get('address')?.value || this.marker.lat === 0 || this.marker.lng === 0) return;
		const address: string | undefined = this.form.get('address')?.value;
		if (address && this.marker.lat !== 0 && this.marker.lng !== 0) {
			this._ref.close();
			if (update && !this.user().logged) {
				this._core.redirect('auth');
				return;
			}
			this._store.dispatch(
				ADD_USER_ADDRESS({ lat: `${this.marker.lat}`, lng: `${this.marker.lng}`, direction: address, update })
			);
		}
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	public selectPlace(prediction: any): void {
		const geocoder = new google.maps.Geocoder();
		void geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
			if (status === google.maps.GeocoderStatus.OK && results) {
				this.config.center = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
				this._marker({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
			}
		});
	}

	public search(query: string): void {
		const autocompleteService = new google.maps.places.AutocompleteService();
		if (!query.trim()) {
			this.autocompleteResults.next([]);
			return;
		}
		let current: google.maps.LatLngLiteral | undefined = undefined;
		if (this.currentPosition) {
			current = {
				lat: this.currentPosition.coords.latitude,
				lng: this.currentPosition.coords.longitude
			};
		}
		let request: google.maps.places.AutocompletionRequest = { input: query };
		if (current) {
			request = {
				input: query,
				locationBias: {
					north: current.lat + 0.1,
					south: current.lat - 0.1,
					east: current.lng + 0.1,
					west: current.lng - 0.1
				}
			};
		}
		void autocompleteService.getPlacePredictions(request, (predictions, status) => {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				if (predictions) {
					this.autocompleteResults.next(predictions);
				}
			} else {
				console.error('Error fetching autocomplete predictions:', status);
				this.autocompleteResults.next([]);
			}
		});
	}

	public clear(): void {
		this.form.reset();
		this.autocompleteResults.next([]);
		this.marker = { lat: 0, lng: 0 };
	}

	// ! UNSUBSCRIBE.
	public selectFirst(): void {
		this.autocompleteResults.pipe(take(1)).subscribe((predictions: IPrediction[]) => {
			if (predictions.length > 0) {
				this.selectPlace(predictions[0]);
				if (this.trigger) this.trigger.closePanel();
				this.form.get('address')?.setValue(predictions[0].description);
			}
		});
	}

	public addMarker(event: google.maps.MapMouseEvent): void {
		if (event.latLng) {
			this.setAddress(event.latLng);
			this.marker = event.latLng.toJSON();
		}
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	public setAddress(cords: any): void {
		const geocoder = new google.maps.Geocoder();
		void geocoder.geocode({ location: cords }, (results, status) => {
			if (status === 'OK') {
				if (results) {
					const streetName =
						results[0].address_components.find((component) => component.types.includes('route'))?.short_name ?? '';
					const streetNumber =
						results[0].address_components.find((component) => component.types.includes('street_number'))?.short_name ??
						'';
					const city =
						results[0].address_components.find((component) => component.types.includes('locality'))?.short_name ?? '';
					const province =
						results[0].address_components.find((component) => component.types.includes('administrative_area_level_1'))
							?.short_name ?? '';

					let address = '';

					address += streetName || streetNumber ? streetName + (streetNumber ? ' ' + streetNumber : '') : '';
					address += city ? (address ? ', ' + city : city) : '';
					address += province ? ', ' + province : '';

					this.form.get('address')?.setValue(address);
				}
			}
		});
	}

	public ngOnDestroy(): void {
		this.autocompleteResults.unsubscribe();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	private _marker(cords: any): void {
		this.marker = cords;
		this._cdr.markForCheck();
	}
}
