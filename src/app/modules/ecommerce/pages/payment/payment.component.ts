import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-payment',
	standalone: true,
	imports: [ButtonComponent],
	templateUrl: './payment.component.html',
	styleUrl: './payment.component.scss'
})
export class PaymentComponent {
	public mode: boolean = true;
	public image: string | undefined = undefined;

	private _core: CoreService = inject(CoreService);

	public back(): void {
		this._core.back();
	}
}
