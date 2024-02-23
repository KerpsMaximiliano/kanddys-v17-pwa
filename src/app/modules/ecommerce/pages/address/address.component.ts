import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-address',
	standalone: true,
	imports: [ButtonComponent],
	templateUrl: './address.component.html',
	styleUrl: './address.component.scss'
})
export class AddressComponent {
	private _core: CoreService = inject(CoreService);

	public back(): void {
		this._core.back();
	}
}
