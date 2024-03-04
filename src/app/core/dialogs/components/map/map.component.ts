import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// * Maps.
import { GoogleMapsModule } from '@angular/google-maps';

interface IMap {
	center: { lat: number; lng: number };
	zoom: number;
	options: google.maps.MapOptions;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-dialog-content-map',
	standalone: true,
	imports: [GoogleMapsModule],
	templateUrl: './map.component.html',
	styleUrl: './map.component.scss'
})
export class MapComponent {
	@Input() public position: google.maps.LatLngLiteral = { lat: -31.68510778523696, lng: -60.78169027928104 };

	public config: IMap = {
		center: this.position,
		zoom: 17,
		options: {
			mapId: '2834c1be92998db5',
			disableDefaultUI: true,
			clickableIcons: true
		}
	};

	public marker: google.maps.LatLngLiteral = this.position;
}
